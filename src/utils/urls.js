/** Normalize blog page paths to the no-trailing-slash URLs served by the main site.
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/';
}

/** @param {string} slug @param {string} lang */
export function blogPath(slug = '', lang = 'zh') {
  return normalizePath(`/blog/${lang === 'en' ? 'en/' : ''}${slug.replace(/^\/+|\/+$/g, '')}`);
}

/** @param {string} pathname */
export function languagePaths(pathname) {
  const current = normalizePath(pathname);
  const isEn = /^\/blog\/en(?:\/|$)/.test(current);
  return {
    zh: isEn ? current.replace(/^\/blog\/en(?=\/|$)/, '/blog') : current,
    en: isEn ? current : current.replace(/^\/blog(?=\/|$)/, '/blog/en'),
  };
}
