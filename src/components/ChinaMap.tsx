import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { MapPin, Plus, Minus, LocateFixed } from "lucide-react";
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

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP_SCALE = 0.6;

// ── 缩放工具函数 ────────────────────────────────────────

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** 限制 offset 使地图不跑出视口 */
const clampOffset = (
  ox: number,
  oy: number,
  scale: number
): { x: number; y: number } => ({
  x: clamp(ox, -CHINA_MAP_WIDTH * (scale - 1), 0),
  y: clamp(oy, -CHINA_MAP_HEIGHT * (scale - 1), 0),
});

/**
 * 以 SVG 坐标系中的点 (cx, cy) 为中心，从 scale1 缩放到 scale2，
 * 返回新的 offset。
 * 原理：缩放前点在屏幕位置 = cx*scale1 + off1，缩放后应不变 = cx*scale2 + off2
 * 所以 off2 = off1 + cx*(scale1 - scale2)
 */
const zoomAtPoint = (
  cx: number,
  cy: number,
  scale1: number,
  scale2: number,
  offX: number,
  offY: number
) => {
  const newScale = clamp(scale2, MIN_SCALE, MAX_SCALE);
  const newOffX = offX + cx * (scale1 - newScale);
  const newOffY = offY + cy * (scale1 - newScale);
  return { scale: newScale, ...clampOffset(newOffX, newOffY, newScale) };
};

// ── 触摸手势状态 ────────────────────────────────────────

interface TouchState {
  mode: "none" | "pan" | "pinch";
  startX: number; // SVG 坐标
  startY: number;
  startOffX: number;
  startOffY: number;
  startDist: number;
  startScale: number;
  pinchCenterX: number;
  pinchCenterY: number;
  // 点击 vs 拖拽判断
  moved: boolean;
  pointerDownClientX: number;
  pointerDownClientY: number;
}

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
 * - 支持双指缩放、单指拖拽、双击放大、滚轮缩放
 * - 缩放后省份点击仍精准有效
 */
export default function ChinaMap({
  activeDomain = "全部",
  searchKeyword = "",
  selectedProvince,
  onSelectProvince,
}: ChinaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 缩放状态
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(true);

  const touchRef = useRef<TouchState>({
    mode: "none",
    startX: 0,
    startY: 0,
    startOffX: 0,
    startOffY: 0,
    startDist: 0,
    startScale: 1,
    pinchCenterX: 0,
    pinchCenterY: 0,
    moved: false,
    pointerDownClientX: 0,
    pointerDownClientY: 0,
  });

  // 首次引导 5 秒后自动消失
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // ── 坐标转换：屏幕 → SVG viewBox ─────────────────────

  const toSvgCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CHINA_MAP_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * CHINA_MAP_HEIGHT;
    return { x, y };
  }, []);

  // ── 缩放操作 ──────────────────────────────────────────

  const zoomIn = useCallback(() => {
    const cx = CHINA_MAP_WIDTH / 2;
    const cy = CHINA_MAP_HEIGHT / 2;
    const result = zoomAtPoint(cx, cy, scale, scale + STEP_SCALE, offset.x, offset.y);
    setScale(result.scale);
    setOffset({ x: result.x, y: result.y });
    setShowHint(false);
  }, [scale, offset]);

  const zoomOut = useCallback(() => {
    const cx = CHINA_MAP_WIDTH / 2;
    const cy = CHINA_MAP_HEIGHT / 2;
    const result = zoomAtPoint(cx, cy, scale, scale - STEP_SCALE, offset.x, offset.y);
    setScale(result.scale);
    setOffset({ x: result.x, y: result.y });
  }, [scale, offset]);

  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // ── Touch 手势 ────────────────────────────────────────

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setShowHint(false);
      if (e.touches.length === 1) {
        const pt = toSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        touchRef.current = {
          ...touchRef.current,
          mode: "pan",
          startX: pt.x,
          startY: pt.y,
          startOffX: offset.x,
          startOffY: offset.y,
          moved: false,
          pointerDownClientX: e.touches[0].clientX,
          pointerDownClientY: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        const t1 = toSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        const t2 = toSvgCoords(e.touches[1].clientX, e.touches[1].clientY);
        const dist = Math.hypot(t2.x - t1.x, t2.y - t1.y);
        touchRef.current = {
          ...touchRef.current,
          mode: "pinch",
          startDist: dist,
          startScale: scale,
          startOffX: offset.x,
          startOffY: offset.y,
          pinchCenterX: (t1.x + t2.x) / 2,
          pinchCenterY: (t1.y + t2.y) / 2,
          moved: true,
        };
      }
    },
    [offset, scale, toSvgCoords]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const ts = touchRef.current;
      if (ts.mode === "pan" && e.touches.length === 1) {
        e.preventDefault();
        const pt = toSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        const dx = pt.x - ts.startX;
        const dy = pt.y - ts.startY;

        // 判断是否真的在拖拽（移动超过 5px 算拖拽）
        const clientDx = e.touches[0].clientX - ts.pointerDownClientX;
        const clientDy = e.touches[0].clientY - ts.pointerDownClientY;
        if (Math.hypot(clientDx, clientDy) > 5) {
          ts.moved = true;
        }

        const clamped = clampOffset(
          ts.startOffX + dx,
          ts.startOffY + dy,
          scale
        );
        setOffset(clamped);
      } else if (ts.mode === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        const t1 = toSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        const t2 = toSvgCoords(e.touches[1].clientX, e.touches[1].clientY);
        const dist = Math.hypot(t2.x - t1.x, t2.y - t1.y);
        if (ts.startDist > 0) {
          const ratio = dist / ts.startDist;
          const newScale = clamp(ts.startScale * ratio, MIN_SCALE, MAX_SCALE);
          // 以双指中点为缩放中心
          const result = zoomAtPoint(
            ts.pinchCenterX,
            ts.pinchCenterY,
            ts.startScale,
            newScale,
            ts.startOffX,
            ts.startOffY
          );
          setScale(result.scale);
          setOffset({ x: result.x, y: result.y });
        }
      }
    },
    [scale, toSvgCoords]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      touchRef.current.mode = "none";
    } else if (e.touches.length === 1 && touchRef.current.mode === "pinch") {
      // 从双指变单指，切换为平移模式
      const pt = toSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
      touchRef.current = {
        ...touchRef.current,
        mode: "pan",
        startX: pt.x,
        startY: pt.y,
        startOffX: offset.x,
        startOffY: offset.y,
        moved: true,
      };
    }
  }, [offset, toSvgCoords]);

  // ── 鼠标手势（桌面端） ────────────────────────────────

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setShowHint(false);
      const pt = toSvgCoords(e.clientX, e.clientY);
      touchRef.current = {
        ...touchRef.current,
        mode: "pan",
        startX: pt.x,
        startY: pt.y,
        startOffX: offset.x,
        startOffY: offset.y,
        moved: false,
        pointerDownClientX: e.clientX,
        pointerDownClientY: e.clientY,
      };
    },
    [offset, toSvgCoords]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const ts = touchRef.current;
      if (ts.mode !== "pan") return;
      // 桌面端鼠标按住拖拽
      if (e.buttons !== 1) return;
      const pt = toSvgCoords(e.clientX, e.clientY);
      const dx = pt.x - ts.startX;
      const dy = pt.y - ts.startY;

      const clientDx = e.clientX - ts.pointerDownClientX;
      const clientDy = e.clientY - ts.pointerDownClientY;
      if (Math.hypot(clientDx, clientDy) > 5) {
        ts.moved = true;
      }

      const clamped = clampOffset(ts.startOffX + dx, ts.startOffY + dy, scale);
      setOffset(clamped);
    },
    [scale, toSvgCoords]
  );

  const handleMouseUp = useCallback(() => {
    touchRef.current.mode = "none";
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      setShowHint(false);
      const pt = toSvgCoords(e.clientX, e.clientY);
      const delta = e.deltaY > 0 ? -0.3 : 0.3;
      const result = zoomAtPoint(pt.x, pt.y, scale, scale + delta, offset.x, offset.y);
      setScale(result.scale);
      setOffset({ x: result.x, y: result.y });
    },
    [scale, offset, toSvgCoords]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setShowHint(false);
      const pt = toSvgCoords(e.clientX, e.clientY);
      const targetScale = scale > 1.5 ? 1 : 2.5;
      const result = zoomAtPoint(pt.x, pt.y, scale, targetScale, offset.x, offset.y);
      setScale(result.scale);
      setOffset({ x: result.x, y: result.y });
    },
    [scale, offset, toSvgCoords]
  );

  // 省份点击：如果是拖拽则不触发
  const handleProvinceClick = useCallback(
    (code: string) => {
      if (touchRef.current.moved) return;
      onSelectProvince(code);
    },
    [onSelectProvince]
  );

  // ── 数据计算（原有逻辑不变） ──────────────────────────

  const filteredProjects = useMemo(() => {
    let projects = searchProjects(searchKeyword);
    if (activeDomain && activeDomain !== "全部") {
      projects = projects.filter((p) => p.domain === activeDomain);
    }
    return projects;
  }, [activeDomain, searchKeyword]);

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

  const hasProjects = (code: string) => countProjectsByProvince(code) > 0;
  const hasFilteredProjects = (code: string) => provinceCounts[code] > 0;

  const getLabelOffset = (prov: ProvinceGeoData): { dx: number; dy: number } => {
    const x = prov.centroid.x;
    const y = prov.centroid.y;
    const cx = CHINA_MAP_WIDTH / 2;
    const dx = x > cx ? 40 : -40;
    const dy = y < 150 ? 20 : y > 650 ? -20 : 0;
    return { dx, dy };
  };

  const transform = `translate(${offset.x}, ${offset.y}) scale(${scale})`;
  const isZoomed = scale > 1.01;

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      <svg
        ref={svgRef}
        className={styles.mapSvg}
        viewBox={`0 0 ${CHINA_MAP_WIDTH} ${CHINA_MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ touchAction: "none", cursor: scale > 1.01 ? "grab" : "default" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <defs>
          <filter id="provinceShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#8B7355" floodOpacity="0.12" />
          </filter>
          <filter id="selectedGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#B9473D" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 缩放变换组 */}
        <g transform={transform}>
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
                onClick={() => handleProvinceClick(prov.code)}
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
        </g>
      </svg>

      {/* 缩放控制按钮 */}
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomBtn}
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE - 0.01}
          aria-label="放大"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
        <button
          className={styles.zoomBtn}
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE + 0.01}
          aria-label="缩小"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
        {isZoomed && (
          <button
            className={`${styles.zoomBtn} ${styles.zoomBtnReset}`}
            onClick={resetView}
            aria-label="重置"
          >
            <LocateFixed size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* 缩放比例指示器 */}
      {isZoomed && (
        <div className={styles.zoomIndicator}>
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* 首次使用引导 */}
      {showHint && (
        <div className={styles.zoomHint}>
          <span>双指捏合可放大地图</span>
        </div>
      )}

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
