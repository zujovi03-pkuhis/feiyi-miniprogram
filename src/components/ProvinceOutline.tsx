import { useMemo } from "react";
import { getProvinceName, getProvinceShortName } from "../data/provinces";
import { getProvinceGeo, CITY_COORDS } from "../data/chinaGeoData";
import type { HeritageProject } from "../data/bookProjects";
import styles from "./ProvinceOutline.module.scss";

interface CityMarker {
  name: string;
  x: number;
  y: number;
  hasProject: boolean;
}

interface ProvinceOutlineProps {
  provinceCode: string;
  projects: HeritageProject[];
}

/**
 * 省份轮廓地图
 * - 使用真实 GeoJSON 转换的省份 SVG path
 * - 城市标记定位在真实经纬度投影位置
 * - viewBox 自动适配省份 bbox（带 padding）
 */
export default function ProvinceOutline({
  provinceCode,
  projects,
}: ProvinceOutlineProps) {
  const provinceName = getProvinceName(provinceCode);
  const shortName = getProvinceShortName(provinceCode);
  const geoData = getProvinceGeo(provinceCode);

  // 计算 viewBox：省份 bbox + padding
  const { viewBox, padding } = useMemo(() => {
    if (!geoData) return { viewBox: "0 0 100 190", padding: 10 };
    const pad = Math.max(
      (geoData.bbox.maxX - geoData.bbox.minX) * 0.12,
      (geoData.bbox.maxY - geoData.bbox.minY) * 0.12,
      15
    );
    const minX = geoData.bbox.minX - pad;
    const minY = geoData.bbox.minY - pad;
    const w = geoData.bbox.maxX - geoData.bbox.minX + pad * 2;
    const h = geoData.bbox.maxY - geoData.bbox.minY + pad * 2;
    return { viewBox: `${minX} ${minY} ${w} ${h}`, padding: pad };
  }, [geoData]);

  // 生成城市标记
  const cityMarkers = useMemo((): CityMarker[] => {
    const citySet = new Map<string, boolean>();
    projects.forEach((p) => {
      const loc = p.locations.find((l) => l.provinceCode === provinceCode);
      if (loc?.cityName) {
        citySet.set(loc.cityName, true);
      }
    });

    const cities = Array.from(citySet.keys());
    if (cities.length === 0) {
      // 无城市信息时，在 centroid 显示省会标记
      if (geoData) {
        return [
          {
            name: shortName,
            x: geoData.centroid.x,
            y: geoData.centroid.y,
            hasProject: true,
          },
        ];
      }
      return [];
    }

    return cities
      .map((city) => {
        const coord = CITY_COORDS[city];
        if (!coord) {
          // 未知城市：使用省份 centroid 作为 fallback
          if (geoData) {
            return {
              name: city.replace("市", ""),
              x: geoData.centroid.x,
              y: geoData.centroid.y,
              hasProject: true,
            };
          }
          return null;
        }
        return {
          name: city.replace("市", ""),
          x: coord.x,
          y: coord.y,
          hasProject: true,
        };
      })
      .filter((c): c is CityMarker => c !== null);
  }, [provinceCode, projects, geoData, shortName]);

  // 没有 geoData 时的 fallback
  if (!geoData) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.fallback}>
          <p>{shortName}</p>
        </div>
      </div>
    );
  }

  // 标签字体大小根据省份大小调整
  const provinceW = geoData.bbox.maxX - geoData.bbox.minX;
  const provinceH = geoData.bbox.maxY - geoData.bbox.minY;
  const labelFontSize = Math.max(Math.min(provinceW, provinceH) * 0.08, 8);
  const cityDotR = Math.max(Math.min(provinceW, provinceH) * 0.015, 2);
  const cityLabelSize = Math.max(labelFontSize * 0.7, 6);

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={viewBox}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`provinceGradient-${provinceCode}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#F7F2E8" />
            <stop offset="100%" stopColor="#EDE5D8" />
          </linearGradient>
          <filter
            id={`provinceShadow-${provinceCode}`}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#B9473D"
              floodOpacity="0.1"
            />
          </filter>
        </defs>

        {/* 省份轮廓 */}
        <path
          d={geoData.path}
          className={styles.outline}
          fill={`url(#provinceGradient-${provinceCode})`}
          stroke="#B9473D"
          strokeWidth={Math.max(provinceW * 0.005, 0.8)}
          strokeLinejoin="round"
          filter={`url(#provinceShadow-${provinceCode})`}
        />

        {/* 省份名称水印 */}
        <text
          x={geoData.centroid.x}
          y={geoData.centroid.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.provinceWatermark}
          style={{ fontSize: `${labelFontSize}px` }}
        >
          {shortName}
        </text>

        {/* 城市标记 */}
        {cityMarkers.map((city) => (
          <g key={city.name} className={styles.cityGroup}>
            <circle
              cx={city.x}
              cy={city.y}
              r={cityDotR}
              className={styles.cityDot}
              fill="#B9473D"
              stroke="#fff"
              strokeWidth="1"
            />
            <text
              x={city.x}
              y={city.y - cityDotR - 3}
              textAnchor="middle"
              className={styles.cityLabel}
              style={{ fontSize: `${cityLabelSize}px` }}
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
