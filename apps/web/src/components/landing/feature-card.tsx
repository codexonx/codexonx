import type { ComponentType } from 'react';

export type FeatureCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaLabel?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  ctaLabel = 'Daha fazla keşfet',
}: FeatureCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-background/50 p-6 hover-lift">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <div className="h-full w-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
      </div>
      <div className="relative space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-primary-glow transition-base group-hover:scale-105">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
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
        </div>
      </div>
    </article>
  );
}
