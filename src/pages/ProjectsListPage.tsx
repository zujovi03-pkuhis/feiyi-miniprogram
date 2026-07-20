import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import ProjectImage from "../components/ProjectImage";
import {
  bookProjects,
  HERITAGE_DOMAINS,
  BOOK_NAME,
  searchProjects,
  FEATURED_PROJECT_ID,
  type HeritageDomain,
} from "../data/bookProjects";
import { PROVINCE_MAP, getProvinceShortName } from "../data/provinces";
import styles from "./ProjectsListPage.module.scss";

const DOMAIN_COLORS: Record<string, string> = {
  口头传统: "#C89A4B",
  表演艺术: "#B9473D",
  节庆仪式: "#4A7C59",
  自然知识: "#315B67",
  传统手工艺: "#8B6F47",
};

type FilterType = "domain" | "province";

export default function ProjectsListPage() {
  const [activeDomain, setActiveDomain] = useState<HeritageDomain | "全部">("全部");
  const [activeProvince, setActiveProvince] = useState<string>("全部");
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("domain");

  const provinceOptions = useMemo(() => {
    const codes = new Set<string>();
    bookProjects.forEach((p) => {
      p.locations.forEach((loc) => {
        if (loc.provinceCode !== "nationwide") {
          codes.add(loc.provinceCode);
        }
      });
    });
    return ["全部", ...Array.from(codes).sort()];
  }, []);

  const filtered = useMemo(() => {
    let result = [...bookProjects];

    // 领域筛选
    if (activeDomain !== "全部") {
      result = result.filter((p) => p.domain === activeDomain);
    }

    // 省份筛选
    if (activeProvince !== "全部") {
      result = result.filter((p) =>
        p.locations.some((loc) => loc.provinceCode === activeProvince)
      );
    }

    // 关键词搜索
    if (keyword.trim()) {
      const keywordFiltered = searchProjects(keyword);
      result = result.filter((p) => keywordFiltered.some((kp) => kp.id === p.id));
    }

    return result;
  }, [activeDomain, activeProvince, keyword]);

  const resultText = useMemo(() => {
    if (keyword.trim()) return `"${keyword}" 搜索结果 · ${filtered.length} 项`;
    const parts = ["全部项目"];
    if (activeDomain !== "全部") parts.push(activeDomain);
    if (activeProvince !== "全部") parts.push(getProvinceShortName(activeProvince));
    return `${parts.join(" · ")} · ${filtered.length} 项`;
  }, [keyword, activeDomain, activeProvince, filtered.length]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>全部项目</h1>
        <p className={styles.subtitle}>
          {BOOK_NAME}收录 <strong>{bookProjects.length}</strong> 个中国非遗项目
        </p>
        <div className={styles.searchBox}>
          <Search size={16} color="#6E6961" />
          <input
            type="text"
            placeholder="搜索项目名称、地区或门类"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* 筛选类型切换 */}
        <div className={styles.filterTypeTabs}>
          <button
            className={`${styles.typeTab} ${filterType === "domain" ? styles.typeTabActive : ""}`}
            onClick={() => setFilterType("domain")}
          >
            <SlidersHorizontal size={14} />
            按领域
          </button>
          <button
            className={`${styles.typeTab} ${filterType === "province" ? styles.typeTabActive : ""}`}
            onClick={() => setFilterType("province")}
          >
            <MapPin size={14} />
            按省份
          </button>
        </div>

        {/* 领域筛选 */}
        {filterType === "domain" && (
          <div className={styles.filterTags}>
            {["全部", ...HERITAGE_DOMAINS].map((d) => (
              <button
                key={d}
                className={`${styles.tag} ${activeDomain === d ? styles.tagActive : ""}`}
                onClick={() => setActiveDomain(d as HeritageDomain | "全部")}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* 省份筛选 */}
        {filterType === "province" && (
          <div className={styles.provinceTags}>
            {provinceOptions.map((code) => (
              <button
                key={code}
                className={`${styles.tag} ${activeProvince === code ? styles.tagActive : ""}`}
                onClick={() => setActiveProvince(code)}
              >
                {code === "全部" ? "全部" : getProvinceShortName(code)}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className={styles.resultInfo}>{resultText}</div>

      <div className={styles.grid}>
        {filtered.map((p) => (
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
            <div className={styles.cardBody}>
              <h3 className={styles.cardName}>{p.name}</h3>
              <p className={styles.cardLocation}>
                {p.locations[0]?.displayName}
                {p.isNationwide && <span className={styles.nationwideBadge}>全国流传</span>}
              </p>
              <div className={styles.cardTags}>
                <span style={{ color: DOMAIN_COLORS[p.domain] }}>{p.domain}</span>
                <span className={styles.separator}>|</span>
                <span>{p.category}</span>
              </div>
              <p className={styles.cardSummary}>{p.summary}</p>
              {p.demoDepth === "full" ? (
                <span className={styles.fullBadge}>完整演示 · 视频可看</span>
              ) : (
                <span className={styles.previewBadge}>图文介绍</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>未找到匹配的项目</p>
          <button
            className={styles.resetBtn}
            onClick={() => {
              setActiveDomain("全部");
              setActiveProvince("全部");
              setKeyword("");
            }}
          >
            重置筛选
          </button>
        </div>
      )}

      <div className={styles.disclaimer}>
        {BOOK_NAME}收录项目，非全国完整非遗名录
      </div>
    </div>
  );
}
