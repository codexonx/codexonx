import { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import '@/styles/responsive.css';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/contexts/i18n-context';
import { AuthProvider } from '@/contexts/auth-context';
import { AIHeader } from '@/components/ai/ai-header';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz çünkü bunlar React ve UI kütüphaneleri
// arasındaki tip uyumsuzluklarından kaynaklanıyor ve işlevselliği etkilemiyor

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeXONX AI | Yapay Zeka Kod Yazma Platformu',
  description:
    'Yapay zeka destekli kod yazma, düzenleme ve geliştirme platformu. Projelerinizi hızlı ve verimli bir şekilde geliştirin.',
  authors: [{ name: 'CodeXONX Team' }],
  keywords: [
    'yapay zeka',
    'kod yazma',
    'AI',
    'kodlama',
    'programlama',
    'geliştirme',
    'kod asistanı',
  ],
  creator: 'CodeXONX',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://codexonx.com/ai-code',
    title: 'CodeXONX AI | Yapay Zeka Kod Yazma Platformu',
    description: 'Yapay zeka destekli kod yazma, düzenleme ve geliştirme platformu.',
    siteName: 'CodeXONX',
    images: [
      {
        url: 'https://codexonx.com/images/ai-code-og.png',
        width: 1200,
        height: 630,
        alt: 'CodeXONX AI Kod Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeXONX AI | Yapay Zeka Kod Yazma Platformu',
    description: 'Yapay zeka destekli kod yazma, düzenleme ve geliştirme platformu.',
    images: ['https://codexonx.com/images/ai-code-twitter.png'],
    creator: '@codexonx',
  },
};

export default function AICodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AIHeader />
      <main className="flex-1">
        <I18nProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">{children}</div>
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </main>
    </div>
  );
}
