# Codexonx Platform Cleanup Script
# Bu script, projedeki gereksiz dosyaları temizler ve bağımlılıkları yeniler

Write-Host "Codexonx Platform Temizlik Aracı Başlatılıyor..." -ForegroundColor Cyan

# Node modülleri klasörünü temizle
Write-Host "`nNode modülleri temizleniyor..." -ForegroundColor Yellow
Remove-Item -Path "./node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./apps/*/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./packages/*/node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# Derleme çıktılarını temizle
Write-Host "`nDerleme çıktıları temizleniyor..." -ForegroundColor Yellow
Remove-Item -Path "./apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./apps/server/dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./packages/*/dist" -Recurse -Force -ErrorAction SilentlyContinue

# Geçici dosyaları temizle
Write-Host "`nGeçici dosyalar temizleniyor..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Include "*.log", "*.lock", "yarn-error.log" -Recurse -File | Remove-Item -Force
Remove-Item -Path "./.turbo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./coverage" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./apps/*/coverage" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "./packages/*/coverage" -Recurse -Force -ErrorAction SilentlyContinue

# npm önbelleğini temizle
Write-Host "`nNPM önbelleği temizleniyor..." -ForegroundColor Yellow
npm cache clean --force

# Bağımlılıkları yeniden yükle
Write-Host "`nBağımlılıklar yeniden yükleniyor..." -ForegroundColor Green
npm install

# ESLint önbelleğini temizle
Write-Host "`nESLint önbelleği temizleniyor..." -ForegroundColor Yellow
Remove-Item -Path "./.eslintcache" -Force -ErrorAction SilentlyContinue

Write-Host "`nTemizlik işlemi tamamlandı!" -ForegroundColor Cyan
Write-Host "Şimdi 'npm run build' komutu ile projeyi derleyebilirsiniz." -ForegroundColor Green
