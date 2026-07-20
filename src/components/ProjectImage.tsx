import { useState } from "react";
import styles from "./ProjectImage.module.scss";
import { publicUrl } from "../utils/asset";

interface ProjectImageProps {
  src: string;
  alt: string;
  /** 项目名称（占位图显示） */
  projectName: string;
  /** 领域色（占位图背景） */
  domainColor?: string;
  className?: string;
}

/**
 * 项目封面图组件
 * - 图片存在时正常显示
 * - 图片缺失时显示文化纹样占位图（项目名称 + 装饰边框）
 * - 禁止出现浏览器破图
 */
export default function ProjectImage({
  src,
  alt,
  projectName,
  domainColor = "#B9473D",
  className = "",
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`${styles.placeholder} ${className}`}
        style={{ backgroundColor: `${domainColor}15` }}
      >
        <div
          className={styles.pattern}
          style={{ borderColor: `${domainColor}30` }}
        >
          <span className={styles.name} style={{ color: domainColor }}>
            {projectName}
          </span>
          <span className={styles.tag}>非遗读本</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {!loaded && (
        <div className={styles.loading}>
          <span style={{ color: domainColor }}>{projectName}</span>
        </div>
      )}
      <img
        src={publicUrl(src)}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
