# Codexonx AI Kod Platform

Codexonx AI Kod Platform, yapay zeka destekli kod yazma, düzenleme ve geliştirme özellikleri sunan modern bir web platformudur. Proje yönetimi, AI destekli kod tamamlama, hata ayıklama, kod optimizasyonu ve otomatik dokumıntasyon gibi geliştiricilerin iş akışını hızlandıran birçok özelliği entegre bir arayüzde sunar.

## Özellikler

- 🤖 **AI Destekli Kod Yazma**: Doğal dilde komutlarla kod oluşturma ve düzenleme
- ✨ **Kod Tamamlama**: Akıllı kod tamamlama ve öneriler
- 👷 **Kod Analizi**: Kod kalite analizi, güvenlik taramaları ve optimizasyon önerileri
- 💡 **Kod Açıklama**: Varolan kodların açıklamalarını ve dokümantasyonunu otomatik oluşturma
- 💾 **Proje Yönetimi**: Kodlarınızı düzenli tutmak için proje ve dosya yönetimi
- 🚀 **Terminal Entegrasyonu**: Kod yazma ortamından doğrudan terminal komutları çalıştırma
- 🔗 **GitHub Entegrasyonu**: GitHub projelerinizle doğrudan bağlantı
- 👤 **Kişiselleştirme**: Kod stil tercihlerinize ve programlama alışkanlıklarınıza göre uyarlanabilir

## Teknoloji Yığını

### Frontend

- **Framework**: Next.js 14.2+
- **UI**: Tailwind CSS 3.4+, shadcn/ui bileşenleri
- **Kod Editörü**: Monaco Editor (VS Code motoru)
- **State Management**: Zustand
- **Veri Yönetimi**: TanStack Query
- **Kimlik Doğrulama**: NextAuth.js

### Backend

- **Runtime**: Node.js 18+
- **API Framework**: Express.js
- **AI Entegrasyonu**: OpenAI API & Kendi Özel AI Modellerimiz
- **Veritabanı ORM**: Prisma
- **Veritabanı**: PostgreSQL 15
- **Doğrulama**: Zod, JWT
- **İletişim**: RESTful API + WebSocket

### AI Özellikleri

- **Dil Desteği**: JavaScript, TypeScript, Python, Java, C#, Go, Ruby ve daha fazlası
- **Framework Bilgisi**: React, Vue, Angular, Express, Django, Flask ve daha fazlası
- **Kod Analizi**: Statik kod analizi, kod kalite değerlendirme
- **Güvenlik Tarama**: Güvenlik açıkları ve risk tespiti
- **Test Oluşturma**: Birim testleri ve entegrasyon testleri oluşturma

### DevOps

- **Konteynerizasyon**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Altyapı**: Terraform ile AWS/DigitalOcean
- **İzleme**: Prometheus + Grafana

## Proje Yapısı

Bu bir monorepo projesidir ve şu bileşenleri içerir:

```bash
├── apps/
│   ├── server/          # Backend API (Express.js + TypeScript)
│   ├── web/             # Frontend uygulaması (Next.js)
│   └── mobile/          # Mobil uygulama (React Native)
├── packages/            # Paylaşılan kütüphaneler
├── terraform/           # Altyapı kodu
├── docker-compose.yml   # Konteyner yapılandırması
├── turbo.json           # Monorepo yapılandırması
├── tools/               # Yardımcı scriptler ve araçlar
└── package.json         # Ana paket yapılandırması
```

## Başlangıç

### Gereksinimler

- Node.js 18.x veya üstü
- npm 9.x veya üstü
- PostgreSQL 15.x
- Docker ve Docker Compose (opsiyonel)

### Geliştirme Ortamı

```bash
# Projeyi klonlayın
git clone https://github.com/codexonx/codexonx-platform.git
cd codexonx-platform

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# Veritabanı migrasyonlarını çalıştırın
cd apps/server
npx prisma migrate dev
cd ../..

# Geliştirme modunda çalıştırın
npm run dev
```

Uygulama şu adreslerde çalışacaktır:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)

### Docker ile Çalıştırma

```bash
# Docker ile geliştirme ortamını başlatın
docker-compose up -d

# Veritabanı migrasyonlarını çalıştırın
docker-compose exec server npx prisma migrate dev
```

## Dokümantasyon

Daha fazla bilgi için aşağıdaki dökümanları inceleyebilirsiniz:

- [Dağıtım Kılavuzu](DEPLOYMENT.md)
- [Güvenlik Politikası](SECURITY.md)
- [API Dokümantasyonu](apps/server/README.md)

## Katkıda Bulunma

Projemize katkıda bulunmaktan memnuniyet duyarız! Pull request'ler açmadan önce lütfen aşağıdaki adımları takip edin:

1. İlgili issue'yu açın veya mevcut bir issue'ya atıfta bulunun
2. Değişikliklerinizi ayrı bir branch'te yapın
3. Kodunuzu test edin ve lint kurallarını kontrol edin
4. Pull request açın ve değişikliklerinizi açıklayın

## Lisans

Telif hakkı © 2025 Codexonx

Tüm hakları saklıdır. Bu projenin kaynak kodu, özel mülkiyettir ve açık kaynak değildir. Kopyalama, dağıtma veya değiştirme hakları yalnızca lisans sahibine aittir.
