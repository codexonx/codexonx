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
import { AdminNavbar } from './admin-navbar';
import { useI18n } from '@/contexts/i18n-context';

const sidebarShellClass =
  'relative flex h-full flex-col overflow-hidden rounded-r-3xl border-r border-white/10 bg-black/70 px-2 pb-6 pt-4 text-white shadow-[0_45px_90px_rgba(4,6,16,0.55)] backdrop-blur-xl';
const sidebarOverlayClass =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,44,0.28),transparent_68%),radial-gradient(circle_at_bottom,rgba(84,120,255,0.24),transparent_72%)] opacity-95';
const navLinkBaseClass =
  'group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:text-white';
const navLinkActiveClass =
  'border-primary/60 bg-primary/25 text-white shadow-[0_0_35px_rgba(255,107,44,0.35)]';

const navIconClass =
  'h-5 w-5 shrink-0 text-white/45 transition-colors duration-200 group-hover:text-white';

const sectionTitleClass =
  'mb-2 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/40';
const collapseButtonClass =
  'flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/60 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white';
const mobileNavLinkClass =
  'flex flex-1 flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.05] p-2 text-[0.7rem] text-white/65 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white';
const mobileNavActiveClass =
  'border-primary/60 bg-primary/25 text-white shadow-[0_0_30px_rgba(255,107,44,0.3)]';

function getSidebarStaggerProps(index: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, ease: 'easeOut', delay: Math.min(0.45, index * 0.04) },
  } as const;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="relative min-h-screen overflow-hidden bg-[#04060b] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.18),transparent_65%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.22),transparent_70%)]"
        aria-hidden
      />

      {/* Ana Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 bottom-0 top-16 z-30 hidden md:block"
        initial={sidebarCollapsed ? 'collapsed' : 'expanded'}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
      >
        <div className={sidebarShellClass}>
          <div className={sidebarOverlayClass} aria-hidden />
          <div className="relative flex h-full flex-col">
            <div className="flex-1 overflow-y-auto pb-6">
              {sidebarSections.map((section, idx) => (
                <div key={section.title} className="px-3 py-3">
                  {!sidebarCollapsed && (
                    <motion.h3
                      className={sectionTitleClass}
                      initial="collapsed"
                      animate="expanded"
                      variants={itemVariants}
                    >
                      {section.title}
                    </motion.h3>
                  )}

                  <motion.ul
                    className="space-y-2"
                    initial="collapsed"
                    animate="expanded"
                    variants={itemVariants}
                  >
                    {section.links.map((link, linkIndex) => (
                      <motion.li key={link.href} {...getSidebarStaggerProps(linkIndex)}>
                        <Link
                          href={link.href}
                          className={cn(
                            navLinkBaseClass,
                            link.active && navLinkActiveClass,
                            sidebarCollapsed && 'justify-center px-2 py-2 text-xs'
                          )}
                        >
                          <link.icon
                            className={cn(
                              navIconClass,
                              link.active ? 'text-white' : undefined,
                              sidebarCollapsed && 'text-white/70'
                            )}
                          />
                          {!sidebarCollapsed && (
                            <motion.span
                              initial="collapsed"
                              animate="expanded"
                              variants={itemVariants}
                              className="font-medium tracking-wide"
                            >
                              {link.name}
                            </motion.span>
                          )}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="mt-auto px-3">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={collapseButtonClass}
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
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        className="relative pb-12 pt-20"
        initial={contentVariantState}
        animate={contentVariantState}
        variants={contentVariants}
      >
        <div className="container py-10 md:py-12">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_45px_80px_rgba(4,6,16,0.45)] backdrop-blur-xl md:p-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.15),transparent_65%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.18),transparent_70%)]"
              aria-hidden
            />
            <div className="relative">{children}</div>
          </div>
        </div>
      </motion.main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/80 backdrop-blur-xl md:hidden">
        <nav className="flex items-center justify-between gap-2 p-3">
          {sidebarSections
            .flatMap(section => section.links.slice(0, 2))
            .slice(0, 5)
            .map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(mobileNavLinkClass, link.active && mobileNavActiveClass)}
              >
                <link.icon className="h-5 w-5 text-white/70" />
                <span className="font-medium tracking-wide">{link.name}</span>
              </Link>
            ))}

          <Link
            href="/admin/settings"
            className={cn(
              mobileNavLinkClass,
              pathname?.startsWith('/admin/settings') && mobileNavActiveClass
            )}
          >
            <Settings className="h-5 w-5 text-white/70" />
            <span className="font-medium tracking-wide">{t('admin.settings')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
