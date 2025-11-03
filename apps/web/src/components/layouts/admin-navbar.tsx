"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
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
  HelpCircle
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { NotificationsCenter } from "@/components/notifications/notifications-center";
import { useI18n } from "@/contexts/i18n-context";

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
      active: pathname === '/admin' || pathname === '/admin/dashboard'
    },
    { 
      name: t('admin.projects'), 
      href: '/admin/projects', 
      icon: FileCode,
      active: pathname?.startsWith('/admin/projects')
    },
    { 
      name: t('admin.subscriptions'), 
      href: '/admin/subscriptions', 
      icon: Package,
      active: pathname?.startsWith('/admin/subscriptions')
    },
    { 
      name: t('admin.users'), 
      href: '/admin/users', 
      icon: Users,
      active: pathname?.startsWith('/admin/users')
    },
    { 
      name: t('admin.payments'), 
      href: '/admin/payments', 
      icon: CreditCard,
      active: pathname?.startsWith('/admin/payments')
    },
    { 
      name: t('admin.settings'), 
      href: '/admin/settings', 
      icon: Settings,
      active: pathname?.startsWith('/admin/settings')
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
      }
    },
    open: { 
      opacity: 1, 
      x: 0, 
      width: "100%",
      transition: { 
        duration: 0.3,
      }
    }
  };
  
  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 ${
          scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background/50"
        } transition-all duration-200`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Mobil Menu Button */}
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mr-2 rounded-md p-2 md:hidden hover:bg-accent"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <Link href="/admin" className="flex items-center">
                <Logo size="sm" animated={false} />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <motion.div 
                className="flex space-x-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Bar */}
              <div className="hidden md:flex items-center relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.div 
                      className="relative"
                      variants={searchVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <input
                        type="text"
                        placeholder={t('common.search')}
                        className="h-9 w-full rounded-md border border-input bg-transparent py-1 pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        autoFocus
                        onBlur={() => setSearchOpen(false)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <kbd className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => setSearchOpen(true)}
                      className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label="Search"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Search className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Notification Center */}
              <NotificationsCenter />
              
              {/* Theme Switcher */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
                  className="flex items-center gap-2 pr-1.5"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    AK
                  </span>
                  <span className="hidden sm:block font-medium text-sm">
                    Ali Kaan
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-1 w-56 origin-top-right rounded-md border bg-popover text-popover-foreground shadow-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        <div className="border-b pb-2 mb-2">
                          <div className="px-2 py-1.5">
                            <p className="text-sm font-semibold">Ali Kaan</p>
                            <p className="text-xs text-muted-foreground">admin@codexonx.com</p>
                          </div>
                        </div>
                        
                        <Link
                          href="/admin/profile"
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          {t('admin.profile')}
                        </Link>
                        
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          {t('admin.settings')}
                        </Link>
                        
                        <div className="border-t mt-2 pt-2">
                          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
                            <div className="flex items-center gap-1 flex-1">
                              {languages.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => {
                                    changeLocale(lang.code as any);
                                    setUserMenuOpen(false);
                                  }}
                                  className={`px-2 py-1 rounded text-xs ${
                                    locale === lang.code
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-accent"
                                  }`}
                                >
                                  {lang.code.toUpperCase()}
                                </button>
                              ))}
                            </div>
                            
                            <Link
                              href="/admin/support"
                              className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                          
                          <button
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-destructive/10 hover:text-destructive"
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
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background shadow-lg overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="p-4 border-b">
                <Logo size="sm" />
              </div>
              
              <nav className="p-4">
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center mb-4">
                    <span className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-3">
                      AK
                    </span>
                    <div>
                      <p className="font-medium">Ali Kaan</p>
                      <p className="text-xs text-muted-foreground">admin@codexonx.com</p>
                    </div>
                  </div>
                  
                  <button 
                    className="flex items-center justify-between w-full py-2 px-3 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <div className="flex items-center">
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 mr-3" />
                      ) : (
                        <Moon className="h-5 w-5 mr-3" />
                      )}
                      {theme === "dark" ? t('common.lightMode') : t('common.darkMode')}
                    </div>
                  </button>
                  
                  <div className="flex gap-1 py-2 px-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLocale(lang.code as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-xs ${
                          locale === lang.code
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent/50 hover:bg-accent"
                        }`}
                      >
                        {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    className="flex items-center w-full py-2 px-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 mt-2"
                    onClick={() => {
                      console.log('Çıkış yapılıyor');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t('auth.logout')}
                  </button>
                </div>
              </nav>
              
              <div className="p-4 border-t mt-auto">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">© 2025 Codexonx</p>
                  <Link
                    href="/admin/support"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('admin.getHelp')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Command Menu */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-50 items-start justify-center hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            
            <motion.div
              className="relative w-full max-w-lg mt-32 overflow-hidden rounded-lg border bg-background shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center border-b p-4">
                <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('common.searchCommands')}
                  className="flex-1 bg-transparent outline-none"
                  autoFocus
                />
                <kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">ESC</span>
                </kbd>
              </div>
              
              <div className="p-2">
                <p className="px-2 py-1.5 text-xs text-muted-foreground">
                  {t('common.suggestions')}
                </p>
                
                {commandMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => setSearchOpen(false)}
                  >
                    <span>{item.name}</span>
                    <kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                      {item.shortcut}
                    </kbd>
                  </Link>
                ))}
              </div>
              
              <div className="border-t p-2 text-center">
                <button
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchOpen(false)}
                >
                  <Terminal className="inline h-3 w-3 mr-1" />
                  {t('common.pressKForCommands')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
