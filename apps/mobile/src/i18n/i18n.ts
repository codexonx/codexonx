import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguagePreference, saveLanguagePreference } from '@utils/storage';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@config/constants';

// Dil kaynakları
import trTranslation from './locales/tr.json';
import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';

// Dil kaynaklarını düzenle
const resources = {
  tr: {
    translation: trTranslation,
  },
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
};

/**
 * i18n ayarlarını başlat
 */
export const setupI18n = async (): Promise<void> => {
  // Kaydedilmiş dil tercihini al
  const savedLanguage = getLanguagePreference();
  
  // Kaydedilmiş dil geçerliyse kullan, yoksa varsayılanı
  const initialLanguage = savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)
    ? savedLanguage
    : DEFAULT_LANGUAGE;
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: DEFAULT_LANGUAGE,
      compatibilityJSON: 'v3', // React Native için gerekli
      interpolation: {
        escapeValue: false, // React zaten güvenli çıkış yapıyor
      },
    });
};

/**
 * Uygulama dilini değiştir
 */
export const changeLanguage = async (language: string): Promise<void> => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Desteklenmeyen dil: ${language}`);
  }
  
  await i18n.changeLanguage(language);
  saveLanguagePreference(language);
};

export default i18n;
