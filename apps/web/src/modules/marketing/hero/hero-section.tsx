import Link from 'next/link';
import { ArrowRight, Flame, Play, Sparkles, Terminal } from 'lucide-react';

import { GradientButton } from '@/components/landing/ui/gradient-button';

const NAV_LINKS = [
  { label: 'Ürün', href: '#product' },
  { label: 'Akışlar', href: '#workflows' },
  { label: 'Fiyatlandırma', href: '#pricing' },
  { label: 'Kaynaklar', href: '#resources' },
];

const PROMPT_PRESETS = [
  'React bileşenlerini sadeleştir',
  'Supabase trigger yaz',
  'Dockerfile optimizasyonu',
];

const HERO_METRICS = [
  { label: 'Prod deploys', value: '12.4k', helper: '+36%' },
  { label: 'Pipeline süresi', value: '32sn', helper: '-24%' },
  { label: 'AI commits', value: '48k', helper: '+71%' },
];

const FAVORITE_ITEMS = [
  {
    title: 'Lovable’dan Codexonx’e migrasyon wizard’ı',
    tone: 'Akış',
    status: 'Canlı',
  },
  {
    title: 'Supabase realtime dashboard otomasyonu',
    tone: 'Şablon',
    status: 'Beta',
  },
  {
    title: 'Prompt orchestrator ile CI guardrail seti',
    tone: 'Blueprint',
    status: 'Trend',
  },
];

function FeatureTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/85 backdrop-blur">
      {children}
    </span>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-primary via-primary/80 to-white bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function MetricCard({ label, value, helper }: (typeof HERO_METRICS)[number]) {
  return (
    <div className="group flex flex-col rounded-3xl border border-white/12 bg-black/55 p-5 text-left transition hover:border-primary/50 hover:shadow-[0_35px_80px_-45px_rgba(255,107,44,0.55)]">
      <span className="text-[0.65rem] uppercase tracking-[0.32em] text-muted-foreground/65">
        {label}
      </span>
      <span className="mt-3 text-3xl font-semibold text-white">{value}</span>
      <span className="mt-1 text-sm font-medium text-primary">{helper}</span>
    </div>
  );
}

function FavoriteRow({ title, tone, status }: (typeof FAVORITE_ITEMS)[number]) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left transition hover:border-primary/40">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">{tone}</span>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-primary/90">
        {status}
      </span>
    </div>
  );
}

function PromptConsole() {
  return (
    <div className="relative mt-16 w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/12 bg-black/65 px-8 py-10 shadow-[0_65px_140px_-50px_rgba(255,107,44,0.55)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -left-32 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(255,107,44,0.45)_0%,_rgba(255,107,44,0)_65%)] blur-3xl" />
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75">
          <Terminal className="h-3.5 w-3.5" /> Komut paleti
        </span>
        <span className="text-xs text-muted-foreground/80">
          Studio shell • Realtime orchestrator
        </span>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {PROMPT_PRESETS.map(preset => (
          <button
            key={preset}
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[0.75rem] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {preset}
          </button>
        ))}
      </div>

      <label className="mt-8 block space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground/70">
          Codexonx ajanına ne istediğini anlat
        </span>
        <div className="rounded-3xl border border-white/12 bg-white/5 p-6">
          <textarea
            defaultValue={`Lovable hero deneyimini Codexonx turuncu/beyaz/siyah temasıyla yeniden kur. Navbar, prompt konsolu ve favoriler paneli için yeni bileşen hiyerarşisi öner.`}
            rows={4}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-muted-foreground/70"
          />
        </div>
      </label>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-medium">
            <Flame className="h-3.5 w-3.5 text-primary" />
            Guardrails aktif
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Ajan senkron
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            aria-label="Demo videoyu oynat"
          >
            <Play className="h-4 w-4" />
          </button>
          <GradientButton size="lg" className="px-8">
            Gönder
            <ArrowRight className="ml-2 h-4 w-4" />
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

function FavoritesPanel() {
  return (
    <div className="mt-16 w-full max-w-5xl rounded-[2.25rem] border border-white/10 bg-black/55 p-6 shadow-[0_55px_120px_-60px_rgba(255,107,44,0.45)]">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Codexonx’in Sevimlisi</h3>
          <p className="text-sm text-muted-foreground/80">
            Lovable projelerini taşıyan sıcak şablonlar
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <button className="rounded-full border border-white/12 bg-white/5 px-4 py-2 transition hover:border-primary/40 hover:text-primary">
            Problemler ⌄
          </button>
          <button className="rounded-full border border-white/12 bg-white/5 px-4 py-2 transition hover:border-primary/40 hover:text-primary">
            Son 30 gün ⌄
          </button>
          <Link
            href="/library"
            className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-semibold text-primary transition hover:border-primary/60 hover:text-primary/80"
          >
            Tümünü gör
          </Link>
        </div>
      </header>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {FAVORITE_ITEMS.map(item => (
          <FavoriteRow key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-32 pt-16">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,_rgba(255,107,44,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(255,138,71,0.18),_transparent_60%),_linear-gradient(180deg,#040404_0%,#08090d_60%,#050509_100%)]" />
      <div className="absolute inset-0 -z-20 bg-noise opacity-[var(--token-noise-opacity,0.08)]" />
      <div className="absolute -left-24 top-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(255,107,44,0.55)_0%,_rgba(255,107,44,0)_70%)] blur-3xl" />
      <div className="absolute -right-20 bottom-[-25%] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(255,138,71,0.45)_0%,_rgba(255,138,71,0)_70%)] blur-3xl" />

      <div className="container relative px-4 md:px-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/50 px-6 py-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-base font-semibold text-primary">
              CX
            </span>
            <div className="space-y-1">
              <p className="text-[0.6rem] uppercase tracking-[0.32em] text-primary/70">
                Codexonx Studio
              </p>
              <p className="text-xs text-muted-foreground">AI native ürün geliştirme platformu</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground md:flex-1 md:justify-center">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-muted-foreground transition hover:text-white">
              Giriş yap
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 font-semibold text-primary transition hover:border-primary/60 hover:text-primary/80"
            >
              Studio’ya gir
            </Link>
          </div>
        </nav>

        <div className="mx-auto mt-18 flex max-w-3xl flex-col items-center text-center">
          <div className="mt-16 flex flex-col items-center gap-6">
            <FeatureTag>AI Native Delivery</FeatureTag>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
              <Highlight>Lovable deneyimini</Highlight> turuncu evrenimizde yeniden kurgula
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              <span className="block">
                Codexonx Studio, Lovable’nın hızını turuncu/siyah/beyaz marka diliyle birleştirir.
              </span>
              <span className="block">Ajan destekli pipeline’lar ile tek tık deploy yapın.</span>
              <span className="block">
                Supabase entegrasyonu sayesinde dakikalar içinde prod’a ship edin.
              </span>
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/app/new" className="w-full sm:w-auto">
                <GradientButton size="lg" className="w-full sm:w-auto">
                  Yeni workspace başlat
                </GradientButton>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-primary/40 hover:text-primary/80"
              >
                Canlı demoyu izleyin
              </Link>
            </div>
          </div>

          <PromptConsole />

          <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
            {HERO_METRICS.map(metric => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <FavoritesPanel />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
