# ADHD OS Blog

基于 Astro 构建的静态博客，使用 Tailwind CSS v4，MDX 以及内容集合 (Content Collections) 构建。

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```
2. 运行开发服务器：
   ```bash
   npm run dev
   ```
   博客将在 `http://localhost:4321/blog` 下可用。

## 部署与路由 (Vercel)

本项目配置了 `base: '/blog'`，在构建后所有资源都会带有 `/blog` 前缀。如果您将这个 Astro 项目和主站（如 Next.js）部署在同一个 Vercel 项目下，您需要在主站的配置中设置 rewrite。

### Vercel 部署多项目 (Monorepo/Vercel.json)

如果您通过单独的项目部署，并希望主域名的 `/blog` 代理到这个博客，可以在主站的 `vercel.json` 或 `next.config.js` 中设置。

**`next.config.js` 示例 (主站)**:
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog/:path*',
        destination: 'https://您的博客域名.vercel.app/blog/:path*',
      },
    ];
  },
}
```

或者如果您只是部署这一个独立仓库在 Vercel 上，那么它就自带 `/blog` 前缀了，直接访问即可。
