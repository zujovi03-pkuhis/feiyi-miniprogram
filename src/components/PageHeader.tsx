import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
}

/**
 * 详情页通用头部：返回按钮 + 标题 + 右侧操作
 */
export default function PageHeader({ title, subtitle, right, onBack }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={styles.header}>
      <button className={styles.backBtn} onClick={handleBack} aria-label="返回">
        <ChevronLeft size={24} strokeWidth={2} />
      </button>
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {right && <div className={styles.right}>{right}</div>}
    </header>
  );
}
