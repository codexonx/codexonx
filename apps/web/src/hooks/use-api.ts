import { useState, useCallback } from 'react';
import { api } from '@/services/api';

/**
 * API istekleri için custom hook
 */
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Herhangi bir API isteği için genel wrapper fonksiyon
   */
  const callApi = useCallback(
    async <T>(
      apiFunction: () => Promise<T>,
      successCallback?: (data: T) => void,
      errorCallback?: (error: string) => void
    ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiFunction();

        if (successCallback) {
          successCallback(data);
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
        setError(errorMessage);

        if (errorCallback) {
          errorCallback(errorMessage);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Sık kullanılan API istekleri için hazır fonksiyonlar

  // Auth fonksiyonları
  const login = useCallback(
    (
      email: string,
      password: string,
      onSuccess?: (data: { token: string; user: any }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.auth.login(email, password), onSuccess, onError);
    },
    [callApi]
  );

  const register = useCallback(
    (
      userData: { email: string; password: string; name: string },
      onSuccess?: (data: { token: string; user: any }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.auth.register(userData), onSuccess, onError);
    },
    [callApi]
  );

  const getCurrentUser = useCallback(
    (onSuccess?: (data: { user: any }) => void, onError?: (error: string) => void) => {
      return callApi(() => api.auth.me(), onSuccess, onError);
    },
    [callApi]
  );

  // Projeler
  const getProjects = useCallback(
    (onSuccess?: (data: { data: any[] }) => void, onError?: (error: string) => void) => {
      return callApi(() => api.projects.getAll(), onSuccess, onError);
    },
    [callApi]
  );

  const getProject = useCallback(
    (id: string, onSuccess?: (data: { data: any }) => void, onError?: (error: string) => void) => {
      return callApi(() => api.projects.getById(id), onSuccess, onError);
    },
    [callApi]
  );

  const createProject = useCallback(
    (
      projectData: any,
      onSuccess?: (data: { data: any }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.projects.create(projectData), onSuccess, onError);
    },
    [callApi]
  );

  const updateProject = useCallback(
    (
      id: string,
      projectData: any,
      onSuccess?: (data: { data: any }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.projects.update(id, projectData), onSuccess, onError);
    },
    [callApi]
  );

  const deleteProject = useCallback(
    (
      id: string,
      onSuccess?: (data: { success: boolean }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.projects.delete(id), onSuccess, onError);
    },
    [callApi]
  );

  // Abonelikler
  const getActiveSubscription = useCallback(
    (
      onSuccess?: (data: { hasActiveSubscription: boolean; data: any | null }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.subscriptions.getActive(), onSuccess, onError);
    },
    [callApi]
  );

  const cancelSubscription = useCallback(
    (id: string, onSuccess?: (data: { data: any }) => void, onError?: (error: string) => void) => {
      return callApi(() => api.subscriptions.cancel(id), onSuccess, onError);
    },
    [callApi]
  );

  // Ödemeler
  const getPrices = useCallback(
    (onSuccess?: (data: { data: any[] }) => void, onError?: (error: string) => void) => {
      return callApi(() => api.payments.getPrices(), onSuccess, onError);
    },
    [callApi]
  );

  const createPaymentIntent = useCallback(
    (
      paymentData: {
        amount: number;
        currency: string;
        description?: string;
        paymentMethod: string;
        customerId?: string;
      },
      onSuccess?: (data: { clientSecret: string; paymentIntentId: string }) => void,
      onError?: (error: string) => void
    ) => {
      return callApi(() => api.payments.createPaymentIntent(paymentData), onSuccess, onError);
    },
    [callApi]
  );

  return {
    isLoading,
    error,
    callApi,
    // Auth
    login,
    register,
    getCurrentUser,
    // Projects
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    // Subscriptions
    getActiveSubscription,
    cancelSubscription,
    // Payments
    getPrices,
    createPaymentIntent,
  };
}
