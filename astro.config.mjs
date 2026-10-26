// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { normalizePath } from './src/utils/urls.js';
import tailwindcss from '@tailwindcss/vite';

// 部署在 adhdos.app/blog（通过 Vercel Rewrites 反代接入）
// 本地 `npm run dev` 会跑在 http://localhost:4321/blog/
const SITE = 'https://adhdos.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/blog',
  trailingSlash: 'never',
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
      // The sitemap integration retains a slash on the default-locale home link.
      serialize(item) {
        item.url = normalizePath(item.url);
        item.links = item.links?.map(link => ({ ...link, url: normalizePath(link.url) }));
        return item;
      },
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
