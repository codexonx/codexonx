import type { CodexonxEnvironment } from '../types';
import { logger } from '../utils/logger';

export type ApiClientOptions = {
  environment?: CodexonxEnvironment;
  baseUrl?: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  timeoutMs?: number;
};

export type ApiRequestOptions = Omit<RequestInit, 'signal'> & {
  parseJson?: boolean;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT = 12_000;

export class CodexonxApiClient {
  private readonly baseUrl: string;
  private readonly getToken?: ApiClientOptions['getToken'];
  private readonly timeoutMs: number;

  constructor({
    environment = 'development',
    baseUrl,
    getToken,
    timeoutMs,
  }: ApiClientOptions = {}) {
    const envUrl = getDefaultBaseUrl(environment);
    this.baseUrl = baseUrl ?? envUrl;
    this.getToken = getToken;
    this.timeoutMs = timeoutMs ?? DEFAULT_TIMEOUT;
  }

  async request<TResponse = unknown>(
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<TResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? this.timeoutMs);

    try {
      const token = await this.getToken?.();
      const headers = new Headers(options.headers);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const message = await safeReadError(response);
        throw new Error(message ?? `Request failed with status ${response.status}`);
      }

      if (options.method === 'HEAD' || options.method === 'OPTIONS') {
        return undefined as TResponse;
      }

      if (options.parseJson === false) {
        return response as unknown as TResponse;
      }

      const text = await response.text();
      if (!text) {
        return undefined as TResponse;
      }

      return JSON.parse(text) as TResponse;
    } finally {
      clearTimeout(timeout);
    }
  }

  get<TResponse = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, { ...options, method: 'GET' });
  }

  post<TResponse = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'POST',
      body: serializeBody(body, options?.body),
    });
  }

  put<TResponse = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PUT',
      body: serializeBody(body, options?.body),
    });
  }

  patch<TResponse = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'PATCH',
      body: serializeBody(body, options?.body),
    });
  }

  delete<TResponse = unknown>(path: string, options?: ApiRequestOptions) {
    return this.request<TResponse>(path, { ...options, method: 'DELETE' });
  }
}

function serializeBody(body: unknown, rawBody?: BodyInit | null): BodyInit | undefined {
  if (rawBody !== undefined) {
    return rawBody ?? undefined;
  }

  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

async function safeReadError(response: Response): Promise<string | undefined> {
  try {
    const text = await response.text();
    if (!text) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed && 'message' in parsed) {
        return String((parsed as { message: unknown }).message);
      }
      return text;
    } catch (_parseError) {
      return text;
    }
  } catch (error) {
    logger.error('Failed to parse error response', error);
    return undefined;
  }
}

function getDefaultBaseUrl(environment: CodexonxEnvironment): string {
  switch (environment) {
    case 'production':
      return 'https://api.codexonx.com';
    case 'staging':
      return 'https://staging-api.codexonx.com';
    default:
      return 'http://localhost:4000';
  }
}
