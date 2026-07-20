# 非遗中国地图 · Demo

> 基于《非遗读本》构建的中国非物质文化遗产地图化浏览 Demo，以华县皮影戏为深度演示项目。

## 概述

本 Demo 实现"两层内容结构"：

- **第一层**：全书 24 个非遗项目的地图化浏览——全国地图、分省地图、项目列表、轻量图文介绍页
- **第二层**：华县皮影戏完整演示——详情页、内容标签切换、制作技艺交互、地理分布、收藏分享、视频播放

所有数据存储在本地静态文件中，无需后端即可独立运行。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | UI 框架 |
| TypeScript | 5.5 | 类型安全 |
| Vite | 5.4 | 构建工具 |
| React Router | 6.26 | 路由 |
| SCSS Modules | - | 样式隔离 |
| Lucide React | 0.400 | 图标库 |

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（默认端口 5173）
npm run dev

# 类型检查
npm run typecheck

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

构建产物输出到 `dist/` 目录，可直接用任意静态服务器部署。

## 目录结构

```
demo/
├── public/
│   └── assets/
│       ├── images/projects/       # 24个项目封面SVG + 华县皮影hero图 + 视频封面
│       └── videos/                # 华县皮影视频
├── src/
│   ├── components/                # 通用组件
│   │   ├── BottomNav.tsx          # 底部导航栏
│   │   ├── ChinaMap.tsx           # 全国SVG地图（真实省份边界）
│   │   ├── FullPageLayout.tsx     # 全屏布局壳（详情页用）
│   │   ├── HuaxianMiniMap.tsx     # 华县皮影地理分布小地图
│   │   ├── PageHeader.tsx         # 页面头部
│   │   ├── ProjectImage.tsx       # 项目封面图（自动降级占位图）
│   │   ├── ProvinceBubble.tsx     # 省份点击弹窗
│   │   ├── ProvinceOutline.tsx    # 省级轮廓图（真实边界+城市标记）
│   │   └── TabLayout.tsx          # 带底部导航的布局壳
│   ├── data/
│   │   ├── bookProjects.ts        # ★ 唯一数据源（24个项目，由Python生成）
│   │   ├── chinaGeoData.ts        # 34省份真实SVG边界+城市坐标
│   │   └── provinces.ts           # 省份代码→名称映射
│   ├── pages/
│   │   ├── MapHomePage.tsx        # 全国地图首页
│   │   ├── ProvincePage.tsx       # 省级项目页
│   │   ├── ProjectsListPage.tsx   # 全部项目列表页
│   │   ├── ProjectDetailPage.tsx  # 普通项目轻量详情页
│   │   ├── HuaxianDetailPage.tsx  # 华县皮影戏完整详情页
│   │   ├── VideoPlayerPage.tsx    # 华县皮影戏视频播放页
│   │   └── PlaceholderTab.tsx     # 占位Tab
│   ├── styles/
│   │   ├── variables.scss         # 设计令牌（颜色/字号/间距）
│   │   ├── mixins.scss            # SCSS混入
│   │   └── global.scss            # 全局重置+工具类
│   ├── utils/
│   │   └── toast.ts               # 纯DOM Toast提示
│   ├── App.tsx                    # 路由配置
│   └── main.tsx                   # 入口
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 全国地图首页 | SVG地图+省份标记+搜索筛选+底部项目面板 |
| `/province/:provinceCode` | 省级项目页 | 省份轮廓+项目列表+三维度筛选 |
| `/projects` | 全部项目列表页 | 五大领域筛选+省份筛选+关键词搜索 |
| `/project/huaxian-shadow-puppetry` | 华县皮影戏详情页 | 6标签切换+8步制作技艺+迷你地图+收藏分享 |
| `/project/:projectId` | 普通项目详情页 | 轻量图文介绍模板（23个preview项目共用） |
| `/video/huaxian-shadow-puppetry` | 视频播放页 | 自定义播放器+5章节跳转+3标签切换 |

## 如何新增非遗项目

### 方法一：修改 Python 数据生成器（推荐）

1. 编辑 `dev-logs/generate-data.py`，在 `projects` 列表中添加新项目字典：

```python
{
    "id": "new-project-id",           # 唯一ID，英文短横线
    "name": "项目名称",
    "shortName": "简称",
    "domain": "传统手工艺",             # 五大领域之一
    "category": "传统技艺",             # 门类
    "level": "国家级非物质文化遗产",
    "locations": [
        {"provinceCode": "zhejiang", "provinceName": "浙江省", "displayName": "浙江", "isPrimary": True},
    ],
    "summary": "一句话介绍（30-60字）",
    "briefIntroduction": "项目摘要（150-300字）",
    "keyFeatures": ["特色1", "特色2", "特色3"],
    "coverImage": "/assets/images/projects/new-project-id.svg",
    "demoDepth": "preview",            # preview 或 full
    "hasVideo": False,
    "isNationwide": False,             # 全国性项目设为True
    "isCrossProvince": False,          # 跨省项目设为True
},
```

2. 运行生成器：

```bash
cd ..
python dev-logs/generate-data.py
```

3. 在 `demo/public/assets/images/projects/` 目录放置封面图（SVG 或 JPG/PNG），文件名与 `coverImage` 路径对应。

4. 如果项目属于新省份，在 `dev-logs/generate-data.py` 的 `PROVINCE_MAP` 中添加省份映射，然后重新生成。

### 方法二：直接编辑 TS 文件（不推荐，但可快速测试）

直接在 `demo/src/data/bookProjects.ts` 的 `bookProjects` 数组中添加项目对象。注意字符串中不要混用中英文引号。

## 如何替换项目封面图

1. 准备图片文件（建议 SVG 或 JPG，宽高比 4:3，分辨率不低于 800x600）
2. 放置到 `demo/public/assets/images/projects/` 目录
3. 文件名与 `bookProjects.ts` 中 `coverImage` 字段的路径一致

当前所有封面图为 Python 生成的文化纹样 SVG 占位图（含领域配色、祥云纹、回纹边框、项目名称）。替换为真实照片时，保持文件名不变即可，无需修改代码。

生成占位图的脚本：`dev-logs/generate_placeholders.py`

```bash
cd ..
python dev-logs/generate_placeholders.py
```

### 领域配色

| 领域 | 颜色 |
|------|------|
| 口头传统 | #C89A4B（淡金） |
| 表演艺术 | #B9473D（朱砂红） |
| 节庆仪式 | #4A7C59（苍翠绿） |
| 自然知识 | #315B67（青黛蓝） |
| 传统手工艺 | #8B6F47（棕褐） |

## 如何替换华县皮影视频

1. 将新视频文件复制到：

```
demo/public/assets/videos/huaxian-shadow-puppetry.mp4
```

2. 如果新视频时长不同，需更新 `dev-logs/generate-data.py` 中华县皮影的 `videoInfo.chapters` 时间戳。当前章节（基于 2 分 10 秒视频）：

| 章节 | 时间 |
|------|------|
| 选皮与处理 | 00:10 |
| 绘制人物样稿 | 00:30 |
| 雕刻与镂空 | 00:55 |
| 敷彩 | 01:20 |
| 装订与操纵 | 01:45 |

3. 更新 `videoInfo.duration` 字段（秒），然后运行 `python dev-logs/generate-data.py` 重新生成数据文件。

## 数据架构说明

### 数据生成链

```
dev-logs/generate-data.py  →  demo/src/data/bookProjects.ts  →  各页面组件读取
dev-logs/convert_geojson.py  →  demo/src/data/chinaGeoData.ts  →  ChinaMap / ProvinceOutline
```

**不要直接编辑 `bookProjects.ts`**，所有数据修改应在 `generate-data.py` 中完成，然后重新生成。

### 全国性项目

5 个全国性项目（二十四节气/春节/中医针灸/珠算/中餐）设置 `isNationwide: true`，自动计入每个省份的统计。在省级项目列表中，全国性项目排在省份本地项目之后。

### 跨省项目

12 个跨省项目（如格萨尔/花儿/梁祝传说等）设置 `isCrossProvince: true`，在 `locations` 数组中配置多个省份，每个省份的列表中都会出现。

## 验收标准对照

| # | 验收项 | 状态 |
|---|--------|------|
| 1 | 全国地图能展示书稿项目在各省分布 | 通过 |
| 2 | 分省页面列出该省关联的全部书稿项目 | 通过 |
| 3 | 全部中国项目可从"全部项目"页面找到 | 通过 |
| 4 | 每个项目至少有一张图和一段介绍 | 通过（SVG占位图+图文） |
| 5 | 点击任意项目不会进入空页面 | 通过 |
| 6 | 普通项目进入轻量图文介绍页 | 通过 |
| 7 | 普通项目不显示可用视频播放功能 | 通过（灰色禁用按钮） |
| 8 | 华县皮影戏具有完整详情页 | 通过 |
| 9 | 只有华县皮影戏可进入视频播放页 | 通过 |
| 10 | 陕西页面至少显示华县皮影戏和陕北秧歌 | 通过 |
| 11 | 筛选项目时地图和列表同步变化 | 通过 |
| 12 | 数据全部来自本地配置文件 | 通过 |
| 13 | 不连接后端和数据库 | 通过 |
| 14 | npm run dev 可以运行 | 通过 |
| 15 | npm run build 可以通过 | 通过 |
| 16 | 手机页面没有横向溢出 | 通过（430px居中布局） |
| 17 | 图片缺失时不出现破图 | 通过（ProjectImage自动降级） |
| 18 | 控制台无持续报错 | 通过 |
| 19 | 提供README | 通过（本文件） |
| 20 | README说明如何新增项目、替换图片和替换视频 | 通过（见上方章节） |

## 项目清单（24项）

| # | 项目名称 | 领域 | 深度 |
|---|----------|------|------|
| 1 | 格萨尔 | 口头传统 | preview |
| 2 | 花儿 | 口头传统 | preview |
| 3 | 梁祝传说 | 口头传统 | preview |
| 4 | 木兰传说 | 口头传统 | preview |
| 5 | 京剧 | 表演艺术 | preview |
| 6 | **华县皮影戏** | **表演艺术** | **full** |
| 7 | 古琴艺术 | 表演艺术 | preview |
| 8 | 狮舞 | 表演艺术 | preview |
| 9 | 二十四节气 | 节庆仪式 | preview（全国性） |
| 10 | 春节 | 节庆仪式 | preview（全国性） |
| 11 | 妈祖祭典 | 节庆仪式 | preview |
| 12 | 陕北秧歌 | 节庆仪式 | preview |
| 13 | 中医针灸 | 自然知识 | preview（全国性） |
| 14 | 太极拳 | 自然知识 | preview |
| 15 | 珠算 | 自然知识 | preview（全国性） |
| 16 | 中餐 | 自然知识 | preview（全国性） |
| 17 | 中国剪纸 | 传统手工艺 | preview |
| 18 | 中国传统桑蚕丝织技艺 | 传统手工艺 | preview |
| 19 | 南京云锦织造技艺 | 传统手工艺 | preview |
| 20 | 黎族传统纺染织绣技艺 | 传统手工艺 | preview |
| 21 | 中国传统木结构建筑营造技艺 | 传统手工艺 | preview |
| 22 | 龙泉青瓷传统烧制技艺 | 传统手工艺 | preview |
| 23 | 平遥推光漆器髹饰技艺 | 传统手工艺 | preview |
| 24 | 中国活字印刷术 | 传统手工艺 | preview |

## 素材清单

### 已有素材

| 类型 | 路径 | 说明 |
|------|------|------|
| 项目封面图 | `public/assets/images/projects/*.svg` | 24个项目 + 1个hero图 + 1个视频封面，共26个SVG |
| 视频文件 | `public/assets/videos/huaxian-shadow-puppetry.mp4` | 皮影的制作过程，约2分10秒 |
| 省份边界数据 | `src/data/chinaGeoData.ts` | 34省真实SVG边界+城市坐标，由GeoJSON转换 |

### 待替换素材（如有真实素材）

| 类型 | 路径 | 说明 |
|------|------|------|
| 项目封面图 | `public/assets/images/projects/{id}.svg` | 替换为真实照片时保持文件名不变 |
| 华县皮影hero图 | `public/assets/images/projects/huaxian-shadow-puppetry-hero.svg` | 详情页顶部大图 |
| 视频封面 | `public/assets/images/projects/video-poster.svg` | 视频播放前的封面 |
| 华县皮影视频 | `public/assets/videos/huaxian-shadow-puppetry.mp4` | 替换视频后需更新章节时间戳 |

## 开发工具脚本

| 脚本 | 用途 |
|------|------|
| `dev-logs/generate-data.py` | 生成 `bookProjects.ts` 数据文件 |
| `dev-logs/convert_geojson.py` | 将 GeoJSON 转换为 `chinaGeoData.ts` |
| `dev-logs/generate_placeholders.py` | 生成项目封面 SVG 占位图 |
| `dev-logs/开发记录.md` | 各阶段开发验收记录 |

## 适配说明

- 主要适配手机浏览器，最大宽度 430px 居中显示
- 桌面浏览器两侧使用米白色背景，不横向拉伸
- 支持微信内置浏览器打开
- 可通过二维码扫码访问
