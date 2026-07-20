import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import styles from "./TabLayout.module.scss";

/**
 * 带底部导航的布局壳
 * - 桌面端：430px 居中容器 + 两侧米白背景
 * - 移动端：全屏
 */
export default function TabLayout() {
  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
