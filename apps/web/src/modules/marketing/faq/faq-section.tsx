import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';
import { SectionHeading } from '@/components/landing/ui/section-heading';

const faqItems = [
  {
    question: 'Lovable workspace’imi Codexonx’e taşırken ne kadar sürede canlıya çıkabilirim?',
    answer:
      'Migration atölyemiz Supabase + Next.js + Vercel entegrasyonlarını hazırlar. Ortalama 2 sprint içinde pipeline guardrail’leri ve ajana özel checklist’ler devreye alınır.',
  },
  {
    question: 'Ajan guardrailleri hangi aşamalarda devreye giriyor?',
    answer:
      'Kod review, test çalıştırma, deploy ve post-release ölçümlerinde otomatik tetiklenen guardrail setleri bulunur. Her adımda turuncu/siyah stüdyo arayüzünde log akışını takip edebilirsiniz.',
  },
  {
    question: 'Pro plan ile enterprise plan arasındaki temel fark nedir?',
    answer:
      'Pro plan Lovable’dan gelen ürün ekiplerine sınırsız workspace ve 2k günlük ajan isteği sunar. Enterprise plan ise özel VPC, SSO/SCIM, özel güvenlik gereksinimleri ve enablement programını içerir.',
  },
  {
    question: 'Takımım Lovable hissini kaybetmeden Codexonx’e adapte olabilir mi?',
    answer:
      'Codexonx Studio turuncu/siyah Lovable temasını korur. Onboarding checklist’leri, prompt preset’leri ve workspace-aware ajanlar ekiplerin alışık olduğu ritmi bozmadan geçiş yapmasına yardımcı olur.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-28">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,107,44,0.12),_transparent_65%)]"
        aria-hidden
      />
      <div className="container relative grid gap-12 px-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="SSS"
            title="Lovable’dan Codexonx’e geçişte merak edilenler"
            lead="Turuncu stüdyo temposunu kaybetmeden AI destekli guardrail ve pipeline otomasyonuna nasıl geçtiğimizi keşfedin."
          />
          <GlassCard surface="muted" paddingClassName="p-8" className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              <Sparkles className="h-3.5 w-3.5" />
              Lovable özel teklif
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              30 dakikalık göç atölyesi + pipeline sağlık raporu
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Workspace bağlamınızı analiz edip ajan guardrail’lerini ilk sprintte devreye alıyoruz.
              Supabase, Vercel ve GitHub entegrasyonları Lovable ritminizle uyumlu biçimde
              hazırlanıyor.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/lovable-migration">
                <GradientButton size="sm" className="min-w-[180px]">
                  Göç atölyesini planla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </GradientButton>
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white hover:text-white"
              >
                Enterprise demo iste
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          {faqItems.map(item => (
            <GlassCard key={item.question} surface="muted" paddingClassName="p-5">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                  <span className="text-sm font-semibold text-foreground">{item.question}</span>
                  <span className="mt-0.5 text-primary transition group-open:-rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-open:animate-in group-open:fade-in">
                  {item.answer}
                </p>
              </details>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
