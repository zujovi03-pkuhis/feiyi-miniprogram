import { Outlet } from "react-router-dom";
import styles from "./FullPageLayout.module.scss";

/**
 * 全屏布局壳（详情页、视频页用）
 * - 430px 居中容器
 * - 无底部导航
 */
export default function FullPageLayout() {
  return (
    <div className={styles.shell}>
      <Outlet />
    </div>
  );
}
