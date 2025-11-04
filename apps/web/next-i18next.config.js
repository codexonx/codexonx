/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'de', 'es', 'fr'],
    localeDetection: false, // Next.js 14.2+ uyarılarını önlemek için kapalı
  },
  defaultNS: 'common',
  localePath: './src/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // Next.js 14.2+ uyumluluğu için optimizasyonlar
  react: { useSuspense: false },
};
