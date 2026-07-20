import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight, Info, X } from "lucide-react";
import {
  HERITAGE_DOMAINS,
  BOOK_NAME,
  searchProjects,
  getProjectsByProvince,
  FEATURED_PROJECT_ID,
} from "../data/bookProjects";
import { getProvinceShortName } from "../data/provinces";
import ChinaMap from "../components/ChinaMap";
import ProvinceBubble from "../components/ProvinceBubble";
import ProjectImage from "../components/ProjectImage";
import { showToast } from "../utils/toast";
import styles from "./MapHomePage.module.scss";

const DOMAIN_COLORS: Record<string, string> = {
  全部: "#B9473D",
  口头传统: "#C89A4B",
  表演艺术: "#B9473D",
  节庆仪式: "#4A7C59",
  自然知识: "#315B67",
  传统手工艺: "#8B6F47",
};

export default function MapHomePage() {
  const navigate = useNavigate();
  const [activeDomain, setActiveDomain] = useState<string>("全部");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>(
    "shaanxi" // 默认陕西（底部面板 + 地图高亮）
  );
  const [showBubble, setShowBubble] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // 当前筛选后的项目
  const filteredProjects = useMemo(() => {
    let projects = searchProjects(searchQuery);
    if (activeDomain !== "全部") {
      projects = projects.filter((p) => p.domain === activeDomain);
    }
    return projects;
  }, [activeDomain, searchQuery]);

  // 全国性项目：locations 中包含 nationwide 的项目
  const nationwideProjects = useMemo(() => {
    return filteredProjects.filter((p) =>
      p.locations.some((loc) => loc.provinceCode === "nationwide")
    );
  }, [filteredProjects]);

  // 底部“正在探索”的项目：优先当前选中省份，未选则显示全部
  const exploreProjects = useMemo(() => {
    if (!selectedProvince) return filteredProjects;
    const provinceProjects = getProjectsByProvince(selectedProvince).filter((p) =>
      filteredProjects.some((fp) => fp.id === p.id)
    );
    return provinceProjects.length > 0 ? provinceProjects : filteredProjects;
  }, [selectedProvince, filteredProjects]);

  const handleProvinceSelect = (code: string) => {
    setSelectedProvince(code);
    setShowBubble(true);
  };

  const handleCloseBubble = () => {
    setShowBubble(false);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleViewAll = () => {
    if (selectedProvince) {
      navigate(`/province/${selectedProvince}`);
    } else {
      navigate("/projects");
    }
    setShowBubble(false); // 关闭弹窗
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchProjects(searchQuery);
      if (results.length === 0) {
        showToast("未找到匹配项目，请尝试其他关键词");
      } else {
        showToast(`找到 ${results.length} 个相关项目`);
      }
    }
  };

  const exploreTitle = selectedProvince
    ? `正在探索：${getProvinceShortName(selectedProvince)}`
    : "全部项目";

  return (
    <div className={styles.page}>
      {/* 顶部区域 */}
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>非遗中国地图</h1>
          <div className={styles.titleActions}>
            <button
              className={styles.iconBtn}
              onClick={() => setShowInfo(true)}
              aria-label="说明"
            >
              <Info size={20} />
            </button>
          </div>
        </div>

        <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
          <Search size={16} color="#6E6961" />
          <input
            type="text"
            placeholder="搜索非遗项目、地区或门类"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearchQuery("")}
              aria-label="清空搜索"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className={styles.filterTags}>
          {["全部", ...HERITAGE_DOMAINS].map((d) => (
            <button
              key={d}
              className={`${styles.tag} ${
                activeDomain === d ? styles.tagActive : ""
              }`}
              style={
                activeDomain === d
                  ? { background: DOMAIN_COLORS[d], color: "#fff" }
                  : { color: DOMAIN_COLORS[d] }
              }
              onClick={() => setActiveDomain(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </header>

      {/* 地图区域 */}
      <div className={styles.mapArea}>
        {/* 全国性项目专题卡片 */}
        {nationwideProjects.length > 0 && (
          <div className={styles.nationwideCard}>
            <div className={styles.nationwideHeader}>
              <span className={styles.nationwideIcon}>
                <MapPin size={16} />
              </span>
              <span className={styles.nationwideTitle}>全国性项目</span>
              <span className={styles.nationwideCount}>
                {nationwideProjects.length} 项
              </span>
            </div>
            <div className={styles.nationwideList}>
              {nationwideProjects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  className={styles.nationwideItem}
                  onClick={() => handleViewProject(p.id)}
                >
                  {p.shortName || p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <ChinaMap
          activeDomain={activeDomain}
          searchKeyword={searchQuery}
          selectedProvince={selectedProvince}
          onSelectProvince={handleProvinceSelect}
        />

        <p className={styles.disclaimer}>
          <Info size={12} />
          <span>本地图展示{BOOK_NAME}收录项目，非全国完整非遗名录</span>
        </p>
      </div>

      {/* 底部项目面板 */}
      <div className={styles.bottomPanel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>{exploreTitle}</h2>
            <span className={styles.panelCount}>
              {exploreProjects.length} 项
            </span>
          </div>
          <button
            className={styles.panelMore}
            onClick={() =>
              selectedProvince
                ? navigate(`/province/${selectedProvince}`)
                : navigate("/projects")
            }
          >
            全部
            <ChevronRight size={14} />
          </button>
        </div>

        <div className={styles.projectScroll}>
          {exploreProjects.length > 0 ? (
            exploreProjects.map((p) => (
              <div
                key={p.id}
                className={styles.projectCard}
                onClick={() => handleViewProject(p.id)}
              >
                <div className={styles.cardImageWrapper}>
                  <ProjectImage
                    src={p.coverImage}
                    alt={p.name}
                    projectName={p.shortName || p.name}
                    domainColor={DOMAIN_COLORS[p.domain]}
                    className={styles.cardImage}
                  />
                  {p.hasVideo && (
                    <span className={styles.videoBadge}>视频</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <p className={styles.cardMeta}>
                    {p.locations[0]?.displayName} · {p.domain}
                  </p>
                  <p className={styles.cardCategory}>{p.category}</p>
                  <p className={styles.cardIntro}>{p.summary}</p>
                </div>
                <div className={styles.cardStatus}>
                  {p.id === FEATURED_PROJECT_ID ? (
                    <span className={styles.statusFull}>完整演示</span>
                  ) : (
                    <span className={styles.statusPreview}>图文介绍</span>
                  )}
                  {p.hasVideo && (
                    <span className={styles.statusVideo}>可观看视频</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>当前条件下暂无项目</p>
              <button
                className={styles.emptyAction}
                onClick={() => {
                  setActiveDomain("全部");
                  setSearchQuery("");
                }}
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 省份气泡弹窗 */}
      {showBubble && selectedProvince && (
        <ProvinceBubble
          provinceCode={selectedProvince}
          filteredProjects={filteredProjects}
          onClose={handleCloseBubble}
          onViewAll={handleViewAll}
          onViewProject={handleViewProject}
        />
      )}

      {/* 信息说明弹窗 */}
      {showInfo && (
        <div className={styles.infoOverlay} onClick={() => setShowInfo(false)}>
          <div
            className={styles.infoCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.infoClose}
              onClick={() => setShowInfo(false)}
              aria-label="关闭"
            >
              <X size={18} />
            </button>
            <h3 className={styles.infoTitle}>关于非遗中国地图</h3>
            <p className={styles.infoText}>
              本地图展示{BOOK_NAME}收录的中国非遗项目，仅用于Demo演示，不代表全国完整非遗名录。
            </p>
            <p className={styles.infoText}>
              点击地图省份可查看该省在书中涉及的项目；点击项目卡片可进入图文介绍页。
            </p>
            <p className={styles.infoText}>
              华县皮影戏为本Demo唯一深度展示项目，包含完整详情、制作技艺与视频播放。
            </p>
            <button
              className={styles.infoBtn}
              onClick={() => setShowInfo(false)}
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
