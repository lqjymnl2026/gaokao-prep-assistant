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
  {name:'语文', emoji:'📖', pct:82, color:'#ef4444'},
  {name:'数学', emoji:'📐', pct:76, color:'#6366f1'},
  {name:'英语', emoji:'🔤', pct:88, color:'#10b981'},
  {name:'历史', emoji:'📜', pct:84, color:'#d97706'},
  {name:'政治', emoji:'🏛️', pct:80, color:'#0891b2'},
  {name:'地理', emoji:'🌏', pct:74, color:'#7c3aed'},
];

let tasks = [
  {id:1, subject:'语文', name:'背诵《琵琶行》第 1–3 段', xp:30, done:true,  min:25},
  {id:2, subject:'数学', name:'三角函数课后练习 P87',   xp:40, done:true,  min:45},
  {id:3, subject:'英语', name:'背诵 Unit 6 词汇 30 个', xp:25, done:true,  min:20},
  {id:4, subject:'物理', name:'受力分析专题 10 题',     xp:35, done:false, min:40},
  {id:5, subject:'化学', name:'氧化还原反应错题订正',   xp:35, done:false, min:30},
];

const BADGES = [
  {emoji:'🔥', name:'连续打卡',  sub:'连学 12 天',   locked:false},
  {emoji:'📐', name:'数学新星',  sub:'正确率 85%',   locked:false},
  {emoji:'🧠', name:'单词达人',  sub:'词汇 5000+',   locked:false},
  {emoji:'⏱️', name:'时间管理',  sub:'专注 25h/周',  locked:false},
  {emoji:'🚀', name:'进阶学霸',  sub:'本周 21 星',   locked:false},
  {emoji:'🌱', name:'早起打卡',  sub:'7:00 前学习',  locked:false},
  {emoji:'📚', name:'书山有路',  sub:'累计 50h',     locked:false},
  {emoji:'🧪', name:'实验达人',  sub:'物理实验全对', locked:false},
  {emoji:'🎯', name:'精准答题',  sub:'正确率 90%+',  locked:false},
  {emoji:'🦉', name:'夜猫学霸',  sub:'22:00 后学习', locked:true},
  {emoji:'🏆', name:'周榜前三',  sub:'本周第 8',     locked:true},
  {emoji:'💯', name:'满分学霸',  sub:'单科 100',     locked:true},
  {emoji:'👑', name:'学神降临',  sub:'月考年级前 10',locked:true},
  {emoji:'🧭', name:'全科高手',  sub:'六科全绿',     locked:true},
  {emoji:'🗡️', name:'通关勇者',  sub:'闯关 100 关',  locked:true},
  {emoji:'🌈', name:'全勤之星',  sub:'整月无缺席',   locked:true},
];

const PLAN = [
  {tasks:[{s:'数学', n:'数列求和专题', m:40, d:true},{s:'英语', n:'词汇 Unit 6 · 30 词', m:20, d:true}]},
  {tasks:[{s:'语文', n:'文言文实词 15 个', m:25, d:true},{s:'历史', n:'中国古代史·中央集权', m:40, d:true}]},
  {tasks:[{s:'数学', n:'三角函数图像与性质', m:45, d:true},{s:'政治', n:'经济生活·价格与消费', m:20, d:true}]},
  {tasks:[{s:'英语', n:'阅读理解 2 篇精读', m:30, d:true},{s:'地理', n:'自然地理·大气环流', m:35, d:true}]},
  {tasks:[{s:'语文', n:'背诵《琵琶行》', m:25, d:true},{s:'数学', n:'课后练习 P87', m:45, d:true},{s:'英语', n:'Unit 6 词汇', m:20, d:true},{s:'历史', n:'近代史·列强侵华', m:40, d:false},{s:'政治', n:'哲学·唯物论基础', m:30, d:false}]},
  {tasks:[{s:'数学', n:'周测错题重做', m:60, d:false},{s:'地理', n:'人文地理·城市化', m:40, d:false}]},
  {tasks:[{s:'全科', n:'本周复盘 + 下周计划', m:60, d:false},{s:'英语', n:'作文积累 3 个句型', m:20, d:false}]},
];

const MAPS = {
  math: [
    {name:'集合与逻辑', emoji:'🧮', pct:92},{name:'函数与导数', emoji:'📈', pct:74},
    {name:'三角函数',   emoji:'📐', pct:81},{name:'数列',       emoji:'🔢', pct:88},
    {name:'不等式',     emoji:'⚖️', pct:66},{name:'立体几何',   emoji:'🧊', pct:78},
    {name:'解析几何',   emoji:'🎯', pct:62},{name:'统计与概率', emoji:'🎲', pct:90},
    {name:'平面向量',   emoji:'➡️', pct:84},{name:'复数',       emoji:'🌀', pct:95},
  ],
  history: [
    {name:'古代史·中央集权', emoji:'🏯', pct:78},{name:'古代史·经济文化', emoji:'🌾', pct:82},
    {name:'近代史·列强侵华', emoji:'⚔️', pct:65},{name:'近代史·近代化',   emoji:'🚂', pct:72},
    {name:'世界史·希腊罗马', emoji:'🏛️', pct:88},{name:'世界近代史·革命', emoji:'🗽', pct:74},
    {name:'现代史·世界大战', emoji:'🎖️', pct:80},{name:'史料实证·素养',   emoji:'📜', pct:84},
    {name:'阶段特征·时间轴', emoji:'🗓️', pct:90},{name:'论述题·答题模板', emoji:'✍️', pct:62},
  ],
  politics: [
    {name:'商品与货币',     emoji:'💰', pct:86},{name:'价格与消费',     emoji:'🛒', pct:80},
    {name:'企业与劳动者',   emoji:'🏭', pct:76},{name:'市场经济',       emoji:'⚖️', pct:72},
    {name:'公民与政府',     emoji:'🏛️', pct:84},{name:'民主制度',       emoji:'🗳️', pct:78},
    {name:'文化传承',       emoji:'🎭', pct:88},{name:'唯物论与辩证法', emoji:'🔮', pct:70},
    {name:'认识论',         emoji:'🧠', pct:74},{name:'时政素材积累',   emoji:'📰', pct:82},
  ],
  geography: [
    {name:'地球运动',       emoji:'🌍', pct:80},{name:'大气环流',       emoji:'🌪️', pct:68},
    {name:'水循环',         emoji:'💧', pct:82},{name:'地表形态',       emoji:'⛰️', pct:76},
    {name:'人口与城市',     emoji:'🏙️', pct:84},{name:'农业与工业',     emoji:'🌾', pct:78},
    {name:'交通与商业',     emoji:'🚄', pct:72},{name:'中国地理',       emoji:'🗺️', pct:86},
    {name:'世界地理',       emoji:'🌐', pct:81},{name:'读图与区位分析', emoji:'🧭', pct:58},
  ],
};

const QUESTS = [
  {emoji:'📖', name:'晨读打卡 · 文言文',        meta:'每天 7:00 前完成 · 语文', stars:3, done:true},
  {emoji:'🔤', name:'单词闯关 · 30 词',         meta:'限时 10 分钟 · 英语',     stars:2, done:true},
  {emoji:'🧮', name:'数学小题限时赛',            meta:'15 题 / 20 分钟',         stars:3, done:true},
  {emoji:'📜', name:'历史大事年表挑战',          meta:'50 个事件排序',           stars:2, done:false},
  {emoji:'🏛️', name:'政治原理默写擂台',          meta:'30 个原理',               stars:1, done:false},
  {emoji:'🗺️', name:'地理图表判读挑战',          meta:'20 幅地图',               stars:2, done:false},
];

const LEADERBOARD = [
  {name:'陈一鸣', xp:4280, rank:'💎'},{name:'林雨桐', xp:4110, rank:'💎'},{name:'周子昂', xp:3980, rank:'🥇'},
  {name:'小宇（我）', xp:3860, me:true, rank:'🥇'},{name:'王思远', xp:3720, rank:'🥇'},{name:'赵欣然', xp:3590, rank:'🥈'},
];

const RANKS = [
  {name:'青铜', emoji:'🥉', min:0},
  {name:'白银', emoji:'🥈', min:1500},
  {name:'黄金', emoji:'🥇', min:3500},
  {name:'铂金', emoji:'🎖️', min:6000},
  {name:'钻石', emoji:'💎', min:9000},
  {name:'王者', emoji:'👑', min:13000},
];

const PET = {
  level:7, xp:280, xpMax:400, moodIdx:0,
  moods:['😄 今天心情很好，夸你专注！','😋 吃得饱饱的，充满能量！','🥰 最喜欢和你一起学习了','😴 有点困，喂点东西就精神啦','🤩 哇，你进步好快！'],
  log:'小火龙摇了摇尾巴，等你带它学习～',
};

const DAILY_Q = {
  subject:'数学', tag:'每日一题 · 函数与导数',
  text:'已知函数 f(x) = x³ − 3x，则 f(x) 在区间 [−2, 2] 上的最大值是？',
  options:[{k:'A', v:'2'},{k:'B', v:'3'},{k:'C', v:'4'},{k:'D', v:'−2'}],
  answer:'A',
  explain:"f'(x) = 3x² − 3 = 3(x−1)(x+1)，极值点 x = ±1；计算端点与极值：f(−2) = −2，f(−1) = 2，f(1) = −2，f(2) = 2，故最大值为 2，选 A。",
};

const RECORDS = [
  {date:'8/14', subject:'数学', content:'三角函数图像与性质 · 习题 10 道', type:'练习', min:45, done:100, master:82},
  {date:'8/14', subject:'语文', content:'背诵《琵琶行》第 1–3 段',        type:'背诵', min:25, done:100, master:90},
  {date:'8/14', subject:'英语', content:'Unit 6 核心词汇 30 个',          type:'背诵', min:20, done:100, master:88},
  {date:'8/14', subject:'历史', content:'近代史 · 列强侵华梳理（进行中）', type:'复习', min:40, done:60,  master:65},
  {date:'8/13', subject:'政治', content:'哲学 · 唯物论基本概念',          type:'复习', min:35, done:100, master:72},
  {date:'8/13', subject:'数学', content:'函数单调性与最值 · 限时小测',    type:'测验', min:30, done:100, master:76},
  {date:'8/13', subject:'英语', content:'阅读理解 2 篇 + 生词摘抄',       type:'练习', min:30, done:100, master:85},
  {date:'8/12', subject:'历史', content:'中国古代史 · 中央集权',          type:'练习', min:40, done:100, master:78},
  {date:'8/12', subject:'语文', content:'文言文实词 15 个 + 翻译',        type:'复习', min:30, done:100, master:86},
  {date:'8/12', subject:'地理', content:'大气环流与气候类型',             type:'复习', min:35, done:100, master:68},
  {date:'8/11', subject:'数学', content:'数列通项与求和 · 错题订正',      type:'练习', min:50, done:100, master:88},
  {date:'8/11', subject:'政治', content:'经济生活 · 企业与劳动者',        type:'练习', min:30, done:100, master:76},
  {date:'8/10', subject:'英语', content:'时态专项语法填空 15 题',         type:'练习', min:25, done:100, master:83},
  {date:'8/10', subject:'地理', content:'中国地理分区 · 周测',            type:'测验', min:40, done:100, master:80},
];

const TIMELINE = [
  {time:'06:40', text:'英语单词打卡 30 个',       xp:'+25'},
  {time:'07:00', text:'晨读《琵琶行》· 语文',      xp:'+30'},
  {time:'09:10', text:'数学三角函数练习完成',      xp:'+40'},
  {time:'14:00', text:'历史近代史梳理 · 晚清',     xp:'+35'},
  {time:'16:20', text:'政治哲学错题订正',          xp:'+35'},
  {time:'20:30', text:'晚自习 · 今日复盘',         xp:'+20'},
];

const DIMS = [
  {name:'任务完成度', val:86, color:'#6366f1'},
  {name:'练习正确率', val:82, color:'#10b981'},
  {name:'学习坚持度', val:90, color:'#f59e0b'},
  {name:'专注度',     val:78, color:'#06b6d4'},
  {name:'学习效率',   val:84, color:'#ec4899'},
];

const DURATION = [72, 95, 110, 80, 130, 105, 96];
const DUR_LABELS = ['8/10 周一','8/11 周二','8/12 周三','8/13 周四','8/14 周五','8/15 周六','8/16 周日'];
const PIE = [
  {name:'数学', min:150, color:'#6366f1'},
  {name:'语文', min:120, color:'#ef4444'},
  {name:'历史', min:100, color:'#d97706'},
  {name:'英语', min:90,  color:'#10b981'},
  {name:'政治', min:80,  color:'#0891b2'},
  {name:'地理', min:60,  color:'#7c3aed'},
];
const TREND = [72, 75, 74, 78, 80, 79, 82, 86];
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
  xp: 3250, xpMax: 4000, level: 18,
  contentFilter: 'all',
  rankXp: 5200, coins: 32, combo: 4, forest: 3, chestOpened: false,
  todayFocusMin: 86, xpGained: 135, coinsEarned: 12, bossKilled: 1, petPlays: 3, pkWins: 1,
  sound: true, music: false, title: '早读战神',
  dungeon: { idx: 0, hp: 1000, defeated: false, log: [] },
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
  const target = new Date('2028-06-07T09:00:00+08:00');
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
  $('#scoreRing').style.setProperty('--p', 86);
  $('#scoreRingNum').textContent = 86;
  $('#doneDonutPct').textContent = '86%';
  $('#questBarFill').style.width = '70%';
  $('#questStarCount').textContent = 21;
  $('#focusBarFill').style.width = '72%';
  $('#scoreBarFill').style.width = '86%';
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
  const pct = Math.round(done/tasks.length*100);
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
  LEADERBOARD.forEach(l => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="lb-name">${l.rank} ${l.name}${l.me?' 🌟':''}</span><span class="lb-xp">${l.xp} XP</span>`;
    if(l.me) li.style.background = '#eef0ff';
    ol.appendChild(li);
  });
}

function renderDailyQ(){
  const box = $('#dailyQuestion');
  box.innerHTML = `
    <span class="dq-tag">${DAILY_Q.tag}</span>
    <div class="dq-text">${DAILY_Q.text}</div>
    <div class="dq-options" id="dqOptions"></div>
    <div class="dq-feedback" id="dqFeedback"></div>`;
  const opts = $('#dqOptions');
  DAILY_Q.options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'dq-option';
    b.textContent = `${o.k}. ${o.v}`;
    b.addEventListener('click', () => {
      $$('#dqOptions .dq-option').forEach(x=>x.disabled=true);
      if(o.k === DAILY_Q.answer){
        b.classList.add('correct');
        $('#dqFeedback').innerHTML = '🎉 回答正确！太厉害了，+20 XP 已到账。' + DAILY_Q.explain;
        confetti();
      } else {
        b.classList.add('wrong');
        $('#dqFeedback').innerHTML = '😅 差一点点～正确答案是 ' + DAILY_Q.answer + '。' + DAILY_Q.explain;
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
  {emoji:'🗡️', name:'错题终结者', cond:'累计订正错题 50 道',    unlocked:true},
  {emoji:'🔤', name:'词汇暴君',   cond:'词汇量达 6000',         unlocked:true},
  {emoji:'🏃', name:'专注苦行僧', cond:'单日专注 240 分钟',     unlocked:true},
  {emoji:'⭐', name:'满星通关',   cond:'单章副本满星',          unlocked:true},
  {emoji:'📜', name:'历史学究',   cond:'历史掌握度 ≥85%',      unlocked:true},
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
  {chapter:'第一章 · 数学', emoji:'🐲', name:'数列魔龙',   hp:1000, coins:20,  xp:80,  title:'数学守卫者'},
  {chapter:'第二章 · 历史', emoji:'⏳', name:'时光吞噬者', hp:1200, coins:25,  xp:100, title:'历史守卫者'},
  {chapter:'第三章 · 政治', emoji:'🗿', name:'规则巨像',   hp:1200, coins:25,  xp:100, title:'政治守卫者'},
  {chapter:'第四章 · 地理', emoji:'🌪️', name:'风暴领主',   hp:1400, coins:30,  xp:120, title:'地理守卫者'},
  {chapter:'第五章 · 英语', emoji:'🧙', name:'语法巫师',   hp:1400, coins:30,  xp:120, title:'英语守卫者'},
  {chapter:'终章 · 高考决战', emoji:'👹', name:'高考大魔王', hp:3000, coins:100, xp:500, title:'高考王者'},
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
  box.innerHTML = `
    <div class="rp-mini"><div class="rpm-val">${done}/${tasks.length}</div><div class="rpm-label">完成任务</div></div>
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
  const good = (done/tasks.length>=0.6?1:0)+(state.combo>=4?1:0)+(state.bossKilled>=1?1:0)+(state.todayFocusMin>=80?1:0)+(state.pkWins>=1?1:0);
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
      <div class="pk-progress">第 ${pk.qi+1} / 5 题 · ${q.subj}</div>
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
  const pool = [...PK_QUESTIONS].sort(()=>Math.random()-.5).slice(0,5);
  pk.qs = pool; pk.qi = 0; pk.correct = 0;
  const opp = PK_OPPONENTS[pk.oppIdx];
  pk.oppScore = Math.min(5, Math.max(2, Math.round(5 - opp.level*0.6 + Math.random()*1.5)));
  pk.phase = 'quiz'; renderPK(); sfx.click();
}
function pkAnswer(i, btn){
  const q = pk.qs[pk.qi];
  $$('#pkBox .dq-option').forEach(b=>b.disabled=true);
  if(i === q.a){ btn.classList.add('correct'); pk.correct++; sfx.complete(); }
  else {
    btn.classList.add('wrong'); sfx.wrong();
    $$('#pkBox .dq-option')[q.a].classList.add('correct');
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
];
const TIMELINE_EVENTS = [
  {name:'秦统一六国', year:-221},
  {name:'鸦片战争爆发', year:1840},
  {name:'辛亥革命', year:1911},
  {name:'五四运动', year:1919},
  {name:'新中国成立', year:1949},
  {name:'改革开放', year:1978},
];
const HISTORY_Q = {
  tag:'历史每日一题 · 中国近代史',
  text:'以下哪一事件标志着中国新民主主义革命的开端？',
  options:[{k:'A', v:'鸦片战争'},{k:'B', v:'五四运动'},{k:'C', v:'辛亥革命'},{k:'D', v:'南昌起义'}],
  answer:'B',
  explain:'五四运动（1919年）是一次彻底的反帝反封建的爱国运动，是中国新民主主义革命的开端。',
};
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
  const box = $('#historyQBox'); if(!box) return;
  box.innerHTML = `
    <span class="dq-tag">${HISTORY_Q.tag}</span>
    <div class="dq-text">${HISTORY_Q.text}</div>
    <div class="dq-options"></div>
    <div class="dq-feedback"></div>`;
  const opts = box.querySelector('.dq-options');
  HISTORY_Q.options.forEach(o => {
    const b = document.createElement('button');
    b.className = 'dq-option';
    b.textContent = `${o.k}. ${o.v}`;
    b.addEventListener('click', () => {
      opts.querySelectorAll('.dq-option').forEach(x=>x.disabled=true);
      if(o.k === HISTORY_Q.answer){
        b.classList.add('correct');
        box.querySelector('.dq-feedback').textContent = '🎉 回答正确！+20 XP +8 学习币！' + HISTORY_Q.explain;
        state.xp += 20; state.xpGained += 20; state.coins += 8; state.coinsEarned += 8;
        sfx.complete(); confetti(); renderPet(); renderStatic(); renderReportPreview();
      } else {
        b.classList.add('wrong');
        box.querySelector('.dq-feedback').textContent = '😅 正确答案是 ' + HISTORY_Q.answer + '。' + HISTORY_Q.explain;
        sfx.wrong();
      }
    });
    opts.appendChild(b);
  });
}
