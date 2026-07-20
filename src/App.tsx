import { Routes, Route, Link } from "react-router-dom";
import TabLayout from "./components/TabLayout";
import FullPageLayout from "./components/FullPageLayout";
import MapHomePage from "./pages/MapHomePage";
import ProvincePage from "./pages/ProvincePage";
import ProjectsListPage from "./pages/ProjectsListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import HuaxianDetailPage from "./pages/HuaxianDetailPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import PlaceholderTab from "./pages/PlaceholderTab";

function App() {
  return (
    <Routes>
      {/* 带底部导航的页面 */}
      <Route element={<TabLayout />}>
        <Route path="/" element={<MapHomePage />} />
        <Route path="/province/:provinceCode" element={<ProvincePage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/discover" element={<PlaceholderTab />} />
        <Route path="/profile" element={<PlaceholderTab />} />
      </Route>
      {/* 不带底部导航的详情页 */}
      <Route element={<FullPageLayout />}>
        <Route path="/project/huaxian-shadow-puppetry" element={<HuaxianDetailPage />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
        <Route path="/video/huaxian-shadow-puppetry" element={<VideoPlayerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: "#6E6961" }}>
      <p>页面不存在</p>
      <Link to="/" style={{ color: "#B9473D" }}>返回首页</Link>
    </div>
  );
}

export default App;
