import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Project } from '../types/project';

import { useProjectStore } from './project-store';

type AppViewMode = 'dashboard' | 'project';

type AppContextValue = {
  selectedProjectId: string | null;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  openProject: (project: Project) => void;
  backToDashboard: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { upsertProject, getProjectById } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<AppViewMode>('dashboard');

  const selectedProject = useMemo(
    () => (selectedProjectId ? getProjectById(selectedProjectId) : null),
    [getProjectById, selectedProjectId]
  );

  const setSelectedProject = useCallback(
    (project: Project | null) => {
      if (!project) {
        setSelectedProjectId(null);
        return;
      }

      upsertProject(project);
      setSelectedProjectId(project.id);
    },
    [upsertProject]
  );

  const openProject = useCallback(
    (project: Project) => {
      upsertProject(project);
      setSelectedProjectId(project.id);
      setViewMode('project');
    },
    [setViewMode, upsertProject]
  );

  const backToDashboard = useCallback(() => {
    setViewMode('dashboard');
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      selectedProjectId,
      selectedProject,
      setSelectedProject,
      viewMode,
      setViewMode,
      openProject,
      backToDashboard,
    }),
    [
      backToDashboard,
      openProject,
      selectedProject,
      selectedProjectId,
      setSelectedProject,
      setViewMode,
      viewMode,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
