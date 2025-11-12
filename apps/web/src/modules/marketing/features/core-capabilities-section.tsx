'use client';

import { motion } from 'framer-motion';
import { Cpu, GitBranch, Shield, Sparkles } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';
import { SectionHeading } from '@/components/landing/ui/section-heading';

type Capability = {
  title: string;
  description: string;
  icon: typeof Sparkles;
  highlights: string[];
};

const capabilities: Capability[] = [
  {
    title: 'Codexonx AI Studio',
    description:
      'Workspace bağlamını bilen ajanlarla refactor, PR yazımı ve deploy sürecini tek panelden orkestre et.',
    icon: Sparkles,
    highlights: ['Ajan görev kuyruğu', 'Otomatik PR özeti', 'Anlık diff önizleme'],
  },
  {
    title: 'Canlı Kod İşletme',
    description:
      'Docker tabanlı pipeline ile lint, test ve build adımlarını guardrail setleriyle güvenceye al.',
    icon: Cpu,
    highlights: ['Pipeline şablonları', 'Özel environment değişkenleri', 'Rollback logları'],
  },
  {
    title: 'Blueprint Workflow',
    description:
      'Lovable tarzı checklist ve workspace ritmiyle ekibi hızlandır; prompt orchestrator ile adımları otomatikleştir.',
    icon: GitBranch,
    highlights: ['Onay akışları', 'AI öneri kalite metriği', 'Takım içi not paylaşımı'],
  },
  {
    title: 'Guardrail Güvenliği',
    description:
      'Prod ortamını koruyan kalite ve güvenlik kontrollerini glow pipeline ile görünür kıl.',
    icon: Shield,
    highlights: ['Deploy stop-checkleri', 'Pano bildirimleri', 'Audit log entegrasyonu'],
  },
];

const capabilityStats = [
  { label: 'Pipeline başarı oranı', value: '98%', helper: '+12%' },
  { label: 'AI ajan hız kazanımı', value: '4.3x', helper: 'takım bazlı' },
  { label: 'Checklist tamamlama', value: '92%', helper: 'guardrail ile' },
];

export function CoreCapabilitiesSection() {
  return (
    <motion.section
      id="product"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden py-28"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-background via-background/80 to-black"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.24),_transparent_62%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-12 bottom-[-40%] -z-10 h-[420px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.18),_transparent_70%)] blur-[140px]"
        aria-hidden
      />

      <div className="container relative flex flex-col gap-16 px-5 md:px-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <SectionHeading
            eyebrow="Özellikler"
            title="Lovable deneyimini Codexonx turuncusunda işlet"
            lead="Studio shell, ajan orchestrator ve guardrail pipeline tek komutta hizalanır; ekip ritmini kaybetmeden ship edin."
            align="center"
          />
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/65">
            <span className="rounded-full border border-white/15 px-4 py-2">Realtime editör</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Guardrail deploy</span>
            <span className="rounded-full border border-white/15 px-4 py-2">
              Supabase entegrasyonu
            </span>
          </div>
          <GradientButton className="px-8" size="lg">
            Ürün turunu başlat
          </GradientButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-[repeat(auto-fit,_minmax(260px,1fr))]">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 + index * 0.05 }}
            >
              <GlassCard
                surface="muted"
                glow
                paddingClassName="p-7"
                className="group relative h-full overflow-hidden border-white/12 bg-white/[0.04] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/5"
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.32),_transparent_65%)]" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.22),_transparent_70%)]" />
                </span>
                <div className="relative flex flex-col gap-4 text-left text-sm text-muted-foreground">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="leading-relaxed text-white/70">{item.description}</p>
                  </div>
                  <ul className="space-y-2 text-[0.95rem] text-white/65">
                    {item.highlights.map(highlight => (
                      <li key={highlight} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur md:grid-cols-3">
          {capabilityStats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl font-semibold text-white">{stat.value}</span>
              <span className="text-xs uppercase tracking-[0.28em] text-primary/70">
                {stat.label}
              </span>
              <span className="text-sm font-medium text-white/60">{stat.helper}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default CoreCapabilitiesSection;
