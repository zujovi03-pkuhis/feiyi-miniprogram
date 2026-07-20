import { NavLink } from "react-router-dom";
import { Map, Layers, Compass, User } from "lucide-react";
import styles from "./BottomNav.module.scss";

interface TabItem {
  to: string;
  label: string;
  icon: typeof Map;
}

const tabs: TabItem[] = [
  { to: "/", label: "地图", icon: Map },
  { to: "/projects", label: "分类", icon: Layers },
  { to: "/discover", label: "发现", icon: Compass },
  { to: "/profile", label: "我的", icon: User },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
            end={tab.to === "/"}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span className={styles.label}>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
