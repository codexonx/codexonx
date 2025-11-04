# Katkıda Bulunma Rehberi

Bu belge, Codexonx AI Kod Platformu projesine katkıda bulunmak isteyen geliştiriciler için bir rehberdir.

## Geliştirme Süreci

1. [Issues](https://github.com/codexonx/codexonx/issues) sayfasından bir iş seçin veya yeni bir issue oluşturun
2. İlgili issue için bir branch oluşturun (`git checkout -b feature/issue-123` veya `bugfix/issue-456`)
3. Değişikliklerinizi yapın ve düzgün commit mesajları yazın
4. Kodunuzu düzenli olarak push edin (`git push origin feature/issue-123`)
5. Değişiklikleriniz tamamlandığında, pull request açın

## Commit Mesajları

Lütfen commit mesajlarınızı aşağıdaki formatta yazın:

```text
type(scope): kısa açıklama

detaylı açıklama
```

Örnekler:

- `feat(ai-editor): AI kod önerilerini geliştir`
- `fix(auth): oturum zaman aşımı hatasını düzelt`
- `docs(readme): kurulum talimatlarını güncelle`
- `test(api): yeni test durumları ekle`

## Kod Standardı

Projede şu kod standartlarını kullanıyoruz:

- TypeScript kodunuzun derlenebilir olduğundan emin olun: `npm run typecheck`
- ESLint kurallarına uyun: `npm run lint`
- Prettier ile kodunuzu biçimlendirin: `npm run format`
- Yazılım testleri: Yeni özellikler veya düzeltmeler için testler yazın: `npm test`

## Branch Stratejisi

- `main`: Production ortamı. Stable, deploy edilmeye hazır kod içerir.
- `develop`: Geliştirme ortamı. Yeni özellikler bu branch'e merge edilir.
- `feature/*`: Yeni özellikler için.
- `bugfix/*`: Hata düzeltmeleri için.
- `hotfix/*`: Acil düzeltmeler için.

## Pull Request Süreci

1. PR başlığının açıklayıcı olduğundan emin olun
2. İlgili issue numarasını ekleyin (örn. `Closes #123`)
3. Değişikliklerinizi açıklayın
4. CI testlerinin geçtiğinden emin olun
5. Birkaç reviewer atayın

## Yayınlama Süreci

Sürüm numaraları [Semantic Versioning](https://semver.org/) standardını takip eder:

- MAJOR: Geriye dönük uyumlu olmayan API değişiklikleri
- MINOR: Geriye dönük uyumlu yeni özellik eklemeleri
- PATCH: Geriye dönük uyumlu hata düzeltmeleri

## İletişim

Sorularınız için:

- [GitHub Issues](https://github.com/codexonx/codexonx/issues)
- [Discord Sunucusu](https://discord.gg/codexonx)
- Email: [dev@codexonx.com](mailto:dev@codexonx.com)
