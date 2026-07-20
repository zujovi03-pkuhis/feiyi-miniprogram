import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ProjectImage from "../components/ProjectImage";
import ProvinceOutline from "../components/ProvinceOutline";
import { showToast } from "../utils/toast";
import {
  getProjectsByProvince,
  BOOK_NAME,
  HERITAGE_DOMAINS,
  FEATURED_PROJECT_ID,
  type HeritageDomain,
  type HeritageProject,
} from "../data/bookProjects";
import { getProvinceName, getProvinceShortName } from "../data/provinces";
import styles from "./ProvincePage.module.scss";

const DOMAIN_COLORS: Record<string, string> = {
  口头传统: "#C89A4B",
  表演艺术: "#B9473D",
  节庆仪式: "#4A7C59",
  自然知识: "#315B67",
  传统手工艺: "#8B6F47",
};

type FilterTab = "region" | "domain" | "category";

export default function ProvincePage() {
  const { provinceCode } = useParams<{ provinceCode: string }>();
  const code = provinceCode ?? "";
  const provinceName = getProvinceName(code);
  const shortName = getProvinceShortName(code);

  const allProjects = useMemo(() => getProjectsByProvince(code), [code]);

  const [activeTab, setActiveTab] = useState<FilterTab>("region");
  const [activeFilter, setActiveFilter] = useState<string>("全部");

  // 提取地区筛选选项（城市名）
  const regionOptions = useMemo(() => {
    const cities = new Set<string>();
    allProjects.forEach((p) => {
      const loc = p.locations.find((l) => l.provinceCode === code);
      if (loc?.cityName) {
        cities.add(loc.cityName.replace("市", ""));
      }
    });
    return ["全部", ...Array.from(cities)];
  }, [allProjects, code]);

  // 提取门类筛选选项
  const categoryOptions = useMemo(() => {
    const categories = new Set(allProjects.map((p) => p.category));
    return ["全部", ...Array.from(categories)];
  }, [allProjects]);

  // 领域筛选选项
  const domainOptions = useMemo(() => ["全部", ...HERITAGE_DOMAINS], []);

  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    if (activeFilter === "全部") return result;

    if (activeTab === "region") {
      result = result.filter((p) => {
        const loc = p.locations.find((l) => l.provinceCode === code);
        return loc?.cityName?.replace("市", "") === activeFilter;
      });
    } else if (activeTab === "domain") {
      result = result.filter((p) => p.domain === activeFilter);
    } else if (activeTab === "category") {
      result = result.filter((p) => p.category === activeFilter);
    }

    return result;
  }, [allProjects, activeTab, activeFilter, code]);

  const stats = useMemo(() => {
    const total = allProjects.length;
    const categories = new Set(allProjects.map((p) => p.category)).size;
    return { total, categories };
  }, [allProjects]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${provinceName}非遗 · 非遗中国地图`,
        url,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast("链接已复制"));
    } else {
      showToast("分享功能暂不可用");
    }
  };

  const renderProjectLocation = (p: HeritageProject) => {
    const loc = p.locations.find((l) => l.provinceCode === code);
    if (loc?.displayName) return loc.displayName;
    return p.locations[0]?.displayName ?? "全国流传";
  };

  const tabs = [
    { key: "region" as FilterTab, label: "按地区" },
    { key: "domain" as FilterTab, label: "按领域" },
    { key: "category" as FilterTab, label: "按门类" },
  ];

  const getOptions = () => {
    switch (activeTab) {
      case "region":
        return regionOptions;
      case "domain":
        return domainOptions;
      case "category":
        return categoryOptions;
      default:
        return ["全部"];
    }
  };

  return (
    <>
      <PageHeader
        title={`${shortName}非遗`}
        right={
          <button className={styles.shareBtn} onClick={handleShare} aria-label="分享">
            <Share2 size={20} color="#B9473D" />
          </button>
        }
      />
      <div className={styles.page}>
        {/* 省份名称与统计 */}
        <div className={styles.header}>
          <h1 className={styles.provinceTitle}>{provinceName}</h1>
          <p className={styles.statsText}>
            {BOOK_NAME}收录 <strong>{stats.total}</strong> 项
            {stats.categories > 0 && (
              <span> · 覆盖 <strong>{stats.categories}</strong> 个门类</span>
            )}
          </p>
        </div>

        {/* 省份轮廓地图 */}
        <div className={styles.outline}>
          <ProvinceOutline provinceCode={code} projects={allProjects} />
        </div>

        {/* 筛选标签 */}
        <div className={styles.filterTabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => {
                setActiveTab(tab.key);
                setActiveFilter("全部");
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.filterOptions}>
          {getOptions().map((opt) => (
            <button
              key={opt}
              className={`${styles.option} ${activeFilter === opt ? styles.optionActive : ""}`}
              onClick={() => setActiveFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* 项目列表 */}
        <div className={styles.list}>
          {filteredProjects.map((p) => (
            <Link
              key={p.id}
              to={p.id === FEATURED_PROJECT_ID ? `/project/${p.id}` : `/project/${p.id}`}
              className={styles.card}
            >
              <div className={styles.cardCover}>
                <ProjectImage
                  src={p.coverImage}
                  alt={p.name}
                  projectName={p.shortName ?? p.name}
                  domainColor={DOMAIN_COLORS[p.domain]}
                />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{p.name}</h3>
                <p className={styles.cardLocation}>{renderProjectLocation(p)}</p>
                <div className={styles.cardTags}>
                  <span
                    className={styles.domainTag}
                    style={{ background: `${DOMAIN_COLORS[p.domain]}15`, color: DOMAIN_COLORS[p.domain] }}
                  >
                    {p.domain}
                  </span>
                  <span className={styles.categoryTag}>{p.category}</span>
                </div>
                <p className={styles.cardSummary}>{p.summary}</p>
                <div className={styles.cardStatus}>
                  {p.demoDepth === "full" ? (
                    <>
                      <span className={styles.statusFull}>完整演示</span>
                      <span className={styles.statusVideo}>视频可看</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.statusPreview}>图文介绍</span>
                      <span className={styles.statusMore}>更多内容建设中</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className={styles.empty}>
            <p>该筛选条件下暂无项目</p>
          </div>
        )}

        <div className={styles.disclaimer}>
          {BOOK_NAME}收录项目，非全国完整非遗名录
        </div>
      </div>
    </>
  );
}
