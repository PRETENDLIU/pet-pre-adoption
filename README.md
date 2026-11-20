# 预养计划 · 14 天狗狗适配模拟

一个手机优先的静态 H5 小游戏，用于帮助已经想养狗的人先完成一段有记录的“虚拟预养”，再判断自己适合进一步了解哪类狗。

## 核心流程

1. 填写 7 项生活档案：时间、运动、预算、住房、同住者、过敏和耐心。
2. 根据生活档案由 AI 生成候选犬型照护画像和档案结论。
3. 进行 14 天照护模拟：散步、喂食、训练、清洁、陪伴。
4. 在第 4、7、11、14 天遇到加班、复盘、出差和最终报告。
5. 生成基于自报记录的适配建议，而不是给一个看似精确的分数。

## 设计原则

- 不发“养宠合格证”，虚拟体验不能证明真实养育能力。
- 住房限制、同住者反对、严重过敏是硬性条件，不能被其他优势抵消。
- 自报数据、模拟任务和真实接触要分开解释。
- 最终建议连接具体狗狗的多次接触、健康检查和专业评估。

## 本地运行

直接打开 `index.html` 即可；如需测试 Service Worker，请运行：

```bash
npx serve .
```

## 线上地址

当前已发布到 Netlify：

https://bespoke-malasada-7ff200.netlify.app

## AI 分析

应用内置六个分析节点：生活档案、AI 候选生成、候选匹配、每日照护、中期复盘、最终报告。前端会把当前用户数据发给 `/api/ai`，由 Netlify Function 调用 OpenAI 兼容接口。

完成生活档案后，`recommend` 节点会根据时间、运动、预算、住房、同住者、过敏和耐心生成最多 3 个候选照护画像。AI 不可用时，应用回退到内置的悠悠、小栗、麦芽三个基础画像。

在 Netlify 环境变量中配置：

```env
AI_API_KEY=你的模型 Key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

也支持 GLM / Zhipu 这类 OpenAI 兼容接口。请把 `AI_BASE_URL` 和 `AI_MODEL` 改成你的平台实际提供值，例如：

```env
AI_API_KEY=你的 GLM Key
AI_BASE_URL=https://bigmodel.io/v1
AI_MODEL=glm-5.3
```

如果你的 Key 来自智谱国内平台，通常使用：

```env
AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
AI_MODEL=glm-5.3
```

请以你控制台里显示的接口地址和模型 ID 为准。

未配置 API Key 时，应用仍可运行，并自动退回到本地规则建议。

## Netlify 发布

项目是纯静态站，`netlify.toml` 已配置发布目录为当前目录。可在 Netlify 中连接 GitHub 仓库后自动部署，或使用：

```bash
npx netlify-cli deploy --prod --dir .
```

## 数据与隐私

所有记录仅保存在当前浏览器的 `localStorage` 中，不上传服务器。点击首页“清除本地记录”即可删除。
