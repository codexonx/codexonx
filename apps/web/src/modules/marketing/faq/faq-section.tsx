'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden py-28"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-background via-background/90 to-black"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-[-26%] -z-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-10 bottom-[-34%] -z-10 h-[360px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.2),_transparent_72%)] blur-[150px]"
        aria-hidden
      />

      <div className="container relative grid gap-14 px-5 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-8"
        >
          <SectionHeading
            eyebrow="SSS"
            title="Lovable’dan Codexonx’e geçişte merak edilenler"
            lead="Turuncu stüdyo temposunu kaybetmeden AI guardrail ve pipeline otomasyonuna nasıl geçtiğimizi keşfedin."
          />
          <GlassCard
            surface="muted"
            glow
            paddingClassName="p-8"
            className="group relative overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.28),_transparent_65%)]" />
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.18),_transparent_60%)]" />
            </span>
            <div className="relative space-y-5 text-left text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
                <Sparkles className="h-3.5 w-3.5" />
                Lovable özel teklif
              </div>
              <h3 className="text-xl font-semibold md:text-2xl">
                30 dakikalık göç atölyesi + pipeline sağlık raporu
              </h3>
              <p className="text-sm leading-relaxed text-white/75 md:text-base">
                Workspace bağlamınızı analiz edip ajan guardrail’lerini ilk sprintte devreye
                alıyoruz. Supabase, Vercel ve GitHub entegrasyonları Lovable ritminizle uyumlu
                biçimde hazırlanıyor.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/lovable-migration">
                  <GradientButton size="sm" className="min-w-[190px]">
                    Göç atölyesini planla
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </Link>
                <Link
                  href="/book-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors duration-300 hover:border-white hover:text-white"
                >
                  Enterprise demo iste
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 * index }}
            >
              <GlassCard
                surface="muted"
                paddingClassName="p-6"
                className="group relative overflow-hidden border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/10"
              >
                <details className="group" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-white">
                    <span className="text-sm font-semibold leading-snug md:text-base">
                      {item.question}
                    </span>
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 group-open:animate-in group-open:fade-in">
                    {item.answer}
                  </p>
                </details>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default FAQSection;
