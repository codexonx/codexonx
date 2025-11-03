# CodeXONX Platform Kullanıcı Rehberi

Bu rehber, CodeXONX Platform'un temel özelliklerini ve nasıl kullanılacağını detaylı olarak anlatmaktadır. Platform, kod geliştirme ve yönetim süreçlerinizi kolaylaştırmak için birçok özellik sunar.

## İçindekiler

- [Başlarken](#başlarken)
  - [Hesap Oluşturma](#hesap-oluşturma)
  - [Giriş Yapma](#giriş-yapma)
  - [Ana Ekran](#ana-ekran)
- [Kod Editörü](#kod-editörü)
  - [Editör Temel Kullanımı](#editör-temel-kullanımı)
  - [Kodlama Özellikleri](#kodlama-özellikleri)
  - [AI Destekli Kod Tamamlama](#ai-destekli-kod-tamamlama)
- [Terminal](#terminal)
  - [Terminal Komutları](#terminal-komutları)
  - [Çoklu Terminal Oturumları](#çoklu-terminal-oturumları)
- [Projeler](#projeler)
  - [Proje Oluşturma](#proje-oluşturma)
  - [Şablon Kullanma](#şablon-kullanma)
  - [Proje Paylaşımı](#proje-paylaşımı)
- [Şablonlar](#şablonlar)
  - [Hazır Şablonlar](#hazır-şablonlar)
  - [Topluluk Şablonları](#topluluk-şablonları)
- [AI Asistanı](#ai-asistanı)
  - [AI Chat Kullanımı](#ai-chat-kullanımı)
  - [Kod Analizi](#kod-analizi)
  - [Otomatik Kod Üretimi](#otomatik-kod-üretimi)
- [Ayarlar](#ayarlar)
  - [Profil Ayarları](#profil-ayarları)
  - [Editör Ayarları](#editör-ayarları)
  - [Bildirim Ayarları](#bildirim-ayarları)
  - [Güvenlik](#güvenlik)
- [API Kullanımı](#api-kullanımı)
  - [API Anahtarları](#api-anahtarları)
  - [API Entegrasyonu](#api-entegrasyonu)
- [SSS ve Sorun Giderme](#sss-ve-sorun-giderme)

## Başlarken

### Hesap Oluşturma

CodeXONX platformunu kullanmaya başlamak için öncelikle bir hesap oluşturmanız gerekir:

1. Ana sayfada **Kayıt Ol** butonuna tıklayın.
2. İstenilen bilgileri (ad-soyad, e-posta, şifre) girin.
3. Kullanım şartlarını ve gizlilik politikasını onaylayın.
4. **Kayıt Ol** butonuna tıklayarak hesap oluşturma işlemini tamamlayın.
5. E-posta adresinize gönderilen doğrulama bağlantısına tıklayarak hesabınızı aktifleştirin.

Ayrıca, GitHub hesabınızla da hızlıca kayıt olabilirsiniz.

### Giriş Yapma

Hesabınızı oluşturduktan sonra:

1. Ana sayfada **Giriş Yap** butonuna tıklayın.
2. E-posta ve şifrenizi girin.
3. İsterseniz **Beni Hatırla** seçeneğini işaretleyin.
4. **Giriş Yap** butonuna tıklayın.

Şifrenizi unuttuysanız, "Şifremi Unuttum" bağlantısına tıklayarak şifre sıfırlama işlemini başlatabilirsiniz.

### Ana Ekran

Başarıyla giriş yaptıktan sonra, dashboard ana ekranına yönlendirileceksiniz. Bu ekranda:

- Sol tarafta **Ana Menü** bulunur (Projeler, Editör, Terminal, Şablonlar, Topluluk, Ayarlar)
- Üst kısımda **Arama Çubuğu** ve **Profil Menüsü** yer alır
- Ana içerik alanında **Son Projeleriniz**, **Aktivite Özeti** ve **Önerilen Şablonlar** gibi hızlı erişim kartları bulunur

## Kod Editörü

### Editör Temel Kullanımı

CodeXONX'in en güçlü özelliklerinden biri entegre kod editörüdür:

1. Sol menüden **Editör**'e tıklayın veya bir projedeki dosyaya tıklayarak editörü açın.
2. Editör ekranı üç ana bölümden oluşur:
   - Sol panel: Dosya gezgini
   - Orta alan: Kod editörü
   - Sağ panel: AI asistanı ve özellikler

Editör içinde gezinmek için:

- **Ctrl+P** (Windows/Linux) veya **Cmd+P** (Mac): Dosya arama
- **Ctrl+F** (Windows/Linux) veya **Cmd+F** (Mac): Metin arama
- **Ctrl+Shift+F** (Windows/Linux) veya **Cmd+Shift+F** (Mac): Tüm dosyalarda arama

### Kodlama Özellikleri

Editör aşağıdaki özellikleri sunar:

- **Sözdizimi Vurgulama**: 50'den fazla programlama dili için
- **Otomatik Tamamlama**: Kod tamamlama önerileri
- **Hata Vurgulama**: Kod hatalarının anında tespiti
- **Kod Katlanabilme**: Kod bloklarını daraltıp genişletme
- **Çoklu İmleç**: Birden fazla yerde aynı anda düzenleme
- **Kod Formatlama**: Kod düzenini otomatik olarak düzeltme
- **Terminal Entegrasyonu**: Editör içinden komut çalıştırma

### AI Destekli Kod Tamamlama

Editör içindeki AI destekli kod tamamlama özelliği:

1. Kod yazarken AI önerileri otomatik olarak görünür.
2. Tab tuşuna basarak veya tıklayarak önerileri kabul edebilirsiniz.
3. Daha kapsamlı yardım için sağ panelden AI asistanını açabilirsiniz.
4. AI asistanına doğal dil ile komutlar yazabilirsiniz: "Bu fonksiyonu optimize et" gibi.

## Terminal

### Terminal Komutları

Terminal, projenizde komut çalıştırmanızı sağlar:

1. Sol menüden **Terminal**'e tıklayın.
2. Terminal komut isteminde komutlarınızı yazın ve Enter tuşuna basın.
3. Temel komutlar:
   - `ls` veya `dir`: Dosya listesi
   - `cd [klasör]`: Klasör değiştirme
   - `npm install`: NPM paketlerini kurma
   - `git commit`: Git değişikliklerini commit etme

### Çoklu Terminal Oturumları

Aynı anda birden fazla terminal oturumu çalıştırabilirsiniz:

1. Terminal sekmelerinin yanındaki "+" simgesine tıklayarak yeni bir terminal açın.
2. Terminaller arasında geçiş yapmak için sekmelere tıklayın.
3. Her terminal için farklı bir çalışma dizini veya tür seçebilirsiniz.
4. Gereksiz terminalleri kapatmak için sekmenin yanındaki "X" simgesine tıklayın.

## Projeler

### Proje Oluşturma

Yeni bir proje oluşturmak için:

1. Sol menüden **Projeler**'e tıklayın.
2. "Yeni Proje" butonuna tıklayın.
3. Proje adı ve açıklaması girin.
4. Programlama dilini seçin.
5. Boş bir proje oluşturmak veya bir şablon kullanmak arasında seçim yapın.
6. "Oluştur" butonuna tıklayın.

### Şablon Kullanma

Şablonla proje başlatmak için:

1. "Şablonla Başla" seçeneğini işaretleyin.
2. Kategoriler arasında göz atın veya arama yapın.
3. Bir şablon seçin ve "Bu Şablonu Kullan" butonuna tıklayın.
4. Gerekirse şablon için özel ayarları yapılandırın.
5. "Projeyi Oluştur" butonuna tıklayın.

### Proje Paylaşımı

Projelerinizi ekip üyeleriyle veya toplulukla paylaşabilirsiniz:

1. Paylaşmak istediğiniz projeyi açın.
2. "Paylaş" butonuna tıklayın.
3. Paylaşım seçeneklerini belirleyin:
   - **Özel Paylaşım**: Belirli kullanıcılara erişim verin
   - **Topluluk Paylaşımı**: Projeyi toplulukla paylaşın
   - **Genel Paylaşım**: Herkese açık bir bağlantı oluşturun
4. İzin seviyelerini ayarlayın (görüntüleme, düzenleme, vb.)
5. "Paylaş" butonuna tıklayın.

## Şablonlar

### Hazır Şablonlar

CodeXONX, çeşitli teknolojiler için hazır şablonlar sunar:

1. Sol menüden **Şablonlar**'a tıklayın.
2. Kategorilere göre filtreleme yapabilir veya arama çubuğunu kullanabilirsiniz.
3. Resmi şablonlar, platform ekibi tarafından oluşturulmuş ve test edilmiş şablonlardır.
4. Şablon detaylarını görmek için şablona tıklayın.
5. "Kullan" butonuna tıklayarak bu şablonla yeni bir proje oluşturabilirsiniz.

### Topluluk Şablonları

Topluluk üyeleri tarafından oluşturulan şablonlara erişmek için:

1. Şablonlar sayfasında "Topluluk Şablonları" sekmesine tıklayın.
2. En popüler veya en yeni şablonları görebilirsiniz.
3. Şablonları yıldız sayılarına göre sıralayabilirsiniz.
4. Beğendiğiniz şablonları yıldızlayarak daha sonra kolayca bulabilirsiniz.

## AI Asistanı

### AI Chat Kullanımı

AI asistanı ile etkileşim kurmak için:

1. Editör içindeyken sağ paneldeki "AI Asistanı" sekmesine tıklayın.
2. Metin alanına sorularınızı veya isteklerinizi yazın.
3. AI size hızlıca yanıt verecektir.
4. Kod örnekleri, açıklamalar veya öneriler alabilirsiniz.
5. Kod parçalarını doğrudan editöre eklemek için "Ekle" butonuna tıklayın.

Örnek kullanım senaryoları:
- "Bu fonksiyonu optimize etmeme yardımcı ol"
- "React'ta form validasyonu nasıl yapılır?"
- "Bu hatanın nedenini açıklayabilir misin?"

### Kod Analizi

AI asistanı kodunuzu analiz edebilir:

1. Analiz etmek istediğiniz kodu seçin.
2. Sağ tık menüsünden "Kodu Analiz Et" seçeneğine tıklayın.
3. AI, kodunuzun işlevselliğini, olası hataları ve iyileştirme önerilerini açıklayacaktır.

### Otomatik Kod Üretimi

AI ile kod üretmek için:

1. AI asistanına ne tür bir kod istediğinizi açıklayın.
2. Örneğin: "React ile bir login formu oluştur" veya "Bu veri yapısını sıralayan bir fonksiyon yaz"
3. AI, isteğinize göre kod üretecektir.
4. Üretilen kodu düzeltmek veya özelleştirmek için ek isteklerde bulunabilirsiniz.

## Ayarlar

### Profil Ayarları

Profil bilgilerinizi düzenlemek için:

1. Sol menüden **Ayarlar**'a tıklayın veya üst menüdeki profil simgesine tıklayıp "Ayarlar"ı seçin.
2. "Profil" sekmesine tıklayın.
3. Ad-soyad, kullanıcı adı, biyografi ve diğer bilgileri düzenleyebilirsiniz.
4. Profil fotoğrafınızı değiştirmek için mevcut fotoğrafa tıklayın ve yeni bir görsel yükleyin.
5. Sosyal medya hesaplarınızı bağlayabilirsiniz.
6. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.

### Editör Ayarları

Kod editörünüzü özelleştirmek için:

1. "Editör" sekmesine tıklayın.
2. Aşağıdaki ayarları değiştirebilirsiniz:
   - **Tema**: Açık, koyu veya sistem teması
   - **Font Boyutu**: Metin boyutunu ayarlama
   - **Girinti**: Tab veya boşluk kullanımı ve genişliği
   - **Kelime Kaydırma**: Uzun satırların görünümü
   - **Otomatik Kaydetme**: Dosyaların otomatik kaydedilme sıklığı
   - **Kod Formatlama**: Formatlama tercihleri
3. Değişiklikler otomatik olarak kaydedilir ve anında uygulanır.

### Bildirim Ayarları

Bildirim tercihlerinizi yönetmek için:

1. "Bildirimler" sekmesine tıklayın.
2. Aşağıdaki kategorilerdeki bildirimleri açıp kapatabilirsiniz:
   - Proje güncellemeleri
   - Yorumlar ve yanıtlar
   - Ekip davetleri
   - Platform güncellemeleri
   - E-posta bildirimleri
3. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.

### Güvenlik

Hesap güvenlik ayarlarınızı yönetmek için:

1. "Güvenlik" sekmesine tıklayın.
2. Şifrenizi değiştirebilirsiniz.
3. İki faktörlü kimlik doğrulamayı (2FA) etkinleştirebilirsiniz.
4. Oturum açılmış cihazları görüntüleyebilir ve yönetebilirsiniz.
5. API anahtarlarını oluşturabilir ve yönetebilirsiniz.
6. Hesabınızı silme seçeneği de burada bulunur.

## API Kullanımı

### API Anahtarları

API anahtarı oluşturmak için:

1. "Ayarlar > Güvenlik > API Anahtarları" bölümüne gidin.
2. "Yeni API Anahtarı" butonuna tıklayın.
3. Anahtara bir ad verin ve izinleri seçin.
4. "Oluştur" butonuna tıklayın.
5. Oluşturulan API anahtarını güvenli bir yere kaydedin, tekrar görüntülenemez.

### API Entegrasyonu

API'yi uygulamalarınızla entegre etmek için:

1. Sol menüden "API Belgeleri"ne tıklayın.
2. API endpoint'leri ve kullanım örneklerini inceleyebilirsiniz.
3. İsteklerinize kimlik doğrulama eklemek için:
   ```javascript
   // API İstek örneği
   fetch('https://api.codexonx.com/v1/projects', {
     method: 'GET',
     headers: {
       'Authorization': 'Bearer YOUR_API_KEY',
       'Content-Type': 'application/json'
     }
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error(error));
   ```

4. API kullanım limitlerinizi ve istatistiklerinizi "API Kullanımı" sayfasından izleyebilirsiniz.

## SSS ve Sorun Giderme

### Sık Sorulan Sorular

**S: Şifremi unuttum. Ne yapmalıyım?**  
C: Ana giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak şifre sıfırlama talimatlarını içeren bir e-posta alabilirsiniz.

**S: Projemi başkalarıyla nasıl paylaşabilirim?**  
C: Projenizin detay sayfasında "Paylaş" butonuna tıklayarak çeşitli paylaşım seçeneklerine erişebilirsiniz.

**S: Ücretsiz hesapta kaç proje oluşturabilirim?**  
C: Ücretsiz hesaplar 5 özel proje oluşturabilir. Sınırsız sayıda halka açık proje oluşturabilirsiniz.

**S: Projemi dışa aktarabilir miyim?**  
C: Evet, projenizin detay sayfasındaki "Dışa Aktar" butonunu kullanarak projenizi ZIP formatında indirebilirsiniz.

### Sorun Giderme

**Sorun: Editör yüklenmiyor**  
Çözüm:
1. Tarayıcınızı yenileyin
2. Tarayıcı önbelleğini temizleyin
3. WebGL'in etkin olduğundan emin olun
4. Farklı bir tarayıcı deneyin

**Sorun: Terminal komutları çalışmıyor**  
Çözüm:
1. Terminal türünün doğru olduğundan emin olun (Bash, PowerShell, vb.)
2. İnternet bağlantınızı kontrol edin
3. Projenizin çalışma dizinini kontrol edin
4. Hata çıktısını kontrol edin ve talimatlara göre hareket edin

**Sorun: AI asistanı yanıt vermiyor**  
Çözüm:
1. İnternet bağlantınızı kontrol edin
2. Sohbeti yeniden başlatmayı deneyin
3. Sorunuz daha kısa ve net bir şekilde yeniden formüle edin
4. Sorun devam ederse, platform yöneticileriyle iletişime geçin

---

Bu kullanıcı rehberi, CodeXONX Platform'un temel özelliklerini ve işlevselliğini kapsar. Platform sürekli geliştirilmekte olduğundan, en son özellikler ve güncellemeler için dokümantasyon sayfasını düzenli olarak kontrol edin.

Daha fazla yardıma ihtiyacınız olursa, platform içinde "Yardım" bölümünü ziyaret edebilir veya destek ekibimizle iletişime geçebilirsiniz.
