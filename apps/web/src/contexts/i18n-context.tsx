"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
// @ts-ignore - Tip tanımlamalarını görmezden gel
import { useTranslation } from 'next-i18next';

type Locale = 'tr' | 'en' | 'de' | 'es' | 'fr';

interface I18nContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [locale, setLocale] = useState<Locale>('tr');

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      // App Router'da locale değişimi için özel bir yaklaşım
      setLocale(newLocale);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLocale;
        // RTL dilleri için gelecekte kullanmak üzere
        document.documentElement.dir = 'ltr';
      }

      // Burada dil değişimi için gerekli işlemleri yapabiliriz
      // Örneğin localstorage'a kaydedebiliriz
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('locale', newLocale);
      }
    },
    []
  );
  
  // Tarayıcı ortamında sayfa yüklenirken localStorage'dan dil tercihini al
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && ['tr', 'en', 'de', 'es', 'fr'].includes(savedLocale)) {
        setLocale(savedLocale);
        document.documentElement.lang = savedLocale;
      }
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
