/* ============ 高考备考助手 · 交互逻辑 ============ */
'use strict';

/* ---------- 工具 ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function svgEl(tag, attrs){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for(const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function confetti(){
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4'];
  for(let i=0;i<70;i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDuration = (1.6 + Math.random()*1.6) + 's';
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    c.style.width = (6 + Math.random()*7) + 'px';
    c.style.height = (10 + Math.random()*8) + 'px';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 3400);
  }
}

/* ---------- 静态数据 ---------- */
const SUBJECTS = [
  {name:'语文', emoji:'📖', pct:0, color:'#ef4444'},
  {name:'数学', emoji:'📐', pct:0, color:'#6366f1'},
  {name:'英语', emoji:'🔤', pct:0, color:'#10b981'},
  {name:'历史', emoji:'📜', pct:0, color:'#d97706'},
  {name:'政治', emoji:'🏛️', pct:0, color:'#0891b2'},
  {name:'地理', emoji:'🌏', pct:0, color:'#7c3aed'},
];

let tasks = [];

const BADGES = [
  {emoji:'🔥', name:'连续打卡',  sub:'连学 12 天',   locked:true},
  {emoji:'📐', name:'数学新星',  sub:'正确率 85%',   locked:true},
  {emoji:'🧠', name:'单词达人',  sub:'词汇 5000+',   locked:true},
  {emoji:'⏱️', name:'时间管理',  sub:'专注 25h/周',  locked:true},
  {emoji:'🚀', name:'进阶学霸',  sub:'本周 21 星',   locked:true},
  {emoji:'🌱', name:'早起打卡',  sub:'7:00 前学习',  locked:true},
  {emoji:'📚', name:'书山有路',  sub:'累计 50h',     locked:true},
  {emoji:'🧪', name:'实验达人',  sub:'物理实验全对', locked:true},
  {emoji:'🎯', name:'精准答题',  sub:'正确率 90%+',  locked:true},
  {emoji:'🦉', name:'夜猫学霸',  sub:'22:00 后学习', locked:true},
  {emoji:'🏆', name:'周榜前三',  sub:'本周第 8',     locked:true},
  {emoji:'💯', name:'满分学霸',  sub:'单科 100',     locked:true},
  {emoji:'👑', name:'学神降临',  sub:'月考年级前 10',locked:true},
  {emoji:'🧭', name:'全科高手',  sub:'六科全绿',     locked:true},
  {emoji:'🗡️', name:'通关勇者',  sub:'闯关 100 关',  locked:true},
  {emoji:'🌈', name:'全勤之星',  sub:'整月无缺席',   locked:true},
];

const PLAN = [
  {tasks:[]},{tasks:[]},{tasks:[]},{tasks:[]},{tasks:[]},{tasks:[]},{tasks:[]},
];

const MAPS = {
  math: [
    {name:'集合与逻辑', emoji:'🧮', pct:0},{name:'函数与导数', emoji:'📈', pct:0},
    {name:'三角函数',   emoji:'📐', pct:0},{name:'数列',       emoji:'🔢', pct:0},
    {name:'不等式',     emoji:'⚖️', pct:0},{name:'立体几何',   emoji:'🧊', pct:0},
    {name:'解析几何',   emoji:'🎯', pct:0},{name:'统计与概率', emoji:'🎲', pct:0},
    {name:'平面向量',   emoji:'➡️', pct:0},{name:'复数',       emoji:'🌀', pct:0},
    {name:'导数压轴应用',emoji:'📉', pct:0},{name:'圆锥曲线综合',emoji:'🛰️', pct:0},
  ],
  history: [
    {name:'古代史·中央集权', emoji:'🏯', pct:0},{name:'古代史·经济文化', emoji:'🌾', pct:0},
    {name:'近代史·列强侵华', emoji:'⚔️', pct:0},{name:'近代史·近代化',   emoji:'🚂', pct:0},
    {name:'世界史·希腊罗马', emoji:'🏛️', pct:0},{name:'世界近代史·革命', emoji:'🗽', pct:0},
    {name:'现代史·世界大战', emoji:'🎖️', pct:0},{name:'史料实证·素养',   emoji:'📜', pct:0},
    {name:'阶段特征·时间轴', emoji:'🗓️', pct:0},{name:'论述题·答题模板', emoji:'✍️', pct:0},
    {name:'现代史·冷战格局', emoji:'🧊', pct:0},{name:'材料题·概括分析', emoji:'📝', pct:0},
  ],
  politics: [
    {name:'商品与货币',     emoji:'💰', pct:0},{name:'价格与消费',     emoji:'🛒', pct:0},
    {name:'企业与劳动者',   emoji:'🏭', pct:0},{name:'市场经济',       emoji:'⚖️', pct:0},
    {name:'公民与政府',     emoji:'🏛️', pct:0},{name:'民主制度',       emoji:'🗳️', pct:0},
    {name:'文化传承',       emoji:'🎭', pct:0},{name:'唯物论与辩证法', emoji:'🔮', pct:0},
    {name:'认识论',         emoji:'🧠', pct:0},{name:'时政素材积累',   emoji:'📰', pct:0},
    {name:'经济全球化',     emoji:'🌐', pct:0},{name:'价值与人生',     emoji:'⚖️', pct:0},
  ],
  geography: [
    {name:'地球运动',       emoji:'🌍', pct:0},{name:'大气环流',       emoji:'🌪️', pct:0},
    {name:'水循环',         emoji:'💧', pct:0},{name:'地表形态',       emoji:'⛰️', pct:0},
    {name:'人口与城市',     emoji:'🏙️', pct:0},{name:'农业与工业',     emoji:'🌾', pct:0},
    {name:'交通与商业',     emoji:'🚄', pct:0},{name:'中国地理',       emoji:'🗺️', pct:0},
    {name:'世界地理',       emoji:'🌐', pct:0},{name:'读图与区位分析', emoji:'🧭', pct:0},
    {name:'等值线判读',     emoji:'🗾', pct:0},{name:'综合题·答题规范', emoji:'📏', pct:0},
  ],
};

const QUESTS = [
  {emoji:'📖', name:'晨读打卡 · 文言文',        meta:'每天 7:00 前完成 · 语文', stars:3, done:false},
  {emoji:'🔤', name:'单词闯关 · 30 词',         meta:'限时 10 分钟 · 英语',     stars:2, done:false},
  {emoji:'🧮', name:'数学小题限时赛',            meta:'15 题 / 15 分钟',         stars:3, done:false},
  {emoji:'📜', name:'历史大事年表挑战',          meta:'50 个事件排序',           stars:2, done:false},
  {emoji:'📝', name:'历史论述题限时写',          meta:'500 字 / 15 分钟',        stars:3, done:false},
  {emoji:'🎼', name:'长笛曲目背奏打卡',          meta:'每日练笛 30 分钟',        stars:2, done:false},
  {emoji:'🏛️', name:'政治原理默写擂台',          meta:'30 个原理',               stars:1, done:false},
  {emoji:'🗺️', name:'地理图表判读挑战',          meta:'20 幅地图',               stars:2, done:false},
];

const LEADERBOARD = [];

const RANKS = [
  {name:'青铜', emoji:'🥉', min:0},
  {name:'白银', emoji:'🥈', min:1500},
  {name:'黄金', emoji:'🥇', min:3500},
  {name:'铂金', emoji:'🎖️', min:6000},
  {name:'钻石', emoji:'💎', min:9000},
  {name:'王者', emoji:'👑', min:13000},
];

const PET = {
  level:1, xp:0, xpMax:400, moodIdx:0,
  moods:['😄 今天心情很好，夸你专注！','😋 吃得饱饱的，充满能量！','🥰 最喜欢和你一起学习了','😴 有点困，喂点东西就精神啦','🤩 哇，你进步好快！'],
  log:'小火龙摇了摇尾巴，等你带它学习～',
};

const DAILY_QS = [
  {subject:'数学', tag:'每日一题 · 导数压轴', text:'已知 f(x)=x³−3x²+a，若 f(x) 在 [0,2] 上的最大值为 5，则 a=？',
   options:[{k:'A',v:'3'},{k:'B',v:'4'},{k:'C',v:'5'},{k:'D',v:'6'}], answer:'C',
   explain:"f'(x)=3x(x−2)，在 [0,2] 上最大值在端点 x=0 处取得：f(0)=a=5，故选 C。"},
  {subject:'数学', tag:'每日一题 · 数列综合', text:'等差数列 {aₙ} 中，a₁=2，a₅=14，则 a₆=？',
   options:[{k:'A',v:'16'},{k:'B',v:'17'},{k:'C',v:'18'},{k:'D',v:'19'}], answer:'B',
   explain:'公差 d=(14−2)/4=3，a₆=a₁+5d=2+15=17，故选 B。'},
  {subject:'数学', tag:'每日一题 · 三角函数', text:'函数 y=2sin(2x+π/3) 的最小正周期是？',
   options:[{k:'A',v:'π'},{k:'B',v:'2π'},{k:'C',v:'π/2'},{k:'D',v:'4π'}], answer:'A',
   explain:'T=2π/|ω|=2π/2=π，故选 A。'},
];

const RECORDS = [];

const TIMELINE = [];

const DIMS = [
  {name:'任务完成度', val:0, color:'#6366f1'},
  {name:'练习正确率', val:0, color:'#10b981'},
  {name:'学习坚持度', val:0, color:'#f59e0b'},
  {name:'专注度',     val:0, color:'#06b6d4'},
  {name:'学习效率',   val:0, color:'#ec4899'},
];

const DURATION = [0, 0, 0, 0, 0, 0, 0];
const DUR_LABELS = ['8/10 周一','8/11 周二','8/12 周三','8/13 周四','8/14 周五','8/15 周六','8/16 周日'];
const PIE = [
  {name:'数学', min:0, color:'#6366f1'},
  {name:'语文', min:0, color:'#ef4444'},
  {name:'历史', min:0, color:'#d97706'},
  {name:'英语', min:0, color:'#10b981'},
  {name:'政治', min:0, color:'#0891b2'},
  {name:'地理', min:0, color:'#7c3aed'},
];
const TREND = [0, 0, 0, 0, 0, 0, 0, 0];
const TREND_LABELS = ['W1','W2','W3','W4','W5','W6','W7','W8'];

const AI_RULES = [
  {re:/计划/, reply:'好的，小宇！给你一份明天的建议计划：\n🌅 晨间 6:40–7:10｜英语单词 30 个 + 语文文言文朗读\n📐 上午 9:00–10:00｜数学函数专题 + 错题订正\n🧪 下午 14:00–15:00｜化学方程式默写 20 个\n🏃 傍晚运动 20 分钟，19:30–21:00 完成当日任务\n需要我帮你写进任务列表吗？'},
  {re:/错题|总是错|反复/, reply:'反复错通常是「只订正、不归因」。试试三步法：\n1️⃣ 按「概念不清 / 计算失误 / 审题偏差」给错题分类；\n2️⃣ 每道题写下 1 句错因 + 1 句下次提醒；\n3️⃣ 3 天后不看答案重做一遍。坚持两周，同类错误会明显减少 💪'},
  {re:/学不进去|状态|分心|烦躁/, reply:'学不进去很正常，先别自责～试试「5 分钟启动法」：\n⏱️ 只告诉自己「先学 5 分钟」，手机放远、环境安静；\n📖 从最喜欢的科目或最简单的任务开始；\n🧘 还烦躁就站起来伸个懒腰、喝口水，再来一轮。\n你今天已经完成 3 个任务了，非常棒！'},
  {re:/历史|政治|地理|文科/, reply:'文科提分建议：\n🏯 历史：按「时间轴 + 阶段特征」背，大事年表自己默画一遍印象最深；大题用「史实 + 分析 + 结论」结构；\n🏛️ 政治：原理必须原文准确，大题套「原理 + 材料对应 + 总结」模板，时政素材每周整理 5 条；\n🗺️ 地理：自然地理重原理推导，人文地理重区位分析，每天精读 1 幅图（等值线、气候图）。\n你的历史掌握度 84%，基础不错，优先补「地理读图」和「历史论述题」这两块短板！'},
  {re:/数学|导数|函数/, reply:'数学提分建议：\n1. 先抓「必考中档题」——三角、数列、概率统计，性价比最高；\n2. 每天限时 20 分钟练 15 道小题，训练速度与准确率；\n3. 压轴题第 1 问必须拿分，第 2 问写出思路也有步骤分。\n你的三角函数掌握度 81%，已经不错，继续保持！'},
  {re:/英语|单词/, reply:'英语冲刺建议：\n🔤 单词按「艾宾浩斯」节奏：早上背 + 睡前复习 + 3 天后复查；\n🎧 听力每天 15 分钟真题精听，先听写再对照；\n✍️ 作文背 8–10 个高级句型，每周写 1 篇请老师批改。\n你的英语掌握度 88%，全班前列，冲 130+ 很有希望！'},
  {re:/加油|谢谢|晚安/, reply:'不客气！你今天已经做得很棒了，早睡才能让大脑更好地巩固记忆哦。明天继续加油，我会一直陪着你 🌟'},
];

/* ---------- 状态 ---------- */
const state = {
  role:'student',
  weekOffset:0,
  mapSubject:'math',
  timer:{running:false, remaining:25*60, total:25*60, interval:null},
  xp: 0, xpMax: 4000, level: 1,
  contentFilter: 'all',
  rankXp: 0, coins: 0, combo: 0, forest: 0, chestOpened: false,
  todayFocusMin: 0, xpGained: 0, coinsEarned: 0, bossKilled: 0, petPlays: 0, pkWins: 0,
  streakDays: 0, weekPoints: 0,
  sound: true, music: false, title: '早读战神',
  dungeon: { idx: 0, hp: 1500, defeated: false, log: [] },
  dqIdx: 0, histQIdx: 0, musicQIdx: 0,
  musicStreak: 0, musicPunchDone: false, musicDone: {},
  repFilter: 'all', repDone: {},
  wrongBank: [], wrongMax: 0,
  paper: { phase:'intro', qs:[], qi:0, correct:0, review:[] },
};

/* 日期集中配置（高考 / 省统考 年份统一在这里改） */
const CONFIG = {
  gaokaoDate: '2028-06-07T09:00:00+08:00',
  artExamDate: '2027-12-15T09:00:00+08:00',
};

/* ============ 初始化 ============ */
document.addEventListener('DOMContentLoaded', () => {
  // 番茄钟渐变
  const timerSvg = $('.timer-ring').closest('svg');
  const defs = svgEl('defs', {});
  const grad = svgEl('linearGradient', {id:'ringGrad', x1:'0%', y1:'0%', x2:'100%', y2:'100%'});
  grad.append(svgEl('stop', {offset:'0%', 'stop-color':'#6366f1'}));
  grad.append(svgEl('stop', {offset:'100%', 'stop-color':'#ec4899'}));
  defs.append(grad); timerSvg.prepend(defs);

  renderStatic();
  renderTasks();
  renderPlan();
  renderMap();
  renderQuest();
  renderLeaderboard();
  renderDailyQ();
  renderBadges();
  renderSubjectBars();
  renderTimeline();
  renderRank();
  renderPet();
  renderCombo();
  renderForest();
  renderTitleWall();
  renderReportPreview();
  renderDungeon();
  renderPK();
  renderFlashcards();
  renderTimelineGame();
  renderHistoryQ();
  renderMusicPlan();
  renderMusicQ();
  renderRepertoire();
  renderTheoryPaper();
  renderWrongBoss();
  renderTable();
  renderDims();
  renderGreet();
  startClock();
  bindEvents();
});

function startClock(){
  const now = new Date();
  const week = ['日','一','二','三','四','五','六'][now.getDay()];
  $('#todayChip').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 周${week}`;
  // 高考倒计时：2028-06-07
  const target = new Date(CONFIG.gaokaoDate);
  const days = Math.max(0, Math.ceil((target - now) / 86400000));
  $('#countdown').textContent = days;
}

function renderGreet(){
  const h = new Date().getHours();
  const g = h<6 ? '夜深了' : h<9 ? '早上好' : h<12 ? '上午好' : h<14 ? '中午好' : h<18 ? '下午好' : '晚上好';
  $('#greetText').textContent = `👋 ${g}，小宇！`;
}

function renderStatic(){
  $('#levelNum').textContent = state.level;
  $('#xpNow').textContent = state.xp;
  $('#xpNext').textContent = state.xpMax;
  $('#levelRing').style.setProperty('--p', Math.round(state.xp/state.xpMax*100));
  $('#xpBarFill').style.width = (state.xp/state.xpMax*100) + '%';
  $('#scoreRing').style.setProperty('--p', 0);
  $('#scoreRingNum').textContent = 0;
  $('#doneDonutPct').textContent = '0%';
  $('#questBarFill').style.width = '0%';
  $('#questStarCount').textContent = 0;
  $('#focusBarFill').style.width = (state.todayFocusMin/120*100) + '%';
  $('#scoreBarFill').style.width = '0%';
  $('#streakDays').textContent = state.streakDays;
  $('#weekPoints').textContent = '+' + state.weekPoints;
  $('#classRank').textContent = '暂无';
  $('#badgeCount').textContent = '已解锁 0/16';
  $('#ovScore').textContent = 0;
  $('#goalRangeVal').textContent = '120 分钟';
  $('#taskRangeVal').textContent = '30 个';
}

/* ============ 学科掌握度 ============ */
function renderSubjectBars(){
  const box = $('#subjectBars');
  box.innerHTML = '';
  SUBJECTS.forEach(s => {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.innerHTML = `
      <span class="subj-name">${s.emoji} ${s.name}</span>
      <div class="subj-bar"><i style="width:${s.pct}%;background:${s.color}"></i></div>
      <span class="subj-pct">${s.pct}%</span>`;
    box.appendChild(row);
  });
}

/* ============ 创意功能：段位 / 宠物 / 连击 / 森林 / 宝箱 ============ */
function renderRank(){
  let cur = RANKS[0], nxt = RANKS[1];
  RANKS.forEach((r,i)=>{ if(state.rankXp>=r.min){ cur=r; nxt=RANKS[i+1]; } });
  $('#rankLine').textContent = `${cur.emoji} ${cur.name}段位`;
  if(nxt){
    $('#rankBarFill').style.width = Math.min(100, Math.round((state.rankXp-cur.min)/(nxt.min-cur.min)*100)) + '%';
    $('#rankHint').textContent = `距${nxt.name}还差 ${nxt.min-state.rankXp} 分，加油！`;
  } else {
    $('#rankBarFill').style.width = '100%';
    $('#rankHint').textContent = '🏆 已登顶王者段位，太强了！';
  }
}
function renderPet(){
  $('#petLevelTag').textContent = 'Lv.' + PET.level;
  $('#petMood').textContent = PET.moods[PET.moodIdx];
  $('#petBarFill').style.width = Math.round(PET.xp/PET.xpMax*100) + '%';
  $('#petXpText').textContent = PET.xp;
  $('#petXpMax').textContent = PET.xpMax;
  $('#petCoins').textContent = state.coins;
  $('#petLog').textContent = PET.log;
}
function petPop(){
  const f = $('#petFigure');
  f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop');
}
function feedPet(){
  if(state.coins < 5){
    PET.log = '😅 学习币不够啦，完成任务可以赚学习币哦～';
  } else {
    state.coins -= 5;
    PET.xp += 60;
    if(PET.xp >= PET.xpMax){
      PET.xp -= PET.xpMax; PET.level++;
      PET.log = `🎉 小火龙进化到 Lv.${PET.level}！体型变大，更爱学习了！`;
      confetti(); sfx.levelup();
    } else {
      PET.log = '😋 小火龙吃饱了，亲密度 +60！';
    }
    PET.moodIdx = (PET.moodIdx + 1) % PET.moods.length;
  }
  state.petPlays++; sfx.feed();
  renderPet(); petPop();
}
function playPet(){
  PET.log = '🎾 小火龙追着球跑了一圈，开心地喷了个小火球！';
  state.petPlays++; sfx.feed();
  renderPet(); petPop();
}
function renderCombo(){ $('#comboCount').textContent = 'x' + state.combo; }
function renderForest(){
  const row = $('#forestRow'); row.innerHTML = '';
  const trees = ['🌱','🌿','🌳','🌲','🎄','🌴'];
  for(let i=0;i<state.forest;i++){
    const s = document.createElement('span');
    s.className = 'tree';
    s.textContent = trees[Math.min(i, trees.length-1)];
    row.appendChild(s);
  }
  $('#forestMeta').textContent = `今日已专注 ${state.forest*25} 分钟 · 种下 ${state.forest} 棵树`;
}
function openChest(){
  if(state.chestOpened){ $('#chestResult').textContent = '🎁 今天的宝箱已经开启啦，明天再来！'; return; }
  state.chestOpened = true;
  const rewards = ['🃏 双倍经验卡 <b>×1</b>','🎫 免做卡 <b>×1</b>','💰 学习币 <b>+30</b>','✨ 随机 XP <b>+50</b>'];
  const r = rewards[Math.floor(Math.random()*rewards.length)];
  const plain = r.replace(/<b>.*?<\/b>/g, '');
  $('#chestResult').textContent = '🎉 恭喜获得：' + plain + '！';
  const box = $('#chestBox');
  box.textContent = '📦';
  box.classList.add('opened');
  if(r.includes('学习币')){ state.coins += 30; state.coinsEarned += 30; renderPet(); }
  const chip = document.createElement('span');
  chip.className = 'item-chip';
  chip.innerHTML = r;
  $('#itemBag').appendChild(chip);
  state.xpGained += 50; renderStatic(); renderReportPreview();
  sfx.chest(); confetti();
}

/* ============ 角色与标签页切换 ============ */
function bindEvents(){
  // 角色切换
  $$('.role-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.role-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.role = btn.dataset.role;
    const isParent = state.role === 'parent';
    $('#studentApp').hidden = isParent;
    $('#parentApp').hidden = !isParent;
    $('#avatarBox').textContent = isParent ? '家' : '宇';
    $('#studentBottomNav').hidden = isParent;
    $('#parentBottomNav').hidden = !isParent;
    syncBottomNav(state.role);
    if(isParent){ renderParentCharts(); }
    else { renderTasks(); renderPlan(); }
  }));

  // 学生标签页
  $$('#studentTabs .tab').forEach(t => t.addEventListener('click', () => switchTab('#studentTabs', 'student', t)));
  // 家长标签页
  $$('#parentTabs .tab').forEach(t => t.addEventListener('click', () => switchTab('#parentTabs', 'parent', t)));

  // 首页跳转
  $('#goPlanBtn').addEventListener('click', () => goTab('student','plan'));
  $('#goMapBtn').addEventListener('click', () => goTab('student','map'));
  $('#goContentBtn').addEventListener('click', () => goTab('parent','content'));

  // 番茄钟
  $('#timerStart').addEventListener('click', toggleTimer);
  $('#timerReset').addEventListener('click', resetTimer);

  // 计划表单
  $('#taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const subject = $('#newTaskSubject').value;
    const text = $('#newTaskText').value.trim();
    const min = +$('#newTaskMin').value || 40;
    const day = +$('#newTaskDay').value;
    if(!text) return;
    PLAN[day].tasks.push({s:subject, n:text, m:min, d:false});
    renderPlan();
    $('#newTaskText').value = '';
    confetti();
  });

  // 周切换
  $('#weekPrev').addEventListener('click', () => { state.weekOffset--; renderPlan(); });
  $('#weekNext').addEventListener('click', () => { state.weekOffset++; renderPlan(); });

  // 图谱科目切换
  $$('#mapSubjectTabs .mini-tab').forEach(t => t.addEventListener('click', () => {
    $$('#mapSubjectTabs .mini-tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    state.mapSubject = t.dataset.subject;
    renderMap();
  }));

  // AI 学伴
  $('#chatForm').addEventListener('submit', e => {
    e.preventDefault();
    const val = $('#chatInput').value.trim();
    if(!val) return;
    addChatMsg('user', val);
    $('#chatInput').value = '';
    setTimeout(() => addChatMsg('bot', aiReply(val)), 500);
  });
  $('#chatSuggest').addEventListener('click', e => {
    if(e.target.classList.contains('chip-suggest')){
      $('#chatInput').value = e.target.textContent.replace(/^[^：]+：/, '');
      $('#chatForm').dispatchEvent(new Event('submit'));
    }
  });

  // 家长内容筛选
  $('#contentFilter').addEventListener('change', e => { state.contentFilter = e.target.value; renderTable(); });

  // 设置滑杆
  $('#goalRange').addEventListener('input', e => $('#goalRangeVal').textContent = e.target.value + ' 分钟');
  $('#taskRange').addEventListener('input', e => $('#taskRangeVal').textContent = e.target.value + ' 个');

  // 创意功能：宠物 / 宝箱 / 底部导航
  $('#petFeedBtn').addEventListener('click', feedPet);
  $('#petPlayBtn').addEventListener('click', playPet);
  $('#chestBox').addEventListener('click', openChest);
  $$('#studentBottomNav .bn-tab').forEach(t => t.addEventListener('click', () => switchTab('#studentTabs', 'student', t)));
  $$('#parentBottomNav .bn-tab').forEach(t => t.addEventListener('click', () => switchTab('#parentTabs', 'parent', t)));

  // 音效 & 长笛背景音乐
  $('#soundToggle').addEventListener('click', () => {
    state.sound = !state.sound;
    $('#soundToggle').textContent = state.sound ? '🔊' : '🔇';
    $('#soundToggle').classList.toggle('off', !state.sound);
    if(!state.sound) stopFluteMusic();
  });
  $('#musicToggle').addEventListener('click', toggleMusic);
  // 战报弹窗
  $('#openReportBtn').addEventListener('click', openReport);
  $('#reportClose').addEventListener('click', closeReport);
  $('#reportClose2').addEventListener('click', closeReport);
  // 剧情副本
  $('#bossAttackBtn').addEventListener('click', attackBoss);
  $('#bossNextBtn').addEventListener('click', nextDungeon);
  // 宠物皮肤
  $('#petSkinBtn').addEventListener('click', toggleSkinPanel);
  // 历史攻坚站
  $('#flashNext').addEventListener('click', () => { flashIdx = (flashIdx + 1) % FLASHCARDS.length; renderFlashcards(); sfx.click(); });
  $('#timelineReset').addEventListener('click', renderTimelineGame);
  // 校考曲目库筛选
  $('#repFilters').addEventListener('click', e => {
    const btn = e.target.closest('.mini-tab');
    if(!btn) return;
    $$('#repFilters .mini-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.repFilter = btn.dataset.cat;
    renderRepertoire(); sfx.click();
  });
  // 长笛艺考训练
  $('#musicPunchBtn').addEventListener('click', musicPunch);
  $('#musicQNext').addEventListener('click', () => { state.musicQIdx = (state.musicQIdx + 1) % MUSIC_QS.length; renderMusicQ(); sfx.click(); });
  $('#dqNext').addEventListener('click', () => { state.dqIdx = (state.dqIdx + 1) % DAILY_QS.length; renderDailyQ(); sfx.click(); });
  $('#histQNext').addEventListener('click', () => { state.histQIdx = (state.histQIdx + 1) % HISTORY_QS.length; renderHistoryQ(); sfx.click(); });

  // 初始聊天问候
  setTimeout(() => addChatMsg('bot', '你好呀，小宇！我是 AI 学伴「小智」🧠 今天想学什么、有什么困惑，都可以告诉我～'), 400);
}

function switchTab(tabsSel, role, btn){
  sfx.click();
  const tab = btn.dataset.tab;
  $$(tabsSel + ' .tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
  $$(`#${role}App .view`).forEach(v=>v.classList.remove('active'));
  const view = $(`#view-${role}-${tab}`);
  if(view) view.classList.add('active');
  if(role==='parent' && tab==='report') renderParentCharts();
  syncBottomNav(role);
}
function syncBottomNav(role){
  const topSel = role==='student' ? '#studentTabs' : '#parentTabs';
  const navSel = role==='student' ? '#studentBottomNav' : '#parentBottomNav';
  const active = $$(topSel + ' .tab.active')[0]?.dataset.tab;
  $$(navSel + ' .bn-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === active));
}

function goTab(role, tab){
  const sel = role==='student' ? '#studentTabs' : '#parentTabs';
  const btn = $$(sel + ' .tab').find(t=>t.dataset.tab===tab);
  if(btn){ switchTab(sel, role, btn); }
}

/* ============ 任务列表 ============ */
function renderTasks(){
  const box = $('#taskList');
  box.innerHTML = '';
  if(!tasks.length){
    box.innerHTML = '<li class="task-item" style="justify-content:center;color:var(--ink-3)">📭 今日暂无任务，去「学习计划」页添加吧！</li>';
    updateTaskStats();
    return;
  }
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.done ? ' done':'');
    li.innerHTML = `
      <span class="task-check ${t.done?'checked':''}">${t.done?'✓':''}</span>
      <div class="task-info">
        <div class="task-name">${t.subject} · ${t.name}</div>
        <div class="task-meta">预计 ${t.min} 分钟${t.done ? ' · 已完成 ✓' : ''}</div>
      </div>
      <span class="task-xp">+${t.xp} XP</span>`;
    li.querySelector('.task-check').addEventListener('click', () => toggleTask(t.id));
    box.appendChild(li);
  });
  updateTaskStats();
}

function toggleTask(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  t.done = !t.done;
  if(t.done){
    state.xp += t.xp; state.coins += 2; state.combo++;
    state.xpGained += t.xp; state.coinsEarned += 2;
    renderCombo(); renderPet();
    $('#xpHint').textContent = '太棒了！继续加油，离「夜猫学霸」徽章更近一步 🦉';
    sfx.complete();
  }
  renderTasks();
  renderStatic();
  const allDone = tasks.every(x=>x.done);
  if(allDone){ confetti(); sfx.victory(); setTimeout(()=>{ $('#xpHint').textContent = '🎉 今日任务全部完成！去闯关挑战再拿几颗星吧！'; }, 600); }
}

function updateTaskStats(){
  const done = tasks.filter(t=>t.done).length;
  const pct = tasks.length ? Math.round(done/tasks.length*100) : 0;
  $('#taskDone').textContent = done;
  $('#taskTotal').textContent = tasks.length;
  $('#taskPct').textContent = pct;
  $('#taskBarFill').style.width = pct + '%';
}

/* ============ 计划 ============ */
function renderPlan(){
  const days = ['一','二','三','四','五','六','日'];
  const off = state.weekOffset;
  const grid = $('#planGrid');
  grid.innerHTML = '';
  const todayIdx = (new Date().getDay()+6)%7;
  const monday = new Date();
  monday.setDate(monday.getDate() - todayIdx + off*7);
  const startM = monday.getMonth()+1, startD = monday.getDate();
  const endM = monday.getMonth()+1, endD = monday.getDate()+6;
  const fmt = (m,d)=>`${m}/${d}`;
  $('#weekRange').textContent = off===0 ? `本周（${fmt(startM,startD)}–${fmt(endM,endD)}）` : off<0 ? `上周（${fmt(startM,startD)}–${fmt(endM,endD)}）` : `下周（${fmt(startM,startD)}–${fmt(endM,endD)}）`;

  PLAN.forEach((day,i) => {
    const col = document.createElement('div');
    col.className = 'plan-day' + (i===todayIdx && off===0 ? ' today':'');
    col.innerHTML = `<div class="day-name">周${days[i]}<small>${fmt(startM,startD+i)}</small></div>`;
    day.tasks.forEach(t => {
      const p = document.createElement('div');
      p.className = 'plan-task' + (t.d ? ' done':'');
      p.innerHTML = `<span class="pt-subj">${t.s}</span>${t.n}<span class="pt-min"> · ${t.m}min</span>`;
      col.appendChild(p);
    });
    grid.appendChild(col);
  });
}

/* ============ 知识图谱 ============ */
function renderMap(){
  const nodes = MAPS[state.mapSubject];
  const map = $('#knowledgeMap');
  map.innerHTML = '';
  nodes.forEach(n => {
    const cls = n.pct>=80 ? 'green' : n.pct>=60 ? 'yellow' : 'red';
    const div = document.createElement('div');
    div.className = `knode ${cls}`;
    div.innerHTML = `<div class="k-emoji">${n.emoji}</div><div class="k-name">${n.name}</div><div class="k-pct">${n.pct}%</div>`;
    map.appendChild(div);
  });
  // 明细
  const detail = $('#mapDetail');
  detail.innerHTML = '';
  nodes.forEach(n => {
    const cls = n.pct>=80 ? 'var(--green)' : n.pct>=60 ? '#f59e0b' : 'var(--red)';
    const row = document.createElement('div');
    row.className = 'detail-item';
    row.innerHTML = `
      <span class="d-subj">${n.name}</span>
      <div class="d-bar"><i style="width:${n.pct}%;background:${cls}"></i></div>
      <span class="d-txt">${n.pct>=80?'已掌握 ✓':n.pct>=60?'待巩固 ⚠️':'薄弱 需加强'}</span>`;
    detail.appendChild(row);
  });
}

/* ============ 闯关 ============ */
function renderQuest(){
  const stars = $('#questStars');
  stars.innerHTML = '<span>⭐⭐⭐</span>';
  const list = $('#questList');
  list.innerHTML = '';
  QUESTS.forEach(q => {
    const div = document.createElement('div');
    div.className = 'quest-item';
    div.innerHTML = `
      <div class="q-emoji">${q.emoji}</div>
      <div class="q-info"><div class="q-name">${q.name}</div><div class="q-meta">${q.meta}</div></div>
      <div class="q-stars">${'⭐'.repeat(q.stars)}${q.done?' ✅':' 🔒'}</div>`;
    list.appendChild(div);
  });
}

function renderLeaderboard(){
  const ol = $('#leaderboard');
  ol.innerHTML = '';
  if(!LEADERBOARD.length){
    ol.innerHTML = '<li style="color:var(--ink-3);justify-content:center">📭 暂无排行数据，开始学习后这里会有你的对手！</li>';
    return;
  }
  LEADERBOARD.forEach(l => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="lb-name">${l.rank} ${l.name}${l.me?' 🌟':''}</span><span class="lb-xp">${l.xp} XP</span>`;
    if(l.me) li.style.background = '#eef0ff';
    ol.appendChild(li);
  });
}

function renderDailyQ(){
  const q = DAILY_QS[state.dqIdx];
  const box = $('#dailyQuestion');
  box.innerHTML = `
    <span class="dq-tag">${q.tag} · ${state.dqIdx+1}/${DAILY_QS.length}</span>
    <div class="dq-text">${q.text}</div>
    <div class="dq-options" id="dqOptions"></div>
    <div class="dq-feedback" id="dqFeedback"></div>`;
  const opts = $('#dqOptions');
  q.options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'dq-option';
    b.textContent = `${o.k}. ${o.v}`;
    b.addEventListener('click', () => {
      $$('#dqOptions .dq-option').forEach(x=>x.disabled=true);
      if(o.k === q.answer){
        b.classList.add('correct');
        $('#dqFeedback').innerHTML = '🎉 回答正确！+20 XP 已到账。' + q.explain;
        state.xp += 20; state.xpGained += 20;
        sfx.complete(); confetti(); renderStatic(); renderReportPreview();
      } else {
        b.classList.add('wrong');
        $('#dqFeedback').innerHTML = '😅 正确答案是 ' + q.answer + '。' + q.explain;
        addWrong({subj:q.subject, text:q.text, opts:q.options.map(o=>o.v), a:q.options.findIndex(o=>o.k===q.answer), exp:q.explain});
        sfx.wrong();
      }
    });
    opts.appendChild(b);
  });
}

function renderBadges(){
  const wall = $('#badgeWall');
  wall.innerHTML = '';
  BADGES.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge' + (b.locked ? ' locked':'');
    div.innerHTML = `<div class="b-emoji">${b.emoji}</div><div class="b-name">${b.name}</div><div class="b-sub">${b.sub}</div>`;
    wall.appendChild(div);
  });
}

/* ============ 番茄钟 ============ */
const QUOTES = [
  '✨ 心无旁骛，先把这 25 分钟交给专注。',
  '🌱 每个 25 分钟，都是向目标靠近的一小步。',
  '🧠 专注的深度，比时间的长度更重要。',
  '🏆 25 分钟后，你会感谢现在坚持的自己。',
  '🎯 一次只做一件事，就是最高效的学习。',
];
function toggleTimer(){
  const st = state.timer;
  if(st.running){ clearInterval(st.interval); st.running=false; $('#timerStart').textContent='▶ 继续'; $('#timerState').textContent='已暂停'; }
  else {
    st.running = true;
    $('#timerStart').textContent = '⏸ 暂停';
    $('#timerState').textContent = '专注中…';
    st.interval = setInterval(() => {
      st.remaining--;
      if(st.remaining <= 0){
        clearInterval(st.interval);
        st.running = false;
        st.remaining = 0;
        $('#timerState').textContent = '完成！';
        $('#timerLabel').textContent = '00:00';
        $('#timerQuote').textContent = '🎉 太棒了！休息 5 分钟，喝口水活动一下～';
        state.forest++; renderForest();
        sfx.complete(); confetti();
        return;
      }
      updateTimerUI();
    }, 1000);
  }
  updateTimerUI();
}
function resetTimer(){
  const st = state.timer;
  clearInterval(st.interval); st.running=false;
  st.remaining = st.total;
  $('#timerStart').textContent = '▶ 开始';
  $('#timerState').textContent = '准备开始';
  $('#timerQuote').textContent = QUOTES[Math.floor(Math.random()*QUOTES.length)];
  updateTimerUI();
}
function updateTimerUI(){
  const st = state.timer;
  const m = String(Math.floor(st.remaining/60)).padStart(2,'0');
  const s = String(st.remaining%60).padStart(2,'0');
  $('#timerLabel').textContent = `${m}:${s}`;
  const off = 553 * (1 - st.remaining/st.total);
  $('#timerRing').style.strokeDashoffset = off;
}

/* ============ AI 学伴 ============ */
function addChatMsg(who, text){
  const box = $('#chatBox');
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.style.whiteSpace = 'pre-line';
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function aiReply(text){
  for(const r of AI_RULES){ if(r.re.test(text)) return r.reply; }
  return '收到！小智建议你先把这个问题拆成小任务，从最容易的 5 分钟开始 😊 也可以告诉我具体科目（比如数学、英语），我帮你定制专属方案～';
}

/* ============ 家长端渲染 ============ */
function renderTimeline(){
  const tl = $('#timeline');
  tl.innerHTML = '';
  if(!TIMELINE.length){
    tl.innerHTML = '<li style="color:var(--ink-3)">📭 今天还没有学习动态，完成第一个任务后自动生成！</li>';
    return;
  }
  TIMELINE.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="tl-time">${t.time}</span><span class="tl-text">${t.text}</span> <span class="tl-xp">${t.xp} XP</span>`;
    tl.appendChild(li);
  });
}

function renderTable(){
  const tb = $('#contentTable');
  tb.innerHTML = '';
  const rows = RECORDS.filter(r => state.contentFilter==='all' || r.subject===state.contentFilter);
  if(!rows.length){
    tb.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--ink-3);padding:26px">📭 暂无学习记录，学习完成后会自动记录在这里</td></tr>';
    $('#contentSummary').textContent = '本周 0 条记录';
    return;
  }
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td><span class="tag subj-${r.subject}">${r.subject}</span></td>
      <td>${r.content}</td>
      <td><span class="tag type-${r.type}">${r.type}</span></td>
      <td>${r.min} 分钟</td>
      <td><div class="pct-cell"><div class="mini-bar"><i style="width:${r.done}%;background:${r.done>=80?'var(--green)':r.done>=50?'#f59e0b':'var(--red)'}"></i></div><b>${r.done}%</b></div></td>
      <td><div class="pct-cell"><div class="mini-bar"><i style="width:${r.master}%;background:${r.master>=80?'var(--green)':r.master>=60?'#f59e0b':'var(--red)'}"></i></div><b>${r.master}%</b></div></td>`;
    tb.appendChild(tr);
  });
  $('#contentSummary').textContent = `本周 ${rows.length} 条记录`;
}

function renderDims(){
  const list = $('#dimScores');
  list.innerHTML = '';
  DIMS.forEach(d => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="dim-name">${d.name}</span><div class="mini-bar"><i style="width:${d.val}%;background:${d.color}"></i></div><b>${d.val}</b>`;
    list.appendChild(li);
  });
}

function renderParentCharts(){
  renderLineChart($('#durationChart'), DURATION, DUR_LABELS, '#6366f1', '分钟');
  renderPie($('#pieChart'), $('#pieLegend'));
  renderDonut($('#doneDonut'), 0.86, '#10b981');
  renderRadar($('#radarChart'), DIMS.map(d=>d.name), DIMS.map(d=>d.val), '#8b5cf6');
  renderLineChart($('#trendChart'), TREND, TREND_LABELS, '#06b6d4', '分', true);
  updateDonutPct();
}

function updateDonutPct(){
  const circle = $('#doneDonut circle.fg');
  if(!circle) return;
  const C = 2*Math.PI*52;
  circle.style.strokeDashoffset = C * (1 - 0.86);
}

/* ---------- 折线图 ---------- */
function renderLineChart(svg, data, labels, color, unit, dots=true){
  svg.innerHTML = '';
  const W=720, H=240, pl=46, pr=18, pt=22, pb=34;
  const max = Math.max(...data)*1.15;
  const iw = W-pl-pr, ih = H-pt-pb;
  const X = i => pl + i*(iw/(data.length-1));
  const Y = v => pt + (1 - v/max)*ih;
  // 网格
  for(let g=0; g<=4; g++){
    const y = pt + ih*g/4;
    svg.append(svgEl('line', {x1:pl, y1:y, x2:W-pr, y2:y, stroke:'#eef0fa', 'stroke-width':1}));
    const gt = svgEl('text', {x:pl-8, y:y+4, 'text-anchor':'end', 'font-size':11, fill:'#8b91ad', 'font-family':'inherit'});
    gt.textContent = Math.round(max*(1-g/4));
    svg.append(gt);
  }
  const pts = data.map((v,i)=>[X(i), Y(v)]);
  // 面积
  const area = `M ${pts[0][0]} ${H-pb} L ` + pts.map(p=>`${p[0]} ${p[1]}`).join(' L ') + ` L ${pts[pts.length-1][0]} ${H-pb} Z`;
  const ag = svgEl('linearGradient', {id:'ag'+color.replace('#',''), x1:'0', y1:'0', x2:'0', y2:'1'});
  ag.append(svgEl('stop', {offset:'0%', 'stop-color':color, 'stop-opacity':0.28}));
  ag.append(svgEl('stop', {offset:'100%', 'stop-color':color, 'stop-opacity':0.02}));
  svg.append(ag);
  svg.append(svgEl('path', {d:area, fill:`url(#ag${color.replace('#','')})`}));
  // 折线
  svg.append(svgEl('polyline', {points: pts.map(p=>p.join(',')).join(' '), fill:'none', stroke:color, 'stroke-width':3, 'stroke-linecap':'round', 'stroke-linejoin':'round'}));
  // 点与标签
  pts.forEach((p,i) => {
    if(dots) svg.append(svgEl('circle', {cx:p[0], cy:p[1], r:4.5, fill:'#fff', stroke:color, 'stroke-width':2.5}));
    const l1 = svgEl('text', {x:p[0], y:H-12, 'text-anchor':'middle', 'font-size':11, fill:'#8b91ad', 'font-family':'inherit'});
    l1.textContent = labels[i];
    svg.append(l1);
    const l2 = svgEl('text', {x:p[0], y:p[1]-9, 'text-anchor':'middle', 'font-size':11, fill:color, 'font-weight':700, 'font-family':'inherit'});
    l2.textContent = data[i];
    svg.append(l2);
  });
}

/* ---------- 环形图 ---------- */
function renderDonut(svg, pct, color){
  svg.innerHTML = '';
  svg.append(svgEl('circle', {cx:60, cy:60, r:52, fill:'none', stroke:'#eef0fa', 'stroke-width':13}));
  const c = svgEl('circle', {cx:60, cy:60, r:52, fill:'none', stroke:color, 'stroke-width':13, 'stroke-linecap':'round', transform:'rotate(-90 60 60)'});
  c.classList.add('fg');
  const C = 2*Math.PI*52;
  c.style.strokeDasharray = C;
  c.style.strokeDashoffset = C*(1-pct);
  svg.append(c);
}

/* ---------- 饼图 ---------- */
function renderPie(svg, legend){
  svg.innerHTML = '';
  legend.innerHTML = '';
  const total = PIE.reduce((s,p)=>s+p.min, 0);
  let ang = -90;
  PIE.forEach(p => {
    const sweep = p.min/total*360;
    const a1 = ang*Math.PI/180, a2 = (ang+sweep)*Math.PI/180;
    const x1 = 100+80*Math.cos(a1), y1 = 100+80*Math.sin(a1);
    const x2 = 100+80*Math.cos(a2), y2 = 100+80*Math.sin(a2);
    const large = sweep>180 ? 1 : 0;
    const path = svgEl('path', {d:`M100 100 L ${x1} ${y1} A 80 80 0 ${large} 1 ${x2} ${y2} Z`, fill:p.color, stroke:'#fff', 'stroke-width':2});
    svg.append(path);
    // 图例
    const row = document.createElement('div');
    row.className = 'lg-row';
    row.innerHTML = `<span class="lg-dot" style="background:${p.color}"></span>${p.name}<b style="margin-left:auto;color:var(--ink-2)">${p.min} 分钟 · ${Math.round(p.min/total*100)}%</b>`;
    legend.appendChild(row);
    ang += sweep;
  });
}

/* ---------- 雷达图 ---------- */
function renderRadar(svg, labels, values, color){
  svg.innerHTML = '';
  const cx=180, cy=150, R=92;
  const n = labels.length;
  const P = (i, r) => {
    const a = -Math.PI/2 + i*2*Math.PI/n;
    return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
  };
  // 网格（20/40/60/80/100）
  for(const g of [0.2,0.4,0.6,0.8,1]){
    const pts = [];
    for(let i=0;i<n;i++) pts.push(P(i, R*g).join(','));
    svg.append(svgEl('polygon', {points:pts.join(' '), fill: g===1?'rgba(139,92,246,.06)':'none', stroke:'#e4e6f5', 'stroke-width':1}));
  }
  // 轴线与标签
  for(let i=0;i<n;i++){
    const [x,y] = P(i, R);
    svg.append(svgEl('line', {x1:cx, y1:cy, x2:x, y2:y, stroke:'#e4e6f5', 'stroke-width':1}));
    const [lx,ly] = P(i, R+22);
    const lt = svgEl('text', {x:lx, y:ly, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':12.5, fill:'#5b6280', 'font-weight':600, 'font-family':'inherit'});
    lt.textContent = labels[i];
    svg.append(lt);
  }
  // 数值多边形
  const vp = values.map((v,i)=>P(i, R*v/100).join(',')).join(' ');
  svg.append(svgEl('polygon', {points:vp, fill:'rgba(139,92,246,.25)', stroke:color, 'stroke-width':2.5, 'stroke-linejoin':'round'}));
  values.forEach((v,i) => {
    const [x,y] = P(i, R*v/100);
    svg.append(svgEl('circle', {cx:x, cy:y, r:4, fill:'#fff', stroke:color, 'stroke-width':2}));
    const vt = svgEl('text', {x:x, y:y-9, 'text-anchor':'middle', 'font-size':11, fill:color, 'font-weight':700, 'font-family':'inherit'});
    vt.textContent = v;
    svg.append(vt);
  });
}

/* ================================================================
   第二波创意功能：音效 / 长笛背景音乐 / 个性称号 / 剧情副本 /
   学习战报 / 同学 PK / 宠物皮肤 / 历史攻坚站
   ================================================================ */

/* ---------- Web Audio 音效引擎 ---------- */
let audioCtx = null;
function ensureAudio(){
  try{
    if(!audioCtx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      audioCtx = new AC();
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }catch(e){ return null; }
}
function beep(freq, dur, type='sine', vol=0.12, when=0){
  if(!state.sound) return;
  const ac = ensureAudio(); if(!ac) return;
  try{
    const t = ac.currentTime + when;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + dur + 0.03);
  }catch(e){}
}
const sfx = {
  click:    () => beep(640, 0.07, 'triangle', 0.06),
  complete: () => { beep(523,0.12); beep(659,0.12,'sine',0.13,0.11); beep(784,0.22,'sine',0.13,0.22); },
  levelup:  () => { [523,659,784,1046].forEach((f,i)=>beep(f,0.16,'triangle',0.14,i*0.12)); },
  bossHit:  () => { beep(170,0.16,'sawtooth',0.1); beep(110,0.22,'sawtooth',0.08,0.1); },
  victory:  () => { [523,659,784,1046,784,1046].forEach((f,i)=>beep(f,0.18,'triangle',0.15,i*0.13)); },
  feed:     () => { beep(720,0.08,'sine',0.09); beep(920,0.1,'sine',0.09,0.08); },
  chest:    () => { [392,523,659,784].forEach((f,i)=>beep(f,0.12,'square',0.07,i*0.09)); },
  wrong:    () => { beep(220,0.2,'sawtooth',0.08); beep(180,0.25,'sawtooth',0.07,0.12); },
};

/* ---------- 长笛背景音乐（纯代码合成，柔和五声音阶） ---------- */
const FLUTE_MELODY = [
  {n:659.25,d:0.5},{n:783.99,d:0.5},{n:880.00,d:0.5},{n:783.99,d:0.5},
  {n:659.25,d:0.5},{n:587.33,d:0.25},{n:523.25,d:0.25},{n:587.33,d:1.0},
  {n:659.25,d:0.5},{n:587.33,d:0.5},{n:659.25,d:0.5},{n:783.99,d:0.5},
  {n:659.25,d:0.5},{n:587.33,d:0.25},{n:523.25,d:0.25},{n:587.33,d:1.0},
  {n:523.25,d:0.5},{n:587.33,d:0.5},{n:659.25,d:0.5},{n:783.99,d:0.5},
  {n:880.00,d:0.75},{n:783.99,d:0.25},{n:659.25,d:1.0},
  {n:587.33,d:0.5},{n:659.25,d:0.5},{n:587.33,d:0.5},{n:523.25,d:1.0},
];
let musicLoopTimer = null;
let musicNodes = [];
function fluteNote(freq, dur, when){
  const ac = ensureAudio(); if(!ac) return [];
  try{
    const t = ac.currentTime + when;
    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.10, t + 0.06);
    g.gain.setValueAtTime(0.10, t + Math.max(0,dur - 0.18));
    g.gain.linearRampToValueAtTime(0, t + dur);
    g.connect(ac.destination);
    const out = [];
    [[1,0.55],[2,0.22],[3,0.12],[4,0.06]].forEach(([m,a]) => {
      const o = ac.createOscillator();
      o.type = 'sine'; o.frequency.value = freq*m;
      const og = ac.createGain(); og.gain.value = a;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t+dur+0.05);
      out.push(o);
    });
    // 长笛式颤音
    const lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.frequency.value = 5.2; lg.gain.value = 2.5;
    lfo.connect(lg); lg.connect(out[0].frequency);
    lfo.start(t); lfo.stop(t+dur+0.05);
    out.push(lfo);
    return out;
  }catch(e){ return []; }
}
function startFluteMusic(){
  stopFluteMusic();
  if(!state.music) return;
  const ac = ensureAudio(); if(!ac) return;
  try{
    const t0 = ac.currentTime + 0.15;
    let t = t0;
    FLUTE_MELODY.forEach(note => {
      musicNodes.push(...fluteNote(note.n, note.d*0.85, t - ac.currentTime));
      t += note.d;
    });
    const loopMs = (t - t0)*1000;
    musicLoopTimer = setTimeout(startFluteMusic, loopMs);
  }catch(e){}
}
function stopFluteMusic(){
  if(musicLoopTimer){ clearTimeout(musicLoopTimer); musicLoopTimer = null; }
  musicNodes.forEach(n => { try{ n.stop(); }catch(e){} });
  musicNodes = [];
}
function toggleMusic(){
  state.music = !state.music;
  $('#musicToggle').classList.toggle('on', state.music);
  if(state.music){ startFluteMusic(); }
  else { stopFluteMusic(); }
}

/* ---------- 个性称号 ---------- */
const TITLES = [
  {emoji:'🌅', name:'早读战神',   cond:'连续 7 天早起打卡',     unlocked:true},
  {emoji:'🗡️', name:'错题终结者', cond:'累计订正错题 50 道',    unlocked:false},
  {emoji:'🔤', name:'词汇暴君',   cond:'词汇量达 6000',         unlocked:false},
  {emoji:'🏃', name:'专注苦行僧', cond:'单日专注 240 分钟',     unlocked:false},
  {emoji:'⭐', name:'满星通关',   cond:'单章副本满星',          unlocked:false},
  {emoji:'📜', name:'历史学究',   cond:'历史掌握度 ≥85%',      unlocked:false},
  {emoji:'🗺️', name:'地理小达人', cond:'地理掌握度 ≥85%',      unlocked:false},
  {emoji:'🧮', name:'函数大师',   cond:'数学掌握度 ≥85%',      unlocked:false},
  {emoji:'🏛️', name:'政治先知',   cond:'政治掌握度 ≥85%',      unlocked:false},
  {emoji:'🐉', name:'驯龙高手',   cond:'小火龙 Lv.10',          unlocked:false},
  {emoji:'💎', name:'钻石会员',   cond:'段位达到钻石',          unlocked:false},
  {emoji:'👑', name:'王者学霸',   cond:'段位达到王者',          unlocked:false},
];
function renderTitleWall(){
  const wall = $('#titleWall'); wall.innerHTML = '';
  const unlockedCount = TITLES.filter(t=>t.unlocked).length;
  $('#titleCount').textContent = `已解锁 ${unlockedCount}/${TITLES.length}`;
  TITLES.forEach(t => {
    const d = document.createElement('div');
    d.className = 'title-item' + (t.name===state.title?' current':'') + (t.unlocked?'':' locked');
    d.title = t.unlocked ? `点击佩戴：${t.name}` : `未解锁：${t.cond}`;
    d.innerHTML = `<div class="t-emoji">${t.emoji}</div><div class="t-name">${t.name}</div><div class="t-cond">${t.unlocked?'可佩戴':'🔒 '+t.cond}</div>`;
    if(t.unlocked) d.addEventListener('click', () => { state.title = t.name; renderTitleWall(); renderReportPreview(); sfx.click(); });
    wall.appendChild(d);
  });
}

/* ---------- 剧情副本 · Boss 战 ---------- */
const DUNGEONS = [
  {chapter:'第一章 · 数学', emoji:'🐲', name:'数列魔龙',   hp:1500, coins:25,  xp:100, title:'数学守卫者'},
  {chapter:'第二章 · 历史', emoji:'⏳', name:'时光吞噬者', hp:1800, coins:30,  xp:120, title:'历史守卫者'},
  {chapter:'第三章 · 政治', emoji:'🗿', name:'规则巨像',   hp:1800, coins:30,  xp:120, title:'政治守卫者'},
  {chapter:'第四章 · 地理', emoji:'🌪️', name:'风暴领主',   hp:2200, coins:40,  xp:150, title:'地理守卫者'},
  {chapter:'第五章 · 英语', emoji:'🧙', name:'语法巫师',   hp:2200, coins:40,  xp:150, title:'英语守卫者'},
  {chapter:'终章 · 高考决战', emoji:'👹', name:'高考大魔王', hp:5000, coins:120, xp:600, title:'高考王者'},
];
function dungeonDamage(){
  const done = tasks.filter(t=>t.done).length;
  return done*40 + Math.floor(state.todayFocusMin/5) + state.combo*10 + 50;
}
function renderDungeon(){
  const map = $('#dungeonMap'); map.innerHTML = '';
  DUNGEONS.forEach((d,i) => {
    const div = document.createElement('div');
    let cls='locked', status='🔒 未解锁';
    if(i < state.dungeon.idx){ cls='done'; status='✅ 已通关'; }
    else if(i === state.dungeon.idx){ cls='active'; status='⚔️ 挑战中'; }
    div.className = 'dungeon-chapter ' + cls;
    div.innerHTML = `<div class="dc-emoji">${d.emoji}</div><div class="dc-name">${d.chapter}</div><div class="dc-status">${status}</div>`;
    if(i > state.dungeon.idx) div.title = '先击败前一章 Boss 解锁';
    map.appendChild(div);
  });
  const cur = DUNGEONS[state.dungeon.idx];
  $('#bossChapter').textContent = cur.chapter;
  $('#bossFigure').textContent = cur.emoji;
  $('#bossName').textContent = cur.name;
  const hp = Math.max(0, state.dungeon.hp);
  $('#bossHpFill').style.width = (hp/cur.hp*100) + '%';
  $('#bossHpText').textContent = `HP ${hp} / ${cur.hp}`;
  $('#bossAttackPower').textContent = dungeonDamage();
  const done = tasks.filter(t=>t.done).length;
  $('#bossPowerSource').textContent = `今日已完成 ${done} 个任务`;
  $('#bossAttackBtn').hidden = state.dungeon.defeated;
  $('#bossNextBtn').hidden = !state.dungeon.defeated;
  $('#bossLog').innerHTML = state.dungeon.log.map(l=>`<div>${l}</div>`).join('') || '<div>👋 点击「发起攻击」，用今天的努力击败它！</div>';
  renderWrongBoss();
}
function attackBoss(){
  if(state.dungeon.defeated) return;
  const cur = DUNGEONS[state.dungeon.idx];
  const dmg = dungeonDamage();
  state.dungeon.hp -= dmg;
  state.dungeon.log.unshift(`💥 你对「${cur.name}」造成 ${dmg} 点伤害！`);
  if(state.dungeon.log.length > 4) state.dungeon.log.pop();
  sfx.bossHit();
  const fig = $('#bossFigure');
  fig.classList.add('shake');
  setTimeout(()=>fig.classList.remove('shake'), 450);
  const card = $('#bossCard');
  const df = document.createElement('div');
  df.className = 'damage-float';
  df.textContent = '-' + dmg;
  card.appendChild(df);
  setTimeout(()=>df.remove(), 1000);
  if(state.dungeon.hp <= 0){
    state.dungeon.defeated = true;
    state.dungeon.hp = 0;
    state.bossKilled++;
    state.coins += cur.coins; state.coinsEarned += cur.coins;
    state.xp += cur.xp; state.xpGained += cur.xp;
    state.dungeon.log.unshift(`🎉 击败「${cur.name}」！获得 ${cur.coins} 学习币 + ${cur.xp} XP，解锁称号「${cur.title}」！`);
    sfx.victory(); confetti();
  }
  renderDungeon(); renderPet(); renderStatic(); renderReportPreview();
}
function nextDungeon(){
  if(state.dungeon.idx < DUNGEONS.length - 1){
    state.dungeon.idx++;
    state.dungeon.hp = DUNGEONS[state.dungeon.idx].hp;
    state.dungeon.defeated = false;
    state.dungeon.log = [];
  } else {
    state.dungeon.log.unshift('🏆 你已通关全部副本！你就是高考王者！');
  }
  renderDungeon();
}

/* ---------- 学习战报 ---------- */
function renderReportPreview(){
  const box = $('#reportPreview');
  if(!box) return;
  const done = tasks.filter(t=>t.done).length;
  const tCount = tasks.length ? `${done}/${tasks.length}` : '—';
  box.innerHTML = `
    <div class="rp-mini"><div class="rpm-val">${tCount}</div><div class="rpm-label">完成任务</div></div>
    <div class="rp-mini"><div class="rpm-val">${state.todayFocusMin}</div><div class="rpm-label">专注分钟</div></div>
    <div class="rp-mini"><div class="rpm-val">x${state.combo}</div><div class="rpm-label">最高连击</div></div>
    <div class="rp-mini"><div class="rpm-val">+${state.xpGained}</div><div class="rpm-label">今日 XP</div></div>
    <div class="rp-mini"><div class="rpm-val">${state.bossKilled}</div><div class="rpm-label">击杀 Boss</div></div>
    <div class="rp-mini"><div class="rpm-val">+${state.coinsEarned}</div><div class="rpm-label">学习币</div></div>`;
}
function openReport(){
  const now = new Date();
  $('#reportDate').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 · 周${['日','一','二','三','四','五','六'][now.getDay()]}`;
  const curTitle = TITLES.find(t=>t.name===state.title);
  $('#reportPlayer').textContent = `小宇 · ${curTitle?curTitle.emoji:''} ${state.title} · ${$('#rankLine').textContent}`;
  const done = tasks.filter(t=>t.done).length;
  const items = [
    ['✅', `${done}/${tasks.length}`, '完成任务'],
    ['⏱️', state.todayFocusMin+' 分钟', '专注时长'],
    ['⚡', 'x'+state.combo, '最高连击'],
    ['✨', '+'+state.xpGained, '今日 XP'],
    ['⚔️', state.bossKilled, '击杀 Boss'],
    ['🪙', '+'+state.coinsEarned, '学习币'],
    ['🐉', state.petPlays, '宠物互动'],
    ['🏅', '黄金段位', '当前段位'],
  ];
  $('#reportGrid').innerHTML = items.map(([e,v,l]) => `<div class="rp-item"><div class="rpi-emoji">${e}</div><div class="rpi-val">${v}</div><div class="rpi-label">${l}</div></div>`).join('');
  if(done===0 && state.todayFocusMin===0 && state.xpGained===0){
    $('#reportComment').textContent = '📭 今天还没有学习记录。完成第一个任务、专注一个番茄钟，这里就会生成属于你的专属战报！';
    $('#reportModal').hidden = false;
    return;
  }
  const good = (tasks.length&&done/tasks.length>=0.6?1:0)+(state.combo>=4?1:0)+(state.bossKilled>=1?1:0)+(state.todayFocusMin>=80?1:0)+(state.pkWins>=1?1:0);
  const comments = [
    '🔥 今天状态爆棚！连击、击杀、专注全线拉满，你就是「高考大魔王」的克星！',
    '💪 今天完成得很扎实，专注度和连击都很好，明天可以再挑战一章副本！',
    '🌱 稳扎稳打的一天，把错题和知识点都消化掉，进步就是这样积累出来的。',
    '🤏 今天有点小疲劳也没关系，休息好、明天满血复活，学习是长跑不是冲刺。',
  ];
  $('#reportComment').textContent = comments[Math.min(good, comments.length-1)];
  $('#reportModal').hidden = false;
  sfx.click();
}
function closeReport(){ $('#reportModal').hidden = true; }

/* ---------- 同学 PK ---------- */
const PK_OPPONENTS = [
  {name:'陈一鸣', emoji:'😎', skill:'钻石 · 高难', level:4},
  {name:'林雨桐', emoji:'🤓', skill:'铂金 · 中难', level:3},
  {name:'周子昂', emoji:'🧐', skill:'黄金 · 普通', level:2},
];
const PK_QUESTIONS = [
  {subj:'数学', q:'函数 f(x)=x²−2x 的对称轴是？', opts:['x=0','x=1','x=2','x=−1'], a:1, exp:'对称轴 x=−b/2a=1'},
  {subj:'语文', q:'“落霞与孤鹜齐飞”出自哪篇名作？', opts:['《滕王阁序》','《岳阳楼记》','《醉翁亭记》','《兰亭集序》'], a:0, exp:'出自王勃《滕王阁序》'},
  {subj:'英语', q:'选出正确的一项：He ____ to school every day.', opts:['go','goes','going','gone'], a:1, exp:'一般现在时第三人称单数加 -es'},
  {subj:'历史', q:'秦始皇统一六国是在哪一年？', opts:['公元前221年','公元前210年','公元前206年','公元前202年'], a:0, exp:'公元前221年秦灭六国完成统一'},
  {subj:'政治', q:'商品的两个基本属性是？', opts:['价值和使用价值','价格和价值','供求和竞争','生产和消费'], a:0, exp:'商品是使用价值和价值的统一体'},
  {subj:'地理', q:'我国最大的淡水湖是？', opts:['鄱阳湖','洞庭湖','太湖','洪泽湖'], a:0, exp:'鄱阳湖是我国最大淡水湖'},
  {subj:'数学', q:'sin30° 的值是？', opts:['1/2','√2/2','√3/2','1'], a:0, exp:'sin30°=1/2'},
  {subj:'历史', q:'第二次世界大战全面爆发的标志是？', opts:['德国突袭波兰','日本偷袭珍珠港','德国进攻苏联','诺曼底登陆'], a:0, exp:'1939年9月德国突袭波兰'},
  {subj:'英语', q:'“图书馆”的英文是？', opts:['library','museum','hospital','station'], a:0, exp:'library 图书馆'},
  {subj:'地理', q:'七大洲中面积最大的是？', opts:['亚洲','非洲','北美洲','欧洲'], a:0, exp:'亚洲面积约4400万平方公里'},
  {subj:'数学', q:'若 2^x=8，则 x=？', opts:['2','3','4','5'], a:1, exp:'2³=8，x=3'},
  {subj:'数学', q:'等比数列 1,2,4,8,… 的第 6 项是？', opts:['16','24','32','64'], a:2, exp:'a₆=1×2⁵=32'},
  {subj:'语文', q:'“会当凌绝顶，一览众山小”的作者是？', opts:['杜甫','李白','王维','孟浩然'], a:0, exp:'出自杜甫《望岳》'},
  {subj:'语文', q:'“一鼓作气”这个成语出自哪部典籍？', opts:['《左传》','《论语》','《孟子》','《史记》'], a:0, exp:'出自《左传·庄公十年》'},
  {subj:'英语', q:'My brother ____ playing the flute very well.', opts:['is','are','am','be'], a:0, exp:'主语第三人称单数，用 is'},
  {subj:'英语', q:'“difficult” 的反义词是？', opts:['easy','hard','tough','heavy'], a:0, exp:'difficult = 困难的，反义词 easy'},
  {subj:'历史', q:'“贞观之治”出现在哪位皇帝在位时期？', opts:['唐太宗','唐玄宗','隋文帝','汉武帝'], a:0, exp:'唐太宗李世民开创“贞观之治”'},
  {subj:'历史', q:'活字印刷术的发明者是？', opts:['毕昇','蔡伦','张衡','沈括'], a:0, exp:'北宋毕昇发明活字印刷术'},
  {subj:'政治', q:'我国的根本政治制度是？', opts:['人民代表大会制度','民族区域自治制度','基层群众自治制度','多党合作制度'], a:0, exp:'人民代表大会制度是根本政治制度'},
  {subj:'地理', q:'世界最高峰是？', opts:['珠穆朗玛峰','乔戈里峰','干城章嘉峰','洛子峰'], a:0, exp:'珠穆朗玛峰海拔约8848米'},
];
const pk = { phase:'select', oppIdx:0, qs:[], qi:0, correct:0, oppScore:0 };
function renderPK(){
  const box = $('#pkBox');
  if(!box) return;
  if(pk.phase==='select'){
    box.innerHTML = `
      <div class="pk-select">
        ${PK_OPPONENTS.map((o,i)=>`
          <div class="pk-opponent ${i===pk.oppIdx?'selected':''}" data-i="${i}">
            <div class="pko-emoji">${o.emoji}</div>
            <div class="pko-name">${o.name}</div>
            <div class="pko-skill">${o.skill}</div>
          </div>`).join('')}
      </div>
      <div style="margin-top:12px"><button class="btn btn-primary" id="pkStartBtn">⚔️ 开始对战</button></div>`;
    box.querySelectorAll('.pk-opponent').forEach(el => el.addEventListener('click', () => { pk.oppIdx = +el.dataset.i; renderPK(); sfx.click(); }));
    $('#pkStartBtn').addEventListener('click', pkStart);
  } else if(pk.phase==='quiz'){
    const q = pk.qs[pk.qi];
    box.innerHTML = `
      <div class="pk-score">
        <div class="ps-side me"><div class="ps-num">${pk.correct}</div><div>小宇</div></div>
        <div class="ps-side"><div class="ps-num">${pk.oppScore}</div><div>${PK_OPPONENTS[pk.oppIdx].name}</div></div>
      </div>
      <div class="pk-progress">第 ${pk.qi+1} / 8 题 · ${q.subj}</div>
      <div class="daily-question">
        <div class="dq-text">${q.q}</div>
        <div class="dq-options">${q.opts.map((o,i)=>`<button class="dq-option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div>
        <div class="dq-feedback" id="pkFeedback"></div>
      </div>`;
    box.querySelectorAll('.dq-option').forEach(btn => btn.addEventListener('click', () => pkAnswer(+btn.dataset.i, btn)));
  } else {
    const win = pk.correct > pk.oppScore, tie = pk.correct === pk.oppScore;
    const title = win ? '🎉 你赢了！' : tie ? '🤝 平局！' : '😤 惜败，再来一次！';
    let reward = '';
    if(win){ state.coins += 15; state.coinsEarned += 15; state.pkWins++; reward = '奖励 15 学习币已到账！'; sfx.victory(); confetti(); }
    else if(tie){ reward = '势均力敌，再赢一局拿奖励！'; sfx.complete(); }
    else { reward = '没关系，去知识图谱复习一下再来！'; sfx.wrong(); }
    box.innerHTML = `
      <div class="pk-result ${win?'win':tie?'':'lose'}">${title}</div>
      <div class="pk-score">
        <div class="ps-side me"><div class="ps-num">${pk.correct}</div><div>小宇</div></div>
        <div class="ps-side"><div class="ps-num">${pk.oppScore}</div><div>${PK_OPPONENTS[pk.oppIdx].name}</div></div>
      </div>
      <p style="text-align:center;font-size:13.5px;color:var(--ink-2)">${reward}</p>
      <div style="text-align:center;margin-top:10px"><button class="btn btn-primary" id="pkAgainBtn">🔄 再战一局</button></div>`;
    $('#pkAgainBtn').addEventListener('click', () => { pk.phase='select'; renderPK(); });
    renderPet(); renderReportPreview();
  }
}
function pkStart(){
  const pool = [...PK_QUESTIONS].sort(()=>Math.random()-.5).slice(0,8);
  pk.qs = pool; pk.qi = 0; pk.correct = 0;
  const opp = PK_OPPONENTS[pk.oppIdx];
  pk.oppScore = Math.min(8, Math.max(3, Math.round(8 - opp.level*0.8 + Math.random()*2)));
  pk.phase = 'quiz'; renderPK(); sfx.click();
}
function pkAnswer(i, btn){
  const q = pk.qs[pk.qi];
  $$('#pkBox .dq-option').forEach(b=>b.disabled=true);
  if(i === q.a){ btn.classList.add('correct'); pk.correct++; sfx.complete(); }
  else {
    btn.classList.add('wrong'); sfx.wrong();
    $$('#pkBox .dq-option')[q.a].classList.add('correct');
    addWrong({subj:q.subj, text:q.q, opts:q.opts, a:q.a, exp:q.exp});
  }
  $('#pkFeedback').textContent = q.exp;
  setTimeout(() => {
    pk.qi++;
    if(pk.qi >= pk.qs.length) pk.phase = 'result';
    renderPK();
  }, 1400);
}

/* ---------- 宠物皮肤 ---------- */
PET.skins = [
  {emoji:'🐉', name:'火焰龙', price:0,   owned:true},
  {emoji:'🐲', name:'机甲龙', price:50,  owned:false},
  {emoji:'🦖', name:'雷电龙', price:80,  owned:false},
  {emoji:'🦎', name:'冰霜龙', price:120, owned:false},
];
PET.skinIdx = 0;
function renderSkins(){
  const panel = $('#skinPanel');
  if(!panel) return;
  panel.innerHTML = '';
  PET.skins.forEach((s,i) => {
    const chip = document.createElement('div');
    chip.className = 'skin-chip' + (s.owned?' owned':'') + (i===PET.skinIdx?' equipped':'');
    chip.innerHTML = `<span class="sk-emoji">${s.emoji}</span>${s.name}<div class="sk-price">${s.owned ? (i===PET.skinIdx?'✓ 已佩戴':'点击佩戴') : '🪙 '+s.price}</div>`;
    chip.addEventListener('click', () => skinClick(i));
    panel.appendChild(chip);
  });
}
function skinClick(i){
  const s = PET.skins[i];
  if(!s.owned){
    if(state.coins < s.price){
      PET.log = `😅 学习币不够，还差 ${s.price - state.coins} 币，完成任务赚币吧！`;
      renderPet(); return;
    }
    state.coins -= s.price; s.owned = true;
    PET.log = `🎨 购买了「${s.name}」皮肤！`;
    sfx.chest();
  } else {
    PET.log = `🎨 已佩戴「${s.name}」皮肤！`;
    sfx.click();
  }
  PET.skinIdx = i;
  $('#petFigure').textContent = s.emoji;
  renderSkins(); renderPet();
}
function toggleSkinPanel(){
  const panel = $('#skinPanel');
  if(!panel) return;
  panel.hidden = !panel.hidden;
  if(!panel.hidden) renderSkins();
}

/* ---------- 历史攻坚站 ---------- */
const FLASHCARDS = [
  {tag:'中国古代史', front:'秦朝',       back:'前221年统一 · 中央集权制度 · 郡县制'},
  {tag:'中国近代史', front:'鸦片战争',   back:'1840年 · 近代史开端 · 签订《南京条约》'},
  {tag:'中国近代史', front:'辛亥革命',   back:'1911年 · 推翻清王朝 · 建立中华民国'},
  {tag:'中国近代史', front:'五四运动',   back:'1919年 · 新民主主义革命开端'},
  {tag:'中国近代史', front:'抗日战争',   back:'1937年全面爆发 · 1945年胜利 · 全民族抗战'},
  {tag:'中国现代史', front:'改革开放',   back:'1978年十一届三中全会 · 对内改革对外开放'},
  {tag:'世界近代史', front:'新航路开辟', back:'15世纪末 · 世界市场雏形 · 商业革命/价格革命'},
  {tag:'世界近代史', front:'法国大革命', back:'1789年 · 攻占巴士底狱 · 《人权宣言》'},
  {tag:'世界近代史', front:'工业革命',   back:'18世纪60年代始于英国 · 蒸汽时代'},
  {tag:'世界现代史', front:'十月革命',   back:'1917年 · 世界上第一个社会主义国家'},
];
const TIMELINE_EVENTS = [
  {name:'秦统一六国', year:-221},
  {name:'新航路开辟', year:1492},
  {name:'法国大革命', year:1789},
  {name:'鸦片战争爆发', year:1840},
  {name:'辛亥革命', year:1911},
  {name:'五四运动', year:1919},
  {name:'新中国成立', year:1949},
  {name:'改革开放', year:1978},
];
const HISTORY_QS = [
  {tag:'历史每日一题 · 中国近代史', text:'以下关于新文化运动的表述，正确的是？',
   options:[{k:'A',v:'以“民主”“科学”为旗帜'},{k:'B',v:'主张全盘继承传统文化'},{k:'C',v:'首先兴起于上海'},{k:'D',v:'以胡适创办《新青年》为标志'}], answer:'A',
   explain:'新文化运动以陈独秀创办的《新青年》为阵地，倡导民主与科学，1915 年起源于北京，故选 A。'},
  {tag:'历史每日一题 · 世界近代史', text:'新航路开辟后，世界贸易中心由地中海沿岸转移到？',
   options:[{k:'A',v:'大西洋沿岸'},{k:'B',v:'太平洋沿岸'},{k:'C',v:'印度洋沿岸'},{k:'D',v:'红海沿岸'}], answer:'A',
   explain:'新航路开辟后欧洲商业重心由地中海转移到大西洋沿岸，故选 A。'},
  {tag:'历史每日一题 · 中国现代史', text:'我国经济体制改革首先从哪个领域开始？',
   options:[{k:'A',v:'农村'},{k:'B',v:'城市'},{k:'C',v:'国有企业'},{k:'D',v:'金融业'}], answer:'A',
   explain:'1978 年后改革首先从农村起步，推行家庭联产承包责任制，故选 A。'},
];
let flashIdx = 0;
function renderFlashcards(){
  const row = $('#flashRow'); if(!row) return;
  row.innerHTML = '';
  for(let k=0;k<3;k++){
    const c = FLASHCARDS[(flashIdx + k) % FLASHCARDS.length];
    const div = document.createElement('div');
    div.className = 'flash-card';
    div.innerHTML = `<div class="flash-inner">
      <div class="flash-face flash-front"><small>${c.tag}</small>${c.front}</div>
      <div class="flash-face flash-back">${c.back}</div>
    </div>`;
    div.addEventListener('click', () => { div.classList.toggle('flipped'); sfx.click(); });
    row.appendChild(div);
  }
}
function renderTimelineGame(){
  const box = $('#timelineGame'); if(!box) return;
  const items = [...TIMELINE_EVENTS].sort(()=>Math.random()-.5);
  box._items = items;
  box._sorted = [...items].sort((a,b)=>a.year-b.year);
  box._idx = 0;
  box.innerHTML = items.map((e,i)=>`<button class="tl-item" data-i="${i}">${e.name}</button>`).join('');
  $('#timelineResult').textContent = '';
  $('#timelineHint').textContent = '按时间先后点击下列事件（从早到晚）';
  box.querySelectorAll('.tl-item').forEach(btn => btn.addEventListener('click', () => timelinePick(box, +btn.dataset.i, btn)));
}
function timelinePick(box, i, btn){
  if(btn.classList.contains('picked')) return;
  if(box._items[i] === box._sorted[box._idx]){
    btn.classList.add('picked');
    box._idx++;
    sfx.click();
    if(box._idx >= box._items.length){
      state.coins += 10; state.coinsEarned += 10;
      $('#timelineResult').textContent = '🎉 全对！时间轴大师！+10 学习币';
      sfx.victory(); confetti(); renderPet(); renderReportPreview();
    }
  } else {
    btn.classList.add('wrong');
    setTimeout(()=>btn.classList.remove('wrong'), 450);
    sfx.wrong();
    $('#timelineResult').textContent = '❌ 顺序不对，再想想～（越早的事件越靠前）';
  }
}
function renderHistoryQ(){
  const q = HISTORY_QS[state.histQIdx];
  const box = $('#historyQBox'); if(!box) return;
  box.innerHTML = `
    <span class="dq-tag">${q.tag} · ${state.histQIdx+1}/${HISTORY_QS.length}</span>
    <div class="dq-text">${q.text}</div>
    <div class="dq-options"></div>
    <div class="dq-feedback"></div>`;
  const opts = box.querySelector('.dq-options');
  q.options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'dq-option';
    b.textContent = `${o.k}. ${o.v}`;
    b.addEventListener('click', () => {
      opts.querySelectorAll('.dq-option').forEach(x=>x.disabled=true);
      if(o.k === q.answer){
        b.classList.add('correct');
        box.querySelector('.dq-feedback').textContent = '🎉 回答正确！+20 XP +8 学习币！' + q.explain;
        state.xp += 20; state.xpGained += 20; state.coins += 8; state.coinsEarned += 8;
        sfx.complete(); confetti(); renderPet(); renderStatic(); renderReportPreview();
      } else {
        b.classList.add('wrong');
        box.querySelector('.dq-feedback').textContent = '😅 正确答案是 ' + q.answer + '。' + q.explain;
        addWrong({subj:'历史', text:q.text, opts:q.options.map(o=>o.v), a:q.options.findIndex(o=>o.k===q.answer), exp:q.explain});
        sfx.wrong();
      }
    });
    opts.appendChild(b);
  });
}


/* ============ 长笛艺考训练计划 ============ */
const MUSIC_TASKS = [
  {name:'长音与音阶练习', min:20},
  {name:'练习曲《科勒35首》', min:30},
  {name:'乐曲《渔舟唱晚》分段', min:20},
  {name:'视唱练耳', min:15},
  {name:'乐理基础复习', min:15},
];
const MUSIC_EXAM_DATES = [
  {t:'2027.09', n:'艺考报名'},
  {t:'2027.12', n:'省统考 · 长笛'},
  {t:'2028.03', n:'校考冲刺'},
  {t:'2028.06', n:'高考文化课'},
];
const MUSIC_QS = [
  {q:'C 大调音阶的第Ⅲ级音是？', opts:['E','D','F','G'], a:0, exp:'C 大调音阶 C-D-E-F-G-A-B，第Ⅲ级为 E。'},
  {q:'长笛属于哪一族乐器？', opts:['木管乐器','铜管乐器','弦乐器','打击乐器'], a:0, exp:'长笛属木管族（虽现代多为金属制）。'},
  {q:'4/4 拍中，一个全音符等于几个四分音符？', opts:['4 个','2 个','3 个','8 个'], a:0, exp:'全音符 = 4 个四分音符。'},
  {q:'力度记号 “f” 表示？', opts:['强','弱','中强','渐强'], a:0, exp:'f（forte）= 强。'},
  {q:'音程 C–G 是几度？', opts:['纯五度','纯四度','大三度','小六度'], a:0, exp:'C 到 G 共 5 个音级，为纯五度。'},
  {q:'长笛记谱通常使用哪种谱号？', opts:['高音谱号','低音谱号','中音谱号','次中音谱号'], a:0, exp:'长笛以高音谱号记谱为主。'},
];
function renderMusicPlan(){
  const box = $('#musicCountdown'); if(!box) return;
  const target = new Date(CONFIG.artExamDate);
  const days = Math.max(0, Math.ceil((target - Date.now()) / 86400000));
  box.textContent = days + ' 天';
  $('#musicStreak').textContent = state.musicStreak;
  $('#musicTimeline').innerHTML = MUSIC_EXAM_DATES.map(d=>`<li><b>${d.t}</b> ${d.n}</li>`).join('');
  const ul = $('#musicTasks'); ul.innerHTML = '';
  MUSIC_TASKS.forEach((t,i) => {
    const done = !!state.musicDone[i];
    const li = document.createElement('li');
    li.className = 'mt-item' + (done?' done':'');
    li.innerHTML = `<span class="mt-check ${done?'checked':''}">${done?'✓':''}</span><span class="mt-name">${t.name}</span><span class="mt-min">${t.min}min</span>`;
    li.querySelector('.mt-check').addEventListener('click', () => toggleMusicTask(i));
    ul.appendChild(li);
  });
  const allDone = MUSIC_TASKS.every((_,i)=>state.musicDone[i]);
  const btn = $('#musicPunchBtn');
  btn.disabled = state.musicPunchDone;
  btn.textContent = state.musicPunchDone ? '✅ 今日已打卡' : '🎶 完成练笛打卡（+15 学习币）';
  if(state.musicPunchDone){ $('#musicPunchMsg').textContent = '🎉 今日练笛打卡完成，艺考路上越来越稳！'; }
  else if(allDone){ $('#musicPunchMsg').textContent = '🏆 清单已全部完成，点击打卡领取奖励！'; }
  else { $('#musicPunchMsg').textContent = ''; }
}
function toggleMusicTask(i){
  state.musicDone[i] = !state.musicDone[i];
  if(state.musicDone[i]){
    state.coins += 5; state.coinsEarned += 5;
    sfx.click(); renderPet(); renderReportPreview();
  }
  renderMusicPlan();
}
function musicPunch(){
  if(state.musicPunchDone) return;
  state.musicPunchDone = true;
  state.musicStreak++;
  state.coins += 15; state.coinsEarned += 15;
  sfx.victory(); confetti(); renderPet(); renderReportPreview();
  renderMusicPlan();
}
function renderMusicQ(){
  const q = MUSIC_QS[state.musicQIdx];
  const box = $('#musicQBox'); if(!box) return;
  box.innerHTML = `
    <span class="dq-tag">乐理小测 · ${state.musicQIdx+1}/${MUSIC_QS.length}</span>
    <div class="dq-text">${q.q}</div>
    <div class="dq-options"></div>
    <div class="dq-feedback"></div>`;
  const opts = box.querySelector('.dq-options');
  q.opts.forEach((o,i) => {
    const b = document.createElement('button');
    b.className = 'dq-option';
    b.textContent = `${String.fromCharCode(65+i)}. ${o}`;
    b.addEventListener('click', () => {
      opts.querySelectorAll('.dq-option').forEach(x=>x.disabled=true);
      if(i === q.a){
        b.classList.add('correct');
        box.querySelector('.dq-feedback').textContent = '🎉 乐理全对！+8 学习币。' + q.exp;
        state.coins += 8; state.coinsEarned += 8;
        sfx.complete(); confetti(); renderPet(); renderReportPreview();
      } else {
        b.classList.add('wrong');
        opts.querySelectorAll('.dq-option')[q.a].classList.add('correct');
        box.querySelector('.dq-feedback').textContent = '😅 正确答案是 ' + String.fromCharCode(65+q.a) + '。' + q.exp;
        addWrong({subj:'乐理', text:q.q, opts:q.opts, a:q.a, exp:q.exp});
        sfx.wrong();
      }
    });
    opts.appendChild(b);
  });
}

/* ============ 校考曲目库 / 乐理真题卷 / 错题魔王 ============ */
const REPERTOIRE = [
  {name:'D 大调长笛协奏曲', composer:'莫扎特',     cat:'协奏曲',   diff:5},
  {name:'长笛协奏曲',       composer:'卡尔·尼尔森', cat:'协奏曲',   diff:5},
  {name:'卡门幻想曲',       composer:'博尔纳',     cat:'协奏曲',   diff:5},
  {name:'G 大调长笛奏鸣曲', composer:'巴赫',       cat:'奏鸣曲',   diff:4},
  {name:'十二首幻想曲 No.1', composer:'泰勒曼',     cat:'练习曲',   diff:3},
  {name:'24 首随想曲 No.1', composer:'帕格尼尼',   cat:'练习曲',   diff:5},
  {name:'渔舟唱晚',         composer:'中国作品',    cat:'中国作品', diff:4},
  {name:'幽思',             composer:'中国作品',    cat:'中国作品', diff:3},
  {name:'牧童短笛',         composer:'贺绿汀改编',  cat:'中国作品', diff:4},
  {name:'茉莉花幻想曲',     composer:'中国作品',    cat:'中国作品', diff:4},
];
const THEORY_QS = [
  {q:'C 大调的关系小调是？', opts:['a 小调','d 小调','e 小调','g 小调'], a:0, exp:'C 大调的关系小调为 a 小调（下方小三度）。'},
  {q:'附点四分音符的时值是？', opts:['一拍半','两拍','三拍','半拍'], a:0, exp:'附点四分音符 = 1 + 1/2 拍，即一拍半。'},
  {q:'音程 C–E 是？', opts:['大三度','小三度','纯四度','大二度'], a:0, exp:'C 到 E 共 3 个音级、2 个全音，为大三度。'},
  {q:'五线谱中高音谱号又称？', opts:['G 谱号','F 谱号','C 谱号','D 谱号'], a:0, exp:'高音谱号由 G 音位置演化而来，称 G 谱号。'},
  {q:'3/8 拍中每小节有几拍？', opts:['3 拍','8 拍','6 拍','1 拍'], a:0, exp:'3/8 拍每小节 3 拍，以八分音符为一拍。'},
  {q:'“cresc.” 表示？', opts:['渐强','渐弱','强后突弱','重音'], a:0, exp:'crescendo = 渐强。'},
  {q:'纯八度的音程包含几个音级？', opts:['8 个','7 个','9 个','6 个'], a:0, exp:'纯八度含 8 个音级。'},
  {q:'D 大调调号中的升号有几个？', opts:['2 个','1 个','3 个','4 个'], a:0, exp:'D 大调为 #F、#C 两个升号。'},
  {q:'四分休止符的时值等于？', opts:['四分音符','八分音符','二分音符','全音符'], a:0, exp:'四分休止符 = 四分音符的时值。'},
  {q:'旋律小调上行时哪两级音升高？', opts:['第Ⅵ、Ⅶ级','第Ⅴ、Ⅵ级','第Ⅲ、Ⅳ级','第Ⅶ、Ⅰ级'], a:0, exp:'旋律小调上行升高第Ⅵ、Ⅶ级。'},
  {q:'“rit.” 表示？', opts:['渐慢','渐快','回原速','自由延长'], a:0, exp:'ritardando = 渐慢。'},
  {q:'大调自然音阶中半音位于？', opts:['Ⅲ–Ⅳ、Ⅶ–Ⅰ','Ⅰ–Ⅱ、Ⅳ–Ⅴ','Ⅱ–Ⅲ、Ⅵ–Ⅶ','Ⅳ–Ⅴ、Ⅶ–Ⅰ'], a:0, exp:'大调自然音阶半音在 Ⅲ–Ⅳ 与 Ⅶ–Ⅰ。'},
];

/* ---------- 错题入库 + 错题魔王 ---------- */
function addWrong(item){
  const key = item.subj + '|' + item.text;
  if(!state.wrongBank.some(w => w.subj + '|' + w.text === key)){
    state.wrongBank.push(item);
    state.wrongMax = Math.max(state.wrongMax, state.wrongBank.length);
    renderWrongBoss();
  }
}
function renderWrongBoss(){
  const card = $('#wrongBossCard'); if(!card) return;
  const box = $('#wrongBossQ');
  const full = state.wrongMax*300 + 500;
  const hp = state.wrongBank.length*300 + 500;
  if(!state.wrongBank.length){
    box.innerHTML = '<p style="text-align:center;color:var(--ink-2);padding:10px">🎉 暂无错题！保持全对，错题魔王就不会出现。</p>';
    $('#wrongBossHpFill').style.width = '0%';
    $('#wrongBossHpText').textContent = 'HP 0 / 0';
    $('#wrongBossLeft').textContent = 0;
    $('#wrongBossLog').innerHTML = state.wrongMax ? '<div>🏆 错题魔王已被击败，再接再厉保持全对！</div>' : '';
    return;
  }
  $('#wrongBossHpFill').style.width = Math.max(4, Math.round(hp/full*100)) + '%';
  $('#wrongBossHpText').textContent = `HP ${hp} / ${full}`;
  $('#wrongBossLeft').textContent = state.wrongBank.length;
  const q = state.wrongBank[0];
  box.innerHTML = `
    <span class="dq-tag">❌ 错题复习 · ${q.subj}</span>
    <div class="dq-text">${q.text}</div>
    <div class="dq-options">${q.opts.map((o,i)=>`<button class="dq-option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div>
    <div class="dq-feedback" id="wrongBossFb"></div>`;
  box.querySelectorAll('.dq-option').forEach(b => b.addEventListener('click', () => wrongBossAnswer(+b.dataset.i, b, q)));
}
function wrongBossAnswer(i, btn, q){
  $$('#wrongBossQ .dq-option').forEach(b=>b.disabled=true);
  const fb = $('#wrongBossFb');
  if(i === q.a){
    btn.classList.add('correct');
    state.wrongBank = state.wrongBank.filter(w => !(w.subj===q.subj && w.text===q.text));
    state.coins += 5; state.coinsEarned += 5;
    fb.textContent = '🎉 做对了！错题魔王受到重创 -300 HP！';
    sfx.bossHit();
    const fig = $('#wrongBossFigure');
    fig.classList.add('shake');
    setTimeout(()=>fig.classList.remove('shake'), 450);
    if(!state.wrongBank.length){
      state.xp += 50; state.xpGained += 50; state.bossKilled++;
      $('#wrongBossLog').innerHTML = '<div>🏆 错题魔王被击败！错题全部清零，+50 XP！</div>';
      sfx.victory(); confetti(); renderStatic();
    }
    setTimeout(renderWrongBoss, 900);
  } else {
    btn.classList.add('wrong');
    $$('#wrongBossQ .dq-option')[q.a].classList.add('correct');
    fb.textContent = '😅 还差一点：' + q.exp;
    sfx.wrong();
    setTimeout(renderWrongBoss, 1600);
  }
  renderPet(); renderReportPreview();
}

/* ---------- 校考曲目库 ---------- */
function renderRepertoire(){
  const grid = $('#repGrid'); if(!grid) return;
  grid.innerHTML = '';
  const list = REPERTOIRE.filter(r => state.repFilter==='all' || r.cat===state.repFilter);
  const practiced = Object.keys(state.repDone).length;
  $('#repCount').textContent = `已练 ${practiced} 首`;
  list.forEach(r => {
    const n = state.repDone[r.name] || 0;
    const done = n >= 3;
    const div = document.createElement('div');
    div.className = 'rep-card';
    div.innerHTML = `
      <div class="rp-name">${r.name}</div>
      <div class="rp-composer">${r.composer} · ${r.cat}</div>
      <div class="rp-meta"><span class="rp-stars">${'⭐'.repeat(r.diff)}${'☆'.repeat(5-r.diff)}</span><span>难度 ${r.diff}/5</span></div>
      <div class="rp-progress"><i style="width:${Math.min(100, n/3*100)}%"></i></div>
      <div class="rp-practice">
        <span class="rp-count">练习 ${n}/3 次 ${done?'✓ 达标':''}</span>
        <button class="rp-btn ${done?'done':''}" data-name="${r.name}">${done?'✅ 已完成':'🎶 练习 +1'}</button>
      </div>`;
    if(!done) div.querySelector('.rp-btn').addEventListener('click', () => practiceRepertoire(r));
    grid.appendChild(div);
  });
}
function practiceRepertoire(r){
  state.repDone[r.name] = (state.repDone[r.name]||0) + 1;
  state.coins += 5; state.coinsEarned += 5;
  const n = state.repDone[r.name];
  sfx.complete();
  if(n >= 3){ sfx.victory(); confetti(); }
  renderRepertoire(); renderPet(); renderReportPreview();
}

/* ---------- 乐理真题卷 ---------- */
function renderTheoryPaper(){
  const box = $('#theoryPaper'); if(!box) return;
  if(state.paper.phase==='intro'){
    box.innerHTML = `
      <div class="paper-intro">
        <div class="pi-title">📝 乐理真题卷</div>
        <div class="pi-sub">共 10 题 · 建议 15 分钟内完成 · 覆盖调式 / 音程 / 节奏 / 记号</div>
        <button class="btn btn-primary" id="paperStartBtn">🚀 开始答题</button>
      </div>`;
    $('#paperStartBtn').addEventListener('click', paperStart);
  } else if(state.paper.phase==='quiz'){
    const q = state.paper.qs[state.paper.qi];
    box.innerHTML = `
      <div class="pk-progress">第 ${state.paper.qi+1} / 10 题 · 已答对 ${state.paper.correct} 题</div>
      <div class="daily-question">
        <div class="dq-text">${q.q}</div>
        <div class="dq-options">${q.opts.map((o,i)=>`<button class="dq-option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div>
        <div class="dq-feedback" id="paperFb"></div>
      </div>`;
    box.querySelectorAll('.dq-option').forEach(b => b.addEventListener('click', () => paperAnswer(+b.dataset.i, b)));
  } else {
    const grade = state.paper.correct>=9?'优秀':state.paper.correct>=7?'良好':state.paper.correct>=6?'及格':'需努力';
    const gcls = state.paper.correct>=7?'good':state.paper.correct>=6?'mid':'bad';
    box.innerHTML = `
      <div class="paper-grade ${gcls}">${state.paper.correct>=7?'🎉':'📝'} 得分 ${state.paper.correct}/10 · ${grade}</div>
      <div class="paper-score">
        <div class="ps-box"><b>${state.paper.correct}</b><span>答对</span></div>
        <div class="ps-box"><b>${10-state.paper.correct}</b><span>答错</span></div>
      </div>
      <p style="text-align:center;font-size:13.5px;color:var(--ink-2)">获得 ${state.paper.correct*3} 学习币${state.paper.correct>=7?' · 乐理掌握度提升！':''}</p>
      <div class="paper-review">${state.paper.review.map(r=>`<div class="pr-item"><b class="${r.ok?'ok':'no'}">${r.ok?'✓':'✗'}</b> ${r.q} ${r.ok?'':'→ '+r.answer}</div>`).join('')}</div>
      <div style="text-align:center;margin-top:12px"><button class="btn btn-primary" id="paperAgainBtn">🔄 再考一张</button></div>`;
    $('#paperAgainBtn').addEventListener('click', () => { state.paper.phase='intro'; renderTheoryPaper(); });
  }
}
function paperStart(){
  state.paper.qs = [...THEORY_QS].sort(()=>Math.random()-.5).slice(0,10);
  state.paper.qi = 0; state.paper.correct = 0; state.paper.review = [];
  state.paper.phase = 'quiz'; renderTheoryPaper(); sfx.click();
}
function paperAnswer(i, btn){
  const q = state.paper.qs[state.paper.qi];
  $$('#theoryPaper .dq-option').forEach(b=>b.disabled=true);
  const ok = i === q.a;
  state.paper.review.push({q:q.q, ok, answer:q.opts[q.a]});
  if(ok){
    btn.classList.add('correct'); state.paper.correct++;
    sfx.complete();
  } else {
    btn.classList.add('wrong');
    $$('#theoryPaper .dq-option')[q.a].classList.add('correct');
    addWrong({subj:'乐理', text:q.q, opts:q.opts, a:q.a, exp:q.exp});
    sfx.wrong(); renderWrongBoss();
  }
  $('#paperFb').textContent = ok ? '🎉 正确！' + q.exp : '😅 正确答案是 ' + String.fromCharCode(65+q.a) + '。' + q.exp;
  setTimeout(() => {
    state.paper.qi++;
    if(state.paper.qi >= state.paper.qs.length){
      state.paper.phase = 'result';
      state.coins += state.paper.correct*3; state.coinsEarned += state.paper.correct*3;
      if(state.paper.correct >= 7) sfx.victory();
    }
    renderTheoryPaper(); renderPet(); renderReportPreview(); renderStatic();
  }, 1300);
}
