export type BrandMarkProps = {
  className?: string;
  subtitle?: string;
};

export function BrandMark({ className, subtitle = 'AI Flow Suite' }: BrandMarkProps) {
  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground shadow-primary-glow">
        <span className="font-mono text-sm font-semibold tracking-[0.35em] text-primary-foreground">
          CX
        </span>
      </span>
      <div className="flex flex-col">
        <span className="font-display text-2xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
          Codexonx
        </span>
        <span className="text-xs uppercase tracking-[0.45em] text-muted-foreground/80">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
