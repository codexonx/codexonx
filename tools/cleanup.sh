#!/bin/bash
# Codexonx Platform Cleanup Script
# Bu script, projedeki gereksiz dosyaları temizler ve bağımlılıkları yeniler

echo -e "\033[1;36mCodexonx Platform Temizlik Aracı Başlatılıyor...\033[0m"

# Node modülleri klasörünü temizle
echo -e "\n\033[1;33mNode modülleri temizleniyor...\033[0m"
rm -rf ./node_modules
rm -rf ./apps/*/node_modules
rm -rf ./packages/*/node_modules

# Derleme çıktılarını temizle
echo -e "\n\033[1;33mDerleme çıktıları temizleniyor...\033[0m"
rm -rf ./apps/web/.next
rm -rf ./apps/server/dist
rm -rf ./packages/*/dist

# Geçici dosyaları temizle
echo -e "\n\033[1;33mGeçici dosyalar temizleniyor...\033[0m"
find . -name "*.log" -type f -delete
find . -name "*.lock" -type f -delete
find . -name "yarn-error.log" -type f -delete
rm -rf ./.turbo
rm -rf ./coverage
rm -rf ./apps/*/coverage
rm -rf ./packages/*/coverage

# npm önbelleğini temizle
echo -e "\n\033[1;33mNPM önbelleği temizleniyor...\033[0m"
npm cache clean --force

# Bağımlılıkları yeniden yükle
echo -e "\n\033[1;32mBağımlılıklar yeniden yükleniyor...\033[0m"
npm install

# ESLint önbelleğini temizle
echo -e "\n\033[1;33mESLint önbelleği temizleniyor...\033[0m"
rm -f ./.eslintcache

echo -e "\n\033[1;36mTemizlik işlemi tamamlandı!\033[0m"
echo -e "\033[1;32mŞimdi 'npm run build' komutu ile projeyi derleyebilirsiniz.\033[0m"
