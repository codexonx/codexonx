'use client';

import { motion } from 'framer-motion';

const logos = [
  { name: 'Vercel', caption: 'Edge deploy partner' },
  { name: 'Supabase', caption: 'Realtime veri katmanı' },
  { name: 'Linear', caption: 'Product ritual' },
  { name: 'Datadog', caption: 'Observability guardrail' },
  { name: 'Cloudflare', caption: 'Global CDN ağı' },
  { name: 'GitHub', caption: 'AI PR akışı' },
];

export function TrustLogosSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden py-20"
    >
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-black via-background to-black"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-[-30%] -z-20 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_65%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-12 bottom-[-36%] -z-10 h-[320px] rounded-full bg-[radial-gradient(circle,_rgba(84,120,255,0.22),_transparent_70%)] blur-[140px]"
        aria-hidden
      />
      <div className="container relative flex flex-col items-center gap-12 px-5 text-center md:px-10">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
            Codexonx ile gemiyi yöneten ekipler
          </span>
          <p className="max-w-3xl text-sm text-white/70 md:text-base">
            Lovable ritmini koruyan ürün takımları, Codexonx turuncusunda edge deploy ve guardrail
            pipeline ile gemi çıkarıyor.
          </p>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 * index }}
              className="group rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-5 text-left backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
            >
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold text-white md:text-lg">{logo.name}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-white/55">
                  {logo.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default TrustLogosSection;
