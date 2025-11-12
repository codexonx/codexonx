'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';

type LinkHref = LinkProps['href'];

type HeroStat = {
  key: string;
  label: string;
  value: string;
};

type HeroCta = {
  label: string;
  href: LinkHref;
};

export type HeroSectionProps = {
  betaTag: string;
  title: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  descriptions: string[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  bullets: string[];
  stats: HeroStat[];
};

export function HeroSection({
  betaTag,
  title,
  descriptions,
  primaryCta,
  secondaryCta,
  bullets,
  stats,
}: HeroSectionProps) {
  const [primaryDescription, secondaryDescription] = descriptions;

  return (
    <section className="relative overflow-hidden bg-aurora-surface bg-noise py-28">
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/20"
        aria-hidden
      />
      <div className="container relative grid gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-10">
          <span className="inline-flex w-auto items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary/85 backdrop-blur">
            {betaTag}
          </span>
          <div className="space-y-6">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block text-sm font-medium uppercase tracking-[0.35em] text-foreground/60 md:text-base">
                {title.prefix}
              </span>
              <span className="block bg-gradient-primary bg-clip-text text-5xl font-bold text-transparent sm:text-6xl md:text-7xl">
                {title.highlight}
              </span>
              <span className="mt-2 block text-3xl text-foreground/80 sm:text-4xl md:text-[2.65rem]">
                {title.suffix}
              </span>
            </h1>
            {primaryDescription ? (
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                {primaryDescription}
                {secondaryDescription ? (
                  <span className="mt-3 block">{secondaryDescription}</span>
                ) : null}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link href={primaryCta.href} className="w-full sm:w-auto">
              <GradientButton className="w-full gap-2 sm:w-auto" size="lg">
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </GradientButton>
            </Link>
            <Link href={secondaryCta.href} className="w-full sm:w-auto">
              <GradientButton outline className="w-full gap-2 sm:w-auto" size="lg">
                {secondaryCta.label}
              </GradientButton>
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ul className="grid gap-3 text-sm text-muted-foreground">
              {bullets.map((bullet, index) => (
                <li key={`${bullet}-${index}`}>
                  <GlassCard surface="muted" paddingClassName="p-md">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed text-foreground/90">{bullet}</span>
                    </div>
                  </GlassCard>
                </li>
              ))}
            </ul>
            <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map(stat => (
                <GlassCard key={stat.key} surface="muted" paddingClassName="p-md">
                  <dt className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-muted-foreground/80">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                    {stat.value}
                  </dd>
                </GlassCard>
              ))}
            </dl>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-3xl"
            aria-hidden
          />
          <GlassCard
            glow
            paddingClassName="p-0"
            className="relative min-h-[420px] overflow-hidden bg-card-gradient/90"
          >
            <div className="space-y-6 p-8">
              <header className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                    Run log panel
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">Auto-apply akışı</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Canlı
                </span>
              </header>
              <div className="space-y-4 text-sm text-muted-foreground">
                <GlassCard surface="muted" paddingClassName="p-md">
                  <div className="font-mono text-xs text-left text-foreground/85">
                    <ol className="space-y-2">
                      <li>&gt; auto-apply suggestions --merge</li>
                      <li>
                        &gt; deploy pipeline.prod <span className="text-primary">success</span>
                      </li>
                      <li>
                        &gt; notify #platform-team <span className="text-secondary">sent</span>
                      </li>
                    </ol>
                  </div>
                </GlassCard>
                <div className="grid gap-4 md:grid-cols-2">
                  <GlassCard surface="muted" paddingClassName="p-md">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
                      API anahtarları
                    </p>
                    <p className="mt-3 truncate font-mono text-xs text-foreground/80">
                      codexonx_live_ap-9d3f...5a2c
                    </p>
                    <span className="mt-3 inline-flex h-7 items-center justify-center rounded-full bg-primary/15 px-3 text-xs font-medium text-primary">
                      rota açık
                    </span>
                  </GlassCard>
                  <GlassCard surface="muted" paddingClassName="p-md">
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
                      Aktif workspace
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">Design Systems • 12 üye</p>
                    <span className="mt-3 inline-flex h-7 items-center justify-center rounded-full bg-secondary/15 px-3 text-xs font-medium text-secondary">
                      senkron
                    </span>
                  </GlassCard>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Auto-merge düzeyi</p>
                  <p className="mt-1 text-muted-foreground/80">
                    Riskli PR'lar için otomatik strateji
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-2 w-24 overflow-hidden rounded-full bg-white/10">
                    <div className="w-3/4 bg-gradient-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">%75</span>
                </div>
              </div>
              <GlassCard
                surface="muted"
                paddingClassName="p-md"
                className="absolute right-6 top-8 hidden w-56 border-white/15 text-xs text-muted-foreground shadow-primary-glow sm:block"
              >
                <p className="text-sm font-semibold text-foreground">Sprint özetleri</p>
                <p className="mt-2 leading-relaxed">
                  AI, tamamlanan görevlerden haftalık özet oluşturdu. Yeni eylem listesi hazır.
                </p>
                <span className="mt-3 inline-flex h-6 items-center justify-center rounded-full bg-foreground/10 px-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-foreground/80">
                  otomasyon
                </span>
              </GlassCard>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
