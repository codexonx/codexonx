import Link from 'next/link';

import { mockAgentThreads, mockProjects, mockRunLogs } from '@/services/mock-data';

const formatter = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: 'short',
});

const quickLinks = [
  {
    title: 'Create workspace',
    description: 'Yeni workspace şablonu başlatın.',
    href: '/app/projects/new',
  },
  mockProjects[0]
    ? {
        title: `${mockProjects[0].name}`,
        description: 'Canlı editörde çalışmaya devam edin.',
        href: `/app/projects/${mockProjects[0].id}`,
      }
    : null,
  {
    title: 'Invite team',
    description: 'Takım arkadaşlarınızı davet ederek birlikte çalışın.',
    href: '/app/settings/team',
  },
].filter(Boolean) as { title: string; description: string; href: string }[];

const recentLogs = mockRunLogs.slice(0, 3);
const agentThreads = mockAgentThreads.slice(0, 3);

export function DashboardPage() {
  return (
    <section className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Hoş geldiniz</h1>
        <p className="text-sm text-muted-foreground">
          Canlı kod editörü, proje sihirbazı ve üretim pipeline’ınız burada birleşiyor.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-background/80 p-6 shadow-sm backdrop-blur">
          <h2 className="text-base font-semibold text-foreground">Hızlı eylemler</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {quickLinks.map(item => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground transition hover:border-primary/40 hover:bg-primary/10"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-background/80 p-6 shadow-sm backdrop-blur">
          <h2 className="text-base font-semibold text-foreground">Son aktiviteler</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recentLogs.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{item.message}</p>
                  <p className="text-xs text-muted-foreground">{item.projectId}</p>
                </div>
                <span className="text-xs font-semibold text-primary">
                  {formatter.format(new Date(item.timestamp))}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {agentThreads.map(thread => (
          <div
            key={thread.id}
            className="rounded-2xl border border-white/10 bg-background/80 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-primary/70">
              <span>{thread.role}</span>
              <span>{formatter.format(new Date(thread.updatedAt))}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{thread.projectId}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{thread.lastMessage}</p>
            <Link
              href={`/app/ai-agent?thread=${thread.id}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              Open thread
            </Link>
          </div>
        ))}
      </section>
    </section>
  );
}

export default DashboardPage;
