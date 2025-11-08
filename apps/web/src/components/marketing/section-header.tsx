import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SectionHeaderAlign = 'left' | 'center';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeaderAlign;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
};

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border/70 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary/90 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  titleClassName,
  descriptionClassName,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-3xl flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      <h2
        className={cn(
          'text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
          'bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('text-base text-muted-foreground sm:text-lg', descriptionClassName)}>
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
