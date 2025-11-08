import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { ComponentType } from 'react';
import {
  ArrowRight,
  BarChart2 as BarChart,
  Check,
  Cloud,
  Code,
  GitBranch,
  Github,
  Laptop,
  Linkedin,
  Lock,
  Mail,
  Shield,
  MessageSquare,
  Twitter,
} from 'lucide-react';

import { BrandMark } from '@/components/brand-mark';
import { FeatureCard } from '@/components/landing/feature-card';

const featureHighlights = [
  {
    icon: Laptop,
    title: 'Modern Dashboard',
    description:
      'Ekip akışınızı, aktif projeleri ve entegrasyonları tek bakışta yönetin. Canlı widget’lar ve kişiselleştirilebilir panellerle tam kontrol.',
  },
  {
    icon: Lock,
    title: 'Güvenli API Anahtarları',
    description:
      'Zero-trust politikaları, anlık anahtar yenileme ve ayrıntılı erişim kayıtlarıyla güvenliği varsayılan olarak sağlayın.',
  },
  {
    icon: BarChart,
    title: 'Derin Analitik',
    description:
      'AI destekli raporlar, trend tahminleri ve kişisel metrik setleri ile karar alma süreçlerinizi hızlandırın.',
  },
  {
    icon: Shield,
    title: 'Kurumsal Güvenlik',
    description:
      'SOC 2 uyumluluğu, şifrelenmiş veri depolama ve role dayalı izin yönetimi ile kurum standartlarını karşılayın.',
  },
];

const platformStats = [
  { label: 'Aktif Workspace', value: '450+' },
  { label: 'Aylık Satır Önerisi', value: '35M+' },
  { label: 'Ortalama Deploy Süresi', value: '<12 dk' },
];

type IntegrationHighlight = {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const integrationHighlights: IntegrationHighlight[] = [
  {
    name: 'GitOps & Repo Senkronu',
    description:
      'GitHub ve GitLab repolarınızı otomatik tarar, akıllı PR yorumları ve güvenli anahtar rotasyonu sağlar.',
    icon: GitBranch,
  },
  {
    name: 'Bulut Dağıtım Akışı',
    description:
      'Vercel ve AWS dağıtımlarınızı izleyerek her commit sonrası canlı pipeline sağlığını gösterir.',
    icon: Cloud,
  },
  {
    name: 'Takım Bildirimleri',
    description:
      'Slack entegrasyonu ile kritik olaylar, onay akışları ve AI özetleri ekiplerle aynı anda paylaşılır.',
    icon: MessageSquare,
  },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/codexonx', icon: Github },
  { label: 'Twitter', href: 'https://twitter.com/codexonx', icon: Twitter },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/codexonx', icon: Linkedin },
  { label: 'E-posta', href: 'mailto:info@codexonx.com', icon: Mail },
];

type PricingPlan = {
  name: string;
  price: string;
  frequency: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  badgeClass: string;
  buttonClass: string;
  buttonVariant: 'default' | 'outline';
  highlighted: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '₺0',
    frequency: '/ay',
    tagline: 'Bireysel geliştiriciler için ideal başlangıç.',
    features: ['2 workspace', 'Sınırsız API anahtarı', '7 günlük geçmiş kayıtları'],
    ctaLabel: 'Ücretsiz Başla',
    ctaHref: '/auth/register?plan=starter',
    badgeClass: 'bg-primary/20 text-primary',
    buttonClass: 'border-primary/40 bg-background text-primary hover:bg-primary/10',
    buttonVariant: 'outline',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₺229',
    frequency: '/ay',
    tagline: 'Küçük ekipler için otomasyon ve analitik.',
    features: [
      '10 workspace',
      'Otomatik rotasyon',
      '30 günlük geçmiş kayıtları',
      'Öncelikli destek',
    ],
    ctaLabel: 'Planı Seç',
    ctaHref: '/auth/register?plan=pro',
    badgeClass: 'bg-accent/20 text-accent',
    buttonClass:
      'bg-gradient-to-r from-accent via-primary to-secondary text-primary-foreground shadow-primary-glow',
    buttonVariant: 'default',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'İletişime Geçin',
    frequency: '',
    tagline: 'Gelişmiş güvenlik, özel SLA ve yerinde entegrasyon.',
    features: [
      'Sınırsız workspace',
      'Özel dağıtım seçenekleri',
      'SOC 2 / ISO 27001',
      '24/7 teknik ekip',
    ],
    ctaLabel: 'Ekiple Görüş',
    ctaHref: '/contact?topic=enterprise',
    badgeClass: 'bg-secondary/20 text-secondary',
    buttonClass: 'border-secondary/40 bg-background text-secondary hover:bg-secondary/10',
    buttonVariant: 'outline',
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container sticky top-0 z-40 bg-background">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link
              href="/"
              aria-label="Codexonx ana sayfa"
              className="transition-opacity hover:opacity-90"
            >
              <BrandMark />
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="#features"
                className="text-sm font-medium transition-colors hover:text-primary link-underline"
              >
                Özellikler
              </Link>
              <Link
                href="#ecosystem"
                className="text-sm font-medium transition-colors hover:text-primary link-underline"
              >
                Entegrasyonlar
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium transition-colors hover:text-primary link-underline"
              >
                Fiyatlandırma
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium transition-colors hover:text-primary link-underline"
              >
                İletişim
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Giriş
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-radial-ocean" aria-hidden />
          <div className="absolute inset-0 bg-hero-grid opacity-40" aria-hidden />
          <div className="relative container px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary glow-ring animate-pulse-glow">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  AI Destekli Kod Deneyimine Hazır mısın?
                </span>
                <div className="space-y-4">
                  <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Kod üretiminde{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                      sonsuz hız
                    </span>{' '}
                    ve kontrol
                  </h1>
                  <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg lg:mx-0">
                    <span>
                      Codexonx, ekiplerinizin projeleri tek bir yerden yönetmesine ve güvenli API
                      anahtarları oluşturmasına yardımcı olur.
                    </span>
                    <span className="mt-2 block">
                      Canlı analitiklerle her adımı izlemenizi sağlayan modern bir geliştirici
                      platformudur.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                  <Link href="/auth/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow transition-base hover:-translate-y-1"
                    >
                      Hemen Başla
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-primary/40 bg-background/60 backdrop-blur text-primary hover:bg-primary/10"
                    >
                      Özelliklere Göz At
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-start">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    7/24 çalışan AI kod editörü
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Zero-trust güvenlik mimarisi
                  </div>
                </div>
              </div>
              <div className="glass-panel mx-auto w-full max-w-xl space-y-6 rounded-3xl border border-white/10 p-6 md:p-8 animate-float-slow">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Canlı Proje Akışı
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Gerçek zamanlı
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-background/40 p-4 shadow-inner">
                    <p className="font-mono text-xs text-muted-foreground">
                      &gt; agent commit APM optimizasyonu <span className="text-primary">✓</span>
                      <br />
                      &gt; pipeline deploy prod <span className="text-secondary">•</span>
                      <br />
                      &gt; integration tests <span className="text-accent">passed</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="space-y-2 rounded-xl border border-white/10 bg-background/40 p-4">
                      <span className="font-medium text-foreground">API Anahtarları</span>
                      <p className="font-mono text-xs truncate text-foreground/80">
                        codexonx_live_ap-9d3f...5a2c
                      </p>
                      <span className="inline-flex h-6 w-16 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                        rota açık
                      </span>
                    </div>
                    <div className="space-y-2 rounded-xl border border-white/10 bg-background/40 p-4">
                      <span className="font-medium text-foreground">Aktif Workspace</span>
                      <p className="text-xs text-muted-foreground">Design Systems • 12 üye</p>
                      <span className="inline-flex h-6 w-16 items-center justify-center rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                        senkron
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Auto-merge düzeyi</span>
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-20 overflow-hidden rounded-full bg-muted/40">
                      <div className="w-3/4 bg-gradient-to-r from-primary via-accent to-secondary" />
                    </div>
                    <span className="font-medium text-foreground">%75</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="stats"
          className="relative overflow-hidden py-12 sm:py-14"
          aria-labelledby="platform-stats-heading"
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-background via-background-strong/30 to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <h2
                id="platform-stats-heading"
                className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70"
              >
                Platform Metriği
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Codexonx ile ekipleriniz üretkenliği artırırken dağıtım sürelerini azaltır.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformStats.map(stat => (
                <div
                  key={stat.label}
                  className="glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-background/70 px-6 py-6 text-center shadow-lg backdrop-blur hover-glow"
                >
                  <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="features" className="relative overflow-hidden py-20">
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-background-strong to-background-muted"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Öne Çıkan Özellikler
              </h2>
              <p className="text-muted-foreground">
                <span>Yeni nesil geliştirici platformu.</span>
                <span className="block">
                  Planlamadan dağıtıma, kod üretiminden gözetim süreçlerine kadar uçtan uca
                  yetkinlik sağlar.
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureHighlights.map(feature => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>
        <section id="ecosystem" className="relative overflow-hidden py-16">
          <div
            className="absolute inset-0 bg-gradient-to-br from-background via-background-strong/40 to-background-muted"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-3 text-center">
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Ekosistem & Entegrasyon
              </h2>
              <p className="text-muted-foreground">
                Geliştirme zincirinizdeki her adımı tek panelde bağlayın. Codexonx, koddan canlıya
                uzanan süreci otomatik takip eder.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {integrationHighlights.map(partner => (
                <div
                  key={partner.name}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/60 p-6 shadow-lg backdrop-blur hover-glow"
                >
                  <div className="relative flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-primary-glow transition-base group-hover:bg-primary/15 group-hover:scale-105">
                      <partner.icon className="h-6 w-6" />
                    </span>
                    <div className="space-y-2 text-left">
                      <h3 className="text-lg font-semibold text-foreground">{partner.name}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="pricing" className="relative overflow-hidden py-20">
          <div
            className="absolute inset-0 bg-gradient-to-b from-background-muted/40 via-background/80 to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Fiyatlandırma Planları
              </h2>
              <p className="text-muted-foreground">
                Esnek planlarımızla ihtiyaçlarınızı ölçeklendirin. Her plan Codexonx AI editörünü,
                güvenli API yönetimini ve workspace senkronizasyonunu içerir.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.05fr_1fr]">
              {pricingPlans.map(plan => (
                <div
                  key={plan.name}
                  className={`hover-glow relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/60 p-6 shadow-lg backdrop-blur ${
                    plan.highlighted ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  {plan.highlighted ? (
                    <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-accent to-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-primary-glow">
                      En Popüler
                    </span>
                  ) : null}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.tagline}</p>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.frequency ? (
                      <span className="text-sm text-muted-foreground">{plan.frequency}</span>
                    ) : null}
                  </div>
                  <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${plan.badgeClass}`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaHref} className="mt-8">
                    <Button
                      className={`w-full ${plan.buttonClass} transition-base hover:-translate-y-1`}
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {plan.ctaLabel}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden py-20">
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/15 via-accent/10 to-secondary/15"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="glass-panel flex flex-col gap-6 rounded-3xl border border-white/10 bg-background/70 p-8 text-center shadow-primary-glow backdrop-blur md:flex-row md:items-center md:justify-between md:p-12 md:text-left hover-lift">
              <div className="space-y-3 md:max-w-xl">
                <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  Takımınızın AI akışını hızlandırın
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Codexonx, güvenli workspace yönetimi, otomatik pipeline gözlemi ve AI destekli kod
                  önerileri ile ürün teslim sürenizi kısaltır. Kurumsal entegrasyonlar için uzman
                  ekibimiz hazır.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                <Link href="/contact?topic=demo" className="w-full md:w-auto">
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow transition-base hover:-translate-y-1"
                    size="lg"
                  >
                    Canlı Demo Talep Et
                    <Code className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs" className="text-sm text-muted-foreground link-underline">
                  Dokümantasyonda ilerleyişe göz atın →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="py-6 md:py-12 border-t bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <BrandMark className="justify-start" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Workspace senkronizasyonu, güvenli pipeline yönetimi ve AI destekli kod üretimi ile
                ekiplerinizi geleceğe hazırlayın.
              </p>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80">
                İstanbul • Global ürün ekipleri için
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="#features" className="transition-colors hover:text-primary">
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="transition-colors hover:text-primary">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="transition-colors hover:text-primary">
                    Dokümantasyon
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Şirket</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/about" className="transition-colors hover:text-primary">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="transition-colors hover:text-primary">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">İletişim</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="mailto:info@codexonx.com"
                    className="transition-colors hover:text-primary"
                  >
                    info@codexonx.com
                  </a>
                </li>
                <li>
                  <a href="tel:+902125551234" className="transition-colors hover:text-primary">
                    +90 212 555 12 34
                  </a>
                </li>
                <li>
                  <p>İstanbul, Türkiye</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400 md:flex-row md:text-left">
            <p>&copy; {new Date().getFullYear()} Codexonx. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
