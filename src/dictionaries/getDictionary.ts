import 'server-only';

const dictionaries = {
  es: () => import('./es.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'es' | 'en') => {
  // Fallback to 'es' if locale is not found
  return dictionaries[locale]?.() ?? dictionaries.es();
};
