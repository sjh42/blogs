/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Unocss from 'unocss/vite'
import Markdown from 'vite-plugin-vue-markdown'
import SVG from 'vite-svg-loader'
import Prism from 'markdown-it-prism'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import matter from 'gray-matter'
import fs from 'fs-extra'
// @ts-ignore
import TOC from 'markdown-it-table-of-contents'
import { slugify } from  './script/slugify'

import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javadoclike'
import 'prismjs/components/prism-javadoc'
import 'prismjs/components/prism-jsdoc'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
    },
  },
  ssgOptions: {
    formatting: 'minify',
    format: 'cjs',
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),

    SVG({
      svgo: false
    }),

    // https://github.com/antfu/vite-plugin-vue-markdown
    Markdown({
      wrapperComponent: 'post',
      wrapperClasses: 'prose m-auto',
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      markdownItSetup(md) {
        md.use(Prism)
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify,
        })
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      pagesDir: 'pages',
      extensions: ['vue', 'md'],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('projects.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core'],
      dts: true,
      dirs: ['./src/composables'],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ]
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss()
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
  server: {
    port: 3333,
    open: true,
    host: true  
  }
})
