import { cn } from '@/lib/utils';

export type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'center',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn(
        'flex flex-col gap-sm text-balance',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        'max-w-3xl',
        className
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="text-base text-muted-foreground md:text-lg md:leading-relaxed">{lead}</p>
      ) : null}
    </div>
  );
}
