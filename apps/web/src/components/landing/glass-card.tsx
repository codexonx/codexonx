'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const surfaceMap: Record<'default' | 'muted' | 'primary', string> = {
  default: 'bg-card-gradient/80 text-card-foreground',
  muted: 'bg-background/40 text-muted-foreground',
  primary: 'bg-aurora-primary text-primary-foreground shadow-halo',
};

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Controls the background treatment of the card.
   */
  surface?: 'default' | 'muted' | 'primary';
  /**
   * When true, adds a subtle glow effect around the card.
   */
  glow?: boolean;
  /**
   * Extra padding utilities applied to the inner content wrapper.
   * Pass `null` to remove default padding.
   */
  paddingClassName?: string | null;
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, children, surface = 'default', glow = false, paddingClassName = 'p-xl', ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'glass-panel glass-overlay rounded-3xl border border-white/12 transition-base',
        surfaceMap[surface],
        glow && 'halo-primary',
        className
      )}
      {...props}
    >
      <div className={cn(paddingClassName ?? undefined, 'relative z-[1]')}>{children}</div>
    </div>
  )
);
GlassCard.displayName = 'GlassCard';

export { GlassCard };
