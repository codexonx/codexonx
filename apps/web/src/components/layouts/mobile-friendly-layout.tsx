import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import MobileNavBar from '@/components/mobile/mobile-nav-bar';

interface MobileFriendlyLayoutProps {
  children: React.ReactNode;
  className?: string;
  showMobileNav?: boolean;
}

/**
 * Mobil dostu düzen bileşeni
 * 
 * Bu bileşen, responsive tasarımı kolaylaştırmak için mobil cihazlara 
 * özel düzenlemeler içerir.
 */
export function MobileFriendlyLayout({ 
  children, 
  className = '',
  showMobileNav = true
}: MobileFriendlyLayoutProps) {
  // Ekran boyutunu kontrol et
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  return (
    <div className={cn(
      'mobile-friendly-layout',
      {
        'has-mobile-nav': showMobileNav && isMobile,
        'is-mobile': isMobile,
        'is-tablet': isTablet,
      },
      className
    )}>
      <div className="page-content pb-16 md:pb-0">
        {children}
      </div>
      
      {/* Mobil cihazlar için alt navigasyon */}
      {showMobileNav && isMobile && <MobileNavBar />}
    </div>
  );
}
