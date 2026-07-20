import { useMemo } from "react";
import { MapPin } from "lucide-react";
import {
  countProjectsByProvince,
  getProjectsByProvince,
  searchProjects,
} from "../data/bookProjects";
import {
  PROVINCE_GEO_DATA,
  CHINA_MAP_WIDTH,
  CHINA_MAP_HEIGHT,
  type ProvinceGeoData,
} from "../data/chinaGeoData";
import styles from "./ChinaMap.module.scss";

const DOMAIN_COLORS: Record<string, string> = {
  口头传统: "#C89A4B",
  表演艺术: "#B9473D",
  节庆仪式: "#4A7C59",
  自然知识: "#315B67",
  传统手工艺: "#8B6F47",
  混合: "#B9473D",
};

// 小省份（面积太小无法显示标签）使用引线标注
const SMALL_PROVINCES = new Set([
  "beijing",
  "tianjin",
  "shanghai",
  "xianggang",
  "aomen",
  "hainan",
  "taiwan",
]);

interface ChinaMapProps {
  /** 当前选中的领域（全部=不筛选） */
  activeDomain?: string;
  /** 搜索关键词 */
  searchKeyword?: string;
  /** 当前选中的省份 */
  selectedProvince?: string;
  /** 省份点击回调 */
  onSelectProvince: (code: string) => void;
}

/**
 * 全国地图组件
 * - 使用真实 GeoJSON 转换的省份 SVG path
 * - 每个省份独立着色（基于项目领域分布）
 * - 有项目的省份高亮，无项目省份浅灰
 * - 点击省份触发 onSelectProvince
 */
export default function ChinaMap({
  activeDomain = "全部",
  searchKeyword = "",
  selectedProvince,
  onSelectProvince,
}: ChinaMapProps) {
  // 根据领域和关键词得到当前项目集合
  const filteredProjects = useMemo(() => {
    let projects = searchProjects(searchKeyword);
    if (activeDomain && activeDomain !== "全部") {
      projects = projects.filter((p) => p.domain === activeDomain);
    }
    return projects;
  }, [activeDomain, searchKeyword]);

  // 计算每个省份在 filteredProjects 中的项目数（含全国性项目）
  const provinceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PROVINCE_GEO_DATA.forEach((prov) => {
      counts[prov.code] = filteredProjects.filter(
        (p) =>
          p.isNationwide ||
          p.locations.some((loc) => loc.provinceCode === prov.code)
      ).length;
    });
    return counts;
  }, [filteredProjects]);

  // 计算每个省份的主色（由当前筛选下项目最多的领域决定）
  const provinceColor = useMemo(() => {
    const colors: Record<string, string> = {};
    PROVINCE_GEO_DATA.forEach((prov) => {
      const projects = getProjectsByProvince(prov.code);
      const filtered = projects.filter((p) => {
        if (activeDomain && activeDomain !== "全部" && p.domain !== activeDomain)
          return false;
        if (searchKeyword) {
          const searched = searchProjects(searchKeyword);
          if (!searched.includes(p)) return false;
        }
        return true;
      });
      if (filtered.length === 0) {
        colors[prov.code] = "";
      } else if (filtered.length === 1) {
        colors[prov.code] = DOMAIN_COLORS[filtered[0].domain] || "#B9473D";
      } else {
        const domainCounts: Record<string, number> = {};
        filtered.forEach((p) => {
          domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
        });
        const topDomain = Object.entries(domainCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        colors[prov.code] = DOMAIN_COLORS[topDomain] || "#B9473D";
      }
    });
    return colors;
  }, [activeDomain, searchKeyword]);

  // 省份在原始数据中是否有项目
  const hasProjects = (code: string) => countProjectsByProvince(code) > 0;
  const hasFilteredProjects = (code: string) => provinceCounts[code] > 0;

  // 小省份引线标注的偏移方向
  const getLabelOffset = (prov: ProvinceGeoData): { dx: number; dy: number } => {
    const x = prov.centroid.x;
    const y = prov.centroid.y;
    const cx = CHINA_MAP_WIDTH / 2;
    // 右侧省份向右偏，左侧向左
    const dx = x > cx ? 40 : -40;
    // 上下偏移根据位置
    const dy = y < 150 ? 20 : y > 650 ? -20 : 0;
    return { dx, dy };
  };

  return (
    <div className={styles.mapContainer}>
      <svg
        className={styles.mapSvg}
        viewBox={`0 0 ${CHINA_MAP_WIDTH} ${CHINA_MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="provinceShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#8B7355" floodOpacity="0.12" />
          </filter>
          <filter id="selectedGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#B9473D" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 省份路径 */}
        {PROVINCE_GEO_DATA.map((prov) => {
          const color = provinceColor[prov.code];
          const isSelected = selectedProvince === prov.code;
          const isEmpty = !hasProjects(prov.code);
          const hasFiltered = hasFilteredProjects(prov.code);

          return (
            <path
              key={prov.code}
              d={prov.path}
              className={`${styles.provincePath} ${
                isSelected ? styles.provinceSelected : ""
              } ${isEmpty ? styles.provinceEmpty : ""} ${
                hasFiltered ? styles.provinceActive : ""
              }`}
              fill={isEmpty ? "#EDE6D9" : color || "#E8DCC8"}
              stroke={isSelected ? "#B9473D" : "#C5B8A0"}
              strokeWidth={isSelected ? 1.5 : 0.5}
              filter={isSelected ? "url(#selectedGlow)" : "url(#provinceShadow)"}
              onClick={() => onSelectProvince(prov.code)}
            />
          );
        })}

        {/* 省份名称标签 */}
        {PROVINCE_GEO_DATA.filter((p) => hasProjects(p.code)).map((prov) => {
          const count = provinceCounts[prov.code];
          const isSelected = selectedProvince === prov.code;
          const isSmall = SMALL_PROVINCES.has(prov.code);
          const { dx, dy } = getLabelOffset(prov);

          if (isSmall) {
            // 小省份：引线 + 外部标签
            const lx = prov.centroid.x + dx;
            const ly = prov.centroid.y + dy;
            return (
              <g key={`label-${prov.code}`} className={styles.labelGroup}>
                <line
                  x1={prov.centroid.x}
                  y1={prov.centroid.y}
                  x2={lx}
                  y2={ly}
                  className={styles.leaderLine}
                  stroke={isSelected ? "#B9473D" : "#B0A48E"}
                  strokeWidth="0.5"
                />
                <circle
                  cx={prov.centroid.x}
                  cy={prov.centroid.y}
                  r="2"
                  fill={provinceColor[prov.code] || "#B9473D"}
                />
                <text
                  x={lx + (dx > 0 ? 3 : -3)}
                  y={ly}
                  textAnchor={dx > 0 ? "start" : "end"}
                  dominantBaseline="middle"
                  className={`${styles.provinceLabel} ${styles.provinceLabelSmall} ${
                    isSelected ? styles.provinceLabelSelected : ""
                  }`}
                >
                  {prov.shortName}
                  {count > 0 && (
                    <tspan className={styles.countBadge} dx="2">
                      {count}
                    </tspan>
                  )}
                </text>
              </g>
            );
          }

          // 正常省份：标签在 centroid
          return (
            <g key={`label-${prov.code}`} className={styles.labelGroup}>
              <text
                x={prov.centroid.x}
                y={prov.centroid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`${styles.provinceLabel} ${
                  isSelected ? styles.provinceLabelSelected : ""
                }`}
              >
                {prov.shortName}
              </text>
              {count > 0 && (
                <text
                  x={prov.centroid.x}
                  y={prov.centroid.y + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={styles.countText}
                >
                  {count} 项
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 无结果提示 */}
      {filteredProjects.length === 0 && (
        <div className={styles.noResult}>
          <MapPin size={32} strokeWidth={1.5} color="#B9473D" />
          <p>未找到匹配项目</p>
          <p>请尝试更换关键词或领域</p>
        </div>
      )}
    </div>
  );
}
