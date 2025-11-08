import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useProjectStore } from '../contexts/project-store';
import { api } from '../services/api';
import type { Project } from '../types/project';

type Status = 'idle' | 'loading' | 'error';
export type ProjectDetailsStatus = Status;

type UseProjectDetailsResult = {
  project: Project | null;
  status: Status;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useProjectDetails(projectId: string | null | undefined): UseProjectDetailsResult {
  const { getProjectById, upsertProject } = useProjectStore();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const requestedRef = useRef<Set<string>>(new Set());

  const project = useMemo(
    () => (projectId ? getProjectById(projectId) : null),
    [getProjectById, projectId]
  );

  const fetchDetails = useCallback(async () => {
    if (!projectId) {
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await api.projects.getById(projectId);
      upsertProject(response.data.project);
      setStatus('idle');
      requestedRef.current.delete(projectId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Proje detayları yüklenemedi';
      setError(message);
      setStatus('error');
      requestedRef.current.delete(projectId);
    }
  }, [projectId, upsertProject]);

  useEffect(() => {
    const requests = requestedRef.current;

    if (!projectId) {
      requests.clear();
      return;
    }

    const missingDetails = !project || !project.workspace;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (missingDetails && !requests.has(projectId)) {
      requests.add(projectId);

      timeoutId = setTimeout(() => {
        void fetchDetails();
      }, 0);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      requests.delete(projectId);
    };
  }, [fetchDetails, project, projectId]);

  useEffect(() => {
    const requests = requestedRef.current;

    return () => {
      requests.clear();
    };
  }, []);

  return {
    project,
    status: projectId ? status : 'idle',
    error: projectId ? error : null,
    refetch: fetchDetails,
  };
}
