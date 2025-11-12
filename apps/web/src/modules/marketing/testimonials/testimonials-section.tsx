import { Star } from 'lucide-react';

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
    <section id="testimonials" className="relative overflow-hidden py-28">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,107,44,0.1),_transparent_70%)]"
        aria-hidden
      />
      <div className="container relative px-4 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Referanslar"
          title="Codexonx turuncusu ile Lovable hissiyatı"
          lead="Ürün ekiplerinin AI destekli geliştirme süreçlerini nasıl hızlandırdığını dinleyin."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map(testimonial => (
            <GlassCard key={testimonial.name} paddingClassName="p-7" surface="muted">
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-1.5 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_12px_rgba(255,107,44,0.35)]"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.quote}</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
                <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  {testimonial.highlight}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
