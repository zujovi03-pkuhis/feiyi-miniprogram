/**
 * 轻量 Toast 工具
 * 无需 React Context，直接操作 DOM
 * 用于：禁用按钮提示、收藏成功提示、分享链接复制等
 */

let container: HTMLElement | null = null;

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    `;
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message: string, duration = 2000): void {
  const el = document.createElement("div");
  el.style.cssText = `
    background: rgba(40, 36, 33, 0.88);
    color: #FFFDF8;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
    max-width: 300px;
    text-align: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: opacity 0.3s ease, transform 0.3s ease;
    opacity: 0;
    transform: scale(0.9);
  `;
  el.textContent = message;

  const c = getContainer();
  c.appendChild(el);

  // 入场动画
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "scale(1)";
  });

  // 出场
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "scale(0.9)";
    setTimeout(() => {
      el.remove();
    }, 300);
  }, duration);
}
