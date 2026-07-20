/**
 * 将 public 目录下的资源路径转换为带 base 前缀的完整路径。
 *
 * 开发模式下 base 为 "/"，生产模式下为 "/feiyi-miniprogram/"（由 vite.config.ts 的 base 决定）。
 * 确保部署到 GitHub Pages 子路径时资源路径正确。
 */
export function publicUrl(path: string): string {
  if (!path) return path;
  // 外部链接或 data URI 直接返回
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const base = import.meta.env.BASE_URL; // "/" 或 "/feiyi-miniprogram/"
  // 已包含 base 前缀则不重复添加
  if (base !== "/" && path.startsWith(base)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${cleanPath}`;
}
