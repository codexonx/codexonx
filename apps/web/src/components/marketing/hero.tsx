import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionHeader, SectionEyebrow } from './section-header';
import { HeroMockup } from './hero-mockup';

const heroStats = [
  { label: 'Aktif Workspace', value: '320+' },
  { label: 'Yapay Zeka Destekli Task', value: '85K' },
  { label: 'Memnuniyet Skoru', value: '4.9/5' },
];

const heroHighlights = [
  'Doğal dil ile tam kod akışı üretimi',
  'Takımınızla aynı anda düzenleme ve görev atama',
  'Kurumsal uyumluluk ve veri gizliliği odaklı mimari',
];

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-y-0 left-1/2 -z-10 hidden w-[50vw] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl lg:block" />
      <div className="container px-4 pb-20 pt-24 md:px-6 md:pb-28 md:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
          <div className="flex flex-col gap-8 text-left">
            <SectionEyebrow className="self-start bg-white/10 text-white/90 ring-1 ring-inset ring-white/20">
              Yeni Nesil AI Kod Editörü
            </SectionEyebrow>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-[3.25rem] md:leading-[1.1]">
              Kod editörünüzü değil,{' '}
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                üretkenliğinizi
              </span>{' '}
              yükseltin
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              CodeXonX Desk; masaüstü uygulama deneyimini AI planlama, otomatik test yazma ve ekip
              işbirliği ile birleştirir. Her sprint, daha az toplantı ve daha fazla teslimatla
              sonuçlanır.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-slate-200 sm:text-base">
              {heroHighlights.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="text-xs font-semibold">✓</span>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button size="lg" className="px-8" asChild>
                <Link href="#get-started">Erken erişime katıl</Link>
              </Button>
              <Button variant="link" size="lg" className="text-slate-200 hover:text-white" asChild>
                <Link href="#product-tour">Ürünü keşfet →</Link>
              </Button>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {heroStats.map(stat => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <dt className="text-xs font-medium uppercase tracking-[0.25em] text-slate-300">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative flex justify-center">
            <HeroMockup />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-slate-950" />
    </section>
  );
}
