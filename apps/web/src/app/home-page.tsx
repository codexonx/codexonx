'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Terminal,
  GitBranch,
  Cpu,
  Users,
  Lock,
  Code as CodeIcon,
  BarChart2 as BarChart,
  Shield as ShieldIcon,
} from 'lucide-react';
import { CodeXonXLogo } from '@/components/ui/codexonx-logo';
import { MainNav } from '@/components/layout/main-nav';

const features = [
  {
    icon: <Terminal className="h-6 w-6 text-primary" />,
    title: 'Güçlü Kod Editörü',
    description: 'Entegre kod editörü ile projelerinizi doğrudan tarayıcınızdan düzenleyin.',
  },
  {
    icon: <GitBranch className="h-6 w-6 text-primary" />,
    title: 'Versiyon Kontrolü',
    description: 'Git entegrasyonu ile projelerinizin tüm versiyonlarını yönetin.',
  },
  {
    icon: <Cpu className="h-6 w-6 text-primary" />,
    title: 'AI Destekli Geliştirme',
    description: 'Yapay zeka destekli kod tamamlama ve öneriler ile daha hızlı kod yazın.',
  },
  {
    icon: <ShieldIcon className="h-6 w-6 text-primary" />,
    title: 'Güvenli API Yönetimi',
    description: 'API anahtarlarınızı güvenle yönetin ve izleyin.',
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: 'Ekip İşbirliği',
    description: 'Ekip arkadaşlarınızla gerçek zamanlı olarak işbirliği yapın.',
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: 'Güvenlik Öncelikli',
    description: 'Endüstri standartlarında güvenlik önlemleri ile verileriniz güvende.',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="mr-2 h-4 w-4" />
                <span>Yeni Sürüm Çıktı! v2.0</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                  CodeXonX
                </span>{' '}
                ile Kodlama Deneyiminizi Geliştirin
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Modern, hızlı ve güvenli bir ortamda projelerinizi yönetin, AI destekli kodlama
                araçlarımızla üretkenliğinizi artırın.
              </p>

              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Button size="lg" className="group relative overflow-hidden" asChild>
                  <Link href="/auth/register">
                    <span className="relative z-10">Ücretsiz Başla</span>
                    <span className="absolute inset-0 -z-0 h-full w-full scale-110 bg-gradient-to-r from-primary to-orange-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">
                    <span>Özellikleri Keşfet</span>
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-muted"
                    ></div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> geliştirici bize
                  katıldı
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Geliştiriciler İçin Güçlü Özellikler
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                CodeXonX ile yazılım geliştirme deneyiminizi bir üst seviyeye taşıyın.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-150"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 py-20">
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hemen Başlayın</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                CodeXonX ile yazılım geliştirme deneyiminizi dönüştürün. Ücretsiz başlayın,
                ihtiyaçlarınıza göre ölçeklendirin.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Button size="lg" className="px-8" asChild>
                  <Link href="/auth/register">
                    <span>Ücretsiz Kayıt Ol</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8" asChild>
                  <Link href="/demo">
                    <span>Canlı Demo İzle</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/95 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <CodeXonXLogo size="sm" />
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} CodeXonX. Tüm hakları saklıdır.
              </p>
            </div>
            <nav className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Kullanım Koşulları
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                İletişim
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
