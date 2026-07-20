import { useParams, Link, Navigate } from "react-router-dom";
import { MapPin, BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ProjectImage from "../components/ProjectImage";
import { showToast } from "../utils/toast";
import {
  getProjectById,
  BOOK_NAME,
  FEATURED_PROJECT_ID,
} from "../data/bookProjects";
import styles from "./ProjectDetailPage.module.scss";

const DOMAIN_COLORS: Record<string, string> = {
  口头传统: "#C89A4B",
  表演艺术: "#B9473D",
  节庆仪式: "#4A7C59",
  自然知识: "#315B67",
  传统手工艺: "#8B6F47",
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = getProjectById(projectId ?? "");

  // 华县皮影戏走专属完整详情页，此处做安全拦截
  if (projectId === FEATURED_PROJECT_ID) {
    return <Navigate to="/" replace />;
  }

  if (!project) {
    return (
      <>
        <PageHeader title="项目未找到" />
        <div className={styles.empty}>
          <p>未找到ID为 "{projectId}" 的项目</p>
          <Link to="/projects" className={styles.backLink}>返回全部项目</Link>
        </div>
      </>
    );
  }

  const domainColor = DOMAIN_COLORS[project.domain] ?? "#B9473D";

  return (
    <>
      <PageHeader
        title={project.name}
        subtitle={project.locations[0]?.displayName}
      />
      <div className={styles.page}>
        {/* 封面 */}
        <div className={styles.cover}>
          <ProjectImage
            src={project.coverImage}
            alt={project.name}
            projectName={project.shortName ?? project.name}
            domainColor={domainColor}
          />
        </div>

        {/* 基本信息 */}
        <section className={styles.section}>
          <h1 className={styles.projectName}>{project.name}</h1>
          <div className={styles.tags}>
            <span className={styles.tag} style={{ background: `${domainColor}15`, color: domainColor, borderColor: `${domainColor}30` }}>
              {project.domain}
            </span>
            <span className={styles.tag}>{project.category}</span>
            {project.level && <span className={styles.tag}>{project.level}</span>}
            {project.isNationwide && <span className={styles.tag}>全国流传</span>}
            {project.isCrossProvince && <span className={styles.tag}>多地分布</span>}
          </div>
          <p className={styles.summary}>{project.summary}</p>
        </section>

        {/* 一句话介绍 / 项目简介 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>项目简介</h2>
          <p className={styles.brief}>{project.briefIntroduction}</p>
        </section>

        {/* 主要特色 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>主要特色</h2>
          <ul className={styles.features}>
            {project.keyFeatures.map((f, i) => (
              <li key={i} className={styles.featureItem}>
                <span className={styles.featureDot} />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* 地图分布 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>地图分布</h2>
          <div className={styles.locations}>
            {project.locations.map((loc, i) => (
              <div key={i} className={styles.locationItem}>
                <MapPin size={14} color={domainColor} />
                <span>{loc.displayName}</span>
                {loc.isPrimary && <span className={styles.primaryTag}>主要地区</span>}
              </div>
            ))}
            {project.isNationwide && (
              <div className={styles.nationwideTag}>全国性项目，各地均有流传</div>
            )}
          </div>
        </section>

        {/* 读本章节信息 */}
        {project.bookChapter && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>读本信息</h2>
            <div className={styles.bookInfo}>
              <BookOpen size={16} color="#6E6961" />
              <div>
                <p className={styles.bookName}>{BOOK_NAME}</p>
                {project.bookChapter && <p className={styles.bookChapter}>{project.bookChapter}</p>}
                {project.bookSection && <p className={styles.bookSection}>{project.bookSection}</p>}
              </div>
            </div>
          </section>
        )}

        {/* 底部说明 */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            该项目当前提供读本图文介绍
          </p>
          <p className={styles.footerSubtext}>
            完整数字内容将在后续版本中开放
          </p>
          <button
            className={styles.disabledBtn}
            onClick={() => showToast("视频内容建设中")}
          >
            视频内容建设中
          </button>
        </div>

        {/* 返回地图 */}
        <Link to="/" className={styles.backToMap}>
          <ArrowLeft size={16} />
          返回地图
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}
