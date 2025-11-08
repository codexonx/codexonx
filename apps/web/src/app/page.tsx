'use client';

import { MarketingHero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { SectionHeader } from '@/components/marketing/section-header';
import Link from 'next/link';
import Image from 'next/image';
import { WaitlistForm } from '@/components/marketing/waitlist-form';

const productivityFeatures = [
  {
    title: 'Çoklu ajan planlayıcı',
    description:
      'Story, task ve PR süreçlerini otomatik planlayan yapay zeka akışı aynı anda birden fazla ajanla birlikte çalışır.',
    icon: <span className="text-lg">🤖</span>,
    badge: 'Yakında',
  },
  {
    title: 'Akıllı test üretimi',
    description:
      'Kod değişikliklerinizi analiz ederek ünit, entegrasyon ve uçtan uca test önerileri sunar; CI/CD hatalarını azaltır.',
    icon: <span className="text-lg">🧪</span>,
  },
  {
    title: 'Bağlam duyarlı kod editörü',
    description:
      'Kod tabanınız, dokümantasyon ve verilmiş kararları anlık olarak bağlama alıp daha isabetli öneriler üretir.',
    icon: <span className="text-lg">🧠</span>,
  },
  {
    title: 'Takım içi hikâye panosu',
    description:
      'Ekip arkadaşlarınızla AI destekli brief paylaşın, anlık yorum bırakın, teslimatların görünürlüğünü artırın.',
    icon: <span className="text-lg">🗂️</span>,
  },
  {
    title: 'Kişiselleştirilmiş akışlar',
    description:
      'Sık kullandığınız pattern’leri öğrenir, size özel şablonlar ve kod snippet’leri üretir.',
    icon: <span className="text-lg">✨</span>,
  },
  {
    title: 'Gelişmiş güvenlik ve uyumluluk',
    description:
      'Veri maskeleme, audit log ve BYO model entegrasyonu ile kurumsal gereksinimlere uyum sağlar.',
    icon: <span className="text-lg">🛡️</span>,
  },
];

const collaborationFeatures = [
  {
    title: 'Gerçek zamanlı eş-yazım',
    description:
      'Takım arkadaşlarınızla aynı dosyada, aynı anda düzenleme yapın ve değişiklikleri canlı izleyin.',
    icon: <span className="text-lg">👥</span>,
  },
  {
    title: 'Akıllı bildirimler',
    description:
      'CI hataları, kod review yorumları ve üretkenlik önerileri için özelleştirilebilir bildirim akışı.',
    icon: <span className="text-lg">🔔</span>,
  },
  {
    title: 'Slack & Teams entegrasyonu',
    description:
      'AI özetleri, PR raporları ve görev atamalarını tercih ettiğiniz iletişim kanallarına taşıyın.',
    icon: <span className="text-lg">💬</span>,
  },
];

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 overflow-hidden">
        <MarketingHero />
        <FeatureGrid
          eyebrow="Üretkenlik Odaklı"
          title="Kod akışınızı hızlandıran özellikler"
          description="Kod yazma, test etme ve dağıtım süreçlerini tek bir masaüstü uygulamasında birleştiren AI destekli deneyim."
          features={productivityFeatures}
        />
        <FeatureGrid
          eyebrow="Takımda güç"
          title="İşbirliği ve iletişim yeniden tanımlanıyor"
          description="CodeXonX Desk, yalnızca kod yazmayı değil, ekip koordinasyonunu da AI ile optimize eder."
          features={collaborationFeatures}
          columns={2}
        />

        <section id="product-tour" className="relative overflow-hidden py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-background" />
          <div className="container px-4 md:px-6">
            <SectionHeader
              eyebrow="Ürün Turuna Bakın"
              title="Kod editörünüz, terminaliniz ve AI orkestrasyonunuz tek ekranda"
              description="Windsurf tarzı şerit görünümü ile kodlama, test ve görev yönetimini bir arada deneyimleyin."
              align="left"
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6 text-base text-muted-foreground">
                <p>
                  Masaüstü uygulamamız, repolarınızı içe aktarmanızla birlikte otomatik olarak
                  bağlam çıkarır; AI ajanları kod tabanını inceler ve proje durumunuzu birkaç
                  dakikada özetler.
                </p>
                <p>
                  Terminal entegrasyonuyla testleri çalıştırabilir, hataları AI’ye açıklatabilir ve
                  önerilen düzeltmeleri tek tıkla uygulayabilirsiniz. Her işlem günlüklenir, ekip
                  arkadaşlarınızla paylaşılabilir.
                </p>
                <p>
                  Uygulama içinde yerleşik görev panosu, AI tarafından önerilen sprint planlarını
                  incelemenize, düzenlemenize ve diğer ekip üyelerine atamanıza izin verir.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="#get-started"
                    className="rounded-full border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Demo talep et
                  </Link>
                  <Link
                    href="/docs"
                    className="text-sm font-semibold text-primary transition hover:text-primary/80"
                  >
                    Teknik dokümantasyonu incele →
                  </Link>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-4 shadow-xl shadow-primary/20">
                <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-background/70 px-5 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Aktif Workspace
                  </div>
                  <span className="text-xs text-muted-foreground">AI Sync: Açık</span>
                </div>
                <div className="relative mt-4 overflow-hidden rounded-2xl">
                  <Image
                    src="/images/product-tour.png"
                    alt="CodeXonX Desk ürün turu"
                    width={1280}
                    height={720}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="get-started" className="relative py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <div className="space-y-6">
                <SectionHeader
                  eyebrow="Erken erişim"
                  title="CodeXonX Desk beta listesine katılın"
                  description="Takımınızla birlikte masaüstü AI editörümüzü ilk deneyenlerden olun. Sınırlı sayıda davet göndereceğiz."
                  align="left"
                >
                  <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
                    <p>• Şirket içi pilot uygulama desteği</p>
                    <p>• Özel başarı metrikleri takibi ve raporlama</p>
                    <p>• AI ile kod review, test üretimi ve görev planlama</p>
                  </div>
                </SectionHeader>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-lg shadow-primary/20">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
