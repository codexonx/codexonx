import React from 'react';
// Link yerine doğrudan a elementi kullanacağız
import { usePathname } from 'next/navigation';
// Basitleştirilmiş icon yaklaşımı
import * as Icons from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { cn } from '@/lib/utils';

// Tip tanımlamaları
interface NavItem {
  href: string;
  label: string;
  iconName: keyof typeof Icons;
  active: boolean;
}

/**
 * Mobil cihazlar için alt navigasyon çubuğu
 */
export default function MobileNavBar() {
  const pathname = usePathname();
  const { t } = useI18n();
  
  // Navigasyon öğeleri
  const navItems: NavItem[] = [
    {
      href: '/',
      label: t('nav.dashboard'),
      iconName: 'Home',
      active: pathname === '/',
    },
    {
      href: '/projects',
      label: t('nav.projects'),
      iconName: 'Layout',
      active: pathname === '/projects' || pathname.startsWith('/projects/'),
    },
    {
      href: '/profile',
      label: t('nav.profile'),
      iconName: 'User',
      active: pathname === '/profile',
    },
    {
      href: '/settings',
      label: t('nav.settings'),
      iconName: 'Settings',
      active: pathname === '/settings',
    },
  ];
  
  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        // Lucide ikonlarını ad üzerinden çağıralım
        const Icon = Icons[item.iconName];
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn('mobile-nav-item', {
              'active': item.active,
            })}
          >
            <div className="mobile-nav-icon">
              {/* @ts-ignore - Basit bir çözüm için tip hatasını görmezden geliyoruz */}
              <Icon className="h-5 w-5" />
            </div>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
