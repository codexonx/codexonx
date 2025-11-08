import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { TOKEN_STORAGE_KEY, WORKSPACE_STORAGE_KEY } from '../constants/storage';
import { api, type AuthProfile } from '../services/api';
import type { WorkspaceSummary } from '../types/workspace';

type AuthContextValue = {
  user: AuthProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  clearError: () => void;
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary | null;
  selectWorkspace: (workspaceId: string) => void;
  getWorkspaceHeaders: () => Record<string, string>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceSummary | null>(null);

  const resolveActiveWorkspace = useCallback((profile: AuthProfile): WorkspaceSummary | null => {
    const storedWorkspaceId = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (storedWorkspaceId) {
      const storedWorkspace = profile.workspaces.find(item => item.id === storedWorkspaceId);
      if (storedWorkspace) {
        return storedWorkspace;
      }
    }

    return profile.activeWorkspace ?? profile.workspaces[0] ?? null;
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setIsLoading(false);
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      return;
    }

    setToken(storedToken);
    setIsLoading(true);

    api.auth
      .me()
      .then(currentUser => {
        setUser(currentUser);
        const workspace = resolveActiveWorkspace(currentUser);
        setActiveWorkspace(workspace);
        if (workspace) {
          localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
        } else {
          localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        }
      })
      .catch(err => {
        console.error('Auth refresh failed', err);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setActiveWorkspace(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [resolveActiveWorkspace]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { token: nextToken, user: nextUser } = await api.auth.login(email, password);
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
        setToken(nextToken);
        setUser(nextUser);
        const workspace = resolveActiveWorkspace(nextUser);
        setActiveWorkspace(workspace);
        if (workspace) {
          localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
        } else {
          localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Giriş sırasında beklenmeyen bir hata oluştu';
        setError(message);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setActiveWorkspace(null);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resolveActiveWorkspace]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(WORKSPACE_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setActiveWorkspace(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const refreshedUser = await api.auth.me();
      setUser(refreshedUser);
      const workspace = resolveActiveWorkspace(refreshedUser);
      setActiveWorkspace(workspace);
      if (workspace) {
        localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
      } else {
        localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Token refresh failed', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout, resolveActiveWorkspace, token]);

  const clearError = useCallback(() => setError(null), []);

  const selectWorkspace = (workspaceId: string) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser;
      const workspace = prevUser.workspaces.find(item => item.id === workspaceId) ?? null;
      setActiveWorkspace(workspace);
      if (workspace) {
        localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
      } else {
        localStorage.removeItem(WORKSPACE_STORAGE_KEY);
      }
      return {
        ...prevUser,
        activeWorkspace: workspace,
      };
    });
  };

  const getWorkspaceHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (activeWorkspace) {
      headers['x-workspace-id'] = activeWorkspace.id;
    }

    return headers;
  }, [activeWorkspace]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      error,
      login,
      logout,
      refresh,
      clearError,
      workspaces: user ? user.workspaces : [],
      activeWorkspace,
      selectWorkspace,
      getWorkspaceHeaders,
    }),
    [
      activeWorkspace,
      clearError,
      error,
      getWorkspaceHeaders,
      isLoading,
      login,
      logout,
      refresh,
      token,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
