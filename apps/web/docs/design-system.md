# Design System Tokens

Bu belge, landing sayfası modernizasyonu kapsamında oluşturulan merkezi tasarım tokenlarının nasıl işlendiğini açıklar.

## Dosya Yapısı

- `src/styles/design-tokens.css`: Işık ve karanlık tema için yüzey, marka renkleri, spacing, radius, gölge ve animasyon değişkenleri.
- `app/globals.css`: Tailwind taban katmanı; token değişkenlerini framework değişkenlerine (background, primary vb.) bağlar.
- `tailwind.config.js`: Tailwind genişletmeleri token referanslarıyla hizalıdır (spacing, radius, gölge, geçiş).

## Kullanım

- Tailwind spacing sınıfları (`px-lg`, `py-sm`, `gap-xl` vb.) token değerlerini kullanır.
- `rounded-lg`, `rounded-2xl` ve benzeri sınıflar token tabanlı yarıçapları temsil eder.
- `bg-primary`, `text-muted-foreground`, `shadow-primary-glow` gibi sınıflar doğrudan tokenlara bağlıdır.
- Cam efekti veya özel animasyon isteyen bileşenlerde `var(--token-glass-*)` ve `var(--token-duration-*)` değişkenleri kullanılabilir.

## Doğrulama

- `ThemeToggle` ile ışık/karanlık tema geçişinde yüzey renklerinin tutarlı kaldığı manuel test edildi.
- `Button` bileşeninin boyut varyantlarında (`px-lg`, `py-sm`) token tabanlı spacing sınıfları kullanılmaktadır.
- Landing page hero/pricing blokları yeni token yapısıyla görsel olarak değişmeden çalışmaktadır.

Tokenlarda yapılacak değişikliklerin Tailwind sınıflarına otomatik yansıması için sadece `design-tokens.css` dosyasını güncellemeniz yeterlidir.
