/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'de', 'es', 'fr'],
    localeDetection: true,
  },
  defaultNS: 'common',
  localePath: './src/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
