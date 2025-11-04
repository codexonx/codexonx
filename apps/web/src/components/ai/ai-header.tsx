'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Sadece mevcut olduğundan emin olduğumuz ikonları kullanıyoruz
import { Code, Settings, User, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Yapay zeka kod yazma platformu için header bileşeni
 * Navigasyon linkleri ve kullanıcı menüsü içerir
 */
export function AIHeader() {
  const pathname = usePathname();

  // Navigasyon linkleri - ikon olmadan
  const navLinks = [
    {
      name: 'Ana Sayfa',
      href: '/ai-code',
    },
    {
      name: 'Kod Editörü',
      href: '/ai-code/editor',
    },
    {
      name: 'Projeler',
      href: '/ai-code/projects',
    },
    {
      name: 'Terminal',
      href: '/ai-code/terminal',
    },
    {
      name: 'Şablonlar',
      href: '/ai-code/templates',
    },
    {
      name: 'Dokümantasyon',
      href: '/ai-code/docs',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/ai-code" className="flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            <span className="font-semibold hidden sm:inline-block">CodeXONX AI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Button
                key={link.href}
                variant={pathname === link.href ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className="text-sm"
              >
                <Link href={link.href} className="flex items-center">
                  {link.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" /> Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" /> Ayarlar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Github className="w-4 h-4 mr-2" /> GitHub Bağla
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Çıkış Yap</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
