# Bu script, proje bağımlılıklarını günceller ve eski paketleri düzeltir (Windows PowerShell için)

Write-Host "Bağımlılık sorunlarını düzeltme başlatılıyor..." -ForegroundColor Green

# Eski node_modules klasörlerini temizle
Write-Host "Node modules klasörleri temizleniyor..." -ForegroundColor Yellow
Remove-Item -Path "./node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./apps/*/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./packages/*/node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# npm önbelleğini temizle
Write-Host "NPM önbelleği temizleniyor..." -ForegroundColor Yellow
npm cache clean --force

# Eski paketleri güncelle
Write-Host "Eski paketler güncelleniyor..." -ForegroundColor Yellow
npm install glob@^10.3.10 rimraf@^5.0.5 lru-cache@^10.2.0 --save-dev

# ESLint bağımlılıklarını güncelle
Write-Host "ESLint bağımlılıkları güncelleniyor..." -ForegroundColor Yellow
npm install eslint@^8.57.0 --save-dev

# npm audit fix ile güvenlik sorunlarını çöz
Write-Host "Güvenlik açıkları düzeltiliyor..." -ForegroundColor Yellow
npm audit fix --force

# Bağımlılıkları yeniden yükle ve dedupe
Write-Host "Bağımlılıklar yeniden yükleniyor..." -ForegroundColor Yellow
npm install
npm dedupe

Write-Host "İşlem tamamlandı!" -ForegroundColor Green
