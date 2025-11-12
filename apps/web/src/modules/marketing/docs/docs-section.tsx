import Link from 'next/link';

import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';

const guides = [
  {
    title: 'Lovable’dan Codexonx’a geçiş',
    description: 'Turuncu temalı yeni stüdyoya adaptasyon adımlarını öğrenin.',
    href: '/docs/getting-started',
    badge: 'Yeni',
  },
  {
    title: 'Ajan orkestrasyonu',
    description: 'Ajan görev kuyruğu, guardrail ve review döngülerine hakim olun.',
    href: '/docs/ai-agent-playbook',
    badge: 'Rehber',
  },
  {
    title: 'Pipeline blueprint',
    description: 'Docker tabanlı run pipeline ve Supabase entegrasyonunu yapılandırın.',
    href: '/docs/deployment',
    badge: 'Teknik',
  },
];

export function DocsSection() {
  return (
    <section id="resources" className="relative overflow-hidden py-24">
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-background via-background/80 to-black"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div className="container relative flex flex-col gap-12 px-5 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Kaynaklar"
          title="Codexonx stüdyosunu yakından tanıyın"
          lead="Lovable deneyiminden ilham alan dokümantasyon, şablonlar ve videolarla ekibinizi hızlandırın."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {guides.map(guide => (
            <GlassCard
              key={guide.title}
              paddingClassName="p-7"
              glow
              surface="muted"
              className="group relative overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.28),_transparent_65%)]" />
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.18),_transparent_60%)]" />
              </span>
              <div className="relative flex h-full flex-col gap-5 text-left">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
                  {guide.badge}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{guide.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{guide.description}</p>
                </div>
                <Link
                  href={guide.href}
                  className="relative inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary/80"
                >
                  Rehberi aç
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DocsSection;
