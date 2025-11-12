import { useState } from 'react';
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
};

const proPlan: PricingPlan = {
  name: 'Pro',
  monthly: '$89',
  yearly: '$890',
  description: 'Orta ölçekli ekipler için canlı kod yürütme, ekip işbirliği ve guardrail setleri.',
  perks: proPerks,
  highlighted: true,
  cta: 'Proya geç',
};

const enterprisePlan: PricingPlan = {
  name: 'Enterprise',
  monthly: 'Özel',
  yearly: 'Özel',
  description: 'Gelişmiş güvenlik, SSO/SCIM, özel on-prem entegrasyonlar ve özel destek.',
  perks: enterprisePerks,
  cta: 'Satışla görüş',
};

const plans: PricingPlan[] = [starterPlan, proPlan, enterprisePlan];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="relative overflow-hidden py-28">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(255,138,71,0.16),_transparent_65%)]"
        aria-hidden
      />
      <div className="relative container px-4 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Fiyatlandırma"
          title="Lovable vibe’ıyla Codexonx güvencesi"
          lead="Her planda AI ajan altyapısı, canlı pipeline ve turuncu temalı stüdyo deneyimi bulunur."
        />

        <div className="mt-10 flex flex-col items-center gap-4 text-sm font-semibold text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-1 text-xs">
            <button
              type="button"
              className={`rounded-full px-4 py-1 transition ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground shadow-primary-glow'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Aylık
            </button>
            <button
              type="button"
              className={`rounded-full px-4 py-1 transition ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground shadow-primary-glow'
                  : 'text-muted-foreground'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yıllık{' '}
              <span className="ml-1 text-[0.7rem] uppercase tracking-[0.25em] text-primary/90">
                -2 ay
              </span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground/80">
            Abonelikte Lovable’dan taşıma indirimi için{' '}
            <span className="inline-flex text-primary">codexonx-migrate</span> kodunu kullanın.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <GlassCard
              key={plan.name}
              surface={plan.highlighted ? 'primary' : 'muted'}
              glow={plan.highlighted}
              paddingClassName="p-8"
              className="flex h-full flex-col gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  {plan.highlighted ? (
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/90">
                      En çok seçilen
                    </span>
                  ) : null}
                </div>
                <p className="text-3xl font-semibold text-primary">
                  {billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                  {plan.monthly !== 'Özel' ? (
                    <span className="ml-2 text-xs font-medium text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  ) : null}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                {plan.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <GradientButton outline={!plan.highlighted} className="w-full">
                {plan.cta}
              </GradientButton>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingPage;
