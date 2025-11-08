'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code, Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Öne Çıkanlar', href: '#features' },
  { label: 'Akıllı Akış', href: '#workflows' },
  { label: 'Takım Deneyimi', href: '#collaboration' },
  { label: 'Planlar', href: '#pricing' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <Code className="h-5 w-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span>Codexonx Studio</span>
              <span className="text-xs font-normal text-slate-400">AI Code Experience</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navigation.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Giriş yap</Link>
            </Button>
            <Button size="sm" className="gap-2" asChild>
              <Link href="/auth/register">
                Başlayalım
                <Sparkles className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menüyü aç"
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className={cn('border-t border-white/10 md:hidden', isMenuOpen ? 'block' : 'hidden')}>
          <nav className="flex flex-col gap-4 px-6 py-4 text-sm font-medium">
            {navigation.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm">
              <Link href="/auth/register">Codexonx Studio&apos;yu Deneyin</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:pt-16">{children}</main>

      <footer className="border-t border-white/5 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p> {new Date().getFullYear()} Codexonx Studio. AI ile hızlanan yazılım geliştirme.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/pricing" className="transition-colors hover:text-primary">
              Planlar
            </Link>
            <Link href="/auth/login" className="transition-colors hover:text-primary">
              Oturum aç
            </Link>
            <Link href="/workspace" className="transition-colors hover:text-primary">
              Takım Alanı
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
