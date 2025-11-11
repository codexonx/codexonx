type CollaborationActivityType = 'join' | 'leave' | 'cursor' | 'speaking';

type CollaborationActivity = {
  id: string;
  userId: string;
  message: string;
  type: CollaborationActivityType;
  timestamp: string;
};

('use client');

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { AICodeEditor } from '@/components/ai/ai-code-editor';
import { cn } from '@/lib/utils';
import type { CodeAnalysisResult, CollaborationPresence } from '@codexonx/core';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  FileCode,
  Folder,
  GitBranch,
  Loader,
  Monitor,
  Moon,
  PlayCircle,
  Plus,
  Save,
  Settings,
  Smartphone,
  Sparkles,
  Lightbulb,
  Info,
  AlertCircle,
  Users,
  Clock,
  Sun,
  Tablet,
  Terminal,
  Zap,
} from 'lucide-react';

type IconComponent = typeof ArrowLeft;

type StudioFolder = {
  id: string;
  name: string;
};

type StudioFile = {
  id: string;
  name: string;
  language: 'tsx' | 'css' | 'md';
  content: string;
  folderId: string;
};

type RunLog = {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: string;
};

type PromptNote = {
  id: string;
  label: string;
  checked: boolean;
};

type QuickAction = {
  id: string;
  title: string;
  description: string;
  shortcut: string;
  icon: IconComponent;
};

type SuggestionStatus = 'idle' | 'queued' | 'in-progress' | 'completed' | 'dismissed';

type SuggestionState = {
  status: SuggestionStatus;
  note: string;
  lastUpdated: string;
  progress?: number;
};

type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'pending';
};

type TestSuite = {
  id: string;
  name: string;
  result: 'pass' | 'running' | 'pending';
  duration: string;
  coverage: string;
  progress?: number;
  statusNote?: string;
};

type PreviewMetric = {
  id: string;
  label: string;
  value: string;
  trend?: string;
};

type PreviewActivity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

type PreviewTheme = 'violet' | 'emerald' | 'amber';

type PreviewState = {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  metrics: PreviewMetric[];
  activity: PreviewActivity[];
  theme: PreviewTheme;
};

const initialFiles: StudioFile[] = [
  {
    id: 'file-index',
    name: 'index.tsx',
    language: 'tsx',
    content: `import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="space-y-6 bg-surface px-6 py-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.4em] text-primary/70">
          Codexonx Studio
        </span>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          AI destekli üretken kod deneyimi
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          İhtiyaçlarını kısa bir prompt ile anlat, ajanlarımız responsive UI, backend entegrasyonu
          ve QA senaryolarını dakikalar içinde hazırlasın.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button className="rounded-full px-6">Projeyi Başlat</Button>
        <Button variant="outline" className="rounded-full border-dashed">
          Canlı önizlemeyi aç
        </Button>
      </div>
    </section>
  );
}
`,
    folderId: 'folder-src',
  },
  {
    id: 'file-styles',
    name: 'styles.css',
    language: 'css',
    content: `:root {
  --hero-gradient: radial-gradient(circle at top, rgba(80,110,255,0.16), transparent 60%);
}

.hero-shell {
  background: var(--hero-gradient);
}

.kpi-card {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(148,163,184,0.14);
  background: rgba(15,23,42,0.55);
}
`,
    folderId: 'folder-styles',
  },
  {
    id: 'file-readme',
    name: 'README.md',
    language: 'md',
    content: `## Proje Özeti

- Prompt tabanlı UI üretim deneyimi
- Gerçek zamanlı önizleme paneli
- Deploy ve entegrasyon işleri tek tıkla
`,
    folderId: 'folder-docs',
  },
];

const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  idle: 'Hazır',
  queued: 'Kuyrukta',
  'in-progress': 'Ajanlarda',
  completed: 'Tamamlandı',
  dismissed: 'Kaldırıldı',
};

const SUGGESTION_STATUS_TONES: Record<SuggestionStatus, string> = {
  idle: 'border-border/40 text-foreground/70',
  queued: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
  'in-progress': 'border-primary/40 bg-primary/10 text-primary',
  completed: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
  dismissed: 'border-border/40 bg-surface/80 text-muted-foreground',
};

const initialPreview: PreviewState = {
  heroTagline: 'Yeni Nesil Operasyon Akışı',
  heroTitle: 'Takımınız için akıllı çalışma alanı',
  heroSubtitle:
    'Tek bir prompt ile grid düzeni, tematik şablonlar ve entegrasyonları dakikalar içinde üretin.',
  primaryCta: 'Canlıya Al',
  secondaryCta: 'Figma içe aktar',
  metrics: [
    { id: 'metric-visitors', label: 'Ziyaretçi', value: '14.2K', trend: '+18%' },
    { id: 'metric-conversion', label: 'Dönüşüm', value: '%4.7', trend: '+6%' },
    { id: 'metric-uptime', label: 'Uptime', value: '99.95%', trend: 'Sabit' },
  ],
  activity: [
    {
      id: 'activity-1',
      title: 'UI Architect',
      description: 'Yeni hero bileşenleri deploy için hazırlandı.',
      timestamp: '2dk önce',
    },
    {
      id: 'activity-2',
      title: 'API Crafter',
      description: 'Stripe webhook senaryosu güncellendi.',
      timestamp: '5dk önce',
    },
  ],
  theme: 'violet',
};

const PREVIEW_THEMES: PreviewTheme[] = ['violet', 'emerald', 'amber'];

type PreviewThemeToken = {
  wrapper: string;
  accent: string;
  badge: string;
};

const previewThemeTokens: Record<PreviewTheme, PreviewThemeToken> = {
  violet: {
    wrapper:
      'border-violet-500/30 bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-transparent shadow-violet-500/10',
    accent: 'text-violet-200',
    badge: 'bg-violet-500/15 text-violet-100 border-violet-500/40',
  },
  emerald: {
    wrapper:
      'border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-transparent shadow-emerald-500/10',
    accent: 'text-emerald-200',
    badge: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/40',
  },
  amber: {
    wrapper:
      'border-amber-500/30 bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-transparent shadow-amber-500/10',
    accent: 'text-amber-200',
    badge: 'bg-amber-500/15 text-amber-900 border-amber-500/40',
  },
};

const TEST_RESULT_TONES: Record<TestSuite['result'], string> = {
  pass: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  running: 'border-primary/30 bg-primary/10 text-primary',
  pending: 'border-border/40 bg-surface/80 text-muted-foreground',
};

const TEST_RESULT_LABELS: Record<TestSuite['result'], string> = {
  pass: 'Geçti',
  running: 'Çalışıyor',
  pending: 'Sırada',
};

const PREVIEW_TAGLINES = [
  'Anında üretim deneyimi',
  'Geliştirme sürecine turbo hız',
  'Takımınız için akıllı senaryolar',
  'Yapay zekâ destekli operasyonlar',
] as const;

const CTA_PRIMARY_OPTIONS = [
  'Hemen başlat',
  'Deploy et',
  'Üretimi paylaş',
  'Süreci başlat',
] as const;
const CTA_SECONDARY_OPTIONS = [
  'Testleri görüntüle',
  'Figma içe aktar',
  'Blueprint indir',
  'Ajanları ata',
] as const;

const PREVIEW_METRIC_TEMPLATES: PreviewMetric[][] = [
  [
    { id: 'metric-visitors', label: 'Aktif kullanıcı', value: '18.4K', trend: '+12%' },
    { id: 'metric-conversion', label: 'Dönüşüm', value: '%5.2', trend: '+8%' },
    { id: 'metric-velocity', label: 'Teslimat hızı', value: 'x3.1', trend: '+2%' },
  ],
  [
    { id: 'metric-uptime', label: 'Uptime', value: '99.98%', trend: 'Sabit' },
    { id: 'metric-automation', label: 'Otomasyon', value: '%72', trend: '+5%' },
    { id: 'metric-feedback', label: 'Kullanıcı memnuniyeti', value: '%94', trend: '+3%' },
  ],
];

const PREVIEW_ACTIVITY_SNIPPETS: PreviewActivity[] = [
  {
    id: 'activity-blueprint',
    title: 'UI Architect',
    description: 'Yeni ekran blueprint’i oluşturuldu.',
    timestamp: 'az önce',
  },
  {
    id: 'activity-integrations',
    title: 'API Crafter',
    description: 'Webhook eşlemeleri güncellendi.',
    timestamp: '1 dk önce',
  },
  {
    id: 'activity-qa',
    title: 'QA Runner',
    description: 'Smoke testleri sıraya alındı.',
    timestamp: '2 dk önce',
  },
];

const MAX_PREVIEW_ACTIVITY = 4;

const pickRandom = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const initialFolders: StudioFolder[] = [
  { id: 'folder-src', name: 'src' },
  { id: 'folder-styles', name: 'styles' },
  { id: 'folder-docs', name: 'docs' },
];

const WORKFLOW_STATUS_TONES: Record<WorkflowStep['status'], string> = {
  done: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  'in-progress': 'border-primary/30 bg-primary/10 text-primary',
  pending: 'text-muted-foreground',
};

const initialNotes: PromptNote[] = [
  { id: 'note-1', label: 'Responsive grid yapısı korunsun', checked: true },
  { id: 'note-2', label: 'Karanlık tema için yüksek kontrast', checked: true },
  { id: 'note-3', label: 'Form validasyon mesajlarını ekle', checked: false },
];

const initialRunLogs: RunLog[] = [
  {
    id: 'run-1',
    type: 'info',
    message: 'Temel bileşenler projeye aktarıldı.',
    timestamp: '14:06',
  },
  {
    id: 'run-2',
    type: 'success',
    message: 'Son koşuda 4 bileşen otomatik testten geçti.',
    timestamp: '13:42',
  },
];

const quickActions: QuickAction[] = [
  {
    id: 'action-template',
    title: 'SaaS dashboard şablonu',
    description: 'Hero, KPI kartları ve fiyatlandırma bölümleri hazır gelir.',
    shortcut: '⇧ + S',
    icon: Sparkles,
  },
  {
    id: 'action-backend',
    title: 'API senkron entegrasyonu',
    description: 'Stripe, HubSpot ve dahili webhookları tek tıkla bağla.',
    shortcut: '⌘ + K',
    icon: GitBranch,
  },
  {
    id: 'action-theme',
    title: 'Tema uyarlayıcısını aç',
    description: 'Marka renklerini ve tipografiyi token üzerinden güncelle.',
    shortcut: '⌥ + T',
    icon: Monitor,
  },
];

type AISuggestion = {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
};

const aiSuggestions: AISuggestion[] = [
  {
    id: 'suggestion-hero',
    title: 'Hero bölümüne video arka plan ekle',
    description: 'İlk katmana düşük opaklıkta mp4 ekleyip CTA dönüşümünü %12 artırın.',
    impact: 'high',
  },
  {
    id: 'suggestion-checklist',
    title: 'Prompt checklistini otomatikleştir',
    description: 'Eksik işaretlenen maddeler için ajanlara ek görev oluştur.',
    impact: 'medium',
  },
  {
    id: 'suggestion-accessibility',
    title: 'Kontrast denetimi raporu al',
    description: 'WCAG AA analizi çalıştırıp problemli bileşenleri export et.',
    impact: 'medium',
  },
];

const KEYBOARD_SHORTCUTS = [
  { id: 'shortcut-run', combo: '⌘ + Enter', description: 'Promptu çalıştır' },
  { id: 'shortcut-format', combo: '⌘ + Shift + F', description: 'Kod editörünü formatla' },
  { id: 'shortcut-search', combo: '⌘ + P', description: 'Dosya ara ve aç' },
  { id: 'shortcut-logs', combo: '⌘ + Option + L', description: 'Günlükler sekmesine odaklan' },
];

const AGENTS = ['UI Architect', 'API Crafter', 'QA Runner'] as const;

type AgentId = (typeof AGENTS)[number];
type AgentStatus = 'idle' | 'working' | 'success';

type AgentState = {
  id: AgentId;
  status: AgentStatus;
  description: string;
  lastUpdated: string;
};

const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  idle: 'Beklemede',
  working: 'Çalışıyor',
  success: 'Tamamlandı',
};

const AGENT_STATUS_BADGES: Record<AgentStatus, string> = {
  idle: 'border-border/50 text-muted-foreground',
  working: 'border-amber-400/60 bg-amber-500/10 text-amber-100',
  success: 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100',
};

const workflowSteps: WorkflowStep[] = [
  {
    id: 'step-brief',
    title: 'Brief analiz edildi',
    description: 'Ajanlar prompt içeriğini görev listesine dönüştürdü.',
    status: 'done',
  },
  {
    id: 'step-layout',
    title: 'Arayüz iskeleti',
    description: 'Grid sistemi ve temel bileşenler oluşturuluyor.',
    status: 'in-progress',
  },
  {
    id: 'step-integration',
    title: 'API & otomasyon',
    description: 'Webhook ve veri eşleştirmeleri sıraya alındı.',
    status: 'pending',
  },
];

const initialTestSuites: TestSuite[] = [
  {
    id: 'suite-ui',
    name: 'UI Regression',
    result: 'running',
    duration: '45 sn',
    coverage: '83%',
    progress: 58,
    statusNote: 'Görsel regresyon taraması devam ediyor.',
  },
  {
    id: 'suite-api',
    name: 'API Contract',
    result: 'pass',
    duration: '22 sn',
    coverage: '96%',
    statusNote: 'Swagger sözleşmesi senkron.',
  },
  {
    id: 'suite-qa',
    name: 'E2E Smoke',
    result: 'pending',
    duration: 'Planlanıyor',
    coverage: '—',
    statusNote: 'Sıraya alınmayı bekliyor.',
  },
];

export default function StudioPage() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileId, setActiveFileId] = useState(initialFiles[0].id);
  const [prompt, setPrompt] = useState(
    'B2B ekipleri için görev yönetimi, KPI grafikleri ve entegre müşteri desteği içeren modern bir web uygulaması oluştur.'
  );
  const [notes, setNotes] = useState(initialNotes);
  const [runLogs, setRunLogs] = useState(initialRunLogs);
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'success' | 'warning'>('all');
  const [logSearch, setLogSearch] = useState('');
  const [appliedRecommendedActions, setAppliedRecommendedActions] = useState<
    Record<string, boolean>
  >({});
  const [isRunning, setIsRunning] = useState(false);
  const [saveState, setSaveState] = useState<'Kaydedildi' | 'Kaydediliyor'>('Kaydedildi');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewLive, setIsPreviewLive] = useState(true);
  const [isWrapEnabled, setIsWrapEnabled] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<'prompt' | 'code' | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentId>('UI Architect');
  const [agentsState, setAgentsState] = useState<AgentState[]>(() => {
    const timestamp = new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    return [
      {
        id: 'UI Architect',
        status: 'working',
        description: 'Grid düzenini optimize ediyor',
        lastUpdated: timestamp,
      },
      {
        id: 'API Crafter',
        status: 'working',
        description: 'Webhook testleri çalıştırılıyor',
        lastUpdated: timestamp,
      },
      {
        id: 'QA Runner',
        status: 'idle',
        description: 'E2E smoke suite sırada',
        lastUpdated: timestamp,
      },
    ];
  });
  const [suggestionQueue, setSuggestionQueue] = useState<string[]>([]);
  const [suggestionConfirm, setSuggestionConfirm] = useState<string | null>(null);
  const [recentAction, setRecentAction] = useState<{ id: string; label: string } | null>(null);
  const [folders, setFolders] = useState(initialFolders);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialFolders.map(folder => [folder.id, true]))
  );
  const [preview, setPreview] = useState(initialPreview);
  const [testSuitesState, setTestSuitesState] = useState(initialTestSuites);
  const [suggestionsState, setSuggestionsState] = useState<Record<string, SuggestionState>>(() => {
    const timestamp = new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
    return Object.fromEntries(
      aiSuggestions.map(suggestion => [
        suggestion.id,
        {
          status: 'idle',
          note: 'Hazır',
          lastUpdated: timestamp,
        },
      ])
    );
  });
  const [collaborationPresence, setCollaborationPresence] = useState<CollaborationPresence[]>([
    {
      userId: 'you',
      displayName: 'Sen',
      cursor: { line: 12, column: 4, color: '#6366F1' },
      speaking: false,
    },
    {
      userId: 'aylin',
      displayName: 'Aylin',
      cursor: { line: 28, column: 8, color: '#22D3EE' },
      speaking: true,
    },
    {
      userId: 'kaya',
      displayName: 'Kaya',
      cursor: { line: 44, column: 2, color: '#F97316' },
      speaking: false,
    },
  ]);
  const [collaborationStatus, setCollaborationStatus] = useState<
    'connecting' | 'connected' | 'reconnecting'
  >('connected');
  const [codeInsights, setCodeInsights] = useState<CodeAnalysisResult | null>(null);
  const [collaborationActivity, setCollaborationActivity] = useState<CollaborationActivity[]>([]);

  const appendCollaborationActivity = useCallback((entry: CollaborationActivity) => {
    setCollaborationActivity(prev => [entry, ...prev].slice(0, 15));
  }, []);

  const appendRunLog = useCallback((log: (typeof initialRunLogs)[number]) => {
    setRunLogs(prev => [log, ...prev].slice(0, 15));
  }, []);

  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark' || resolvedTheme === undefined;

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const asyncTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const suggestionTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});

  const activeFile = useMemo(
    () => files.find(file => file.id === activeFileId) ?? files[0],
    [activeFileId, files]
  );
  const activeFolderId = activeFile?.folderId ?? folders[0]?.id;

  const getCurrentTimestamp = useCallback(
    () =>
      new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    []
  );

  const handleApplyRecommendedAction = useCallback(
    (action: CodeAnalysisResult['recommendedActions'][number]) => {
      setAppliedRecommendedActions(prev => ({ ...prev, [action.title]: true }));
      appendRunLog({
        id: `recommended-action-${action.title}-${Date.now()}`,
        type: action.impact === 'high' ? 'success' : 'info',
        message: `${action.title} aksiyonu uygulandı.`,
        timestamp: getCurrentTimestamp(),
      });
    },
    [appendRunLog, getCurrentTimestamp]
  );

  const generateCodeInsights = useCallback(
    (file: StudioFile): CodeAnalysisResult => {
      const lines = file.content.split('\n');
      const diagnostics: CodeAnalysisResult['diagnostics'] = [];
      const optimizations: string[] = [];
      const recommendedActions: CodeAnalysisResult['recommendedActions'] = [];

      const TODO_COUNT = lines.filter(line => line.includes('TODO')).length;
      if (TODO_COUNT > 0) {
        diagnostics.push({
          type: 'warning',
          message: `${TODO_COUNT} adet TODO etiketi tespit edildi. Tamamlanması gereken işler olabilir.`,
        });
      }

      const hasConsoleUsage = lines.some(line => line.trim().startsWith('console.'));
      if (hasConsoleUsage) {
        diagnostics.push({
          type: 'info',
          message: 'Geçici console çıktıları üretim öncesi kaldırılabilir.',
        });
      }

      const overlyLongLine = lines.find(line => line.length > 140);
      if (overlyLongLine) {
        diagnostics.push({
          type: 'warning',
          message:
            '140 karakterden uzun satırlar mevcut. Okunabilirlik için satırları bölmeyi düşünün.',
        });
        recommendedActions.push({
          title: 'Uzun satırları böl',
          description:
            'Okunabilirliği artırmak için satırı birden fazla fonksiyon veya değişkene taşıyın.',
          impact: 'medium',
        });
      }

      if (file.language === 'tsx' && !file.content.includes('useMemo')) {
        optimizations.push('Performans için memoization gerektiren bölümleri değerlendirin.');
        recommendedActions.push({
          title: 'useMemo ile bileşen performansını iyileştir',
          description:
            'Yoğun hesaplamaları veya türetilmiş verileri useMemo ile sarmalayarak yeniden render maliyetini azaltın.',
          impact: 'high',
          referenceUrl: 'https://react.dev/reference/react/useMemo',
        });
      }

      if (file.language === 'tsx' && !file.content.includes('aria-')) {
        optimizations.push('Erişilebilirlik için ARIA niteliklerini gözden geçirin.');
        recommendedActions.push({
          title: 'ARIA nitelikleri ekle',
          description:
            'Ekran okuyucu uyumluluğu için ilgili buton ve menü öğelerine aria-* nitelikleri ekleyin.',
          impact: 'high',
          referenceUrl: 'https://developer.mozilla.org/docs/Web/Accessibility/ARIA',
        });
      }

      if (!hasConsoleUsage) {
        optimizations.push('Kodunuz temiz görünüyor; kaliteyi korumak için testleri güncel tutun.');
      } else {
        recommendedActions.push({
          title: 'Geçici console.log çağrılarını kaldır',
          description:
            'Üretim öncesi gereksiz console.log ifadelerini temizleyerek log gürültüsünü azaltın.',
          impact: 'medium',
        });
      }

      if (file.content.includes('fetch(') && !file.content.includes('try')) {
        recommendedActions.push({
          title: 'API çağrılarını hata yönetimi ile sarmala',
          description:
            'fetch çağrılarını try/catch bloklarıyla sarmak, beklenmeyen hatalar için kullanıcıya daha iyi geri bildirim sağlar.',
          impact: 'medium',
        });
      }

      if (
        file.language === 'tsx' &&
        file.content.includes('className') &&
        !file.content.includes('focus-visible')
      ) {
        recommendedActions.push({
          title: 'Klavye odak stillerini ekle',
          description:
            'focus-visible sınıfını kullanarak klavye navigasyonunda görsel odak göstergelerini güçlendirin.',
          impact: 'low',
        });
      }

      const summary = `AI, ${file.name} dosyasını ${lines.length} satır üzerinden analiz etti ve ${diagnostics.length} olası konu tespit etti.`;

      return {
        diagnostics,
        optimizations,
        recommendedActions,
        turkishSummary: summary,
        generatedAt: getCurrentTimestamp(),
      };
    },
    [getCurrentTimestamp]
  );

  const refreshCodeInsights = useCallback(() => {
    if (!activeFile) {
      return;
    }
    setCodeInsights(generateCodeInsights(activeFile));
  }, [activeFile, generateCodeInsights]);

  const handleSyncCollaboration = useCallback(() => {
    setCollaborationStatus('reconnecting');
    setTimeout(() => {
      setCollaborationPresence(prev =>
        prev.map(member => ({
          ...member,
          speaking: member.userId === 'you',
        }))
      );
      appendCollaborationActivity({
        id: `activity-sync-${Date.now()}`,
        userId: 'system',
        message: 'Bağlantı senkronize edildi. Tüm kullanıcılar güncel.',
        type: 'speaking',
        timestamp: getCurrentTimestamp(),
      });
      setCollaborationStatus('connected');
    }, 1500);
  }, [appendCollaborationActivity, getCurrentTimestamp]);

  const scheduleAutoSave = () => {
    setSaveState('Kaydediliyor');
    appendRunLog({
      id: `autosave-${Date.now()}`,
      message: 'Değişiklikler kaydetme kuyruğuna alındı.',
      timestamp: getCurrentTimestamp(),
      type: 'info',
    });
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setSaveState('Kaydedildi');
      appendRunLog({
        id: `autosave-success-${Date.now()}`,
        message: 'Yeni değişiklikler başarıyla kaydedildi.',
        timestamp: getCurrentTimestamp(),
        type: 'success',
      });
    }, 1200);
  };

  const updateSuggestionState = (suggestionId: string, partial: Partial<SuggestionState>) => {
    setSuggestionsState(prev => ({
      ...prev,
      [suggestionId]: {
        ...prev[suggestionId],
        ...partial,
        lastUpdated: partial.lastUpdated ?? getCurrentTimestamp(),
      },
    }));
  };

  const clearSuggestionTimers = (suggestionId: string) => {
    suggestionTimersRef.current[suggestionId]?.forEach(timer => clearTimeout(timer));
    suggestionTimersRef.current[suggestionId] = [];
  };

  const resetSuggestionQueue = () => {
    setSuggestionQueue([]);
    Object.keys(suggestionTimersRef.current).forEach(clearSuggestionTimers);
    suggestionTimersRef.current = {};
    const timestamp = getCurrentTimestamp();
    setSuggestionsState(prev =>
      Object.fromEntries(
        Object.entries(prev).map(([id, state]) => [
          id,
          {
            ...state,
            status: 'idle',
            note: 'Hazır',
            progress: undefined,
            lastUpdated: timestamp,
          },
        ])
      )
    );
  };

  const updateAgentState = (agentId: AgentId, partial: Partial<Omit<AgentState, 'id'>>) => {
    setAgentsState(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? {
              ...agent,
              ...partial,
              lastUpdated: partial.lastUpdated ?? getCurrentTimestamp(),
            }
          : agent
      )
    );
  };

  const pushPreviewActivity = (title: string, description: string) => {
    setPreview(prev => {
      const newActivity: PreviewActivity = {
        id: `activity-${Date.now()}`,
        title,
        description,
        timestamp: getCurrentTimestamp(),
      };
      const nextActivity = [newActivity, ...prev.activity];
      return {
        ...prev,
        activity: nextActivity.slice(0, MAX_PREVIEW_ACTIVITY),
      };
    });
  };

  const scheduleTestSuiteUpdates = (
    suiteId: string,
    steps: {
      delay: number;
      patch?: Partial<TestSuite>;
      log?: { type: RunLog['type']; message: string };
      effect?: () => void;
    }[]
  ) => {
    steps.forEach(step => {
      const timer = setTimeout(() => {
        if (step.patch) {
          setTestSuitesState(prev =>
            prev.map(suite => (suite.id === suiteId ? { ...suite, ...step.patch } : suite))
          );
        }

        if (step.log) {
          appendRunLog({
            id: `test-step-${suiteId}-${Date.now()}`,
            type: step.log.type,
            timestamp: getCurrentTimestamp(),
            message: step.log.message,
          });
        }

        if (step.effect) {
          step.effect();
        }
      }, step.delay);

      asyncTimersRef.current.push(timer);
    });
  };

  const updateFileContent = (fileId: string, updater: (content: string) => string) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === fileId
          ? {
              ...file,
              content: updater(file.content),
            }
          : file
      )
    );
    scheduleAutoSave();
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const filteredRunLogs = useMemo(() => {
    return runLogs.filter(log => {
      const matchesFilter = logFilter === 'all' || log.type === logFilter;
      const matchesSearch = log.message
        .toLocaleLowerCase('tr-TR')
        .includes(logSearch.trim().toLocaleLowerCase('tr-TR'));
      return matchesFilter && matchesSearch;
    });
  }, [logFilter, logSearch, runLogs]);

  const clearRunLogs = () => {
    setRunLogs([]);
    appendRunLog({
      id: `run-log-clear-${Date.now()}`,
      type: 'info',
      message: 'Koşum günlükleri sıfırlandı.',
      timestamp: getCurrentTimestamp(),
    });
  };

  const handleCreateFolder = () => {
    const newFolderId = `folder-${Date.now()}`;
    const folderName = `koleksiyon-${folders.length + 1}`;
    setFolders(prev => [...prev, { id: newFolderId, name: folderName }]);
    setExpandedFolders(prev => ({ ...prev, [newFolderId]: true }));
    appendRunLog({
      id: `folder-${Date.now()}`,
      type: 'info',
      timestamp: getCurrentTimestamp(),
      message: `${folderName} klasörü eklendi.`,
    });
  };

  const handleCreateFile = (folderId: string) => {
    const newFileId = `file-${Date.now()}`;
    const newFile: StudioFile = {
      id: newFileId,
      name: `yeni-component-${files.length + 1}.tsx`,
      language: 'tsx',
      content: `export function YeniBilesen() {
  return <div className="rounded-xl border border-border/40 bg-surface p-4">Yeni bileşen</div>;
}
`,
      folderId,
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFileId);
    appendRunLog({
      id: `file-${Date.now()}`,
      type: 'success',
      timestamp: getCurrentTimestamp(),
      message: `${newFile.name} dosyası oluşturuldu ve editöre açıldı.`,
    });
    scheduleAutoSave();
  };

  const cyclePreviewTheme = () => {
    setPreview(prev => {
      const currentIndex = PREVIEW_THEMES.indexOf(prev.theme);
      const nextTheme = PREVIEW_THEMES[(currentIndex + 1) % PREVIEW_THEMES.length];
      return {
        ...prev,
        theme: nextTheme,
      };
    });
  };

  const handlePreviewThemeChange = (theme: PreviewTheme) => {
    setPreview(prev => ({
      ...prev,
      theme,
    }));
  };

  const handleQuickAction = (action: QuickAction) => {
    setRecentAction({ id: action.id, label: action.title });
    appendRunLog({
      id: `quick-action-${action.id}-${Date.now()}`,
      type: 'info',
      timestamp: getCurrentTimestamp(),
      message: `Hızlı aksiyon tetiklendi: ${action.title}`,
    });
    if (action.id === 'action-template') {
      setActiveAgent('UI Architect');
      updateAgentState('UI Architect', {
        status: 'working',
        description: 'SaaS şablonu bileşenleri optimize ediliyor.',
      });
      pushPreviewActivity('UI Architect', 'SaaS şablonu bileşenleri optimize ediliyor.');
      if (activeFile) {
        updateFileContent(activeFile.id, content => {
          return `// ${action.title} hazırlandı (${getCurrentTimestamp()})\n${content}`;
        });
      }
      setPreview(prev => ({
        ...prev,
        heroTagline: pickRandom(PREVIEW_TAGLINES),
        heroTitle: 'SaaS dashboard şablonu hazırlandı',
        heroSubtitle: 'Reaktif grid, KPI kartları ve fiyatlandırma blokları yeniden düzenlendi.',
        primaryCta: pickRandom(CTA_PRIMARY_OPTIONS),
        secondaryCta: pickRandom(CTA_SECONDARY_OPTIONS),
        metrics: PREVIEW_METRIC_TEMPLATES[0],
        theme: 'violet',
      }));
      setTestSuitesState(prev =>
        prev.map(suite =>
          suite.id === 'suite-ui'
            ? {
                ...suite,
                result: 'running',
                duration: 'Güncelleniyor…',
                coverage: '—',
                progress: 72,
                statusNote: 'Çoklu viewport varyasyonları oluşturuluyor.',
              }
            : suite
        )
      );
      scheduleTestSuiteUpdates('suite-ui', [
        {
          delay: 1200,
          patch: {
            progress: 88,
            statusNote: 'Bileşen snapshotları doğrulanıyor.',
          },
          log: {
            type: 'info',
            message: 'UI regression snapshot analizi devam ediyor.',
          },
        },
        {
          delay: 2400,
          patch: {
            result: 'pass',
            duration: '48 sn',
            coverage: '89%',
            progress: 100,
            statusNote: 'UI regression suite tamamlandı.',
          },
          log: {
            type: 'success',
            message: 'UI regression suite başarıyla tamamlandı.',
          },
          effect: () => {
            updateAgentState('UI Architect', {
              status: 'success',
              description: 'Şablon bileşenleri canlı önizlemeye aktarıldı.',
            });
            pushPreviewActivity('QA Runner', 'UI regression suite sonuçları paylaşıldı.');
          },
        },
      ]);
    }

    if (action.id === 'action-backend') {
      setActiveAgent('API Crafter');
      updateAgentState('API Crafter', {
        status: 'working',
        description: 'Stripe ve HubSpot entegrasyonları eşitleniyor.',
      });
      pushPreviewActivity('API Crafter', 'Webhook senaryoları tetiklendi.');
      setTestSuitesState(prev =>
        prev.map(suite =>
          suite.id === 'suite-api'
            ? {
                ...suite,
                result: 'running',
                duration: 'Çalışıyor…',
                coverage: '—',
                progress: 18,
                statusNote: 'Webhook testleri başlatıldı.',
              }
            : suite
        )
      );
      scheduleTestSuiteUpdates('suite-api', [
        {
          delay: 1400,
          patch: {
            progress: 62,
            statusNote: 'Sözleşme şemaları doğrulanıyor.',
          },
          log: {
            type: 'info',
            message: 'API contract testleri webhook yanıtlarını doğruluyor.',
          },
        },
        {
          delay: 2600,
          patch: {
            result: 'pass',
            duration: '24 sn',
            coverage: '97%',
            progress: 100,
            statusNote: 'API contract suite tamamlandı.',
          },
          log: {
            type: 'success',
            message: 'API entegrasyon testi başarıyla tamamlandı.',
          },
          effect: () => {
            updateAgentState('API Crafter', {
              status: 'success',
              description: 'API entegrasyonları doğrulandı.',
            });
            pushPreviewActivity('API Crafter', 'Webhook senaryoları başarıyla tamamlandı.');
          },
        },
      ]);
    }

    if (action.id === 'action-theme') {
      setActiveAgent('UI Architect');
      updateAgentState('UI Architect', {
        status: 'working',
        description: 'Tema tokenları güncelleniyor.',
      });
      pushPreviewActivity('UI Architect', 'Tema varyasyon testi başlatıldı.');
      cyclePreviewTheme();
      setPreview(prev => ({
        ...prev,
        heroTagline: pickRandom(PREVIEW_TAGLINES),
        primaryCta: pickRandom(CTA_PRIMARY_OPTIONS),
        secondaryCta: pickRandom(CTA_SECONDARY_OPTIONS),
        metrics: PREVIEW_METRIC_TEMPLATES[1],
      }));

      const themeTimer = setTimeout(() => {
        updateAgentState('UI Architect', {
          status: 'success',
          description: 'Yeni tema canlı önizlemeye aktarıldı.',
        });
        appendRunLog({
          id: `quick-action-theme-${Date.now()}`,
          type: 'info',
          timestamp: getCurrentTimestamp(),
          message: 'Tema varyasyonu önizlemeye uygulandı.',
        });
        pushPreviewActivity('UI Architect', 'Tema varyasyonu başarıyla uygulandı.');
      }, 1800);

      asyncTimersRef.current.push(themeTimer);
    }
  };

  const handleRerunTests = () => {
    updateAgentState('QA Runner', {
      status: 'working',
      description: 'Test suite yeniden çalıştırılıyor.',
    });
    pushPreviewActivity('QA Runner', 'Regression süitleri yeniden tetiklendi.');
    const rerunTargets = testSuitesState.filter(suite => suite.result === 'pass');
    setTestSuitesState(prev =>
      prev.map(suite =>
        suite.result === 'pass'
          ? {
              ...suite,
              result: 'running',
              duration: 'Yeniden çalıştırılıyor…',
              coverage: '—',
              progress: 18,
              statusNote: 'Smoke validasyonu başlatıldı.',
            }
          : suite
      )
    );
    rerunTargets.forEach(suite => {
      scheduleTestSuiteUpdates(suite.id, [
        {
          delay: 1500,
          patch: {
            progress: 72,
            statusNote: 'Kritik senaryolar doğrulanıyor.',
          },
          log: {
            type: 'info',
            message: `${suite.name} yeniden çalıştırma %72 tamamlandı.`,
          },
        },
        {
          delay: 3000,
          patch: {
            result: 'pass',
            duration: '38 sn',
            coverage: '98%',
            progress: 100,
            statusNote: 'Suite başarıyla tamamlandı.',
          },
          log: {
            type: 'success',
            message: `${suite.name} yeniden çalıştırıldı ve geçti.`,
          },
          effect: () => {
            updateAgentState('QA Runner', {
              status: 'success',
              description: 'QA raporu güncellendi ve paylaşıldı.',
            });
            pushPreviewActivity('QA Runner', `${suite.name} suite sonucu paylaşıldı.`);
          },
        },
      ]);
    });
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      asyncTimersRef.current.forEach(timer => clearTimeout(timer));
      asyncTimersRef.current = [];
      Object.keys(suggestionTimersRef.current).forEach(id => {
        clearSuggestionTimers(id);
      });
      suggestionTimersRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (!copyFeedback) {
      return;
    }

    const timeout = setTimeout(() => setCopyFeedback(null), 1800);
    return () => clearTimeout(timeout);
  }, [copyFeedback]);

  useEffect(() => {
    if (!suggestionConfirm) {
      return;
    }

    const timeout = setTimeout(() => setSuggestionConfirm(null), 2000);
    return () => clearTimeout(timeout);
  }, [suggestionConfirm]);

  useEffect(() => {
    if (!activeFile) {
      return;
    }
    setCodeInsights(generateCodeInsights(activeFile));
  }, [activeFile, generateCodeInsights]);

  useEffect(() => {
    if (!codeInsights) {
      setAppliedRecommendedActions({});
      return;
    }
    setAppliedRecommendedActions(prev => {
      const next: Record<string, boolean> = {};
      codeInsights.recommendedActions.forEach(action => {
        next[action.title] = prev[action.title] ?? false;
      });
      return next;
    });
  }, [codeInsights]);

  useEffect(() => {
    const presenceInterval = setInterval(() => {
      setCollaborationPresence(prev => {
        return prev.map(member => {
          if (member.userId === 'aylin') {
            const nextSpeaking = !member.speaking;
            appendCollaborationActivity({
              id: `activity-speaking-${Date.now()}`,
              userId: member.userId,
              message: nextSpeaking
                ? `${member.displayName} sesli not paylaşmaya başladı.`
                : `${member.displayName} konuşmayı tamamladı.`,
              type: 'speaking',
              timestamp: getCurrentTimestamp(),
            });
            return {
              ...member,
              speaking: nextSpeaking,
            };
          }
          if (member.userId === 'kaya') {
            const nextCursor = member.cursor
              ? {
                  ...member.cursor,
                  line: Math.max(1, member.cursor.line + (Math.random() > 0.5 ? 1 : -1)),
                  column: Math.max(1, member.cursor.column + (Math.random() > 0.5 ? 2 : -2)),
                }
              : undefined;

            if (nextCursor) {
              appendCollaborationActivity({
                id: `activity-cursor-${Date.now()}`,
                userId: member.userId,
                message: `${member.displayName} imlecini satır ${nextCursor.line}, sütun ${nextCursor.column} konumuna taşıdı.`,
                type: 'cursor',
                timestamp: getCurrentTimestamp(),
              });
            }

            return {
              ...member,
              cursor: nextCursor,
            };
          }
          return member;
        });
      });
    }, 10000);

    return () => clearInterval(presenceInterval);
  }, [appendCollaborationActivity, getCurrentTimestamp]);

  useEffect(() => {
    const presenceJoinLeaveInterval = setInterval(() => {
      const willJoin = Math.random() > 0.5;
      if (willJoin) {
        const guestId = `guest-${Date.now()}`;
        const guestDisplayName = `Misafir ${collaborationPresence.length + 1}`;
        setCollaborationPresence(prev => [
          ...prev,
          {
            userId: guestId,
            displayName: guestDisplayName,
            cursor: {
              line: Math.floor(Math.random() * 40) + 1,
              column: Math.floor(Math.random() * 80) + 1,
              color: '#FACC15',
            },
            speaking: false,
          },
        ]);
        appendCollaborationActivity({
          id: `activity-join-${Date.now()}`,
          userId: guestId,
          message: `${guestDisplayName} oturuma katıldı.`,
          type: 'join',
          timestamp: getCurrentTimestamp(),
        });
      } else if (collaborationPresence.length > 3) {
        setCollaborationPresence(prev => {
          const leavingMember = prev.find(member => member.userId.startsWith('guest-'));
          if (!leavingMember) {
            return prev;
          }

          appendCollaborationActivity({
            id: `activity-leave-${Date.now()}`,
            userId: leavingMember.userId,
            message: `${leavingMember.displayName} oturumu terk etti.`,
            type: 'leave',
            timestamp: getCurrentTimestamp(),
          });

          return prev.filter(member => member.userId !== leavingMember.userId);
        });
      }
    }, 18000);

    return () => clearInterval(presenceJoinLeaveInterval);
  }, [
    appendCollaborationActivity,
    collaborationPresence.length,
    getCurrentTimestamp,
    setCollaborationPresence,
  ]);

  const handleFileContentChange = (value: string) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === activeFileId
          ? {
              ...file,
              content: value,
            }
          : file
      )
    );
    scheduleAutoSave();
  };

  const enqueueSuggestion = (suggestionId: string) => {
    setSuggestionQueue(prev => [...new Set([...prev, suggestionId])]);
    updateSuggestionState(suggestionId, {
      status: 'queued',
      note: 'Kuyrukta',
      progress: 0,
    });
  };

  const completeSuggestion = (
    suggestion: AISuggestion,
    options?: { note?: string; logMessage?: string; activityMessage?: string }
  ) => {
    clearSuggestionTimers(suggestion.id);
    setSuggestionQueue(prev => prev.filter(id => id !== suggestion.id));
    updateSuggestionState(suggestion.id, {
      status: 'completed',
      note: options?.note ?? 'Öneri tamamlandı.',
      progress: 100,
    });
    appendRunLog({
      id: `suggestion-complete-${suggestion.id}-${Date.now()}`,
      type: 'success',
      timestamp: getCurrentTimestamp(),
      message: options?.logMessage ?? `${suggestion.title} önerisi tamamlandı.`,
    });
    pushPreviewActivity('AI Studio', options?.activityMessage ?? `${suggestion.title} tamamlandı.`);
    scheduleAutoSave();
  };

  const revertSuggestion = (suggestion: AISuggestion) => {
    clearSuggestionTimers(suggestion.id);
    setSuggestionQueue(prev => prev.filter(id => id !== suggestion.id));
    updateSuggestionState(suggestion.id, {
      status: 'idle',
      note: 'Hazır',
      progress: undefined,
    });
    appendRunLog({
      id: `suggestion-revert-${suggestion.id}-${Date.now()}`,
      type: 'warning',
      message: `${suggestion.title} önerisi geri alındı.`,
      timestamp: getCurrentTimestamp(),
    });
    pushPreviewActivity('AI Studio', `${suggestion.title} geri alındı.`);
    scheduleAutoSave();
  };

  const startSuggestionTimers = (suggestion: AISuggestion) => {
    const steps: {
      delay: number;
      patch?: Partial<SuggestionState>;
      log?: { type: RunLog['type']; message: string };
      effect?: () => void;
    }[] = [
      {
        delay: 1000,
        patch: { status: 'in-progress', note: 'Ajanlar üzerinde', progress: 40 },
        log: {
          type: 'info',
          message: `${suggestion.title} önerisi ajanlara atandı.`,
        },
        effect: () => pushPreviewActivity('AI Studio', `${suggestion.title} üzerinde çalışılıyor.`),
      },
      {
        delay: 2400,
        patch: { progress: 85, note: 'Son kontroller yapılıyor.' },
      },
      {
        delay: 3600,
        effect: () =>
          completeSuggestion(suggestion, {
            note: 'Öneri tamamlandı.',
            logMessage: `${suggestion.title} önerisi tamamlandı ve prompta işlendi.`,
            activityMessage: `${suggestion.title} tamamlandı.`,
          }),
      },
    ];

    clearSuggestionTimers(suggestion.id);

    steps.forEach(step => {
      const timer = setTimeout(() => {
        if (step.patch) {
          updateSuggestionState(suggestion.id, step.patch);
        }
        if (step.log) {
          appendRunLog({
            id: `suggestion-step-${suggestion.id}-${Date.now()}`,
            type: step.log.type,
            timestamp: getCurrentTimestamp(),
            message: step.log.message,
          });
        }
        if (step.effect) {
          step.effect();
        }
      }, step.delay);

      suggestionTimersRef.current[suggestion.id] = [
        ...(suggestionTimersRef.current[suggestion.id] ?? []),
        timer,
      ];
      asyncTimersRef.current.push(timer);
    });
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    enqueueSuggestion(suggestion.id);
    setPrompt(prev => `${prev}\n\n# ${suggestion.title}\n${suggestion.description}`.trim());
    setRunLogs(prev => [
      {
        id: `suggestion-${suggestion.id}-${Date.now()}`,
        type: 'info',
        timestamp: new Intl.DateTimeFormat('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        message: `AI önerisi kuyruğa alındı: ${suggestion.title}`,
      },
      ...prev,
    ]);
    updateSuggestionState(suggestion.id, {
      note: 'Prompta eklendi, ajanlar hazırlanıyor.',
      status: 'queued',
      progress: 10,
    });
    startSuggestionTimers(suggestion);
    setSuggestionConfirm(suggestion.id);
    scheduleAutoSave();
  };

  const suggestionImpactTone: Record<AISuggestion['impact'], string> = {
    high: 'border-red-400/30 bg-red-500/10 text-red-100',
    medium: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
    low: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  };

  const toggleNote = (noteId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? {
              ...note,
              checked: !note.checked,
            }
          : note
      )
    );
    scheduleAutoSave();
  };

  const handleRunPrompt = () => {
    if (isRunning) {
      return;
    }

    const timestamp = new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    setIsRunning(true);
    setRunLogs(prev => [
      {
        id: `run-${Date.now()}`,
        type: 'info',
        timestamp,
        message: 'Prompt ajanlara iletildi. Kod üretimi başlatılıyor...',
      },
      ...prev,
    ]);

    setTimeout(() => {
      const successTimestamp = new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      setRunLogs(prev => [
        {
          id: `run-${Date.now() + 1}`,
          type: 'success',
          timestamp: successTimestamp,
          message: 'Yeni arayüz oluşturuldu ve önizlemeye aktarıldı.',
        },
        ...prev,
      ]);
      setIsRunning(false);
      setSaveState('Kaydedildi');
    }, 1600);
  };

  const viewportLabel = {
    desktop: 'Masaüstü',
    tablet: 'Tablet',
    mobile: 'Mobil',
  }[viewport];

  const handleCopyPrompt = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(prompt);
        setCopyFeedback('prompt');
      } catch (error) {
        console.error('Prompt kopyalanamadı', error);
      }
    }
  };

  const handleCopyCode = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(activeFile.content);
        setCopyFeedback('code');
      } catch (error) {
        console.error('Kod kopyalanamadı', error);
      }
    }
  };

  const handleFormatCode = () => {
    setFiles(prev =>
      prev.map(file =>
        file.id === activeFileId
          ? {
              ...file,
              content: file.content
                .split('\n')
                .map(line => line.trimEnd())
                .join('\n')
                .replace(/\n{3,}/g, '\n\n')
                .trim()
                .concat('\n'),
            }
          : file
      )
    );
    scheduleAutoSave();
  };

  const toggleWrap = () => setIsWrapEnabled(prev => !prev);
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');
  const togglePreviewLive = () => {
    setIsPreviewLive(prev => {
      const next = !prev;
      appendRunLog({
        id: `preview-${Date.now()}`,
        type: next ? 'info' : 'warning',
        timestamp: getCurrentTimestamp(),
        message: next ? 'Canlı önizleme yeniden başlatıldı.' : 'Canlı önizleme duraklatıldı.',
      });
      return next;
    });
  };

  const logIconMap: Record<RunLog['type'], IconComponent> = {
    success: Check,
    info: Sparkles,
    warning: Zap,
  };

  const logToneMap: Record<RunLog['type'], string> = {
    success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    info: 'border-primary/25 bg-primary/10 text-primary',
    warning: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  };

  const themeClasses = isDarkMode
    ? 'bg-background text-foreground'
    : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900';
  const themeTokens = previewThemeTokens[preview.theme];
  const previewCardState = isPreviewLive
    ? 'ring-1 ring-primary/40 shadow-lg shadow-primary/10'
    : 'opacity-75 grayscale';
  const codeWrapMode = isWrapEnabled ? 'on' : 'off';
  const promptCopied = copyFeedback === 'prompt';
  const codeCopied = copyFeedback === 'code';
  const suggestionAppliedMessage = suggestionConfirm
    ? aiSuggestions.find(suggestion => suggestion.id === suggestionConfirm)?.title
    : undefined;
  const isAnyTestRunning = testSuitesState.some(suite => suite.result === 'running');
  const activeAgentState = agentsState.find(agent => agent.id === activeAgent) ?? agentsState[0];
  const completedAgentsCount = agentsState.filter(agent => agent.status === 'success').length;
  const collaborationStatusTone: Record<typeof collaborationStatus, string> = {
    connecting: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
    connected: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
    reconnecting: 'border-primary/40 bg-primary/10 text-primary',
  };
  const collaborationStatusLabel: Record<typeof collaborationStatus, string> = {
    connecting: 'Bağlanıyor',
    connected: 'Bağlandı',
    reconnecting: 'Yeniden bağlanıyor',
  };
  const diagnosticsTone: Record<CodeAnalysisResult['diagnostics'][number]['type'], string> = {
    error: 'border-red-400/30 bg-red-500/10 text-red-100',
    warning: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
    info: 'border-primary/30 bg-primary/10 text-primary',
  };
  const diagnosticsIcon: Record<CodeAnalysisResult['diagnostics'][number]['type'], IconComponent> =
    {
      error: AlertCircle,
      warning: Lightbulb,
      info: Info,
    };
  const diagnosticsList: CodeAnalysisResult['diagnostics'] = codeInsights?.diagnostics ?? [];
  const optimizationIdeas: CodeAnalysisResult['optimizations'] = codeInsights?.optimizations ?? [];
  const recommendedActions = codeInsights?.recommendedActions ?? [];
  const impactToneMap: Record<CodeAnalysisResult['recommendedActions'][number]['impact'], string> =
    {
      high: 'border-primary/40 bg-primary/10 text-primary',
      medium: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
      low: 'border-border/40 bg-surface/70 text-muted-foreground',
    };
  const insightsSummary = codeInsights?.turkishSummary ?? 'Analiz hazırlanıyor…';
  const insightsUpdatedAt = codeInsights?.generatedAt ?? '—';

  return (
    <div className={cn('flex min-h-screen flex-col transition-colors duration-300', themeClasses)}>
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 px-3 py-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Landing&apos;e dön
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground/80">
              Codexonx Studio
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden items-center gap-2 rounded-full pl-2 pr-3 md:inline-flex"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/60 bg-surface text-[11px] font-semibold">
                C
              </span>
              Atlas HR
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={cn(
                  'inline-flex h-2 w-2 rounded-full',
                  saveState === 'Kaydedildi' ? 'bg-emerald-400' : 'bg-amber-400'
                )}
              />
              {saveState}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-full border border-border/60 md:inline-flex"
                onClick={toggleTheme}
                aria-pressed={isDarkMode}
              >
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="sr-only">Tema modunu değiştir</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={togglePreviewLive}
                aria-pressed={!isPreviewLive}
              >
                {isPreviewLive ? 'Önizlemeyi Kapat' : 'Önizlemeyi Aç'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-full border border-border/60 md:inline-flex"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Ayarları aç</span>
              </Button>
              <Button
                size="sm"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-accent to-secondary px-5"
                disabled={isRunning}
                onClick={handleRunPrompt}
              >
                {isRunning ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-5 w-5" />
                )}
                Çalıştır
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="container grid flex-1 gap-6 py-8 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,320px)]">
          <aside className="flex flex-col gap-6">
            <Card className="space-y-4 border-border/40 bg-background/90 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Folder className="h-4 w-4" />
                  Proje Dosyaları
                </div>
                <Button variant="ghost" size="sm" className="gap-1 rounded-full px-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Otomatik düzenle
                </Button>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {folders.map(folder => {
                  const folderFiles = files.filter(file => file.folderId === folder.id);
                  const isExpanded = Boolean(expandedFolders[folder.id]);
                  const isActiveFolder = folder.id === activeFolderId;

                  return (
                    <li
                      key={folder.id}
                      className="rounded-xl border border-border/30 bg-surface/60"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFolder(folder.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left',
                          isActiveFolder && 'bg-primary/10'
                        )}
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform',
                              isExpanded ? 'rotate-180' : 'rotate-0'
                            )}
                          />
                          <span className="font-medium text-foreground">{folder.name}</span>
                        </div>
                        <Badge variant="outline" className="rounded-full text-[10px]">
                          {folderFiles.length}
                        </Badge>
                      </button>
                      {isExpanded && (
                        <ul className="space-y-1 border-t border-border/30 bg-background/70 p-2">
                          {folderFiles.length === 0 && (
                            <li className="rounded-lg border border-dashed border-border/50 px-3 py-2 text-xs">
                              Henüz dosya yok
                            </li>
                          )}
                          {folderFiles.map(file => (
                            <li key={file.id}>
                              <button
                                type="button"
                                onClick={() => setActiveFileId(file.id)}
                                className={cn(
                                  'flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left transition',
                                  activeFileId === file.id
                                    ? 'border-primary/40 bg-primary/10 text-foreground'
                                    : 'hover:border-border/60 hover:bg-surface/60'
                                )}
                              >
                                <FileCode className="h-4 w-4 text-primary" />
                                <span className="flex-1 truncate font-medium">{file.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full border-dashed"
                  onClick={() => activeFolderId && handleCreateFile(activeFolderId)}
                  disabled={!activeFolderId}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Yeni dosya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-full border-dashed"
                  onClick={handleCreateFolder}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Yeni klasör
                </Button>
              </div>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Prompt</h2>
                <p className="text-xs text-muted-foreground">
                  Ne oluşturmak istediğini tek cümlede anlat.
                </p>
              </div>
              <Textarea
                value={prompt}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setPrompt(event.target.value);
                  scheduleAutoSave();
                }}
                placeholder="Örn. mobil uyumlu satış kontrol paneli"
                className="h-28 resize-none border-border/40 bg-surface text-sm"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={handleCopyPrompt}
                  >
                    <Copy className="mr-2 h-3.5 w-3.5" /> Promptu kopyala
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setPrompt('')}
                  >
                    <Save className="mr-2 h-3.5 w-3.5" /> Temizle
                  </Button>
                </div>
                {promptCopied && (
                  <Badge className="rounded-full" variant="secondary">
                    Prompt kopyalandı
                  </Badge>
                )}
              </div>
              {suggestionAppliedMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
                  <Check className="h-3.5 w-3.5" />
                  <span>{`${suggestionAppliedMessage} prompt'a eklendi`}</span>
                </div>
              )}
              <div className="space-y-2">
                {notes.map(note => (
                  <label
                    key={note.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/30 bg-surface/60 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/40"
                  >
                    <Checkbox
                      checked={note.checked}
                      onCheckedChange={() => toggleNote(note.id)}
                      className="border-border"
                    />
                    <span className="flex-1 text-left text-foreground/80">{note.label}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Hızlı Aksiyonlar</h2>
                {recentAction ? (
                  <Badge variant="secondary" className="rounded-full">
                    Son: {recentAction.label}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-full">
                    BETA
                  </Badge>
                )}
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {quickActions.map(action => (
                  <li key={action.id}>
                    <button
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="flex w-full items-start gap-3 rounded-xl border border-border/30 bg-surface/70 p-3 text-left transition hover:border-primary/40 hover:bg-surface"
                    >
                      <action.icon className="mt-0.5 h-4 w-4 text-primary" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{action.title}</span>
                          <code className="rounded-full border border-border/50 bg-background/80 px-2 py-0.5 text-xs text-muted-foreground">
                            {action.shortcut}
                          </code>
                        </div>
                        <p>{action.description}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">AI Önerileri</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {suggestionQueue.length} aktif
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={resetSuggestionQueue}
                    disabled={suggestionQueue.length === 0}
                  >
                    Kuyruğu temizle
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map(suggestion => {
                  const suggestionState = suggestionsState[suggestion.id] ?? {
                    status: 'idle',
                    note: 'Hazır',
                  };
                  return (
                    <Card
                      key={suggestion.id}
                      className={cn(
                        'space-y-3 border-border/40 bg-surface/70 p-3 text-sm',
                        suggestionImpactTone[suggestion.impact],
                        SUGGESTION_STATUS_TONES[suggestionState.status]
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                          <p className="text-xs text-foreground/80">{suggestion.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right">
                          <Badge className="rounded-full px-2 py-0.5 text-[10px]">
                            {SUGGESTION_STATUS_LABELS[suggestionState.status]}
                          </Badge>
                          <Badge variant="outline" className="rounded-full text-[10px]">
                            {suggestion.impact.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{suggestionState.note}</span>
                          <span className="text-muted-foreground/60">
                            {suggestionState.lastUpdated ?? '—'}
                          </span>
                        </div>
                        {typeof suggestionState.progress === 'number' && (
                          <div className="space-y-1">
                            <Progress value={suggestionState.progress} className="h-1.5" />
                            <div className="flex items-center justify-between text-[11px]">
                              <span>İlerleme</span>
                              <span>%{suggestionState.progress}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span>
                          {suggestionQueue.includes(suggestion.id)
                            ? 'Kuyrukta'
                            : suggestionState.status === 'completed'
                              ? 'Tamamlandı'
                              : 'Bekliyor'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="rounded-full"
                            disabled={['queued', 'in-progress'].includes(suggestionState.status)}
                            onClick={() => applySuggestion(suggestion)}
                          >
                            {suggestionState.status === 'completed'
                              ? 'Tekrar uygula'
                              : ['queued', 'in-progress'].includes(suggestionState.status)
                                ? 'İşleniyor...'
                                : "Prompt'a ekle"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            disabled={suggestionState.status === 'idle'}
                            onClick={() => revertSuggestion(suggestion)}
                          >
                            {suggestionState.status === 'completed' ? 'Geri al' : 'İptal et'}
                          </Button>
                          {['queued', 'in-progress'].includes(suggestionState.status) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full"
                              onClick={() => completeSuggestion(suggestion)}
                            >
                              Tamamlandı
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </aside>

          <section className="flex flex-col gap-6">
            <Card className="space-y-4 border-border/50 bg-background/95">
              <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
                {files.map(file => (
                  <button
                    type="button"
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition',
                      activeFileId === file.id
                        ? 'bg-primary/15 text-foreground'
                        : 'text-muted-foreground hover:bg-surface/60'
                    )}
                  >
                    <span>{file.name}</span>
                    {activeFileId === file.id && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between border-b border-border/40 bg-surface/50 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={handleCopyCode}
                  >
                    <Copy className="mr-2 h-3.5 w-3.5" /> Kod kopyala
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={handleFormatCode}
                  >
                    <Sparkles className="mr-2 h-3.5 w-3.5" /> Otomatik format
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full" onClick={toggleWrap}>
                    {isWrapEnabled ? 'Satır kaydırmayı kapat' : 'Satır kaydırmayı aç'}
                  </Button>
                </div>
                {codeCopied && (
                  <Badge className="rounded-full" variant="secondary">
                    Kod kopyalandı
                  </Badge>
                )}
              </div>
              <AICodeEditor
                initialCode={activeFile.content}
                language={
                  activeFile.language === 'tsx'
                    ? 'typescript'
                    : activeFile.language === 'md'
                      ? 'markdown'
                      : activeFile.language
                }
                fileName={activeFile.name}
                onCodeChange={handleFileContentChange}
                onRun={code => {
                  handleFileContentChange(code);
                  appendRunLog({
                    id: `editor-run-${Date.now()}`,
                    type: 'info',
                    timestamp: getCurrentTimestamp(),
                    message: `${activeFile.name} dosyası çalıştırıldı.`,
                  });
                }}
                onSave={code => {
                  handleFileContentChange(code);
                  appendRunLog({
                    id: `editor-save-${Date.now()}`,
                    type: 'info',
                    timestamp: getCurrentTimestamp(),
                    message: `${activeFile.name} kaydedildi.`,
                  });
                }}
                wordWrap={codeWrapMode}
                heightClassName="min-h-[460px]"
              />
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Lightbulb className="h-4 w-4" /> Türkçe AI Açıklamaları
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={refreshCodeInsights}
                  disabled={!activeFile}
                >
                  Yenile
                </Button>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{insightsSummary}</p>
                <p className="text-xs text-muted-foreground/80">
                  Son güncelleme: {insightsUpdatedAt}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Tanılar
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {diagnosticsList.length > 0 ? (
                      diagnosticsList.map((diagnostic, index) => {
                        const DiagnosticIcon = diagnosticsIcon[diagnostic.type];
                        return (
                          <li
                            key={`${diagnostic.message}-${index}`}
                            className={cn(
                              'flex items-start gap-2 rounded-xl border px-3 py-2 text-left',
                              diagnosticsTone[diagnostic.type]
                            )}
                          >
                            <DiagnosticIcon className="mt-0.5 h-4 w-4" />
                            <span>{diagnostic.message}</span>
                          </li>
                        );
                      })
                    ) : (
                      <li className="rounded-xl border border-border/40 bg-surface/70 px-3 py-2 text-muted-foreground">
                        Kod tutarlı görünüyor, ciddi bir sorun tespit edilmedi.
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Optimizasyon Fikirleri
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    {optimizationIdeas.length > 0 ? (
                      optimizationIdeas.map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                          className="flex items-start gap-2 rounded-xl border border-border/40 bg-surface/70 px-3 py-2"
                        >
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="rounded-xl border border-border/40 bg-surface/70 px-3 py-2 text-muted-foreground">
                        Optimizasyon önerisi bulunmuyor.
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Önerilen Aksiyonlar
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {recommendedActions.length > 0 ? (
                      recommendedActions.map((action, index) => {
                        const isApplied = appliedRecommendedActions[action.title];
                        return (
                          <li
                            key={`${action.title}-${action.impact}-${index}`}
                            className={cn(
                              'flex flex-col gap-2 rounded-xl border px-3 py-3',
                              impactToneMap[action.impact]
                            )}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                              <span>{action.title}</span>
                              <Badge variant="outline" className="rounded-full text-[10px]">
                                {action.impact.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">
                              {action.description}
                            </p>
                            {action.referenceUrl && (
                              <Link
                                href={action.referenceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                              >
                                Kaynak bağlantı
                              </Link>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{isApplied ? 'Uygulandı' : 'Hazır'}</span>
                              <Button
                                size="sm"
                                className="rounded-full"
                                disabled={isApplied}
                                onClick={() => handleApplyRecommendedAction(action)}
                              >
                                {isApplied ? 'Tamamlandı' : 'Uygula'}
                              </Button>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="rounded-xl border border-border/40 bg-surface/70 px-3 py-2 text-muted-foreground">
                        Aksiyon gerektiren kritik bir öneri bulunmuyor.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="border-border/40 bg-background/95 p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 px-4 py-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4" />
                  Çalıştırma günlükleri
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-end gap-2 text-xs">
                  <div className="flex flex-1 items-center gap-2 sm:flex-none sm:w-auto">
                    <Input
                      value={logSearch}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setLogSearch(event.target.value)
                      }
                      placeholder="Loglarda ara"
                      className="h-8 flex-1 rounded-full bg-surface/60 text-xs sm:w-48"
                    />
                  </div>
                  {(['all', 'info', 'success', 'warning'] as const).map(filter => (
                    <Button
                      key={filter}
                      variant={logFilter === filter ? 'default' : 'ghost'}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setLogFilter(filter)}
                    >
                      {filter === 'all' ? 'Tümü' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={clearRunLogs}
                  >
                    Temizle
                  </Button>
                </div>
              </div>
              <ul className="space-y-0 px-4 py-4 text-sm">
                {filteredRunLogs.map(log => {
                  const LogIcon = logIconMap[log.type];
                  return (
                    <li
                      key={log.id}
                      className={cn(
                        'flex items-start justify-between gap-4 rounded-xl border px-3 py-2',
                        logToneMap[log.type]
                      )}
                    >
                      <div className="flex items-start gap-3 text-foreground/90">
                        <LogIcon className="mt-1 h-4 w-4" />
                        <div className="leading-relaxed">{log.message}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>

          <aside className="flex flex-col gap-6">
            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Users className="h-4 w-4" /> Canlı İşbirliği
                </div>
                <Badge
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px]',
                    collaborationStatusTone[collaborationStatus]
                  )}
                >
                  {collaborationStatusLabel[collaborationStatus]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {collaborationPresence.length} ekip üyesi editörü paylaşıyor. İmleçler gerçek
                zamanlı olarak eşitlenir.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {collaborationPresence.map(member => (
                  <li
                    key={member.userId}
                    className={cn(
                      'flex items-center justify-between rounded-xl border border-border/30 bg-surface/60 px-3 py-2',
                      member.userId === 'you' && 'border-primary/40 bg-primary/10 text-foreground'
                    )}
                  >
                    <div>
                      <p className="font-medium text-foreground">{member.displayName}</p>
                      {member.cursor ? (
                        <p className="text-xs text-muted-foreground">
                          Satır {member.cursor.line}, Sütun {member.cursor.column}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Konum paylaşılmadı</p>
                      )}
                    </div>
                    <Badge
                      variant={member.speaking ? 'default' : 'outline'}
                      className="rounded-full text-[10px]"
                    >
                      {member.speaking ? 'Konuşuyor' : 'Hazır'}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Durum güncellemesi:{' '}
                  {collaborationStatus === 'connected'
                    ? 'Senkron stabil.'
                    : 'Senkronizasyon yapılıyor.'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleSyncCollaboration}
                >
                  {collaborationStatus === 'connected' ? 'Senkronize et' : 'Bağlanıyor…'}
                </Button>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Aktivite Geçmişi</span>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <ul className="space-y-2 text-xs">
                  {collaborationActivity.length === 0 ? (
                    <li className="rounded-lg border border-border/30 bg-surface/60 px-3 py-2 text-muted-foreground">
                      Henüz aktivite kaydı yok.
                    </li>
                  ) : (
                    collaborationActivity.map(activity => (
                      <li
                        key={activity.id}
                        className={cn(
                          'rounded-lg border border-border/30 bg-surface/70 px-3 py-2 text-foreground/90',
                          activity.type === 'speaking' && 'border-primary/40',
                          activity.type === 'cursor' && 'border-amber-400/40',
                          activity.type === 'join' && 'border-emerald-400/40',
                          activity.type === 'leave' && 'border-border/50 text-muted-foreground'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{activity.message}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Monitor className="h-4 w-4" />
                  Önizleme
                </div>
                <div className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-surface/70 px-2 py-1 text-xs text-muted-foreground">
                  {viewportLabel}
                </div>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Button
                  variant={viewport === 'desktop' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={() => setViewport('desktop')}
                >
                  <Monitor className="mr-2 h-3.5 w-3.5" /> Masaüstü
                </Button>
                <Button
                  variant={viewport === 'tablet' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={() => setViewport('tablet')}
                >
                  <Tablet className="mr-2 h-3.5 w-3.5" /> Tablet
                </Button>
                <Button
                  variant={viewport === 'mobile' ? 'secondary' : 'outline'}
                  size="sm"
                  className="flex-1 rounded-full"
                  onClick={() => setViewport('mobile')}
                >
                  <Smartphone className="mr-2 h-3.5 w-3.5" /> Mobil
                </Button>
              </div>
              <div
                className={cn(
                  'relative rounded-2xl border border-border/40 bg-surface/70 p-4 shadow-inner transition-all',
                  viewport === 'mobile' && 'max-w-xs self-center',
                  viewport === 'tablet' && 'max-w-md self-center',
                  viewport === 'desktop' && 'w-full',
                  previewCardState,
                  themeTokens.wrapper
                )}
              >
                <div className="rounded-xl border border-border/40 bg-background/90 p-4">
                  <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                    <div className="space-y-3 rounded-xl border border-border/30 bg-surface/80 p-4 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            'text-xs uppercase tracking-[0.3em] text-primary/70',
                            themeTokens.accent
                          )}
                        >
                          {preview.heroTagline}
                        </span>
                        <Badge
                          className={cn(
                            'rounded-full border border-border/40 px-2 py-0.5 text-[10px]',
                            themeTokens.badge
                          )}
                        >
                          {preview.theme.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {preview.heroTitle}
                      </h3>
                      <p className="text-sm text-foreground/80">{preview.heroSubtitle}</p>
                      <div className="flex flex-wrap gap-2 pt-2 text-sm">
                        <Button size="sm" className="rounded-full px-4">
                          {preview.primaryCta}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full px-4">
                          {preview.secondaryCta}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {preview.metrics.map(metric => (
                        <div
                          key={metric.id}
                          className="rounded-xl border border-border/30 bg-surface/80 p-3"
                        >
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                          {metric.trend && (
                            <span className="text-xs text-primary">{metric.trend}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {preview.activity.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-border/30 bg-surface/80 px-3 py-2 text-xs"
                        >
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-muted-foreground/80">{item.description}</p>
                          </div>
                          <span className="text-muted-foreground">{item.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-3 right-3 rounded-full border border-border/40"
                  onClick={togglePreviewLive}
                >
                  {isPreviewLive ? 'Önizlemeyi duraklat' : 'Önizlemeyi başlat'}
                </Button>
                {!isPreviewLive && (
                  <Badge className="absolute left-3 top-3 rounded-full" variant="outline">
                    Canlı değil
                  </Badge>
                )}
              </div>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Kaynaklar</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="rounded-xl border border-border/40 bg-surface/60 p-3">
                  Design token referansı: `/docs/design-system`
                </li>
                <li className="rounded-xl border border-border/40 bg-surface/60 p-3">
                  Deploy yönergesi: `ops/deploy.md`
                </li>
                <li className="rounded-xl border border-border/40 bg-surface/60 p-3">
                  Storybook hızlı açılış: `npm run storybook`
                </li>
              </ul>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Ajan Durumu</h3>
                <Badge variant="secondary" className="rounded-full">
                  {completedAgentsCount}/{agentsState.length} tamamlandı
                </Badge>
              </div>
              <div className="flex gap-2">
                {AGENTS.map(agent => (
                  <Button
                    key={agent}
                    size="sm"
                    variant={activeAgent === agent ? 'secondary' : 'outline'}
                    className="flex-1 rounded-full"
                    onClick={() => setActiveAgent(agent)}
                  >
                    {agent}
                  </Button>
                ))}
              </div>
              <div className="rounded-xl border border-border/30 bg-surface/70 p-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between text-foreground">
                  <span className="font-semibold">{activeAgentState.id}</span>
                  <Badge
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      AGENT_STATUS_BADGES[activeAgentState.status]
                    )}
                  >
                    {AGENT_STATUS_LABELS[activeAgentState.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-foreground/80">{activeAgentState.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Son güncelleme: {activeAgentState.lastUpdated}
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {agentsState.map(agent => (
                  <li
                    key={agent.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border border-border/30 bg-surface/60 px-3 py-2 text-foreground/80',
                      agent.id === activeAgent && 'border-primary/40 bg-primary/10 text-foreground'
                    )}
                  >
                    <span className="font-medium">{agent.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground/70">{agent.lastUpdated}</span>
                      <Badge
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px]',
                          AGENT_STATUS_BADGES[agent.status]
                        )}
                      >
                        {AGENT_STATUS_LABELS[agent.status]}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Üretim Akışı</h3>
                <span className="text-xs">Güncellendi · 3dk</span>
              </div>
              <ol className="space-y-3 text-sm">
                {workflowSteps.map(step => (
                  <li
                    key={step.id}
                    className={cn(
                      'rounded-xl border border-border/30 bg-surface/60 p-3',
                      WORKFLOW_STATUS_TONES[step.status]
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{step.title}</span>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {step.status === 'done' && 'Tamamlandı'}
                        {step.status === 'in-progress' && 'Devam ediyor'}
                        {step.status === 'pending' && 'Beklemede'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80">{step.description}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Test Suite Durumu</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleRerunTests}
                  disabled={isAnyTestRunning}
                >
                  {isAnyTestRunning ? 'Testler Çalışıyor…' : 'Testleri Yeniden Çalıştır'}
                </Button>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {testSuitesState.map(suite => (
                  <li
                    key={suite.id}
                    className={cn(
                      'rounded-xl border border-border/30 p-3',
                      TEST_RESULT_TONES[suite.result]
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{suite.name}</span>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {TEST_RESULT_LABELS[suite.result]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-foreground/80">
                      <span>Süre: {suite.duration}</span>
                      <span>Kapsam: {suite.coverage}</span>
                    </div>
                    {typeof suite.progress === 'number' && (
                      <div className="mt-3 space-y-1">
                        <Progress value={suite.progress} className="h-1.5" />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{suite.statusNote ?? 'İlerleme güncelleniyor…'}</span>
                          <span>%{suite.progress}</span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4 border-border/40 bg-background/95 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Klavye Kısayolları</h3>
                <Button variant="ghost" size="sm" className="rounded-full" onClick={toggleWrap}>
                  {isWrapEnabled ? 'Satır Kaydırma Açık' : 'Satır Kaydırma Kapalı'}
                </Button>
              </div>
              <ul className="space-y-2 text-sm">
                {KEYBOARD_SHORTCUTS.map(shortcut => (
                  <li
                    key={shortcut.id}
                    className="flex items-center justify-between rounded-xl border border-border/30 bg-surface/60 px-3 py-2"
                  >
                    <span className="text-foreground/90">{shortcut.description}</span>
                    <code className="rounded-full border border-border/40 bg-background/90 px-2 py-0.5 text-xs">
                      {shortcut.combo}
                    </code>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
