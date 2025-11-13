'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { m } from 'framer-motion';

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

const panelBaseClass =
  'relative overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(12,14,18,0.94)_0%,rgba(8,10,16,0.9)_48%,rgba(5,7,12,0.95)_100%)] shadow-[0_40px_90px_rgba(2,4,12,0.6)] backdrop-blur';
const panelHoverClass =
  'transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_45px_rgba(255,107,44,0.25)]';
const primaryActionClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(120deg,#FF6B2C_0%,#FF9247_48%,#FFE1A0_100%)] px-5 py-2 text-xs font-semibold text-black shadow-[0_0_45px_rgba(255,107,44,0.35)] transition hover:shadow-[0_0_60px_rgba(255,107,44,0.45)] disabled:cursor-not-allowed disabled:opacity-60';
const secondaryActionClass =
  'inline-flex items-center justify-center rounded-full border border-white/18 bg-white/[0.06] px-5 py-2 text-xs font-semibold text-white/85 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-60';
const ghostActionClass =
  'inline-flex items-center justify-center rounded-full border border-white/12 bg-transparent px-5 py-2 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50';

const panelMotionProps = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: 'easeOut' },
} as const;

const primaryActionMotionProps = {
  whileHover: { scale: 1.02, boxShadow: '0 0 38px rgba(255,107,44,0.45)' },
  whileTap: { scale: 0.97 },
} as const;

const secondaryActionMotionProps = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.985 },
} as const;

const subtleListHoverMotionProps = {
  whileHover: { y: -3, scale: 1.005 },
  whileTap: { scale: 0.995 },
} as const;

const cardHoverMotionProps = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.985 },
} as const;

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

function getListStaggerProps(index: number, depth = 0) {
  const delay = Math.min(0.5, index * 0.04 + depth * 0.03);
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, ease: 'easeOut', delay },
  };
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
      nodes.map((node, index) => {
        const motion = getListStaggerProps(index, depth);

        if (node.type === 'directory') {
          return (
            <m.li key={node.id} {...motion} className="text-sm">
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
            </m.li>
          );
        }

        const isActive = selectedFileId === node.id;
        const isDirty = dirtyFileIds.has(node.id);

        return (
          <m.li key={node.id} {...motion}>
            <m.button
              type="button"
              onClick={() => setSelectedFileId(node.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition',
                getIndentClass(depth),
                isActive
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              )}
              {...subtleListHoverMotionProps}
            >
              <span className="truncate">{node.name}</span>
              {isDirty ? <span className="text-[0.6rem] uppercase text-amber-300">●</span> : null}
            </m.button>
          </m.li>
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
    <section className="relative flex flex-col gap-6 overflow-hidden py-6">
      <div
        className="pointer-events-none absolute inset-0 -z-40 bg-[linear-gradient(150deg,rgba(5,6,9,0.92)_0%,rgba(8,10,14,0.96)_48%,rgba(3,4,7,0.9)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,_rgba(255,146,71,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(84,120,255,0.22),_transparent_72%)]"
        aria-hidden
      />
      <m.header
        {...panelMotionProps}
        className={cn(panelBaseClass, 'rounded-3xl border-white/15 px-6 py-6')}
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-[-18%] top-[-15%] h-[160%] w-[60%] bg-[radial-gradient(circle,rgba(255,107,44,0.28),transparent_65%)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 top-12 h-36 w-36 rounded-full bg-[rgba(84,120,255,0.22)] blur-3xl"
          aria-hidden
        />
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
          <m.button
            {...primaryActionMotionProps}
            type="button"
            className={cn(primaryActionClass, 'px-6')}
            onClick={handleRunCode}
            disabled={!activeProject || !activeFile || isRunning}
          >
            {isRunning ? 'Çalıştırılıyor...' : 'Run tetikle'}
          </m.button>
          <m.button
            {...secondaryActionMotionProps}
            type="button"
            className={secondaryActionClass}
            onClick={handleSimulateAgentTask}
          >
            Stub ajan görevi oluştur
          </m.button>
          <m.button
            {...secondaryActionMotionProps}
            type="button"
            className={cn(
              secondaryActionClass,
              'border-primary/30 text-primary hover:border-primary/50 hover:text-primary/90'
            )}
            onClick={handleSaveFile}
            disabled={!activeFile || !isActiveFileDirty || isSaving}
          >
            {isSaving ? 'Kaydediliyor...' : 'Dosyayı kaydet'}
          </m.button>
          <m.button
            {...secondaryActionMotionProps}
            type="button"
            className={ghostActionClass}
            onClick={handleResetCode}
            disabled={!activeProject}
          >
            Kod şablonunu sıfırla
          </m.button>
        </div>
      </m.header>

      <div className="grid gap-6 2xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        <m.aside
          {...panelMotionProps}
          className={cn(panelBaseClass, panelHoverClass, 'space-y-5 p-5 text-xs text-white/70')}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle,rgba(255,146,71,0.2),transparent_75%)] blur-2xl"
            aria-hidden
          />
          <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-primary/75">
            <span>Dosya ağacı</span>
            <span className="text-white/40">{projectFiles.length} adet</span>
          </div>
          {fileTree.length === 0 ? (
            <p className="mt-4 text-xs text-white/60">Bu projeye ait mock dosya bulunamadı.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm text-white/70">{renderFileTree(fileTree)}</ul>
          )}
        </m.aside>

        <div className="flex flex-col gap-6">
          <m.article {...panelMotionProps} className={cn(panelBaseClass, 'border-white/15')}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs text-white/70">
              <div>
                <span className="font-medium uppercase tracking-[0.35em] text-primary/75">
                  Monaco Editor
                </span>
                <p className="mt-1 text-[0.7rem] text-white/50">
                  {activeFile ? activeFile.path : 'Dosya seçilmedi'}
                  {isActiveFileDirty ? ' • Kaydedilmedi' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[0.7rem]">
                <span>
                  Dil: <span className="capitalize text-white/90">{language}</span>
                </span>
                {!isEditorReady ? <span className="text-white/40">(hazırlanıyor...)</span> : null}
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
          </m.article>

          <m.section
            {...panelMotionProps}
            className={cn(panelBaseClass, 'border-white/15 p-5 font-mono text-xs text-white/70')}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-primary/75">
              <div className="flex items-center gap-3">
                <span>Terminal</span>
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-1 text-[0.6rem] normal-case tracking-[0.2em] text-white/60">
                  {filteredRunLogs.length}/{runLogs.length}
                </span>
              </div>
              <div className="flex w-full flex-1 justify-end">
                <input
                  type="search"
                  value={logSearchTerm}
                  onChange={event => setLogSearchTerm(event.target.value)}
                  placeholder="Log ara..."
                  className="w-full max-w-xs rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.65rem] normal-case tracking-normal text-white/65">
              <div className="flex flex-wrap items-center gap-2">
                {logLevelOptions.map(option => {
                  const isActive = logLevelFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLogLevelFilter(option.value)}
                      className={cn(
                        secondaryActionClass,
                        'px-3 py-1 text-[0.65rem]',
                        isActive &&
                          'border-primary/50 bg-primary/15 text-primary shadow-[0_0_25px_rgba(255,107,44,0.25)]'
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
                  Sıralama
                </span>
                <div className="inline-flex rounded-full border border-white/15 bg-white/[0.04] p-0.5">
                  <button
                    type="button"
                    onClick={() => setLogSortOrder('desc')}
                    className={cn(
                      secondaryActionClass,
                      'border-none px-3 py-1 text-[0.65rem]',
                      logSortOrder === 'desc'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-transparent text-white/60 hover:text-white'
                    )}
                  >
                    Yeni → Eski
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogSortOrder('asc')}
                    className={cn(
                      secondaryActionClass,
                      'border-none px-3 py-1 text-[0.65rem]',
                      logSortOrder === 'asc'
                        ? 'bg-primary/15 text-primary'
                        : 'bg-transparent text-white/60 hover:text-white'
                    )}
                  >
                    Eski → Yeni
                  </button>
                </div>
              </div>
            </div>
            {filteredRunLogs.length === 0 ? (
              <p className="mt-4 text-sm text-white/55">
                {logLevelFilter === 'all'
                  ? 'Henüz run logu bulunmuyor. Run tetiklediğinde çıktılar burada görünecek.'
                  : 'Bu filtre için log bulunamadı. Başka bir seviye seçmeyi deneyin.'}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {filteredRunLogs.map((log, index) => {
                  const motion = getListStaggerProps(index);
                  return (
                    <li key={log.id}>
                      <m.div
                        {...motion}
                        {...subtleListHoverMotionProps}
                        className="rounded-xl border border-white/12 bg-white/[0.03] p-3 text-white/70 shadow-[0_0_30px_rgba(255,107,44,0.12)] transition hover:border-primary/40 hover:bg-primary/10"
                      >
                        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.3em] text-white/45">
                          <span>{new Date(log.timestamp).toLocaleTimeString('tr-TR')}</span>
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em]',
                              log.level === 'error'
                                ? 'border-red-400 text-red-300'
                                : log.level === 'warn'
                                  ? 'border-amber-300 text-amber-200'
                                  : 'border-emerald-300 text-emerald-200'
                            )}
                          >
                            {log.level}
                          </span>
                        </div>
                        <pre className="mt-2 whitespace-pre-wrap text-xs text-white/85">
                          {log.message}
                        </pre>
                      </m.div>
                    </li>
                  );
                })}
              </ul>
            )}
          </m.section>
        </div>

        <aside className="flex flex-col gap-6">
          <m.section
            {...panelMotionProps}
            className={cn(
              panelBaseClass,
              panelHoverClass,
              'border-white/15 p-5 text-xs text-white/70'
            )}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle,rgba(255,107,44,0.16),transparent_72%)] blur-2xl"
              aria-hidden
            />
            <div className="flex items-center justify-between text-[0.75rem] uppercase tracking-[0.35em] text-primary/75">
              <h2 className="text-base font-semibold text-white">Ajan görev listesi</h2>
              <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[0.6rem] tracking-[0.3em] text-white/50">
                {agentTodos.length}
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-xs text-white/70">
              {agentTodos.length === 0 ? (
                <li className="rounded-xl border border-white/12 bg-white/[0.03] p-4 text-white/55">
                  {activeProject
                    ? 'Ajan görevi bulunamadı.'
                    : 'Bu workspace için ajan görevi bulunamadı.'}
                </li>
              ) : (
                agentTodos.map((thread, index) => {
                  const motion = getListStaggerProps(index);
                  return (
                    <li key={thread.id}>
                      <m.div
                        {...motion}
                        {...cardHoverMotionProps}
                        className="rounded-xl border border-white/12 bg-white/[0.04] p-4 text-white/70 shadow-[0_0_30px_rgba(255,107,44,0.1)] transition hover:border-primary/40 hover:bg-primary/10"
                      >
                        <div className="flex items-center justify-between font-semibold text-white">
                          <span className="uppercase tracking-[0.32em] text-primary/80">
                            {thread.role}
                          </span>
                          <span className="text-white/50">
                            {new Date(thread.updatedAt).toLocaleTimeString('tr-TR')}
                          </span>
                        </div>
                        <p className="mt-2 text-[0.8rem] text-white/70">{thread.lastMessage}</p>
                      </m.div>
                    </li>
                  );
                })
              )}
            </ul>
          </m.section>

          <m.section
            {...panelMotionProps}
            className={cn(
              panelBaseClass,
              panelHoverClass,
              'border-white/15 p-5 text-xs text-white/70'
            )}
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/75">
              Studio quick stats
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-white/60">Aktif dosya</dt>
                <dd className="font-medium text-white">{activeFile ? activeFile.path : '—'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-white/60">Terminal log sayısı</dt>
                <dd className="font-medium text-white">{runLogs.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-white/60">Kaydedilmemiş değişiklik</dt>
                <dd
                  className={cn(
                    'font-semibold uppercase tracking-[0.2em]',
                    isActiveFileDirty ? 'text-amber-300' : 'text-emerald-300'
                  )}
                >
                  {isActiveFileDirty ? 'Var' : 'Yok'}
                </dd>
              </div>
            </dl>
          </m.section>

          <m.section
            {...panelMotionProps}
            className={cn(
              panelBaseClass,
              panelHoverClass,
              'border-white/15 p-5 text-xs text-white/70'
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/75">
                AI önerileri
              </h2>
              <m.button
                {...secondaryActionMotionProps}
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
                className={cn(
                  ghostActionClass,
                  'border-white/20 px-3 py-1 text-[0.65rem] tracking-[0.3em] text-white/60'
                )}
                disabled={suggestionQueue.length === 0}
              >
                Kuyruğu temizle
              </m.button>
            </div>
            <div className="mt-4 space-y-3">
              {aiSuggestions.map((suggestion, index) => {
                const state = suggestionState[suggestion.id] ?? { status: 'idle', note: 'Hazır' };
                const motion = getListStaggerProps(index);
                return (
                  <m.div
                    key={suggestion.id}
                    {...motion}
                    {...cardHoverMotionProps}
                    className={cn(
                      'rounded-xl border border-white/12 bg-white/[0.03] p-4 text-xs text-white/75 transition-all duration-300',
                      suggestionStatusTone[state.status],
                      suggestionImpactTone[suggestion.impact]
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white">{suggestion.title}</h3>
                        <p className="text-xs text-white/70">{suggestion.description}</p>
                      </div>
                      <div className="text-right text-white/60">
                        <div className="rounded-full border border-white/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em]">
                          {suggestion.impact}
                        </div>
                        <div className="mt-2 rounded-full border border-white/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em]">
                          {suggestionStatusLabel[state.status]}
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-white/70">
                      <span>{state.note}</span>
                      <span className="text-white/45">{state.lastUpdated ?? '—'}</span>
                    </div>
                    {typeof state.progress === 'number' ? (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[0.65rem] text-white/55">
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
                      <m.button
                        {...primaryActionMotionProps}
                        type="button"
                        className={cn(primaryActionClass, 'px-4 py-1 text-[0.65rem] text-black')}
                        onClick={() => applySuggestion(suggestion)}
                        disabled={['queued', 'in-progress'].includes(state.status)}
                      >
                        {state.status === 'completed' ? 'Tekrar uygula' : "Prompt'a ekle"}
                      </m.button>
                      <m.button
                        {...secondaryActionMotionProps}
                        type="button"
                        className={cn(
                          ghostActionClass,
                          'border-white/20 px-3 py-1 text-[0.65rem] text-white/70'
                        )}
                        onClick={() => revertSuggestion(suggestion)}
                        disabled={state.status === 'idle'}
                      >
                        {state.status === 'completed' ? 'Geri al' : 'İptal et'}
                      </m.button>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </m.section>

          <m.section
            {...panelMotionProps}
            className={cn(
              panelBaseClass,
              panelHoverClass,
              'border-white/15 p-5 text-xs text-white/70'
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/75">
                Test Suites
              </h2>
              <m.button
                {...secondaryActionMotionProps}
                type="button"
                onClick={refreshTestSuite}
                className={cn(secondaryActionClass, 'px-3 py-1 text-[0.65rem] tracking-[0.3em]')}
              >
                Sonuçları yenile
              </m.button>
            </div>
            <div className="mt-4 space-y-3">
              {testSuites.map((suite, index) => {
                const motion = getListStaggerProps(index);
                return (
                  <m.div
                    key={suite.id}
                    {...motion}
                    {...cardHoverMotionProps}
                    className="rounded-xl border border-white/12 bg-white/[0.03] p-4 text-xs text-white/75 shadow-[0_0_28px_rgba(255,107,44,0.12)] transition hover:border-primary/40 hover:bg-primary/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{suite.name}</h3>
                        <p className="text-[0.7rem] text-white/60">
                          Kapsama: {suite.coverage} • Süre: {suite.duration}
                        </p>
                      </div>
                      <div className="rounded-full border border-white/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-white/65">
                        {suite.status === 'running'
                          ? 'RUNNING'
                          : suite.status === 'pass'
                            ? 'PASS'
                            : 'FAILED'}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[0.65rem] text-white/55">
                      <span>Son güncelleme</span>
                      <span>{suite.updatedAt}</span>
                    </div>
                    {typeof suite.progress === 'number' ? (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/12">
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
                  </m.div>
                );
              })}
            </div>
          </m.section>
        </aside>
      </div>
    </section>
  );
}

export default StudioShell;
