const SYSTEM_PROMPT = `你是一个宠物预养评估助手。你的任务是用简体中文、口语化地分析用户是否适合养狗、适合哪类狗。

原则：
- 不给“合格证”或精确分数。
- 优先识别硬性限制、结构性风险和可调整问题。
- 输出必须基于用户数据，不要编造医疗或行为结论。
- 结论要具体：说明为什么、哪里有冲突、下一步验证什么。

返回 JSON，不要返回 Markdown：
{"text":"2-4句分析","risks":["..."],"actions":["..."]}`;

const NODE_PROMPTS = {
  profile: "分析用户当前生活档案中的结构风险与未知项，并说明哪些地方需要先核实。",
  recommend: "根据用户生活档案生成最多 3 个候选犬型照护画像，并给出档案结论。硬性限制未解决时返回空 candidates，结论必须先建议暂缓。",
  match: "根据用户档案和候选犬型画像，判断更优先了解的犬型，并解释冲突点和观察重点。",
  daily: "根据今天日期、照护任务和用户记录，给出当前优先处理事项，不要叠加新任务。",
  review: "分析第一周的重复负担模式，并判断是调整日程、增加支持还是更换候选犬型。",
  report: "生成一份证据化、克制、具体的适配结论，区分硬性条件、可改进项和需要真实接触验证的部分。",
};

const RECOMMEND_SYSTEM_PROMPT = `你是一个宠物预养评估助手。根据用户生活档案生成候选犬型和结论。

原则：
- 只生成“照护画像”，不要宣称具体品种或个体一定如此。
- 候选必须反映用户的时间、运动、预算、居住、同住者、过敏和耐心。
- 如果存在硬性限制，不要推荐候选，先建议解决限制。
- 结论克制、具体，不发合格证或精确分数。

只返回 JSON，不要 Markdown：
{"summary":"2-4句档案结论","candidates":[{"name":"候选名","age":"年龄阶段","archetype":"体型和性格画像","emoji":"🍂","activity":1,"training":1,"grooming":1,"independence":1,"monthlyCost":700,"idealTime":60,"description":"照护画像","aiProfile":"给其他分析节点使用的简短画像","why":"为什么适合这个档案","watchouts":["体验时要观察的点"]}]}`;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GLM_API_KEY || process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return { statusCode: 503, body: JSON.stringify({ error: "AI 服务未配置" }) };
  }
  try {
    const { node, payload } = JSON.parse(event.body || "{}");
    const task = NODE_PROMPTS[node];
    if (!task) {
      return { statusCode: 400, body: JSON.stringify({ error: "未知分析节点" }) };
    }
    const baseUrl = (process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: node === "recommend" ? RECOMMEND_SYSTEM_PROMPT : SYSTEM_PROMPT },
          { role: "user", content: `${task}\n\n节点：${node}\n数据：${JSON.stringify(payload)}` },
        ],
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: result.error?.message || "AI 调用失败" }) };
    }
    const content = result.choices?.[0]?.message?.content || "{}";
    const parsed = extractJson(content);
    if (node === "recommend") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node,
          text: parsed.summary || parsed.text || "暂时没有可用的档案结论",
          summary: parsed.summary || parsed.text || "",
          candidates: Array.isArray(parsed.candidates) ? parsed.candidates : [],
        }),
      };
    }
    const text = [parsed.text, parsed.risks?.length ? `风险：${parsed.risks.join("；")}` : "", parsed.actions?.length ? `下一步：${parsed.actions.join("；")}` : ""].filter(Boolean).join("\n");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node, text: text || parsed.text || "暂时没有可用的分析结果" }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "服务器错误" }) };
  }
}

function extractJson(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("模型返回内容不是有效 JSON");
    return JSON.parse(match[0]);
  }
}
