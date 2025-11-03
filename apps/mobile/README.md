# Codexonx Mobile

Codexonx platformunun React Native ile geliştirilmiş mobil uygulaması.

## Özellikler

- Çoklu dil desteği (Türkçe, İngilizce, Almanca, İspanyolca, Fransızca)
- Karanlık/Aydınlık tema desteği
- Projelerinizi mobil üzerinden yönetme
- Offline çalışma desteği
- Güvenli kimlik doğrulama
- Detaylı analitikler
- Bildirimler

## Kurulum

### Ön Gereksinimler

- Node.js 18 veya üstü
- Yarn veya NPM
- React Native CLI
- XCode (iOS için)
- Android Studio (Android için)

### Geliştirme Ortamının Hazırlanması

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/codexonx/codexonx-platform.git
   cd codexonx-platform
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   yarn
   # veya
   npm install
   ```

3. iOS için pod'ları yükleyin (sadece macOS'ta):
   ```bash
   cd apps/mobile/ios && pod install
   ```

4. Geliştirme ortamı değişkenlerini ayarlayın:
   - `.env.example` dosyasını `.env` olarak kopyalayın
   - Gereken değerleri ayarlayın

### Uygulamayı Çalıştırma

iOS için:
```bash
cd apps/mobile
yarn ios
# veya
npm run ios
```

Android için:
```bash
cd apps/mobile
yarn android
# veya
npm run android
```

## Proje Yapısı

```
apps/mobile/
├── android/         # Android için özel dosyalar
├── ios/             # iOS için özel dosyalar
├── src/
│   ├── assets/      # Resimler, ikonlar, fontlar
│   ├── components/  # Yeniden kullanılabilir UI bileşenleri
│   ├── config/      # Yapılandırma dosyaları
│   ├── hooks/       # Özel React hook'ları
│   ├── i18n/        # Dil dosyaları ve çeviriler
│   ├── navigation/  # React Navigation yapılandırması
│   ├── screens/     # Uygulama ekranları
│   ├── services/    # API servisleri
│   ├── store/       # Zustand state yönetimi
│   ├── types/       # TypeScript tip tanımlamaları
│   └── utils/       # Yardımcı fonksiyonlar
├── App.tsx          # Ana uygulama bileşeni
└── index.js         # Giriş noktası
```

## Teknoloji Yığını

- React Native
- TypeScript
- React Navigation
- i18next
- Zustand
- React Native MMKV
- React Native Reanimated

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Özellik dalınızı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add some amazing feature'`)
4. Dalınıza push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
