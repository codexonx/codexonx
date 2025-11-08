import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/responsive.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/contexts/i18n-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import RegisterServiceWorker from './register-sw';
import { FloatingFeedback } from '@/components/feedback/floating-feedback';
import { ChakraUIProvider } from '@/providers/chakra-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Codexonx Platform',
  description: 'Kodlama projeleriniz için güçlü bir platform',
  manifest: '/manifest.webmanifest',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Codexonx',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-512x512.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <WorkspaceProvider>
                <ChakraUIProvider>
                  <RegisterServiceWorker />
                  {children}
                  <Toaster />
                  <FloatingFeedback />
                </ChakraUIProvider>
              </WorkspaceProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
