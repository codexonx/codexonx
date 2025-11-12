import Link from 'next/link';
import { ArrowUpRight, Camera, Github, Linkedin, PlayCircle, Twitter } from 'lucide-react';

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
    <footer id="footer" className="relative overflow-hidden border-t border-white/5 bg-background">
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_bottom,_rgba(255,107,44,0.18),_transparent_70%)]"
        aria-hidden
      />

      <div className="container px-4 py-24 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Codexonx
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[0.6rem] text-primary">
                  Turuncu stüdyo
                </span>
              </div>
              <h2 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
                Lovable ruhunu Codexonx turuncusunda yeniden düşünün.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
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
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white hover:text-white"
                >
                  Enterprise demo planla
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map(item => (
                <GlassCard key={item.title} surface="muted" paddingClassName="p-5">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socials.map(social => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-primary/60 hover:text-white"
                >
                  <social.icon className="h-4 w-4 text-primary transition group-hover:scale-110" />
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <GlassCard surface="muted" paddingClassName="p-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Lovable ekiplerine özel
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  30 dakikalık göç atölyesi ve pipeline sağlık raporu
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lovable workspace’inizi getirirseniz, Codexonx ekibi pipeline’ınızı analiz eder ve
                  guardrail önerilerini ilk sprintte teslim eder.
                </p>
                <Link
                  href="/lovable-migration"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                >
                  Lovable göç planı incele
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </GlassCard>

            <div className="grid gap-8 sm:grid-cols-2">
              {columns.map(column => (
                <div key={column.heading} className="space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {column.heading}
                  </h4>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {column.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-2 transition hover:text-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" aria-hidden />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Codexonx. Lovable’dan üretime uzanan AI destekli geliştirme stüdyosu.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-foreground">
              Gizlilik
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Kullanım koşulları
            </Link>
            <Link href="/security" className="transition hover:text-foreground">
              Güvenlik merkezi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
