'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useWorkspace } from '@/contexts/workspace-context';

const navigation = [
  { label: 'Dashboard', href: '/app' },
  { label: 'Projects', href: '/app/projects' },
  { label: 'Editor', href: '/app/editor' },
  { label: 'AI Agent', href: '/app/ai-agent' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();

  return (
    <div className="grid min-h-screen grid-cols-[280px_minmax(0,1fr)] bg-background text-foreground">
      <aside className="flex flex-col gap-6 border-r border-white/10 bg-background/60 p-6">
        <Link href="/" className="text-lg font-semibold">
          Codexonx
        </Link>
        <div className="space-y-2 text-xs text-muted-foreground">
          <label className="flex flex-col gap-1 text-[0.7rem] uppercase tracking-[0.3em]">
            Workspace
            <select
              className="rounded-lg border border-white/10 bg-background/80 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
              value={activeWorkspace?.id ?? ''}
              onChange={event => setActiveWorkspace(event.target.value)}
            >
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav className="space-y-2 text-sm text-muted-foreground">
          {navigation.map(item => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 transition hover:bg-primary/10 hover:text-primary',
                  isActive && 'bg-primary/10 text-primary shadow-sm'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Workspace usage</p>
          <p className="mt-2">Editor dakikası, LLM isteği ve depolama limitlerinizi takip edin.</p>
        </div>
      </aside>
      <main className="min-h-screen bg-background/80">
        <div className="border-b border-white/5 bg-background/80 px-8 py-5 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground/80"
            >
              <span className="text-muted-foreground/60">Workspace</span>
              <span>•</span>
              <span className="text-foreground">
                {activeWorkspace?.name ?? 'Seçili workspace yok'}
              </span>
            </nav>
            <div className="flex items-center gap-3 text-xs">
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-muted-foreground transition hover:text-foreground">
                {activeWorkspace ? `${activeWorkspace.name} actions` : 'Quick actions'}
              </button>
              <button className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary transition hover:bg-primary/20">
                {activeWorkspace?.plan === 'Enterprise' ? 'Request deploy' : 'New deploy'}
              </button>
            </div>
          </div>
        </div>
        <div className="px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
