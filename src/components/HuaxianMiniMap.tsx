import styles from "./HuaxianMiniMap.module.scss";

// 简化中国轮廓（示意级），用于地理分布小图
const CHINA_OUTLINE =
  "M 150,50 L 220,30 L 320,35 L 420,25 L 500,40 L 560,90 L 570,150 L 560,220 L 510,260 L 470,280 L 420,270 L 360,300 L 300,320 L 240,300 L 180,260 L 120,200 L 80,150 L 70,100 L 100,70 Z";

// 陕西省简化轮廓（在全国简化图中的大致位置）
const SHAANXI_PATH =
  "M 360,185 L 385,180 L 405,185 L 410,205 L 400,225 L 385,235 L 365,230 L 355,215 L 350,200 Z";

export default function HuaxianMiniMap() {
  return (
    <div className={styles.miniMap}>
      <svg
        className={styles.mapSvg}
        viewBox="0 0 600 340"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 全国轮廓 */}
        <path d={CHINA_OUTLINE} className={styles.chinaOutline} />

        {/* 陕西省高亮 */}
        <path d={SHAANXI_PATH} className={styles.shaanxiFill} />
        <path d={SHAANXI_PATH} className={styles.shaanxiBorder} />

        {/* 省份标签 */}
        <text x="385" y="175" className={styles.provinceLabel}>
          陕西
        </text>
        <text x="440" y="165" className={styles.provinceLabel}>
          山西
        </text>
        <text x="430" y="210" className={styles.provinceLabel}>
          河南
        </text>
        <text x="330" y="180" className={styles.provinceLabel}>
          甘肃
        </text>
        <text x="300" y="240" className={styles.provinceLabel}>
          四川
        </text>
        <text x="395" y="260" className={styles.provinceLabel}>
          湖北
        </text>

        {/* 华县定位点 */}
        <g className={styles.pin}>
          <circle cx="385" cy="208" r="5" className={styles.pinRing} />
          <circle cx="385" cy="208" r="3" className={styles.pinDot} />
          <line x1="385" y1="208" x2="440" y2="200" className={styles.pinLine} />
        </g>

        {/* 华县标签 */}
        <g>
          <rect
            x="445"
            y="190"
            width="70"
            height="20"
            rx="4"
            className={styles.labelBg}
          />
          <text x="480" y="204" className={styles.huaxianLabel}>
            华县
          </text>
        </g>
      </svg>

      <div className={styles.caption}>
        <span className={styles.dot} />
        <span>陕西省高亮 · 华县定位点</span>
      </div>
    </div>
  );
}
