/**
 * API İstemcisi
 *
 * Bu modül, backend API'si ile iletişim için temel HTTP istemcisini sağlar.
 * Axios tabanlı bir HTTP istemcisi kullanarak API çağrıları yapar.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API temel URL'si
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Varsayılan istemci yapılandırması
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * API istemcisi oluşturucu
 * @param config Ek yapılandırma ayarları
 * @returns API istemci örneği
 */
export const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const apiClient = axios.create({
    ...defaultConfig,
    ...config,
  });

  // İstek araya girici (interceptor)
  apiClient.interceptors.request.use(
    config => {
      // Tarayıcı tarafında token varsa ekle
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Yanıt araya girici (interceptor)
  apiClient.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      if (error.response) {
        // Sunucu yanıtı var, ama hata kodu
        const { status, data } = error.response;

        // 401 Yetkisiz - oturum süresi doldu
        if (status === 401) {
          // Kimlik doğrulama token'ını temizle
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            // Oturum süresinin dolduğunu bildirmek veya giriş sayfasına yönlendirmek için olay yayınla
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
          }
        }

        return Promise.reject(data);
      }

      // Ağ hatası, zaman aşımı vb.
      return Promise.reject({
        message: 'Sunucuya bağlanırken bir hata oluştu.',
        error: error.message,
      });
    }
  );

  return apiClient;
};

// Varsayılan API istemcisi
export const apiClient = createApiClient();

/**
 * Kimlik doğrulama başlığı ile yeni bir API istemcisi oluşturur
 * @param token Kimlik doğrulama token'ı
 * @returns API istemci örneği
 */
export const createAuthenticatedApiClient = (token: string): AxiosInstance => {
  return createApiClient({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Kimlik doğrulama API servisi
 */
export const authService = {
  /**
   * Kullanıcı girişi
   * @param credentials Kullanıcı kimlik bilgileri
   * @returns API yanıtı
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.post<{ token?: string }>('/auth/login', credentials);
      const token = response.data?.token;

      // Token'ı kaydet
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('token', token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kullanıcı kaydı
   * @param userData Yeni kullanıcı verileri
   * @returns API yanıtı
   */
  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kullanıcı çıkışı
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Token'ı temizle
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  },

  /**
   * Şifre sıfırlama e-postası gönder
   * @param email Kullanıcı e-posta adresi
   * @returns API yanıtı
   */
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mevcut oturumu kontrol et
   * @returns Geçerli oturum varsa kullanıcı bilgileri
   */
  checkSession: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      // Oturum geçersizse token'ı temizle
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },
};

/**
 * Kullanıcı API servisi
 */
export const userService = {
  /**
   * Kullanıcı profil bilgilerini getir
   * @returns API yanıtı
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kullanıcı profilini güncelle
   * @param profileData Güncellenecek profil verileri
   * @returns API yanıtı
   */
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kullanıcı şifresini değiştir
   * @param passwordData Şifre değiştirme verileri
   * @returns API yanıtı
   */
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await apiClient.put('/users/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Projeler API servisi
 */
export const projectService = {
  /**
   * Tüm projeleri getir
   * @returns API yanıtı
   */
  getProjects: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Proje detaylarını getir
   * @param projectId Proje kimliği
   * @returns API yanıtı
   */
  getProject: async (projectId: string) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Yeni proje oluştur
   * @param projectData Yeni proje verileri
   * @returns API yanıtı
   */
  createProject: async (projectData: any) => {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Projeyi güncelle
   * @param projectId Proje kimliği
   * @param projectData Güncellenecek proje verileri
   * @returns API yanıtı
   */
  updateProject: async (projectId: string, projectData: any) => {
    try {
      const response = await apiClient.put(`/projects/${projectId}`, projectData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Projeyi sil
   * @param projectId Proje kimliği
   * @returns API yanıtı
   */
  deleteProject: async (projectId: string) => {
    try {
      const response = await apiClient.delete(`/projects/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * AI API servisi
 */
export const aiService = {
  /**
   * AI sohbet mesajı gönder
   * @param message Kullanıcı mesajı
   * @param context İsteğe bağlı bağlam bilgisi
   * @returns API yanıtı
   */
  sendMessage: async (message: string, context: any = {}) => {
    try {
      const response = await apiClient.post('/ai/chat', { message, context });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kod tamamlama isteği gönder
   * @param code Mevcut kod
   * @param language Programlama dili
   * @param options Ek seçenekler
   * @returns API yanıtı
   */
  completeCode: async (code: string, language: string, options: any = {}) => {
    try {
      const response = await apiClient.post('/ai/code/complete', {
        code,
        language,
        ...options,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kodu açıkla
   * @param code Açıklanacak kod
   * @param language Programlama dili
   * @returns API yanıtı
   */
  explainCode: async (code: string, language: string) => {
    try {
      const response = await apiClient.post('/ai/code/explain', { code, language });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kod önerisi al
   * @param prompt İstek açıklaması
   * @param language Programlama dili
   * @param options Ek seçenekler
   * @returns API yanıtı
   */
  generateCode: async (prompt: string, language: string, options: any = {}) => {
    try {
      const response = await apiClient.post('/ai/code/generate', {
        prompt,
        language,
        ...options,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
