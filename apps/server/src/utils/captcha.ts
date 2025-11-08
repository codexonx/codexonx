import { logger } from './logger';

type CaptchaProvider = 'hcaptcha' | 'turnstile';

const rawCaptchaProvider = (process.env.CONTACT_CAPTCHA_PROVIDER ?? '').toLowerCase();
export const captchaProvider: CaptchaProvider | null =
  rawCaptchaProvider === 'hcaptcha' || rawCaptchaProvider === 'turnstile'
    ? (rawCaptchaProvider as CaptchaProvider)
    : null;

let captchaSecret: string | undefined;
if (captchaProvider === 'hcaptcha') {
  captchaSecret = process.env.CONTACT_HCAPTCHA_SECRET_KEY;
} else if (captchaProvider === 'turnstile') {
  captchaSecret = process.env.CONTACT_TURNSTILE_SECRET_KEY;
}

export const isCaptchaEnabled = () => Boolean(captchaProvider && captchaSecret);
export const getCaptchaSecret = () => captchaSecret;
export const getCaptchaProvider = () => captchaProvider;

const captchaEndpoints: Record<CaptchaProvider, string> = {
  hcaptcha: 'https://hcaptcha.com/siteverify',
  turnstile: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
};

const normalizeErrorCodes = (value: unknown): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }

  if (typeof value === 'string') {
    return [value];
  }

  return undefined;
};

type VerifyCaptchaResult = {
  success: boolean;
  provider: CaptchaProvider | null;
  errorCodes?: string[];
};

export const verifyCaptchaToken = async (
  token?: string,
  remoteIp?: string
): Promise<VerifyCaptchaResult> => {
  if (!isCaptchaEnabled()) {
    return { success: true, provider: captchaProvider };
  }

  const provider = captchaProvider;
  const secret = captchaSecret;

  if (!provider || !secret) {
    logger.warn('Captcha provider configured but secret key missing', { provider });
    return { success: false, provider, errorCodes: ['missing-secret'] };
  }

  if (!token?.trim()) {
    return { success: false, provider, errorCodes: ['missing-input-response'] };
  }

  const endpoint = captchaEndpoints[provider];
  const params = new URLSearchParams();
  params.set('secret', secret);
  params.set('response', token);

  if (remoteIp) {
    params.set('remoteip', remoteIp);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      logger.warn('Captcha verification returned non-200 response', {
        provider,
        status: response.status,
      });
      return { success: false, provider, errorCodes: [`http-${response.status}`] };
    }

    const payload = (await response.json()) as {
      success?: boolean;
      'error-codes'?: unknown;
      errorCodes?: unknown;
      errors?: unknown;
      messages?: unknown;
    };

    const success = Boolean(payload.success);
    const errorCodes =
      normalizeErrorCodes(payload['error-codes']) ??
      normalizeErrorCodes(payload.errorCodes) ??
      normalizeErrorCodes(payload.errors) ??
      normalizeErrorCodes(payload.messages);

    if (!success) {
      logger.warn('Captcha verification failed', { provider, errorCodes });
    }

    return { success, provider, errorCodes };
  } catch (error) {
    logger.error('Captcha verification request failed', { error, provider });
    return { success: false, provider, errorCodes: ['request-failed'] };
  }
};
