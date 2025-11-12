'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
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
  MessageSquare,
  Shield,
  Twitter,
} from 'lucide-react';

import { useI18n } from '@/contexts/i18n-context';
import { BrandMark } from '@/components/brand-mark';
import { FeatureCard } from '@/components/landing/feature-card';
import { GlassCard } from '@/components/landing/glass-card';
import { HeroSection } from '@/components/landing/hero-section';
import { GradientButton } from '@/components/landing/ui/gradient-button';
import { SectionHeading } from '@/components/landing/ui/section-heading';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';

const featureHighlights = [
  {
    icon: Laptop,
    titleKey: 'landing.featureHighlights.items.0.title',
    descriptionKey: 'landing.featureHighlights.items.0.description',
  },
  {
    icon: Lock,
    titleKey: 'landing.featureHighlights.items.1.title',
    descriptionKey: 'landing.featureHighlights.items.1.description',
  },
  {
    icon: BarChart,
    titleKey: 'landing.featureHighlights.items.2.title',
    descriptionKey: 'landing.featureHighlights.items.2.description',
  },
  {
    icon: Shield,
    titleKey: 'landing.featureHighlights.items.3.title',
    descriptionKey: 'landing.featureHighlights.items.3.description',
  },
];

const trustSignals = [
  {
    titleKey: 'landing.trust.items.0.title',
    descriptionKey: 'landing.trust.items.0.description',
  },
  {
    titleKey: 'landing.trust.items.1.title',
    descriptionKey: 'landing.trust.items.1.description',
  },
  {
    titleKey: 'landing.trust.items.2.title',
    descriptionKey: 'landing.trust.items.2.description',
  },
];

const testimonials = [
  {
    quoteKey: 'landing.testimonials.items.0.quote',
    nameKey: 'landing.testimonials.items.0.name',
    roleKey: 'landing.testimonials.items.0.role',
    companyKey: 'landing.testimonials.items.0.company',
    regionKey: 'landing.testimonials.items.0.region',
  },
  {
    quoteKey: 'landing.testimonials.items.1.quote',
    nameKey: 'landing.testimonials.items.1.name',
    roleKey: 'landing.testimonials.items.1.role',
    companyKey: 'landing.testimonials.items.1.company',
    regionKey: 'landing.testimonials.items.1.region',
  },
  {
    quoteKey: 'landing.testimonials.items.2.quote',
    nameKey: 'landing.testimonials.items.2.name',
    roleKey: 'landing.testimonials.items.2.role',
    companyKey: 'landing.testimonials.items.2.company',
    regionKey: 'landing.testimonials.items.2.region',
  },
];

const pricingFaq = [
  {
    questionKey: 'landing.pricing.faq.0.question',
    answerKey: 'landing.pricing.faq.0.answer',
  },
  {
    questionKey: 'landing.pricing.faq.1.question',
    answerKey: 'landing.pricing.faq.1.answer',
  },
  {
    questionKey: 'landing.pricing.faq.2.question',
    answerKey: 'landing.pricing.faq.2.answer',
  },
];

const platformStats = [
  { valueKey: 'landing.stats.items.0.value', labelKey: 'landing.stats.items.0.label' },
  { valueKey: 'landing.stats.items.1.value', labelKey: 'landing.stats.items.1.label' },
  { valueKey: 'landing.stats.items.2.value', labelKey: 'landing.stats.items.2.label' },
];

type IntegrationHighlight = {
  nameKey: string;
  descriptionKey: string;
  icon: ComponentType<{ className?: string }>;
};

const integrationHighlights: IntegrationHighlight[] = [
  {
    nameKey: 'landing.integrations.items.0.name',
    descriptionKey: 'landing.integrations.items.0.description',
    icon: GitBranch,
  },
  {
    nameKey: 'landing.integrations.items.1.name',
    descriptionKey: 'landing.integrations.items.1.description',
    icon: Cloud,
  },
  {
    nameKey: 'landing.integrations.items.2.name',
    descriptionKey: 'landing.integrations.items.2.description',
    icon: MessageSquare,
  },
];

const socialLinks = [
  {
    labelKey: 'landing.footer.social.github',
    href: 'https://github.com/codexonx',
    icon: Github,
  },
  {
    labelKey: 'landing.footer.social.twitter',
    href: 'https://twitter.com/codexonx',
    icon: Twitter,
  },
  {
    labelKey: 'landing.footer.social.linkedin',
    href: 'https://www.linkedin.com/company/codexonx',
    icon: Linkedin,
  },
  {
    labelKey: 'landing.footer.social.email',
    href: 'mailto:info@codexonx.com',
    icon: Mail,
  },
];

type CurrencyCode = 'TRY' | 'USD' | 'EUR';

const currencyMeta: Record<
  CurrencyCode,
  { label: string; symbol: string; locale: string; rate: number }
> = {
  TRY: {
    label: 'TRY',
    symbol: '₺',
    locale: 'tr-TR',
    rate: 1,
  },
  USD: {
    label: 'USD',
    symbol: '$',
    locale: 'en-US',
    rate: 0.031,
  },
  EUR: {
    label: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    rate: 0.028,
  },
};

const currencyNoteKeys: Record<CurrencyCode, string> = {
  TRY: 'landing.pricing.currencyNotes.try',
  USD: 'landing.pricing.currencyNotes.usd',
  EUR: 'landing.pricing.currencyNotes.eur',
};

const supportedCurrencies: CurrencyCode[] = ['TRY', 'USD', 'EUR'];
const ROI_TEAM_SIZE = 5;

const formatCurrencyAmount = (amount: number, currency: CurrencyCode) =>
  new Intl.NumberFormat(currencyMeta[currency].locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: amount >= 100 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatPlanPrice = (monthlyPriceTry: number | null, currency: CurrencyCode) => {
  if (monthlyPriceTry === null) {
    return 'İletişime Geçin';
  }

  if (monthlyPriceTry === 0) {
    return 'Ücretsiz';
  }

  const converted = monthlyPriceTry * currencyMeta[currency].rate;
  return formatCurrencyAmount(converted, currency);
};

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

const getPlanRoiCopy = (monthlyPriceTry: number | null, currency: CurrencyCode, t: TranslateFn) => {
  if (monthlyPriceTry === null) {
    return t('landing.pricing.roi.enterprise');
  }

  if (monthlyPriceTry === 0) {
    return t('landing.pricing.roi.free');
  }

  const teamCost = monthlyPriceTry * ROI_TEAM_SIZE * currencyMeta[currency].rate;
  const formattedCost = formatCurrencyAmount(teamCost, currency);
  return t('landing.pricing.roi.team', {
    teamSize: ROI_TEAM_SIZE,
    formattedCost,
  });
};

type PricingPlan = {
  nameKey: string;
  monthlyPriceTry: number | null;
  frequencyKey?: string;
  taglineKey: string;
  featureKeys: string[];
  ctaLabelKey: string;
  ctaHref: string;
  badgeClass: string;
  buttonClass: string;
  buttonVariant: 'default' | 'outline';
  highlighted: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    nameKey: 'landing.pricing.plans.starter.name',
    monthlyPriceTry: 0,
    frequencyKey: 'landing.pricing.plans.starter.frequency',
    taglineKey: 'landing.pricing.plans.starter.tagline',
    featureKeys: [
      'landing.pricing.plans.starter.features.0',
      'landing.pricing.plans.starter.features.1',
      'landing.pricing.plans.starter.features.2',
    ],
    ctaLabelKey: 'landing.pricing.plans.starter.cta',
    ctaHref: '/auth/register?plan=starter',
    badgeClass: 'bg-primary/20 text-primary',
    buttonClass: 'border-primary/40 bg-background text-primary hover:bg-primary/10',
    buttonVariant: 'outline',
    highlighted: false,
  },
  {
    nameKey: 'landing.pricing.plans.pro.name',
    monthlyPriceTry: 229,
    frequencyKey: 'landing.pricing.plans.pro.frequency',
    taglineKey: 'landing.pricing.plans.pro.tagline',
    featureKeys: [
      'landing.pricing.plans.pro.features.0',
      'landing.pricing.plans.pro.features.1',
      'landing.pricing.plans.pro.features.2',
      'landing.pricing.plans.pro.features.3',
    ],
    ctaLabelKey: 'landing.pricing.plans.pro.cta',
    ctaHref: '/auth/register?plan=pro',
    badgeClass: 'bg-accent/20 text-accent',
    buttonClass:
      'bg-gradient-to-r from-accent via-primary to-secondary text-primary-foreground shadow-primary-glow',
    buttonVariant: 'default',
    highlighted: true,
  },
  {
    nameKey: 'landing.pricing.plans.enterprise.name',
    monthlyPriceTry: null,
    frequencyKey: 'landing.pricing.plans.enterprise.frequency',
    taglineKey: 'landing.pricing.plans.enterprise.tagline',
    featureKeys: [
      'landing.pricing.plans.enterprise.features.0',
      'landing.pricing.plans.enterprise.features.1',
      'landing.pricing.plans.enterprise.features.2',
      'landing.pricing.plans.enterprise.features.3',
    ],
    ctaLabelKey: 'landing.pricing.plans.enterprise.cta',
    ctaHref: '/contact?topic=enterprise',
    badgeClass: 'bg-secondary/20 text-secondary',
    buttonClass: 'border-secondary/40 bg-background text-secondary hover:bg-secondary/10',
    buttonVariant: 'outline',
    highlighted: false,
  },
];

type ResolvedPricingPlan = PricingPlan & {
  name: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  frequency?: string;
};

type ResolvedFeatureHighlight = {
  key: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type ResolvedTrustSignal = {
  key: string;
  title: string;
  description: string;
};

type ResolvedTestimonial = {
  key: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  region: string;
};

type WorkflowStep = {
  badge: string;
  title: string;
  description: string;
};

type ResolvedPricingFaq = {
  key: string;
  question: string;
  answer: string;
};

type ResolvedPlatformStat = {
  key: string;
  value: string;
  label: string;
};

type ResolvedIntegrationHighlight = {
  key: string;
  icon: ComponentType<{ className?: string }>;
  name: string;
  description: string;
};

type LocaleHrefObject = {
  pathname: string;
  query?: Record<string, string>;
  hash?: string;
};

type LocaleHref = string | LocaleHrefObject;

const resolveCurrency = (currency?: string): CurrencyCode => {
  const upper = currency?.toUpperCase() as CurrencyCode | undefined;
  return upper && supportedCurrencies.includes(upper) ? upper : 'TRY';
};

export default function Home() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const selectedCurrency = resolveCurrency(searchParams.get('currency') ?? undefined);

  const buildLocaleHref = useCallback(
    (href: string): LocaleHref => {
      if (!locale) {
        return href;
      }

      if (/^(https?:|mailto:|tel:)/.test(href)) {
        return href;
      }

      if (href.startsWith('#')) {
        return href;
      }

      const [pathWithQuery, hash] = href.split('#');
      const [rawPath, queryString] = pathWithQuery.split('?');
      const path = rawPath || '/';
      const queryParams = new URLSearchParams(queryString ?? '');
      queryParams.set('lang', locale);
      const query = Object.fromEntries(queryParams.entries());
      const urlObject: LocaleHrefObject = {
        pathname: path,
        query,
      };
      if (hash) {
        urlObject.hash = hash;
      }

      return urlObject;
    },
    [locale]
  );

  const resolvedFeatureHighlights: ResolvedFeatureHighlight[] = featureHighlights.map(item => ({
    key: item.titleKey,
    icon: item.icon,
    title: t(item.titleKey),
    description: t(item.descriptionKey),
  }));

  const resolvedTrustSignals: ResolvedTrustSignal[] = trustSignals.map(item => ({
    key: item.titleKey,
    title: t(item.titleKey),
    description: t(item.descriptionKey),
  }));

  const resolvedTestimonials: ResolvedTestimonial[] = testimonials.map(item => ({
    key: item.quoteKey,
    quote: t(item.quoteKey),
    name: t(item.nameKey),
    role: t(item.roleKey),
    company: t(item.companyKey),
    region: t(item.regionKey),
  }));

  const resolvedPricingFaq: ResolvedPricingFaq[] = pricingFaq.map(item => ({
    key: item.questionKey,
    question: t(item.questionKey),
    answer: t(item.answerKey),
  }));

  const resolvedPlatformStats: ResolvedPlatformStat[] = platformStats.map(item => ({
    key: item.labelKey,
    value: t(item.valueKey),
    label: t(item.labelKey),
  }));

  const resolvedIntegrationHighlights: ResolvedIntegrationHighlight[] = integrationHighlights.map(
    item => ({
      key: item.nameKey,
      icon: item.icon,
      name: t(item.nameKey),
      description: t(item.descriptionKey),
    })
  );

  const resolvedPricingPlans: ResolvedPricingPlan[] = pricingPlans.map(plan => ({
    ...plan,
    name: t(plan.nameKey),
    tagline: t(plan.taglineKey),
    features: plan.featureKeys.map(featureKey => t(featureKey)),
    ctaLabel: t(plan.ctaLabelKey),
    frequency: plan.frequencyKey ? t(plan.frequencyKey) : undefined,
  }));

  const heroTitle = {
    prefix: t('landing.hero.title.prefix'),
    highlight: t('landing.hero.title.highlight'),
    suffix: t('landing.hero.title.suffix'),
  };

  const heroDescriptions = [
    t('landing.hero.description.primary'),
    t('landing.hero.description.secondary'),
  ];

  const heroBulletsRaw = t('landing.hero.bullets', { returnObjects: true });
  const heroBullets = Array.isArray(heroBulletsRaw)
    ? (heroBulletsRaw as string[])
    : [heroBulletsRaw as string];

  const workflowStepsRaw = t('landing.workflow.steps', { returnObjects: true });
  const workflowSteps = Array.isArray(workflowStepsRaw) ? (workflowStepsRaw as WorkflowStep[]) : [];

  const navLabels = {
    features: t('landing.nav.features'),
    ecosystem: t('landing.nav.ecosystem'),
    pricing: t('landing.nav.pricing'),
    contact: t('landing.nav.contact'),
  };

  const statsHeading = t('landing.stats.heading');
  const statsDescription = t('landing.stats.description');
  const featuresHeading = t('landing.featureHighlights.heading');
  const featuresLead = t('landing.featureHighlights.description.lead');
  const featuresDetail = t('landing.featureHighlights.description.detail');
  const featureCardCta = t('landing.featureHighlights.ctaLabel');
  const trustHeading = t('landing.trust.heading');
  const trustDescription = t('landing.trust.description');
  const integrationsHeading = t('landing.integrations.heading');
  const integrationsDescription = t('landing.integrations.description');
  const testimonialsHeading = t('landing.testimonials.heading');
  const testimonialsDescription = t('landing.testimonials.description');
  const pricingHeading = t('landing.pricing.heading');
  const pricingSubheading = t('landing.pricing.subheading');
  const currencyLabel = t('landing.pricing.currencyLabel');
  const currencyNote = t(currencyNoteKeys[selectedCurrency]);
  const currencyDisclaimer = t('landing.pricing.currencyDisclaimer');
  const pricingBadgeLabel = t('landing.pricing.mostPopularBadge');
  const heroBetaTag = t('landing.hero.betaTag');
  const heroPrimaryCta = t('landing.hero.primaryCta');
  const heroSecondaryCta = t('landing.hero.secondaryCta');
  const finalCtaTitle = t('landing.cta.title');
  const finalCtaDescription = t('landing.cta.description');
  const finalCtaButton = t('landing.cta.button');
  const finalCtaLink = t('landing.cta.linkLabel');
  const footerContent = {
    description: t('landing.footer.description'),
    tagline: t('landing.footer.tagline'),
    sections: {
      platform: {
        title: t('landing.footer.sections.platform.title'),
        links: {
          features: t('landing.footer.sections.platform.links.features'),
          pricing: t('landing.footer.sections.platform.links.pricing'),
          docs: t('landing.footer.sections.platform.links.docs'),
        },
      },
      company: {
        title: t('landing.footer.sections.company.title'),
        links: {
          about: t('landing.footer.sections.company.links.about'),
          blog: t('landing.footer.sections.company.links.blog'),
          careers: t('landing.footer.sections.company.links.careers'),
        },
      },
      contact: {
        title: t('landing.footer.sections.contact.title'),
        location: t('landing.footer.sections.contact.location'),
      },
    },
  };
  const currentYear = new Date().getFullYear();
  const footerCopyright = t('footer.allRightsReserved', { year: currentYear });
  const loginLabel = t('common.login');
  const registerLabel = t('common.register');
  const navigationLinks = [
    { key: 'features', label: navLabels.features, href: '#features' },
    { key: 'ecosystem', label: navLabels.ecosystem, href: '#ecosystem' },
    { key: 'pricing', label: navLabels.pricing, href: '#pricing' },
    { key: 'contact', label: navLabels.contact, href: '#contact' },
  ];
  const heroStats = resolvedPlatformStats.slice(0, 3);
  const pricingFaqItems = resolvedPricingFaq;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-secondary/10 opacity-90"
          aria-hidden
        />
        <div className="container relative flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link
              href={buildLocaleHref('/marketing')}
              aria-label="Codexonx ana sayfa"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-background/70 px-3 py-1 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <BrandMark />
            </Link>
            <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-background/60 px-1 py-1 text-sm font-medium md:flex">
              {navigationLinks.map(item => (
                <Link
                  key={item.key}
                  href={buildLocaleHref(item.href)}
                  className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground transition-all hover:text-foreground"
                >
                  <span>{item.label}</span>
                  <span className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href={buildLocaleHref('/auth/login')}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border border-transparent text-sm font-medium text-muted-foreground transition hover:border-white/10 hover:bg-background/60 hover:text-foreground"
              >
                {loginLabel}
              </Button>
            </Link>
            <Link href={buildLocaleHref('/auth/register')}>
              <Button
                size="sm"
                className="rounded-full border border-primary/40 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow transition hover:-translate-y-0.5"
              >
                {registerLabel}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection
          betaTag={heroBetaTag}
          title={heroTitle}
          descriptions={heroDescriptions}
          primaryCta={{ label: heroPrimaryCta, href: buildLocaleHref('/auth/register') }}
          secondaryCta={{ label: heroSecondaryCta, href: buildLocaleHref('/contact?topic=demo') }}
          bullets={heroBullets}
          stats={heroStats.map(stat => ({ key: stat.key, label: stat.label, value: stat.value }))}
        />

        <section
          id="stats"
          className="relative overflow-hidden py-16"
          aria-labelledby="platform-stats-heading"
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-background via-background-strong/35 to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <SectionHeading
              align="center"
              className="mx-auto"
              title={statsHeading}
              lead={statsDescription}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {resolvedPlatformStats.map(stat => (
                <GlassCard
                  key={stat.key}
                  surface="muted"
                  paddingClassName="p-6"
                  className="text-center"
                >
                  <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-3 block text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
                    {stat.label}
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="relative overflow-hidden py-28">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <SectionHeading
              eyebrow={featuresDetail}
              title={featuresHeading}
              lead={featuresLead}
              className="mx-auto"
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {resolvedFeatureHighlights.map(feature => (
                <FeatureCard
                  key={feature.key}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  ctaLabel={featureCardCta}
                />
              ))}
            </div>
            <section className="mt-24" aria-labelledby="workflow-heading">
              <SectionHeading
                id="workflow-heading"
                eyebrow={t('landing.workflow.description')}
                title={t('landing.workflow.heading')}
                align="left"
              />
              <div className="mt-12 grid gap-6 lg:grid-cols-4">
                {workflowSteps.slice(0, 4).map((step, index) => (
                  <GlassCard key={step.title ?? index} surface="muted" paddingClassName="p-6">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary">
                      {step.badge}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section
          id="ecosystem"
          className="relative overflow-hidden border-y border-border/40 bg-background/80 py-28"
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background/90 to-background"
            aria-hidden
          />
          <div className="absolute inset-0 bg-grid-slate-900/[0.04]" aria-hidden />
          <div className="relative container px-4 md:px-6">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="space-y-10">
                <SectionHeading
                  align="left"
                  title={trustHeading}
                  lead={trustDescription}
                  className="max-w-xl"
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  {resolvedTrustSignals.map(signal => (
                    <GlassCard key={signal.key} surface="muted" paddingClassName="p-6">
                      <h3 className="text-lg font-semibold text-foreground">{signal.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {signal.description}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>
              <div className="space-y-10">
                <SectionHeading
                  align="left"
                  title={integrationsHeading}
                  lead={integrationsDescription}
                  className="max-w-md"
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  {resolvedIntegrationHighlights.map(item => (
                    <GlassCard
                      key={item.key}
                      surface="muted"
                      paddingClassName="p-6"
                      className="flex items-start gap-4"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-primary-glow">
                        <item.icon className="h-6 w-6" />
                      </span>
                      <div className="space-y-2">
                        <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="relative overflow-hidden py-28">
          <div
            className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background/90 to-background"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,209,255,0.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(152,92,255,0.2),transparent_60%)] opacity-70"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <SectionHeading
              id="testimonials-heading"
              title={testimonialsHeading}
              lead={testimonialsDescription}
              className="mx-auto"
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolvedTestimonials.map((item, index) => (
                <div key={item.key} className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}>
                  <GlassCard
                    surface="muted"
                    paddingClassName="p-6"
                    className="flex h-full flex-col justify-between gap-6"
                    glow={index === 0}
                  >
                    <div className="space-y-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary shadow-primary-glow">
                        <MessageSquare className="h-5 w-5" />
                      </span>
                      <blockquote className="text-base leading-relaxed text-muted-foreground">
                        “{item.quote}”
                      </blockquote>
                    </div>
                    <figcaption className="space-y-1 text-sm">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-muted-foreground">{item.role}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                        {item.company} • {item.region}
                      </p>
                    </figcaption>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative overflow-hidden py-28">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/12 via-transparent to-background"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary/20 via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                align="left"
                eyebrow={currencyLabel}
                title={pricingHeading}
                lead={pricingSubheading}
                className="max-w-2xl"
              />
              <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:items-end">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-background/70 p-1">
                  {supportedCurrencies.map(code => (
                    <Link
                      key={code}
                      href={buildLocaleHref(`/?currency=${code}#pricing`)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        code === selectedCurrency
                          ? 'bg-gradient-primary text-primary-foreground shadow-halo'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {code}
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/80">{currencyNote}</p>
              </div>
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="grid gap-6 lg:grid-cols-3">
                {resolvedPricingPlans.map(plan => (
                  <GlassCard
                    key={plan.nameKey}
                    surface={plan.highlighted ? 'primary' : 'muted'}
                    glow={plan.highlighted}
                    paddingClassName={null}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col gap-6 p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                          {plan.frequency ? (
                            <p className="text-sm text-muted-foreground">{plan.frequency}</p>
                          ) : null}
                        </div>
                        {plan.highlighted ? (
                          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-primary-foreground">
                            {pricingBadgeLabel}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {plan.tagline}
                      </p>
                      <div className="space-y-2">
                        <span className="text-3xl font-semibold text-foreground">
                          {formatPlanPrice(plan.monthlyPriceTry, selectedCurrency)}
                        </span>
                        <p className="text-xs text-muted-foreground/80">
                          {getPlanRoiCopy(plan.monthlyPriceTry, selectedCurrency, t)}
                        </p>
                      </div>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {plan.features.map(feature => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="mt-1 h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto">
                        <Link href={buildLocaleHref(plan.ctaHref)}>
                          <GradientButton size="lg" outline={!plan.highlighted} className="w-full">
                            {plan.ctaLabel}
                          </GradientButton>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
              <div className="space-y-6">
                <GlassCard surface="muted" paddingClassName="p-6" className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Sık Sorulan Sorular</h3>
                  <ul className="space-y-4 text-left text-sm text-muted-foreground">
                    {pricingFaqItems.map(item => (
                      <li key={item.key}>
                        <GlassCard surface="muted" paddingClassName="p-4">
                          <p className="text-sm font-semibold text-foreground">{item.question}</p>
                          <p className="mt-2 leading-relaxed">{item.answer}</p>
                        </GlassCard>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
                <GlassCard
                  surface="muted"
                  paddingClassName="p-6"
                  className="space-y-3 text-sm text-muted-foreground"
                >
                  <p className="font-medium text-foreground">Kurumsal plan mı arıyorsunuz?</p>

                  <p className="leading-relaxed">
                    {[
                      'Enterprise ekibimiz, özel güvenlik gereksinimleri ve',
                      "SLA'ler için size rehberlik eder.",
                    ].join(' ')}
                  </p>
                  <Link
                    href={buildLocaleHref('/contact?topic=enterprise')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                  >
                    Satış ekibiyle iletişime geçin
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </GlassCard>
              </div>
            </div>
            <p className="mt-12 text-center text-xs text-muted-foreground">{currencyDisclaimer}</p>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden py-28">
          <div
            className="absolute inset-0 bg-gradient-to-b from-secondary/12 via-transparent to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
              <GlassCard surface="muted" paddingClassName="p-8" className="space-y-6">
                <SectionHeading align="left" title={finalCtaTitle} lead={finalCtaDescription} />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={buildLocaleHref('/contact?topic=enterprise')}
                    className="w-full sm:w-auto"
                  >
                    <GradientButton size="lg" className="w-full gap-2">
                      {finalCtaButton}
                      <Code className="h-4 w-4" />
                    </GradientButton>
                  </Link>
                  <Link
                    href={buildLocaleHref('/docs')}
                    className="w-full text-center text-sm font-semibold text-primary transition hover:text-primary/80 sm:w-auto sm:self-center"
                  >
                    {finalCtaLink}
                  </Link>
                </div>
              </GlassCard>
              <GlassCard
                surface="muted"
                paddingClassName="p-6"
                className="space-y-3 text-sm text-muted-foreground"
              >
                <p className="font-medium text-foreground">
                  {footerContent.sections.contact.title}
                </p>
                <p>info@codexonx.com</p>
                <p>+90 212 555 12 34</p>
                <p className="pt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                  {footerContent.sections.contact.location}
                </p>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/95 py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <BrandMark className="justify-start" />
              <p className="text-sm text-muted-foreground">{footerContent.description}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80">
                {footerContent.tagline}
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                {footerContent.sections.platform.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={buildLocaleHref('#features')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.platform.links.features}
                  </Link>
                </li>
                <li>
                  <Link
                    href={buildLocaleHref('#pricing')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.platform.links.pricing}
                  </Link>
                </li>
                <li>
                  <Link
                    href={buildLocaleHref('/docs')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.platform.links.docs}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                {footerContent.sections.company.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={buildLocaleHref('/about')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.company.links.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={buildLocaleHref('/blog')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.company.links.blog}
                  </Link>
                </li>
                <li>
                  <Link
                    href={buildLocaleHref('/careers')}
                    className="transition-colors hover:text-foreground"
                  >
                    {footerContent.sections.company.links.careers}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                {footerContent.sections.contact.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:info@codexonx.com"
                    className="transition-colors hover:text-foreground"
                  >
                    info@codexonx.com
                  </a>
                </li>
                <li>
                  <a href="tel:+902125551234" className="transition-colors hover:text-foreground">
                    +90 212 555 12 34
                  </a>
                </li>
                <li>
                  <p>{footerContent.sections.contact.location}</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-8 text-center text-sm text-muted-foreground md:flex-row md:text-left">
            <p>{footerCopyright}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t(item.labelKey)}
                  title={t(item.labelKey)}
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
