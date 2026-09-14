import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const parts = url.pathname.split('/').filter(p => Boolean(p) && p !== 'blog');
  const lang = parts[0];
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
