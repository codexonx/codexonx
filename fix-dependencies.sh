#!/bin/bash
# Bu script, proje bağımlılıklarını günceller ve eski paketleri düzeltir

echo "Bağımlılık sorunlarını düzeltme başlatılıyor..."

# Eski node_modules klasörlerini temizle
echo "Node modules klasörleri temizleniyor..."
rm -rf ./node_modules
rm -rf ./apps/*/node_modules
rm -rf ./packages/*/node_modules

# npm önbelleğini temizle
echo "NPM önbelleği temizleniyor..."
npm cache clean --force

# Eski paketleri güncelle
echo "Eski paketler güncelleniyor..."
npm install glob@^10.3.10 rimraf@^5.0.5 lru-cache@^10.2.0 --save-dev

# ESLint bağımlılıklarını güncelle
echo "ESLint bağımlılıkları güncelleniyor..."
npm install @eslint/object-schema@^2.1.1 @eslint/config-array@^1.0.5 --save-dev

# npm audit fix ile güvenlik sorunlarını çöz
echo "Güvenlik açıkları düzeltiliyor..."
npm audit fix --force

# Bağımlılıkları yeniden yükle ve dedupe
echo "Bağımlılıklar yeniden yükleniyor..."
npm install
npm dedupe

echo "İşlem tamamlandı!"
