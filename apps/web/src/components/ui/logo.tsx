'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import '@/styles/codexonx-design-system.css';
import '@/styles/logo.css';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
}

export function Logo({ size = 'md', variant = 'full', animated = true, className }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Logo renkleri CSS değişkenlerinden geliyor

  // Logo boyutu
  const sizeMap = {
    xs: { logoSize: 20, fontSize: 'text-sm' },
    sm: { logoSize: 28, fontSize: 'text-lg' },
    md: { logoSize: 36, fontSize: 'text-2xl' },
    lg: { logoSize: 48, fontSize: 'text-3xl' },
    xl: { logoSize: 64, fontSize: 'text-4xl' },
  };

  const { logoSize, fontSize } = sizeMap[size];

  // SVG animasyon varyasyonları
  const logoVariants = {
    hidden: {
      opacity: 0,
      rotate: -90,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        delay: 0.1,
      },
    },
  };

  const pathVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: {
          duration: 1,
          ease: 'easeInOut',
          delay: 0.2 + i * 0.2,
        },
        opacity: {
          duration: 0.4,
          delay: 0.2 + i * 0.1,
        },
      },
    }),
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        delay: 0.8,
      },
    },
  };

  // Logo ikonu
  const renderIcon = () => (
    <motion.svg
      width={logoSize}
      height={logoSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      variants={animated ? logoVariants : undefined}
      initial={animated ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* Hexagon ana şekli */}
      <motion.path
        d="M16 2L29.8564 10V26L16 34L2.14359 26V10L16 2Z"
        className="codexonx-logo-svg-path-primary"
        variants={animated ? pathVariants : undefined}
        custom={0}
        initial={animated ? 'hidden' : 'visible'}
        animate="visible"
      />

      {/* C harfi */}
      <motion.path
        d="M19 11C17.4087 11 15.8826 11.6321 14.7574 12.7574C13.6321 13.8826 13 15.4087 13 17C13 18.5913 13.6321 20.1174 14.7574 21.2426C15.8826 22.3679 17.4087 23 19 23"
        className="codexonx-logo-svg-path-secondary"
        variants={animated ? pathVariants : undefined}
        custom={1}
        initial={animated ? 'hidden' : 'visible'}
        animate="visible"
      />

      {/* X harfi */}
      <motion.path
        d="M21 11L16 17L21 23"
        className="codexonx-logo-svg-path-secondary"
        variants={animated ? pathVariants : undefined}
        custom={2}
        initial={animated ? 'hidden' : 'visible'}
        animate="visible"
      />
    </motion.svg>
  );

  // Marka metni
  const renderText = () => (
    <motion.span
      className={cn('codexonx-logo-text font-bold tracking-tight', fontSize)}
      variants={animated ? textVariants : undefined}
      initial={animated ? 'hidden' : 'visible'}
      animate="visible"
    >
      <span className="codexonx-logo-text-primary">Codex</span>
      <span className="codexonx-logo-text-secondary">onx</span>
    </motion.span>
  );

  // İstenilen varyanta göre logo bileşenini oluştur
  if (variant === 'icon') {
    return <div className={className}>{renderIcon()}</div>;
  }

  if (variant === 'text') {
    return <div className={className}>{renderText()}</div>;
  }

  // Full logo (ikon + metin)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {renderIcon()}
      {renderText()}
    </div>
  );
}
