# Codexonx Agent Workflow (Taslak)

Bu doküman, Emergent E1 sistem promptundan çıkarılan en iyi uygulamaları Codexonx süreçlerine uyarlamak için hazırlanmıştır. Taslak statüsündedir; ekip geri bildirimleriyle güncellenecektir.

## 1. Amaç ve Kapsam

- Landing/Studio gibi pazarlama arayüzleri ile ürün prototiplerini hızlı, tutarlı ve test edilebilir şekilde geliştirmek.
- Mock → Onay → Backend entegrasyonu döngülerini standartlaştırmak.
- QA sürecinde backend-öncelikli yaklaşımı ve kullanıcı onayı gerektiren adımları netleştirmek.

## 2. Çalışma Fazları

1. **Analiz & Netleştirme**
   - Gereksinimleri ve gerekli API anahtarlarını baştan topla.
   - Belirsizlik varsa ilerleme, önce kullanıcıdan açıklama iste.

2. **Mock Frontend Uygulaması**
   - En fazla 5 dosyalık bloklarda, mock veri dosyalarıyla çalış (örn. `mock.ts`).
   - Bileşenleri 300-400 satırı geçmeyecek şekilde modüler tut.
   - Her mock kullanımını özetlerde vurgula.

3. **Sözleşme (Contracts) Aşaması**
   - Backend’e geçmeden önce `contracts.md` benzeri bir dosyada:
     - API uç noktaları
     - Mock verilerin hangi gerçek veriyle değişeceği
     - Entegrasyon akışı
     - Required validation kuralları
   - Bu adımı Product/PM ile onayla.

4. **Backend Geliştirme & Entegrasyon**
   - CRUD odaklı asgari implementasyon, hataların loglanması.
   - Frontend mocklarını gerçek endpointlerle değiştir.
   - Küçük güncellemeler için lokal arama/değiştirme, büyük değişiklikler için toplu dosya yazma araçlarını kullan.

5. **Test Protokolü**
   - Önce backend test (ör. `deep_testing_backend_v2` muadili).
   - Frontend otomasyonu için kullanıcı onayı al, aksi halde manuel kurcalama yap veya kullanıcıya bırak.
   - Test sonuçlarını ortak `test_result.md` dosyasında güncelle; protokol kısmına dokunma.

## 3. Tasarım ve UX İlkeleri

- Glow/glass morfizm teması, gradient butonlar, kontrast denetimi her iterasyonda kontrol edilmelidir.
- Shadcn bileşenleri (accordion, dialog, tabs vb.) öncelikli; özel bileşenler taslak onayı aldıktan sonra eklenir.
- Inline düzenleme, net focus ring ve aşırı modal kullanımından kaçınma ilkeleri uygulanır.
- Storybook’ta her yeni primitif için varyant hikâyesi açılır.

## 4. Araç Haritalaması

| Emergent Aracı | Codexonx Karşılığı / Plan | Not |
| --- | --- | --- |
| `mcp_bulk_file_writer` | apply_patch + gelecekte yazılacak çoklu dosya CLI’sı | Limitsiz düzenlemeler için backlog açıldı |
| `integration_playbook_expert_v2` | Entegrasyon sözleşmesi + Notion playbook şablonu | API projelerinde zorunlu aşama |
| `deep_testing_backend_v2` | CI’de backend test job’ı (vitest, jest, postman) | Önce backend koş, raporu `test_result.md`ye yaz |
| `auto_frontend_testing_agent` | Playwright senaryoları, kullanıcı onayı ile tetikleme | QA onayı şart |
| `support_agent` | Dahili FAQ/Notion sayfası | Yetki dışı sorularda referans |

## 5. Riskler & Dikkat Noktaları

- Emergent promptundaki supervisor, universal key vb. komutlar bizde yok; karşılığı olmayan noktaları belgeye almadan önce uyarlamak gerekir.
- Mock verileri gerçek ortama sızmamalı; merge öncesi mutlaka temizlenmelidir.
- Uzun süreçli komutlar (sunucu, build) CI/CD üzerinden çalıştırılmalı, lokalden uzun süreli süreç açılmamalıdır.

## 6. Deliverable Takvimi Önerisi

| Sprint | Deliverable |
| --- | --- |
| Hafta 1 | Bu dokümanın final revizyonu, Notion/Storybook entegrasyonu |
| Hafta 2 | CI pipeline güncellemesi (backend-first test, optional frontend run) |
| Hafta 3 | Entegrasyon sözleşmesi şablonları + CLI/backlog görevleri |
| Sürekli | Diğer ajan promptlarından içgörü çıkarma ve playbook’a ekleme |

## 7. Sonraki Adımlar

1. Paydaş incelemesi ve onay toplama.
2. Storybook’a “Operational Playbooks” bölümü ekleyip bu dokümanı referans gösterme.
3. Issue/PR şablonlarında mock bildirimi, contract zorunluluğu ve test sırası checklist’lerini güncelleme.

Hazırlayan: Cascade · Codexonx için Emergent prompt uyarlaması taslağı
