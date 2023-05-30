import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import vitePluginImp from "vite-plugin-imp";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // vitePluginImp({
    //   libList: [
    //     // {
    //     //   libName: 'lodash',
    //     //   libDirectory: '',
    //     //   camel2DashComponentName: false
    //     // },
    //     {
    //       libName: "antd",
    //       style(name) {
    //         // use less
    //         return `antd/es/${name}/style/index.js`;
    //       },
    //     },
    //   ],
    // }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        path.resolve(process.cwd(), "src/components/DesignForm/icons/svg"),
      ],
      // 指定symbolId格式
      symbolId: "icon-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@@": path.resolve(__dirname, "./src/components/DesignForm"),
    },
  },
  server:{
    port:8888
  }
});
