'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Flame, Play, Shield, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';
import { SectionHeading } from '@/components/landing/ui/section-heading';

type QuickWin = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const quickWins: QuickWin[] = [
  {
    title: 'Lovable uyumlu arayüz',
    description:
      'Turuncu/siyah temalı Studio shell ile ekiplerin love-brand hissini kesintisiz yaşatın.',
    icon: Flame,
  },
  {
    title: 'Ajan otomasyonu',
    description: 'Pull request, test ve deploy adımlarını guardrail setleriyle otomatikleştirin.',
    icon: Play,
  },
  {
    title: 'Workspace şablonları',
    description: 'Supabase + Next.js + Vercel entegrasyonlarıyla dakikalar içinde canlıya çıkın.',
    icon: Shield,
  },
];

const ctaParagraphs = [
  'Görev tabanlı ajanlarımız, Studio shell ve komut paleti ile ürün ekibinizin ritmini ilk günden hizalar.',
  'Deploy guardrail’leri, Supabase otomasyonları ve gözlem panelleriyle turuncu glow hissini prod’da canlı tutun.',
];

export function FinalCTASection() {
  return (
    <motion.section
      id="cta"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative overflow-hidden py-28 sm:py-32 lg:py-40"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-black via-background to-black"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.24),_transparent_62%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-8 bottom-[-35%] -z-10 h-[420px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.18),_transparent_70%)] blur-[140px]"
        aria-hidden
      />

      <div className="container relative flex flex-col items-center gap-16 px-5 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex w-full flex-col items-center gap-5"
        >
          <SectionHeading
            align="center"
            eyebrow="Son adım"
            title="Lovable dokunuşunu Codexonx turuncusunda yaşayın"
            lead="AI ajanı, turuncu glow pipeline’ı ve canlı workspace ritmiyle 10 dakikada ship etmeye başlayın."
          />
          <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-white/60 sm:text-sm">
            <span className="rounded-full border border-white/15 px-4 py-2 uppercase tracking-[0.28em]">
              14 gün ücretsiz deneme
            </span>
            <span className="rounded-full border border-white/15 px-4 py-2 uppercase tracking-[0.28em]">
              Guardrail’li deploy
            </span>
            <span className="rounded-full border border-white/15 px-4 py-2 uppercase tracking-[0.28em]">
              Supabase entegrasyonları
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full"
        >
          <GlassCard
            surface="primary"
            glow
            paddingClassName="px-8 py-12 sm:px-10 sm:py-14"
            className="relative mx-auto max-w-4xl overflow-hidden text-left sm:text-center"
          >
            <span
              className="pointer-events-none absolute -top-20 left-1/2 aspect-square w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,185,113,0.32),_transparent_70%)] blur-3xl"
              aria-hidden
            />
            <div className="flex flex-col items-center gap-7 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/[0.12] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
                <Sparkles className="h-4 w-4" />
                Studio hazır
              </span>
              <h3 className="font-display text-3xl font-semibold text-white md:text-4xl">
                Kendi Lovable hikayenizi Codexonx Studio ile yazın
              </h3>
              <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-white/70 md:text-base">
                {ctaParagraphs.map(paragraph => (
                  <p key={paragraph} className="text-balance">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                <Link href="/app/new" className="w-full sm:w-auto">
                  <GradientButton size="lg" className="group w-full min-w-[220px] sm:w-auto">
                    Studio hesabı oluştur
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </GradientButton>
                </Link>
                <Link
                  href="/book-demo"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition duration-300 hover:border-primary/40 hover:text-white"
                >
                  Canlı demo talep et
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {quickWins.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 + index * 0.08 }}
            >
              <GlassCard
                surface="muted"
                paddingClassName="p-6 sm:p-7"
                className="group relative h-full overflow-hidden border-white/12 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-primary/5"
              >
                <span
                  className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.32),_transparent_65%)]" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.22),_transparent_70%)]" />
                </span>
                <div className="space-y-4 text-left text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
                  </div>
                  <p className="leading-relaxed">{item.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FinalCTASection;
