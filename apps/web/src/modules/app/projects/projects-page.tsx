'use client';

import Link from 'next/link';

import { useWorkspace } from '@/contexts/workspace-context';
import { mockProjects } from '@/services/mock-data';

const templates = [
  {
    id: 'nextjs-saas',
    name: 'Next.js SaaS Starter',
    description: 'SHADCN + Tailwind + Supabase ile tam donanımlı SaaS başlangıç şablonu.',
  },
  {
    id: 'fastapi-ml',
    name: 'FastAPI Machine Learning',
    description: 'ML servisleri için FastAPI + Celery + Redis pipeline şablonu.',
  },
  {
    id: 'express-realtime',
    name: 'Express Realtime Dashboard',
    description: 'Socket.io destekli gerçek zamanlı metrik panosu.',
  },
];

export function ProjectsPage() {
  const { activeWorkspace } = useWorkspace();
  const workspaceProjects = activeWorkspace
    ? mockProjects.filter(project => project.workspaceId === activeWorkspace.id)
    : [];

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Projeler</h1>
        <p className="text-sm text-muted-foreground">
          Yeni workspace oluşturun veya mevcut projeleri yönetin.
        </p>
        {activeWorkspace ? (
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
            Aktif workspace: {activeWorkspace.name}
          </p>
        ) : null}
      </header>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Mevcut projeler</h2>
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-background/60 p-6">
          {activeWorkspace ? (
            workspaceProjects.length > 0 ? (
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {workspaceProjects.map(project => (
                  <li key={project.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-foreground">
                        {project.name}
                      </span>
                      <span className="text-xs uppercase tracking-[0.3em] text-primary/70">
                        Şablon: {project.template}
                      </span>
                      <span className="text-xs text-muted-foreground/80">
                        Son aktivite: {new Date(project.lastActivity).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bu workspace için henüz proje oluşturulmadı.
              </p>
            )
          ) : (
            <p className="text-sm text-muted-foreground">Workspace verisi yükleniyor...</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {templates.map(template => (
          <div
            key={template.id}
            className="rounded-2xl border border-white/10 bg-background/70 p-5 shadow-sm backdrop-blur"
          >
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">{template.name}</h2>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <Link
                href={`/app/projects/new?template=${template.id}`}
                className="inline-flex text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Use template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectsPage;
