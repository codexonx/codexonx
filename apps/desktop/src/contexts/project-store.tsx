import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Project } from '../types/project';

type ProjectStoreValue = {
  projects: Project[];
  projectMap: Record<string, Project>;
  upsertProject: (project: Project) => void;
  upsertProjects: (projects: Project[]) => void;
  removeProject: (projectId: string) => void;
  clear: () => void;
  getProjectById: (projectId: string) => Project | null;
  syncWorkspaceProjects: (workspaceId: string, projects: Project[]) => void;
};

const ProjectStoreContext = createContext<ProjectStoreValue | undefined>(undefined);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [projectMap, setProjectMap] = useState<Record<string, Project>>({});

  const upsertProject = useCallback((project: Project) => {
    setProjectMap(prev => ({
      ...prev,
      [project.id]: project,
    }));
  }, []);

  const upsertProjects = useCallback((projects: Project[]) => {
    if (projects.length === 0) {
      return;
    }

    setProjectMap(prev => {
      const next: Record<string, Project> = { ...prev };
      let didChange = false;

      for (const project of projects) {
        const current = next[project.id];
        if (!current || current !== project) {
          next[project.id] = project;
          didChange = true;
        }
      }

      return didChange ? next : prev;
    });
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setProjectMap(prev => {
      if (!prev[projectId]) {
        return prev;
      }

      const { [projectId]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clear = useCallback(() => {
    setProjectMap({});
  }, []);

  const getProjectById = useCallback(
    (projectId: string) => projectMap[projectId] ?? null,
    [projectMap]
  );

  const syncWorkspaceProjects = useCallback((workspaceId: string, projects: Project[]) => {
    setProjectMap(prev => {
      const next: Record<string, Project> = { ...prev };
      const incomingIds = new Set(projects.map(project => project.id));
      let changed = false;

      for (const [id, project] of Object.entries(prev)) {
        if (project.workspaceId === workspaceId && !incomingIds.has(id)) {
          delete next[id];
          changed = true;
        }
      }

      for (const project of projects) {
        const current = next[project.id];
        if (!current || current !== project) {
          next[project.id] = project;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, []);

  const value = useMemo<ProjectStoreValue>(
    () => ({
      projects: Object.values(projectMap),
      projectMap,
      upsertProject,
      upsertProjects,
      removeProject,
      clear,
      getProjectById,
      syncWorkspaceProjects,
    }),
    [
      clear,
      getProjectById,
      projectMap,
      removeProject,
      syncWorkspaceProjects,
      upsertProject,
      upsertProjects,
    ]
  );

  return <ProjectStoreContext.Provider value={value}>{children}</ProjectStoreContext.Provider>;
}

export function useProjectStore(): ProjectStoreValue {
  const context = useContext(ProjectStoreContext);

  if (!context) {
    throw new Error('useProjectStore must be used within a ProjectStoreProvider');
  }

  return context;
}

export function useProjectById(projectId: string | null | undefined): Project | null {
  const { getProjectById } = useProjectStore();

  if (!projectId) {
    return null;
  }

  return getProjectById(projectId);
}
