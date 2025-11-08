import { ReactNode } from 'react';
import { SectionHeader } from './section-header';
import { cn } from '@/lib/utils';

type MarketingFeature = {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  badge?: string;
};

type FeatureGridProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  features: MarketingFeature[];
  columns?: 2 | 3;
  className?: string;
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <section className={cn('relative py-20 sm:py-24', className)}>
      <div className="container px-4 md:px-6">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div
          className={cn(
            'mt-16 grid gap-8',
            columns === 2 ? 'md:grid-cols-2 md:gap-10' : 'md:grid-cols-2 xl:grid-cols-3 md:gap-10'
          )}
        >
          {features.map(feature => (
            <article
              key={feature.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-8 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    {feature.badge ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
                        {feature.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
              {feature.href ? (
                <a
                  href={feature.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Daha fazla öğren
                  <span
                    aria-hidden
                    className="translate-x-0 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              ) : null}
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
