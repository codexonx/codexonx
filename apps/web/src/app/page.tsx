import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Laptop, Lock, BarChart, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container sticky top-0 z-40 bg-background">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-6 w-6" />
              <span className="font-bold inline-block">Codexonx</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Özellikler
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                Fiyatlandırma
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-primary">
                İletişim
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Giriş</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Yazılım Projeleriniz İçin Güçlü Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Projelerinizi güvenle yönetin, API anahtarlarınızı oluşturun ve modern bir arayüz ile her şeyi kontrol edin.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2">
                    Hemen Başla
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Özelliklere Göz At
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Öne Çıkan Özellikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow">
                <Laptop className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Modern Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400">Projelerinizi yönetmek için kullanıcı dostu, modern bir kontrol paneli.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow">
                <Lock className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Güvenli API Anahtarları</h3>
                <p className="text-gray-500 dark:text-gray-400">API anahtarlarını güvenle oluşturun, yönetin ve izleyin.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow">
                <BarChart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Detaylı Analitikler</h3>
                <p className="text-gray-500 dark:text-gray-400">Kullanım verilerinizi gerçek zamanlı olarak görüntüleyin ve analiz edin.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Gelişmiş Güvenlik</h3>
                <p className="text-gray-500 dark:text-gray-400">Verileriniz en son güvenlik önlemleriyle korunur.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Fiyatlandırma Planları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col p-6 bg-background rounded-lg shadow border">
                <h3 className="text-2xl font-bold mb-2">Ücretsiz</h3>
                <p className="text-4xl font-bold mb-2">₺0<span className="text-lg font-normal text-gray-500">/ay</span></p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Küçük projeler için ideal başlangıç planı.</p>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    2 Proje
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Temel analitikler
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Topluluk desteği
                  </li>
                </ul>
                <Link href="/auth/register">
                  <Button className="w-full" variant="outline">Ücretsiz Başla</Button>
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-background rounded-lg shadow border border-primary relative">
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold">POPÜLER</span>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-4xl font-bold mb-2">₺199<span className="text-lg font-normal text-gray-500">/ay</span></p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Büyüyen projeler ve ekipler için.</p>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    10 Proje
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Gelişmiş analitikler
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Öncelikli e-posta desteği
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    API geçmiş kayıtları (30 gün)
                  </li>
                </ul>
                <Link href="/auth/register?plan=pro">
                  <Button className="w-full">Planı Seç</Button>
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-background rounded-lg shadow border">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <p className="text-4xl font-bold mb-2">₺699<span className="text-lg font-normal text-gray-500">/ay</span></p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Büyük ölçekli işletmeler ve kurumsal kullanım için.</p>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Sınırsız proje
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Özel analitikler
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    7/24 öncelikli destek
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    API geçmiş kayıtları (365 gün)
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Özel entegrasyon desteği
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full" variant="outline">Daha Fazla Bilgi</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id="contact" className="py-6 md:py-12 border-t bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6" />
                <span className="font-bold">Codexonx</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Yazılım projeleriniz için güçlü bir platform çözümü.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Özellikler
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Dokümantasyon
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:info@codexonx.com" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    info@codexonx.com
                  </a>
                </li>
                <li>
                  <a href="tel:+902125551234" className="text-sm text-gray-500 hover:text-primary dark:text-gray-400">
                    +90 212 555 12 34
                  </a>
                </li>
                <li>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    İstanbul, Türkiye
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Codexonx. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
