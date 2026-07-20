import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/feiyi-miniprogram/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
