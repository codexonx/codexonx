# Güvenlik Politikası

## Desteklenen Sürümler

Aşağıdaki sürümler güvenlik güncellemeleri ve yamalarıyla desteklenmektedir:

| Versiyon | Destekleniyor      |
| -------- | ------------------ |
| 1.0.x    | :white_check_mark: |
| < 1.0    | :x:                |

## Güvenlik Açığı Bildirme

Projede bir güvenlik açığı tespit ederseniz, lütfen bunu bir GitHub issue'su olarak değil, doğrudan e-posta ile bildirin.
Güvenlik açıklarını [security@codexonx.com](mailto:security@codexonx.com) adresine göndermeniz önemlidir.

## Güvenlik Açığı Yanıt Süreci

Güvenlik açığı bildirimi aldığımızda:

1. Bildirim alındığında, 24 saat içinde size yanıt verilecektir.
2. Güvenlik açığı doğrulanacak ve kategorilendirilecektir.
3. Açığın düzeltilme süresi hakkında bilgi verilecektir.
4. Gerekli düzeltmeler uygulandıktan sonra, size bilgi verilecektir.

## Açık Kaynak Yazılım Bileşenlerinin Güvenliği

Projede kullanılan açık kaynak yazılım bileşenlerinin güvenlik açıkları düzenli olarak kontrol edilmektedir.
Bu kontroller GitHub Security Alerts ve npm audit aracılığıyla otomatik olarak gerçekleştirilmektedir.

## Güvenlik Önlemleri

Uygulama aşağıdaki güvenlik önlemlerini içermektedir:

1. **Kimlik Doğrulama ve Yetkilendirme**
   - JWT tabanlı kimlik doğrulama
   - RBAC (Role-Based Access Control)
   - Çok faktörlü kimlik doğrulama (MFA) desteği

2. **Veri Güvenliği**
   - Şifrelerin güvenli bir şekilde hash'lenmesi (argon2)
   - Transport Layer Security (TLS/HTTPS)
   - Veritabanı şifrelemesi

3. **Güvenlik Başlıkları**
   - Content-Security-Policy (CSP)
   - X-XSS-Protection
   - X-Content-Type-Options
   - X-Frame-Options

4. **API Güvenliği**
   - Rate limiting
   - CORS politikası
   - API anahtarları ve token'lar
   - SQL enjeksiyonuna karşı koruma

5. **Kod Güvenliği**
   - Statik kod analizi
   - Güvenlik odaklı code review süreci
   - Düzenli güvenlik denetimleri

6. **Altyapı Güvenliği**
   - Container güvenliği
   - Network segmentasyonu
   - Güncel OS ve yazılım bileşenleri

## Sorumluluk Sınırları

Güvenlik açıklarını sorumlu bir şekilde bildirmeniz beklenmektedir. Yetkisiz erişim denemeleri, DoS saldırıları veya diğer zarar verici faaliyetler kesinlikle yasaktır.
