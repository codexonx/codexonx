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
              href={buildLocaleHref('/')}
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
        <section className="relative overflow-hidden py-28">
          <div className="absolute inset-0 bg-radial-ocean opacity-80" aria-hidden />
          <div className="absolute inset-0 bg-hero-grid opacity-30" aria-hidden />
          <div
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative container grid gap-16 px-4 md:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary/90">
                {heroBetaTag}
              </span>
              <div className="space-y-6">
                <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  {heroTitle.prefix}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                    {heroTitle.highlight}
                  </span>{' '}
                  {heroTitle.suffix}
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                  {heroDescriptions[0]}
                  <span className="mt-3 block">{heroDescriptions[1]}</span>
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href={buildLocaleHref('/auth/register')} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full gap-2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-6 text-primary-foreground shadow-primary-glow transition-transform hover:-translate-y-1"
                  >
                    {heroPrimaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={buildLocaleHref('/contact?topic=demo')} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 rounded-full border-primary/30 bg-background/70 px-6 text-primary transition hover:border-primary/50 hover:bg-primary/10"
                  >
                    {heroSecondaryCta}
                  </Button>
                </Link>
              </div>
              <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {heroBullets.map(bullet => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-background/40 p-4 backdrop-blur"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
              <dl className="grid gap-4 sm:grid-cols-3">
                {heroStats.map(stat => (
                  <div
                    key={stat.key}
                    className="rounded-2xl border border-white/10 bg-background/60 p-4 shadow-lg shadow-primary/10 backdrop-blur"
                  >
                    <dt className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground/80">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-x-12 -inset-y-14 rounded-3xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 blur-3xl"
                aria-hidden
              />
              <div className="relative space-y-6 rounded-3xl border border-white/10 bg-background/85 p-8 shadow-2xl shadow-primary/20 backdrop-blur">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                      Aktivite Paneli
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      Canlı Proje Akışı
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Gerçek
                    zamanlı
                  </span>
                </div>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="rounded-2xl border border-white/5 bg-background/70 p-4 font-mono text-xs">
                    <p>
                      &gt; agent commit APM optimizasyonu <span className="text-primary">✓</span>
                    </p>
                    <p className="mt-2">
                      &gt; pipeline deploy prod <span className="text-secondary">•</span>
                    </p>
                    <p className="mt-2">
                      &gt; integration tests <span className="text-accent">passed</span>
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-background/70 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
                        API Anahtarları
                      </p>
                      <p className="mt-3 truncate font-mono text-xs text-foreground/80">
                        codexonx_live_ap-9d3f...5a2c
                      </p>
                      <span className="mt-3 inline-flex h-7 items-center justify-center rounded-full bg-primary/15 px-3 text-xs font-medium text-primary">
                        rota açık
                      </span>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-background/70 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
                        Aktif Workspace
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">Design Systems • 12 üye</p>
                      <span className="mt-3 inline-flex h-7 items-center justify-center rounded-full bg-secondary/15 px-3 text-xs font-medium text-secondary">
                        senkron
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-background/70 p-4 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Auto-merge düzeyi</p>
                    <p className="mt-1 text-muted-foreground/80">
                      Riskli PR'lar için otomatik strateji
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-24 overflow-hidden rounded-full bg-muted/40">
                      <div className="w-3/4 bg-gradient-to-r from-primary via-accent to-secondary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">%75</span>
                  </div>
                </div>
                <div className="absolute -right-10 top-10 hidden w-48 rounded-2xl border border-white/10 bg-background/95 p-4 text-xs text-muted-foreground shadow-xl shadow-primary/20 sm:block">
                  <p className="text-sm font-semibold text-foreground">Sprint Özetleri</p>
                  <p className="mt-2 leading-relaxed">
                    AI, tamamlanan görevlerden haftalık özet oluşturdu. Yeni eylem listesi hazır.
                  </p>
                  <span className="mt-3 inline-flex h-6 items-center justify-center rounded-full bg-foreground/10 px-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-foreground/80">
                    Otomasyon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="stats"
          className="relative overflow-hidden py-12 sm:py-14"
          aria-labelledby="platform-stats-heading"
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-background via-background-strong/30 to-background"
            aria-hidden
          />
          <div className="relative container px-4 md:px-6">
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <h2
                id="platform-stats-heading"
                className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70"
              >
                {statsHeading}
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">{statsDescription}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resolvedPlatformStats.map(stat => (
                <div
                  key={stat.key}
                  className="rounded-2xl border border-white/10 bg-background/70 px-6 py-6 text-center shadow-lg backdrop-blur"
                >
                  <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                {featuresHeading}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">{featuresLead}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                {featuresDetail}
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          </div>
        </section>

        <section
          id="ecosystem"
          className="relative overflow-hidden border-y border-border/40 bg-background/80 py-24"
        >
          <div className="absolute inset-0 bg-grid-slate-900/[0.04]" aria-hidden />
          <div className="relative container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {trustHeading}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">{trustDescription}</p>
                <div className="grid gap-4">
                  {resolvedTrustSignals.map(signal => (
                    <div
                      key={signal.key}
                      className="rounded-2xl border border-white/10 bg-background/70 p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-foreground">{signal.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{signal.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground">{integrationsHeading}</h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {integrationsDescription}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {resolvedIntegrationHighlights.map(item => (
                    <div
                      key={item.key}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-background/70 p-5"
                    >
                      <item.icon className="h-10 w-10 text-primary" />
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                {testimonialsHeading}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                {testimonialsDescription}
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resolvedTestimonials.map(item => (
                <figure
                  key={item.key}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-background/70 p-6"
                >
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-6 space-y-1 text-sm">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">{item.role}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
                      {item.company} • {item.region}
                    </p>
                  </figcaption>
                </figure>
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
            <div className="flex flex-col gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground/70">
                  {currencyLabel}
                </span>
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {pricingHeading}
                </h2>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {pricingSubheading}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:items-end">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/70 p-1">
                  {supportedCurrencies.map(code => (
                    <Link
                      key={code}
                      href={buildLocaleHref(`/?currency=${code}#pricing`)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        code === selectedCurrency
                          ? 'bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow'
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
                  <div
                    key={plan.nameKey}
                    className={`flex h-full flex-col justify-between rounded-3xl border bg-background/85 p-6 shadow-xl backdrop-blur transition ${
                      plan.highlighted
                        ? 'border-accent/40 shadow-primary-glow shadow-primary/30'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                          {plan.frequency ? (
                            <p className="text-sm text-muted-foreground">{plan.frequency}</p>
                          ) : null}
                        </div>
                        {plan.highlighted ? (
                          <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
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
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                      <Link href={buildLocaleHref(plan.ctaHref)}>
                        <Button
                          size="lg"
                          variant={plan.buttonVariant}
                          className={`w-full rounded-full ${plan.buttonClass}`}
                        >
                          {plan.ctaLabel}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-background/85 p-6 shadow-lg backdrop-blur">
                  <h3 className="text-lg font-semibold text-foreground">Sık Sorulan Sorular</h3>
                  <ul className="mt-4 space-y-4 text-left text-sm text-muted-foreground">
                    {pricingFaqItems.map(item => (
                      <li
                        key={item.key}
                        className="rounded-2xl border border-white/5 bg-background/60 p-4"
                      >
                        <p className="text-sm font-semibold text-foreground">{item.question}</p>
                        <p className="mt-2 leading-relaxed">{item.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-background/85 p-6 text-left text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Kurumsal plan mı arıyorsunuz?</p>
                  <p className="mt-2 leading-relaxed">
                    Enterprise ekibimiz, özel güvenlik gereksinimleri ve SLA'ler için size rehberlik
                    eder.
                  </p>
                  <Link
                    href={buildLocaleHref('/contact?topic=enterprise')}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                  >
                    Satış ekibiyle iletişime geçin
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-10 text-center text-xs text-muted-foreground">{currencyDisclaimer}</p>
          </div>
        </section>

        <section id="contact" className="py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 rounded-3xl border border-white/10 bg-background/80 p-10 shadow-lg backdrop-blur md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {finalCtaTitle}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">{finalCtaDescription}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={buildLocaleHref('/contact?topic=enterprise')}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      className="w-full gap-2 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow hover:-translate-y-1"
                      size="lg"
                    >
                      {finalCtaButton}
                      <Code className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href={buildLocaleHref('/docs')}
                    className="w-full text-center text-sm font-semibold text-primary transition hover:text-primary/80 sm:w-auto sm:self-center"
                  >
                    {finalCtaLink}
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/70 p-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {footerContent.sections.contact.title}
                </p>
                <p className="mt-2">info@codexonx.com</p>
                <p className="mt-1">+90 212 555 12 34</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
                  {footerContent.sections.contact.location}
                </p>
              </div>
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
