'use client';

import Link from 'next/link';
import { ArrowUpRight, Camera, Github, Linkedin, PlayCircle, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

import { GlassCard } from '@/components/landing/glass-card';
import { GradientButton } from '@/components/landing/ui/gradient-button';

type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

const columns: FooterColumn[] = [
  {
    heading: 'Ürün',
    links: [
      { label: 'Studio', href: '/app' },
      { label: 'Ajan kataloğu', href: '/agents' },
      { label: 'Pipeline otomasyonu', href: '/pipelines' },
      { label: 'Kod önizlemeleri', href: '/previews' },
    ],
  },
  {
    heading: 'Kaynaklar',
    links: [
      { label: 'Lovable göç rehberi', href: '/migration' },
      { label: 'Dokümantasyon', href: '/docs' },
      { label: 'Topluluk', href: '/community' },
      { label: 'Sistem durumu', href: '/status' },
    ],
  },
  {
    heading: 'Şirket',
    links: [
      { label: 'Hakkımızda', href: '/about' },
      { label: 'Kariyer', href: '/careers' },
      { label: 'Basın kiti', href: '/press' },
      { label: 'Partner programı', href: '/partners' },
    ],
  },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/codexonx', icon: Github },
  { label: 'Twitter', href: 'https://twitter.com/codexonx', icon: Twitter },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/codexonx', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com/@codexonx', icon: PlayCircle },
  { label: 'Instagram', href: 'https://instagram.com/codexonx', icon: Camera },
];

const highlights = [
  {
    title: 'Lovable uyumlu workspace',
    description: 'Turuncu/siyah temalı shell ile ekiplerin geçiş süresini %60 kısaltın.',
  },
  {
    title: 'Ajan guardrailleri',
    description: 'Kod, test ve deploy adımları için üretim seviyesinde güvenlik katmanları.',
  },
  {
    title: 'Gerçek zamanlı pipeline',
    description: 'Canlı log akışı ve on-demand rollback ile hataları anında yakalayın.',
  },
];

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden border-t border-white/5 bg-black"
    >
      <div
        className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(84,120,255,0.2),_transparent_70%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(160deg,rgba(0,0,0,0.92)_0%,rgba(12,14,18,0.96)_42%,rgba(0,0,0,0.94)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom,_rgba(255,107,44,0.24),_transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="container relative px-5 py-24 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col gap-10"
          >
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Codexonx
                <span className="rounded-full bg-primary/25 px-2 py-0.5 text-[0.6rem] text-primary">
                  Turuncu stüdyo
                </span>
              </div>
              <h2 className="font-display text-4xl font-semibold md:text-5xl">
                Lovable ruhunu Codexonx turuncusunda yeniden düşünün.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                Supabase ve Vercel entegrasyonları, workspace-aware AI ajanları ve canlı pipeline
                editörü ile shipping ritminizi standartlaştırın. Codexonx, Lovable ekiplerinin
                enterprise seviyesine taşınması için tasarlandı.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/app/new">
                  <GradientButton size="lg" className="min-w-[220px]">
                    Studio hesabı oluştur
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </Link>
                <Link
                  href="/book-demo"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition-colors duration-300 hover:border-white hover:text-white"
                >
                  Enterprise demo planla
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 * index }}
                >
                  <GlassCard
                    surface="muted"
                    glow={index === 0}
                    paddingClassName="p-5"
                    className="group relative overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    >
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.26),_transparent_60%)]" />
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.2),_transparent_65%)]" />
                    </span>
                    <div className="relative space-y-2 text-left text-white">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="text-xs leading-relaxed text-white/70">{item.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socials.map(social => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 transition-colors duration-300 hover:border-primary/60 hover:text-white"
                >
                  <social.icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                  {social.label}
                </Link>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1"
          >
            <GlassCard
              surface="muted"
              glow
              paddingClassName="p-6"
              className="group relative overflow-hidden border-white/12 bg-white/[0.05] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:bg-primary/10"
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.27),_transparent_62%)]" />
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(84,120,255,0.18),_transparent_58%)]" />
              </span>
              <div className="relative space-y-4 text-left text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Lovable ekiplerine özel
                </p>
                <h3 className="text-lg font-semibold md:text-xl">
                  30 dakikalık göç atölyesi ve pipeline sağlık raporu
                </h3>
                <p className="text-sm leading-relaxed text-white/75">
                  Lovable workspace’inizi getirirseniz, Codexonx ekibi pipeline’ınızı analiz eder ve
                  guardrail önerilerini ilk sprintte teslim eder.
                </p>
                <Link
                  href="/lovable-migration"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/80"
                >
                  Lovable göç planı incele
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>

            <div className="grid gap-8 sm:grid-cols-2">
              {columns.map(column => (
                <div key={column.heading} className="space-y-4 text-white/70">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                    {column.heading}
                  </h4>
                  <ul className="space-y-2.5 text-sm">
                    {column.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-white"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/50" aria-hidden />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Codexonx. Lovable’dan üretime uzanan AI destekli geliştirme stüdyosu.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors duration-300 hover:text-white">
              Gizlilik
            </Link>
            <Link href="/terms" className="transition-colors duration-300 hover:text-white">
              Kullanım koşulları
            </Link>
            <Link href="/security" className="transition-colors duration-300 hover:text-white">
              Güvenlik merkezi
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default FooterSection;
