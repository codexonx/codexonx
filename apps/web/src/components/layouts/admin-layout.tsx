'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
// Due to compatibility issues with lucide-react, we're using a simplified approach
// with a single known icon for now
const LayoutGrid = ArrowRight;
const FileCode = ArrowRight;
const Archive = ArrowRight;
const DollarSign = ArrowRight;
const Settings = ArrowRight;
const Users = ArrowRight;
const ChevronLeft = ArrowRight;
const ChevronRight = ArrowRight;
const BarChart2 = ArrowRight;
const Cpu = ArrowRight;
const Layers = ArrowRight;
const Activity = ArrowRight;
const Database = ArrowRight;
const Globe = ArrowRight;
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { AdminNavbar } from './admin-navbar';
import { useI18n } from '@/contexts/i18n-context';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ekran genişliğine göre sidebar durumunu ayarla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar bölümleri
  const sidebarSections = [
    {
      title: t('admin.overview'),
      links: [
        {
          name: t('admin.dashboard'),
          href: '/admin',
          icon: LayoutGrid,
          active: pathname === '/admin' || pathname === '/admin/dashboard',
        },
        {
          name: t('admin.analytics'),
          href: '/admin/analytics',
          icon: BarChart2,
          active: pathname?.startsWith('/admin/analytics'),
        },
        {
          name: t('admin.performance'),
          href: '/admin/performance',
          icon: Activity,
          active: pathname?.startsWith('/admin/performance'),
        },
      ],
    },
    {
      title: t('admin.development'),
      links: [
        {
          name: t('admin.projects'),
          href: '/admin/projects',
          icon: FileCode,
          active: pathname?.startsWith('/admin/projects'),
        },
        {
          name: t('admin.ai'),
          href: '/admin/ai',
          icon: Cpu,
          active: pathname?.startsWith('/admin/ai'),
        },
        {
          name: t('admin.integrations'),
          href: '/admin/integrations',
          icon: Layers,
          active: pathname?.startsWith('/admin/integrations'),
        },
        {
          name: t('admin.databases'),
          href: '/admin/databases',
          icon: Database,
          active: pathname?.startsWith('/admin/databases'),
        },
      ],
    },
    {
      title: t('admin.business'),
      links: [
        {
          name: t('admin.subscriptions'),
          href: '/admin/subscriptions',
          icon: Archive,
          active: pathname?.startsWith('/admin/subscriptions'),
        },
        {
          name: t('admin.users'),
          href: '/admin/users',
          icon: Users,
          active: pathname?.startsWith('/admin/users'),
        },
        {
          name: t('admin.payments'),
          href: '/admin/payments',
          icon: DollarSign,
          active: pathname?.startsWith('/admin/payments'),
        },
        {
          name: t('admin.domains'),
          href: '/admin/domains',
          icon: Globe,
          active: pathname?.startsWith('/admin/domains'),
        },
      ],
    },
  ];

  // Animasyon varyantları
  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: { duration: 0.3 },
    },
    collapsed: {
      width: '72px',
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    expanded: {
      marginLeft: '280px',
      transition: { duration: 0.3 },
    },
    collapsed: {
      marginLeft: '72px',
      transition: { duration: 0.3 },
    },
    mobile: {
      marginLeft: '0px',
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  // Mobil görünüm için contentVariants durumu
  const [contentVariantState, setContentVariantState] = useState(
    sidebarCollapsed ? 'collapsed' : 'expanded'
  );

  // Client-side ekran genişliğini kontrol et
  useEffect(() => {
    const updateVariantState = () => {
      setContentVariantState(
        window.innerWidth < 768 ? 'mobile' : sidebarCollapsed ? 'collapsed' : 'expanded'
      );
    };

    updateVariantState();
    window.addEventListener('resize', updateVariantState);

    return () => window.removeEventListener('resize', updateVariantState);
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-background">
      {/* Ana Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 bottom-0 top-16 z-30 hidden border-r bg-background md:block"
        initial={sidebarCollapsed ? 'collapsed' : 'expanded'}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto py-4">
            {sidebarSections.map((section, idx) => (
              <div key={idx} className="px-3 py-2">
                {!sidebarCollapsed && (
                  <motion.h3
                    className="mb-2 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    initial="collapsed"
                    animate="expanded"
                    variants={itemVariants}
                  >
                    {section.title}
                  </motion.h3>
                )}

                <ul className="space-y-1">
                  {section.links.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                          link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        )}
                      >
                        <link.icon
                          className={cn(
                            'h-5 w-5',
                            link.active ? 'text-primary-foreground' : 'text-muted-foreground'
                          )}
                        />
                        {!sidebarCollapsed && (
                          <motion.span
                            initial="collapsed"
                            animate="expanded"
                            variants={itemVariants}
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto p-4 border-t">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="pb-8 pt-16"
        initial={contentVariantState}
        animate={contentVariantState}
        variants={contentVariants}
      >
        <div className="container py-6 md:py-8">{children}</div>
      </motion.main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-30">
        <nav className="flex items-center justify-between p-2">
          {sidebarSections
            .flatMap(section => section.links.slice(0, 2))
            .slice(0, 5)
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-md p-2 text-xs',
                  link.active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}

          <Link
            href="/admin/settings"
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-md p-2 text-xs',
              pathname?.startsWith('/admin/settings')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            <span>{t('admin.settings')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
