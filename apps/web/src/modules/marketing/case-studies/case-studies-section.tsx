'use client';

import { motion } from 'framer-motion';
import { Cpu, Shield, Sparkles } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';

type Study = {
  company: string;
  headline: string;
  summary: string;
  outcome: string;
  metrics: string[];
  icon: typeof Sparkles;
};

const studies: Study[] = [
  {
    company: 'Orbit Labs',
    headline: 'Lovable > Codexonx geçişi 12 günde tamamlandı',
    summary:
      'Fintech ürün ekibi Lovable prototiplerini Codexonx pipeline’ına taşıdı; ajan destekli refactor ile QA döngüleri yarıya indi.',
    outcome: '%65 daha hızlı MVP teslimi',
    metrics: ['12 günde migration', 'QA süresi %48 azaldı', 'Pipeline otomasyonu 24/7'],
    icon: Sparkles,
  },
  {
    company: 'NeuralWorks',
    headline: 'Ajan destekli kod review süreci',
    summary:
      'Lovable checklist ritmi korunarak Codexonx ajanları guardrail setleriyle eşlendi; güvenlik ve review döngüsü otomatize edildi.',
    outcome: 'Pazara çıkış süresi %40 kısaldı',
    metrics: ['4x hızlı review', 'Guardrail coverage %92', 'Incident sayısı -%37'],
    icon: Cpu,
  },
  {
    company: 'Atlas Industries',
    headline: 'Enterprise compliant platform',
    summary:
      'SAML/SCIM entegrasyonları ve prompt checklist’iyle denetim raporları otomatik üretildi; global rollout turuncu stüdyoda tamamlandı.',
    outcome: 'Uyumluluk denetimi 3 haftadan 6 güne',
    metrics: ['SOC2 readiness 6 günde', 'Onboarding 3 günde', 'Audit bulguları -%54'],
    icon: Shield,
  },
];

export function CaseStudiesSection() {
  return (
    <motion.section
      id="stories"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden py-28"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-black via-background to-black"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-[-32%] -z-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.24),_transparent_62%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-10 bottom-[-36%] -z-10 h-[360px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.2),_transparent_72%)] blur-[140px]"
        aria-hidden
      />

      <div className="container relative flex flex-col gap-14 px-5 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Başarı Hikayeleri"
          title="Lovable ruhunu Codexonx turuncusuyla büyüten takımlar"
          lead="Migration, guardrail ve enterprise rollout senaryolarında Codexonx Studio ile hızlanan gerçek ekipler."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study, index) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 * index }}
              className={index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''}
            >
              <GlassCard
                paddingClassName="p-7"
                surface="muted"
                glow={index === 0}
                className="group relative h-full overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
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
                    <study.icon className="h-3.5 w-3.5" />
                    {study.company}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                      {study.headline}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70 md:text-base">
                      {study.summary}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/35 bg-primary/15 px-4 py-3 text-sm font-semibold text-primary">
                    {study.outcome}
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    {study.metrics.map(metric => (
                      <li
                        key={metric}
                        className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.28em] text-white/65"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default CaseStudiesSection;
