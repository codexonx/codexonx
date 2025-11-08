'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type WorkspaceSummary = {
  id: string;
  slug: string;
  name: string;
  plan: string;
};

interface WorkspaceContextValue {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
  activeWorkspace: WorkspaceSummary | null;
  setActiveWorkspace: (workspaceId: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const DEFAULT_WORKSPACES: WorkspaceSummary[] = [
  { id: 'ws_dev_001', slug: 'dev-team', name: 'Geliştirme Ekibi', plan: 'Pro' },
  { id: 'ws_ops_002', slug: 'ops', name: 'Operasyonlar', plan: 'Starter' },
  { id: 'ws_ai_003', slug: 'ai-research', name: 'AI Araştırma', plan: 'Enterprise' },
];

const WORKSPACE_ID_KEY = 'active_workspace_id';
const WORKSPACE_SLUG_KEY = 'active_workspace_slug';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = useState<WorkspaceSummary[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedId = localStorage.getItem(WORKSPACE_ID_KEY);
    const storedSlug = localStorage.getItem(WORKSPACE_SLUG_KEY);

    if (storedId) {
      setActiveWorkspaceId(storedId);
      setIsInitialized(true);
      return;
    }

    if (storedSlug) {
      const matched = workspaces.find(workspace => workspace.slug === storedSlug);
      if (matched) {
        setActiveWorkspaceId(matched.id);
        setIsInitialized(true);
        return;
      }
    }

    if (workspaces.length > 0) {
      const fallback = workspaces[0];
      setActiveWorkspaceId(fallback.id);
      localStorage.setItem(WORKSPACE_ID_KEY, fallback.id);
      localStorage.setItem(WORKSPACE_SLUG_KEY, fallback.slug);
    }

    setIsInitialized(true);
  }, [workspaces]);

  useEffect(() => {
    if (typeof window === 'undefined' || !activeWorkspaceId) {
      return;
    }

    const workspace = workspaces.find(item => item.id === activeWorkspaceId);
    if (!workspace) {
      return;
    }

    localStorage.setItem(WORKSPACE_ID_KEY, workspace.id);
    localStorage.setItem(WORKSPACE_SLUG_KEY, workspace.slug);
  }, [activeWorkspaceId, workspaces]);

  const setActiveWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
  };

  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceId) {
      return null;
    }
    return workspaces.find(workspace => workspace.id === activeWorkspaceId) ?? null;
  }, [activeWorkspaceId, workspaces]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      activeWorkspaceId,
      activeWorkspace,
      setActiveWorkspace,
      isLoading: !isInitialized,
    }),
    [workspaces, activeWorkspaceId, activeWorkspace, isInitialized]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}
