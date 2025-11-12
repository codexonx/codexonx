---
name: Pull Request
about: Kod değişiklikleri için açılan pull request şablonu
---

# Özet

<!-- Bu PR ne yapıyor? -->

## Checklist

### Hazırlık

- [ ] Mock veri kaldırıldı veya biliniyor
- [ ] `contracts.md` güncellendi ya da gerekmediği belirtildi
- [ ] Storybook ve dokümantasyon güncellemeleri eklendi (gerekiyorsa)

### Test

- [ ] `npm run lint -- --filter=@codexonx/web`
- [ ] Backend testleri (ör. `npm run test:backend`) çalıştırıldı
- [ ] Frontend testleri kullanıcı onayıyla çalıştırıldı veya manuel doğrulama yapıldı

### İnceleme Notları

- [ ] Ana tasarım kararları ve riskler özetlendi
- [ ] Mock → Backend geçiş planı açıklandı

> Referans: `apps/web/docs/codexonx-agent-workflow.md`
