import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Share2,
  MapPin,
  Play,
  Bookmark,
  ChevronLeft,
} from "lucide-react";
import { getProjectById } from "../data/bookProjects";
import { showToast } from "../utils/toast";
import HuaxianMiniMap from "../components/HuaxianMiniMap";
import ProjectImage from "../components/ProjectImage";
import styles from "./HuaxianDetailPage.module.scss";

const TABS = [
  "项目简介",
  "历史源流",
  "地理分布",
  "制作技艺",
  "表演特色",
  "文化价值",
] as const;

const FAVORITE_KEY = "favorite_huaxian";

export default function HuaxianDetailPage() {
  const project = getProjectById("huaxian-shadow-puppetry");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    try {
      setFavorited(localStorage.getItem(FAVORITE_KEY) === "true");
    } catch {
      // ignore
    }
  }, []);

  if (!project) return null;

  const craftSteps = project.craftSteps ?? [];
  const performanceFeatures = project.performanceFeatures ?? [];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project.name} - 非遗中国地图`,
          text: project.summary,
          url,
        });
      } catch {
        // 用户取消分享
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast("链接已复制到剪贴板");
      } catch {
        showToast("复制失败");
      }
    } else {
      showToast("您的浏览器不支持分享");
    }
  };

  const handleFavorite = () => {
    const next = !favorited;
    setFavorited(next);
    try {
      localStorage.setItem(FAVORITE_KEY, String(next));
    } catch {
      // ignore
    }
    showToast(next ? "已收藏" : "已取消收藏");
  };

  const tags = [
    project.level?.includes("人类") ? "世界非遗" : project.level,
    project.category,
    project.domain,
    "完整演示",
  ].filter(Boolean) as string[];

  return (
    <div className={styles.page}>
      {/* 顶部操作栏 */}
      <header className={styles.topBar}>
        <Link to="/" className={styles.iconBtn} aria-label="返回">
          <ChevronLeft size={22} color="#282421" />
        </Link>
        <div className={styles.topActions}>
          <button
            className={styles.iconBtn}
            onClick={handleFavorite}
            aria-label={favorited ? "已收藏" : "收藏"}
          >
            <Heart
              size={20}
              fill={favorited ? "#B9473D" : "none"}
              color={favorited ? "#B9473D" : "#282421"}
            />
          </button>
          <button
            className={styles.iconBtn}
            onClick={handleShare}
            aria-label="分享"
          >
            <Share2 size={18} color="#282421" />
          </button>
        </div>
      </header>

      {/* 封面 */}
      <section className={styles.hero}>
        <ProjectImage
          src={project.heroImage || project.coverImage}
          alt={project.name}
          projectName={project.shortName || project.name}
          domainColor="#B9473D"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </section>

      {/* 标题区 */}
      <section className={styles.titleSection}>
        <h1 className={styles.title}>{project.name}</h1>
        <div className={styles.tags}>
          {tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
        <p className={styles.summary}>{project.summary}</p>
      </section>

      {/* 基本信息网格 */}
      <section className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>代表地区</span>
          <span className={styles.infoValue}>
            {project.representativeRegion || "陕西华县"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>所属门类</span>
          <span className={styles.infoValue}>{project.category}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>列入时间</span>
          <span className={styles.infoValue}>
            {project.inscribedYear || "2011年"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>保护级别</span>
          <span className={styles.infoValue}>{project.level}</span>
        </div>
      </section>

      {/* 内容标签 */}
      <nav className={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* 标签内容 */}
      <div className={styles.tabContent}>
        {/* 项目简介 */}
        {activeTab === 0 && (
          <div className={styles.contentBlock}>
            <p className={styles.contentText}>{project.briefIntroduction}</p>
            <div className={styles.featureList}>
              {project.keyFeatures.map((f) => (
                <span key={f} className={styles.featureTag}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 历史源流 */}
        {activeTab === 1 && (
          <div className={styles.contentBlock}>
            <p className={styles.contentText}>
              {project.history ||
                "华县皮影戏历史悠久，起源于汉代，至今已有近两千年传承。华县（今渭南市华州区）是陕西皮影的重要发源地之一，其雕刻技艺和表演风格在皮影艺术中独树一帜。"}
            </p>
          </div>
        )}

        {/* 地理分布 */}
        {activeTab === 2 && (
          <div className={styles.contentBlock}>
            <HuaxianMiniMap />
            <p className={styles.contentText}>{project.distributionInfo}</p>
          </div>
        )}

        {/* 制作技艺 */}
        {activeTab === 3 && (
          <div className={styles.contentBlock}>
            <div className={styles.steps}>
              {craftSteps.map((step, i) => (
                <button
                  key={step.name}
                  className={`${styles.step} ${activeStep === i ? styles.stepActive : ""}`}
                  onClick={() => setActiveStep(i)}
                >
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepName}>{step.name}</span>
                </button>
              ))}
            </div>
            {craftSteps.length > 0 && (
              <div className={styles.stepDetail}>
                <h4>
                  {activeStep + 1}. {craftSteps[activeStep].name}
                </h4>
                <p>{craftSteps[activeStep].description}</p>
              </div>
            )}
          </div>
        )}

        {/* 表演特色 */}
        {activeTab === 4 && (
          <div className={styles.contentBlock}>
            <ul className={styles.performList}>
              {performanceFeatures.map((item) => (
                <li key={item} className={styles.performItem}>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.contentText}>
              华县皮影戏表演时，艺人在白色幕布后操纵影偶，观众在幕布前观看。灯光从幕后照射，使皮影人物在幕布上形成清晰的剪影。艺人一人可操纵多个角色，同时兼演唱、念白，配合锣鼓伴奏，形成“一人一台戏”的独特表演形式。
            </p>
          </div>
        )}

        {/* 文化价值 */}
        {activeTab === 5 && (
          <div className={styles.contentBlock}>
            <p className={styles.contentText}>
              {project.culturalValue ||
                "华县皮影戏集雕刻、绘画、音乐、文学和表演于一体，是中国民间艺术的综合体现。2011年，中国皮影戏被列入人类非物质文化遗产代表作名录。"}
            </p>
          </div>
        )}
      </div>

      {/* 底部固定操作栏 */}
      <div className={styles.actionBar}>
        <button className={styles.actionBtn} onClick={handleFavorite}>
          <Bookmark
            size={18}
            color={favorited ? "#B9473D" : "#282421"}
            fill={favorited ? "#B9473D" : "none"}
          />
          <span>{favorited ? "已收藏" : "收藏"}</span>
        </button>
        <Link to="/" className={styles.actionBtn}>
          <MapPin size={18} color="#282421" />
          <span>查看地图</span>
        </Link>
        <Link
          to={project.videoRoute || "/video/huaxian-shadow-puppetry"}
          className={styles.actionPrimary}
        >
          <Play size={18} color="#fff" />
          <span>观看视频</span>
        </Link>
      </div>
    </div>
  );
}
