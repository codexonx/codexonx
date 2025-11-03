/**
 * API Service
 * 
 * Backend API istekleri için merkezi service katmanı
 */

// API'nin temel URL'i
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

/**
 * Fetch ile API istekleri yapan yardımcı fonksiyon
 */
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Token varsa Authorization header'ı ekle
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // JSON olmayan yanıtlar için (örn. file download)
  if (options.headers && (options.headers as any)['Accept'] !== 'application/json') {
    return response as unknown as T;
  }

  // Yanıt kontrolü
  if (!response.ok) {
    // API error yapısını analiz etmeye çalış
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || response.statusText);
    } catch (e) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
  }

  // Boş yanıtlar için
  if (response.status === 204) {
    return {} as T;
  }

  // JSON yanıtını parse et
  return response.json() as Promise<T>;
}

// API servisleri
export const api = {
  // Sağlık kontrolü
  health: {
    check: () => fetchAPI<{status: string, timestamp: string}>('/health'),
  },

  // Auth işlemleri
  auth: {
    login: (email: string, password: string) =>
      fetchAPI<{token: string, user: any}>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (userData: {email: string, password: string, name: string}) =>
      fetchAPI<{token: string, user: any}>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => fetchAPI<{user: any}>('/auth/me'),
  },

  // Proje işlemleri
  projects: {
    getAll: () => fetchAPI<{data: any[]}>('/projects'),
    getById: (id: string) => fetchAPI<{data: any}>(`/projects/${id}`),
    create: (data: any) => 
      fetchAPI<{data: any}>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchAPI<{data: any}>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<{success: boolean}>(`/projects/${id}`, {
        method: 'DELETE',
      }),
    regenerateApiKey: (id: string) =>
      fetchAPI<{data: {apiKey: string}}>(`/projects/${id}/regenerate-api-key`, {
        method: 'POST',
      }),
  },

  // Abonelik işlemleri
  subscriptions: {
    getAll: () => fetchAPI<{data: any[]}>('/subscriptions'),
    getActive: () => fetchAPI<{hasActiveSubscription: boolean, data: any | null}>('/subscriptions/active'),
    getById: (id: string) => fetchAPI<{data: any}>(`/subscriptions/${id}`),
    create: (data: any) =>
      fetchAPI<{data: any}>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    cancel: (id: string) =>
      fetchAPI<{data: any}>(`/subscriptions/${id}`, {
        method: 'DELETE',
      }),
  },

  // Ödeme işlemleri
  payments: {
    getPrices: () => fetchAPI<{data: any[]}>('/payments/prices'),
    createCustomer: (data: {email: string, name: string}) =>
      fetchAPI<{data: any}>('/payments/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createPaymentIntent: (data: {
      amount: number,
      currency: string,
      description?: string,
      paymentMethod: string,
      customerId?: string,
    }) =>
      fetchAPI<{clientSecret: string, paymentIntentId: string}>('/payments/payment-intents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
