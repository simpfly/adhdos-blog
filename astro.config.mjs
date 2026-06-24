// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署在 blog.adhdos.app
// 本地 `npm run dev` 会跑在 http://localhost:4321/
const SITE = 'https://blog.adhdos.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en-US' },
      },
    }),
  ],
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // 紧扣主站的 lime accent
      theme: 'github-light',
      wrap: true,
    },
  },
});
