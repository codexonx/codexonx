'use client';

import { Inter, Roboto_Mono, Poppins } from 'next/font/google';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from './main-nav';
import { SiteFooter } from './site-footer';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

interface MainLayoutProps {
  children: React.ReactNode;
  // Optional metadata for SEO
  title?: string;
  description?: string;
}

export function MainLayout({
  children,
  title = 'CodeXonX - Modern Web Development',
  description = 'Build modern web applications with our powerful development tools and resources.',
}: MainLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${robotoMono.variable} ${poppins.variable} ${
        isHomePage ? 'scroll-smooth' : ''
      }`}
      suppressHydrationWarning
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://codexonx.com" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://codexonx.com" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="/og-image.jpg" />
      </Head>

      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">
              {/* Add a subtle background pattern */}
              <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]">
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
              </div>
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
