import { useLocation } from "react-router-dom";
import { Compass, User } from "lucide-react";
import styles from "./PlaceholderTab.module.scss";

const TAB_INFO: Record<string, { icon: typeof Compass; label: string }> = {
  "/discover": { icon: Compass, label: "发现" },
  "/profile": { icon: User, label: "我的" },
};

export default function PlaceholderTab() {
  const location = useLocation();
  const info = TAB_INFO[location.pathname] ?? TAB_INFO["/discover"];
  const Icon = info.icon;

  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <Icon size={56} strokeWidth={1} color="#C5C0B8" />
      </div>
      <h1 className={styles.title}>{info.label}</h1>
      <p className={styles.desc}>
        该功能正在规划中
      </p>
      <p className={styles.hint}>
        Demo阶段聚焦于非遗地图浏览和华县皮影戏完整演示
      </p>
    </div>
  );
}
