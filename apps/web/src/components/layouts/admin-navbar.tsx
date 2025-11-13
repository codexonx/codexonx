'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  FileCode,
  Package,
  Settings,
  CreditCard,
  Users,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Terminal,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { NotificationsCenter } from '@/components/notifications/notifications-center';
import { useI18n } from '@/contexts/i18n-context';

export function AdminNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, locale, changeLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dil seçenekleri
  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
  ];

  // Navigasyon menüsü
  const navItems = [
    {
      name: t('admin.dashboard'),
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin' || pathname === '/admin/dashboard',
    },
    {
      name: t('admin.projects'),
      href: '/admin/projects',
      icon: FileCode,
      active: pathname?.startsWith('/admin/projects'),
    },
    {
      name: t('admin.subscriptions'),
      href: '/admin/subscriptions',
      icon: Package,
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
      icon: CreditCard,
      active: pathname?.startsWith('/admin/payments'),
    },
    {
      name: t('admin.settings'),
      href: '/admin/settings',
      icon: Settings,
      active: pathname?.startsWith('/admin/settings'),
    },
  ];

  // Command Menüsü öğeleri
  const commandMenu = [
    { name: 'Dashboard', href: '/admin', shortcut: '⌘ D' },
    { name: 'Yeni Proje', href: '/admin/projects/new', shortcut: '⌘ P' },
    { name: 'Ayarlar', href: '/admin/settings', shortcut: '⌘ S' },
    { name: 'Kullanıcılar', href: '/admin/users', shortcut: '⌘ U' },
    { name: 'Abonelikler', href: '/admin/subscriptions', shortcut: '⌘ A' },
  ];

  // Animasyon tanımları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const searchVariants = {
    closed: {
      opacity: 0,
      x: 20,
      width: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      width: '100%',
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-black/80 shadow-[0_25px_60px_rgba(4,6,16,0.55)] backdrop-blur-xl'
            : 'bg-black/60 shadow-[0_20px_55px_rgba(4,6,18,0.35)] backdrop-blur-lg'
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,44,0.2),transparent_65%),radial-gradient(circle_at_bottom_right,rgba(84,120,255,0.18),transparent_70%)]"
            aria-hidden
          />
          <div className="relative flex h-16 w-full items-center justify-between">
            {/* Logo & Mobil Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mr-2 rounded-lg border border-white/10 bg-white/[0.05] p-2 text-white/80 transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/20 hover:text-white md:hidden"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link href="/admin" className="flex items-center">
                <Logo size="sm" animated={false} />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center md:flex">
              <motion.div
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 shadow-[0_0_35px_rgba(255,107,44,0.18)] backdrop-blur"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map(item => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${
                        item.active
                          ? 'border border-primary/50 bg-primary/20 text-white shadow-[0_0_30px_rgba(255,107,44,0.35)]'
                          : 'text-white/70 hover:-translate-y-0.5 hover:border hover:border-primary/40 hover:bg-primary/10'
                      }`}
                    >
                      <span
                        className={`${
                          item.active ? 'text-white' : 'text-white/55'
                        } inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-black/40`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 text-white/80">
              {/* Search Bar */}
              <div className="relative hidden items-center md:flex">
                {searchOpen ? (
                  <motion.div
                    className="relative"
                    variants={searchVariants}
                    initial="closed"
                    animate="open"
                  >
                    <input
                      type="text"
                      placeholder={t('common.search')}
                      className="h-9 w-full rounded-full border border-white/15 bg-black/50 py-1 pl-10 pr-4 text-sm text-white placeholder:text-white/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
                    <kbd className="pointer-events-none absolute top-1/2 right-3 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border border-white/15 bg-white/[0.08] px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100 sm:flex">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setSearchOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                    aria-label="Search"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Search className="h-4 w-4" />
                  </motion.button>
                )}
              </div>

              {/* Notification Center */}
              <NotificationsCenter />

              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full border border-white/10 bg-white/[0.05] text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] pr-2 text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/30 text-sm font-semibold text-white shadow-[0_0_25px_rgba(255,107,44,0.4)]">
                    AK
                  </span>
                  <span className="hidden sm:block font-medium text-sm">Ali Kaan</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </Button>

                {userMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] text-white shadow-[0_30px_60px_rgba(4,6,16,0.55)] backdrop-blur-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative p-3">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.18),transparent_70%),radial-gradient(circle_at_bottom_left,rgba(84,120,255,0.16),transparent_72%)]"
                        aria-hidden
                      />
                      <div className="relative space-y-2">
                        <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                          <p className="text-sm font-semibold text-white">Ali Kaan</p>
                          <p className="text-xs text-white/60">admin@codexonx.com</p>
                        </div>

                        <Link
                          href="/admin/profile"
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          {t('admin.profile')}
                        </Link>

                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          {t('admin.settings')}
                        </Link>

                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-1 items-center gap-1">
                              {languages.map(lang => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    changeLocale(lang.code as any);
                                    setUserMenuOpen(false);
                                  }}
                                  className={`rounded-lg px-2 py-1 text-xs transition ${
                                    locale === lang.code
                                      ? 'border border-primary/40 bg-primary/20 text-white shadow-[0_0_20px_rgba(255,107,44,0.3)]'
                                      : 'border border-white/10 bg-black/40 text-white/70 hover:border-primary/30 hover:bg-primary/15'
                                  }`}
                                >
                                  {lang.code.toUpperCase()}
                                </button>
                              ))}
                            </div>

                            <Link
                              href="/admin/support"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/65 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/20 hover:text-white"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>

                        <button
                          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-red-200 transition hover:-translate-y-0.5 hover:border-red-400/60 hover:bg-red-400/20 hover:text-white"
                          onClick={() => {
                            console.log('Çıkış yapılıyor');
                            setUserMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          {t('auth.logout')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <motion.div
            className="fixed inset-y-0 left-0 w-3/4 max-w-xs overflow-y-auto border-r border-white/10 bg-black/85 shadow-[0_35px_70px_rgba(4,6,16,0.6)] backdrop-blur-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 border-b">
              <Logo size="sm" />
            </div>

            <nav className="p-4">
              <div className="space-y-2">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      item.active
                        ? 'border-primary/50 bg-primary/20 text-white shadow-[0_0_30px_rgba(255,107,44,0.35)]'
                        : 'border-white/10 bg-white/[0.06] text-white/75 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="mb-4 flex items-center">
                  <span className="mr-3 flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/30 text-sm font-semibold text-white shadow-[0_0_25px_rgba(255,107,44,0.4)]">
                    AK
                  </span>
                  <div>
                    <p className="font-medium">Ali Kaan</p>
                    <p className="text-xs text-white/60">admin@codexonx.com</p>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/15 hover:text-white"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                  </div>
                </button>

                <div className="flex gap-1 px-3 py-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLocale(lang.code as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`rounded-md px-3 py-1.5 text-xs transition ${
                        locale === lang.code
                          ? 'border border-primary/50 bg-primary/25 text-white shadow-[0_0_22px_rgba(255,107,44,0.35)]'
                          : 'border border-white/10 bg-white/[0.06] text-white/70 hover:border-primary/40 hover:bg-primary/15'
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  className="mt-2 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-red-200 transition hover:-translate-y-0.5 hover:border-red-400/60 hover:bg-red-400/20 hover:text-white"
                  onClick={() => {
                    console.log('Çıkış yapılıyor');
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  {t('auth.logout')}
                </button>
              </div>
            </nav>

            <div className="p-4 border-t mt-auto">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/60">© 2025 Codexonx</p>
                <Link
                  href="/admin/support"
                  className="text-xs text-white/75 underline-offset-4 transition hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('admin.getHelp')}
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Command Menu */}
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-50 items-start justify-center hidden md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSearchOpen(false)}
          />

          <motion.div
            className="relative mt-32 w-full max-w-lg overflow-hidden rounded-2xl border border-white/12 bg-black/85 shadow-[0_40px_80px_rgba(4,6,16,0.6)] backdrop-blur-xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center border-b p-4">
              <Search className="mr-3 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder={t('common.searchCommands')}
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/50"
                autoFocus
              />
              <kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/[0.06] px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100 sm:flex">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            <div className="p-2">
              <p className="px-2 py-1.5 text-xs text-white/60">{t('common.suggestions')}</p>

              {commandMenu.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-white/8 px-2 py-1.5 text-sm text-white/80 transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/12 hover:text-white"
                  onClick={() => setSearchOpen(false)}
                >
                  <span>{item.name}</span>
                  <kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/[0.06] px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100 sm:flex">
                    {item.shortcut}
                  </kbd>
                </Link>
              ))}
            </div>

            <div className="border-t p-2 text-center">
              <button
                className="px-2 py-1 text-xs text-white/70 transition hover:text-white"
                onClick={() => setSearchOpen(false)}
              >
                <Terminal className="inline h-3 w-3 mr-1" />
                {t('common.pressKForCommands')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
