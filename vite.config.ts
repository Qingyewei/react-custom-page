import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import externalGlobals from "rollup-plugin-external-globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        path.resolve(process.cwd(), "src/components/DesignForm/icons/svg"),
      ],
      // 指定symbolId格式
      symbolId: "icon-[name]",
    }),
    createHtmlPlugin({
      template: "./index.html",
      inject: {
        tags: [
          {
            injectTo: "head",
            tag: "script",
            attrs: {
              src: "https://unpkg.com/react@18.2.0/umd/react.development.js",
              crossorigin: true,
            },
          },
          {
            injectTo: "head",
            tag: "script",
            attrs: {
              src: "https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js",
              crossorigin: true,
            },
          },
          {
            injectTo: "head",
            tag: "script",
            attrs: {
              src: "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.8/dayjs.min.js",
              crossorigin: true,
            },
          },
          {
            injectTo: "head",
            tag: "script",
            attrs: {
              src: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.6.3/antd.min.js",
              // defer: true,
              crossorigin: true,
            },
          },
          {
            injectTo: "head",
            tag: "link",
            attrs: {
              src: "https://cdnjs.cloudflare.com/ajax/libs/antd/5.6.3/reset.min.css",
              rel: "stylesheet",
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@@": path.resolve(__dirname, "./src/components/DesignForm"),
    },
  },
  server: {
    port: 8888,
  },
  build: {
    rollupOptions: {
      // 不打包依赖
      external: [
        "antd", 
        "react", 
        "react-dom"
      ],
      plugins: [
        // 不打包依赖映射的对象
        externalGlobals({
          react: "React",
          "react-dom": "ReactDOM",
          antd: "antd",
          dayjs: "dayjs",
        }),
      ],
    },
  },
});
