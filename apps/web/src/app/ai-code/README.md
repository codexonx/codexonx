# AICodeX - AI Kod Yazma Platformu

AICodeX, yapay zeka destekli kod yazma, düzenleme ve geliştirme platformudur. Bu platform, [Emergent](https://app.emergent.sh/) benzeri bir deneyim sunarak, geliştiricilerin AI asistanlarla birlikte çalışarak kod projelerini daha hızlı ve verimli bir şekilde oluşturmasını sağlar.

## Özellikler

- **AI Destekli Kod Yazma**: Doğal dilde komutlarla kod oluşturma ve düzenleme
- **Kod Editörü**: Entegre kod düzenleme ortamı
- **Gerçek Zamanlı AI Chat**: Kodlama sırasında anında destek ve öneriler
- **Terminal Entegrasyonu**: Kodu test etme ve çalıştırma imkanı
- **Proje Yönetimi**: Çoklu dosya ve proje desteği
- **Kod Açıklama**: AI tarafından kod açıklamaları ve dokümantasyon

## Teknoloji Yığını

- **Frontend**: React 18, Next.js 14, TypeScript
- **UI**: TailwindCSS, Framer Motion
- **Bileşenler**: Shadcn UI, Radix UI
- **AI Entegrasyonu**: OpenAI API (simüle edilmiş)
- **İkonlar**: Lucide React

## Proje Yapısı

```plaintext
/ai-code
  ├── page.tsx               # Ana sayfa
  ├── layout.tsx             # AI kod platformu ana düzeni
  ├── editor/
  │   ├── page.tsx           # Kod editörü sayfası
  │   └── layout.tsx         # Editör düzeni
  ├── demo/
  │   └── page.tsx           # Demo sayfası
  └── components/
      ├── ai-api.ts          # AI API entegrasyonu
      ├── code-editor.tsx    # Kod editörü bileşeni
      └── ai-chat.tsx        # AI sohbet bileşeni
```

## Kurulum ve Çalıştırma

1. Proje bağımlılıklarını yükleme:

   ```bash
   npm install
   # veya
   yarn
   ```

2. Geliştirme sunucusunu başlatma:

   ```bash
   npm run dev
   # veya
   yarn dev
   ```

3. Tarayıcıda [http://localhost:3000/ai-code](http://localhost:3000/ai-code) adresini açın

## Gelecek Özellikler

- Kullanıcı hesap sistemi ve oturum yönetimi
- Gerçek OpenAI API entegrasyonu
- GitHub entegrasyonu
- Proje şablonları ve hazır kod parçaları
- Çoklu dil desteği
- İleri kod analizi ve optimize etme özellikleri
- Kolaboratif kodlama özellikleri

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
