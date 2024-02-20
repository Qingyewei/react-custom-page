import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import externalGlobals from 'rollup-plugin-external-globals'
import { autoComplete, Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { viteExternalsPlugin } from 'vite-plugin-externals'
// https://blog.csdn.net/weiCong_Ling/article/details/130677226
// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-custom-page/',
  plugins: [
    react(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [
        path.resolve(process.cwd(), 'src/components/DesignForm/icons/svg'),
      ],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
    createHtmlPlugin({
      template: './index.html',
      inject: {
        tags: [
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.development.min.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.development.min.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://unpkg.com/@remix-run/router@1.15.1/dist/router.umd.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://unpkg.com/react-router@6.11.2/dist/umd/react-router.development.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://unpkg.com/react-router-dom@6.11.2/dist/umd/react-router-dom.development.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.8/dayjs.min.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.8/locale/zh-cn.min.js',
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.6.3/antd.min.js',
              defer: true,
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.11.1/antd-with-locales.js',
              defer: true,
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://unpkg.com/@ant-design/pro-components@2.6.41/dist/pro-components.min.js',
              defer: true,
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'link',
            attrs: {
              href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.6.3/reset.min.css',
              rel: 'stylesheet',
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.8/standalone.js',
              async: true,
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/prettier/2.8.8/parser-babel.min.js',
              async: true,
              crossorigin: true,
            },
          },
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
              async: true,
              crossorigin: true,
            },
          },
          // {
          //   injectTo: 'head',
          //   tag: 'script',
          //   attrs: {
          //     src: 'https://cdnjs.cloudflare.com/ajax/libs/react-ace/10.1.0/react-ace.js/main.js',
          //     async: true,
          //     crossorigin: true,
          //   },
          // },
          // {
          //   injectTo: 'head',
          //   tag: 'script',
          //   attrs: {
          //     src: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.20.0/ace.min.js',
          //     async: true,
          //     crossorigin: true,
          //   },
          // },
        ],
      },
    }),
    viteExternalsPlugin(
      {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'react-router-dom': 'ReactRouterDOM',
        '@remix-run/router': 'RemixRouter',
        lodash: '_',
        antd: 'antd',
        dayjs: 'dayjs',
        'dayjs/locale/zh-cn': 'dayjs_locale_zh_cn',
        'antd/locale/zh_CN': 'antd.locales.zh_CN',
        '@ant-design/pro-components': 'ProComponents',
        'prettier/standalone': 'prettier',
        'prettier/parser-babel': ['prettierPlugins', 'babel'],
        // 'react-ace': 'ReactAce',
        // 'ace-builds': 'ace',
      }
      // { disableInServe: true },
    ),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './src/components/DesignForm'),
    },
  },
  server: {
    port: 8888,
  },
  build: {
    // rollupOptions: {
    //   // 不打包依赖
    //   external: ["antd", "react", "react-dom"],
    //   plugins: [
    //     // 不打包依赖映射的对象
    //     externalGlobals({
    //       react: "React",
    //       "react-dom": "ReactDOM",
    //       antd: "antd",
    //       dayjs: "dayjs",
    //     }),
    //   ],
    // },
  },
})
