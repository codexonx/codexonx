'use client';

import { useMemo } from 'react';

import { useWorkspace } from '@/contexts/workspace-context';
import { mockAgentThreads } from '@/services/mock-data';

export function AIAgentPage() {
  const { activeWorkspace } = useWorkspace();

  const threads = useMemo(() => {
    if (!activeWorkspace) {
      return [];
    }
    return mockAgentThreads.filter(thread => thread.workspaceId === activeWorkspace.id);
  }, [activeWorkspace]);

  if (!activeWorkspace) {
    return (
      <section className="space-y-6">
        <p className="text-sm text-muted-foreground">Workspace verisi yükleniyor...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">AI Agent Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Ajan planlama, görev listeleri ve prompt geçmişi burada görüntülenecek.
        </p>
      </header>

      <div className="grid gap-4">
        {threads.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-background/70 p-6 text-sm text-muted-foreground">
            Bu workspace için ajan ileti dizisi bulunamadı.
          </div>
        ) : (
          threads.map(thread => (
            <div
              key={thread.id}
              className="rounded-2xl border border-white/10 bg-background/70 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="uppercase tracking-[0.35em] text-primary/70">{thread.role}</span>
                <span>{new Date(thread.updatedAt).toLocaleString('tr-TR')}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">{thread.projectId}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{thread.lastMessage}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10">
                Open thread
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AIAgentPage;
