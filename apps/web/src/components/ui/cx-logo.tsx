'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import '@/styles/codexonx-design-system.css';
import '@/styles/logo.css';

interface CXLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
}

export function CXLogo({ size = 'md', variant = 'full', animated = true, className }: CXLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const primaryColor = isDark ? 'rgb(var(--codexonx-primary))' : 'rgb(var(--codexonx-primary))';
  const secondaryColor = isDark
    ? 'rgb(var(--codexonx-secondary))'
    : 'rgb(var(--codexonx-secondary))';
  const accentColor = isDark ? 'rgb(var(--codexonx-accent))' : 'rgb(var(--codexonx-accent))';

  // Logo animasyon ayarları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        delay: 0.6,
      },
    },
  };

  // Logo ikonunun boyutu
  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 'w-5 h-5';
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-8 h-8';
      case 'lg':
        return 'w-10 h-10';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  // CX logo ikonu bileşeni
  const IconLogo = () => (
    <motion.div
      className={cn(getIconSize(), 'relative')}
      initial={animated ? 'hidden' : 'visible'}
      animate="visible"
      variants={animated ? containerVariants : undefined}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Dış çember */}
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          stroke={primaryColor}
          strokeWidth="6"
          fill="none"
          variants={animated ? pathVariants : undefined}
          className={animated ? 'codexonx-logo-spin-slow' : ''}
        />

        {/* İç çember */}
        <motion.circle
          cx="40"
          cy="40"
          r="28"
          fill={secondaryColor}
          fillOpacity="0.1"
          variants={animated ? circleVariants : undefined}
        />

        {/* C harfi */}
        <motion.path
          d="M30 30C27 30 25 33 25 40C25 47 27 50 30 50C32 50 34 49 35 47"
          stroke={accentColor}
          strokeWidth="6"
          strokeLinecap="round"
          variants={animated ? pathVariants : undefined}
        />

        {/* X harfi */}
        <motion.path
          d="M45 30L55 50"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
          variants={animated ? pathVariants : undefined}
        />

        <motion.path
          d="M55 30L45 50"
          stroke={primaryColor}
          strokeWidth="6"
          strokeLinecap="round"
          variants={animated ? pathVariants : undefined}
        />

        {/* Noktalar */}
        <motion.circle
          cx="20"
          cy="40"
          r="3"
          fill={secondaryColor}
          variants={animated ? circleVariants : undefined}
          className={animated ? 'codexonx-logo-pulse' : ''}
        />

        <motion.circle
          cx="60"
          cy="40"
          r="3"
          fill={secondaryColor}
          variants={animated ? circleVariants : undefined}
          className={animated ? 'codexonx-logo-pulse' : ''}
        />
      </svg>
    </motion.div>
  );

  // Marka metni
  const TextLogo = () => (
    <motion.span
      className={`codexonx-logo-text codexonx-logo-${size}`}
      variants={animated ? textVariants : undefined}
      initial={animated ? 'hidden' : 'visible'}
      animate="visible"
    >
      <span className="codexonx-logo-text-primary">Codex</span>
      <span className="codexonx-logo-text-secondary">onx</span>
    </motion.span>
  );

  // Sadece ikon
  if (variant === 'icon') {
    return <IconLogo />;
  }

  // Sadece metin
  if (variant === 'text') {
    return <TextLogo />;
  }

  // Tam logo (ikon + metin)
  return (
    <div className={cn('codexonx-logo-container', className)}>
      <IconLogo />
      <TextLogo />
    </div>
  );
}
