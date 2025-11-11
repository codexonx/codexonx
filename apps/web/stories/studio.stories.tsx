import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Boxes,
  CheckCircle2,
  Flame,
  Layers,
  PlayCircle,
  RefreshCcw,
  ShieldCheck,
  TerminalSquare,
  Zap,
} from 'lucide-react';

type AgentLog = {
  id: string;
  agent: string;
  status: 'running' | 'success' | 'queued';
  summary: string;
  duration: string;
};

type RecentProject = {
  id: string;
  name: string;
  updatedAt: string;
  status: 'live' | 'draft';
};

const DEMO_LOGS: AgentLog[] = [
  {
    id: 'log-1',
    agent: 'UI Architect',
    status: 'success',
    summary: 'Dashboard layout oluşturuldu, 3 ana panel hazırlandı.',
    duration: '12 sn',
  },
  {
    id: 'log-2',
    agent: 'API Crafter',
    status: 'running',
    summary: 'Satış verileri ve görev yönetimi API bağlantıları yapılandırılıyor.',
    duration: 'Çalışıyor',
  },
  {
    id: 'log-3',
    agent: 'QA Runner',
    status: 'queued',
    summary: 'E2E senaryoları sıraya alındı. Öngörülen süre: 18 sn.',
    duration: 'Sırada',
  },
];

const DEMO_PROJECTS: RecentProject[] = [
  {
    id: 'proj-1',
    name: 'Atlas HR - Onboarding Akışı',
    updatedAt: '12 dk önce',
    status: 'live',
  },
  {
    id: 'proj-2',
    name: 'Nimbus Analytics - KPI Dashboard',
    updatedAt: '1 saat önce',
    status: 'live',
  },
  {
    id: 'proj-3',
    name: 'Voyager Support - Chat Widget',
    updatedAt: 'Dün',
    status: 'draft',
  },
];

type StudioPreviewProps = {
  initialRunning?: boolean;
};

const StudioPreview = ({ initialRunning = false }: StudioPreviewProps) => {
  const [prompt, setPrompt] = useState(
    'B2B müşteri paneli için KPI grafikleri, satış hunisi ve görev boardu içeren bir dashboard üret.'
  );
  const [logs, setLogs] = useState<AgentLog[]>(() =>
    initialRunning
      ? DEMO_LOGS.map(log =>
          log.status === 'running'
            ? { ...log, summary: `${log.summary} • ajan şu anda çalışıyor` }
            : log
        )
      : DEMO_LOGS
  );
  const [isRunning, setIsRunning] = useState(initialRunning);

  const completionPercentage = useMemo(() => {
    const completed = logs.filter(log => log.status === 'success').length;
    return Math.round((completed / logs.length) * 100);
  }, [logs]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setTimeout(() => {
      setLogs(prev =>
        prev.map(log =>
          log.status === 'running'
            ? { ...log, status: 'success', summary: `${log.summary} ✅`, duration: '14 sn' }
            : log
        )
      );
      setIsRunning(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isRunning]);

  const handleRunPrompt = () => {
    if (!prompt.trim()) {
      return;
    }

    setIsRunning(true);
    setLogs(prev =>
      prev.map(log =>
        log.status === 'success'
          ? log
          : log.status === 'queued'
            ? {
                ...log,
                status: 'running',
                summary: `${log.summary.replace('Sırada', 'Çalışıyor')}`,
              }
            : log
      )
    );
  };

  return (
    <div className="flex min-h-[640px] w-full flex-col gap-6 rounded-3xl border border-border/40 bg-background p-6">
      <header className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-surface p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
            Codexonx Studio
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            Prompt odaklı agentik üretim deneyimi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-full">
            Ayarlar
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
          >
            Deploy Et
          </Button>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <aside className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Projeler</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <Flame className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {DEMO_PROJECTS.map(project => (
                <li
                  key={project.id}
                  className="rounded-xl border border-border/40 bg-background/80 p-3 transition hover:border-primary/40"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.updatedAt}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-full border-primary/30 text-[11px]',
                        project.status === 'live'
                          ? 'border-emerald-400/40 text-emerald-300'
                          : 'border-accent/40 text-accent'
                      )}
                    >
                      {project.status === 'live' ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground/90">{project.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <Card className="space-y-3 border-border/40 bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
              Ajan Sağlığı
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>UI Architect</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Crafter</span>
                <span className="inline-flex items-center gap-1 text-primary">
                  <RefreshCcw className="h-3.5 w-3.5" /> Güncelleniyor
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>QA Runner</span>
                <span className="inline-flex items-center gap-1 text-accent">
                  <Zap className="h-3.5 w-3.5" /> Hazır
                </span>
              </div>
            </div>
          </Card>
        </aside>

        <section className="space-y-6">
          <Card className="space-y-5 border-border/50 bg-background/90 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Prompt Alanı</h2>
                <p className="text-sm text-muted-foreground">
                  Ne inşa etmek istediğini anlat, ajanlar dakikalar içinde kullanıcı dostu bir ürün
                  hazırlasın.
                </p>
              </div>
              <Badge className="w-fit rounded-full bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground">
                {completionPercentage}% tamamlandı
              </Badge>
            </div>
            <Textarea
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              placeholder="Örn. müşteri içgörü paneli, satış pipeline grafiği ve ekip görev boardu oluştur."
              className="h-32 resize-none border-border/40 bg-surface"
            />
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="rounded-full border-accent/40 text-accent">
                Şablon: SaaS Dashboard
              </Badge>
              <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                Entegrasyon: Stripe, HubSpot
              </Badge>
              <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary">
                Deploy: Vercel
              </Badge>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                size="lg"
                className="gap-2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
                onClick={handleRunPrompt}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    Çalıştırılıyor...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-5 w-5" />
                    Promptu Çalıştır
                  </>
                )}
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Prod kalite güvence aktif
                </span>
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  Versiyon: v0.6.2
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-border/40 bg-background/90 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Ajan Akışı</h3>
                <p className="text-sm text-muted-foreground">
                  Her ajan sürecin belirli bir bölümünden sorumludur. Durum güncellemelerini buradan
                  takip et.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                Toplam {logs.length} görev
              </Badge>
            </div>
            <div className="mt-5 space-y-3">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/40 bg-surface p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <TerminalSquare className="h-4 w-4 text-primary" />
                      {log.agent}
                    </div>
                    <p className="text-sm text-foreground/80">{log.summary}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right text-xs text-muted-foreground">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold',
                        log.status === 'success' && 'bg-emerald-500/15 text-emerald-400',
                        log.status === 'running' && 'bg-primary/15 text-primary',
                        log.status === 'queued' && 'bg-secondary/15 text-secondary'
                      )}
                    >
                      {log.status === 'success'
                        ? 'Tamamlandı'
                        : log.status === 'running'
                          ? 'Çalışıyor'
                          : 'Sırada'}
                    </span>
                    <span>{log.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="border-border/40 bg-background/90 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Önizleme</h3>
                <p className="text-sm text-muted-foreground">
                  Üretilen arayüzü gerçek zamanlı olarak burada gözlemle.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full border-secondary/40 text-secondary">
                Live
              </Badge>
            </div>
            <div className="mt-5 rounded-2xl border border-border/40 bg-surface/70 p-4 shadow-inner">
              <div className="rounded-xl border border-border/40 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/60">
                  Dashboard Önizleme
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-border/40 bg-surface p-4 text-sm text-muted-foreground/90">
                    KPI Grafikleri
                  </div>
                  <div className="rounded-xl border border-border/40 bg-surface p-4 text-sm text-muted-foreground/90">
                    Satış Hunisi
                  </div>
                  <div className="rounded-xl border border-border/40 bg-surface p-4 text-sm text-muted-foreground/90">
                    Görev Boardu
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border/40 bg-background/90 p-6">
            <h3 className="text-lg font-semibold text-foreground">Çalışma Alanı Kaynakları</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Boxes className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Kod Paketleri</p>
                  <p>React, Tailwind, Next.js + serverless API şablonları.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Layers className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Playground Modu</p>
                  <p>Üretilen ekranları ekip içinde paylaş, yorum topla.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 text-secondary" />
                <div>
                  <p className="font-medium text-foreground">Sürüm Geçmişi</p>
                  <p>Her prompt koşusunda otomatik snapshot oluşturulur.</p>
                </div>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
};

const meta: Meta<typeof StudioPreview> = {
  title: 'Design System/Studio/Overview',
  component: StudioPreview,
  decorators: [
    Story => (
      <div className="min-h-screen bg-background p-10 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StudioPreview>;

export const Default: Story = {
  render: () => <StudioPreview />,
};

export const PromptRunning: Story = {
  render: () => <StudioPreview initialRunning />,
};
