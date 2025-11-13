'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';
import { SectionHeading } from '@/components/landing/ui/section-heading';

export type PricingPlan = {
  name: string;
  monthly: string;
  yearly: string;
  description: string;
  perks: string[];
  highlighted?: boolean;
  cta: string;
  badge?: string;
};

const starterPerks = ['2 workspace', 'Günde 200 ajan isteği', 'Prompt checklist temel şablonlar'];

const proPerks = [
  'Sınırsız workspace',
  'Günde 2k ajan isteği',
  'CI/CD pipeline presetleri',
  'Çoklu ortam yönetimi',
];

const enterprisePerks = [
  'VPC kurulum desteği',
  'Özel ajan guardrail eğitimi',
  'SLA & 7/24 destek',
  'Takım içi enablement programı',
];

const starterPlan: PricingPlan = {
  name: 'Starter',
  monthly: '$29',
  yearly: '$290',
  description: 'Freelancer ve küçük ekipler için AI destekli geliştirme altyapısı.',
  perks: starterPerks,
  cta: 'Başlat',
  badge: 'Lovable’dan gelenler için',
};

const proPlan: PricingPlan = {
  name: 'Pro',
  monthly: '$89',
  yearly: '$890',
  description: 'Orta ölçekli ekipler için canlı kod yürütme, ekip işbirliği ve guardrail setleri.',
  perks: proPerks,
  highlighted: true,
  cta: 'Proya geç',
  badge: 'En çok seçilen',
};

const enterprisePlan: PricingPlan = {
  name: 'Enterprise',
  monthly: 'Özel',
  yearly: 'Özel',
  description: 'Gelişmiş güvenlik, SSO/SCIM, özel on-prem entegrasyonlar ve özel destek.',
  perks: enterprisePerks,
  cta: 'Satışla görüş',
  badge: 'Kurumsal',
};

const plans: PricingPlan[] = [starterPlan, proPlan, enterprisePlan];

const pricingStats = [
  { label: 'Lovable’dan taşıyan ekip', value: '280+' },
  { label: 'Ortalama ROI', value: '4.6x' },
  { label: 'Guardrail coverage', value: '%92' },
];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <motion.section
      id="pricing"
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
        className="absolute inset-x-0 top-[-28%] -z-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-12 bottom-[-38%] -z-10 h-[380px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.2),_transparent_70%)] blur-[150px]"
        aria-hidden
      />

      <div className="container relative flex flex-col gap-14 px-5 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Fiyatlandırma"
          title="Lovable vibe’ıyla Codexonx stüdyosu"
          lead="AI ajan altyapısı, canlı pipeline ve turuncu stüdyo deneyimi her planın temelinde."
        />

        <div className="flex flex-col items-center gap-5 text-sm font-semibold text-white/70">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1 text-xs shadow-halo">
            <button
              type="button"
              className={`rounded-full px-5 py-1.5 transition ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-[0_0_22px_rgba(255,107,44,0.55)]'
                  : 'text-white/60'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Aylık
            </button>
            <button
              type="button"
              className={`rounded-full px-5 py-1.5 transition ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-[0_0_22px_rgba(255,107,44,0.55)]'
                  : 'text-white/60'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yıllık
              <span className="ml-2 text-[0.65rem] uppercase tracking-[0.32em] text-primary/85">
                2 ay hediye
              </span>
            </button>
          </div>
          <p className="flex flex-wrap items-center justify-center gap-1 text-xs text-white/60">
            <span>Lovable’dan taşınan ekipler için</span>
            <span className="inline-flex items-center text-primary">codexonx-migrate</span>
            <span>kodunu girerek %15 indirim alın.</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 * index }}
            >
              <GlassCard
                surface={plan.highlighted ? 'primary' : 'muted'}
                glow={plan.highlighted}
                paddingClassName="p-8"
                className="group relative flex h-full flex-col gap-7 overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.28),_transparent_65%)]" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.18),_transparent_60%)]" />
                </span>
                <div className="relative flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                      <p className="text-sm font-medium text-white/65">{plan.description}</p>
                    </div>
                    {plan.badge ? (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/85">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-end gap-2 text-white">
                    <span className="text-4xl font-semibold">
                      {billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                    </span>
                    {plan.monthly !== 'Özel' ? (
                      <span className="text-xs font-medium text-white/60">
                        /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                      </span>
                    ) : null}
                  </div>
                </div>

                <ul className="relative flex-1 space-y-3 text-sm text-white/70">
                  {plan.perks.map(perk => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors duration-300 hover:border-primary/35 hover:bg-primary/10"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed text-white/80">{perk}</span>
                    </li>
                  ))}
                </ul>

                <GradientButton outline={!plan.highlighted} className="relative w-full">
                  {plan.cta}
                </GradientButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-8 text-center text-white backdrop-blur md:grid-cols-3">
          {pricingStats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-semibold">{stat.value}</span>
              <span className="text-xs uppercase tracking-[0.28em] text-primary/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default PricingPage;
