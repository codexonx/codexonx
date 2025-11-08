'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/services/api';

const hasApiUrl = Boolean(process.env.NEXT_PUBLIC_API_URL);

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { email: string; password: string; name: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // İlk yüklemede kimlik doğrulama
  useEffect(() => {
    if (!hasApiUrl) {
      console.warn('NEXT_PUBLIC_API_URL tanımlı değil. Kimlik doğrulama istekleri devre dışı.');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    // Kullanıcı bilgilerini getir
    const fetchUser = async () => {
      try {
        const response = await api.auth.me();
        setUser(response.user);
      } catch (error) {
        console.error('Authentication error:', error);
        // Token geçersiz ise çıkış yap
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Korumalı sayfaları kontrol et
  useEffect(() => {
    // Kimlik doğrulama hala yükleniyor
    if (isLoading || !hasApiUrl) return;

    // Public sayfalar her zaman erişilebilir
    const publicPages = ['/', '/login', '/register', '/about', '/contact', '/plans'];
    if (publicPages.some(page => pathname?.startsWith(page))) return;

    // Auth gerektiren sayfalara erişim kontrolü
    if (!isAuthenticated && pathname?.startsWith('/admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, isLoading, router]);

  // Login işlemi
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!hasApiUrl) {
      console.warn('NEXT_PUBLIC_API_URL tanımlı değil. Login isteği gönderilmedi.');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await api.auth.login(email, password);

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout işlemi
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    router.push('/login');
  };

  // Register işlemi
  const register = async (userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<boolean> => {
    if (!hasApiUrl) {
      console.warn('NEXT_PUBLIC_API_URL tanımlı değil. Register isteği gönderilmedi.');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await api.auth.register(userData);

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }

  return context;
}
