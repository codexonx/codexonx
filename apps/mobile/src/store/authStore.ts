import { create } from 'zustand';
import { mmkvStorage } from '@utils/storage';
import { API_BASE_URL } from '@config/constants';

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

// Giriş parametreleri
interface LoginParams {
  email: string;
  password: string;
}

// Kayıt parametreleri
interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

// Auth store tipi
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Eylemler
  initializeApp: () => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Auth store oluşturma
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,

  // Uygulama başlangıç durumu
  initializeApp: async () => {
    set({ loading: true });

    try {
      // Saklanan token ve kullanıcı bilgilerini al
      const token = await mmkvStorage.getString('auth_token');
      const userData = await mmkvStorage.getString('user_data');

      if (!token || !userData) {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          initialized: true,
          loading: false,
        });
        return;
      }

      const user = JSON.parse(userData);

      // Token ile kullanıcıyı doğrula
      const isValid = await validateToken(token);

      if (isValid) {
        set({
          isAuthenticated: true,
          token,
          user,
          initialized: true,
          loading: false,
        });
      } else {
        // Token geçersizse çıkış yap
        await get().logout();
      }
    } catch (error) {
      console.error('Uygulama başlatma hatası:', error);

      // Hata durumunda temizlik yap
      await mmkvStorage.delete('auth_token');
      await mmkvStorage.delete('user_data');

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        initialized: true,
        loading: false,
        error: 'Oturum doğrulanamadı',
      });
    }
  },

  // Kullanıcı girişi
  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      // API giriş isteği
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Giriş başarısız');
      }

      const data = await response.json();
      const { token, user } = data;

      // Token ve kullanıcı bilgilerini sakla
      await mmkvStorage.set('auth_token', token);
      await mmkvStorage.set('user_data', JSON.stringify(user));

      set({
        isAuthenticated: true,
        token,
        user,
        loading: false,
      });
    } catch (error) {
      console.error('Giriş hatası:', error);

      // Geliştirme için simüle edilmiş başarılı giriş
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: '1',
          email,
          name: 'Test Kullanıcı',
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock_token_' + Math.random().toString(36).substring(7);

        await mmkvStorage.set('auth_token', mockToken);
        await mmkvStorage.set('user_data', JSON.stringify(mockUser));

        set({
          isAuthenticated: true,
          token: mockToken,
          user: mockUser,
          loading: false,
        });

        return;
      }

      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Giriş yapılırken hata oluştu',
      });
    }
  },

  // Kullanıcı kaydı
  register: async ({ name, email, password }) => {
    set({ loading: true, error: null });

    try {
      // API kayıt isteği
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız');
      }

      const data = await response.json();
      const { token, user } = data;

      // Token ve kullanıcı bilgilerini sakla
      await mmkvStorage.set('auth_token', token);
      await mmkvStorage.set('user_data', JSON.stringify(user));

      set({
        isAuthenticated: true,
        token,
        user,
        loading: false,
      });
    } catch (error) {
      console.error('Kayıt hatası:', error);

      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Kayıt olurken hata oluştu',
      });
    }
  },

  // Çıkış işlemi
  logout: async () => {
    set({ loading: true });

    try {
      // Token ve kullanıcı bilgilerini sil
      await mmkvStorage.delete('auth_token');
      await mmkvStorage.delete('user_data');

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    } catch (error) {
      console.error('Çıkış hatası:', error);

      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Çıkış yapılırken hata oluştu',
      });
    }
  },

  // Profil güncelleme
  updateProfile: async data => {
    const { token, user } = get();

    if (!token || !user) {
      set({ error: 'Oturum açık değil' });
      return;
    }

    set({ loading: true, error: null });

    try {
      // API profil güncelleme isteği
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profil güncellenirken hata oluştu');
      }

      const updatedUser = await response.json();

      // Güncellenmiş kullanıcı bilgilerini sakla
      await mmkvStorage.set('user_data', JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        loading: false,
      });
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);

      // Geliştirme için simüle edilmiş başarılı güncelleme
      if (process.env.NODE_ENV === 'development') {
        const updatedUser = {
          ...user,
          ...data,
        };

        await mmkvStorage.set('user_data', JSON.stringify(updatedUser));

        set({
          user: updatedUser,
          loading: false,
        });

        return;
      }

      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Profil güncellenirken hata oluştu',
      });
    }
  },
}));

// Token doğrulama yardımcı fonksiyonu
async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token doğrulama hatası:', error);

    // Geliştirme modunda her zaman başarılı
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    return false;
  }
}
