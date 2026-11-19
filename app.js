const STORAGE_KEY = "pet-pre-adoption-v1";
const TOTAL_DAYS = 14;

const profileQuestions = [
  {
    key: "weekdayTime",
    title: "工作日每天能给狗多少稳定时间？",
    hint: "包括散步、喂食、清洁、训练和陪伴，不包含顺便看它一眼。",
    options: [
      { value: "30", label: "30 分钟以内", note: "适合低照护需求犬" },
      { value: "60", label: "30～60 分钟", note: "基本日常可安排" },
      { value: "120", label: "1～2 小时", note: "可承担中等需求" },
      { value: "180", label: "2 小时以上", note: "可考虑较高活动需求" },
    ],
  },
  {
    key: "activity",
    title: "你每周自己的运动习惯是？",
    hint: "狗的散步需求要能融入你的生活，而不是靠热情硬撑。",
    options: [
      { value: "1", label: "几乎不运动" },
      { value: "2", label: "偶尔散步" },
      { value: "3", label: "每周运动 2～3 次" },
      { value: "4", label: "经常运动或长距离步行" },
    ],
  },
  {
    key: "budget",
    title: "每月可稳定用于养狗的预算是？",
    hint: "只填不影响生活质量的可持续预算，不含突发医疗应急金。",
    options: [
      { value: "500", label: "500 元以内" },
      { value: "900", label: "500～900 元" },
      { value: "1600", label: "900～1600 元" },
      { value: "2500", label: "1600 元以上" },
    ],
  },
  {
    key: "housing",
    title: "你的居住条件允许养狗吗？",
    hint: "住房限制是硬性条件，不能用喜欢程度抵消。",
    options: [
      { value: "allowed", label: "允许养狗", note: "自有或长期稳定居住" },
      { value: "allowed-condition", label: "有条件允许", note: "需确认体型、数量或隔音" },
      { value: "not-allowed", label: "目前不允许", note: "房东/物业/家人限制" },
    ],
  },
  {
    key: "household",
    title: "同住者对养狗的态度是？",
    hint: "同住者明确反对或严重过敏时，需要先解决条件。",
    options: [
      { value: "agree", label: "都同意" },
      { value: "alone", label: "我一个人住" },
      { value: "uncertain", label: "有人还在犹豫" },
      { value: "object", label: "有人明确反对" },
    ],
  },
  {
    key: "allergy",
    title: "家里是否有人对狗或灰尘过敏？",
    options: [
      { value: "none", label: "没有" },
      { value: "mild", label: "轻微或不确定", note: "建议先做接触测试" },
      { value: "serious", label: "明确严重过敏" },
    ],
  },
  {
    key: "patience",
    title: "面对乱叫、拆家、随地排泄，你的耐心是？",
    hint: "这不是道德题，而是你能否承受重复训练和清理。",
    options: [
      { value: "1", label: "很难接受" },
      { value: "2", label: "能接受少量" },
      { value: "3", label: "愿意训练和清理" },
      { value: "4", label: "有经验，能稳定应对" },
    ],
  },
];

const candidates = [
  {
    id: "yoyo",
    name: "悠悠",
    age: "3 岁成年犬",
    archetype: "中小型 · 稳定陪伴型",
    emoji: "🍂",
    activity: 2,
    grooming: 1,
    training: 2,
    independence: 3,
    monthlyCost: 700,
    idealTime: 60,
    description: "活动量适中，已经过了幼犬最消耗人的阶段，适合第一次养狗但时间有限的人。",
  },
  {
    id: "xiaoli",
    name: "小栗",
    age: "2 岁青年犬",
    archetype: "中型 · 独立活跃型",
    emoji: "🌰",
    activity: 3,
    grooming: 3,
    training: 3,
    independence: 4,
    monthlyCost: 900,
    idealTime: 90,
    description: "更有个性和运动需求，掉毛与训练成本更高；适合作息稳定、愿意坚持规则的人。",
  },
  {
    id: "maiya",
    name: "麦芽",
    age: "1 岁大型幼犬",
    archetype: "大型 · 高投入成长型",
    emoji: "🌾",
    activity: 4,
    grooming: 2,
    training: 4,
    independence: 1,
    monthlyCost: 1600,
    idealTime: 150,
    description: "成长期投入最大，训练、社交、活动和经济成本都高；适合时间充裕且有支持系统的人。",
  },
];

const taskTypes = {
  walk: { icon: "🚶", name: "外出散步", why: "消耗精力、建立规律，也是你时间表的试金石。" },
  feed: { icon: "🍚", name: "喂食与换水", why: "固定时间比热情更重要。" },
  train: { icon: "🎾", name: "训练与玩耍", why: "测试你能否重复指导，而不是只陪玩。" },
  clean: { icon: "🧹", name: "清洁与环境", why: "掉毛、气味和意外排泄都要有人处理。" },
  company: { icon: "🫂", name: "安静陪伴", why: "狗需要持续在场，不是碎片化关注。" },
};

let state = createInitialState();

function createInitialState() {
  return {
    version: 1,
    screen: "intro",
    profileStep: 0,
    profile: {},
    dogId: null,
    tab: "home",
    day: 1,
    meters: { food: 70, activity: 70, happiness: 70, clean: 70 },
    logs: {},
    events: {},
  };
}

const view = document.getElementById("view");
const tabbar = document.getElementById("tabbar");
const headerMeta = document.getElementById("header-meta");
const modalBackdrop = document.getElementById("modal-backdrop");
const modal = document.getElementById("modal");
const toast = document.getElementById("toast");

init();

function init() {
  loadState();
  render();
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && parsed.version === 1) state = { ...createInitialState(), ...parsed };
  } catch (error) {
    state = createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  updateHeader();
  if (state.screen === "intro") {
    tabbar.hidden = true;
    view.innerHTML = renderIntro();
  } else if (state.screen === "profile") {
    tabbar.hidden = true;
    view.innerHTML = renderProfile();
  } else if (state.screen === "match") {
    tabbar.hidden = true;
    view.innerHTML = renderMatch();
  } else if (state.screen === "game") {
    tabbar.hidden = false;
    renderTabs();
    if (state.tab === "home") view.innerHTML = renderHome();
    if (state.tab === "today") view.innerHTML = renderToday();
    if (state.tab === "schedule") view.innerHTML = renderSchedule();
    if (state.tab === "report") view.innerHTML = renderReport();
  }
  view.scrollTop = 0;
  saveState();
}

function updateHeader() {
  if (state.screen === "game") headerMeta.textContent = `预养第 ${state.day} / ${TOTAL_DAYS} 天`;
  else if (state.screen === "match") headerMeta.textContent = "候选匹配";
  else if (state.screen === "profile") headerMeta.textContent = `生活档案 ${state.profileStep + 1}/${profileQuestions.length}`;
  else headerMeta.textContent = "14 天狗狗适配";
}

function renderTabs() {
  const tabs = [
    { id: "home", icon: "🏠", label: "房间" },
    { id: "today", icon: "📋", label: "今日" },
    { id: "schedule", icon: "🗓️", label: "日程" },
    { id: "report", icon: "🧭", label: "报告" },
  ];
  tabbar.innerHTML = tabs
    .map(
      (tab) => `<button class="tab-button ${state.tab === tab.id ? "active" : ""}" data-tab="${tab.id}">
        <span aria-hidden="true">${tab.icon}</span><span>${tab.label}</span>
      </button>`
    )
    .join("");
}

function renderIntro() {
  const hasSave = Boolean(state.dogId || Object.keys(state.profile).length);
  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Pre-Adopt Lab</p>
        <h1>先预养 14 天<br />再决定带谁回家</h1>
        <p class="lead">这不是养宠合格证。它帮你验证一件更具体的事：你的生活是否容得下一只狗，以及哪类狗值得进一步接触。</p>
      </div>
    </section>
    <section class="card">
      <h2>你会经历什么</h2>
      <div class="feature-grid">
        <div class="feature"><strong>生活档案</strong><span>时间、预算、住房、同住者和耐心</span></div>
        <div class="feature"><strong>候选犬型</strong><span>3 个可比较的照护画像</span></div>
        <div class="feature"><strong>每日照护</strong><span>散步、喂食、训练、清洁、陪伴</span></div>
        <div class="feature"><strong>适配报告</strong><span>只给证据和建议，不发分数</span></div>
      </div>
    </section>
    ${hasSave ? `<button class="button primary block" style="margin-top:16px" data-action="continue">继续预养</button>` : ""}
    <button class="button primary block" style="margin-top:${hasSave ? "10px" : "16px"}" data-action="start-profile">开始生活档案</button>
    <button class="button ghost block" style="margin-top:9px" data-action="reset">清除本地记录</button>
    <p class="footer-note">虚拟喂养能发现时间、预算和耐心上的冲突，但不能替代真实接触、健康检查和专业评估。</p>
  `;
}

function renderProfile() {
  const question = profileQuestions[state.profileStep];
  const selected = state.profile[question.key];
  return `
    <section class="card">
      <p class="eyebrow">Step ${state.profileStep + 1}</p>
      <h2 class="profile-question">${question.title}</h2>
      <p class="small">${question.hint || ""}</p>
      <div class="option-list">
        ${question.options
          .map(
            (option) => `<button class="option ${selected === option.value ? "selected" : ""}" data-profile="${question.key}" data-value="${option.value}">
              <span>${option.label}${option.note ? `<small>${option.note}</small>` : ""}</span>
              <span aria-hidden="true">${selected === option.value ? "✓" : ""}</span>
            </button>`
          )
          .join("")}
      </div>
    </section>
    <div class="task-actions">
      <button class="button ghost" data-action="profile-back" ${state.profileStep === 0 ? "disabled" : ""}>上一步</button>
      <button class="button primary" data-action="profile-next" ${selected ? "" : "disabled"}>${state.profileStep === profileQuestions.length - 1 ? "查看候选" : "下一步"}</button>
    </div>
    <p class="footer-note">请按当前真实生活填写，而不是按“如果养狗我会努力”填写。</p>
  `;
}

function hardBlockers() {
  const blockers = [];
  if (state.profile.housing === "not-allowed") blockers.push("目前居住条件不允许养狗。");
  if (state.profile.household === "object") blockers.push("同住者明确反对养狗。");
  if (state.profile.allergy === "serious") blockers.push("家里有明确严重过敏。");
  return blockers;
}

function matchCandidate(candidate) {
  const time = Number(state.profile.weekdayTime || 0);
  const activity = Number(state.profile.activity || 0);
  const budget = Number(state.profile.budget || 0);
  const patience = Number(state.profile.patience || 0);
  const timeFit = 1 - Math.min(1, Math.abs(time - candidate.idealTime) / 150);
  const activityFit = 1 - Math.min(1, Math.abs(activity - candidate.activity) / 3);
  const budgetFit = budget >= candidate.monthlyCost ? 1 : Math.max(0, budget / candidate.monthlyCost - 0.25);
  const trainingFit = 1 - Math.min(1, Math.abs(patience - candidate.training) / 3);
  const score = timeFit * 0.33 + activityFit * 0.22 + budgetFit * 0.25 + trainingFit * 0.2;
  return Math.max(1, Math.min(5, Math.round(score * 5)));
}

function candidateReasons(candidate) {
  const reasons = [];
  const time = Number(state.profile.weekdayTime || 0);
  const budget = Number(state.profile.budget || 0);
  if (time >= candidate.idealTime) reasons.push("你的时间预算能覆盖它的核心照护需求。");
  else reasons.push(`它需要约 ${candidate.idealTime} 分钟/天，高于你目前的稳定时间。`);
  if (budget >= candidate.monthlyCost) reasons.push("常规预算可持续。");
  else reasons.push("常规开销可能持续挤占你的预算。");
  if (candidate.training >= 4) reasons.push("幼犬期训练强度高，需要长期支持。");
  if (candidate.grooming >= 3) reasons.push("掉毛和清洁量较明显。");
  if (candidate.independence >= 3) reasons.push("独立性强，但仍需要清晰规则。");
  return reasons.slice(0, 3);
}

function renderMatch() {
  const blockers = hardBlockers();
  const ranked = [...candidates].sort((a, b) => matchCandidate(b) - matchCandidate(a));
  return `
    <section class="card flat dashed">
      <p class="eyebrow">Match</p>
      <h2>三个候选犬型</h2>
      <p class="small">候选是照护画像，不代表每只真实狗都一定如此。最终要看具体个体。</p>
    </section>
    ${blockers.length ? `<section class="card" style="border-color:var(--coral);background:#fff0eb">
      <h3>先解决硬性条件</h3>
      <ul class="evidence">${blockers.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p class="small" style="margin-top:9px">你仍可体验流程，但报告会建议暂缓养狗，直到这些问题解决。</p>
    </section>` : ""}
    ${ranked
      .map((candidate, index) => {
        const score = matchCandidate(candidate);
        return `<section class="card candidate ${index === 0 && !blockers.length ? "recommended" : ""}">
          <div class="row between">
            <div><h3>${candidate.emoji} ${candidate.name}</h3><p class="small">${candidate.age} · ${candidate.archetype}</p></div>
            <span class="pill">${index === 0 && !blockers.length ? "优先" : "候选"}</span>
          </div>
          <div class="match-score" aria-label="匹配度 ${score}/5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= score ? "on" : ""}"></i>`).join("")}</div>
          <p class="small">${candidate.description}</p>
          <div class="need-grid">
            <div class="need"><b>活动</b>${"●".repeat(candidate.activity)}${"○".repeat(4 - candidate.activity)}</div>
            <div class="need"><b>训练</b>${"●".repeat(candidate.training)}${"○".repeat(4 - candidate.training)}</div>
            <div class="need"><b>清洁</b>${"●".repeat(candidate.grooming)}${"○".repeat(4 - candidate.grooming)}</div>
            <div class="need"><b>月预算</b>约 ${candidate.monthlyCost} 元</div>
          </div>
          <ul class="evidence">${candidateReasons(candidate).map((reason) => `<li>${reason}</li>`).join("")}</ul>
          <button class="button teal block" style="margin-top:13px" data-select-dog="${candidate.id}">预养 ${candidate.name}</button>
        </section>`;
      })
      .join("")}
    <button class="button ghost block" style="margin-top:14px" data-action="restart-profile">重新填写档案</button>
  `;
}

function getDog() {
  return candidates.find((candidate) => candidate.id === state.dogId) || candidates[0];
}

function getDailyTasks() {
  const dog = getDog();
  const factor = dog.activity >= 4 ? 1.35 : dog.activity === 3 ? 1.15 : 1;
  const day = state.day;
  const tasks = [
    { id: "walk-am", type: "walk", planned: Math.round((18 + dog.activity * 7) * factor), title: "早上外出" },
    { id: "feed-am", type: "feed", planned: 10, title: "早餐与换水" },
    { id: "train", type: "train", planned: Math.round((10 + dog.training * 6) * factor), title: "训练与玩耍" },
    { id: "clean", type: "clean", planned: Math.round((10 + dog.grooming * 6) * factor), title: "清洁与梳毛" },
    { id: "company", type: "company", planned: 30 + dog.activity * 5, title: "安静陪伴" },
  ];
  if (day === 4) tasks.push({ id: "walk-pm", type: "walk", planned: Math.round(24 * factor), title: "加班后的晚间外出" });
  if (day === 11) tasks.push({ id: "care-plan", type: "company", planned: 20, title: "出差照护方案" });
  return tasks;
}

function currentLogs() {
  return state.logs[state.day] || {};
}

function taskStatus(taskId) {
  return currentLogs()[taskId]?.status || "todo";
}

function renderHome() {
  const dog = getDog();
  const logs = currentLogs();
  const tasks = getDailyTasks();
  const doneCount = Object.values(logs).filter((log) => log.status === "done").length;
  const mood = state.meters.food < 35 ? "hungry" : doneCount >= 3 ? "happy" : "";
  const bubble = state.meters.food < 35 ? "我有点饿了" : doneCount >= 3 ? "今天安排得不错" : `今天还有 ${tasks.length - doneCount} 项照护`;
  return `
    <section class="room">
      <div class="window" aria-hidden="true"></div>
      <div class="rug" aria-hidden="true"></div>
      <div class="plant" aria-hidden="true">🌿</div>
      <div class="dog-scene ${mood}" aria-label="${dog.name}的虚拟形象">
        <div class="dog-tail"></div>
        <div class="dog-body">
          <div class="dog-leg first"></div><div class="dog-leg second"></div>
          <div class="dog-leg third"></div><div class="dog-leg fourth"></div>
        </div>
        <div class="dog-head">
          <div class="dog-ear left"></div><div class="dog-ear right"></div>
          <div class="dog-eye left"></div><div class="dog-eye right"></div>
          <div class="dog-nose"></div><div class="dog-mouth"></div>
        </div>
        <div class="dog-bubble">${bubble}</div>
      </div>
    </section>
    <section class="card">
      <div class="row between">
        <div><h3>${dog.emoji} ${dog.name}</h3><p class="small">${dog.age} · ${dog.archetype}</p></div>
        <span class="pill ${doneCount >= tasks.length ? "good" : doneCount ? "" : "warn"}">${doneCount}/${tasks.length} 完成</span>
      </div>
      <div class="meter-grid" style="margin-top:13px">
        ${meter("饮食", state.meters.food)}
        ${meter("活动", state.meters.activity)}
        ${meter("心情", state.meters.happiness)}
        ${meter("环境", state.meters.clean)}
      </div>
    </section>
    <section class="card">
      <h3>快速照护</h3>
      <div class="quick-actions" style="margin-top:12px">
        <button class="quick-action" data-quick="feed"><span>🍚</span><span>喂食</span></button>
        <button class="quick-action" data-quick="walk"><span>🚶</span><span>散步</span></button>
        <button class="quick-action" data-quick="train"><span>🎾</span><span>训练</span></button>
        <button class="quick-action" data-quick="clean"><span>🧹</span><span>清洁</span></button>
      </div>
    </section>
    <button class="button primary block" style="margin-top:14px" data-action="go-today">查看今日照护</button>
    <p class="footer-note">这些指标只反映模拟过程，不等于真实狗的生理状态。</p>
  `;
}

function meter(label, value) {
  return `<div class="meter">
    <div class="meter-label"><span>${label}</span><span>${Math.round(value)}%</span></div>
    <div class="meter-bar"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>
  </div>`;
}

function renderToday() {
  const tasks = getDailyTasks();
  const logs = currentLogs();
  const done = tasks.filter((task) => taskStatus(task.id) === "done").length;
  return `
    <section class="card flat dashed">
      <p class="eyebrow">Day ${state.day}</p>
      <h2>今日照护</h2>
      <p class="small">完成任务时请记录真实用时和感受。自报数据不会被当成客观事实，只用于发现模式。</p>
      <div class="progress-track" style="margin-top:14px"><div class="progress-fill" style="width:${Math.round((done / tasks.length) * 100)}%"></div></div>
    </section>
    ${tasks.map((task) => renderTask(task, logs[task.id])).join("")}
    <div class="task-actions">
      <button class="button ghost" data-action="show-review">阶段复盘</button>
      <button class="button primary" data-action="finish-day">${state.day === TOTAL_DAYS ? "生成最终报告" : "结束今天"}</button>
    </div>
  `;
}

function renderTask(task, log) {
  const type = taskTypes[task.type];
  const status = log?.status || "todo";
  return `<article class="card task-card ${status}">
    <div class="row">
      <div class="task-icon" aria-hidden="true">${type.icon}</div>
      <div style="flex:1">
        <div class="row between"><h3>${task.title}</h3><span class="pill ${status === "done" ? "good" : status === "missed" ? "warn" : ""}">${statusText(status)}</span></div>
        <p class="small" style="margin:5px 0 0">预计 ${task.planned} 分钟 · ${type.why}</p>
      </div>
    </div>
    ${status === "todo" ? `<div class="task-actions"><button class="button teal" data-task="${task.id}">开始记录</button><button class="button ghost" data-miss="${task.id}">无法完成</button></div>` : `<p class="small" style="margin:10px 0 0">实际 ${log.minutes || 0} 分钟 · ${feelingText(log.feeling)}${log.note ? ` · ${escapeHtml(log.note)}` : ""}</p>`}
  </article>`;
}

function statusText(status) {
  return status === "done" ? "已完成" : status === "missed" ? "未完成" : "待安排";
}

function feelingText(feeling) {
  return { easy: "轻松", okay: "能接受", hard: "有点吃力", very_hard: "很吃力" }[feeling] || "未记录";
}

function renderSchedule() {
  const dog = getDog();
  return `
    <section class="card flat dashed">
      <p class="eyebrow">Plan</p>
      <h2>14 天预养节奏</h2>
      <p class="small">当前预养对象：${dog.name}。切换候选会重新开始，以避免把两种照护强度混在一起。</p>
    </section>
    <section class="card"><div class="timeline">${Array.from({ length: TOTAL_DAYS }, (_, index) => {
      const day = index + 1;
      const logs = state.logs[day] || {};
      const all = Object.keys(logs).length;
      return `<div class="timeline-day ${day === state.day ? "current" : ""}">
        <div class="day-number">${day}</div>
        <div><strong>${dayPhase(day)}</strong><p class="small" style="margin:2px 0 0">${dayNote(day)}</p></div>
        <span class="pill ${day < state.day ? "good" : ""}">${day < state.day ? `${all} 项记录` : day === state.day ? "进行中" : "待开始"}</span>
      </div>`;
    }).join("")}</div></section>
    <button class="button ghost block" style="margin-top:12px" data-action="back-home">回到房间</button>
  `;
}

function dayPhase(day) {
  if (day <= 1) return "建立日程";
  if (day <= 3) return "稳定日常";
  if (day <= 6) return "冲突测试";
  if (day === 7) return "中期复盘";
  if (day <= 10) return "调整验证";
  if (day <= 13) return "支持系统";
  return "最终报告";
}

function dayNote(day) {
  if (day === 4) return "加入加班后的晚间外出";
  if (day === 7) return "检查反复出现的负担";
  if (day === 11) return "安排出差时的替代照护";
  if (day === 14) return "生成证据化建议";
  return "照护、记录与调整";
}

function analysis() {
  const allLogs = Object.values(state.logs).flatMap((dayLogs) => Object.values(dayLogs));
  const done = allLogs.filter((log) => log.status === "done");
  const missed = allLogs.filter((log) => log.status === "missed");
  const hard = done.filter((log) => log.feeling === "hard" || log.feeling === "very_hard");
  const averageMinutes = done.length ? Math.round(done.reduce((sum, log) => sum + Number(log.minutes || 0), 0) / done.length) : 0;
  const blockers = hardBlockers();
  const dog = getDog();
  const best = [...candidates].sort((a, b) => matchCandidate(b) - matchCandidate(a))[0];
  const confidence = allLogs.length >= 10 && !blockers.length ? "中" : allLogs.length >= 6 ? "低到中" : "不足";
  return { allLogs, done, missed, hard, averageMinutes, blockers, dog, best, confidence };
}

function renderReport() {
  const result = analysis();
  const final = state.day >= TOTAL_DAYS;
  const recommendPause = result.blockers.length > 0;
  const changeCandidate = !recommendPause && result.best.id !== result.dog.id && (result.hard.length >= 3 || result.missed.length >= 4);
  return `
    <section class="card flat dashed">
      <p class="eyebrow">${final ? "Final Report" : "Live Report"}</p>
      <h2>${final ? "14 天适配结论" : "当前观察"}</h2>
      <p class="small">结论基于你的自报记录和模拟任务，不构成医疗、行为或领养审核意见。</p>
    </section>
    <section class="card">
      <span class="report-badge ${recommendPause ? "warn" : ""}">${recommendPause ? "建议暂缓" : changeCandidate ? "建议换犬型" : "值得进一步接触"}</span>
      <p class="lead">${reportHeadline(result, recommendPause, changeCandidate)}</p>
      <ul class="evidence" style="margin-top:13px">
        <li>已记录 ${result.allLogs.length} 项，完成 ${result.done.length} 项，未完成 ${result.missed.length} 项。</li>
        <li>完成项平均用时约 ${result.averageMinutes} 分钟。</li>
        <li>感到吃力或很吃力的记录有 ${result.hard.length} 项。</li>
        <li>数据置信度：${result.confidence}。</li>
      </ul>
    </section>
    ${result.blockers.length ? `<section class="card"><h3>必须先解决</h3><ul class="evidence">${result.blockers.map((item) => `<li>${item}</li>`).join("")}</ul></section>` : ""}
    <section class="card">
      <h3>建议</h3>
      <ul class="evidence">${reportAdvice(result, recommendPause, changeCandidate).map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>
    <section class="card dashed flat">
      <h3>下一步</h3>
      <ul class="evidence">
        <li>把报告中的冲突项改写成可执行计划。</li>
        <li>与具体狗狗至少接触 3 次，观察真实行为和相处感受。</li>
        <li>在正式决定前咨询兽医或正规机构，确认健康与照护需求。</li>
      </ul>
    </section>
    ${final ? `<button class="button ghost block" style="margin-top:12px" data-action="restart-profile">重新评估</button>` : `<button class="button primary block" style="margin-top:12px" data-action="go-today">继续今日任务</button>`}
  `;
}

function reportHeadline(result, pause, change) {
  if (pause) return "先不要急于养狗。硬性条件未满足时，虚拟体验只能帮助你理解照护成本，不能改变居住或家庭限制。";
  if (change) return `${result.best.name} 的照护画像可能比当前候选更贴合你的生活。建议重新评估，而不是用意志力硬撑。`;
  if (result.hard.length >= 5) return "你完成了不少任务，但反复感到吃力。这个信号值得认真处理，而不是被喜欢盖过去。";
  return `${result.dog.name} 值得进一步了解，但还要通过真实接触验证个体差异。`;
}

function reportAdvice(result, pause, change) {
  if (pause) return result.blockers.concat(["条件解决后，再重新做一次 14 天记录。"]);
  const advice = [];
  if (change) advice.push(`优先了解 ${result.best.name} 类型：${result.best.archetype}。`);
  if (result.missed.length >= 3) advice.push("连续未完成的任务集中在固定时段时，先调整日程或安排可靠帮手。");
  if (result.hard.length >= 3) advice.push("把“有点吃力”的具体原因写进计划：时间、体力、情绪还是费用。");
  if (result.averageMinutes > Number(state.profile.weekdayTime || 0)) advice.push("实际用时高于你的时间预算，需要压缩照护强度或寻求支持。");
  advice.push("准备至少 3 个月应急医疗预算，并确认可就诊的动物医院。");
  return advice;
}

function startGame(dogId) {
  state.dogId = dogId;
  state.screen = "game";
  state.tab = "home";
  state.day = 1;
  state.meters = { food: 70, activity: 70, happiness: 70, clean: 70 };
  state.logs = {};
  state.events = {};
  render();
  showToast(`开始预养 ${getDog().name}`);
}

function openTaskModal(taskId, missed = false) {
  const task = getDailyTasks().find((item) => item.id === taskId);
  if (!task) return;
  const type = taskTypes[task.type];
  openModal(`
    <p class="eyebrow">${type.name}</p>
    <h3 id="modal-title">${task.title}</h3>
    <p class="small">${missed ? "记录这次无法完成的原因。遗漏本身不是失败，重复出现才是需要处理的问题。" : `预计 ${task.planned} 分钟。请完成或模拟真实安排后回来记录。`}</p>
    ${missed ? "" : `<div class="field"><label for="minutes">实际用时（分钟）</label><input id="minutes" type="number" inputmode="numeric" min="0" max="240" value="${task.planned}" /></div>
    <div class="field"><label>感受</label><div class="choice-row">
      ${[["easy", "轻松"], ["okay", "可以"], ["hard", "吃力"], ["very_hard", "很累"]].map(([value, label], index) => `<button class="choice ${index === 1 ? "selected" : ""}" data-feeling="${value}">${label}</button>`).join("")}
    </div></div>`}
    <div class="field"><label for="note">发生了什么？（可选）</label><textarea id="note" placeholder="例如：加班到九点，外出比预计晚了 40 分钟"></textarea></div>
    <div class="modal-actions"><button class="button ghost" data-action="close-modal">取消</button><button class="button primary" data-save-task="${task.id}">${missed ? "记录未完成" : "保存记录"}</button></div>
  `);
  modal.dataset.taskId = task.id;
  modal.dataset.feeling = missed ? "very_hard" : "okay";
  if (missed) modal.dataset.missed = "true";
  else delete modal.dataset.missed;
}

function saveTask(taskId, missed = false) {
  const task = getDailyTasks().find((item) => item.id === taskId);
  if (!task) return;
  const finalMissed = missed || modal.dataset.missed === "true";
  const minutes = finalMissed ? 0 : Number(document.getElementById("minutes")?.value || task.planned);
  const feeling = modal.dataset.feeling || "okay";
  const note = document.getElementById("note")?.value.trim() || "";
  if (!state.logs[state.day]) state.logs[state.day] = {};
  state.logs[state.day][taskId] = { status: finalMissed ? "missed" : "done", minutes, feeling: finalMissed ? "very_hard" : feeling, note, at: Date.now() };
  if (!finalMissed) applyTaskEffect(task.type);
  closeModal();
  render();
  showToast(finalMissed ? "已记录未完成，这不代表失败" : "已记录照护");
}

function applyTaskEffect(type) {
  if (type === "feed") state.meters.food = clamp(state.meters.food + 25);
  if (type === "walk") {
    state.meters.activity = clamp(state.meters.activity + 28);
    state.meters.happiness = clamp(state.meters.happiness + 12);
  }
  if (type === "train") {
    state.meters.happiness = clamp(state.meters.happiness + 20);
    state.meters.activity = clamp(state.meters.activity + 8);
  }
  if (type === "clean") state.meters.clean = clamp(state.meters.clean + 30);
  if (type === "company") state.meters.happiness = clamp(state.meters.happiness + 25);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function finishDay() {
  const tasks = getDailyTasks();
  const unresolved = tasks.filter((task) => taskStatus(task.id) === "todo").length;
  if (unresolved > 0) {
    openModal(`
      <p class="eyebrow">Check</p>
      <h3 id="modal-title">还有 ${unresolved} 项未记录</h3>
      <p class="small">真实生活里会有遗漏。你可以把它们记为无法完成，也可以直接结束今天；报告会如实呈现。</p>
      <div class="modal-actions"><button class="button ghost" data-action="close-modal">回去记录</button><button class="button primary" data-action="force-finish">直接结束</button></div>
    `);
    return;
  }
  if (state.day === 7) {
    showReview(true);
    return;
  }
  advanceDay();
}

function advanceDay() {
  closeModal();
  if (state.day < TOTAL_DAYS) {
    state.day += 1;
    decayMeters();
    render();
    if (state.day === 4) showConflictEvent();
    if (state.day === 11) showTripEvent();
  } else {
    state.tab = "report";
    render();
    showToast("最终报告已生成");
  }
}

function decayMeters() {
  state.meters.food = clamp(state.meters.food - 18);
  state.meters.activity = clamp(state.meters.activity - 12);
  state.meters.happiness = clamp(state.meters.happiness - 10);
  state.meters.clean = clamp(state.meters.clean - 9);
}

function showReview(advanceAfterClose = false) {
  const result = analysis();
  openModal(`
    <p class="eyebrow">Day 7 Review</p>
    <h3 id="modal-title">第一周复盘</h3>
    <p class="small">这一步不是打分，而是找重复出现的问题。</p>
    <ul class="evidence" style="margin-top:12px">
      <li>完成 ${result.done.length} 项，未完成 ${result.missed.length} 项。</li>
      <li>吃力记录 ${result.hard.length} 项。</li>
      <li>${result.hard.length >= 3 ? "负担已经形成模式，请优先调整时间或照护强度。" : "目前负担还可控，继续观察第二周。"}</li>
    </ul>
    <button class="button primary block" style="margin-top:16px" data-action="${advanceAfterClose ? "review-continue" : "close-modal"}">${advanceAfterClose ? "继续第二周" : "关闭复盘"}</button>
  `);
}

function showConflictEvent() {
  if (state.events.conflict) return;
  state.events.conflict = true;
  openModal(`
    <p class="eyebrow">Situation</p>
    <h3 id="modal-title">加班到九点</h3>
    <p class="small">${getDog().name} 仍在等待晚间外出。你会怎么处理？</p>
    <div class="stack" style="margin-top:14px">
      <button class="button block" data-event="adjust">调整时间，晚一点短距离外出</button>
      <button class="button block" data-event="helper">联系可靠帮手代遛</button>
      <button class="button block" data-event="skip">今天取消，明天再恢复</button>
    </div>
  `);
}

function showTripEvent() {
  if (state.events.trip) return;
  state.events.trip = true;
  openModal(`
    <p class="eyebrow">Situation</p>
    <h3 id="modal-title">未来三天出差</h3>
    <p class="small">请选择一个当前真的可执行的方案。</p>
    <div class="stack" style="margin-top:14px">
      <button class="button block" data-event="boarding">已确认寄养机构与费用</button>
      <button class="button block" data-event="friend">朋友可以上门照顾</button>
      <button class="button block" data-event="none">还没有安排</button>
    </div>
  `);
}

function recordEvent(choice) {
  state.events[choice] = true;
  closeModal();
  render();
  showToast("情境已记录");
}

function openModal(html) {
  modal.innerHTML = html;
  modalBackdrop.hidden = false;
  const focusTarget = modal.querySelector("button, input, textarea, select");
  if (focusTarget) focusTarget.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  modal.innerHTML = "";
  delete modal.dataset.taskId;
  delete modal.dataset.feeling;
  delete modal.dataset.missed;
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.tab) {
    state.tab = target.dataset.tab;
    render();
    return;
  }
  if (target.dataset.action === "start-profile" || target.dataset.action === "restart-profile") {
    state.screen = "profile";
    state.profileStep = 0;
    state.profile = {};
    render();
    return;
  }
  if (target.dataset.action === "continue") {
    if (state.dogId) state.screen = "game";
    else if (Object.keys(state.profile).length) state.screen = "profile";
    render();
    return;
  }
  if (target.dataset.action === "reset") {
    localStorage.removeItem(STORAGE_KEY);
    state = createInitialState();
    render();
    showToast("已清除本地记录");
    return;
  }
  if (target.dataset.action === "profile-back") {
    if (state.profileStep > 0) state.profileStep -= 1;
    render();
    return;
  }
  if (target.dataset.action === "profile-next") {
    if (state.profileStep < profileQuestions.length - 1) state.profileStep += 1;
    else state.screen = "match";
    render();
    return;
  }
  if (target.dataset.profile) {
    state.profile[target.dataset.profile] = target.dataset.value;
    render();
    return;
  }
  if (target.dataset.selectDog) {
    startGame(target.dataset.selectDog);
    return;
  }
  if (target.dataset.quick) {
    const task = getDailyTasks().find((item) => item.type === target.dataset.quick && taskStatus(item.id) === "todo");
    if (task) openTaskModal(task.id);
    else showToast("这类照护今天已经记录过");
    return;
  }
  if (target.dataset.task || target.dataset.miss) {
    openTaskModal(target.dataset.task || target.dataset.miss, Boolean(target.dataset.miss));
    return;
  }
  if (target.dataset.saveTask) {
    saveTask(target.dataset.saveTask, false);
    return;
  }
  if (target.dataset.feeling) {
    modal.dataset.feeling = target.dataset.feeling;
    modal.querySelectorAll(".choice").forEach((button) => button.classList.toggle("selected", button === target));
    return;
  }
  if (target.dataset.event) {
    recordEvent(target.dataset.event);
    return;
  }
  if (target.dataset.action === "close-modal") {
    closeModal();
    return;
  }
  if (target.dataset.action === "go-today") {
    state.tab = "today";
    render();
    return;
  }
  if (target.dataset.action === "back-home") {
    state.tab = "home";
    render();
    return;
  }
  if (target.dataset.action === "show-review") {
    showReview(false);
    return;
  }
  if (target.dataset.action === "review-continue") {
    advanceDay();
    return;
  }
  if (target.dataset.action === "finish-day") {
    finishDay();
    return;
  }
  if (target.dataset.action === "force-finish") {
    advanceDay();
    return;
  }
});
