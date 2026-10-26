// Native disclosure menus remain usable before this enhancement loads.
export function initSiteShell(header = document.querySelector('[data-site-header]')) {
  if (!header || header.dataset.bound) return;
  header.dataset.bound = 'true';
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const listen = (target, event, handler) => target.addEventListener(event, handler, options);
  const close = (restoreFocus = false) => {
    const opened = [...header.querySelectorAll('details[open]')];
    opened.forEach(detail => detail.open = false);
    if (restoreFocus) opened[0]?.querySelector('summary')?.focus();
  };
  listen(header, 'click', event => {
    const summary = event.target.closest('.site-nav-group > summary');
    if (!summary) return;
    const group = summary.parentElement;
    if (group.open) return;
    header.querySelectorAll('.site-nav-group[open]').forEach(other => {
      if (other !== group && !other.contains(group)) other.open = false;
    });
  });
  listen(document, 'click', event => { if (!header.contains(event.target)) close(); });
  listen(document, 'keydown', event => { if (event.key === 'Escape') close(true); });
  listen(header, 'click', event => { if (event.target.closest('a')) close(); });
  listen(matchMedia('(min-width: 960px)'), 'change', () => close());
  const update = () => {
    const en = document.documentElement.lang.startsWith('en');
    header.querySelectorAll('[data-site-link]').forEach(link => {
      const key = link.dataset.siteLink;
      if (['blog', 'card', 'agent'].includes(key)) link.href = `/blog${en ? '/en' : ''}${key === 'blog' ? '' : `/${key}`}`;
    });
    header.querySelectorAll('[data-i18n-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.i18nLang === (en ? 'en' : 'zh-CN'))));
    const current = location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    header.querySelectorAll('[data-site-link]').forEach(link => {
      if (!new URL(link.href).hash && new URL(link.href).pathname.replace(/\/$/, '') === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  update();
  listen(window, 'i18nReady', update);
  listen(window, 'languageChanged', update);
  return () => { controller.abort(); delete header.dataset.bound; };
}
initSiteShell();
document.addEventListener('astro:page-load', () => initSiteShell());
