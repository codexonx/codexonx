import { useState, useEffect } from 'react';

/**
 * Media query hook
 * 
 * Bu hook, verilen media query'nin mevcut durumunu takip eder
 * 
 * @param query CSS media query string (örn. '(min-width: 768px)')
 * @returns Media query'nin eşleşip eşleşmediğini belirten boolean değer
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR kontrolü
    if (typeof window === 'undefined') {
      return;
    }

    // Media query'yi oluştur
    const mediaQuery = window.matchMedia(query);

    // İlk durumu ayarla
    setMatches(mediaQuery.matches);

    // Değişiklik olduğunda state'i güncelle
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Event listener'ı ekle
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Eski tarayıcılar için destek
      // @ts-ignore - Eski tarayıcı API'si
      mediaQuery.addListener(listener);
    }

    // Cleanup işlemi
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        // Eski tarayıcılar için destek
        // @ts-ignore - Eski tarayıcı API'si
        mediaQuery.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
