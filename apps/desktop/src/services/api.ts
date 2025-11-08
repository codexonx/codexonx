import type { Project } from '../types/project';
import type { WorkspaceSummary } from '../types/workspace';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5002/api';

type ApiUser = {
  id: string;
  email: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
  workspaces?: WorkspaceSummary[];
  activeWorkspace?: WorkspaceSummary | null;
};

export type AuthProfile = {
  id: string;
  email: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary | null;
};

let workspaceHeadersProvider: (() => Record<string, string>) | null = null;

export const registerWorkspaceHeadersProvider = (provider: () => Record<string, string>) => {
  workspaceHeadersProvider = provider;
};

export const clearWorkspaceHeadersProvider = () => {
  workspaceHeadersProvider = null;
};

async function request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('codexonx_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (workspaceHeadersProvider) {
    Object.assign(headers, workspaceHeadersProvider());
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch (_error) {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

function normalizeUser(user: ApiUser): AuthProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    workspaces: user.workspaces ?? [],
    activeWorkspace: user.activeWorkspace ?? null,
  };
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await request<{
        token: string;
        data: { user: ApiUser };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      return {
        token: response.token,
        user: normalizeUser(response.data.user),
      };
    },
    me: async () => {
      const response = await request<{
        data: { user: ApiUser };
      }>('/auth/me');

      return normalizeUser(response.data.user);
    },
  },
  projects: {
    list: (init?: RequestInit) =>
      request<{
        status: string;
        results: number;
        data: {
          projects: Project[];
        };
      }>('/projects', init),
    getById: (projectId: string, init?: RequestInit) =>
      request<{
        status: string;
        data: {
          project: Project;
        };
      }>(`/projects/${projectId}`, init),
    regenerateApiKey: (projectId: string) =>
      request<{
        status: string;
        data: {
          project: Project;
        };
      }>(`/projects/${projectId}/regenerate-api-key`, {
        method: 'POST',
      }),
  },
};
