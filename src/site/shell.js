// Canonical shell for the website and blog. Export snapshots with sync-site-shell.mjs.
export const labels = {
  'zh-CN': { web: '进入网页版', login: '登录', data: '数据理念', product: '产品', mac: 'Mac 桌面端', extension: '浏览器插件', pwa: 'PWA', strategies: '多样生活策略', pricing: '定价', blog: '博客', about: '关于', resources: '资源', embed: '嵌入模块', card: '闪卡', agent: 'Agent 接入', changelog: '更新日志', wishlist: '加入愿望单', feedback: '问题反馈', contact: '联系支持', privacy: '隐私政策', terms: '服务条款', download: '下载', menu: '菜单', navigation: '主导航', footer: '支持与法律', sitemap: '网站地图' },
  en: { web: 'Open web app', login: 'Log in', data: 'Your data', product: 'Product', mac: 'Mac desktop', extension: 'Browser extension', pwa: 'PWA', strategies: 'Diverse living strategies', pricing: 'Pricing', blog: 'Blog', about: 'About', resources: 'Resources', embed: 'Embed modules', card: 'Flashcards', agent: 'AI & Agent', changelog: 'Changelog', wishlist: 'Join wishlist', feedback: 'Feedback', contact: 'Contact support', privacy: 'Privacy', terms: 'Terms', download: 'Download', menu: 'Menu', navigation: 'Main navigation', footer: 'Support and legal', sitemap: 'Sitemap' },
};
export const productModules = [
  ['brain_dump', 'brain-dump', 'Brain Dump', 'Brain Dump'],
  ['focus_clock', 'focus-clock', '专注时钟', 'Focus Clock'],
  ['calendar', 'calendar', '日历', 'Calendar'],
  ['board', 'board', 'Board', 'Board'],
  ['energy_menu', 'energy-menu', '能量菜单', 'Energy Menu'],
  ['hormone', 'hormone-radar', '荷尔蒙雷达', 'Hormone Radar'],
  ['reframer', 'reframer', '转念轮播', 'Reframer'],
  ['sos', 'sos', '急救模式', 'SOS Mode'],
  ['breath', 'breath-orb', '呼吸球', 'Breathing Orb'],
  ['noise', 'noise', '大脑降噪', 'Brain Mute'],
];
const external = {
  strategies: 'https://hack.adhdos.app/',
  wishlist: 'https://flowus.cn/form/98c668e8-e0d6-415f-833c-643f8b3ef9fc',
  feedback: 'https://flowus.cn/form/601238e3-648e-45f3-a371-71809a8ae0c9?code=QRZXP8',
  contact: 'mailto:roamzen@proton.me',
};
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
export function renderShell({ part = 'header', lang = 'zh-CN', blog = false, pathname = '/product', zhUrl = '/blog/', enUrl = '/blog/en/' } = {}) {
  const t = labels[lang] || labels['zh-CN'];
  const prefix = blog ? 'https://adhdos.app' : '';
  const blogBase = lang === 'en' ? '/blog/en' : '/blog';
  const href = (key) => key === 'web' ? `${prefix}/` : ['mac', 'extension', 'pwa'].includes(key) ? `${prefix}/download#${{mac:'mac-features-heading',extension:'extension-heading',pwa:'pwa-heading'}[key]}` : productModules.some(([name]) => name === key) ? `${prefix}/product${['sos', 'noise'].includes(key) ? '#module-' : '/'}${productModules.find(([name]) => name === key)[1]}` : external[key] || (key === 'pwa' ? `${prefix}/` : ['blog', 'card', 'agent'].includes(key) ? `${blogBase}${key === 'blog' ? '' : `/${key}`}` : key === 'rss' ? '/blog/rss.xml' : key === 'sitemap' ? '/blog/sitemap-index.xml' : `${prefix}/${key}`);
  const text = (key) => {
    const module = productModules.find(([name]) => name === key);
    return module ? `<span data-i18n="landing.features.cards.${key}.title">${module[lang === 'en' ? 3 : 2]}</span>` : `<span data-i18n="site_shell.${key}">${t[key]}</span>`;
  };
  const link = (key, cls = '') => {
    const target = href(key);
    const active = !target.includes('#') && !external[key] && (key === 'blog' ? /^\/blog(?:\/en)?\/?$/.test(pathname) : pathname.replace(/\/$/, '') === new URL(target, 'https://adhdos.app').pathname);
    return `<a class="${cls}" href="${escape(target)}" data-site-link="${key}"${active ? ' aria-current="page"' : ''}${target.startsWith('https://flowus') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${key === 'rss' ? 'RSS' : text(key)}</a>`;
  };
  if (part === 'footer') return `<footer data-site-footer class="site-footer"><div class="site-footer-inner"><p>© 2025–${new Date().getFullYear()} ADHD OS · <a href="https://www.simpfly.info/" target="_blank" rel="noopener noreferrer">Simpfly</a></p><nav aria-label="${t.footer}" data-i18n="site_shell.footer" data-i18n-attr="aria-label">${['about', 'data', 'feedback', 'contact', 'privacy', 'terms'].map(k => link(k)).join('')}</nav></div></footer>`;
  const chevron = '<svg class="site-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const group = (key, keys, mobile = false, extraClass = '') => `<details data-site-group="${key}" class="site-nav-group${mobile ? ' site-nav-group-mobile' : ''}${extraClass ? ` ${extraClass}` : ''}"><summary>${text(key)}${chevron}</summary><div class="${mobile ? 'site-group-links' : 'site-dropdown'}">${keys.map(k => link(k)).join('')}</div></details>`;
  const navigation = (mobile = false) => `${group('product', productModules.map(([key]) => key), mobile)}${link('blog')}${link('pricing')}${group('download', ['mac', 'extension', 'pwa'], mobile)}${group('resources', ['data', 'embed', 'card', 'strategies', 'changelog'], mobile)}`;
  const languages = blog ? `<a href="${escape(zhUrl)}" lang="zh-CN"${lang !== 'en' ? ' aria-current="true"' : ''}>CN</a><a href="${escape(enUrl)}" lang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a>` : '<button type="button" data-i18n-lang="zh-CN">CN</button><button type="button" data-i18n-lang="en">EN</button>';

  return `<header data-site-header class="site-header focus-hide"><div class="site-nav-inner"><a class="site-brand" href="${prefix}/product"><img src="${prefix}/assets/icon_ADHDOS.png" width="32" height="32" alt="">ADHD OS</a><nav class="site-desktop" aria-label="${t.navigation}" data-i18n="site_shell.navigation" data-i18n-attr="aria-label">${navigation()}</nav><div class="site-actions"><div class="site-language">${languages}</div>${link('web', 'site-web-entry')}<details class="site-mobile"><summary aria-label="${t.menu}" data-i18n="site_shell.menu" data-i18n-attr="aria-label"><svg class="site-menu-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><svg class="site-menu-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></summary><nav class="site-mobile-panel" aria-label="${t.navigation}" data-i18n="site_shell.navigation" data-i18n-attr="aria-label">${navigation(true)}${link('web')}</nav></details></div></div></header>`;
}
