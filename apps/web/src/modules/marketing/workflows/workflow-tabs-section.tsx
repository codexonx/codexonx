'use client';

import { motion } from 'framer-motion';

import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Workflow = {
  id: string;
  label: string;
  summary: string;
  steps: string[];
  highlight: string;
  badge: string;
};

const workflows: Workflow[] = [
  {
    id: 'startup',
    label: 'Startup launch',
    summary: 'MVP’leri haftalar değil günler içinde ship edin.',
    steps: [
      'Template’ten workspace oluştur',
      'Prompt checklist’i tamamla',
      'AI ajanına refactor iste',
      'Run pipeline tetikle ve deploy et',
    ],
    highlight: 'Codexonx ile launch süresi %45 kısaldı',
    badge: 'Launch modu',
  },
  {
    id: 'saas',
    label: 'SaaS scale',
    summary: 'Canlı ortamda feature flag yönetimi ve veri entegrasyonları.',
    steps: [
      'Database migration scriptini yazdır',
      'Supabase trigger’ı test et',
      'CI pipeline’da kalite guardrail’leri çalıştır',
      'Release notlarını otomatik oluştur',
    ],
    highlight: 'Aksaklık sonrası rollback süresi 8 dk’ya indi',
    badge: 'Scale modu',
  },
  {
    id: 'internal-tools',
    label: 'Internal tooling',
    summary: 'Operasyon ekipleri için hızlı low-code dashboardlar.',
    steps: [
      'Figma’dan layout import et',
      'Component kütüphanesini eşitle',
      'Prompt checklist ile güvenlik kontrolleri yap',
      'Vercel preview linkini paylaş',
    ],
    highlight: 'Operasyon ekibi haftada 12 saat kazandı',
    badge: 'Ops modu',
  },
];

export function WorkflowTabsSection() {
  return (
    <motion.section
      id="workflows"
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
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_62%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-10 bottom-[-38%] -z-10 h-[420px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.18),_transparent_68%)] blur-[140px]"
        aria-hidden
      />

      <div className="container relative flex flex-col gap-14 px-5 md:px-10">
        <SectionHeading
          eyebrow="Akışlar"
          title="Lovable ritmini Codexonx pipeline’ında sürdür"
          lead="Takım senaryolarına göre ajan görevleri, guardrail setleri ve deploy checklist’leri tek shell içinde hizalanır."
        />

        <GlassCard
          className="border-white/12 bg-white/[0.06] backdrop-blur"
          paddingClassName="p-0"
          surface="default"
        >
          <Tabs
            defaultValue={workflows[0].id}
            className="grid gap-0 md:grid-cols-[280px_minmax(0,1fr)]"
          >
            <TabsList className="flex flex-col gap-3 rounded-l-3xl rounded-r-none bg-transparent p-6 text-left">
              {workflows.map(flow => (
                <TabsTrigger
                  key={flow.id}
                  value={flow.id}
                  className="group flex w-full flex-col items-start gap-1 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold transition-all duration-300 data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
                >
                  <span className="text-[0.65rem] uppercase tracking-[0.32em] text-white/55 group-data-[state=active]:text-primary/80">
                    {flow.badge}
                  </span>
                  <span>{flow.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {workflows.map((flow, index) => (
              <TabsContent
                key={flow.id}
                value={flow.id}
                className="relative flex flex-col gap-7 border-l border-white/10 bg-black/45 p-8 text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 * index }}
                  className="space-y-6"
                >
                  <p className="max-w-xl text-sm leading-relaxed text-white/70">{flow.summary}</p>
                  <ul className="space-y-3 text-sm text-white/70">
                    {flow.steps.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors duration-300 hover:border-primary/35 hover:bg-primary/10"
                      >
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-[0.75rem] font-semibold text-primary">
                          {stepIndex + 1}
                        </span>
                        <span className="leading-relaxed text-white/80">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-primary/40 bg-primary/15 px-4 py-4 text-sm font-semibold text-primary">
                    {flow.highlight}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </GlassCard>
      </div>
    </motion.section>
  );
}

export default WorkflowTabsSection;
