'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import '@/styles/statistics.css';

interface ProgressBarProps {
  percentage: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  containerClassName?: string;
  animated?: boolean;
  height?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string | React.ReactNode;
  showLabel?: boolean;
  labelPosition?: 'right' | 'top' | 'bottom';
}

export function ProgressBar({
  percentage,
  variant = 'primary',
  className,
  containerClassName,
  animated = false,
  height = 'md',
  label,
  showLabel = false,
  labelPosition = 'right',
}: ProgressBarProps) {
  // Çubuk yüksekliğini belirle
  const heightClass = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[height];

  // Sınıfları oluştur
  const containerClasses = cn('codexonx-progress-container', heightClass, containerClassName);

  const barClasses = cn(
    'codexonx-progress-bar',
    `codexonx-progress-${variant}`,
    animated && 'codexonx-progress-animated',
    className
  );

  // Genişlik için sınıf adı oluştur (CSS içinde tanımlanacak)
  const widthClass = `codexonx-progress-width-${Math.round(percentage / 5) * 5}`;

  // Label render
  const renderLabel = () => {
    if (!showLabel) return null;

    const labelContent = label || `${Math.round(percentage)}%`;

    return (
      <div className={`codexonx-progress-label codexonx-progress-label-${labelPosition}`}>
        {labelContent}
      </div>
    );
  };

  return (
    <div className="codexonx-progress">
      {labelPosition === 'top' && renderLabel()}

      <div className={containerClasses}>
        <div className={cn(barClasses, widthClass)} data-percentage={percentage} />
      </div>

      {(labelPosition === 'right' || labelPosition === 'bottom') && renderLabel()}
    </div>
  );
}
