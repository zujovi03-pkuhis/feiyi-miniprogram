import { ChevronRight, X } from "lucide-react";
import {
  HeritageProject,
  getProjectsByProvince,
} from "../data/bookProjects";
import { getProvinceName, getProvinceShortName } from "../data/provinces";
import styles from "./ProvinceBubble.module.scss";

interface ProvinceBubbleProps {
  provinceCode: string;
  /** 供显示的项目（已过滤后的列表） */
  filteredProjects?: HeritageProject[];
  /** 关闭回调 */
  onClose: () => void;
  /** 查看全部项目回调 */
  onViewAll: () => void;
  /** 点击某个项目回调 */
  onViewProject?: (projectId: string) => void;
}

/**
 * 省份气泡弹窗
 * - 显示省份名称 + 《非遗读本》收录项目数
 * - 展示 2-3 个代表项目
 * - 提供“查看全部项目”入口
 */
export default function ProvinceBubble({
  provinceCode,
  filteredProjects = [],
  onClose,
  onViewAll,
  onViewProject,
}: ProvinceBubbleProps) {
  const provinceName = getProvinceName(provinceCode);
  const shortName = getProvinceShortName(provinceCode);

  // 优先取已过滤的项目，其次取该省全部项目
  const provinceProjects = filteredProjects.length > 0
    ? filteredProjects.filter((p) =>
        p.locations.some((loc) => loc.provinceCode === provinceCode)
      )
    : getProjectsByProvince(provinceCode);

  const count = provinceProjects.length;
  const representatives = provinceProjects.slice(0, 3);

  // 代表项目名称拼接（使用顿号）
  const representativeNames = representatives.map((p) => p.shortName || p.name).join("、");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.bubble}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${provinceName}项目信息`}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
          <X size={16} />
        </button>

        <div className={styles.header}>
          <span className={styles.provinceName}>{provinceName}</span>
          <span className={styles.divider}>·</span>
          <span className={styles.count}>收录 {count} 项</span>
        </div>

        {count > 0 ? (
          <div className={styles.body}>
            <p className={styles.representatives}>
              {representativeNames}
            </p>
            <div className={styles.projectTags}>
              {representatives.slice(0, 2).map((p) => (
                <button
                  key={p.id}
                  className={styles.tag}
                  onClick={() => onViewProject?.(p.id)}
                >
                  {p.shortName || p.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.body}>
            <p className={styles.emptyHint}>
              当前筛选条件下，{shortName}暂无《非遗读本》收录项目
            </p>
          </div>
        )}

        <button className={styles.viewAll} onClick={onViewAll}>
          <span>{count > 0 ? "查看全部项目" : "查看该省详情"}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
