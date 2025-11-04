# GitHub'a Push İşlemi için Komutlar

Aşağıdaki komutlar, yaptığımız değişiklikleri GitHub'a push etmek için kullanılabilir.

## 1. Değişiklikleri Kontrol Et

```bash
git status
```

## 2. Değişiklikleri Stage Et

```bash
git add .
```

## 3. Değişiklikleri Commit Et

COMMIT_MESSAGE.txt dosyasından mesajı kullanarak:

```bash
git commit -F COMMIT_MESSAGE.txt
```

veya direkt olarak:

```bash
git commit -m "feat(ai-platform): Yapay zeka kod yazma platformu yapısını tamamla"
```

## 4. Uzak Repository'i Ekle (eğer henüz eklenmemişse)

```bash
git remote add origin https://github.com/codexonx/codexonx.git
```

## 5. Branch Oluştur ve Değiştir (önerilen)

```bash
git checkout -b feature/ai-code-platform
```

## 6. Değişiklikleri Push Et

```bash
# Yeni branch için
git push -u origin feature/ai-code-platform

# veya direkt main branch'e push etmek için (dikkatli olun)
git push -u origin main
```

## 7. Pull Request Oluştur

1. GitHub'da repository'e git
2. "Compare & pull request" butonuna tıkla
3. PR detaylarını doldur ve "Create pull request" butonuna tıkla

## Not

Bu işlemleri yapmadan önce, bütün testlerin geçtiğinden emin olun:

```bash
npm run typecheck
npm run lint
npm test
```
