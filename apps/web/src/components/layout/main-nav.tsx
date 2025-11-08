'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CodeXonXLogo } from '@/components/ui/codexonx-logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button, buttonVariants } from '@/components/ui/button';

// Simple scrollable container
const ScrollArea = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('overflow-y-auto', className)} {...props}>
    {children}
  </div>
);

// Mobile sheet component for side menu
interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => {
  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, onOpenChange } as any);
        }
        return child;
      })}
    </div>
  );
};

// Sheet trigger button
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const SheetTrigger = ({ children, asChild = false, ...props }: SheetTriggerProps) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        (props as any).onOpenChange?.(true);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={e => {
        props.onClick?.(e as any);
        (props as any).onOpenChange?.(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Sheet content container
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

const SheetContent = ({ side = 'right', className, children, ...props }: SheetContentProps) => {
  const position = {
    top: 'top-0 right-0 left-0',
    right: 'top-0 right-0 bottom-0',
    bottom: 'right-0 bottom-0 left-0',
    left: 'top-0 bottom-0 left-0',
  }[side];

  return (
    <div className={cn('fixed z-50 bg-background shadow-lg', position, className)} {...props}>
      {children}
    </div>
  );
};

const navItems = [
  { name: 'Ana Sayfa', href: '/', isActive: true },
  { name: 'Özellikler', href: '#features' },
  { name: 'Fiyatlandırma', href: '#pricing' },
  { name: 'Dokümantasyon', href: '/docs' },
  { name: 'Blog', href: '/blog' },
];

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <CodeXonXLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'px-4 h-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground'
              )}
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className={cn(
                buttonVariants({ size: 'sm' }),
                'px-4 h-9 rounded-md text-sm font-medium bg-primary hover:bg-primary/90'
              )}
            >
              Ücretsiz Başla
            </Link>
          </div>
          <ThemeToggle />

          {/* Mobile Navigation Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex h-16 items-center px-6 border-b">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <CodeXonXLogo size="sm" />
                </Link>
              </div>
              <ScrollArea className="h-[calc(100vh-64px)] p-6">
                <nav className="flex flex-col space-y-4">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'py-2 text-base font-medium transition-colors hover:text-foreground/80',
                        pathname === item.href ||
                          (item.href !== '/' && pathname?.startsWith(item.href))
                          ? 'text-foreground font-semibold'
                          : 'text-foreground/60'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Link
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: 'outline' }), 'w-full mb-3')}
                      onClick={() => setIsOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/register"
                      className={cn(buttonVariants(), 'w-full bg-primary hover:bg-primary/90')}
                      onClick={() => setIsOpen(false)}
                    >
                      Ücretsiz Başla
                    </Link>
                  </div>
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
