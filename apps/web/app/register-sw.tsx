'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Service worker'ı kaydet
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker kaydı başarılı:', registration.scope);
        })
        .catch(err => {
          console.warn('Service Worker kaydı başarısız, dev ortamında yok sayılıyor:', err);
        });

      // Push aboneliği
      if ('PushManager' in window) {
        navigator.serviceWorker.ready.then(async registration => {
          try {
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
              console.log('Push bildirimleri için hazır');
              // Burada sunucuya abonelik bilgisini gönderebilirsiniz
            }
          } catch (error) {
            console.error('Push bildirimi abonelik hatası:', error);
          }
        });
      }
    }
  }, []);

  return null;
}
