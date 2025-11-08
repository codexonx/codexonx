# AICodeX - Yapay Zeka Destekli Kod Yazma Platformu

AICodeX, geliştiricilere yapay zeka güç ile kod yazma, düzenleme ve geliştirme olanağı sunan modern bir kodlama platformudur. Bu platform, [Emergent](https://app.emergent.sh/) ve [GitHub Copilot](https://github.com/features/copilot) benzeri bir deneyim sunarak, geliştiricilerin AI asistanlarla birlikte çalışarak kodlama sürecini hızlandırmasını ve kod kalitesini artırmasını sağlar.

## Özellikler

- **AI Destekli Kod Yazma**: Doğal dilde komutlarla kod oluşturma ve düzenleme
- **Kod Editörü**: Entegre kod düzenleme ortamı
- **Gerçek Zamanlı AI Chat**: Kodlama sırasında anında destek ve öneriler
- **Terminal Entegrasyonu**: Kodu test etme ve çalıştırma imkanı
- **Proje Yönetimi**: Çoklu dosya ve proje desteği
- **Kod Açıklama**: AI tarafından kod açıklamaları ve dokümantasyon

## Teknoloji Yığını

- **Frontend**: React 18, Next.js 14.2+, TypeScript 5.4+
- **Kod Editörü**: Monaco Editor (VS Code motoru)
- **UI**: TailwindCSS 3.4+, Framer Motion 11
- **Bileşenler**: Shadcn UI, Radix UI 2.0
- **AI Entegrasyonu**: OpenAI API (simüle edilmiş, GPT-4o hazırlıklı)
- **İkonlar**: Lucide React 0.350+
- **Performans Optimizasyonu**: Web Workers, Code Splitting, Lazy Loading

## Proje Yapısı

```plaintext
/ai-code
  ├─ page.tsx                 # Ana tanıtım sayfası
  ├─ layout.tsx               # AI kod platformu ana düzeni
  ├─ editor/
  │   ├─ page.tsx             # Kod editörü sayfası
  │   └─ layout.tsx           # Editör düzeni
  ├─ demo/
  │   └─ page.tsx             # Demo sayfası
  ├─ community/               # Topluluk sayfaları
  ├─ projects/                # Kullanıcı projeleri
  ├─ templates/               # Proje şablonları
  ├─ settings/                # Kullanıcı ve uygulama ayarları
  └─ components/
      ├─ ai-api.ts            # AI API entegrasyonu (simüle edilmiş)
      ├─ ai-chat.tsx          # AI sohbet bileşeni
      ├─ monaco-editor.tsx    # Monaco kod editörü bileşeni
      └─ monaco-editor.css    # Monaco editör stilleri
```

## Kurulum ve Çalıştırma

1. Proje bağımlılıklarını yükleme:

   ```bash
   npm install
   # veya
   yarn
   ```

2. Monaco Editör worker'larını oluşturma:

   ```bash
   npx webpack --config webpack.monaco-workers.config.js
   ```

3. Geliştirme sunucusunu başlatma:

   ```bash
   npm run dev
   # veya
   yarn dev
   ```

4. Tarayıcıda [http://localhost:3000/ai-code](http://localhost:3000/ai-code) adresini açın

## Gelecek Özellikler

- **Kullanıcı Yönetimi**: Oturum açma, hesap yönetimi ve kullanıcı profilleri
- **Gerçek AI Entegrasyonu**: OpenAI, Claude veya Gemini API'ları ile entegrasyon
- **Git Entegrasyonu**: GitHub, GitLab veya Bitbucket entegrasyonu
- **Kod Analiz Æracları**: Statik kod analizi, güvenlik taramaları, kod kalitesi değerlendirmesi
- **Proje Şablonları**: Önceden hazırlanmış çeşitli proje şablonları
- **Kolaboratif Kodlama**: Birden fazla geliştiricinin aynı projede çalışabilmesi
- **Çoklu AI Modelieri**: Farklı AI modellerini proje gereksinimlerine göre kullanabilme
- **Özelleştirme**: Tema, düzenleme ve kullanıcı tercihleri

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
