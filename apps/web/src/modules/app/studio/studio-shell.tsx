'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  mockAgentThreads,
  mockProjectFiles,
  mockProjects,
  mockRunLogs,
  type MockProject,
  type MockAgentThread,
  type MockProjectFile,
  type MockRunLog,
} from '@/services/mock-data';

type FileTreeNode = {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
};

type AISuggestionImpact = 'high' | 'medium' | 'low';

type AISuggestion = {
  id: string;
  title: string;
  description: string;
  impact: AISuggestionImpact;
};

type SuggestionStatus = 'idle' | 'queued' | 'in-progress' | 'completed';

type SuggestionState = {
  status: SuggestionStatus;
  note: string;
  progress?: number;
  lastUpdated?: string;
};

type PromptNote = {
  id: string;
  label: string;
  checked: boolean;
};

type TestSuite = {
  id: string;
  name: string;
  status: 'running' | 'pass' | 'failed';
  coverage: string;
  duration: string;
  updatedAt: string;
  progress?: number;
};

const depthClassMap = ['pl-0', 'pl-3', 'pl-6', 'pl-9', 'pl-12'];
const logLevelOptions = [
  { value: 'all', label: 'Hepsi' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warn' },
  { value: 'error', label: 'Error' },
] as const;

const templateLanguageDefaults: Record<MockProject['template'], MockProjectFile['language']> = {
  nextjs: 'typescript',
  fastapi: 'python',
  express: 'javascript',
};

const aiSuggestions: AISuggestion[] = [
  {
    id: 'suggestion-hero',
    title: 'Hero bölümüne video arka plan ekle',
    description: 'CTA dönüşümünü artırmak için düşük opaklı video arka plan ekleyin.',
    impact: 'high',
  },
  {
    id: 'suggestion-accessibility',
    title: 'Erişilebilirlik denetimi çalıştır',
    description: 'WCAG kontrast ölçümü alıp problemli bileşenleri raporlayın.',
    impact: 'medium',
  },
  {
    id: 'suggestion-tests',
    title: 'E2E test coverage artır',
    description: 'Workflow tabanlı E2E test senaryosu ekleyin.',
    impact: 'medium',
  },
];

const initialPromptNotes: PromptNote[] = [
  { id: 'note-brief', label: 'Brief içeriği net mi?', checked: true },
  { id: 'note-preview', label: 'Önizleme bağlantısı eklendi mi?', checked: false },
  { id: 'note-copy', label: 'Metin içeriği revize edildi mi?', checked: false },
];

const initialTestSuites: TestSuite[] = [
  {
    id: 'suite-ui',
    name: 'UI regresyonları',
    status: 'running',
    coverage: '%78',
    duration: '02:45',
    updatedAt: new Date().toLocaleTimeString('tr-TR'),
    progress: 42,
  },
  {
    id: 'suite-api',
    name: 'API entegrasyonları',
    status: 'pass',
    coverage: '%64',
    duration: '01:17',
    updatedAt: new Date().toLocaleTimeString('tr-TR'),
  },
  {
    id: 'suite-agents',
    name: 'Ajan orchestrator',
    status: 'failed',
    coverage: '%52',
    duration: '00:58',
    updatedAt: new Date().toLocaleTimeString('tr-TR'),
  },
];

const suggestionStatusTone: Record<SuggestionStatus, string> = {
  idle: 'border-white/15 bg-white/5 text-foreground',
  queued: 'border-amber-400/30 bg-amber-400/10 text-amber-100',
  'in-progress': 'border-blue-400/30 bg-blue-400/10 text-blue-100',
  completed: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
};

const suggestionStatusLabel: Record<SuggestionStatus, string> = {
  idle: 'Hazır',
  queued: 'Kuyrukta',
  'in-progress': 'İşleniyor',
  completed: 'Tamamlandı',
};

const suggestionImpactTone: Record<AISuggestionImpact, string> = {
  high: 'border-red-400/30 bg-red-500/10 text-red-100',
  medium: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  low: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
};

const progressWidthClassMap: Record<number, string> = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-[50%]',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full',
};

function getProgressWidthClass(progress: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress / 10) * 10));
  return progressWidthClassMap[clamped] ?? 'w-full';
}

function getIndentClass(depth: number) {
  const index = Math.min(depth, depthClassMap.length - 1);
  return depthClassMap[index];
}

function buildFileTree(files: MockProjectFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const dirMap = new Map<string, FileTreeNode>();

  files.forEach(file => {
    const segments = file.path.split('/');
    let parentChildren = root;
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isFile = index === segments.length - 1;

      if (isFile) {
        parentChildren.push({
          id: file.id,
          name: segment,
          path: file.path,
          type: 'file',
        });
        return;
      }

      const dirKey = `dir:${currentPath}`;
      let dirNode = dirMap.get(dirKey);

      if (!dirNode) {
        dirNode = {
          id: dirKey,
          name: segment,
          path: currentPath,
          type: 'directory',
          children: [],
        };
        dirMap.set(dirKey, dirNode);
        parentChildren.push(dirNode);
      }

      parentChildren = dirNode.children ?? (dirNode.children = []);
    });
  });

  const sortNodes = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });

    nodes.forEach(node => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(root);

  return root;
}

function StudioShell() {
  const { activeWorkspace } = useWorkspace();

  const [runLogs, setRunLogs] = useState<MockRunLog[]>(mockRunLogs);
  const [agentTodos, setAgentTodos] = useState<MockAgentThread[]>(mockAgentThreads);
  const [codeValue, setCodeValue] = useState('');
  const [language, setLanguage] = useState<MockProjectFile['language']>('typescript');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const toastCooldownRef = useRef<Record<string, number>>({});
  const [logLevelFilter, setLogLevelFilter] =
    useState<(typeof logLevelOptions)[number]['value']>('all');

  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [debouncedLogSearch, setDebouncedLogSearch] = useState('');
  const [logSortOrder, setLogSortOrder] = useState<'desc' | 'asc'>('desc');
  const [promptNotes, setPromptNotes] = useState<PromptNote[]>(initialPromptNotes);
  const [suggestionState, setSuggestionState] = useState<Record<string, SuggestionState>>({
    ...Object.fromEntries(
      aiSuggestions.map(suggestion => [suggestion.id, { status: 'idle', note: 'Hazır' }])
    ),
  });
  const [suggestionQueue, setSuggestionQueue] = useState<string[]>([]);
  const suggestionTimers = useRef<Record<string, NodeJS.Timeout[]>>({});
  const [testSuites, setTestSuites] = useState<TestSuite[]>(initialTestSuites);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedLogSearch(logSearchTerm.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(timeout);
  }, [logSearchTerm]);

  useEffect(() => {
    return () => {
      Object.values(suggestionTimers.current).forEach(timers => {
        timers?.forEach(timer => clearTimeout(timer));
      });
      suggestionTimers.current = {};
    };
  }, []);

  const activeProject = useMemo(() => {
    if (!activeWorkspace) {
      return null;
    }

    return (
      mockProjects.find(
        project => project.workspaceId === activeWorkspace.id && project.status === 'active'
      ) ??
      mockProjects.find(project => project.workspaceId === activeWorkspace.id) ??
      null
    );
  }, [activeWorkspace]);

  const projectFiles = useMemo<MockProjectFile[]>(() => {
    if (!activeProject) {
      return [];
    }
    return mockProjectFiles
      .filter(file => file.projectId === activeProject.id)
      .sort((a, b) => a.path.localeCompare(b.path));
  }, [activeProject]);

  const fileTree = useMemo<FileTreeNode[]>(() => buildFileTree(projectFiles), [projectFiles]);

  const activeFile = useMemo<MockProjectFile | null>(() => {
    if (!selectedFileId) {
      return null;
    }
    return projectFiles.find(file => file.id === selectedFileId) ?? null;
  }, [projectFiles, selectedFileId]);

  useEffect(() => {
    if (!activeFile) {
      return;
    }

    setLanguage(() => {
      switch (activeFile.language) {
        case 'python':
          return 'python';
        case 'markdown':
          return 'markdown';
        case 'javascript':
          return 'javascript';
        default:
          return 'typescript';
      }
    });

    setCodeValue(drafts[activeFile.id] ?? activeFile.content);
  }, [activeFile, drafts]);

  const dirtyFileIds = useMemo(() => new Set(Object.keys(drafts)), [drafts]);
  const isActiveFileDirty = activeFile ? dirtyFileIds.has(activeFile.id) : false;

  const filteredRunLogs = useMemo(() => {
    const levelFiltered = runLogs.filter(
      log => logLevelFilter === 'all' || log.level === logLevelFilter
    );

    const searched = debouncedLogSearch
      ? levelFiltered.filter(log =>
          [log.message, log.level, new Date(log.timestamp).toLocaleTimeString('tr-TR')]
            .join(' ')
            .toLowerCase()
            .includes(debouncedLogSearch)
        )
      : levelFiltered;

    return [...searched].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();

      return logSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [debouncedLogSearch, logLevelFilter, logSortOrder, runLogs]);

  const pushToast = useCallback(
    (key: string, payload: Parameters<typeof toast>[0], cooldownMs = 1500) => {
      const now = Date.now();
      const lastShown = toastCooldownRef.current[key] ?? 0;

      if (now - lastShown < cooldownMs) {
        return;
      }

      toastCooldownRef.current[key] = now;
      toast(payload);
    },
    []
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const nextValue = value ?? '';
      setCodeValue(nextValue);

      if (selectedFileId && activeFile) {
        setDrafts(prev => {
          if (nextValue === activeFile.content) {
            const nextDrafts = { ...prev };
            delete nextDrafts[selectedFileId];
            return nextDrafts;
          }
          return { ...prev, [selectedFileId]: nextValue };
        });
      }
    },
    [selectedFileId, activeFile]
  );

  const updateSuggestionState = useCallback((id: string, partial: Partial<SuggestionState>) => {
    setSuggestionState(prev => {
      const current = prev[id] ?? { status: 'idle', note: 'Hazır' };
      const next: SuggestionState = {
        ...current,
        ...partial,
        lastUpdated: partial.lastUpdated ?? new Date().toLocaleTimeString('tr-TR'),
      };

      return {
        ...prev,
        [id]: next,
      };
    });
  }, []);

  const appendSuggestionLog = useCallback(
    (message: string, level: MockRunLog['level'] = 'info') => {
      setRunLogs(prev => [
        {
          id: `suggestion-log-${Date.now()}`,
          message,
          level,
          projectId: activeProject?.id ?? 'unknown',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [activeProject?.id]
  );

  const enqueueSuggestion = useCallback(
    (id: string) => {
      setSuggestionQueue(prev => (prev.includes(id) ? prev : [...prev, id]));
      updateSuggestionState(id, {
        status: 'queued',
        note: 'Kuyrukta',
        progress: 10,
      });
    },
    [updateSuggestionState]
  );

  const stopSuggestionTimers = useCallback((id: string) => {
    suggestionTimers.current[id]?.forEach(timer => clearTimeout(timer));
    suggestionTimers.current[id] = [];
  }, []);

  const runSuggestionTimers = useCallback(
    (suggestion: AISuggestion) => {
      stopSuggestionTimers(suggestion.id);
      const steps: {
        delay: number;
        update?: Partial<SuggestionState>;
        log?: { message: string; level?: MockRunLog['level'] };
        effect?: () => void;
      }[] = [
        {
          delay: 1200,
          update: { status: 'in-progress', note: 'Ajan kuyruklarında işleniyor', progress: 45 },
          log: { message: `${suggestion.title} ajanlara atandı.` },
        },
        {
          delay: 2600,
          update: { status: 'in-progress', note: 'Son doğrulamalar yapılıyor', progress: 80 },
        },
        {
          delay: 4200,
          effect: () => {
            updateSuggestionState(suggestion.id, {
              status: 'completed',
              note: 'Tamamlandı',
              progress: 100,
            });
            setSuggestionQueue(prev => prev.filter(item => item !== suggestion.id));
            appendSuggestionLog(`${suggestion.title} önerisi tamamlandı.`, 'info');
          },
        },
      ];

      suggestionTimers.current[suggestion.id] = steps.map(step => {
        const timer = setTimeout(() => {
          if (step.update) {
            updateSuggestionState(suggestion.id, step.update);
          }
          if (step.log) {
            appendSuggestionLog(step.log.message, step.log.level ?? 'info');
          }
          step.effect?.();
        }, step.delay);
        return timer;
      });
    },
    [appendSuggestionLog, stopSuggestionTimers, updateSuggestionState]
  );

  const applySuggestion = useCallback(
    (suggestion: AISuggestion) => {
      enqueueSuggestion(suggestion.id);
      setCodeValue(current =>
        `${current}\n\n// AI önerisi: ${suggestion.title}\n// ${suggestion.description}`.trim()
      );
      appendSuggestionLog(`AI önerisi kuyruğa alındı: ${suggestion.title}`);
      runSuggestionTimers(suggestion);
    },
    [appendSuggestionLog, enqueueSuggestion, runSuggestionTimers]
  );

  const revertSuggestion = useCallback(
    (suggestion: AISuggestion) => {
      stopSuggestionTimers(suggestion.id);
      setSuggestionQueue(prev => prev.filter(item => item !== suggestion.id));
      updateSuggestionState(suggestion.id, {
        status: 'idle',
        note: 'Hazır',
        progress: undefined,
      });
      appendSuggestionLog(`${suggestion.title} önerisi geri alındı.`, 'warn');
    },
    [appendSuggestionLog, stopSuggestionTimers, updateSuggestionState]
  );

  const togglePromptNote = useCallback((id: string) => {
    setPromptNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, checked: !note.checked } : note))
    );
  }, []);

  const refreshTestSuite = useCallback(() => {
    setTestSuites(prev =>
      prev.map(suite =>
        suite.status === 'running'
          ? {
              ...suite,
              status: 'pass',
              progress: 100,
              coverage: '%82',
              updatedAt: new Date().toLocaleTimeString('tr-TR'),
            }
          : suite
      )
    );
    appendSuggestionLog('Test ortamı güncellendi, sonuçlar başarıyla yenilendi.');
  }, [appendSuggestionLog]);

  const handleResetCode = useCallback(() => {
    if (activeFile) {
      setCodeValue(activeFile.content);
      setDrafts(prev => {
        const next = { ...prev };
        delete next[activeFile.id];
        return next;
      });
      return;
    }

    if (!activeProject) {
      setCodeValue('');
      return;
    }

    setLanguage(templateLanguageDefaults[activeProject.template]);
    setCodeValue('// TODO: Bu proje için başlangıç dosyası ekleyin.');
  }, [activeFile, activeProject]);

  const handleRunCode = useCallback(async () => {
    if (!activeProject || !activeFile) {
      return;
    }

    setIsRunning(true);

    try {
      const response = await fetch('/api/editor/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: activeProject.id,
          fileId: activeFile.id,
          path: activeFile.path,
          content: codeValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Run isteği ${response.status} kodu ile başarısız oldu.`);
      }

      const result = await response.json();

      const runLog: MockRunLog = {
        id: `run-log-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        level: 'info',
        message:
          result?.message ??
          `${activeFile.path} dosyası için run tetiklendi. (mock: worker kuyruğuna gönderildi)`.trim(),
      };

      setRunLogs(prev => [runLog, ...prev].slice(0, 15));
      pushToast('run:success', {
        title: 'Run kuyruğa alındı',
        description: `${activeFile.path} için run tetiklendi. Terminali kontrol edin.`,
      });
    } catch (error) {
      const runError = error instanceof Error ? error.message : 'Bilinmeyen run hatası';
      const errorLog: MockRunLog = {
        id: `run-error-${Date.now()}`,
        projectId: activeProject?.id ?? 'unknown',
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `Run başarısız: ${runError}`,
      };
      setRunLogs(prev => [errorLog, ...prev].slice(0, 15));
      pushToast('run:error', {
        title: 'Run başarısız',
        description: runError,
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [activeProject, activeFile, codeValue, pushToast]);

  const handleSaveFile = useCallback(async () => {
    if (!activeProject || !activeFile) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/editor/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: activeProject.id,
          fileId: activeFile.id,
          path: activeFile.path,
          content: codeValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Kaydetme isteği ${response.status} kodu ile başarısız oldu.`);
      }

      await response.json();

      setDrafts(prev => {
        const next = { ...prev };
        delete next[activeFile.id];
        return next;
      });

      const saveLog: MockRunLog = {
        id: `save-log-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `${activeFile.path} kaydedildi.`,
      };

      setRunLogs(prev => [saveLog, ...prev].slice(0, 15));
      pushToast('save:success', {
        title: 'Kaydetme başarılı',
        description: `${activeFile.path} için taslak güncellendi.`,
      });
    } catch (error) {
      const saveError = error instanceof Error ? error.message : 'Bilinmeyen kaydetme hatası';
      const errorLog: MockRunLog = {
        id: `save-error-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `Kaydetme başarısız: ${saveError}`,
      };
      setRunLogs(prev => [errorLog, ...prev].slice(0, 15));
      pushToast('save:error', {
        title: 'Kaydetme başarısız',
        description: saveError,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [activeProject, activeFile, codeValue, pushToast]);

  const handleSimulateAgentTask = useCallback(() => {
    if (!activeProject) {
      return;
    }

    const newTask: MockAgentThread = {
      id: `agent-thread-${Date.now()}`,
      projectId: activeProject.id,
      role: 'reviewer',
      lastMessage: 'Stub: Kod inceleme isteği kuyruklandı. Loglar güncellendi.',
      updatedAt: new Date().toISOString(),
      workspaceId: activeWorkspace?.id ?? 'unknown',
    };

    setAgentTodos(prev => [newTask, ...prev]);
  }, [activeProject, activeWorkspace]);

  const renderFileTree = useCallback(
    (nodes: FileTreeNode[], depth = 0): JSX.Element[] =>
      nodes.flatMap(node => {
        if (node.type === 'directory') {
          return (
            <li key={node.id} className="text-sm">
              <div
                className={cn(
                  'flex items-center gap-2 py-1 text-muted-foreground',
                  getIndentClass(depth)
                )}
              >
                <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/60">
                  {node.name}
                </span>
              </div>
              {node.children ? (
                <ul className="mt-1 space-y-1">{renderFileTree(node.children, depth + 1)}</ul>
              ) : null}
            </li>
          );
        }

        const isActive = selectedFileId === node.id;
        const isDirty = dirtyFileIds.has(node.id);

        return (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => setSelectedFileId(node.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition',
                getIndentClass(depth),
                isActive
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              )}
            >
              <span className="truncate">{node.name}</span>
              {isDirty ? <span className="text-[0.6rem] uppercase text-amber-300">●</span> : null}
            </button>
          </li>
        );
      }),
    [dirtyFileIds, selectedFileId]
  );

  if (!activeWorkspace) {
    return (
      <section className="space-y-6">
        <p className="text-sm text-muted-foreground">Workspace verisi yükleniyor...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-3xl border border-white/10 bg-background/70 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Codexonx Studio</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">
              {activeProject ? activeProject.name : 'Aktif proje seçilmedi'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Workspace bağlamını bilen ajanlar, canlı terminal ve docker tabanlı run pipeline ile
              üretim süreçlerini tek panelden takip edin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              Workspace: {activeWorkspace.name}
            </span>
            {activeProject ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                Şablon: {activeProject.template}
              </span>
            ) : null}
            {activeProject ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                Son aktivite: {new Date(activeProject.lastActivity).toLocaleString('tr-TR')}
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
            onClick={handleRunCode}
            disabled={!activeProject || !activeFile || isRunning}
          >
            {isRunning ? 'Çalıştırılıyor...' : 'Run tetikle'}
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            onClick={handleSimulateAgentTask}
          >
            Stub ajan görevi oluştur
          </button>
          <button
            type="button"
            className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
            onClick={handleSaveFile}
            disabled={!activeFile || !isActiveFileDirty || isSaving}
          >
            {isSaving ? 'Kaydediliyor...' : 'Dosyayı kaydet'}
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/0 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            onClick={handleResetCode}
            disabled={!activeProject}
          >
            Kod şablonunu sıfırla
          </button>
        </div>
      </header>

      <div className="grid gap-6 2xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-background/60 p-4 text-xs text-muted-foreground">
          <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-primary/70">
            <span>Dosya ağacı</span>
            <span className="text-muted-foreground/60">{projectFiles.length} adet</span>
          </div>
          {fileTree.length === 0 ? (
            <p className="mt-4 text-xs text-muted-foreground/70">
              Bu projeye ait mock dosya bulunamadı.
            </p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {renderFileTree(fileTree)}
            </ul>
          )}
          <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-muted-foreground">
            <div className="text-[0.7rem] uppercase tracking-[0.3em] text-primary/70">
              Prompt Checklist
            </div>
            <ul className="mt-3 space-y-2">
              {promptNotes.map(note => (
                <li key={note.id} className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={note.checked}
                      onChange={() => togglePromptNote(note.id)}
                      className="h-3.5 w-3.5 rounded border-white/20 bg-black/60 accent-primary"
                    />
                    <span>{note.label}</span>
                  </label>
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/60">
                    {note.checked ? 'Tamamlandı' : 'Bekliyor'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-black/80">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-white/5 px-4 py-3 text-xs text-muted-foreground">
              <div>
                <span className="font-medium uppercase tracking-[0.35em] text-primary/70">
                  Monaco Editor
                </span>
                <p className="mt-1 text-[0.7rem] text-muted-foreground/70">
                  {activeFile ? activeFile.path : 'Dosya seçilmedi'}
                  {isActiveFileDirty ? ' • Kaydedilmedi' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem]">
                <span>
                  Dil: <span className="capitalize text-foreground">{language}</span>
                </span>
                {!isEditorReady ? (
                  <span className="text-muted-foreground/60">(hazırlanıyor...)</span>
                ) : null}
              </div>
            </div>
            <Editor
              height="420px"
              theme="vs-dark"
              language={language}
              value={codeValue}
              onChange={handleEditorChange}
              onMount={() => setIsEditorReady(true)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                cursorSmoothCaretAnimation: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                bracketPairColorization: { enabled: true },
                tabSize: 2,
              }}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/60 p-4 font-mono text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-primary/70">
              <div className="flex items-center gap-3">
                <span>Terminal</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.6rem] normal-case tracking-[0.2em] text-muted-foreground/70">
                  {filteredRunLogs.length}/{runLogs.length}
                </span>
              </div>
              <div className="flex w-full flex-1 justify-end">
                <input
                  type="search"
                  value={logSearchTerm}
                  onChange={event => setLogSearchTerm(event.target.value)}
                  placeholder="Log ara..."
                  className="w-full max-w-xs rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.65rem] normal-case tracking-normal text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                {logLevelOptions.map(option => {
                  const isActive = logLevelFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLogLevelFilter(option.value)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs transition',
                        isActive
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-white/10 bg-white/0 text-muted-foreground hover:border-white/30 hover:text-foreground'
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/60">
                  Sıralama
                </span>
                <div className="inline-flex rounded-full border border-white/10 bg-white/0 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLogSortOrder('desc')}
                    className={cn(
                      'rounded-full px-3 py-1 text-[0.65rem] transition',
                      logSortOrder === 'desc'
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Yeni → Eski
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogSortOrder('asc')}
                    className={cn(
                      'rounded-full px-3 py-1 text-[0.65rem] transition',
                      logSortOrder === 'asc'
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Eski → Yeni
                  </button>
                </div>
              </div>
            </div>
            {filteredRunLogs.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground/70">
                {logLevelFilter === 'all'
                  ? 'Henüz run logu bulunmuyor. Run tetiklediğinde çıktılar burada görünecek.'
                  : 'Bu filtre için log bulunamadı. Başka bir seviye seçmeyi deneyin.'}
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {filteredRunLogs.map(log => (
                  <li
                    key={log.id}
                    className="rounded-lg border border-white/5 bg-black/60 p-3 text-muted-foreground"
                  >
                    <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground/70">
                      <span>{new Date(log.timestamp).toLocaleTimeString('tr-TR')}</span>
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold',
                          log.level === 'error'
                            ? 'border-red-400 text-red-300'
                            : log.level === 'warn'
                              ? 'border-amber-400 text-amber-200'
                              : 'border-emerald-400 text-emerald-200'
                        )}
                      >
                        {log.level}
                      </span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap text-xs text-foreground/90">
                      {log.message}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">Ajan görev listesi</h2>
            <ul className="mt-3 space-y-2 text-xs">
              {agentTodos.length === 0 ? (
                <li className="rounded-lg border border-white/5 bg-white/5 p-3 text-muted-foreground/70">
                  {activeProject
                    ? 'Ajan görevi bulunamadı.'
                    : 'Bu workspace için ajan görevi bulunamadı.'}
                </li>
              ) : (
                agentTodos.map(thread => (
                  <li
                    key={thread.id}
                    className="rounded-lg border border-white/5 bg-white/5 p-3 text-muted-foreground"
                  >
                    <div className="flex items-center justify-between font-medium text-foreground">
                      <span className="uppercase tracking-[0.3em] text-primary/70">
                        {thread.role}
                      </span>
                      <span>{new Date(thread.updatedAt).toLocaleTimeString('tr-TR')}</span>
                    </div>
                    <p className="mt-2 text-[0.8rem]">{thread.lastMessage}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-xs text-muted-foreground">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">
              Studio quick stats
            </h2>
            <dl className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <dt>Aktif dosya</dt>
                <dd className="font-medium text-foreground">
                  {activeFile ? activeFile.path : '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Terminal log sayısı</dt>
                <dd className="font-medium text-foreground">{runLogs.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Kaydedilmemiş değişiklik</dt>
                <dd
                  className={cn(
                    'font-medium',
                    isActiveFileDirty ? 'text-amber-300' : 'text-emerald-300'
                  )}
                >
                  {isActiveFileDirty ? 'Var' : 'Yok'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">
                AI önerileri
              </h2>
              <button
                type="button"
                onClick={() => {
                  suggestionQueue.forEach(id => stopSuggestionTimers(id));
                  setSuggestionQueue([]);
                  aiSuggestions.forEach(suggestion =>
                    updateSuggestionState(suggestion.id, {
                      status: 'idle',
                      note: 'Hazır',
                      progress: undefined,
                    })
                  );
                  appendSuggestionLog('AI öneri kuyruğu temizlendi.');
                }}
                className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] tracking-[0.3em] text-muted-foreground transition hover:border-white/30 hover:text-foreground"
                disabled={suggestionQueue.length === 0}
              >
                Kuyruğu temizle
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {aiSuggestions.map(suggestion => {
                const state = suggestionState[suggestion.id] ?? { status: 'idle', note: 'Hazır' };
                return (
                  <div
                    key={suggestion.id}
                    className={cn(
                      'rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-muted-foreground',
                      suggestionStatusTone[state.status],
                      suggestionImpactTone[suggestion.impact]
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                        <p className="text-xs text-foreground/70">{suggestion.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="rounded-full border border-white/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
                          {suggestion.impact}
                        </div>
                        <div className="mt-2 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
                          {suggestionStatusLabel[state.status]}
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-muted-foreground/80">
                      <span>{state.note}</span>
                      <span className="text-muted-foreground/50">{state.lastUpdated ?? '—'}</span>
                    </div>
                    {typeof state.progress === 'number' ? (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground/60">
                          <span>İlerleme</span>
                          <span>%{state.progress}</span>
                        </div>
                        <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={cn(
                              'absolute inset-y-0 left-0 rounded-full bg-primary transition-all',
                              getProgressWidthClass(state.progress)
                            )}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
                        onClick={() => applySuggestion(suggestion)}
                        disabled={['queued', 'in-progress'].includes(state.status)}
                      >
                        {state.status === 'completed' ? 'Tekrar uygula' : "Prompt'a ekle"}
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] text-muted-foreground transition hover:border-white/30 hover:text-foreground disabled:opacity-50"
                        onClick={() => revertSuggestion(suggestion)}
                        disabled={state.status === 'idle'}
                      >
                        {state.status === 'completed' ? 'Geri al' : 'İptal et'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">
                Test Suites
              </h2>
              <button
                type="button"
                onClick={refreshTestSuite}
                className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] tracking-[0.3em] text-muted-foreground transition hover:border-white/30 hover:text-foreground"
              >
                Sonuçları yenile
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {testSuites.map(suite => (
                <div
                  key={suite.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-muted-foreground"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{suite.name}</h3>
                      <p className="text-[0.7rem] text-muted-foreground/70">
                        Kapsama: {suite.coverage} • Süre: {suite.duration}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground/70">
                      {suite.status === 'running'
                        ? 'RUNNING'
                        : suite.status === 'pass'
                          ? 'PASS'
                          : 'FAILED'}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[0.65rem] text-muted-foreground/60">
                    <span>Son güncelleme</span>
                    <span>{suite.updatedAt}</span>
                  </div>
                  {typeof suite.progress === 'number' ? (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          suite.status === 'running'
                            ? 'bg-amber-400'
                            : suite.status === 'pass'
                              ? 'bg-emerald-400'
                              : 'bg-red-400',
                          getProgressWidthClass(suite.progress)
                        )}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default StudioShell;
