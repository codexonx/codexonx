import { Sparkles } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';

type Study = {
  company: string;
  headline: string;
  summary: string;
  outcome: string;
};

const studies: Study[] = [
  {
    company: 'Orbit Labs',
    headline: 'Lovable > Codexonx geçişi 12 günde tamamlandı',
    summary:
      'Fintech ürün ekibi, Lovable prototiplerini Codexonx pipeline’ına taşıyarak MVP lansmanını erkene çekti.',
    outcome: '%65 daha hızlı MVP teslimi',
  },
  {
    company: 'NeuralWorks',
    headline: 'Ajan destekli kod review süreci',
    summary:
      'AI ajanları guardrail’lerle eşleyip kod review döngüsünü 4 kata kadar hızlandırdılar.',
    outcome: 'Pazara çıkış süresi %40 kısaldı',
  },
  {
    company: 'Atlas Industries',
    headline: 'Enterprise compliant platform',
    summary:
      'SAML/SCIM entegrasyonları ve prompt checklist’i ile güvenlik denetimlerini otomatikleştirdiler.',
    outcome: 'Uyumluluk denetim süresi 3 haftadan 6 güne',
  },
];

export function CaseStudiesSection() {
  return (
    <section id="stories" className="relative overflow-hidden py-28">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,107,44,0.12),_transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[120%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        aria-hidden
      />
      <div className="relative container px-4 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Başarı Hikayeleri"
          title="Lovable ruhunu koruyarak sonuç üreten takımlar"
          lead="Codexonx turuncusuyla güçlenen ekiplerin shipping hızında nasıl sıçrama yaptığını görün."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {studies.map(study => (
            <GlassCard key={study.company} paddingClassName="p-7" surface="muted">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
                  <Sparkles className="h-3.5 w-3.5" />
                  {study.company}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{study.headline}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                  {study.outcome}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudiesSection;
