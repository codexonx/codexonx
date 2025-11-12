'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

import type { WorkspaceSummary } from '@/types/workspace';
import { DEFAULT_WORKSPACES } from '@/data/workspaces';

interface WorkspaceContextValue {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
  activeWorkspace: WorkspaceSummary | null;
  setActiveWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const WORKSPACE_ID_KEY = 'active_workspace_id';
const WORKSPACE_SLUG_KEY = 'active_workspace_slug';

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const applyActiveWorkspace = useCallback(
    (nextWorkspaces: WorkspaceSummary[]) => {
      if (nextWorkspaces.length === 0) {
        setActiveWorkspaceId(null);
        return;
      }

      if (activeWorkspaceId) {
        const stillExists = nextWorkspaces.some(item => item.id === activeWorkspaceId);
        if (stillExists) {
          return;
        }
      }

      const storedId =
        typeof window !== 'undefined' ? localStorage.getItem(WORKSPACE_ID_KEY) : null;
      if (storedId) {
        const match = nextWorkspaces.find(item => item.id === storedId);
        if (match) {
          setActiveWorkspaceId(match.id);
          return;
        }
      }

      const storedSlug =
        typeof window !== 'undefined' ? localStorage.getItem(WORKSPACE_SLUG_KEY) : null;
      if (storedSlug) {
        const match = nextWorkspaces.find(item => item.slug === storedSlug);
        if (match) {
          setActiveWorkspaceId(match.id);
          return;
        }
      }

      const fallback = nextWorkspaces[0];
      setActiveWorkspaceId(fallback.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(WORKSPACE_ID_KEY, fallback.id);
        localStorage.setItem(WORKSPACE_SLUG_KEY, fallback.slug);
      }
    },
    [activeWorkspaceId]
  );

  const refreshWorkspaces = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch('/api/workspaces');
      if (!response.ok) {
        throw new Error(`Failed to fetch workspaces: ${response.status}`);
      }

      const data = (await response.json()) as WorkspaceSummary[] | undefined;

      if (Array.isArray(data) && data.length > 0) {
        setWorkspaces(data);
        applyActiveWorkspace(data);
        return;
      }

      console.warn('[WorkspaceProvider] API boş sonuç döndürdü, varsayılan mock kullanılacak.');
      setWorkspaces(DEFAULT_WORKSPACES);
      applyActiveWorkspace(DEFAULT_WORKSPACES);
    } catch (error) {
      console.warn(
        '[WorkspaceProvider] Workspace fetch başarısız, mock veriler kullanılacak.',
        error
      );
      setWorkspaces(DEFAULT_WORKSPACES);
      applyActiveWorkspace(DEFAULT_WORKSPACES);
    } finally {
      setIsFetching(false);
      setIsInitialized(true);
    }
  }, [applyActiveWorkspace]);

  useEffect(() => {
    refreshWorkspaces().catch(error => {
      console.error('[WorkspaceProvider] refreshWorkspaces çağrısında hata oluştu', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      refreshWorkspaces,
      isLoading: !isInitialized || isFetching,
    }),
    [workspaces, activeWorkspaceId, activeWorkspace, isInitialized, isFetching, refreshWorkspaces]
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
