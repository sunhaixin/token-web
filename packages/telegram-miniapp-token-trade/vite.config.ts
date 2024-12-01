import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
// import pluginPurgeCss from '@mojojoejo/vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    // pluginPurgeCss({
    //   content: [`./public/**/*.html`, `./src/**/*.vue`],
    //   defaultExtractor(content) {
    //     const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
    //     return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
    //   },
    //   safelist: [
    //     /-(leave|enter|appear)(|-(to|from|active))$/,
    //     /^(?!(|.*?:)cursor-move).+-move$/,
    //     /^router-link(|-exact)-active$/,
    //     /data-v-.*/,
    //   ],
    //   variables: true,
    // }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
