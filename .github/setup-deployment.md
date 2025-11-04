# GitHub Actions Deployment Kurulumu

Bu belge, GitHub Actions üzerinden otomatik deployment yapabilmek için gerekli ayarları açıklar.

## GitHub Secrets

Aşağıdaki secret'lar GitHub repo ayarlarında tanımlanmalıdır:

### Docker Hub Bilgileri

- `DOCKER_PASSWORD`: Docker Hub erişim token'ı

### Staging Ortamı

- `STAGING_SSH_HOST`: Staging sunucu IP adresi
- `STAGING_SSH_USERNAME`: Staging SSH kullanıcı adı
- `STAGING_SSH_PRIVATE_KEY`: Staging SSH private key (Base64 kodlanmış)

### Production Ortamı

- `PRODUCTION_SSH_HOST`: Production sunucu IP adresi
- `PRODUCTION_SSH_USERNAME`: Production SSH kullanıcı adı
- `PRODUCTION_SSH_PRIVATE_KEY`: Production SSH private key (Base64 kodlanmış)

## SSH Anahtarı Oluşturma

1. SSH anahtarı oluşturma:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "deploy@codexonx.com" -f ~/.ssh/codexonx_deploy
   ```

2. Public anahtarı sunucuya yükleme:

   ```bash
   ssh-copy-id -i ~/.ssh/codexonx_deploy.pub user@sunucu-ip
   ```

3. Private anahtarı GitHub secret olarak ayarlama:
   ```bash
   cat ~/.ssh/codexonx_deploy | base64
   ```
   Bu komutun çıktısını kopyalayıp GitHub Secret olarak ekleyin.

## GitHub Environments

GitHub repo'nuzda aşağıdaki environment'ları tanımlayın:

- `staging`: Geliştirme ve test ortamı
- `production`: Canlı ortam

Bu environment'lar için gerekirse onay kuralları ve koruma önlemleri tanımlayabilirsiniz.
