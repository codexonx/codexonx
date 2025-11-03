# Codexonx Platform

Codexonx Platform, yazılım projelerinizi kolay bir şekilde yönetmenizi sağlayan güçlü ve modern bir web uygulamasıdır. API anahtarları yönetimi, proje takibi, kullanıcı yönetimi ve abonelik tabanlı ödeme sistemleri gibi birçok özelliği entegre bir arayüzde sunar.

## Özellikler

- 👤 **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi, rol tabanlı yetkilendirme
- 🔑 **API Anahtarı Yönetimi**: API anahtarı oluşturma, yenileme ve izleme
- 📊 **Analitik Paneli**: API kullanımı ve performans analizleri
- 💰 **Abonelik Sistemi**: Farklı özelliklere sahip ödeme planları ve entegrasyonları
- 🛡️ **Gelişmiş Güvenlik**: HTTPS, JWT, rate limiting, IP filtreleme
- 🚀 **Ölçeklenebilir Mimari**: Yüksek trafik ve kullanıcı sayısını destekleyecek yapı

## Teknoloji Yığını

### Frontend

- **Framework**: Next.js 14
- **UI**: Tailwind CSS, shadcn/ui bileşenleri
- **State Management**: Zustand
- **Veri Yönetimi**: TanStack Query
- **Kimlik Doğrulama**: NextAuth.js

### Backend

- **Runtime**: Node.js 18+
- **API Framework**: Express.js
- **Veritabanı ORM**: Prisma
- **Veritabanı**: PostgreSQL 15
- **Doğrulama**: Zod, JWT
- **İletişim**: RESTful API + WebSocket

### DevOps

- **Konteynerizasyon**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Altyapı**: Terraform ile AWS/DigitalOcean
- **İzleme**: Prometheus + Grafana

## Proje Yapısı

Bu bir monorepo projesidir ve şu bileşenleri içerir:

```
├── apps/
│   ├── server/          # Backend API (Express.js + TypeScript)
│   └── web/             # Frontend uygulaması (Next.js)
├── packages/            # Paylaşılan kütüphaneler
├── terraform/           # Altyapı kodu
├── docker-compose.yml   # Konteyner yapılandırması
├── turbo.json           # Monorepo yapılandırması
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
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

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
