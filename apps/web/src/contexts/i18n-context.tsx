'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// @ts-ignore - Tip tanımlamalarını görmezden gel
import { useTranslation } from 'next-i18next';

type Locale = 'tr' | 'en' | 'de' | 'es' | 'fr';

const SUPPORTED_LOCALES: Locale[] = ['tr', 'en', 'de', 'es', 'fr'];

interface I18nContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  t: (key: string, options?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [locale, setLocale] = useState<Locale>('tr');

  const applyDocumentLocale = useCallback((nextLocale: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (!SUPPORTED_LOCALES.includes(newLocale)) {
        return;
      }

      setLocale(newLocale);
      applyDocumentLocale(newLocale);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('locale', newLocale);
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('lang', newLocale);
        const query = params.toString();
        const hash = window.location.hash ?? '';
        router.replace(`${pathname}${query ? `?${query}` : ''}${hash}`);
      }
    },
    [applyDocumentLocale, pathname, router, searchParams]
  );

  // Tarayıcı ortamında sayfa yüklenirken localStorage'dan dil tercihini al
  useEffect(() => {
    const paramLocale = searchParams.get('lang') as Locale | null;
    if (paramLocale && SUPPORTED_LOCALES.includes(paramLocale)) {
      setLocale(paramLocale);
      applyDocumentLocale(paramLocale);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('locale', paramLocale);
      }

      return;
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale | null;
      if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
        setLocale(savedLocale);
        applyDocumentLocale(savedLocale);
      }
    }
  }, [applyDocumentLocale, searchParams]);

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
