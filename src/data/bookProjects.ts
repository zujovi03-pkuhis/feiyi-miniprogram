/**
 * 《非遗读本》中国非遗项目数据
 * 数据来源：非遗读本_修订版(2).docx 第2-7章
 * 数据范围：24个中国项目（华县皮影戏为完整Demo，其余23个为轻量预览）
 *
 * 注意：
 * - 所有页面必须从本文件读取项目，不允许在组件中重复硬编码
 * - demoDepth: "full"  → 华县皮影戏，拥有完整详情/标签切换/视频
 * - demoDepth: "preview" → 其余项目，仅轻量图文介绍
 */

export type DemoDepth = "preview" | "full";

export type HeritageDomain =
  | "口头传统"
  | "表演艺术"
  | "节庆仪式"
  | "自然知识"
  | "传统手工艺";

export interface HeritageLocation {
  provinceCode: string;
  provinceName: string;
  cityName?: string;
  districtName?: string;
  displayName: string;
  isPrimary?: boolean;
}

export interface VideoChapter {
  /** 章节时间（秒） */
  time: number;
  /** 章节标题 */
  label: string;
}

export interface VideoInfo {
  /** 视频标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 视频文件路径 */
  src: string;
  /** 封面图路径 */
  poster: string;
  /** 视频时长（秒） */
  duration: number;
  /** 视频章节列表 */
  chapters: VideoChapter[];
  /** 视频介绍 */
  description: string;
  /** 关键知识问题 */
  knowledgeQuestions: string[];
  /** 相关内容列表 */
  relatedContent: { title: string; subtitle: string; duration: string; thumbnail: string }[];
}

export interface HeritageProject {
  id: string;
  name: string;
  shortName?: string;

  domain: HeritageDomain;
  category: string;
  level?: string;

  locations: HeritageLocation[];

  summary: string;
  briefIntroduction: string;
  keyFeatures: string[];

  coverImage: string;
  heroImage?: string;

  bookChapter?: string;
  bookSection?: string;
  bookPage?: string;

  demoDepth: DemoDepth;
  hasVideo: boolean;

  detailRoute?: string;
  videoRoute?: string;

  /** 全国性项目标记：true 时不在每个省生成重复定位点 */
  isNationwide?: boolean;
  /** 跨省项目标记：在多个省显示关联 */
  isCrossProvince?: boolean;

  // 以下字段为完整详情页（demoDepth = "full"）提供更丰富的结构化内容
  /** 列入时间，如“2011年” */
  inscribedYear?: string;
  /** 代表地区 */
  representativeRegion?: string;
  /** 历史源流 */
  history?: string;
  /** 地理分布说明 */
  distributionInfo?: string;
  /** 表演特色 */
  performanceFeatures?: string[];
  /** 文化价值 */
  culturalValue?: string;
  /** 制作技艺步骤（名称 + 说明） */
  craftSteps?: { name: string; description: string }[];
  /** 视频信息（hasVideo=true 时必填） */
  videoInfo?: VideoInfo;
}

export const BOOK_NAME = "《非遗读本》";

export const bookProjects: HeritageProject[] = [
  {
    id: "gesar",
    name: "格萨尔",
    shortName: "格萨尔",
    domain: "口头传统",
    category: "民间文学",
    level: "人类非物质文化遗产代表作名录",
    summary: "流传于青藏高原的藏族英雄史诗，被誉为“东方的荷马史诗”，是世界上篇幅最长的活态史诗。",
    briefIntroduction: "《格萨尔》讲述了岭国英雄格萨尔王降生、征战、降妖伏魔、安定三界的传奇一生。史诗通过民间艺人的口耳相传延续千年，现存120多部、100多万诗行、2000多万字，是世界上规模最宏大的活态史诗。它不仅是文学瑰宝，更是研究藏族历史、宗教、民俗的百科全书。",
    coverImage: "/assets/images/projects/gesar.svg",
    bookChapter: "第二章 口头传统和表现形式",
    bookSection: "第二节 格萨尔：雪域高原的英雄传奇",
    locations: [
      { provinceCode: "xizang", provinceName: "西藏自治区", displayName: "西藏", isPrimary: true },
      { provinceCode: "qinghai", provinceName: "青海省", displayName: "青海" },
      { provinceCode: "sichuan", provinceName: "四川省", displayName: "四川" },
      { provinceCode: "gansu", provinceName: "甘肃省", displayName: "甘肃" },
      { provinceCode: "yunnan", provinceName: "云南省", displayName: "云南" },
    ],
    keyFeatures: [
      "世界上篇幅最长的活态史诗",
      "以口头说唱为主要传承方式",
      "融合神话、历史、民俗于一体",
      "在藏族聚居区广泛流传",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "huaer",
    name: "花儿",
    shortName: "花儿",
    domain: "口头传统",
    category: "传统音乐",
    level: "人类非物质文化遗产代表作名录",
    summary: "流传于西北高原的多民族民歌，因歌词中将女性比喻为花朵而得名，被誉为“高原上的声音彩虹”。",
    briefIntroduction: "花儿是流传于甘肃、青海、宁夏、新疆等地的一种高腔山歌，由汉、回、藏、东乡、保安、撒拉、土、裕固等多个民族共同传唱。歌词以“令”调式区分，代表曲目有《河州大令》《上去高山望平川》等。每年农历六月前后的“花儿会”，是西北地区规模最大的民间歌会。",
    coverImage: "/assets/images/projects/huaer.svg",
    bookChapter: "第二章 口头传统和表现形式",
    bookSection: "第三节 花儿：高原上的声音彩虹",
    locations: [
      { provinceCode: "gansu", provinceName: "甘肃省", displayName: "甘肃", isPrimary: true },
      { provinceCode: "qinghai", provinceName: "青海省", displayName: "青海" },
      { provinceCode: "ningxia", provinceName: "宁夏回族自治区", displayName: "宁夏" },
      { provinceCode: "xinjiang", provinceName: "新疆维吾尔自治区", displayName: "新疆" },
    ],
    keyFeatures: [
      "多民族共同传唱的民歌",
      "高亢嘹亮的高腔唱法",
      "以“令”区分曲调的体系",
      "花儿会是重要传承场域",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "liangzhu",
    name: "梁祝传说",
    shortName: "梁祝",
    domain: "口头传统",
    category: "民间文学",
    level: "国家级非物质文化遗产",
    summary: "中国四大民间传说之一，讲述梁山伯与祝英台的爱情故事，被誉为“东方最美的爱情绝唱”。",
    briefIntroduction: "梁祝传说起源于东晋，流传至今已1600多年。故事讲述祝英台女扮男装求学，与梁山伯同窗三载，后因封建礼教阻挠未能结合，最终双双化蝶。这一传说不仅衍生出越剧、小提琴协奏曲等艺术经典，还形成了多地争认“梁祝故里”的文化现象，展现了民间传说强大的生命力。",
    coverImage: "/assets/images/projects/liangzhu.svg",
    bookChapter: "第二章 口头传统和表现形式",
    bookSection: "第四节 梁祝传说：东方最美的爱情绝唱",
    locations: [
      { provinceCode: "zhejiang", provinceName: "浙江省", cityName: "宁波市", displayName: "浙江宁波", isPrimary: true },
      { provinceCode: "jiangsu", provinceName: "江苏省", cityName: "宜兴市", displayName: "江苏宜兴" },
      { provinceCode: "anhui", provinceName: "安徽省", displayName: "安徽" },
      { provinceCode: "shandong", provinceName: "山东省", displayName: "山东" },
      { provinceCode: "henan", provinceName: "河南省", displayName: "河南" },
    ],
    keyFeatures: [
      "中国四大民间传说之一",
      "流传1600多年的爱情叙事",
      "衍生出戏曲、音乐、电影等多种艺术",
      "多地共同传承的文化记忆",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "mulan",
    name: "木兰传说",
    shortName: "木兰",
    domain: "口头传统",
    category: "民间文学",
    level: "国家级非物质文化遗产",
    summary: "讲述花木兰代父从军的巾帼英雄故事，体现了中华民族忠孝节义的传统美德。",
    briefIntroduction: "木兰传说源于北朝民歌《木兰诗》，讲述女子花木兰替父从军、保家卫国的英雄故事。经过1500多年的流传，木兰形象已成为忠孝勇烈的象征，被改编为戏曲、电影、动画等多种艺术形式。河南虞城与湖北黄陂是木兰传说的两大核心传承地，至今仍保留着丰富的纪念遗迹与民俗活动。",
    coverImage: "/assets/images/projects/mulan.svg",
    bookChapter: "第二章 口头传统和表现形式",
    bookSection: "第五节 木兰传说：忠孝勇烈的巾帼传奇",
    locations: [
      { provinceCode: "henan", provinceName: "河南省", cityName: "商丘市虞城县", displayName: "河南虞城", isPrimary: true },
      { provinceCode: "hubei", provinceName: "湖北省", cityName: "武汉市黄陂区", displayName: "湖北黄陂" },
      { provinceCode: "anhui", provinceName: "安徽省", displayName: "安徽" },
    ],
    keyFeatures: [
      "源于北朝民歌《木兰诗》",
      "忠孝节义的文化符号",
      "全球知名的中国女性英雄形象",
      "豫、鄂两地共同传承",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "peking-opera",
    name: "京剧",
    shortName: "京剧",
    domain: "表演艺术",
    category: "传统戏剧",
    level: "人类非物质文化遗产代表作名录",
    summary: "中国影响最大的戏曲剧种，被誉为“国剧”，以唱念做打的综合艺术手法演绎历史故事。",
    briefIntroduction: "京剧形成于清代道光年间，融合徽剧、汉调，并吸收昆曲、秦腔之长，最终在北京定型。它以“生旦净丑”分行当，以“唱念做打”为基本功，以“手眼身法步”为表演要领，形成一套完整的程式化美学体系。代表剧目有《霸王别姬》《贵妃醉酒》《空城计》等。2010年被列入人类非物质文化遗产代表作名录。",
    coverImage: "/assets/images/projects/peking-opera.svg",
    bookChapter: "第三章 表演艺术",
    bookSection: "第二节 京剧：国剧的辉煌与魅力",
    locations: [
      { provinceCode: "beijing", provinceName: "北京市", displayName: "北京", isPrimary: true },
    ],
    keyFeatures: [
      "中国戏曲艺术的最高代表",
      "生旦净丑四行当体系",
      "唱念做打的综合表演艺术",
      "程式化、虚拟化的舞台美学",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "huaxian-shadow-puppetry",
    name: "华县皮影戏",
    shortName: "华县皮影",
    domain: "表演艺术",
    category: "传统戏剧",
    level: "人类非物质文化遗产代表作名录",
    summary: "一束灯光，一方幕布，让精雕细琢的皮影人物在光影中演绎千年故事。",
    briefIntroduction: "华县皮影戏是陕西皮影艺术的重要代表。皮影艺人以经过处理的兽皮制作影偶，通过雕刻、敷彩和缀结形成可以活动的人物。表演时，艺人在白色幕布后操纵影偶，借助灯光、唱腔和乐器演绎历史故事、神话传说和民间故事。",
    coverImage: "/assets/images/projects/huaxian-shadow-puppetry.svg",
    heroImage: "/assets/images/projects/huaxian-shadow-puppetry-hero.svg",
    bookChapter: "第三章 表演艺术",
    bookSection: "第三节 皮影戏：光影里的千年传奇",
    detailRoute: "/project/huaxian-shadow-puppetry",
    videoRoute: "/video/huaxian-shadow-puppetry",
    inscribedYear: "2011年",
    representativeRegion: "陕西华县",
    history: "华县皮影戏历史悠久，可追溯到汉代。据文献记载，皮影戏在宋代已相当成熟，明清时期在关中地区广泛流传。华县（今渭南市华州区）地处关中平原东部，是陕西皮影的重要发源地之一。当地艺人将关中地区的戏曲声腔、民间美术与雕刻技艺融为一体，形成了独具一格的华县皮影风格。近代以来，华县皮影经历了口传心授的家族传承与班社传承，留下了大量传统影卷和雕刻范本。",
    distributionInfo: "华县皮影戏以陕西省渭南市华州区为核心流传区，并辐射关中平原及周边地区。中国皮影戏分布广泛，陕西、河北、山西、甘肃等地风格各异：陕西皮影以华县为代表，唱腔高亢激昂；河北冀中皮影婉约细腻；山西晋南皮影受梆子腔影响；甘肃环县道情皮影则念白浓重，乡土气息浓郁。",
    culturalValue: "华县皮影戏集雕刻、绘画、音乐、文学和表演于一体，是中国民间艺术的综合体现。影偶造型讲究夸张变形、装饰性强，体现了民间艺人高超的造型智慧与审美追求。2011年，中国皮影戏被列入联合国教科文组织人类非物质文化遗产代表作名录。华县皮影戏不仅是地方戏曲的活态遗存，也是研究中国民间美术、戏曲声腔与民俗信仰的重要样本。",
    locations: [
      { provinceCode: "shaanxi", provinceName: "陕西省", cityName: "渭南市", districtName: "华州区", displayName: "陕西省渭南市华州区", isPrimary: true },
    ],
    keyFeatures: [
      "雕刻精细、造型优美",
      "五分脸与七分脸的造型程式",
      "秦腔与碗碗腔的声腔艺术",
      "一人一台戏的操纵绝技",
    ],
    performanceFeatures: [
      "白色幕布",
      "背后灯光",
      "影偶操纵",
      "唱腔演唱",
      "锣鼓伴奏",
      "多角色表演",
    ],
    craftSteps: [
      {
        name: "选皮",
        description: "选用优质牛皮，以三四岁黄牛为佳，皮质坚韧、纤维细腻，具有良好的透光性和韧性。",
      },
      {
        name: "制皮",
        description: "将牛皮刮薄、浸泡、绷紧晾干，使皮面光洁半透明，便于后续雕刻和敷彩。",
      },
      {
        name: "画稿",
        description: "根据传统人物谱式和故事情节设计样稿，确定造型比例、面部表情与装饰纹样。",
      },
      {
        name: "过稿",
        description: "将样稿描摹到处理好的皮面上，作为雕刻依据，要求线条准确、不走样。",
      },
      {
        name: "镂刻",
        description: "用特制的斜口刀、圆口刀等刀具，在皮面上镂刻出人物轮廓、服饰纹样与眉眼细节。",
      },
      {
        name: "敷彩",
        description: "以矿物颜料和植物染料为影偶着色，红、绿、黄、黑等色对比鲜明，经过渲染使人物生动。",
      },
      {
        name: "发汗熨平",
        description: "将敷彩后的影偶夹于热布中熨烫，使颜料固着、皮面平整，延长影偶使用寿命。",
      },
      {
        name: "缀结成形",
        description: "将头、胸、腹、四肢等部件用线缀连，安装操纵杆，使影偶活动自如，可表演各种动作。",
      },
    ],
    videoInfo: {
      title: "皮影是怎样制作出来的？",
      subtitle: "华县皮影戏 · 陕西华县",
      src: "/assets/videos/huaxian-shadow-puppetry.mp4",
      poster: "/assets/images/projects/huaxian-shadow-puppetry-hero.svg",
      duration: 130,
      chapters: [
        {
          time: 10,
          label: "选皮与处理",
        },
        {
          time: 30,
          label: "绘制人物样稿",
        },
        {
          time: 55,
          label: "雕刻与镂空",
        },
        {
          time: 80,
          label: "敷彩",
        },
        {
          time: 105,
          label: "装订与操纵",
        },
      ],
      description: "本视频展示了华县皮影戏影偶的完整制作过程。从选皮、制皮到画稿、镂刻、敷彩、装订，每一步都由经验丰富的皮影艺人亲手完成。通过视频可以直观了解皮影人物的诞生过程，感受传统手工艺的精湛技艺。",
      knowledgeQuestions: [
        "皮影为什么需要使用半透明材料？",
        "皮影人物的关节为什么可以活动？",
        "灯光、影偶和幕布之间是什么关系？",
        "为什么皮影表演既是戏剧，也是美术和音乐？",
      ],
      relatedContent: [
        {
          title: "皮影人物如何表演",
          subtitle: "中国皮影戏 · 陕西华县",
          duration: "04:12",
          thumbnail: "/assets/images/projects/huaxian-shadow-puppetry.svg",
        },
        {
          title: "幕后的皮影艺人",
          subtitle: "中国皮影戏 · 陕西华县",
          duration: "05:08",
          thumbnail: "/assets/images/projects/huaxian-shadow-puppetry-hero.svg",
        },
        {
          title: "不同地区的皮影有什么区别",
          subtitle: "中国皮影戏 · 多地",
          duration: "04:35",
          thumbnail: "/assets/images/projects/huaxian-shadow-puppetry.svg",
        },
      ],
    },
    demoDepth: "full",
    hasVideo: true,
  },
  {
    id: "guqin",
    name: "古琴艺术",
    shortName: "古琴",
    domain: "表演艺术",
    category: "传统音乐",
    level: "人类非物质文化遗产代表作名录",
    summary: "中国最古老的弹拨乐器之一，承载着三千年文人音乐传统，被誉为“七弦上的千年雅韵”。",
    briefIntroduction: "古琴又称七弦琴，已有三千多年历史，是历代文人雅士修身养性的必修之器。古琴艺术注重“清微淡远”的审美意境，代表曲目有《流水》《广陵散》《梅花三弄》等。历代形成浙派、虞山派、广陵派、蜀派等众多流派，留下了三千多首古曲谱，是研究中国音乐史的活化石。2003年被列入人类非物质文化遗产代表作名录。",
    coverImage: "/assets/images/projects/guqin.svg",
    bookChapter: "第三章 表演艺术",
    bookSection: "第四节 古琴艺术：七弦上的千年雅韵",
    locations: [
      { provinceCode: "jiangsu", provinceName: "江苏省", displayName: "江苏（虞山琴派）", isPrimary: true },
      { provinceCode: "zhejiang", provinceName: "浙江省", displayName: "浙江（浙派）" },
      { provinceCode: "shandong", provinceName: "山东省", displayName: "山东（诸城琴派）" },
      { provinceCode: "sichuan", provinceName: "四川省", displayName: "四川（蜀派）" },
      { provinceCode: "beijing", provinceName: "北京市", displayName: "北京（京师琴派）" },
    ],
    keyFeatures: [
      "三千年不间断的文人音乐传统",
      "清微淡远的审美意境",
      "丰富的琴派与曲谱遗产",
      "与书画、诗词深度融合",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "lion-dance",
    name: "狮舞",
    shortName: "狮舞",
    domain: "表演艺术",
    category: "传统舞蹈",
    level: "国家级非物质文化遗产",
    summary: "集武术、舞蹈、音乐于一体的民间表演艺术，以灵动的舞姿和磅礴的气势传递东方祥瑞。",
    briefIntroduction: "狮舞是中国流传最广的民间舞蹈之一，分为南狮与北狮两大流派。南狮以广东佛山醒狮为代表，注重神态与武术技巧，动作矫健灵动；北狮以河北沧州狮舞为代表，讲究翻扑滚打，气势雄浑。狮舞常在春节、庙会等喜庆场合表演，寄托着驱邪纳福、吉祥如意的美好愿望。",
    coverImage: "/assets/images/projects/lion-dance.svg",
    bookChapter: "第三章 表演艺术",
    bookSection: "第五节 狮舞：东方祥瑞的矫健舞姿",
    locations: [
      { provinceCode: "guangdong", provinceName: "广东省", cityName: "佛山市", displayName: "广东佛山（南狮）", isPrimary: true },
      { provinceCode: "hebei", provinceName: "河北省", cityName: "沧州市", displayName: "河北沧州（北狮）" },
      { provinceCode: "beijing", provinceName: "北京市", displayName: "北京" },
    ],
    keyFeatures: [
      "南狮北狮两大流派",
      "集武术、舞蹈、音乐于一体",
      "醒狮“采青”等传统程式",
      "节庆文化的重要载体",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "solar-terms",
    name: "二十四节气",
    shortName: "二十四节气",
    domain: "节庆仪式",
    category: "民俗",
    level: "人类非物质文化遗产代表作名录",
    summary: "中国人通过观察太阳周年运动形成的时间知识体系，被誉为“中国第五大发明”。",
    briefIntroduction: "二十四节气起源于黄河流域，是上古农耕文明的产物。它以地球绕太阳公转周期为基础，将一年划分为二十四个时段，每个节气约15天，指导着农业生产与日常生活。立春、清明、夏至、冬至等节气不仅是农事坐标，更衍生出丰富的节令饮食、祭祀、民俗活动。2016年被列入人类非物质文化遗产代表作名录，国际气象界誉为“中国的第五大发明”。",
    coverImage: "/assets/images/projects/solar-terms.svg",
    bookChapter: "第四章 社会实践、仪式和节庆活动",
    bookSection: "第二节 二十四节气：中国农耕文明的时间密码",
    locations: [
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性项目", isPrimary: true },
    ],
    keyFeatures: [
      "上古农耕文明的时间智慧",
      "指导农业生产与日常生活",
      "衍生丰富的节令民俗",
      "国际气象界誉为第五大发明",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isNationwide: true,
  },
  {
    id: "spring-festival",
    name: "春节",
    shortName: "春节",
    domain: "节庆仪式",
    category: "民俗",
    level: "国家级非物质文化遗产",
    summary: "中国人最隆重的传统节日，凝聚着辞旧迎新、阖家团圆的民族情感，是中华文化最大的集体仪式。",
    briefIntroduction: "春节即农历新年，起源于上古时代的岁首祈年祭祀。从腊月二十三小年开始，到正月十五元宵节结束，期间有扫尘、贴春联、守岁、拜年、舞龙舞狮、吃年夜饭等众多习俗。春节承载着中华民族辞旧迎新、阖家团圆、祈福纳祥的文化心理，是全球华人共同的文化纽带，也是世界上参与人数最多的年度庆典。",
    coverImage: "/assets/images/projects/spring-festival.svg",
    bookChapter: "第四章 社会实践、仪式和节庆活动",
    bookSection: "第三节 春节：中国人最大的集体仪式",
    locations: [
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性项目", isPrimary: true },
    ],
    keyFeatures: [
      "中华民族最隆重的传统节日",
      "跨越近一个月的节庆周期",
      "丰富的年俗与饮食文化",
      "全球华人的文化纽带",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isNationwide: true,
  },
  {
    id: "mazu",
    name: "妈祖祭典",
    shortName: "妈祖祭典",
    domain: "节庆仪式",
    category: "民俗",
    level: "人类非物质文化遗产代表作名录",
    summary: "以海神妈祖为信仰对象的祭祀仪式，是海洋社会精神之光，连接着全球两亿信众的心灵纽带。",
    briefIntroduction: "妈祖原名林默，北宋时期福建莆田湄洲人，因救助海难而被尊为海神。妈祖祭典包括春祭、秋祭、诞辰祭等仪式，伴有进香、巡游、庙会等活动。随着华人移民足迹，妈祖信仰传播到全球40多个国家和地区，建有上万座妈祖庙。2009年“妈祖信俗”被列入人类非物质文化遗产代表作名录，成为中国首个信俗类世界遗产。",
    coverImage: "/assets/images/projects/mazu.svg",
    bookChapter: "第四章 社会实践、仪式和节庆活动",
    bookSection: "第四节 妈祖祭典：海洋社会的信仰之光",
    locations: [
      { provinceCode: "fujian", provinceName: "福建省", cityName: "莆田市湄洲岛", displayName: "福建莆田湄洲", isPrimary: true },
      { provinceCode: "taiwan", provinceName: "台湾省", displayName: "台湾" },
      { provinceCode: "guangdong", provinceName: "广东省", displayName: "广东沿海" },
      { provinceCode: "zhejiang", provinceName: "浙江省", displayName: "浙江沿海" },
    ],
    keyFeatures: [
      "中国首个信俗类世界遗产",
      "海洋社会的精神纽带",
      "春秋两祭的完整仪程",
      "全球两亿信众的文化认同",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "northern-shaanxi-yangge",
    name: "陕北秧歌",
    shortName: "陕北秧歌",
    domain: "节庆仪式",
    category: "传统舞蹈",
    level: "国家级非物质文化遗产",
    summary: "流传于陕北黄土高原的集体舞蹈，以红绸舞动的豪迈奔放，展现黄土地上的生命激情。",
    briefIntroduction: "陕北秧歌是流传于陕西榆林、延安一带的民间广场舞蹈，每逢春节、元宵节，村村寨寨都会组织秧歌队，沿门子拜年、闹社火。表演者手持红绸、彩扇，扭出“十字步”“走场子”等动作，配以锣鼓、唢呐伴奏。陕北秧歌体现了黄土高原人民乐观豪迈的性格，是研究陕北民俗的活态样本。",
    coverImage: "/assets/images/projects/northern-shaanxi-yangge.svg",
    bookChapter: "第四章 社会实践、仪式和节庆活动",
    bookSection: "第五节 陕北秧歌：黄土高原上的集体狂欢",
    locations: [
      { provinceCode: "shaanxi", provinceName: "陕西省", cityName: "榆林市", displayName: "陕西榆林", isPrimary: true },
      { provinceCode: "shaanxi", provinceName: "陕西省", cityName: "延安市", displayName: "陕西延安" },
    ],
    keyFeatures: [
      "黄土高原的集体狂欢",
      "红绸彩扇的标志性道具",
      "沿门子拜年的民俗功能",
      "与陕北民歌、腰鼓互为映衬",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
  {
    id: "acupuncture",
    name: "中医针灸",
    shortName: "针灸",
    domain: "自然知识",
    category: "传统医药",
    level: "人类非物质文化遗产代表作名录",
    summary: "以经络腧穴理论为核心的传统医学体系，用银针与艾草守护中华民族健康数千年。",
    briefIntroduction: "针灸是中医的重要组成部分，包括“针”（针刺）与“灸”（艾灸）两种疗法。它以《黄帝内经》为理论源头，通过刺激人体经络上的特定穴位，调和阴阳、疏通气血，达到治疗疾病的目的。针灸具有适应症广、疗效明显、操作方便、经济安全等优点，已被世界180多个国家和地区接受应用。2010年被列入人类非物质文化遗产代表作名录。",
    coverImage: "/assets/images/projects/acupuncture.svg",
    bookChapter: "第五章 有关自然界和宇宙的知识与实践",
    bookSection: "第二节 中医针灸：银针里的生命哲学",
    locations: [
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性项目", isPrimary: true },
    ],
    keyFeatures: [
      "经络腧穴的完整理论体系",
      "针刺与艾灸的双重疗法",
      "全球180多个国家接受应用",
      "天人合一的生命哲学",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isNationwide: true,
  },
  {
    id: "taijiquan",
    name: "太极拳",
    shortName: "太极拳",
    domain: "自然知识",
    category: "传统体育",
    level: "人类非物质文化遗产代表作名录",
    summary: "以太极阴阳辩证理念为核心的传统拳术，集颐养性情、强身健体、技击对抗于一体。",
    briefIntroduction: "太极拳发源于河南温县陈家沟，由陈王廷于明末清初创编。它以《易经》阴阳辩证思想为核心，结合中医经络学与导引吐纳术，形成刚柔相济、快慢相间、内外兼修的拳术体系。经过数百年发展，衍生出陈、杨、武、吴、孙等众多流派。2020年被列入人类非物质文化遗产代表作名录，目前全球习练者超过3亿人。",
    coverImage: "/assets/images/projects/taijiquan.svg",
    bookChapter: "第五章 有关自然界和宇宙的知识与实践",
    bookSection: "第三节 太极拳：身体中的宇宙观",
    locations: [
      { provinceCode: "henan", provinceName: "河南省", cityName: "焦作市温县陈家沟", displayName: "河南温县陈家沟", isPrimary: true },
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性分布" },
    ],
    keyFeatures: [
      "阴阳辩证的哲学内核",
      "刚柔相济的拳术体系",
      "陈杨武吴孙众多流派",
      "全球3亿人的健身选择",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "abacus",
    name: "珠算",
    shortName: "珠算",
    domain: "自然知识",
    category: "传统知识",
    level: "人类非物质文化遗产代表作名录",
    summary: "以算盘为工具的传统计算方法，被誉为“世界上最古老的计算机”，凝结着中国人的数学智慧。",
    briefIntroduction: "珠算是以算盘为工具进行加、减、乘、除、开方运算的计算技术，起源于汉代，成熟于宋元，明代以后广泛应用于商业与日常生活。算盘结构简单、运算便捷，其口诀体系蕴含着深刻的数学思维。2013年被列入人类非物质文化遗产代表作名录。如今，珠算虽退出实用计算舞台，但作为开发儿童智力的工具与中华文化符号，仍在全球范围内传承。",
    coverImage: "/assets/images/projects/abacus.svg",
    bookChapter: "第五章 有关自然界和宇宙的知识与实践",
    bookSection: "第四节 珠算：算盘上的数学智慧",
    locations: [
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性项目", isPrimary: true },
    ],
    keyFeatures: [
      "世界上最古老的计算机",
      "口诀体系蕴含数学智慧",
      "宋元时期成熟的商业工具",
      "现代转化为智力教育资源",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isNationwide: true,
  },
  {
    id: "chinese-cuisine",
    name: "中餐",
    shortName: "中餐",
    domain: "自然知识",
    category: "传统技艺",
    level: "国家级非物质文化遗产",
    summary: "以“五味调和”为核心的烹饪艺术，承载着中国人“民以食为天”的生活哲学与文化记忆。",
    briefIntroduction: "中餐烹饪技艺历史悠久，讲究色、香、味、形、器的和谐统一。以鲁、川、粤、苏、闽、浙、湘、徽八大菜系为代表，辅以炒、爆、熘、炸、煎、蒸、煮等数十种烹饪技法。中餐不仅是味觉艺术，更蕴含着“和而不同”的哲学思想与“应季而食”的生态智慧。众多名菜背后都有动人的文化故事，是中华文化走向世界的重要名片。",
    coverImage: "/assets/images/projects/chinese-cuisine.svg",
    bookChapter: "第五章 有关自然界和宇宙的知识与实践",
    bookSection: "第五节 中餐：舌尖上的中国智慧",
    locations: [
      { provinceCode: "nationwide", provinceName: "全国", displayName: "全国性项目", isPrimary: true },
    ],
    keyFeatures: [
      "八大菜系的地域风味体系",
      "数十种烹饪技法的工艺传承",
      "五味调和的饮食哲学",
      "节庆礼仪的饮食文化",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isNationwide: true,
  },
  {
    id: "paper-cutting",
    name: "中国剪纸",
    shortName: "剪纸",
    domain: "传统手工艺",
    category: "传统美术",
    level: "人类非物质文化遗产代表作名录",
    summary: "用剪刀或刻刀在纸上创作的民间美术，以镂空艺术展现万象世界，寄托着民众的生活理想。",
    briefIntroduction: "中国剪纸是流传最广的民间艺术之一，各地风格迥异：陕北剪纸粗犷豪放、河北蔚县剪纸点彩绚丽、扬州剪纸清秀典雅、广东剪纸金碧辉煌。剪纸广泛应用于窗花、门笺、墙花、灯花等民俗场景，题材涵盖花鸟鱼虫、戏曲人物、吉祥图案等。2009年被列入人类非物质文化遗产代表作名录。",
    coverImage: "/assets/images/projects/paper-cutting.svg",
    bookChapter: "第六章 传统手工艺",
    bookSection: "第二节 中国剪纸：剪刀里的万象世界",
    locations: [
      { provinceCode: "shaanxi", provinceName: "陕西省", displayName: "陕西（陕北剪纸）", isPrimary: true },
      { provinceCode: "shanxi", provinceName: "山西省", displayName: "山西" },
      { provinceCode: "hebei", provinceName: "河北省", cityName: "蔚县", displayName: "河北蔚县" },
      { provinceCode: "zhejiang", provinceName: "浙江省", displayName: "浙江" },
      { provinceCode: "guangdong", provinceName: "广东省", displayName: "广东" },
    ],
    keyFeatures: [
      "流传最广的民间美术",
      "镂空艺术的独特语言",
      "南北迥异的风格流派",
      "民俗生活的重要装饰",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "silk-weaving",
    name: "中国传统桑蚕丝织技艺",
    shortName: "桑蚕丝织",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "从栽桑养蚕到缫丝织绸的完整技艺体系，开启了丝绸之路的文明之旅，被誉为“纤维皇后”。",
    briefIntroduction: "中国是世界上最早栽桑养蚕、缫丝织绸的国家，已有五千多年历史。传统桑蚕丝织技艺包括栽桑、养蚕、缫丝、染色、织造等完整流程，诞生了绫、罗、绸、缎、锦等众多丝织品种。浙江杭州、江苏苏州、四川成都等地至今保留着完整的传统技艺。2009年被列入人类非物质文化遗产代表作名录，见证了中国作为“丝国”的辉煌文明。",
    coverImage: "/assets/images/projects/silk-weaving.svg",
    bookChapter: "第六章 传统手工艺",
    bookSection: "第三节 中国传统桑蚕丝织技艺：从蚕到丝的文明之旅",
    locations: [
      { provinceCode: "zhejiang", provinceName: "浙江省", cityName: "杭州市", displayName: "浙江杭州", isPrimary: true },
      { provinceCode: "jiangsu", provinceName: "江苏省", cityName: "苏州市", displayName: "江苏苏州" },
      { provinceCode: "sichuan", provinceName: "四川省", displayName: "四川" },
    ],
    keyFeatures: [
      "五千年的完整技艺体系",
      "绫罗绸缎的丰富品种",
      "丝绸之路的文明载体",
      "杭苏蜀三大传承核心区",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "nanjing-yunjin",
    name: "南京云锦织造技艺",
    shortName: "南京云锦",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "中国织锦技艺的最高代表，以“寸锦寸金”的皇家气象，被誉为“锦中之冠”。",
    briefIntroduction: "南京云锦因其色泽光丽如天上云霞而得名，已有1580年历史，元明清三朝均为皇家御用贡品。云锦织造使用传统的大花楼木织机，由拽花工与织手上下配合，每天仅能织出5-6厘米，故有“寸锦寸金”之说。其独特的“挑花结本”“通经断纬”技艺至今无法用现代机器替代。2009年被列入人类非物质文化遗产代表作名录。",
    coverImage: "/assets/images/projects/nanjing-yunjin.svg",
    bookChapter: "第六章 传统手工艺",
    bookSection: "第四节 南京云锦织造技艺：织机上的皇家气象",
    locations: [
      { provinceCode: "jiangsu", provinceName: "江苏省", cityName: "南京市", displayName: "江苏南京", isPrimary: true },
    ],
    keyFeatures: [
      "皇家御用的锦中之冠",
      "大花楼木织机的双人协作",
      "寸锦寸金的极致工艺",
      "至今无法被机器替代",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
  {
    id: "li-textile",
    name: "黎族传统纺染织绣技艺",
    shortName: "黎锦技艺",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "海南岛黎族妇女传承三千年的纺织技艺，以“黎锦光辉艳若云”的绚烂，编织着热带雨林的文化密码。",
    briefIntroduction: "黎族传统纺染织绣技艺是海南黎族妇女创造的一种古老纺织技艺，包括纺、染、织、绣四大工序。黎锦图案多达百余种，人形纹、蛙纹、龙纹等图腾蕴含着黎族的历史记忆与神话传说。元代黄道婆曾向黎族妇女学习纺织技艺，推动了内地棉纺织业的发展。2009年被列入人类非物质文化遗产代表作名录，被誉为中国纺织史上的“活化石”。",
    coverImage: "/assets/images/projects/li-textile.svg",
    bookChapter: "第六章 传统手工艺",
    bookSection: "第五节 黎族传统纺染织绣技艺：热带雨林中的纺织密码",
    locations: [
      { provinceCode: "hainan", provinceName: "海南省", displayName: "海南中南部黎族地区", isPrimary: true },
    ],
    keyFeatures: [
      "三千年的黎族纺织活化石",
      "纺染织绣四大完整工序",
      "百余种图腾图案体系",
      "曾启发黄道婆革新棉纺",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
  {
    id: "wooden-architecture",
    name: "中国传统木结构建筑营造技艺",
    shortName: "木结构营造",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "以榫卯结构为核心的传统建筑技艺，不用一枚铁钉就能建造屹立千年的宫殿与民居。",
    briefIntroduction: "中国传统木结构建筑营造技艺以木材为主要建材，以榫卯为结构关节，以模数制为设计规范，创造了故宫、应县木塔、悬空寺等建筑奇迹。这一技艺由师徒口传心授延续七千年，衍生出官式营造、香山帮、徽派、闽南等众多流派。2009年被列入人类非物质文化遗产代表作名录，体现了中国人“天人合一”的建筑哲学。",
    coverImage: "/assets/images/projects/wooden-architecture.svg",
    bookChapter: "第七章 传统手工艺（下篇）",
    bookSection: "第一节 中国传统木结构建筑营造技艺：不用钉子的建筑智慧",
    locations: [
      { provinceCode: "shanxi", provinceName: "山西省", displayName: "山西（古建筑宝库）", isPrimary: true },
      { provinceCode: "beijing", provinceName: "北京市", displayName: "北京（官式营造）" },
      { provinceCode: "jiangsu", provinceName: "江苏省", displayName: "江苏（香山帮）" },
      { provinceCode: "zhejiang", provinceName: "浙江省", displayName: "浙江" },
      { provinceCode: "anhui", provinceName: "安徽省", displayName: "安徽" },
    ],
    keyFeatures: [
      "不用一枚铁钉的榫卯智慧",
      "七千年不间断的技艺传承",
      "官式与民间众多流派",
      "天人合一的建筑哲学",
    ],
    demoDepth: "preview",
    hasVideo: false,
    isCrossProvince: true,
  },
  {
    id: "longquan-celadon",
    name: "龙泉青瓷传统烧制技艺",
    shortName: "龙泉青瓷",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "以“雨过天青云破处”的釉色闻名于世，是全球首个入选人类非遗的陶瓷类项目。",
    briefIntroduction: "龙泉青瓷始烧于三国两晋，鼎盛于南宋，以“青如玉、明如镜、薄如纸、声如磬”著称。其釉色以粉青、梅子青为极品，需经粉碎、淘洗、陈腐、练泥、成型、修坯、素烧、施釉、装窑、烧成等七十二道工序。龙泉青瓷曾远销亚非欧三大洲，对世界陶瓷史产生深远影响。2009年被列入人类非物质文化遗产代表作名录，是全球陶瓷类首个入选项目。",
    coverImage: "/assets/images/projects/longquan-celadon.svg",
    bookChapter: "第七章 传统手工艺（下篇）",
    bookSection: "第二节 龙泉青瓷传统烧制技艺：雨过天青的千年釉色",
    locations: [
      { provinceCode: "zhejiang", provinceName: "浙江省", cityName: "龙泉市", displayName: "浙江龙泉", isPrimary: true },
    ],
    keyFeatures: [
      "全球首个陶瓷类人类非遗",
      "粉青梅子青的极致釉色",
      "七十二道工序的完整工艺",
      "宋元时期的海上瓷路",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
  {
    id: "pingyao-lacquer",
    name: "平遥推光漆器髹饰技艺",
    shortName: "平遥推光漆器",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "国家级非物质文化遗产",
    summary: "以手掌推磨出千年光泽的传统漆器技艺，使平遥推光漆器成为中国四大名漆器之一。",
    briefIntroduction: "平遥推光漆器始创于唐代开元年间，已有1200多年历史。其独特之处在于“推光”工艺：工匠用手掌蘸麻油反复推磨漆面，使漆器呈现出温润如玉的光泽。制作工艺包括制胎、刮灰、上漆、彩绘、推光、描金等数十道，成品具有耐酸碱、耐高温、永不褪色等特性。与福州脱胎漆器、扬州漆器、北京雕漆并称中国四大名漆器。",
    coverImage: "/assets/images/projects/pingyao-lacquer.svg",
    bookChapter: "第七章 传统手工艺（下篇）",
    bookSection: "第三节 平遥推光漆器髹饰技艺：手掌推出的千年光泽",
    locations: [
      { provinceCode: "shanxi", provinceName: "山西省", cityName: "晋中市平遥县", displayName: "山西平遥", isPrimary: true },
    ],
    keyFeatures: [
      "中国四大名漆器之一",
      "手掌推光的独家绝技",
      "千二百年唐代传承",
      "永不褪色的工艺品质",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
  {
    id: "movable-type",
    name: "中国活字印刷术",
    shortName: "活字印刷",
    domain: "传统手工艺",
    category: "传统技艺",
    level: "人类非物质文化遗产代表作名录",
    summary: "北宋毕昇发明的活字印刷技术，比欧洲古登堡印刷术早四百年，是文明传播的伟大革命。",
    briefIntroduction: "北宋庆历年间，平民毕昇发明泥活字印刷术，标志着印刷史上的一次伟大革命。此后又发展出木活字、铜活字等形式。浙江瑞安至今保留着用木活字编印家谱的传统，完整传承了写字、刻字、排版、印刷、装订等全套工艺。2010年被列入人类非物质文化遗产代表作名录，见证了中国作为印刷术故乡的文明贡献。",
    coverImage: "/assets/images/projects/movable-type.svg",
    bookChapter: "第七章 传统手工艺（下篇）",
    bookSection: "第四节 中国活字印刷术：一字千金的文明密码",
    locations: [
      { provinceCode: "zhejiang", provinceName: "浙江省", cityName: "瑞安市", displayName: "浙江瑞安", isPrimary: true },
    ],
    keyFeatures: [
      "比欧洲早四百年的伟大发明",
      "泥木铜等多种活字形态",
      "瑞安活态传承的完整工艺",
      "推动世界文明传播的革命",
    ],
    demoDepth: "preview",
    hasVideo: false,
  },
];

// ============================================================
// 工具函数
// ============================================================

/** 按ID获取项目 */
export function getProjectById(id: string): HeritageProject | undefined {
  return bookProjects.find((p) => p.id === id);
}

/** 获取某个省份关联的所有项目（按isPrimary优先排序） */
export function getProjectsByProvince(provinceCode: string): HeritageProject[] {
  return bookProjects
    .filter(
      (p) =>
        p.isNationwide ||
        p.locations.some((loc) => loc.provinceCode === provinceCode)
    )
    .sort((a, b) => {
      // 省份直接关联的项目排前面，全国性项目排后面
      const aDirect = a.locations.some(
        (loc) => loc.provinceCode === provinceCode
      );
      const bDirect = b.locations.some(
        (loc) => loc.provinceCode === provinceCode
      );
      if (aDirect !== bDirect) return aDirect ? -1 : 1;
      // 同为省份关联：isPrimary 优先
      const aIsPrimary = a.locations.some(
        (loc) => loc.provinceCode === provinceCode && loc.isPrimary
      )
        ? 0
        : 1;
      const bIsPrimary = b.locations.some(
        (loc) => loc.provinceCode === provinceCode && loc.isPrimary
      )
        ? 0
        : 1;
      return aIsPrimary - bIsPrimary;
    });
}

/** 按领域筛选项目 */
export function getProjectsByDomain(domain?: HeritageDomain): HeritageProject[] {
  if (!domain) return bookProjects;
  return bookProjects.filter((p) => p.domain === domain);
}

/** 关键词搜索（匹配名称/省份/地区/领域/门类/简介） */
export function searchProjects(keyword: string): HeritageProject[] {
  if (!keyword.trim()) return bookProjects;
  const kw = keyword.trim().toLowerCase();
  return bookProjects.filter((p) => {
    const inName = p.name.toLowerCase().includes(kw);
    const inCategory = p.category.toLowerCase().includes(kw);
    const inDomain = p.domain.toLowerCase().includes(kw);
    const inSummary = p.summary.toLowerCase().includes(kw);
    const inLocation = p.locations.some(
      (loc) =>
        loc.provinceName.toLowerCase().includes(kw) ||
        loc.displayName.toLowerCase().includes(kw) ||
        (loc.cityName && loc.cityName.toLowerCase().includes(kw))
    );
    return inName || inCategory || inDomain || inSummary || inLocation;
  });
}

/** 统计某个省份的读本收录项目数（含全国性项目） */
export function countProjectsByProvince(provinceCode: string): number {
  return bookProjects.filter(
    (p) =>
      p.isNationwide ||
      p.locations.some((loc) => loc.provinceCode === provinceCode)
  ).length;
}

/** 获取所有有项目的省份代码列表（用于地图高亮） */
export function getProvincesWithProjects(): string[] {
  const set = new Set<string>();
  bookProjects.forEach((p) => {
    p.locations.forEach((loc) => {
      if (loc.provinceCode !== "nationwide") {
        set.add(loc.provinceCode);
      }
    });
  });
  return Array.from(set);
}

/** 五大领域常量 */
export const HERITAGE_DOMAINS: HeritageDomain[] = [
  "口头传统",
  "表演艺术",
  "节庆仪式",
  "自然知识",
  "传统手工艺",
];

/** 华县皮影戏ID（Demo中唯一深度开发的项目） */
export const FEATURED_PROJECT_ID = "huaxian-shadow-puppetry";
