import type { ComponentType, ReactNode } from 'react';

import { GlassCard } from '@/components/landing/glass-card';

export type FeatureCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaLabel?: string;
  footnote?: ReactNode;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  ctaLabel = 'Daha fazla keşfet',
  footnote,
}: FeatureCardProps) {
  return (
    <GlassCard
      className="group overflow-hidden bg-card-gradient/70 hover:shadow-halo"
      paddingClassName="p-6"
    >
      <div className="relative space-y-5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-primary-glow transition-base group-hover:scale-105">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center justify-between pt-2 text-xs font-medium text-primary">
          <span className="inline-flex items-center gap-2">
            {ctaLabel}
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9L9 3M9 3H3M9 3V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {footnote ? <span className="text-muted-foreground/70">{footnote}</span> : null}
        </div>
      </div>
    </GlassCard>
  );
}
