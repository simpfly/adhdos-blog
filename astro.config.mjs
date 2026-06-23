// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 部署在 adhdos.app/blog 子路径下。
// 本地 `npm run dev` 会跑在 http://localhost:4321/blog
const SITE = 'https://adhdos.app';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: '/blog',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
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
