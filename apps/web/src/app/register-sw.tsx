"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      // Service worker'ı kaydet
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          console.log("Service Worker kaydı başarılı:", registration.scope);
        },
        function (err) {
          console.log("Service Worker kaydı başarısız:", err);
        }
      );

      // Push aboneliği
      if ("PushManager" in window) {
        navigator.serviceWorker.ready.then(async (registration) => {
          try {
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
              console.log("Push bildirimleri için hazır");
              // Burada sunucuya abonelik bilgisini gönderebilirsiniz
            }
          } catch (error) {
            console.error("Push bildirimi abonelik hatası:", error);
          }
        });
      }
    }
  }, []);

  return null;
}
