// ================================================================
//  📜 story.js — 独立剧情数据，修改此处不影响界面
//  使用方法：在 index.html 中用 <script src="story.js"></script> 引入
//
//  v2.0.1 修复：
//    · 补全成就初始化和映射
//    · 修复缺失的成就触发点
//    · 新增“空相无相”剧情线
// ================================================================

// ================================================================
//  1. 环境与时间系统（数据定义）
// ================================================================

window.WEATHER_TYPES = {
  storm:    { name: '雷雨', icon: '⛈' },
  rain:     { name: '小雨', icon: '🌧' },
  overcast: { name: '阴天', icon: '☁' },
  fog:      { name: '浓雾', icon: '🌫' },
  clear:    { name: '晴朗', icon: '☀' },
  snow:     { name: '飞雪', icon: '❄' },
  gale:     { name: '狂风', icon: '🌬' },
  drought:  { name: '大旱', icon: '🔥' }
};

window.TIME_OF_DAY = {
  late_night: { name: '深夜', icon: '🌑', order: 0 },
  dawn:       { name: '黎明', icon: '🌅', order: 1 },
  morning:    { name: '清晨', icon: '🌄', order: 2 },
  noon:       { name: '正午', icon: '☀',  order: 3 },
  dusk:       { name: '黄昏', icon: '🌇', order: 4 },
  night:      { name: '入夜', icon: '🌙', order: 5 }
};

window.MOON_PHASES = {
  new_moon:   { name: '新月',   icon: '🌑', desc: '妖力最弱，灵台最清' },
  wax_cres:   { name: '蛾眉月', icon: '🌒', desc: '妖力渐生，宜静修' },
  first_q:    { name: '上弦月', icon: '🌓', desc: '阴阳各半，宜问卜' },
  wax_gib:    { name: '盈凸月', icon: '🌔', desc: '妖力渐盛，心易动' },
  full_moon:  { name: '满月',   icon: '🌕', desc: '妖力鼎盛，宜化形' },
  wan_gib:    { name: '亏凸月', icon: '🌖', desc: '盛极而衰，宜收心' },
  last_q:     { name: '下弦月', icon: '🌗', desc: '阴阳逆转，宜反思' },
  wan_cres:   { name: '残月',   icon: '🌘', desc: '妖力将竭，宜守藏' }
};

window.ENV_EFFECTS = {
  storm:    '雷气激荡，妖力紊乱',
  rain:     '雨水涤荡，灵台微明',
  fog:      '雾障重重，方位难辨',
  snow:     '寒气封脉，行动迟缓',
  gale:     '风刃割魂，法术削弱',
  drought:  '旱火灼心，道行暗耗',
  clear:    '天朗气清，万物明朗',
  overcast: '阴云低压，心绪沉郁',
  full_moon:  '满月加成，化形之机',
  new_moon:   '新月无光，宜于内省'
};

// ================================================================
//  2. 场景数据（所有剧情文本 + 选项）
//  格式：{ texts: [...], choices: [...], env?: { weather, timeOfDay, day, moonPhase } }
//  env 字段可选：用于驱动环境/时间状态栏
//  type: narrator / speaker / system / witness / env （env为新增类型，环境描写）
// ================================================================

window.SCENES = {

  // ========== 起始 ==========
  'start': {
    texts: [
      { type: 'narrator', content: '雷雨夜，山路泥泞。' },
      { type: 'narrator', content: '你是一只修炼了五百年的黄鼠狼精，今日正是你的讨封之期。' },
      { type: 'narrator', content: '只要能让人说一声"像人"或"像仙"，你便能化形成功，脱离妖身。' },
      { type: 'narrator', content: '雨幕中，远远走来几个人影。你该向谁开口？' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '向前面那个赶路的书生讨封', nextScene: 'scholar_encounter' },
      { text: '向路边的顽童讨封', nextScene: 'kid_encounter' },
      { text: '再找找其他人', nextScene: 'wait_more_1' }
    ]
  },

  // ========== 书生线 ==========
  'scholar_encounter': {
    texts: [
      { type: 'narrator', content: '你从树后闪身而出，拦住了那位赶路的书生。' },
      { type: 'speaker', content: '书生猛地停步，伞掉在地上："何...何方妖怪！莫要害我！"' },
      { type: 'narrator', content: '你尽力作出一副和善模样，拱手道："这位公子，请问你看我像人还是像仙？"' },
      { type: 'speaker', content: '书生脸色惨白，连连后退："像...像妖怪！一身骚气，还不快滚！"' },
      { type: 'narrator', content: '他捡起石块朝你扔来，转身就跑。' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '仓皇逃离', nextScene: 'fail_scholar_end', action: 'unlock_fail_scholar' },
      { text: '追上去，拼命解释', nextScene: 'scholar_follow' },
      { text: '愤怒质问，为何以貌取人', nextScene: 'scholar_angry' }
    ]
  },

  'scholar_angry': {
    texts: [
      { type: 'narrator', content: '你怒火上涌，挡在书生面前厉声道："我修行五百年，从未害人，你凭什么骂我妖怪！"' },
      { type: 'speaker', content: '书生被你的气势震慑，跌坐泥水中，颤抖道："你……你莫要吃我……"' },
      { type: 'narrator', content: '你看着他那副可怜模样，心中怒火渐消，却也感到一阵悲凉。' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '冷静下来，好言相劝', nextScene: 'scholar_angry_calm' },
      { text: '甩袖而去，不再纠缠', nextScene: 'fail_scholar_end', action: 'unlock_fail_scholar' }
    ]
  },

  'scholar_angry_calm': {
    texts: [
      { type: 'narrator', content: '你深吸一口气，压下怒火，轻声道："罢了，是我吓到你了。公子请起，我不害人。"' },
      { type: 'speaker', content: '书生惊魂未定，却见你态度诚恳，渐渐不再发抖："你……当真是修行的灵兽？"' },
      { type: 'narrator', content: '你点头，将山中修炼之事简略道来。书生听罢，竟露出几分好奇。' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '再次恳请讨封', nextScene: 'scholar_follow' },
      { text: '不再强求，转身离去', nextScene: 'wait_more_2' }
    ]
  },

  'scholar_follow': {
    texts: [
      { type: 'narrator', content: '你不甘心，追上去挡在他面前，口吐人言："公子莫怕，我修行五百年从不害人，只求一句认可。"' },
      { type: 'speaker', content: '书生跌坐泥地，见你并无恶意，颤抖着问："你……你真的不偷鸡？"' },
      { type: 'narrator', content: '你摇头，将近日捕鼠护粮之事道来。书生渐渐平静，眼中竟有几分敬意。' },
      { type: 'speaker', content: '他沉吟良久："我自幼读书，从不信妖邪，今日见你通人性、守本分，倒像是……像是文曲星君座下的灵兽。"' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '拜谢书生', nextScene: 'scholar_test' }
    ]
  },

  'scholar_test': {
    texts: [
      { type: 'speaker', content: '书生又说："虽然你通人性，但我仍需试你一试。方才匆忙，我将祖传手札遗落在山神庙，你能替我寻回吗？"' },
      { type: 'narrator', content: '他眼中带着期盼，也有几分犹豫。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '立刻动身去山神庙寻找', nextScene: 'scholar_search' },
      { text: '面露难色，表示太远', nextScene: 'scholar_refuse' }
    ]
  },

  'scholar_refuse': {
    texts: [
      { type: 'narrator', content: '你犹豫不前，书生失望地摇头："连这点诚意都没有，终究是妖性未脱。"' },
      { type: 'speaker', content: '他转身离去，再也没回头。你呆立雨中，讨封失败。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'scholar_search': {
    texts: [
      { type: 'narrator', content: '你冒雨奔向山神庙。庙中阴森，手札果然在香案下。' },
      { type: 'narrator', content: '正要取时，一只野猫窜出，叼起手札就跑。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '变回原形追赶野猫', nextScene: 'scholar_chase' },
      { text: '用术法定住野猫', nextScene: 'scholar_magic' }
    ]
  },

  'scholar_chase': {
    texts: [
      { type: 'narrator', content: '你化作黄鼠狼疾追，在山林里与野猫缠斗。虽然夺回手札，但身上多处抓伤。' },
      { type: 'narrator', content: '书生见你浑身湿透、带着伤将手札捧回，大为感动。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '呈上手札', nextScene: 'star_ending', action: 'unlock_star' }
    ]
  },

  'scholar_magic': {
    texts: [
      { type: 'narrator', content: '你掐诀念咒，野猫僵在原地，你轻松取回手札。' },
      { type: 'speaker', content: '书生见你法术精妙，却眉头微皱："用法术强取，终非正道……不过你确实守信。"' },
      { type: 'narrator', content: '他想了想，仍然说出那句认可，但文气弱了几分。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '接受认可', nextScene: 'star_ending', action: 'unlock_star' }
    ]
  },

  // ========== 顽童线 ==========
  'kid_encounter': {
    texts: [
      { type: 'narrator', content: '你悄悄靠近那个蹲在路边玩泥巴的顽童。' },
      { type: 'speaker', content: '顽童抬头看见你，眼睛一亮："呀，好大一只黄鼠狼！你的尾巴真好看！"' },
      { type: 'narrator', content: '你心中暗喜，低声问道："小娃娃，你看我像什么？像人吗？"' },
      { type: 'speaker', content: '顽童歪头想了想："像……像一只会说话的黄鼠狼！我阿婆说黄鼠狼会偷鸡，你是不是来偷我的泥人？"' },
      { type: 'narrator', content: '顽童抓起泥巴朝你扔来，咯咯笑着跑开了。' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '落荒而逃', nextScene: 'fail_kid_end', action: 'unlock_fail_kid' },
      { text: '变成小猫逗他开心', nextScene: 'kid_play' }
    ]
  },

  'kid_play': {
    texts: [
      { type: 'narrator', content: '你灵机一动，使出小法术变成一只小花猫，喵喵叫着蹭顽童的腿。' },
      { type: 'speaker', content: '顽童惊喜："哇！你还会变猫！太好玩了！"他抱起你，完全忘了刚才的害怕。' },
      { type: 'narrator', content: '顽童带你回家，他的奶奶是个慈祥老人，见猫通人性，笑着说："这猫有灵性，像保家的黄大仙呢。"' },
      { type: 'narrator', content: '你心头一暖。奶奶留你过夜，说夜里常有野狗来偷鸡。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '主动提出守夜', nextScene: 'farm_night' },
      { text: '安心睡下', nextScene: 'farm_sleep' }
    ]
  },

  'farm_night': {
    texts: [
      { type: 'narrator', content: '深夜，果然有两只野狗窜入院子。你现出原形，与野狗搏斗。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '奋力驱赶', nextScene: 'farm_brave' },
      { text: '害怕躲藏', nextScene: 'farm_fail' }
    ]
  },

  'farm_brave': {
    texts: [
      { type: 'narrator', content: '你勇猛异常，赶跑了野狗，自己受了轻伤。奶奶早起发现鸡舍无损，对你连连道谢。' },
      { type: 'speaker', content: '奶奶摸着你的头："真像我们家的保家仙，以后就留下吧。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '留在农家', nextScene: 'farmer_village' },
      { text: '辞别奶奶，继续修行', nextScene: 'leave_grandma' }
    ]
  },

  'farm_sleep': {
    texts: [
      { type: 'narrator', content: '你睡得太沉，野狗咬死了两只鸡。奶奶虽未责怪，但眼中失望难掩。' },
      { type: 'narrator', content: '你自觉无颜，悄悄离开了村子。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'farm_fail': {
    texts: [
      { type: 'narrator', content: '你吓得躲进柴堆，野狗咬死数只鸡，还撞坏了篱笆。' },
      { type: 'speaker', content: '奶奶叹气："终究是畜生，保不了家。"你羞愧难当，连夜离去。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'leave_grandma': {
    texts: [
      { type: 'narrator', content: '你在奶奶和顽童的挽留声中转身，重新走入清晨的山雾。' },
      { type: 'narrator', content: '人间烟火虽暖，但你心中仍有讨封的执念。只是这一次，脚步比来时沉重了许多。' },
      { type: 'narrator', content: '你想起奶奶慈祥的笑容，想起顽童天真的话语，忽然觉得——即使不化人形，能被这样真诚地对待，似乎也没什么不好。' },
      { type: 'narrator', content: '前方出现岔路：一条通往深山精怪的聚集之地，另一条通往青衣人所在的山道，还有一条路通往你修炼了五百年的洞府。' },
      { type: 'narrator', content: '还有一个你从未注意的方向——雾里隐约露出一角飞檐，似乎是座荒废已久的老宅。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '回洞府修行，不再执着讨封', nextScene: 'true_ending' },
      { text: '去精怪聚集处寻找同类', nextScene: 'wild_follow' },
      { text: '继续前行，寻找青衣人', nextScene: 'true_encounter_second' },
      { text: '朝那角飞檐走去，看看是什么', nextScene: 'ruins_path' }
    ]
  },

  // ========== 等待 & 多角色 ==========
  'wait_more_1': {
    texts: [
      { type: 'narrator', content: '你觉得书生和顽童都非有缘之人，决定再等等。' },
      { type: 'narrator', content: '雨越下越大，山路上积起水洼，你的皮毛已湿透。' },
      { type: 'narrator', content: '就在你几乎要放弃时，雨幕中缓缓走来一道青色身影，撑着油纸伞，步履从容。' },
      { type: 'narrator', content: '另有一个农夫挑着柴，从山道拐角冒雨跑来。' },
      { type: 'narrator', content: '不远处的树下，还有个老道士在避雨，手持拂尘，闭目养神。' },
      { type: 'narrator', content: '山林深处，隐约传来一声悠长的呼唤，似有同类在召唤。' },
      { type: 'narrator', content: '远处的雾里，似乎还有一处废弃的老宅，残破的飞檐在雨中若隐若现。' },
      { type: 'narrator', content: '山道尽头，隐约可见一位身披蓑衣的剑客，正擦拭着手中的剑。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '向青衣人讨封', nextScene: 'true_encounter_first' },
      { text: '向农夫讨封', nextScene: 'farmer_encounter' },
      { text: '向老道士讨封', nextScene: 'taoist_encounter' },
      { text: '向剑客询问', nextScene: 'sword_encounter' },
      { text: '再等等，或许还有其他人', nextScene: 'wait_more_2' },
      { text: '循着山林深处的呼唤而去', nextScene: 'wild_call' },
      { text: '独自朝老宅方向走去', nextScene: 'ruins_path' }
    ]
  },

  'wild_call': {
    texts: [
      { type: 'narrator', content: '那呼唤声若隐若现，像是用兽语在低吟。你心中一动——这是同类的气息。' },
      { type: 'narrator', content: '你循声穿过密林，雨水打在树叶上沙沙作响。越往深处，妖气越浓。' },
      { type: 'narrator', content: '忽然，一只老狐从树后探出头来，口吐人言："小黄仙，今夜是讨封之夜，也是精怪集会之夜。你可愿来看看？"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '跟随老狐前往', nextScene: 'wild_follow' },
      { text: '婉拒，回到山路继续等待', nextScene: 'wait_more_2' }
    ]
  },

  'wild_follow': {
    texts: [
      { type: 'narrator', content: '老狐引你穿过一片迷雾，眼前豁然开朗——山坳中竟聚集了数十只精怪。' },
      { type: 'narrator', content: '有狐妖、蛇精、树魅，甚至还有一只黑熊怪。它们围坐在篝火旁，正在议论讨封之事。' },
      { type: 'speaker', content: '一只白面狐妖笑道："又来了个新面孔。小黄仙，你可想好了——成了人，便要受人间规矩束缚；成了仙，更要守天条戒律。何不留在山中，做自由自在的妖王？"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '心动，询问妖王之道', nextScene: 'wild_gathering' },
      { text: '摇头，坚持讨封之路', nextScene: 'wait_more_2' }
    ]
  },

  'wild_gathering': {
    texts: [
      { type: 'speaker', content: '白面狐妖拍掌道："好！我等精怪虽无神籍，却逍遥自在。山中灵药、洞天福地，皆可享用。"' },
      { type: 'speaker', content: '黑熊怪瓮声瓮气道："俺修炼三百年，从未想过讨封。做人有什么好？做妖才痛快！"' },
      { type: 'narrator', content: '众精怪纷纷附和，篝火映照下，每张面孔都透着野性与自由。' },
      { type: 'speaker', content: '老狐凑近你耳边："你若留下，以你五百年道行，必能成为一方妖王。如何？"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '留下，成为山中妖王', nextScene: 'demon_king_ending', action: 'unlock_demon_king' },
      { text: '犹豫再三，还是告辞', nextScene: 'wait_more_2' },
      { text: '邀请精怪们一同去讨封', nextScene: 'wild_debate' }
    ]
  },

  'wild_debate': {
    texts: [
      { type: 'narrator', content: '你站起身，朗声道："诸位道友，既已修炼多年，何不一同去讨封？或许都能得成正果。"' },
      { type: 'speaker', content: '众精怪面面相觑。白面狐妖冷笑："讨封？人类凭什么决定我们的命运？"' },
      { type: 'speaker', content: '老狐叹道："年轻人有志向是好事，但我等早已看透。你去吧，若不成，随时回来。"' },
      { type: 'narrator', content: '你辞别精怪们，重新回到山路。雨势已小，青衣人仍在远处静静伫立。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '走向青衣人', nextScene: 'true_encounter_second' },
      { text: '回到精怪聚集处', nextScene: 'demon_king_ending', action: 'unlock_demon_king' }
    ]
  },

  // ========== 道士线 ==========
  'taoist_encounter': {
    texts: [
      { type: 'narrator', content: '你走近老道士，他睁开眼，目光如电。' },
      { type: 'speaker', content: '道士："贫道观你妖气缠绕，却无血光，可是来讨封的？"' },
      { type: 'narrator', content: '你连忙作揖，说明来意。' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '恭敬请教', nextScene: 'taoist_god' },
      { text: '怀疑他是骗子，转身离开', nextScene: 'wait_more_2' },
      { text: '请问道长可否收我为徒', nextScene: 'taoist_disciple' }
    ]
  },

  'taoist_disciple': {
    texts: [
      { type: 'speaker', content: '道士抚须而笑："收徒？贫道门下已有弟子三百，个个都是人。收一只黄鼠狼，倒是头一遭。"' },
      { type: 'narrator', content: '他打量你片刻，又道："不过，你若能通过贫道的考验，破例收你又有何妨？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '欣然接受考验', nextScene: 'taoist_test' },
      { text: '觉得太过麻烦，告辞', nextScene: 'wait_more_2' }
    ]
  },

  'taoist_test': {
    texts: [
      { type: 'narrator', content: '道士从袖中取出一面铜镜，镜中映出你黄鼠狼的原形。' },
      { type: 'speaker', content: '道士："此镜能照见本心。你若能在镜前静坐一炷香，不起妄念，便算通过。"' },
      { type: 'narrator', content: '你盘腿坐下，铜镜中无数幻象涌现——有鲜美的鸡肉、温暖的巢穴、也有对人类的怨恨与不甘。' },
      { type: 'narrator', content: '你一一放下，心如止水。一炷香后，道士满意地点头。' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '通过考验，拜入师门', nextScene: 'taoist_test_pass' },
      { text: '心中仍有杂念，承认失败', nextScene: 'taoist_test_fail' }
    ]
  },

  'taoist_test_pass': {
    texts: [
      { type: 'speaker', content: '道士大笑："好！好一只灵兽！从今日起，你便是我门下弟子。"' },
      { type: 'narrator', content: '他拂尘一挥，清光笼罩，你顿觉灵台清明，道行精进。' },
      { type: 'speaker', content: '道士颔首："你虽未讨封，却得了道缘。我看你像——散仙。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '叩谢恩师', nextScene: 'god_ending_favor', action: 'unlock_god' }
    ]
  },

  'taoist_test_fail': {
    texts: [
      { type: 'narrator', content: '你无法静心，镜中幻象扰得你心烦意乱。最终只得睁眼认输。' },
      { type: 'speaker', content: '道士叹道："缘分未到。你去吧，或许另有机缘。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '回到山路继续等待', nextScene: 'wait_more_2' },
      { text: '重新开始', nextScene: 'start', action: 'reset' }
    ]
  },

  'taoist_god': {
    texts: [
      { type: 'speaker', content: '道士点头："你虽为妖，心存善念，我看你像山中散仙。"' },
      { type: 'narrator', content: '拂尘一挥，一道清光笼罩你，你感觉脱胎换骨，竟直接化作人形。' },
      { type: 'speaker', content: '道士笑道："你我缘分至此，好自为之。"说罢化作清风而去。' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '拜谢仙长', nextScene: 'god_ending_favor', action: 'unlock_god' }
    ]
  },

  // ========== 青衣人主线 ==========
  'true_encounter_first': {
    texts: [
      { type: 'narrator', content: '你从树后走出，雨水顺着皮毛滴落。' },
      { type: 'speaker', content: '青衣人停下脚步，伞微微前倾："深夜拦路，可是有事？"' },
      { type: 'narrator', content: '你作揖道："先生，我修行五百年，今日讨封，恳请您看我像人还是像仙？"' },
      { type: 'speaker', content: '青衣人凝视你许久，目光温和："我看你眼中尚有迷茫，似求道者，却未脱兽性。像——山中修行的精怪，离人仙尚远。"' },
      { type: 'speaker', content: '"但你心诚，若愿随我修行，或可成正果。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 2, moonPhase: 'first_q' },
    choices: [
      { text: '叩首拜谢，愿随修行', nextScene: 'god_ending_favor', action: 'unlock_god' },
      { text: '心有不甘，想再等等他人', nextScene: 'wait_more_2' }
    ]
  },

  'wait_more_2': {
    texts: [
      { type: 'narrator', content: '你按捺住心中的焦躁，继续躲在树后等待。' },
      { type: 'narrator', content: '雨势渐小，山路却再无行人。' },
      { type: 'narrator', content: '那位青衣人并未走远，他停在不远处，伞沿微抬，似乎在望着你藏身的方向。' },
      { type: 'speaker', content: '他轻声开口："雨夜立良久，可是在等什么人？"' },
      { type: 'narrator', content: '他顿了顿，又道："若不嫌弃，可随我去一处避雨——山后有座老宅，废弃多年，倒也清静。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dawn', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '走向他，实话实说', nextScene: 'true_encounter_second' },
      { text: '犹豫不决，再等下去', nextScene: 'wait_final' },
      { text: '随他去老宅避雨', nextScene: 'ruins_path' }
    ]
  },

  'true_encounter_second': {
    texts: [
      { type: 'narrator', content: '你走到青衣人面前，雨水打湿了你的全身，你却感到前所未有的平静。' },
      { type: 'speaker', content: '青衣人微微一笑："你等了许久，就为了问我一句像什么？"' },
      { type: 'speaker', content: '你点头："恳请先生指点。"' },
      { type: 'speaker', content: '他收起伞，任由雨丝洒落："你修行五百年，可还记得自己最初的模样？那时你未想成仙，未想成人，只知在山间自在奔跑。"' },
      { type: 'speaker', content: '"我看你，像这山间的风雨，来去随性。何必非要像人、像仙？你本就是黄小仙。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '恍然大悟，不再执念', nextScene: 'true_ending' },
      { text: '仍想成人，恳请成全', nextScene: 'mortal_ending', action: 'unlock_mortal' },
      { text: '怀疑他的用意，质问', nextScene: 'suspicious_ending' },
      { text: '请先生指点修行之道', nextScene: 'true_guidance' },
      { text: '问他：可否去你住处细谈', nextScene: 'ruins_path' }
    ]
  },

  'true_guidance': {
    texts: [
      { type: 'speaker', content: '青衣人颔首："你愿聆听，我便多说几句。道不在形，而在心。你为讨封执着五百年，可曾静心感受山间清风、林间明月？"' },
      { type: 'narrator', content: '他伸手接住雨滴，雨珠在掌心化作雾气。' },
      { type: 'speaker', content: '"你若能放下形骸，便可得大自在；若仍想体验人间，我也可成全；若想随我修行，亦是缘分。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '放下执念，逍遥山水', nextScene: 'true_ending' },
      { text: '愿入人间，经历轮回', nextScene: 'mortal_ending', action: 'unlock_mortal' },
      { text: '恳请收入门下', nextScene: 'god_ending_favor', action: 'unlock_god' },
      { text: '随先生去那处老宅一坐', nextScene: 'ruins_path' }
    ]
  },

  // ========== 老宅线 ==========
  'ruins_path': {
    texts: [
      { type: 'narrator', content: '你跟着青衣人，沿着长满青苔的石阶拾级而上。' },
      { type: 'narrator', content: '雨雾深处，一座黑瓦老宅半隐半现。飞檐上的瑞兽早已残缺，门楣上的匾额被风雨剥蚀得只剩一个"宅"字。' },
      { type: 'narrator', content: '你嗅了嗅——这里既无人气，也无妖气，只有一种极其古老的、被时间腌透了的味道。' },
      { type: 'speaker', content: '青衣人推门，门轴发出长长的叹息："进来吧。我在这山中独居，已不知多少年。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '跨进门槛', nextScene: 'ruins_arrival' },
      { text: '在门口犹豫，感觉哪里不对', nextScene: 'suspicious_ending' },
      { text: '问先生：你是人是仙？', nextScene: 'ruins_arrival' }
    ]
  },

  'ruins_arrival': {
    texts: [
      { type: 'narrator', content: '宅内比外头看着要整洁。堂屋正中悬着一盏长明灯，火焰不动，像是被某种力量定住。' },
      { type: 'narrator', content: '墙上挂着一幅画——画中是一只奔跑的黄鼠狼，眼神清澈，毛发如金。' },
      { type: 'narrator', content: '你愣住了。那只黄鼠狼的眉眼，竟与你如此相似。' },
      { type: 'speaker', content: '青衣人给你倒了一盏冷茶，平静地说："这是我三百年前画的。当时我路过此山，遇见一只刚开灵智的小东西。"' },
      { type: 'narrator', content: '他看了你一眼："你不必急着讨封。先坐下，听我说完一个故事。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '乖乖坐下，听他讲', nextScene: 'ruins_meeting' },
      { text: '质问他：你三百年前就认识我？', nextScene: 'ruins_meeting' },
      { text: '转身想逃', nextScene: 'severed_ending', action: 'unlock_severed' }
    ]
  },

  'ruins_meeting': {
    texts: [
      { type: 'narrator', content: '青衣人缓缓开口。' },
      { type: 'speaker', content: '"三百年前，我只是个迷路的书生，误入此山。是你——还是黄鼠狼的你——领我走出迷阵，救了我一命。"' },
      { type: 'speaker', content: '"我那时说：你像人。也像仙。我便成了一缕执念，留在这座山，等你真正化形的那一天。"' },
      { type: 'speaker', content: '"五百年过去，你从一只小东西修炼成有情有义、有善有念的灵。可你一直想问别人：你像什么？"' },
      { type: 'speaker', content: '"我等你，等得雨都下了三百场。"' },
      { type: 'narrator', content: '他站起身，长明灯的火焰忽然跳了一下。' },
      { type: 'speaker', content: '"黄小仙，讨封的话，不必再问了。讨封的意思，是要别人承认你。可我今晚，想换一种说法——"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '屏息倾听', nextScene: 'witness_ending', action: 'unlock_witness' }
    ]
  },

  // ========== 结局：见证 ==========
  'witness_ending': {
    texts: [
      { type: 'narrator', content: '青衣人走到你面前，目光澄澈，像三百年前那个雨夜。' },
      { type: 'witness', content: '"我看你，就是黄小仙。"' },
      { type: 'witness', content: '"不是任何其他的存在。不是人，无需人的认可；不是仙，不慕仙的逍遥。你就是你，这片山野的灵，这座老宅的魂，我行至水穷处遇到的……唯一的‘见证’。"' },
      { type: 'narrator', content: '我说完了。废墟里死一般寂静。' },
      { type: 'narrator', content: '你听懂了。又似乎什么都没懂。' },
      { type: 'narrator', content: '那只长明灯的火焰忽然燃得极旺，画上的黄鼠狼竟像活过来一般，眼里泛起水光。' },
      { type: 'narrator', content: '你低头——自己的皮毛正在变得柔软、变得明亮，像被三百年的月光洗过一遍。' },
      { type: 'narrator', content: '没有金光灌顶，没有天雷地火，没有神籍仙箓。' },
      { type: 'narrator', content: '只有一种感觉：你第一次，不再是别人的影子、不再是"像"什么。' },
      { type: 'narrator', content: '你就是黄小仙。' },
      { type: 'narrator', content: '你抬起头。屋外雨停了。' },
      { type: 'narrator', content: '青衣人朝你轻轻点头，没有再说一个字——他本就是为你而留，这一刻，缘已圆满。' },
      { type: 'narrator', content: '你推门而出。山还是那座山，月色如洗，清风徐来。' },
      { type: 'narrator', content: '你不入神籍，不落凡尘，从此以本我之姿，逍遥于山野之间。' },
      { type: 'narrator', content: '多年后，山中传说有一只黄鼠狼，能口吐人言，却从不害人，只在山间自由奔跑。' },
      { type: 'narrator', content: '而那座老宅，从此再也无人见过。' },
      { type: 'system', content: '成就：无对无错，善良依旧' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'severed_ending': {
    texts: [
      { type: 'narrator', content: '你转身想逃，可门已经合上。' },
      { type: 'narrator', content: '青衣人没有追。他只是平静地坐回原处，端起那盏冷茶。' },
      { type: 'speaker', content: '"走吧。缘起缘灭，不必强求。"' },
      { type: 'narrator', content: '你破窗而出，奔回山林。身后老宅轰然倒塌，化作一地瓦砾。' },
      { type: 'narrator', content: '你回头，再也寻不到那片飞檐。' },
      { type: 'narrator', content: '从那以后，你再也没讨到封——但每逢雨夜，你总会在某个山坳里，闻到一盏冷茶的清香。' },
      { type: 'system', content: '结局：断缘而去' }
    ],
    env: { weather: 'rain', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ========== 农夫线 ==========
  'farmer_encounter': {
    texts: [
      { type: 'narrator', content: '你拦住农夫，他吓了一跳，柴担差点掉地。' },
      { type: 'speaker', content: '农夫瞪大眼："黄……黄大仙？俺娘说过，山里有修行的黄仙，不能得罪。"' },
      { type: 'narrator', content: '你作揖道："大哥，我修行五百年，今日讨封，你看我像人还是像仙？"' },
      { type: 'speaker', content: '农夫挠头，憨厚一笑："俺看您像山里的土地爷，护着咱们庄稼人。像，像保家仙！"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '感激不尽，随农夫回村', nextScene: 'farmer_village' },
      { text: '婉拒好意，继续修行', nextScene: 'wait_more_2' },
      { text: '不欲入村，但请他引路去山后看看', nextScene: 'ruins_path' }
    ]
  },

  'farmer_village': {
    texts: [
      { type: 'narrator', content: '农夫热情地引你进了村子。村民们见一只黄鼠狼口吐人言，先是害怕，后来听说你能护家保粮，纷纷称奇。' },
      { type: 'narrator', content: '村长亲自为你安排了住处——一座小小的土地庙，香火虽不旺，却也干净。' },
      { type: 'speaker', content: '农夫的妻子端来一碗热粥："黄大仙，村里野狗多，鸡鸭常被叼走，您若能帮着看守，全村都念您的好。"' },
      { type: 'narrator', content: '你看着这些朴实的村民，心中涌起一股暖意。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '安心做保家仙，护佑村庄', nextScene: 'farmer_ending', action: 'unlock_farmer' },
      { text: '主动帮村民解决难题', nextScene: 'farmer_help' },
      { text: '在村中多住些时日，感受人间烟火', nextScene: 'farmer_stay' }
    ]
  },

  'farmer_stay': {
    texts: [
      { type: 'narrator', content: '你在村中住了下来。白日里帮村民看护田地，夜里在土地庙中打坐修炼。' },
      { type: 'narrator', content: '村里有个年轻的绣娘，每日都会来庙前供上一束野花。她说，自从你来了，村里的鸡再也没丢过。' },
      { type: 'speaker', content: '绣娘轻声问："黄大仙，你……你会一直留在这里吗？"' },
      { type: 'narrator', content: '她的眼睛里有星星，你忽然觉得，人间的情意比仙界的清冷更暖。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '点头，愿意长久守护这个村庄', nextScene: 'mortal_love_ending', action: 'unlock_love' },
      { text: '摇头，你终究不属于这里', nextScene: 'farmer_ending', action: 'unlock_farmer' },
      { text: '想去看看山后的老宅', nextScene: 'ruins_path' }
    ]
  },

  'farmer_help': {
    texts: [
      { type: 'narrator', content: '你听闻村外山道上近来有山贼出没，已经劫了好几户人家的粮食。' },
      { type: 'narrator', content: '村民们敢怒不敢言，官府又不管。你决定出手相助。' },
      { type: 'narrator', content: '当夜，你埋伏在山道旁的灌木丛中。果然，三个山贼提着刀，正往村子方向摸去。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '施展法术吓退山贼', nextScene: 'farmer_scare' },
      { text: '变回原形偷袭山贼', nextScene: 'farmer_ambush' },
      { text: '正面现身，以理服人', nextScene: 'bandit_encounter' }
    ]
  },

  'farmer_scare': {
    texts: [
      { type: 'narrator', content: '你掐诀念咒，顿时阴风阵阵，林中鬼火闪烁。山贼吓得屁滚尿流，丢下刀就跑。' },
      { type: 'narrator', content: '村民们得知后欢呼雀跃，将你奉为真正的保家仙。从此香火鼎盛。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '接受供奉，守护村庄', nextScene: 'farmer_ending', action: 'unlock_farmer' }
    ]
  },

  'farmer_ambush': {
    texts: [
      { type: 'narrator', content: '你化作一道黄影，在山贼脚下来回穿梭，咬得他们哇哇大叫。' },
      { type: 'narrator', content: '山贼头子挥刀乱砍，一刀砍在树干上，刀身弹回，反倒伤了自己的手臂。' },
      { type: 'speaker', content: '山贼们惊恐万分："有妖怪！快跑！"转眼间跑得无影无踪。' },
      { type: 'narrator', content: '村民闻讯赶来，将你高高举起，连声称赞。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '留在村庄，享受荣耀', nextScene: 'farmer_ending', action: 'unlock_farmer' }
    ]
  },

  'bandit_encounter': {
    texts: [
      { type: 'narrator', content: '你化作人形，从林中走出，挡在山贼面前。' },
      { type: 'speaker', content: '山贼头子一愣，随即狞笑："哪来的野人？敢挡老子的路！"' },
      { type: 'narrator', content: '你合掌道："诸位壮士，村中皆是贫苦百姓，何苦为难他们？若缺银两，山中自有药材可采。"' },
      { type: 'speaker', content: '山贼头子大怒："少废话！兄弟们，砍了他！"' },
      { type: 'narrator', content: '三把刀同时向你劈来。你本可以闪避，但身后不远处，绣娘正躲在树后瑟瑟发抖。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '舍身挡刀，护住绣娘', nextScene: 'sacrifice_choice', action: 'unlock_sacrifice' },
      { text: '闪身避开，用法术反击', nextScene: 'farmer_scare' }
    ]
  },

  'sacrifice_choice': {
    texts: [
      { type: 'narrator', content: '你咬紧牙关，挺身上前。刀锋划过你的身体，鲜血涌出。' },
      { type: 'speaker', content: '绣娘尖叫一声冲了出来："黄大仙！不要！"' },
      { type: 'narrator', content: '山贼们被你的血震慑，面面相觑，竟不敢再动手。' },
      { type: 'narrator', content: '你倒在地上，感觉五百年的道行正在飞速流逝。但绣娘安全了，村民们也安全了。' },
      { type: 'speaker', content: '绣娘抱着你，泪如雨下："你为什么这么傻……你明明可以逃的……"' },
      { type: 'narrator', content: '你用尽最后的力气，蹭了蹭她的手心，然后闭上了眼睛。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'night', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '安然赴死', nextScene: 'sacrifice_ending', action: 'unlock_sacrifice' }
    ]
  },

  'sacrifice_ending': {
    texts: [
      { type: 'narrator', content: '你的身躯化作点点荧光，飘散在夜空中。五百年修为，尽归天地。' },
      { type: 'narrator', content: '村民们为你立了碑，碑上刻着「义兽黄仙之墓」。绣娘每日都来上香，泪水浸透了碑前的泥土。' },
      { type: 'narrator', content: '多年后，有人说在月圆之夜，能看见一只黄鼠狼的影子在村口守望。' },
      { type: 'system', content: '成就：舍身成仁' }
    ],
    env: { weather: 'storm', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ========== 等待最终 ==========
  'wait_final': {
    texts: [
      { type: 'narrator', content: '你犹豫着，始终不敢上前。' },
      { type: 'narrator', content: '青衣人轻叹一声，转身离去，消失在雨雾中。' },
      { type: 'narrator', content: '你追了几步，却一脚踏空，跌入一片陌生的山谷。' },
      { type: 'narrator', content: '雨雾越来越浓，山道越来越陌生。你走了很久，却怎么也走不出去。' }
    ],
    env: { weather: 'rain', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '咬牙坚持，相信自己能找到出路', nextScene: 'dawn_return_end', action: 'unlock_dawn' },
      { text: '彻底放弃，就地蜷缩', nextScene: 'lost_in_rain', action: 'unlock_lost' }
    ]
  },

  'lost_in_rain': {
    texts: [
      { type: 'narrator', content: '你蜷缩在一块青石下，听着雨声从大变小，从小变无。' },
      { type: 'narrator', content: '天亮时，你发现四周既不是你的洞府，也不是你熟悉的山林。' },
      { type: 'narrator', content: '这里没有路，没有人，没有妖。你像一滴落进沙漠的雨。' },
      { type: 'narrator', content: '多年以后，山中偶尔有樵夫说，他们在雾里看见过一只迷茫的黄鼠狼，站在原地，已经很久、很久。' },
      { type: 'system', content: '结局：雨夜迷途' }
    ],
    env: { weather: 'rain', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'dawn_return_end': {
    texts: [
      { type: 'narrator', content: '你不肯服输。一夜过去，黎明前最黑的时候，你终于找到一处熟悉的山形。' },
      { type: 'narrator', content: '你跌跌撞撞回到修炼了五百年的洞府。洞口那块你磨蹭过的石头还在，窝里的干草也还在。' },
      { type: 'narrator', content: '你忽然明白——原来家一直都在，只是你自己走出去得太远。' },
      { type: 'narrator', content: '你决定再修五百年。下一回讨封，要么不来，要么就在这座山里，让青衣人亲口说一句。' },
      { type: 'system', content: '结局：黎明归宿' }
    ],
    env: { weather: 'rain', timeOfDay: 'dawn', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'suspicious_ending': {
    texts: [
      { type: 'speaker', content: '你后退一步："你为何帮我？莫不是想骗我元神？"' },
      { type: 'speaker', content: '青衣人先是一愣，随即大笑："有趣，有趣！五百年的小妖竟有这般戒心。"' },
      { type: 'narrator', content: '他摇身一变，竟是一位白发仙人："我乃北山真君，特来点化于你，可惜你疑心太重。罢了，缘尽于此。"' },
      { type: 'narrator', content: '仙人化作清风离去，你呆立原地，追悔莫及。此后你道心破碎，修为再难精进。' },
      { type: 'system', content: '成就：疑心失缘' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset_suspicious' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ========== 执念线 ==========
  'obsession_continue': {
    texts: [
      { type: 'narrator', content: '失败的不甘像毒藤般缠绕着你的心。你不愿认命，拖着疲惫的身体在山路上徘徊。' },
      { type: 'narrator', content: '雨停了，月亮从云层中露出半张脸。你对着月光喃喃自语："我一定要讨到封……一定要……"' },
      { type: 'narrator', content: '你的眼中渐渐泛起红光，五百年道行在执念的催动下开始紊乱。' },
      { type: 'speaker', content: '一个声音在你心底响起："何必求人？你若足够强，天下谁敢不封你？"' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '听从心底的声音', nextScene: 'obsession_deeper' },
      { text: '猛然惊醒，压下执念', nextScene: 'obsession_resist' },
      { text: '转身去那座老宅看看', nextScene: 'ruins_path' }
    ]
  },

  'obsession_deeper': {
    texts: [
      { type: 'narrator', content: '你不再掩饰妖气，任由五百年道行化作滔天妖风。山林中的鸟兽纷纷惊逃。' },
      { type: 'narrator', content: '你的身形开始扭曲——时而化作人形，时而现出原形，时而又变成半人半兽的狰狞模样。' },
      { type: 'speaker', content: '那声音继续低语："对，就是这样。让所有人看看，谁才是这山中的主宰。"' },
      { type: 'narrator', content: '你仰天长啸，声震四野。远处村庄的灯火纷纷亮起，人们惊恐地望向山林。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '彻底放纵，化身为魔', nextScene: 'mad_ending', action: 'unlock_mad' },
      { text: '在最后一刻清醒过来', nextScene: 'obsession_resist' }
    ]
  },

  'obsession_resist': {
    texts: [
      { type: 'narrator', content: '就在妖气即将冲垮灵台的最后一瞬，你忽然想起了一些画面。' },
      { type: 'narrator', content: '五百年间，你在月下独自修炼的身影；雨后山林中，你踩着水坑玩耍的模样；还有今夜，奶奶慈祥的笑容和顽童天真的话语。' },
      { type: 'speaker', content: '那个狰狞的声音仍在嘶吼："放弃吧！成魔才是你的宿命！"' },
      { type: 'narrator', content: '你咬紧牙关，调动全身道行，硬生生将那声音压了下去。剧烈的疼痛传遍四肢百骸，你的嘴角渗出鲜血。' },
      { type: 'narrator', content: '不知过了多久，妖气终于缓缓消散。你精疲力竭地瘫倒在地，但眼中已恢复了清明。' },
      { type: 'narrator', content: '你成功地镇压了心魔，但也付出了极大的代价——五百年道行折损近半，短期内再也无法讨封。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '拖着残躯回到洞府，闭关疗伤', nextScene: 'obsession_recover_end' },
      { text: '心有余悸，但仍不死心', nextScene: 'true_encounter_second' },
      { text: '恍惚间看见老宅方向，似有人提灯', nextScene: 'ruins_path' }
    ]
  },

  'obsession_recover_end': {
    texts: [
      { type: 'narrator', content: '你蹒跚着回到修炼了五百年的洞府。这一次，你不再想讨封的事，只想好好睡一觉。' },
      { type: 'narrator', content: '月光透过洞口洒进来，你蜷缩在干燥的草窝里，像五百年前刚开启灵智时那样，单纯地享受着山间的宁静。' },
      { type: 'narrator', content: '道行虽然折损，但你的心境从未如此澄澈。你终于明白，真正的修行，从来不是为了"像"什么。' },
      { type: 'narrator', content: '——但那本相究竟是什么，你还需再走一段路。' }
    ],
    env: { weather: 'rain', timeOfDay: 'dawn', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' },
      { text: '去山后那座老宅，问个明白', nextScene: 'ruins_path' }
    ]
  },

  'mad_ending': {
    texts: [
      { type: 'narrator', content: '你再也控制不住自己。五百年道行化为妖力狂潮，席卷了整个山林。' },
      { type: 'narrator', content: '树木倒伏，溪水倒流，山石崩裂。你变成了一只巨大的妖物，眼中只有疯狂。' },
      { type: 'narrator', content: '后来，这座山成了远近闻名的「妖山」。再也没有人敢在雨夜走这条路。' },
      { type: 'narrator', content: '而你，永远困在自己的执念中，既不成人，也不成仙，更不再是那只自在的黄鼠狼。' },
      { type: 'system', content: '成就：执念成魔' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ========== 主要结局 ==========
  'true_ending': {
    texts: [
      { type: 'narrator', content: '青衣人的话如醍醐灌顶。五百年来，你一直执着于"像什么"，却忘了自己本就是自己。' },
      { type: 'narrator', content: '心中的执念在这一刻烟消云散，灵台一片清明。你不入神籍，不落凡尘，以本我之姿逍遥于山水之间。' },
      { type: 'narrator', content: '多年后，山中传说有一只黄鼠狼，能口吐人言，却从不害人，只在山间自由奔跑。' },
      { type: 'narrator', content: '你自在了，可那个关于"你究竟是谁"的终极问题，仍在山风中打转。' }
    ],
    env: { weather: 'clear', timeOfDay: 'dawn', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' },
      { text: '去那座老宅，或许能找到答案', nextScene: 'ruins_path' }
    ]
  },

  'mortal_ending': {
    texts: [
      { type: 'speaker', content: '青衣人轻叹："你若执意如此，我便成全你。我看你像个凡人。"' },
      { type: 'narrator', content: '话音落下，你只觉得周身剧变，化作一个普通人的模样。' },
      { type: 'narrator', content: '你欣喜若狂，却渐渐遗忘了前尘往事，忘了自己曾是一只黄鼠狼。' },
      { type: 'narrator', content: '此后生老病死，轮回不息，你再也记不起那个雨夜。' },
      { type: 'system', content: '结局：尘世轮回' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'mortal_love_ending': {
    texts: [
      { type: 'narrator', content: '你留在了村庄。日复一日，年复一年，你守护着这片土地和那个绣娘。' },
      { type: 'narrator', content: '绣娘渐渐老去，你却始终是那只黄鼠狼的模样。她临终前，握着你的爪子说："来世……我还想遇见你。"' },
      { type: 'narrator', content: '你守在她的墓前，久久不肯离去。后来，村民们说，每年春天墓边都会开满野花，那是黄大仙种的。' },
      { type: 'narrator', content: '你放弃了讨封的执念，却在这段尘缘中找到了比成仙更珍贵的东西。' },
      { type: 'system', content: '成就：红尘情缘' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'god_ending_favor': {
    texts: [
      { type: 'speaker', content: '青衣人颔首："你既有此心，便随我来。我看你像仙。"' },
      { type: 'narrator', content: '霎时间灵光灌顶，你化作一道清光，随他而去。' },
      { type: 'narrator', content: '此后你位列散仙，云游四海，只是偶尔会想起那个雨夜，想起自己曾是一只自在的黄鼠狼。' },
      { type: 'system', content: '成就：点化成仙' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'farmer_ending': {
    texts: [
      { type: 'narrator', content: '农夫的话朴实而真诚，你感到一股暖流涌入身体。虽未化形，却与这片土地结了善缘。' },
      { type: 'narrator', content: '从此你常驻山村，护佑五谷牲畜，成了远近闻名的"黄大仙"。逢年过节，总有村民来供香火。' },
      { type: 'system', content: '成就：山野村夫' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'star_ending': {
    texts: [
      { type: 'narrator', content: '得了书生的文气，你灵智大开，虽还是黄鼠狼之身，却能口吐诗词，通晓文章。' },
      { type: 'narrator', content: '后来书生高中状元，为你立了"文兽祠"；你的故事被写入志怪，流传千年。' },
      { type: 'system', content: '成就：文曲星耀' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'demon_king_ending': {
    texts: [
      { type: 'narrator', content: '你留在了精怪聚集的山坳。以五百年道行，你很快成为众妖之首。' },
      { type: 'narrator', content: '你带领精怪们占据山林，划下地界——人不犯妖，妖不犯人。从此山中自成一国。' },
      { type: 'narrator', content: '偶尔有迷路的樵夫见到你，都说山中有一只黄袍妖王，端坐于石台之上，百妖朝拜。' },
      { type: 'narrator', content: '你不再执着于讨封，因为你已经找到了属于自己的道。' },
      { type: 'system', content: '成就：妖王之路' }
    ],
    env: { weather: 'storm', timeOfDay: 'late_night', day: 3, moonPhase: 'full_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'fail_scholar_end': {
    texts: [
      { type: 'narrator', content: '你仓皇逃入深山，五百年修为几乎毁于一旦。' },
      { type: 'narrator', content: '道行大损，你只能重新修炼，蜷缩在洞穴中舔舐伤口。' },
      { type: 'system', content: '结局：功亏一篑' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' },
      { text: '不甘心，继续寻找讨封之机', nextScene: 'obsession_continue' },
      { text: '听说山中有「七日之约」', nextScene: 'seven_days_entry' }
    ]
  },

  'fail_kid_end': {
    texts: [
      { type: 'narrator', content: '你躲入草丛，看着顽童跑远的背影，泥巴还粘在你的皮毛上。' },
      { type: 'narrator', content: '童言无忌，却字字如刀。你忽然明白，讨封一事强求不得。' },
      { type: 'narrator', content: '你转身回到山中，继续做你的黄鼠狼，偶尔远远望着山脚下的村庄。' },
      { type: 'system', content: '结局：原形毕露' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' },
      { text: '不甘心，继续寻找讨封之机', nextScene: 'obsession_continue' },
      { text: '听说山中有「七日之约」', nextScene: 'seven_days_entry' }
    ]
  },

  // ========== 剑客线 ==========
  'sword_encounter': {
    texts: [
      { type: 'narrator', content: '山道尽头，你遇见一位身披蓑衣的剑客。' },
      { type: 'narrator', content: '他沉默地擦拭着手中的剑，剑光如秋水。' },
      { type: 'speaker', content: '剑客抬头看你："五百年的黄鼠狼？有趣。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '请教剑术', nextScene: 'sword_learn' },
      { text: '询问来历', nextScene: 'sword_story' },
      { text: '离开', nextScene: 'wait_more_2' }
    ]
  },

  'sword_learn': {
    texts: [
      { type: 'speaker', content: '"剑术？是用来杀人的，你想学？"' },
      { type: 'narrator', content: '他问你，眼中没有杀意，只有审视。' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '学来防身', nextScene: 'sword_practice' },
      { text: '保护想保护的人', nextScene: 'sword_heart' },
      { text: '算了', nextScene: 'wait_more_2' }
    ]
  },

  'sword_practice': {
    texts: [
      { type: 'narrator', content: '剑客教你一套简单的剑术，用于防身。' },
      { type: 'narrator', content: '你学的认真，竟隐隐有模有样。' },
      { type: 'speaker', content: '"刀剑无眼，但人心更险。学这个，不是为了伤人，是为了保护自己。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '感谢教导', nextScene: 'sword_master_ending', action: 'unlock_sword_master' }
    ]
  },

  'sword_heart': {
    texts: [
      { type: 'speaker', content: '剑客眼中闪过一丝赞许："保护他人？这倒是少见。"' },
      { type: 'speaker', content: '"我年轻时也是这样……后来，才明白有些事比命还重。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '追问他的过去', nextScene: 'sword_story' },
      { text: '拜他为师', nextScene: 'sword_practice' }
    ]
  },

  'sword_story': {
    texts: [
      { type: 'speaker', content: '"我姓沈，名夜。三百年前，我是个书生，险些饿死山中。"' },
      { type: 'speaker', content: '"是一只黄鼠狼……不，是一位仙家救了我，给我送来野果。"' },
      { type: 'narrator', content: '他看向你的眼神忽然柔软："你……和她真像。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '你认错人了', nextScene: 'sword_continue' },
      { text: '我就是那只黄鼠狼', nextScene: 'sword_reveal' },
      { text: '那是我的祖先', nextScene: 'sword_lie' }
    ]
  },

  'sword_continue': {
    texts: [
      { type: 'speaker', content: '"或许吧。"他苦笑，"三百年了，那位恩人的样子，我快记不清了。"' },
      { type: 'narrator', content: '他的眼神里有一丝落寞。' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '告诉他真相', nextScene: 'sword_reveal' },
      { text: '安慰他', nextScene: 'sword_friend_start', action: 'karma_plus_15' },
      { text: '离开', nextScene: 'wait_more_2' }
    ]
  },

  'sword_lie': {
    texts: [
      { type: 'speaker', content: '"原来如此。"他叹气，"这山中果然多奇人异事。"' },
      { type: 'narrator', content: '他似乎信了你的话，又似乎不全信。' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '离开', nextScene: 'wait_more_2' },
      { text: '说实话', nextScene: 'sword_reveal' }
    ]
  },

  'sword_reveal': {
    texts: [
      { type: 'narrator', content: '你说出真相的那一刻，剑客的眼眶忽然红了。' },
      { type: 'speaker', content: '"三百年……我找了你三百年。"' },
      { type: 'speaker', content: '"那一饭之恩，我始终记得。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '拥抱他', nextScene: 'sword_friend_start', action: 'karma_plus_30' },
      { text: '保持距离', nextScene: 'sword_awkward' }
    ]
  },

  'sword_awkward': {
    texts: [
      { type: 'narrator', content: '气氛忽然有些尴尬。' },
      { type: 'speaker', content: '"抱歉，我太激动了。"他后退一步，"你……还记得那年的事吗？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '记得', nextScene: 'sword_friend_start', action: 'karma_plus_20' },
      { text: '太久了，记不清', nextScene: 'sword_forgot' }
    ]
  },

  'sword_forgot': {
    texts: [
      { type: 'speaker', content: '"也是，五百年……对你来说或许太长。"' },
      { type: 'narrator', content: '他叹息一声，眼中的光暗了暗。' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 2, moonPhase: 'first_q' },
    choices: [
      { text: '安慰他', nextScene: 'sword_friend_start', action: 'karma_plus_15' },
      { text: '离开', nextScene: 'wait_more_2' }
    ]
  },

  'sword_friend_start': {
    texts: [
      { type: 'narrator', content: '沈夜教你一套防身的剑术，说是以防万一。' },
      { type: 'narrator', content: '你学的认真，竟隐隐有模有样。' },
      { type: 'speaker', content: '"刀剑无眼，但人心更险。学这个，不是为了伤人，是为了保护想保护的人。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 2, moonPhase: 'first_q' },
    choices: [
      { text: '感谢教导', nextScene: 'sword_friend_ending', action: 'unlock_sword_friend' }
    ]
  },

  'sword_friend_ending': {
    texts: [
      { type: 'narrator', content: '沈夜决定与你同行浪迹天涯。' },
      { type: 'narrator', content: '此后山高水长，有一人一妖相伴，倒也快活。' },
      { type: 'narrator', content: '你不再执着于讨封，因为有些缘分，比成仙更珍贵。' },
      { type: 'system', content: '成就：剑影知交' }
    ],
    env: { weather: 'clear', timeOfDay: 'dawn', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'sword_master_ending': {
    texts: [
      { type: 'narrator', content: '你学会了沈夜的剑术，虽然不能化形，却有了防身之本。' },
      { type: 'narrator', content: '沈夜离去时留下一句话："若有缘，他日再见。"' },
      { type: 'narrator', content: '你继续踏上讨封之路，但心中已不再迷茫。' },
      { type: 'system', content: '成就：剑道传承' }
    ],
    env: { weather: 'clear', timeOfDay: 'dawn', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ========== checkpoint 占位 ==========
  'checkpoint': {
    texts: [{ type: 'system', content: '返回上一个存档点' }],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: []
  },

  // ================================================================
  //  ✦✦✦  新增剧情线（v2.0）✦✦✦
  //  以下为全新剧情，原剧情文案未作任何改动
  // ================================================================

  // ========== 新剧情：七日轮回入口 ==========
  'seven_days_intro': {
    texts: [
      { type: 'env', content: '【环境】雷雨初歇，浓雾自山谷升腾。新月隐于云后，山间幽暗难辨。第一日，深夜。' },
      { type: 'narrator', content: '讨封失败的念头在你脑中盘旋不去。五百年的修行，难道就止步于此？不——你不甘心。' },
      { type: 'narrator', content: '你在山路上徘徊良久，雨后的空气里混杂着泥土和腐叶的气息。远处有隐约的狼嚎，近处有滴水声。' },
      { type: 'narrator', content: '忽然，你看见路边一块爬满青苔的石碑，上面刻着八个古朴的大字——「七日之约，过则缘灭。」' },
      { type: 'narrator', content: '石碑下压着一片干枯的银杏叶，叶脉清晰，像一张小小的地图。你忽然明白了：这山中，还有七日机缘在等你。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '踏上七日之约，不回头', nextScene: 'day1_start' },
      { text: '还是算了，回洞府去', nextScene: 'true_ending' }
    ]
  },

  // ================================================================
  //  第一日：雾隐灵山 —— 初见机缘
  // ================================================================
  'day1_start': {
    texts: [
      { type: 'env', content: '【环境】浓雾弥漫，能见不过三丈。新月无光，万籁俱寂。第一日，深夜。' },
      { type: 'narrator', content: '你深吸一口气，踏入浓雾之中。雾像活的一样，缠绕着你的四肢，钻进你的皮毛。' },
      { type: 'narrator', content: '走了不知多久——在这雾里，时间似乎失去了意义——你忽然听见前方传来斧头劈砍木头的声音。' },
      { type: 'narrator', content: '咚。咚。咚。节奏沉稳，不急不缓。有人在雾里砍柴。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '循声而去，看看是谁', nextScene: 'day1_woodcutter' },
      { text: '谨慎观望，先看看情况', nextScene: 'day1_observe' },
      { text: '绕道而行，不惹麻烦', nextScene: 'day1_skirt' }
    ]
  },

  // --- 第一日分支1：雾中樵夫 ---
  'day1_woodcutter': {
    texts: [
      { type: 'narrator', content: '你拨开雾气，看见一个白发老樵夫正挥斧劈柴。他的动作很慢，但每一斧都精准地劈在木头的纹理上。' },
      { type: 'speaker', content: '老樵夫没有回头，却开口说道："小黄仙，别躲了。你那一身骚气，三里外都闻得到。"' },
      { type: 'narrator', content: '你有些窘迫。修炼了五百年，还是改不了这一身黄鼠狼的味儿。' },
      { type: 'speaker', content: '老樵夫终于转过身来，他满脸皱纹，但眼睛亮得像两盏灯："你是来讨封的吧？五百年道行，不容易。"' },
      { type: 'narrator', content: '他从柴堆里挑出一根光滑的木棍，递给你："拿着。这是五十年老松木，灵气足。走山路用得上。"' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '接过木棍，向他道谢', nextScene: 'day1_woodcutter_gift', action: 'lingyun_15' },
      { text: '向他讨封', nextScene: 'day1_woodcutter_seal' },
      { text: '问他为何深夜在此砍柴', nextScene: 'day1_woodcutter_story' }
    ]
  },

  'day1_woodcutter_gift': {
    texts: [
      { type: 'speaker', content: '老樵夫呵呵一笑："你这小妖倒懂礼数。不像有些妖怪，上来就要吃人。"' },
      { type: 'narrator', content: '你接过木棍，入手温热，竟隐隐有灵气流动。这确实是一根好木头。' },
      { type: 'speaker', content: '老樵夫拍了拍手："我姓胡，在这山上砍了六十年柴。山里的事，多多少少知道一些。"' },
      { type: 'speaker', content: '"七日之约，你要去四个地方——山神庙、古井、山顶棋盘、老宅。每个地方，都有你需要的机缘。不过——"' },
      { type: 'narrator', content: '他顿了顿，眼神忽然变得深邃："记住，这七天里你做的每一个选择，都会影响最后的结果。不是天意，是人心。"' },
      { type: 'speaker', content: '"天快亮了，去吧。第二日，去山神庙看看。"' }
    ],
    env: { weather: 'fog', timeOfDay: 'dawn', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '记住樵夫的话，前往山神庙方向', nextScene: 'day1_night_end' }
    ]
  },

  'day1_woodcutter_seal': {
    texts: [
      { type: 'speaker', content: '老樵夫愣了一下，然后哈哈大笑："讨封？我倒是想给你封一个——"他上下打量你，"我看你像……像根烂木头！"' },
      { type: 'narrator', content: '你心里一凉。难道又失败了？' },
      { type: 'speaker', content: '老樵夫收起笑容："小妖，讨封不是求来的。别人说像什么不重要，你自己觉得自己像什么才重要。"' },
      { type: 'speaker', content: '"你在这山里待了五百年，难道还不明白？你看那山、那树、那雾——它们从不求人认可，它们就是它们自己。"' },
      { type: 'narrator', content: '你默然。老樵夫的话，像一根针，扎进了你心里某个柔软的地方。' }
    ],
    env: { weather: 'fog', timeOfDay: 'dawn', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '若有所思，谢过他', nextScene: 'day1_woodcutter_gift' },
      { text: '不服气，再问一次', nextScene: 'day1_woodcutter_story' }
    ]
  },

  'day1_woodcutter_story': {
    texts: [
      { type: 'speaker', content: '老樵夫坐在柴堆上，掏出烟杆，却不点火，只是叼着。' },
      { type: 'speaker', content: '"六十年前，我见过一只和你一样的黄鼠狼。也是在这雾里，也是讨封。那是个大雪天——"' },
      { type: 'narrator', content: '他的眼神飘向雾深处，声音变得遥远："那只黄鼠狼找到我，问我看他像不像人。我说不像。它不服，又问。连问了七次。"' },
      { type: 'speaker', content: '"第七次的时候，天亮了。它没讨到封，却也没走。它就在这山里住了下来，帮迷路的樵夫指路，给挨饿的旅人送果子。"' },
      { type: 'speaker', content: '"二十年后，我再见到它——不，是见到他。他已经不需要讨封了。因为他活成了人该有的样子。"' },
      { type: 'narrator', content: '老樵夫站起来，拍了拍裤子："所以说，讨封不是终点。活成什么样，才是。"' }
    ],
    env: { weather: 'fog', timeOfDay: 'dawn', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '若有所悟，记住这个故事', nextScene: 'day1_woodcutter_gift' }
    ]
  },

  // --- 第一日分支2：暗中观察 ---
  'day1_observe': {
    texts: [
      { type: 'narrator', content: '你躲在树后，屏住呼吸，只露出两只眼睛。老樵夫似乎没有发现你，依旧不紧不慢地劈着柴。' },
      { type: 'narrator', content: '你注意到一个细节：他劈的每一根柴，切口处都微微发光。那不是普通的木头——是灵木。' },
      { type: 'narrator', content: '一个凡人樵夫，怎会在深夜的山里劈灵木？此人绝不简单。' },
      { type: 'narrator', content: '你正想悄悄退走，脚下却踩断了一根枯枝——咔——清脆的声音在雾中格外响亮。' },
      { type: 'speaker', content: '老樵夫头也不抬："出来吧。躲了这么久，不累么？"' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '大方走出来，说明来意', nextScene: 'day1_woodcutter', action: 'lingyun_5' },
      { text: '转身就跑', nextScene: 'day1_skirt' }
    ]
  },

  // --- 第一日分支3：绕道而行 ---
  'day1_skirt': {
    texts: [
      { type: 'narrator', content: '你压低身子，从灌木丛里绕过了樵夫。雾越来越浓，你几乎看不清三步之外的东西。' },
      { type: 'narrator', content: '走着走着，你发现脚下的路变了——不再是山道，而是一条铺着碎石的小径。碎石缝里长出了一种发着幽光的苔藓。' },
      { type: 'narrator', content: '幽光苔藓排成了一条隐约的路，通向雾深处。这绝不是天然形成的——是有人故意种在这里的。' },
      { type: 'narrator', content: '远处传来一声悠长的叹息，像是风穿过石缝的声音，又像是某种古老生物的呼吸。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '跟着幽光苔藓走', nextScene: 'day1_glow_path' },
      { text: '回头去找樵夫', nextScene: 'day1_woodcutter' },
      { text: '就地歇息，等天亮', nextScene: 'day1_night_end' }
    ]
  },

  // --- 幽光小径（隐藏路线） ---
  'day1_glow_path': {
    texts: [
      { type: 'narrator', content: '你沿着幽光苔藓一路走下去。路越来越窄，两侧的树木也越来越怪异——枝干扭曲，像是被某种力量拧过。' },
      { type: 'narrator', content: '苔藓的光芒汇聚在一棵巨大的古槐树下。槐树的树干上有一个天然形成的树洞，洞中放着一只陶罐。' },
      { type: 'narrator', content: '陶罐上刻着两个字：「苏芜」。罐子里装着半罐清水，水面浮着一片银杏叶。' },
      { type: 'narrator', content: '你想起老樵夫的话——「山里的事，多多少少知道一些」。苏芜……是这座山的山神吗？' }
    ],
    env: { weather: 'fog', timeOfDay: 'dawn', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '喝一口罐中的水', nextScene: 'day1_drink_water', action: 'lingyun_10' },
      { text: '不碰陶罐，记住这个名字', nextScene: 'day1_night_end' }
    ]
  },

  'day1_drink_water': {
    texts: [
      { type: 'narrator', content: '你俯下身，轻轻喝了一口陶罐中的水。水很凉，带着一丝甘甜，还有一股淡淡的银杏香。' },
      { type: 'narrator', content: '水入喉的瞬间，你脑中忽然闪过一幅画面——一个穿着青衣的女子站在山巅，她回过头来，对你微微一笑。' },
      { type: 'narrator', content: '画面一闪即逝。但那一笑，让你心头一暖。五百年了，第一次有人——不，有神——对你笑。' },
      { type: 'system', content: '你获得了山神的眷顾。灵韵上升。你隐约感知到了这座山的灵气脉络。' }
    ],
    env: { weather: 'fog', timeOfDay: 'dawn', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '天快亮了，找地方歇息', nextScene: 'day1_night_end' }
    ]
  },

  // --- 第一日结束 ---
  'day1_night_end': {
    texts: [
      { type: 'env', content: '【环境】东方泛白，雾气渐薄。蛾眉月在西天隐现。第二日，黎明。' },
      { type: 'narrator', content: '你在山间一处天然岩洞中蜷了一夜。洞壁上有些模糊的壁画——画的是山中百兽对着一只狐狸朝拜。' },
      { type: 'narrator', content: '天亮了。雾散了。你从洞口望出去，能看见远处山腰上一座灰瓦小庙的轮廓。' },
      { type: 'narrator', content: '那就是老樵夫说的山神庙。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '第二日：前往山神庙', nextScene: 'day2_temple' },
      { text: '先去溪边洗把脸', nextScene: 'day2_creek' }
    ]
  },

  // ================================================================
  //  第二日：山神庙 —— 石龟低语
  // ================================================================
  'day2_temple': {
    texts: [
      { type: 'env', content: '【环境】阴云低垂，山风微凉。上弦月隐于云后。第二日，清晨。' },
      { type: 'narrator', content: '山神庙比你想象中破败。青瓦碎了大半，门框歪斜，香案上积了厚厚的灰。神像的面目已被风雨剥蚀，只剩一双石眼。' },
      { type: 'narrator', content: '但香案上供着一只崭新的陶碗，碗里盛着清水。显然有人——或者有东西——最近来过。' },
      { type: 'speaker', content: '一个苍老而缓慢的声音从神像后传来："五百年道行的黄鼠狼……难得。进来吧，外面风大。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '恭敬地走进庙里', nextScene: 'day2_temple_enter', action: 'lingyun_10' },
      { text: '站在门口，先问清楚是谁', nextScene: 'day2_temple_door' },
      { text: '觉得不对劲，转身离开', nextScene: 'day2_temple_leave', action: 'zhuonian_5' }
    ]
  },

  'day2_temple_enter': {
    texts: [
      { type: 'narrator', content: '你走进庙中，这才发现声音的来源——神像的底座下，压着一只石头雕的乌龟。乌龟的嘴在一张一合。' },
      { type: 'speaker', content: '石龟转动着石头眼珠："别怕。我是山神的坐骑，在这里守了三百年了。山神走后，就剩我一个。"' },
      { type: 'narrator', content: '石龟的背上刻着密密麻麻的小字，看起来像是某种古老的契约。' },
      { type: 'speaker', content: '"你在找七日之约的机缘？我可以告诉你第二日的试炼——但不是白给的。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '请问需要什么条件？', nextScene: 'day2_turtle_deal' },
      { text: '在庙里转转，看看还有什么', nextScene: 'day2_temple_explore' }
    ]
  },

  'day2_temple_door': {
    texts: [
      { type: 'speaker', content: '那声音笑了一声："警惕是好事。但在这山里，有些缘分错过了就再也等不来了。"' },
      { type: 'narrator', content: '你站在门槛上往里看。庙里光线昏暗，但你能看见神像底座下有什么东西在动。' },
      { type: 'speaker', content: '"我是石龟。山神的坐骑。不害人——虽然我倒是想害，但没那个本事。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '走进庙里', nextScene: 'day2_temple_enter' },
      { text: '还是觉得不对劲，离开', nextScene: 'day2_temple_leave' }
    ]
  },

  'day2_turtle_deal': {
    texts: [
      { type: 'speaker', content: '石龟慢悠悠地说："第二日的机缘，在溪水之畔。你去溪边，会遇见一个人——或者说，曾经是人的人。"' },
      { type: 'speaker', content: '"条件是：你在庙里的功德箱里投一枚铜钱。不是给我，是给这座山。山的灵气需要滋养。"' },
      { type: 'narrator', content: '你看向角落，确实有一只落满灰尘的功德箱。上面写着：「一币养山，万世不易。」' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '投一枚铜钱（你有几枚铜钱）', nextScene: 'day2_donate', action: 'lingyun_15' },
      { text: '不投钱，直接去溪边', nextScene: 'day2_creek' }
    ]
  },

  'day2_donate': {
    texts: [
      { type: 'narrator', content: '你从怀里摸出一枚铜钱——这是你五十年前帮一个迷路的货郎找到下山的路，他给你的谢礼。' },
      { type: 'narrator', content: '铜钱落入功德箱，发出一声清脆的回响。回响在庙中久久不散，仿佛整座山都在回应。' },
      { type: 'speaker', content: '石龟满意地点了点头（虽然石头脖子转得很吃力）："很好。山会记住你的心意。去吧，溪边等你的人，叫小安。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '前往溪边', nextScene: 'day2_creek' }
    ]
  },

  'day2_temple_explore': {
    texts: [
      { type: 'narrator', content: '你在庙里转了一圈。除了石龟和功德箱，你还发现了一面残破的壁画。' },
      { type: 'narrator', content: '壁画上画着一只白狐、一只黄鼠狼、一条青蛇和一只乌龟，四只动物围着一棵银杏树。树下坐着一个人形轮廓——面目已模糊。' },
      { type: 'narrator', content: '画的右下角有一行小字：「四灵护山，山神居中。五百年一轮回。」' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '回到石龟那里', nextScene: 'day2_turtle_deal' },
      { text: '记住壁画，去溪边', nextScene: 'day2_creek' }
    ]
  },

  'day2_temple_leave': {
    texts: [
      { type: 'narrator', content: '你觉得这破庙有些诡异，转身走了出去。身后传来一声轻轻的叹息，但你假装没听见。' },
      { type: 'narrator', content: '山风忽然大了起来，吹得你毛都竖了起来。你总觉得好像错过了什么重要的东西。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '去溪边看看', nextScene: 'day2_creek' }
    ]
  },

  // ========== 第二日午后：溪边 ==========
  'day2_creek': {
    texts: [
      { type: 'env', content: '【环境】溪水潺潺，阳光穿透云层洒落。上弦月尚未升起。第二日，正午。' },
      { type: 'narrator', content: '你来到溪边。溪水清澈见底，水底铺着五颜六色的鹅卵石。溪对岸的柳树下，坐着一个小小的身影。' },
      { type: 'narrator', content: '那是一个七八岁的小女孩，穿着褪色的红棉袄，赤着脚在水里踢着。但你看得清楚——她的脚没有在水面上留下任何涟漪。' },
      { type: 'speaker', content: '小女孩看见你，不但不害怕，反而笑了："黄鼠狼！会说话的黄鼠狼！我叫小安，你叫什么？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '告诉她你的名字', nextScene: 'day2_xiaoan_name' },
      { text: '问她为什么在这里', nextScene: 'day2_xiaoan_why' },
      { text: '保持警惕，不回答', nextScene: 'day2_xiaoan_silent', action: 'zhuonian_5' }
    ]
  },

  'day2_xiaoan_name': {
    texts: [
      { type: 'speaker', content: '"原来你叫黄小仙！好名字！"小安拍着手，笑声像银铃一样。' },
      { type: 'narrator', content: '她在水里转了个圈，水花四溅——但没有一滴水沾到你。因为她本来就不是实体。' },
      { type: 'speaker', content: '"小仙哥哥，我在这里等了好久好久了。以前有个姐姐也来过，但她走了。她让我把这个交给你。"' },
      { type: 'narrator', content: '小安从怀里掏出一只折得很精致的纸船。纸船是黄纸叠的，上面用朱砂写着几个字。' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '接过纸船', nextScene: 'day2_paper_boat', action: 'lingyun_10' },
      { text: '问她那个姐姐是谁', nextScene: 'day2_xiaoan_why' }
    ]
  },

  'day2_xiaoan_why': {
    texts: [
      { type: 'speaker', content: '小安歪着头，认真地说："我活着的时候，掉进这条溪里淹死了。后来山神姐姐把我的魂留在这里，说有一天会有一只黄鼠狼来，我就能走了。"' },
      { type: 'narrator', content: '她指着下游的方向："山神姐姐说，让你把纸船放进水里，它会漂到该去的地方。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '接过纸船，帮她完成心愿', nextScene: 'day2_paper_boat', action: 'lingyun_15' },
      { text: '问她还有什么心愿', nextScene: 'day2_xiaoan_wish' }
    ]
  },

  'day2_xiaoan_silent': {
    texts: [
      { type: 'narrator', content: '你没有回答，只是盯着她。小安的笑容慢慢消失了，取而代之的是一种淡淡的悲伤。' },
      { type: 'speaker', content: '"你是不是……也怕我？"她低下头，小小的身影在阳光下显得更加透明。"没关系。习惯了。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '心软了，和她说话', nextScene: 'day2_xiaoan_name' },
      { text: '转身离开', nextScene: 'day2_creek_end', action: 'zhuonian_10' }
    ]
  },

  'day2_paper_boat': {
    texts: [
      { type: 'narrator', content: '你接过纸船。黄纸上的朱砂字迹娟秀——「百年一诺，溪水为证。苏芜。」' },
      { type: 'narrator', content: '你将纸船轻轻放入溪水中。纸船没有沉，反而稳稳地漂了起来，顺着水流向下游漂去。' },
      { type: 'narrator', content: '小安的身影越来越淡。她对你挥了挥手："谢谢小仙哥哥。我要去找我娘了。再见——"' },
      { type: 'narrator', content: '溪水上泛起一圈淡淡的金色涟漪，小安消失在了午后的阳光里。纸船漂远，消失在了溪流的拐弯处。' },
      { type: 'system', content: '你帮助小安完成了心愿。灵韵上升。' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '天色尚早，沿溪走走', nextScene: 'day2_creek_walk' },
      { text: '第二日收获已多，找地方歇息', nextScene: 'day2_evening' }
    ]
  },

  'day2_xiaoan_wish': {
    texts: [
      { type: 'speaker', content: '小安想了想："我娘说，做人要善良。小仙哥哥，你也要善良哦。善良的妖怪，比神仙还厉害呢。"' },
      { type: 'narrator', content: '她说完这句话，身体就开始消散了——不是因为悲伤，而是因为心愿已了。' },
      { type: 'speaker', content: '"纸船给你。我要走了。小仙哥哥，再见。"' },
      { type: 'narrator', content: '纸船轻轻落在你的爪子里。小安化作点点光尘，随溪水漂远。' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '把纸船放进溪水', nextScene: 'day2_creek_walk', action: 'lingyun_10' },
      { text: '收好纸船，找地方歇息', nextScene: 'day2_evening' }
    ]
  },

  'day2_creek_walk': {
    texts: [
      { type: 'narrator', content: '你沿着溪流往下走。溪水在这里汇入一个小潭，潭水碧绿，深不见底。' },
      { type: 'narrator', content: '潭边坐着一个钓鱼的老人。他看见你，并不惊讶，只是点了点头。' },
      { type: 'speaker', content: '"黄鼠狼会走路不稀奇。黄鼠狼会思考才稀奇。你在想什么？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '在想讨封的事', nextScene: 'day2_fisher_talk' },
      { text: '在想山里的事', nextScene: 'day2_fisher_talk' },
      { text: '道谢离开', nextScene: 'day2_evening' }
    ]
  },

  'day2_fisher_talk': {
    texts: [
      { type: 'speaker', content: '老人慢悠悠地说："我在这溪边钓了四十年鱼。头二十年，我只想着钓大鱼；后二十年，我只想坐在水边。区别在哪里？"' },
      { type: 'narrator', content: '他提起鱼竿，钩子上没有鱼饵。"头二十年，我是为了鱼而钓鱼。后二十年，我是在钓鱼里找自己。"' },
      { type: 'speaker', content: '"讨封也是一样。你若是为了变成人而讨封，那永远变不了。你若是在讨封的路上找到了自己——那封与不封，都一样了。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '若有所思，谢过老人', nextScene: 'day2_evening' }
    ]
  },

  'day2_creek_end': {
    texts: [
      { type: 'narrator', content: '你转身离开溪边。小安的身影在阳光里渐渐模糊，最后只剩下一声若有若无的叹息。' },
      { type: 'narrator', content: '你告诉自己：她只是一个游魂，跟你没关系。但心里某个地方，还是微微地疼了一下。' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 2, moonPhase: 'wax_cres' },
    choices: [
      { text: '继续上路', nextScene: 'day2_evening' }
    ]
  },

  'day2_evening': {
    texts: [
      { type: 'env', content: '【环境】夕阳西下，天空染成橙红。上弦月在东天升起。第二日，黄昏。' },
      { type: 'narrator', content: '你在山间一棵大榕树的树洞里过了夜。榕树的根须垂下来，像一道天然的帘子。' },
      { type: 'narrator', content: '睡前，你回顾了这两天的经历——雾中樵夫的话、石龟的交易、小安的笑容。' },
      { type: 'narrator', content: '每一个遇见都在你心里留下了什么。明天是第三日，樵夫说要去古井。' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 2, moonPhase: 'first_q' },
    choices: [
      { text: '第三日：等待入夜，前往古井', nextScene: 'day3_well_intro' }
    ]
  },

  // ================================================================
  //  第三日：古井窥心 —— 面对真我
  // ================================================================
  'day3_well_intro': {
    texts: [
      { type: 'env', content: '【环境】白日晴朗，入夜起雾。盈凸月从东山升起，妖力渐盛。第三日，入夜。' },
      { type: 'narrator', content: '白天你在洞中打坐调息。盈凸月的妖力比前两日强了不少，你感觉化形的经脉比以往更通畅了些。' },
      { type: 'narrator', content: '入夜后，你提着一盏用灵力化出的小灯，在山的北坡找到了那口传说中的古井。' },
      { type: 'narrator', content: '古井比你想的要大。井口足有三尺宽，井栏是用一整块青石凿成的，上面刻满了你认不出的符文。' },
      { type: 'narrator', content: '你探头往井里看——黑漆漆的，深不见底。但你能感觉到，井里有什么东西在回看你。' }
    ],
    env: { weather: 'fog', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '对着井口喊一声', nextScene: 'day3_well_call' },
      { text: '安静地等待，看井有何反应', nextScene: 'day3_well_wait' },
      { text: '捡块石头丢下去', nextScene: 'day3_well_stone' }
    ]
  },

  'day3_well_call': {
    texts: [
      { type: 'narrator', content: '"有人在吗？"你的声音在井中回荡，一层又一层，像是坠入了无底的深渊。' },
      { type: 'narrator', content: '良久，井底传来回应——不是回声，而是一个和你一模一样的声音："有人在吗？"' },
      { type: 'narrator', content: '那声音模仿得惟妙惟肖，但语气里多了一丝嘲讽。你心头一紧。' },
      { type: 'speaker', content: '井中的声音说："别怕。我不是怪物。我是你。是你不敢面对的那部分自己。"' }
    ],
    env: { weather: 'fog', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '问它为什么在这里', nextScene: 'day3_well_mirror' },
      { text: '不信，换个方式试探', nextScene: 'day3_well_stone' }
    ]
  },

  'day3_well_wait': {
    texts: [
      { type: 'narrator', content: '你安静地坐在井边，调匀呼吸。盈凸月的月光洒在井口上，井水深处似乎有微弱的光芒在回应。' },
      { type: 'narrator', content: '忽然，井水开始泛起涟漪——不，那不是水波，而是无数画面在水面上闪现：一只小黄鼠狼在雪地里出生；第一次化出半个人形；被村民用扫帚赶出村子……' },
      { type: 'narrator', content: '这是你的记忆。你活了五百年的记忆，全部沉在这口井里。' }
    ],
    env: { weather: 'fog', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '继续看下去', nextScene: 'day3_well_mirror' },
      { text: '移开视线，不看', nextScene: 'day3_well_stone' }
    ]
  },

  'day3_well_stone': {
    texts: [
      { type: 'narrator', content: '你捡起一块石头丢进井里。石头下落了很久很久——然后，它又飞了出来，悬停在你面前。' },
      { type: 'speaker', content: '井中的声音笑道："丢石头？五百年的修行，就只有这点胆量？"' },
      { type: 'narrator', content: '石头在你面前缓缓旋转，表面浮现出一行字：「你所逃避的，正是你所求的。」' }
    ],
    env: { weather: 'fog', timeOfDay: 'night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '问它什么意思', nextScene: 'day3_well_mirror' },
      { text: '不理会，离开古井', nextScene: 'day3_well_leave' }
    ]
  },

  'day3_well_mirror': {
    texts: [
      { type: 'narrator', content: '井水平静下来，变成了一面完美的镜子。你看见了自己的倒影——一只黄鼠狼。' },
      { type: 'narrator', content: '但你盯着倒影看了片刻后，倒影开始变化：它先变成了一个半人半兽的模样，再变成了一个完整的人形，最后——' },
      { type: 'narrator', content: '变成了一个发着光的、似人非人、似仙非仙的存在。' },
      { type: 'speaker', content: '井中声音轻轻地说："你看——你本来就可以是任何样子。讨封只是一句话，但你是什么——是你自己决定的。"' },
      { type: 'narrator', content: '井水忽然涌上来，在你面前凝成了一颗拇指大的水珠。水珠里封着一片微小的月光。' },
      { type: 'speaker', content: '"这是古井的馈赠。带着它。满月之夜，它会派上用场。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '接受馈赠，感谢古井', nextScene: 'day3_well_leave', action: 'lingyun_20' },
      { text: '接受馈赠，但保持警惕', nextScene: 'day3_well_leave' },
      { text: '不接受，离开', nextScene: 'day3_well_leave' }
    ]
  },

  'day3_well_leave': {
    texts: [
      { type: 'env', content: '【环境】雾散月明，夜风清凉。盈凸月高悬中天。第三日，深夜。' },
      { type: 'narrator', content: '你离开古井，在山间一处背风的巨石下歇脚。月光洒在你的皮毛上，泛起微微的银光。' },
      { type: 'narrator', content: '井中的那番对话在你脑中回荡。你是什么——是黄鼠狼，还是即将化形的修行者？是妖，还是别的什么？' },
      { type: 'narrator', content: '你抬头望月。盈凸月快圆了——后天就是满月。那是妖力最盛之夜，也是化形的最佳时机。' },
      { type: 'narrator', content: '明天是第四日。樵夫说要去山顶棋盘。' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 3, moonPhase: 'wax_gib' },
    choices: [
      { text: '第四日：前往山顶', nextScene: 'day4_peak' },
      { text: '第四日：先回洞府打坐', nextScene: 'day4_cave' },
      { text: '天色骤变，似乎要下雪了', nextScene: 'snow_path' },
      { text: '山脚村庄似乎出事了', nextScene: 'drought_intro' }
    ]
  },

  // ================================================================
  //  第四日：山顶棋局 —— 智慧之试
  // ================================================================
  'day4_peak': {
    texts: [
      { type: 'env', content: '【环境】晴空万里，山风猎猎。亏凸月未升，日光正盛。第四日，清晨。' },
      { type: 'narrator', content: '你沿着陡峭的山路爬上山顶。风很大，吹得你几乎站不稳。但从这里可以俯瞰整座山——山神庙、古井、溪流、村庄……一览无余。' },
      { type: 'narrator', content: '山顶有一块巨大的平坦青石。石面上刻着一副围棋棋盘，棋盘上已经摆了不少黑白子——是一个残局。' },
      { type: 'speaker', content: '一个苍劲的声音从石头后面传来："来了？坐。陪老头子下一盘。"' }
    ],
    env: { weather: 'gale', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '坐下，看棋盘', nextScene: 'day4_chess' },
      { text: '绕过去看看是谁', nextScene: 'day4_sage_meet' },
      { text: '山顶风太大，先找个避风处', nextScene: 'day4_peak_shelter' }
    ]
  },

  'day4_chess': {
    texts: [
      { type: 'narrator', content: '你坐下来仔细看棋盘。残局很微妙——黑子看似占优，但白子有一条隐而不发的活路。' },
      { type: 'speaker', content: '石头后的人走了出来——是一个瘦削的老者，穿着打了补丁的道袍，手里拿着一枚黑子。' },
      { type: 'speaker', content: '"这局棋，是我三百年前和山神下的。她下到一半就走了，再没回来。我在这里等了三年又三年。"' },
      { type: 'narrator', content: '他落下一枚黑子："该你了。白子。"' }
    ],
    env: { weather: 'gale', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '试着落子', nextScene: 'day4_chess_play' },
      { text: '坦言自己不会下棋', nextScene: 'day4_chess_decline' },
      { text: '问他山神的事', nextScene: 'day4_chess_talk' }
    ]
  },

  'day4_sage_meet': {
    texts: [
      { type: 'narrator', content: '你绕到石头后面。瘦削的老者盘腿坐着，面前摆着一壶冷茶。' },
      { type: 'speaker', content: '他抬起头，浑浊的眼睛里忽然闪过一丝清明："五百年黄鼠狼？有意思。你是第二个走上这山顶的妖。"' },
      { type: 'speaker', content: '"第一个是一只白狐，三百年前来的。她陪我下了一局棋，然后去做了山神。"' }
    ],
    env: { weather: 'gale', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '白狐？山神是白狐？', nextScene: 'day4_chess_talk' },
      { text: '陪他下棋', nextScene: 'day4_chess' }
    ]
  },

  'day4_peak_shelter': {
    texts: [
      { type: 'narrator', content: '山顶风实在太大，你在一处巨石背后找到了一个凹进去的石窝。窝里竟然铺着干草，还有半壶水。' },
      { type: 'narrator', content: '看来那个下棋的老者平时就住在这里。石壁上刻着一些潦草的字迹，全是棋谱。' }
    ],
    env: { weather: 'gale', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '出去会会那个下棋人', nextScene: 'day4_chess' },
      { text: '研究一下石壁上的棋谱', nextScene: 'day4_study_chess' }
    ]
  },

  'day4_study_chess': {
    texts: [
      { type: 'narrator', content: '你仔细看那些棋谱。虽然你看不太懂围棋，但能感受到其中蕴含的某种规律——攻与守、进与退、舍与得。' },
      { type: 'narrator', content: '棋谱的最后一行写着：「一子落，天地变。最难的，不是走哪一步——而是决定走还是不走。」' }
    ],
    env: { weather: 'gale', timeOfDay: 'morning', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '出去下棋', nextScene: 'day4_chess' }
    ]
  },

  'day4_chess_play': {
    texts: [
      { type: 'narrator', content: '你深吸一口气，用爪子夹起一枚白子——还好妖力够用，爪子还算灵巧。' },
      { type: 'narrator', content: '你凭着直觉，将白子落在了一个不起眼的角落。' },
      { type: 'speaker', content: '老者愣住了。他盯着棋盘看了很久，然后放声大笑："妙！这一子，盘活了整局！"' },
      { type: 'speaker', content: '"三百年来，你是第一个落对这一子的。前前后后来了不下百人，都在那几手熟套里打转。只有你——一只黄鼠狼——看见了活路。"' },
      { type: 'narrator', content: '老者放下黑子，郑重地看着你："你有一颗赤子之心。这是比任何修为都珍贵的东西。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '谦虚道谢', nextScene: 'day4_chess_wisdom', action: 'lingyun_20' },
      { text: '问他这是什么意思', nextScene: 'day4_chess_wisdom' }
    ]
  },

  'day4_chess_decline': {
    texts: [
      { type: 'speaker', content: '老者并不生气："不会下棋没关系。这局棋本来就不是棋——是人生。"' },
      { type: 'narrator', content: '他指着棋盘上的白子："你看这些白子——看起来被困死了，但其实每一步都有选择。黑子是命运，白子是你。"' },
      { type: 'speaker', content: '"你不会下棋，但你活着。活着就是在下棋。"' }
    ],
    env: { weather: 'gale', timeOfDay: 'noon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '若有所悟', nextScene: 'day4_chess_wisdom' },
      { text: '还是不懂，但记住了', nextScene: 'day4_chess_wisdom' }
    ]
  },

  'day4_chess_talk': {
    texts: [
      { type: 'speaker', content: '老者叹了口气："山神——她叫苏芜。三百年前，她还是只白狐，来这山顶陪我下棋。下着下着，她就成了山神。"' },
      { type: 'speaker', content: '"不是谁封的——是她自己悟的。她说，护山即是护己，守一方水土即是守一颗道心。"' },
      { type: 'narrator', content: '他看向远方："后来她走了。我也不知道去了哪里。但我知道她还在这山里——在每一棵树、每一块石头、每一缕风里。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'noon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '陪他下一局棋', nextScene: 'day4_chess' },
      { text: '记住这个故事', nextScene: 'day4_chess_wisdom' }
    ]
  },

  'day4_chess_wisdom': {
    texts: [
      { type: 'narrator', content: '老者收起棋盘，递给你一枚白子："留着。满月之夜，把它放在月光最亮的地方。你会明白的。"' },
      { type: 'narrator', content: '白子入手微凉，表面刻着极细的纹路——细看之下，竟是一幅完整的地图，标注了山中灵气的流动脉络。' },
      { type: 'speaker', content: '"下山吧。明天满月，是妖的盛日，也是妖的劫日。准备好了再来。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'afternoon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '下山，等待满月', nextScene: 'day4_night' }
    ]
  },

  // --- 第四日分支：洞府打坐 ---
  'day4_cave': {
    texts: [
      { type: 'env', content: '【环境】洞中幽暗，微光从石缝渗入。亏凸月未升。第四日，正午。' },
      { type: 'narrator', content: '你回到住了三百年的洞府。洞壁上刻满了你修炼时留下的爪痕——五百年来日复一日的功课。' },
      { type: 'narrator', content: '今天你没有打坐，而是坐在洞口，看着外面的山。五百年了，你第一次认真地看这座山。' },
      { type: 'narrator', content: '山是活的。你能感觉到它的呼吸——每一阵风都是吐纳，每一条溪流都是血脉。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'noon', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '静心感受山的脉动', nextScene: 'day4_cave_meditate', action: 'lingyun_15' },
      { text: '出去走走', nextScene: 'day4_peak' }
    ]
  },

  'day4_cave_meditate': {
    texts: [
      { type: 'narrator', content: '你闭上眼，让意识沉入脚下的岩石。穿过土层、穿过岩石、穿过暗河——' },
      { type: 'narrator', content: '你感受到了。在这座山的深处，有一团温暖的光。那是山的灵脉，是这座山千年不竭的生命之源。' },
      { type: 'narrator', content: '灵脉轻轻地触碰了你的意识，像是在打招呼。你忽然明白——你修炼了五百年，一直以为在借山修行，其实山也一直在借你修行。' },
      { type: 'narrator', content: '修行从来不是单方面的索取，而是互相成就。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '感悟良多，等待满月', nextScene: 'day4_night' }
    ]
  },

  'day4_night': {
    texts: [
      { type: 'env', content: '【环境】夜空清朗，星河灿烂。亏凸月高悬，银辉满地。第四日，深夜。' },
      { type: 'narrator', content: '夜里，你躺在洞中，望着满天星斗。明天就是满月了——你既期待，又隐隐不安。' },
      { type: 'narrator', content: '满月是妖力最盛之夜。也是「七日之约」最关键的一夜。过了明晚，剩下的两天就只是收尾了。' },
      { type: 'narrator', content: '迷迷糊糊中，你听见远处传来悠扬的笛声——清冽如泉，婉转如风。' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 4, moonPhase: 'wan_gib' },
    choices: [
      { text: '第五日：满月之夜，前往山坳', nextScene: 'day5_fullmoon_intro' }
    ]
  },

  // ================================================================
  //  第五日：满月试炼 —— 三重幻境
  // ================================================================
  'day5_fullmoon_intro': {
    texts: [
      { type: 'env', content: '【环境】满月当空，银辉如瀑。妖力空前鼎盛，周身经脉贯通。第五日，入夜。' },
      { type: 'narrator', content: '满月升起来了。整座山被银色的月辉笼罩，你的妖力在满月下前所未有地强盛。' },
      { type: 'narrator', content: '你来到山坳。月光在这里汇聚成一片光池，池中央有一块圆形的白石，像一轮落在地上的月亮。' },
      { type: 'narrator', content: '古井的水珠和棋盘的白子同时发出微光，在你身边悬浮起来。' },
      { type: 'speaker', content: '一个声音从月光中传来——是山的声音，古老而悠远："满月之夜，三重试炼。过之，则获化形之机；败之，则道行受损。准备好了吗？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '我准备好了', nextScene: 'day5_trial_1' },
      { text: '我还没准备好', nextScene: 'day5_trial_hesitate' },
      { text: '循着笛声，去看看是谁', nextScene: 'moon_fox_meet' }
    ]
  },

  'day5_trial_hesitate': {
    texts: [
      { type: 'speaker', content: '山的声音温和地说："犹豫不丢人。满月不等人。你若现在退，可保道行无损，但化形之机将再等百年。"' },
      { type: 'narrator', content: '你看了看天上的满月——它圆满得像一个句号，也像一个全新的开始。' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '还是试试吧', nextScene: 'day5_trial_1' },
      { text: '退却，等待百年', nextScene: 'day5_trial_retreat' }
    ]
  },

  'day5_trial_retreat': {
    texts: [
      { type: 'narrator', content: '你退后一步，月光凝成的光池缓缓散去。山的声音叹息了一声。' },
      { type: 'narrator', content: '"也罢。强求的缘不是缘。百年之后，若你还在，再来便是。"' },
      { type: 'system', content: '你退出了试炼。道行无损，但失去了化形的最佳时机。' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'reset' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // --- 第一重幻境：过去 ---
  'day5_trial_1': {
    texts: [
      { type: 'narrator', content: '月光将你笼罩。你闭上眼睛，再睁开时，发现自己回到了三百年前。' },
      { type: 'narrator', content: '你看见了一只年轻的小黄鼠狼——那是你自己。它正蹲在雨夜的悬崖边，面前是一个快要坠崖的书生。' },
      { type: 'speaker', content: '山的声音在耳边响起："第一重幻境：过去。看看你走过的路——那些选择，造就了今天的你。"' },
      { type: 'narrator', content: '三百年前的那个雨夜——你选择了什么？' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '伸出援手，拉起书生', nextScene: 'day5_trial_1_save', action: 'lingyun_20' },
      { text: '袖手旁观', nextScene: 'day5_trial_1_ignore', action: 'zhuonian_15' },
      { text: '不只是拉他，还送他下山', nextScene: 'day5_trial_1_hero', action: 'lingyun_30' }
    ]
  },

  'day5_trial_1_save': {
    texts: [
      { type: 'narrator', content: '小黄鼠狼犹豫了一下，伸出爪子拉住了书生的衣袖。书生借力爬了上来。' },
      { type: 'speaker', content: '书生惊魂未定，看着你，颤抖着说："你……你像人，也像仙。"' },
      { type: 'narrator', content: '那是你第一次被人说「像」。虽然那时你没有化形，但那一刻——你已经是人了。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '继续第二重幻境', nextScene: 'day5_trial_2' }
    ]
  },

  'day5_trial_1_ignore': {
    texts: [
      { type: 'narrator', content: '小黄鼠狼看了书生一眼，转身消失在了雨里。书生绝望的叫声在夜空中回荡。' },
      { type: 'narrator', content: '你看着这一幕，心里像被什么东西堵住了。那个转身的背影——是你。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '继续第二重幻境', nextScene: 'day5_trial_2' }
    ]
  },

  'day5_trial_1_hero': {
    texts: [
      { type: 'narrator', content: '小黄鼠狼没有犹豫，奋力拉起书生，还用自己的体温为他取暖。雨夜里，一只黄鼠狼驮着一个书生，一步一步往山下走。' },
      { type: 'speaker', content: '书生的眼泪和雨水混在一起："你是什么？是妖怪吗？还是神仙？"' },
      { type: 'narrator', content: '小黄鼠狼没有说话。但它心里知道——它既不是妖怪，也不是神仙。它只是想做对的事。' }
    ],
    env: { weather: 'rain', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '继续第二重幻境', nextScene: 'day5_trial_2' }
    ]
  },

  // --- 第二重幻境：现在 ---
  'day5_trial_2': {
    texts: [
      { type: 'narrator', content: '幻境变换。你站在了山间小路上，面前站着这七天来你遇到的所有人——' },
      { type: 'narrator', content: '老樵夫扛着柴，石龟在脚边爬，小安在水边笑，下棋的老者捻着白子。' },
      { type: 'speaker', content: '山的声音说："第二重幻境：现在。看看你收获了什么——那些遇见，那些选择。"' },
      { type: 'narrator', content: '他们齐齐看着你。樵夫先开口了——' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '倾听他们的话', nextScene: 'day5_trial_2_listen', action: 'lingyun_15' },
      { text: '告诉他们你的决定', nextScene: 'day5_trial_2_speak' }
    ]
  },

  'day5_trial_2_listen': {
    texts: [
      { type: 'speaker', content: '老樵夫说："小妖，你比来时更沉稳了。"' },
      { type: 'speaker', content: '石龟说："你给了这座山一枚铜钱，山记得你。"' },
      { type: 'speaker', content: '小安说："小仙哥哥，谢谢你帮我找到回家的路。"' },
      { type: 'speaker', content: '下棋的老者说："你看见了活路——不是棋盘的活路，是你自己的活路。"' },
      { type: 'narrator', content: '他们的声音重叠在一起，像一首歌。你忽然觉得眼眶有些湿润。' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '继续第三重幻境', nextScene: 'day5_trial_3' }
    ]
  },

  'day5_trial_2_speak': {
    texts: [
      { type: 'speaker', content: '你说："我决定不讨封了。"' },
      { type: 'narrator', content: '四个人都沉默了。然后老樵夫最先笑了："那你讨什么？"' },
      { type: 'speaker', content: '你说："我要守这座山。就像山神苏芜那样。"' },
      { type: 'narrator', content: '下棋的老者轻轻放下白子，棋盘上的残局忽然自动走完了——黑子输了，白子赢了。' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '继续第三重幻境', nextScene: 'day5_trial_3' }
    ]
  },

  // --- 第三重幻境：未来 ---
  'day5_trial_3': {
    texts: [
      { type: 'narrator', content: '幻境再次变换。你站在山巅，但这不是你认识的那座山——树木更高，溪流更宽，天空更蓝。' },
      { type: 'narrator', content: '山下有一座村庄，比现在的大得多。村口的石碑上刻着两个字：「苏芜」。' },
      { type: 'speaker', content: '山的声音说："第三重幻境：未来。不是既定的命运，而是你选择的方向。走进去，看看你自己的路。"' },
      { type: 'narrator', content: '你深吸一口气，踏入了未来的幻境——' }
    ],
    env: { weather: 'clear', timeOfDay: 'dawn', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '走进村庄', nextScene: 'day5_trial_3_village' },
      { text: '留在山上', nextScene: 'day5_trial_3_mountain' },
      { text: '什么都不选，站在原地', nextScene: 'day5_trial_3_stand' }
    ]
  },

  'day5_trial_3_village': {
    texts: [
      { type: 'narrator', content: '你走进村庄。村民们看见你——一只黄鼠狼——不但不害怕，反而纷纷围了上来。' },
      { type: 'speaker', content: '一个老妇人说："山神大人，今年的收成比去年好了一倍！"' },
      { type: 'speaker', content: '一个小孩说："我上次在山上迷路了，是您把我带下山的！"' },
      { type: 'narrator', content: '你愣住了。山神？他们把你当成了山神。' },
      { type: 'narrator', content: '然后你看见了村口的雕像——不是白狐，是一只黄鼠狼。基座上刻着：「黄小仙，守此山，护此土，千载不移。」' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '接受这个未来', nextScene: 'day5_trial_end', action: 'lingyun_25' }
    ]
  },

  'day5_trial_3_mountain': {
    texts: [
      { type: 'narrator', content: '你没有进村，而是留在了山上。你看见自己站在山巅，身旁站着一只白狐。' },
      { type: 'narrator', content: '你和白狐并肩而立，看着日升月落，看着四季流转，看着山下村庄一代代人出生、长大、老去。' },
      { type: 'narrator', content: '你成了山的守护者——不是山神，而是山的伙伴。' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '接受这个未来', nextScene: 'day5_trial_end' }
    ]
  },

  'day5_trial_3_stand': {
    texts: [
      { type: 'narrator', content: '你站在原地不动。未来的幻境开始模糊、晃动——然后碎成了无数光点。' },
      { type: 'speaker', content: '山的声音说："不选择，也是一种选择。但你至少明白了——未来不是等来的。"' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '结束试炼', nextScene: 'day5_trial_end' }
    ]
  },

  'day5_trial_end': {
    texts: [
      { type: 'narrator', content: '三重幻境结束。你回到山坳的光池中，满月依旧当空。' },
      { type: 'speaker', content: '山的声音说："你通过了试炼。不是因为你做出了正确的选择——而是因为你做出了选择。选择本身就是修行。"' },
      { type: 'narrator', content: '光池中升起一团银色的光，缓缓融入你的身体。你感觉道行在满月下攀升——不是妖力的增长，而是心境的升华。' },
      { type: 'system', content: '满月试炼完成。获得「满月之光」，道行大幅提升。' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '第六日：老宅', nextScene: 'day6_intro' }
    ]
  },

  // ================================================================
  //  第六日：老宅真相
  // ================================================================
  'day6_intro': {
    texts: [
      { type: 'env', content: '【环境】满月西沉，天空微明。亏凸月将升。第六日，黎明。' },
      { type: 'narrator', content: '满月之夜过去了。你感到自己的心境前所未有的清明。' },
      { type: 'narrator', content: '按照老樵夫说的，第六日要去老宅。你沿着山路往东走，在山腰处看见了一座被藤蔓覆盖的老宅。' },
      { type: 'narrator', content: '老宅很旧，但很整洁。门前的石阶扫得干干净净，门楣上挂着一盏纸灯笼——灯还亮着。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '推开大门，走进去', nextScene: 'day6_ruins_enter' },
      { text: '先绕宅一周看看', nextScene: 'day6_ruins_around' },
      { text: '敲敲门', nextScene: 'day6_ruins_knock' }
    ]
  },

  'day6_ruins_knock': {
    texts: [
      { type: 'narrator', content: '你抬起爪子，轻轻敲了敲门。门竟然自己开了——门轴没有发出一丝声响。' },
      { type: 'narrator', content: '门内是一条长长的走廊，两侧挂着山水画。画里的山——正是你所在的这座山。' },
      { type: 'narrator', content: '走廊尽头，站着一个青衣身影，背对着你。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '走过去', nextScene: 'day6_ruins_enter' }
    ]
  },

  'day6_ruins_around': {
    texts: [
      { type: 'narrator', content: '你绕着老宅走了一圈。后院有一棵巨大的银杏树，树下有一块墓碑。' },
      { type: 'narrator', content: '墓碑上刻着：「守山者苏芜。来时是狐，去时是风。山中草木，皆其手足。」' },
      { type: 'narrator', content: '墓碑前供着一只陶罐——和你在槐树下见到的那只一模一样。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '走进老宅', nextScene: 'day6_ruins_enter' }
    ]
  },

  'day6_ruins_enter': {
    texts: [
      { type: 'narrator', content: '你走进老宅。宅子里面比外面看起来大得多——像是别有洞天。' },
      { type: 'narrator', content: '堂屋里点着一盏长明灯，火光稳定，没有丝毫摇曳。灯下站着一个人。' },
      { type: 'speaker', content: '那人转过身来——是你在古井幻境中见过的青衣女子。她的面容清秀，眼神温和，嘴角带着淡淡的笑意。' },
      { type: 'speaker', content: '"你来了。我等了你三百年。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'morning', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '你是……山神苏芜？', nextScene: 'day6_suwu_reveal' },
      { text: '你等我做什么？', nextScene: 'day6_suwu_reveal' }
    ]
  },

  'day6_suwu_reveal': {
    texts: [
      { type: 'speaker', content: '青衣女子点点头："我是苏芜——或者说，我曾经是苏芜。现在的我，只是她留下的一缕残念。"' },
      { type: 'narrator', content: '她走到墙边，墙上挂着一幅画——画中是一只白狐、一只黄鼠狼和一棵银杏树。' },
      { type: 'speaker', content: '"三百年前，我也是妖。一只白狐。我在满月之夜通过了三重试炼，成为了山神。但成为山神不是结束——是开始。"' },
      { type: 'speaker', content: '"山神不能永远当下去。每五百年，山需要新的守护者。而你——你身上有这座山需要的赤子之心。"' },
      { type: 'narrator', content: '她转过身来，认真地看着你："黄小仙。你愿意接替我，成为这座山的守护者吗？"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'noon', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '我愿意', nextScene: 'day6_accept', action: 'lingyun_30' },
      { text: '我需要时间想想', nextScene: 'day6_think' },
      { text: '我不愿意——我只想讨封化形', nextScene: 'day6_refuse' }
    ]
  },

  'day6_accept': {
    texts: [
      { type: 'narrator', content: '"我愿意。"你听见自己说出了这三个字，声音很轻，但很坚定。' },
      { type: 'speaker', content: '苏芜笑了。那笑容像春风拂过水面，像月光穿过云层。' },
      { type: 'narrator', content: '"好。明日是第七日。去山巅，我在那里等你——用你最后一天，做你最后的决定。但无论如何——谢谢你。"' },
      { type: 'narrator', content: '她伸出手，轻轻摸了摸你的头。她的手没有实体，但你感受到了温度。' }
    ],
    env: { weather: 'clear', timeOfDay: 'dusk', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '在老宅过夜', nextScene: 'day6_night' }
    ]
  },

  'day6_think': {
    texts: [
      { type: 'speaker', content: '苏芜点点头："想清楚是对的。明天是第七日，你来山巅找我——不管你的答案是什么，我都尊重。"' },
      { type: 'narrator', content: '她的身影淡了一些。残念终究是残念，支撑不了太久。' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '在老宅过夜', nextScene: 'day6_night' }
    ]
  },

  'day6_refuse': {
    texts: [
      { type: 'speaker', content: '苏芜没有生气，只是微微叹了口气："讨封化形……五百年来，你确实只为这一个目标而活。我理解。"' },
      { type: 'speaker', content: '"但你已经不是五百年前那只只会讨封的黄鼠狼了。这些天你遇见的人、做过的事——它们已经改变你了。"' },
      { type: 'narrator', content: '"明天来山巅。无论你选什么——这座山都会记得你。"' }
    ],
    env: { weather: 'overcast', timeOfDay: 'dusk', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '在老宅过夜', nextScene: 'day6_night' }
    ]
  },

  'day6_night': {
    texts: [
      { type: 'env', content: '【环境】夜空清朗，繁星点点。亏凸月高悬，月色温柔。第六日，深夜。' },
      { type: 'narrator', content: '你蜷在老宅的堂屋里，长明灯的火光温暖而稳定。墙上那些山水画在火光里仿佛活了过来。' },
      { type: 'narrator', content: '梦里，你看见了三百年前那个雨夜——年轻的你，拉起了坠崖的书生。然后你看见了更多：你帮迷路的孩子找到家、你给挨饿的猎人送去野果、你守护这座山……' },
      { type: 'narrator', content: '这些事你一直以为是闲事。现在你明白——这些才是真正的修行。' }
    ],
    env: { weather: 'clear', timeOfDay: 'late_night', day: 6, moonPhase: 'wan_gib' },
    choices: [
      { text: '第七日：终章', nextScene: 'day7_final' }
    ]
  },

  // ================================================================
  //  第七日：终章 —— 山巅之约
  // ================================================================
  'day7_final': {
    texts: [
      { type: 'env', content: '【环境】晴空万里，清风徐徐。下弦月隐于天际，朝阳初升。第七日，清晨。' },
      { type: 'narrator', content: '第七日的清晨，阳光格外清澈。你推开老宅的门，走了出去。' },
      { type: 'narrator', content: '山还是那座山——但你已经不是七天前的你了。你不再急着讨封，不再焦虑，不再迷茫。' },
      { type: 'narrator', content: '你走上山巅。山巅的棋盘还在，只是棋子已经收拾干净了。石头上坐着一个人——苏芜。' },
      { type: 'narrator', content: '这一次，她不是残念。晨光穿过她的身体，但她依然稳稳地坐在那里。她的眼神比昨天更亮了。' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '走向苏芜', nextScene: 'day7_final_talk' }
    ]
  },

  'day7_final_talk': {
    texts: [
      { type: 'speaker', content: '苏芜微笑着："七日之约，你走完了。你比我想象中更快——也更坚定。"' },
      { type: 'narrator', content: '她从石头上站起来，晨光在她身后铺开，像一件金色的披风。' },
      { type: 'speaker', content: '"黄小仙，现在你有两个选择。第一——我赐你封号，助你化形成仙，从此脱离妖身。"' },
      { type: 'speaker', content: '"第二——你留在这座山上，成为新的守山者。不封不仙，只是你自己。但这座山的每一棵树、每一块石、每一个生灵，都会成为你的家人。"' },
      { type: 'narrator', content: '她顿了顿，语气变得很轻很轻："你选哪一个？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '我选择化形成仙', nextScene: 'day7_final_god', action: 'lingyun_20' },
      { text: '我选择守山', nextScene: 'day7_final_guardian', action: 'lingyun_40' },
      { text: '我两个都不选——我要走自己的路', nextScene: 'day7_final_own' }
    ]
  },

  'day7_final_god': {
    texts: [
      { type: 'narrator', content: '苏芜笑了，笑容里有些许遗憾，但更多的是欣慰。' },
      { type: 'speaker', content: '"也好。五百年修行，为的就是这一刻。"' },
      { type: 'narrator', content: '她抬起手，指尖凝出一缕金光。金光飘向你，融入你的眉心。你感到身体在变化——皮毛褪去，骨骼重塑，你第一次完完整整地站了起来。' },
      { type: 'narrator', content: '不是黄鼠狼。不是半人半妖。是一个人——或者说，一尊仙。' },
      { type: 'system', content: '成就：化形成仙。你是这座山上第二个得道的妖。' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_god' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'day7_final_guardian': {
    texts: [
      { type: 'narrator', content: '你看着苏芜，又看了看脚下的山——你住了五百年的山。你想起老樵夫的话：「活成什么样，才是。」' },
      { type: 'narrator', content: '"我选择守山。"你说，"我不想变成什么。我就做我自己——一只黄鼠狼。但这只黄鼠狼，会守护这座山。"' },
      { type: 'speaker', content: '苏芜的眼睛亮了。那光芒比任何满月都耀眼。' },
      { type: 'speaker', content: '"好。从今天起，你是这座山的守护者。不是山神——你不需要封号。你就是黄小仙。守山者，黄小仙。"' },
      { type: 'narrator', content: '她伸出手。你抬起爪子。一人一妖——不，一个山神和一只黄鼠狼——在山巅握了握手。' },
      { type: 'narrator', content: '苏芜的身影在晨光中渐渐淡去。最后一刻，你听见她说："谢谢你。我终于可以休息了。"' },
      { type: 'narrator', content: '山巅只剩下你。但你不再孤单。你能感受到——整座山都在与你共振。每一棵树、每一块石、每一缕风。' },
      { type: 'system', content: '成就：守山之人。你选择了比化形成仙更难得的道路——守护。' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_guardian' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  'day7_final_own': {
    texts: [
      { type: 'narrator', content: '"我两个都不选。"你说，"我要走自己的路。"' },
      { type: 'speaker', content: '苏芜愣了一下，然后大笑起来——山神的笑声像山间的风铃，清清脆脆。' },
      { type: 'speaker', content: '"你果然不是一般的黄鼠狼。好——走自己的路。不管走到哪里，这座山都是你的家。"' },
      { type: 'narrator', content: '她最后看了你一眼："记住——封与不封，仙与不仙，都不是你。你只是你。这就够了。"' },
      { type: 'narrator', content: '说完，她化作一阵清风，消失在了山巅的晨光里。你独自站在山顶，心中没有遗憾，只有一种前所未有的自由。' },
      { type: 'system', content: '成就：自在本心。你不属于任何人的期待——你只属于自己。' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_true' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' },
      { text: '在云海中入定，感受天地', nextScene: 'empty_face_trigger' }
    ]
  },

  // ================================================================
  //  新结局：守山之人（从雪中樵夫/旱灾线过来的分支）
  // ================================================================
  'guardian_ending': {
    texts: [
      { type: 'narrator', content: '你没有选择化形成仙，也没有回到凡尘。你留在了这座山里。' },
      { type: 'narrator', content: '你成了这座山的一部分——就像苏芜曾经是的那样。樵夫上山时，你为他指路；小孩迷路时，你带他回家。' },
      { type: 'narrator', content: '你不再问别人你像不像人。因为你知道——当你守护着别人时，你就已经是人了。' },
      { type: 'system', content: '成就：守山之人' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_guardian' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },

  // ================================================================
  //  分支结局：七日之约终章（满月后的直接结局）
  // ================================================================
  'day7_final_ending': {
    texts: [
      { type: 'narrator', content: '七日之约结束了。你完成了满月试炼，见到了山神残念，在山巅做了最终的选择。' },
      { type: 'narrator', content: '无论你选择了什么——成仙、守山、还是走自己的路——这七天都改变了你。' },
      { type: 'narrator', content: '你不再是那只只会讨封的黄鼠狼。你有了故事、有了选择、有了自己想要守护的东西。' },
      { type: 'system', content: '成就：七日之约' }
    ],
    env: { weather: 'clear', timeOfDay: 'morning', day: 7, moonPhase: 'last_q' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_seven_days' },
      { text: '回到上一个选择点', nextScene: 'checkpoint' }
    ]
  },
// ========== 七日入口的衔接（在失败结局中接入） ==========
  'seven_days_entry': {
    texts: [
      { type: 'env', content: '【环境】雷雨初歇，浓雾升腾。新月隐于云后。第一日，深夜。' },
      { type: 'narrator', content: '讨封失败后，你不甘心就此放弃。在山路上徘徊时，你看见一块石碑，上刻「七日之约，过则缘灭。」' },
      { type: 'narrator', content: '你决定在山中多留七日，另寻机缘。' }
    ],
    env: { weather: 'fog', timeOfDay: 'late_night', day: 1, moonPhase: 'new_moon' },
    choices: [
      { text: '踏上七日之约', nextScene: 'day1_start' },
      { text: '还是算了，回洞府', nextScene: 'true_ending' }
    ]
  },

  // ========== 保留的支线场景（从外部引用） ==========
  'snow_path': {
    texts: [
      { type: 'env', content: '【环境】大雪纷飞，朔风凛冽。寒气封脉，行动迟缓。' },
      { type: 'narrator', content: '天色骤变，大雪封山。你在风雪中艰难前行，隐约看见前方有一个人影。' }
    ],
    env: { weather: 'snow', timeOfDay: 'dusk', day: 3, moonPhase: 'wan_cres' },
    choices: [
      { text: '过去看看', nextScene: 'day4_peak' },
      { text: '找地方避雪', nextScene: 'day4_cave' }
    ]
  },

  'drought_intro': {
    texts: [
      { type: 'env', content: '【环境】大旱，烈日如焚。旱火灼心，道行暗耗。' },
      { type: 'narrator', content: '山下村庄遭遇大旱。你决定下山看看。' }
    ],
    env: { weather: 'drought', timeOfDay: 'noon', day: 4, moonPhase: 'wan_cres' },
    choices: [
      { text: '帮村民想办法', nextScene: 'day4_night', action: 'lingyun_20' },
      { text: '这与你无关，回山上', nextScene: 'day4_peak', action: 'zhuonian_10' }
    ]
  },

  'moon_fox_meet': {
    texts: [
      { type: 'env', content: '【环境】满月当空，银辉遍地。妖力鼎盛，宜化形。' },
      { type: 'narrator', content: '满月之夜，你听见远处传来悠扬的笛声。你循声而去，在一处山坳里看见一只白狐在月下独舞。' },
      { type: 'speaker', content: '白狐停下舞步，回头看你："哟，小黄仙。满月之夜不在洞里化形，跑来看我跳舞？"' }
    ],
    env: { weather: 'clear', timeOfDay: 'night', day: 5, moonPhase: 'full_moon' },
    choices: [
      { text: '和她一起在月下奔跑', nextScene: 'day5_fullmoon_intro', action: 'lingyun_15, unlock_moon_fox' },
      { text: '道别，去参加满月试炼', nextScene: 'day5_fullmoon_intro' }
    ]
  },

  // ========== 新增：空相无相触发场景 ==========
  'empty_face_trigger': {
    texts: [
      { type: 'narrator', content: '你站在山巅，望向远方。云海翻涌，天地辽阔。' },
      { type: 'narrator', content: '你忽然笑了。五百年的执念，像这云一样散了。' },
      { type: 'speaker', content: '山风拂过，一个声音轻轻响起："你看自己像什么？"' },
      { type: 'narrator', content: '你摇头，不再回答。因为你已经不需要任何答案。' },
      { type: 'narrator', content: '无相即万相，空相即本相。你踏云而去，消失在晨光里。' },
      { type: 'system', content: '成就：空相无相' }
    ],
    env: { weather: 'clear', timeOfDay: 'dawn', day: 7, moonPhase: 'new_moon' },
    choices: [
      { text: '重新开始', nextScene: 'start', action: 'unlock_empty_face' }
    ]
  }

};

// ================================================================
//  3. 道行映射（场景ID → 显示文本）
// ================================================================

window.CULTIVATION_MAP = {
  start: '五百年',
  true_encounter_first: '五百年',
  true_encounter_second: '五百年',
  true_guidance: '五百年',
  ruins_path: '四百八十年',
  ruins_arrival: '四百八十年',
  ruins_meeting: '四百八十年',
  witness_ending: '∞',
  true_ending: '五百年',
  mortal_ending: '无',
  god_ending_favor: '八百年',
  sacrifice_ending: '归零',
  mad_ending: '千载妖力',
  obsession_recover_end: '二百六十年',
  fail_scholar_end: '三百年',
  fail_kid_end: '四百五十年',
  demon_king_ending: '七百年',
  farmer_ending: '五百年',
  star_ending: '五百二十年',
  mortal_love_ending: '五百二十年',
  wait_final: '四百五十年',
  lost_in_rain: '三百二十年',
  dawn_return_end: '五百二十年',
  severed_ending: '四百年',
  // 新增场景
  seven_days_intro: '五百年',
  seven_days_entry: '五百年',
  day1_fog_path: '五百年（新月受抑）',
  day1_woodman_seal: '五百年（新月受抑）',
  day1_woodman_story: '五百年（新月受抑）',
  day1_woodman_silence: '五百年（新月受抑）',
  day1_woodman_advice: '五百年（新月受抑）',
  day1_deeper_fog: '五百年（新月受抑）',
  day1_ghost_meet: '五百年（新月受抑）',
  day1_ghost_story: '五百年（新月受抑）',
  day1_ghost_help: '五百一十年',
  day1_ghost_question: '五百一十年',
  day1_rest: '五百一十年',
  day2_temple: '五百一十年',
  day2_temple_spirit: '五百一十年',
  day2_temple_seal: '五百一十年',
  day2_temple_history: '五百一十年',
  day2_temple_comfort: '五百一十年',
  day2_temple_help: '五百一十年',
  day2_temple_question: '五百一十年',
  day2_temple_decline: '五百一十年',
  day2_temple_pray: '五百一十年',
  day2_creek: '五百一十年',
  day2_creek_kid: '五百一十年',
  day2_creek_self: '五百一十年',
  day2_creek_others: '五百一十年',
  day2_creek_dunno: '五百一十年',
  day2_creek_meditate: '五百二十年',
  day2_creek_end: '五百一十年',
  day2_evening: '五百一十年',
  day3_well_intro: '五百二十年（盈凸月）',
  day3_well_call: '五百二十年（盈凸月）',
  day3_well_wait: '五百二十年（盈凸月）',
  day3_well_cautious: '五百二十年（盈凸月）',
  day3_well_mirror: '五百二十年（盈凸月）',
  day3_well_look: '五百年',
  day3_well_resist: '五百三十年',
  day3_well_anger: '五百年',
  day3_well_flee: '五百二十年',
  day3_well_leave: '五百二十年',
  day4_peak: '五百二十年（亏凸月）',
  day4_peak_sage: '五百二十年',
  day4_peak_seal: '五百二十年',
  day4_peak_chess: '五百三十年',
  day4_peak_nochess: '五百三十年',
  day4_peak_insight: '五百四十年',
  day4_peak_advice: '五百三十年',
  day4_peak_end: '五百四十年',
  day4_cave: '五百四十年',
  day4_cave_memory: '五百四十年',
  day4_cave_past: '五百五十年',
  day4_cave_now: '五百五十年',
  day4_cave_both: '五百五十年',
  day4_cave_meditate: '五百五十年',
  day4_night: '五百五十年',
  day5_fullmoon_intro: '五百五十年（满月鼎盛）',
  day5_trial_hesitate: '五百五十年',
  day5_trial_retreat: '五百五十年',
  day5_trial_1: '五百五十年',
  day5_trial_1_happy: '五百年',
  day5_trial_1_sad: '五百六十年',
  day5_trial_1_dunno: '五百五十年',
  day5_trial_2: '五百七十/八十年',
  day5_trial_2_wood: '五百七十年',
  day5_trial_2_ghost: '五百七十年',
  day5_trial_2_spirit: '五百七十年',
  day5_trial_2_self: '五百七十年',
  day5_trial_3: '五百七十年',
  day5_trial_3_human: '五百四十年',
  day5_trial_3_immortal: '五百四十年',
  day5_trial_3_self: '五百八十年',
  day5_trial_3_empty: '六百年',
  day5_trial_end: '五百五十年',
  day6_intro: '五百六十年',
  day6_ruins_outside: '五百六十年',
  day6_ruins_around: '五百六十年',
  day6_ruins_hole: '五百六十年',
  day6_ruins_enter: '五百六十年',
  day6_ruins_memory: '五百六十年',
  day6_ruins_why: '五百六十年',
  day6_ruins_feel: '五百六十年',
  day6_ruins_realize: '五百七十年',
  day6_evening: '五百七十年',
  day6_night: '五百七十年',
  day7_final: '六百年',
  day7_final_talk: '六百年',
  day7_final_reveal: '六百年',
  day7_final_question: '六百年',
  day7_final_ending: '∞（本相归真）',
  guardian_ending: '六百年',
  snow_path: '四百五十年（寒气封脉）',
  snow_warm: '四百四十年',
  snow_talk: '四百五十年',
  snow_leave: '四百五十年',
  snow_leave_end: '四百五十年',
  snow_eat: '四百四十/五十年',
  snow_seal: '四百五十年',
  snow_seal_question: '四百五十年',
  snow_help_down: '四百四十年',
  snow_stay: '四百五十年',
  snow_leave_good: '四百五十年',
  drought_intro: '四百五十年（旱火灼心）',
  drought_rain: '四百五十年',
  drought_temple: '四百五十年',
  drought_spring: '四百五十年',
  drought_push: '五十年',
  drought_giveup: '四百五十年',
  drought_self: '四百五十年',
  drought_ending: '五十年',
  ghost_market: '五百年（新月受抑）',
  ghost_market_walk: '五百年',
  ghost_market_past: '四百九十年',
  ghost_market_meet: '五百一十年',
  ghost_market_suwu: '五百一十年',
  ghost_market_suwu_2: '五百一十年',
  ghost_market_seal: '五百年',
  ghost_market_exit: '五百一十年',
  ghost_market_flee: '五百年',
  moon_fox_meet: '五百五十/六十年（满月）',
  moon_fox_seal: '五百五十年',
  moon_fox_teach: '五百六十年',
  moon_fox_transform: '六百年（金毛本相）',
  moon_fox_run: '六百年',
  moon_fox_ending: '六百年',
  empty_face_trigger: '∞'
};

// ================================================================
//  4. 成就初始状态
// ================================================================

window.ACHIEVEMENTS_INIT = {
  true: false,
  god: false,
  mortal: false,
  fail_scholar: false,
  fail_kid: false,
  farmer: false,
  star: false,
  demon_king: false,
  sacrifice: false,
  mad: false,
  love: false,
  guardian: false,
  lost: false,
  severed: false,
  dawn: false,
  witness: false,
  suspicious: false,
  sword_friend: false,
  sword_master: false,
  green_memory: false,
  great_good: false,
  great_evil: false,
  balance_sage: false,
  ghost_friend: false,
  star_seeker: false,
  // v2.0 新增成就
  seven_days: false,
  moon_fox: false,
  drought_hero: false,
  well_insight: false,
  chess_sage: false,
  empty_face: false
};


// ================================================================
//  5. 成就名称映射（UI显示用）
// ================================================================

window.ACHIEVEMENT_NAME_MAP = {
  'true': '本相自在',
  'god': '点化成仙',
  'mortal': '尘世轮回',
  'fail_scholar': '功亏一篑',
  'fail_kid': '原形毕露',
  'farmer': '山野村夫',
  'star': '文曲星耀',
  'demon_king': '妖王之路',
  'sacrifice': '舍身成仁',
  'mad': '执念成魔',
  'love': '红尘情缘',
  'guardian': '守山之人',
  'lost': '雨夜迷途',
  'severed': '断缘而去',
  'dawn': '黎明归宿',
  'witness': '无对无错，善良依旧',
  'suspicious': '疑心失缘',
  'sword_friend': '剑影知交',
  'sword_master': '剑道传承',
  'green_memory': '前尘往事',
  'great_good': '大善若水',
  'great_evil': '大恶如魔',
  'balance_sage': '中庸之道',
  'ghost_friend': '鬼魂之交',
  'star_seeker': '星辰指引',
  // v2.0 新增
  'seven_days': '七日圆满，本相归真',
  'moon_fox': '月下同行',
  'drought_hero': '润物无声',
  'well_insight': '井中悟道',
  'chess_sage': '棋道天成',
  'empty_face': '空相无相'
};


// ================================================================
//  6. 黄金成就（特殊样式）
// ================================================================

window.GOLDEN_ACHIEVEMENTS = ['witness', 'sacrifice', 'seven_days', 'empty_face'];


// ================================================================
//  7. 成就图标列表（用于设置面板显示）
// ================================================================

window.ACHIEVEMENT_ICONS = [
  { id: 'witness', title: '无对无错，善良依旧', icon: '✦' },
  { id: 'sacrifice', title: '舍身成仁', icon: '†' },
  { id: 'seven_days', title: '七日圆满，本相归真', icon: '🌟' },
  { id: 'empty_face', title: '空相无相', icon: '○' },
  { id: 'true', title: '本相自在（无成就，仅记录）', icon: '◯' },
  { id: 'god', title: '点化成仙', icon: '☀' },
  { id: 'mortal', title: '尘世轮回', icon: '人' },
  { id: 'fail_scholar', title: '功亏一篑', icon: '✗' },
  { id: 'fail_kid', title: '原形毕露', icon: '✗' },
  { id: 'farmer', title: '山野村夫', icon: '🌾' },
  { id: 'star', title: '文曲星耀', icon: '⭐' },
  { id: 'demon_king', title: '妖王之路', icon: '◆' },
  { id: 'mad', title: '执念成魔', icon: '◇' },
  { id: 'love', title: '红尘情缘', icon: '♡' },
  { id: 'guardian', title: '守山之人', icon: '⛰' },
  { id: 'lost', title: '雨夜迷途', icon: '?' },
  { id: 'severed', title: '断缘而去', icon: '—' },
  { id: 'dawn', title: '黎明归宿', icon: '☽' },
  { id: 'sword_friend', title: '剑影知交', icon: '⚔' },
  { id: 'sword_master', title: '剑道传承', icon: '剑' },
  { id: 'green_memory', title: '前尘往事', icon: '记' },
  { id: 'great_good', title: '大善若水', icon: '☯' },
  { id: 'great_evil', title: '大恶如魔', icon: '💀' },
  { id: 'balance_sage', title: '中庸之道', icon: '⚖' },
  { id: 'ghost_friend', title: '鬼魂之交', icon: '👻' },
  { id: 'star_seeker', title: '星辰指引', icon: '星' },
  { id: 'suspicious', title: '疑心失缘', icon: '疑' },
  { id: 'moon_fox', title: '月下同行', icon: '🦊' },
  { id: 'drought_hero', title: '润物无声', icon: '🌧' },
  { id: 'well_insight', title: '井中悟道', icon: '🕳' },
  { id: 'chess_sage', title: '棋道天成', icon: '♟' }
];

console.log('✅ story.js v2.0.1 加载完成，共 ' + Object.keys(window.SCENES).length + ' 个场景，成就系统已修复');