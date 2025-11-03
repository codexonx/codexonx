# Codexonx Dağıtım (Deployment) Kılavuzu

Bu dokümantasyon, Codexonx platformunun dağıtım sürecini adım adım açıklamaktadır. Bu belgedeki talimatları takip ederek, uygulamayı geliştirme (development), test (staging) ve üretim (production) ortamlarında çalıştırabilirsiniz.

## İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [Yerel Geliştirme Ortamı](#yerel-geliştirme-ortamı)
3. [Docker ile Dağıtım](#docker-ile-dağıtım)
4. [CI/CD ile Otomatik Dağıtım](#cicd-ile-otomatik-dağıtım)
5. [Terraform ile Altyapı Kurulumu](#terraform-ile-altyapı-kurulumu)
6. [Veritabanı Göçü ve Yedekleme](#veritabanı-göçü-ve-yedekleme)
7. [SSL/TLS Yapılandırması](#ssltls-yapılandırması)
8. [Geri Alma (Rollback) Prosedürü](#geri-alma-rollback-prosedürü)

## Gereksinimler

### Yerel Geliştirme

- Node.js 18.x veya üstü
- npm 9.x veya üstü
- PostgreSQL 15.x
- Git

### Sunucu

- Docker 24.x veya üstü
- Docker Compose 2.x veya üstü
- 2GB RAM (minimum)
- 10GB Disk
- Ubuntu 20.04 LTS veya üstü

## Yerel Geliştirme Ortamı

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/codexonx/codexonx-platform.git
   cd codexonx-platform
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env` dosyalarını oluşturun:
   ```bash
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. `.env` dosyalarını düzenleyin ve gerekli ortam değişkenlerini ayarlayın.

5. Veritabanını ayarlayın:
   ```bash
   cd apps/server
   npx prisma migrate dev
   ```

6. Uygulamayı çalıştırın:
   ```bash
   cd ../..
   npm run dev
   ```

Uygulama şu adreslerde çalışacaktır:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Docker ile Dağıtım

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/codexonx/codexonx-platform.git
   cd codexonx-platform
   ```

2. `.env` dosyalarını oluşturun:
   ```bash
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. `.env` dosyalarını düzenleyin ve gerekli ortam değişkenlerini ayarlayın.

4. Docker Compose ile uygulamayı başlatın:
   ```bash
   docker-compose up -d
   ```

5. Veritabanı migrasyon işlemini gerçekleştirin:
   ```bash
   docker-compose exec server npx prisma migrate deploy
   ```

## CI/CD ile Otomatik Dağıtım

Bu proje, GitHub Actions kullanarak CI/CD pipeline'ı ile otomatik dağıtım yapılandırmasına sahiptir.

### Gereksinimler

1. GitHub repository'nizde şu ortam değişkenlerini ayarlayın:
   - `DOCKER_HUB_USERNAME`
   - `DOCKER_HUB_TOKEN`
   - `STAGING_HOST`
   - `STAGING_USERNAME`
   - `STAGING_SSH_KEY`
   - `PRODUCTION_HOST`
   - `PRODUCTION_USERNAME`
   - `PRODUCTION_SSH_KEY`

2. Staging ve Production ortamlarında şu adımları gerçekleştirin:
   - Sunucuda `/var/www/codexonx-staging` ve `/var/www/codexonx-production` dizinlerini oluşturun
   - Bu dizinlere repository'yi klonlayın
   - `.env` dosyalarını oluşturun ve gerekli değişkenleri ayarlayın

### Dağıtım Süreci

1. `main` branch'e kod gönderin:
   ```bash
   git push origin main
   ```

2. GitHub Actions otomatik olarak şu adımları gerçekleştirecek:
   - Kod testleri
   - Build
   - Docker imajları oluşturma
   - Docker Hub'a gönderme
   - Staging ortamına dağıtım
   - Production ortamına dağıtım

## Terraform ile Altyapı Kurulumu

1. `terraform` dizinine gidin:
   ```bash
   cd terraform
   ```

2. `terraform.tfvars` dosyasını oluşturun:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. `terraform.tfvars` dosyasını düzenleyin ve gerekli değişkenleri ayarlayın.

4. Terraform'u başlatın ve planı görüntüleyin:
   ```bash
   terraform init
   terraform plan
   ```

5. Altyapıyı oluşturun:
   ```bash
   terraform apply
   ```

## Veritabanı Göçü ve Yedekleme

### Veritabanı Göçü

```bash
# Production ortamında
docker-compose exec server npx prisma migrate deploy
```

### Veritabanı Yedekleme

```bash
# PostgreSQL yedekleme
docker-compose exec postgres pg_dump -U postgres -d codexonx > backup_$(date +%Y%m%d).sql
```

### Veritabanı Geri Yükleme

```bash
# PostgreSQL geri yükleme
cat backup_YYYYMMDD.sql | docker-compose exec -T postgres psql -U postgres -d codexonx
```

## SSL/TLS Yapılandırması

Bu uygulama, Nginx veya Caddy ile birlikte SSL/TLS yapılandırması ile çalıştırılmalıdır.

### Nginx ile SSL/TLS Yapılandırması

1. Nginx yapılandırma dosyası örneği:
   ```nginx
   server {
       listen 80;
       server_name example.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name example.com;

       ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. Certbot ile SSL sertifikası alın:
   ```bash
   certbot --nginx -d example.com
   ```

## Geri Alma (Rollback) Prosedürü

### Otomatik Geri Alma

CI/CD pipeline'ındaki hata durumunda otomatik geri alma işlemi gerçekleştirilir.

### Manuel Geri Alma

1. Önceki Docker imajını çekin:
   ```bash
   docker-compose pull [version]
   ```

2. Uygulamayı yeniden başlatın:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Veritabanı geri alma gerekliyse, yedekten geri yükleyin:
   ```bash
   cat backup_YYYYMMDD.sql | docker-compose exec -T postgres psql -U postgres -d codexonx
   ```
