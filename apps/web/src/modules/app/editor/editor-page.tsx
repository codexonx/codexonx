'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

import { useWorkspace } from '@/contexts/workspace-context';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import {
  mockProjects,
  mockRunLogs,
  mockAgentThreads,
  mockProjectFiles,
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

const depthClassMap = ['pl-0', 'pl-3', 'pl-6', 'pl-9', 'pl-12'];
const logLevelOptions = [
  { value: 'all', label: 'Hepsi' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warn' },
  { value: 'error', label: 'Error' },
] as const;

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

export function EditorPage() {
  const { activeWorkspace } = useWorkspace();

  const activeProject = useMemo(() => {
    if (!activeWorkspace) {
      return null;
    }
    return mockProjects.find(project => project.workspaceId === activeWorkspace.id) ?? null;
  }, [activeWorkspace]);

  const baseRunLogs = useMemo(() => {
    if (!activeProject) {
      return [];
    }
    return mockRunLogs.filter(log => log.projectId === activeProject.id).slice(0, 5);
  }, [activeProject]);

  const baseAgentTodos = useMemo(() => {
    if (!activeWorkspace) {
      return [];
    }
    return mockAgentThreads.filter(thread => thread.workspaceId === activeWorkspace.id);
  }, [activeWorkspace]);

  const [runLogs, setRunLogs] = useState<MockRunLog[]>(baseRunLogs);
  const [agentTodos, setAgentTodos] = useState<MockAgentThread[]>(baseAgentTodos);
  const [codeValue, setCodeValue] = useState<string>('');
  const [language, setLanguage] = useState<'typescript' | 'javascript' | 'python' | 'markdown'>(
    'typescript'
  );
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedLogSearch(logSearchTerm.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(timeout);
  }, [logSearchTerm]);

  useEffect(() => {
    setRunLogs(baseRunLogs);
  }, [baseRunLogs]);

  useEffect(() => {
    setAgentTodos(baseAgentTodos);
  }, [baseAgentTodos]);

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

  const handleSelectFile = useCallback((fileId: string) => {
    setSelectedFileId(fileId);
  }, []);

  useEffect(() => {
    setDrafts({});

    if (!activeProject) {
      setSelectedFileId(null);
      setCodeValue('');
      return;
    }

    if (projectFiles.length === 0) {
      const fallbackLanguageMap: Record<typeof activeProject.template, typeof language> = {
        nextjs: 'typescript',
        fastapi: 'python',
        express: 'javascript',
      };

      setSelectedFileId(null);
      setLanguage(fallbackLanguageMap[activeProject.template]);
      setCodeValue('// TODO: Bu proje için başlangıç dosyası ekleyin.');
      return;
    }

    const entry = projectFiles.find(file => file.isEntry) ?? projectFiles[0];
    setSelectedFileId(entry.id);
    setLanguage(entry.language);
    setCodeValue(entry.content);
  }, [activeProject, projectFiles]);

  useEffect(() => {
    if (!activeFile) {
      return;
    }

    const draft = drafts[activeFile.id];
    setLanguage(activeFile.language);
    setCodeValue(draft ?? activeFile.content);
  }, [activeFile, drafts]);

  const renderFileTree = (nodes: FileTreeNode[], depth = 0): JSX.Element[] =>
    nodes.map(node => {
      const indentClass = getIndentClass(depth);

      if (node.type === 'directory') {
        return (
          <li key={node.id}>
            <div
              className={cn(
                'flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-muted-foreground/60',
                indentClass
              )}
            >
              <span className="text-muted-foreground/40">▸</span>
              <span>{node.name}</span>
            </div>
            {node.children && node.children.length > 0 ? (
              <ul className="mt-1 space-y-1">{renderFileTree(node.children, depth + 1)}</ul>
            ) : null}
          </li>
        );
      }

      const isSelected = selectedFileId === node.id;
      const isDirty = dirtyFileIds.has(node.id);

      return (
        <li key={node.id}>
          <button
            type="button"
            onClick={() => handleSelectFile(node.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-md border border-transparent px-3 py-2 text-left text-xs transition',
              indentClass,
              isSelected
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <span className="truncate">{node.name}</span>
            {isDirty ? <span className="text-[0.65rem] text-amber-400">●</span> : null}
          </button>
        </li>
      );
    });

  const handleRunCode = useCallback(async () => {
    if (!activeProject) {
      return;
    }

    if (!activeFile) {
      const warnLog: MockRunLog = {
        id: `stub-log-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        level: 'warn',
        message: 'Çalıştırma için dosya seçmelisiniz.',
      };
      setRunLogs(prev => [warnLog, ...prev].slice(0, 10));
      pushToast('run:no-file', {
        title: 'Dosya seçilmedi',
        description: 'Run tetiklemek için listeden bir dosya seçmelisin.',
        variant: 'destructive',
      });
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

      const data = (await response.json()) as {
        message?: string;
        executedAt?: string;
        level?: MockRunLog['level'];
        logId?: string;
      };

      const newLog: MockRunLog = {
        id: data.logId ?? `stub-run-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: data.executedAt ?? new Date().toISOString(),
        level: data.level ?? 'info',
        message:
          data.message ??
          `${activeFile.path} çalıştırıldı (${codeValue.split('\n').length} satır kod gönderildi).`,
      };

      setRunLogs(prev => [newLog, ...prev].slice(0, 10));
      pushToast('run:success', {
        title: 'Run tetiklendi',
        description: `${activeFile.path} için mock çalışma tamamlandı.`,
      });
    } catch (error) {
      const runError = error instanceof Error ? error.message : 'Bilinmeyen run hatası';
      const errorLog: MockRunLog = {
        id: `run-error-${Date.now()}`,
        projectId: activeProject.id,
        timestamp: new Date().toISOString(),
        level: 'error',
        message: `Run başarısız: ${runError}`,
      };
      setRunLogs(prev => [errorLog, ...prev].slice(0, 10));
      pushToast('run:error', {
        title: 'Run başarısız',
        description: runError,
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  }, [activeProject, activeFile, codeValue, pushToast]);

  const handleSimulateAgentTask = useCallback(() => {
    if (!activeWorkspace) {
      return;
    }

    const newTask: MockAgentThread = {
      id: `stub-thread-${Date.now()}`,
      projectId: activeProject?.id ?? 'unknown',
      role: 'reviewer',
      lastMessage: 'Stub: Kod inceleme isteği kuyruklandı. Loglar güncellendi.',
      updatedAt: new Date().toISOString(),
      workspaceId: activeWorkspace.id,
    };

    setAgentTodos(prev => [newTask, ...prev]);
  }, [activeWorkspace, activeProject]);

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

    const fallbackLanguageMap: Record<typeof activeProject.template, typeof language> = {
      nextjs: 'typescript',
      fastapi: 'python',
      express: 'javascript',
    };

    setLanguage(fallbackLanguageMap[activeProject.template]);
    setCodeValue('// TODO: Bu proje için başlangıç dosyası ekleyin.');
  }, [activeFile, activeProject]);

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

      setRunLogs(prev => [saveLog, ...prev].slice(0, 10));
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
      setRunLogs(prev => [errorLog, ...prev].slice(0, 10));
      pushToast('save:error', {
        title: 'Kaydetme başarısız',
        description: saveError,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [activeProject, activeFile, codeValue, pushToast]);

  if (!activeWorkspace) {
    return (
      <section className="space-y-6">
        <p className="text-sm text-muted-foreground">Workspace verisi yükleniyor...</p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <header className="rounded-xl border border-white/10 bg-background/70 p-4">
          <h1 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">
            Live Editor (Stub)
          </h1>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {activeProject ? activeProject.name : 'Bu workspace için aktif proje yok'}
          </p>
          <p className="text-sm text-muted-foreground">
            Bu bölüm canlı kod editörünün yerini alacak. Monaco + terminal entegrasyonu planlandı.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
              onClick={handleRunCode}
              disabled={!activeProject || !activeFile || isRunning}
            >
              {isRunning ? 'Çalıştırılıyor...' : 'Run tetikle'}
            </button>
            <button
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
              onClick={handleSimulateAgentTask}
            >
              Stub ajan görevi oluştur
            </button>
            <button
              className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-50"
              onClick={handleSaveFile}
              disabled={!activeFile || !isActiveFileDirty || isSaving}
            >
              {isSaving ? 'Kaydediliyor...' : 'Dosyayı kaydet'}
            </button>
            <button
              className="rounded-full border border-white/10 bg-white/0 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
              onClick={handleResetCode}
              disabled={!activeProject}
            >
              Kod şablonunu sıfırla
            </button>
          </div>
          {activeProject ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                Şablon: {activeProject.template}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                Son aktivite: {new Date(activeProject.lastActivity).toLocaleString('tr-TR')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 capitalize">
                Durum: {activeProject.status}
              </span>
            </div>
          ) : null}
        </header>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-2xl border border-white/10 bg-background/60 p-4 text-xs text-muted-foreground">
            <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-primary/70">
              <span>Dosyalar</span>
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
          </div>
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
      <aside className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-background/70 p-4 text-sm text-muted-foreground">
          <h2 className="text-base font-semibold text-foreground">AI ajan task listesi</h2>
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
      </aside>
    </section>
  );
}

export default EditorPage;
