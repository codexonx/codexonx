'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';

import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';

const testimonials = [
  {
    name: 'Aylin Özkan',
    role: 'Ürün Direktörü',
    company: 'Orbit Labs',
    quote:
      'Lovable’daki prototipleri Codexonx Studio’ya taşıdık. Turuncu temalı yeni pipeline ile her ship ettiğimiz sürümde ajan önerileri sayesinde QA süremiz yarıya indi.',
    highlight: 'Deploy süresi 40 dakikadan 12 dakikaya',
  },
  {
    name: 'Caner Aksoy',
    role: 'CTO',
    company: 'NeuralWorks',
    quote:
      'Codexonx, ekiplerimize Lovable hissiyatını korurken enterprise güvenlik sağladı. Prompt checklist ve guardrail setleri sayesinde compliance ekibiyle uyum sağladık.',
    highlight: 'Compliance bulguları %70 azaldı',
  },
  {
    name: 'Elif Kaya',
    role: 'Engineering Manager',
    company: 'Atlas Industries',
    quote:
      'Ajan kuyruğu ve canlı pipeline birleşince shipping ritmimiz tamamen değişti. Takım turuncu/siyah stüdyoya bayıldı; onboarding süresi üç güne düştü.',
    highlight: 'Onboarding süresi 14 günden 3 güne',
  },
];

export function TestimonialsSection() {
  return (
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden py-28"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-background via-background/85 to-black"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-[-28%] -z-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-16 bottom-[-42%] -z-10 h-[360px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.2),_transparent_72%)] blur-[160px]"
        aria-hidden
      />

      <div className="container relative flex flex-col gap-14 px-5 md:px-10">
        <SectionHeading
          align="center"
          eyebrow="Referanslar"
          title="Codexonx turuncusu ile Lovable hissiyatı"
          lead="Ürün ekiplerinin AI destekli geliştirme süreçlerini nasıl hızlandırdığını dinleyin."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 * index }}
              className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_12px_rgba(255,107,44,0.35)]"
                        />
                      ))}
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/75 md:text-base">
                    {testimonial.quote}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white md:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/35 bg-primary/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    {testimonial.highlight}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default TestimonialsSection;
