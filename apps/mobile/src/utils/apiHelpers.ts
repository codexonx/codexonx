/**
 * API İsteklerinde kullanılan yardımcı fonksiyonlar
 */

// API istek hatası işleme
export const handleApiError = async (response: Response): Promise<Error> => {
  try {
    const data = await response.json();
    const message = data.message || data.error || 'Bir hata oluştu';
    return new Error(message);
  } catch (error) {
    return new Error(`${response.status}: ${response.statusText}`);
  }
};

// API isteği gönderme (genel amaçlı)
export const apiRequest = async <T>(
  url: string, 
  method: string = 'GET', 
  body?: any, 
  headers?: HeadersInit
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

// Form verisi gönderme (dosya yükleme vb.)
export const apiFormRequest = async <T>(
  url: string,
  formData: FormData,
  method: string = 'POST',
  headers?: HeadersInit
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      ...headers,
    },
    body: formData,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw await handleApiError(response);
  }

  return response.json();
};

// Zaman aşımı ile API isteği
export const apiRequestWithTimeout = async <T>(
  url: string,
  method: string = 'GET',
  body?: any,
  headers?: HeadersInit,
  timeoutMs: number = 10000
): Promise<T> => {
  // Zaman aşımı promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('İstek zaman aşımına uğradı')), timeoutMs);
  });

  // Normal istek promise
  const fetchPromise = apiRequest<T>(url, method, body, headers);

  // Hangisi önce tamamlanırsa
  return Promise.race([fetchPromise, timeoutPromise]);
};

// Yeniden deneme ile API isteği
export const apiRequestWithRetry = async <T>(
  url: string,
  method: string = 'GET',
  body?: any,
  headers?: HeadersInit,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiRequest<T>(url, method, body, headers);
    } catch (error) {
      lastError = error as Error;
      
      // Son deneme değilse bekle
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Bilinmeyen hata');
};
