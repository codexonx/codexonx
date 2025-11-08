'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';

type CaptchaProvider = 'hcaptcha' | 'turnstile';

const rawCaptchaProvider = (process.env.NEXT_PUBLIC_CONTACT_CAPTCHA_PROVIDER ?? '').toLowerCase();
const captchaProvider: CaptchaProvider | null =
  rawCaptchaProvider === 'hcaptcha' || rawCaptchaProvider === 'turnstile'
    ? rawCaptchaProvider
    : null;

let captchaSiteKey: string | undefined;
if (captchaProvider === 'hcaptcha') {
  captchaSiteKey = process.env.NEXT_PUBLIC_CONTACT_HCAPTCHA_SITE_KEY;
} else if (captchaProvider === 'turnstile') {
  captchaSiteKey = process.env.NEXT_PUBLIC_CONTACT_TURNSTILE_SITE_KEY;
}

const isCaptchaEnabled = Boolean(captchaProvider && captchaSiteKey);

declare global {
  interface Window {
    hcaptcha?: {
      render(
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ): string | number;
      reset(widgetId?: string | number): void;
    };
    turnstile?: {
      render(
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ): string;
      reset(widgetId: string): void;
      remove?(widgetId: string): void;
    };
  }
}

const contactTopics = [
  { value: 'demo', label: 'Canlı demo talebi' },
  { value: 'sales', label: 'Satın alma & fiyatlandırma' },
  { value: 'support', label: 'Teknik destek' },
  { value: 'partnership', label: 'İş ortaklığı' },
  { value: 'press', label: 'Basın & medya' },
  { value: 'other', label: 'Diğer' },
];

type FormState = {
  fullName: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  consent: boolean;
  honeypot: string;
  captchaToken: string;
};

type SubmitStatus = 'idle' | 'success' | 'error';

const initialState: FormState = {
  fullName: '',
  email: '',
  company: '',
  topic: 'demo',
  message: '',
  consent: false,
  honeypot: '',
  captchaToken: '',
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');

  const defaultTopic = useMemo(() => {
    if (!topicParam) return initialState.topic;
    const normalized = topicParam.toLowerCase();
    return contactTopics.some(topic => topic.value === normalized)
      ? normalized
      : initialState.topic;
  }, [topicParam]);

  const initialFormState = useMemo<FormState>(
    () => ({
      ...initialState,
      topic: defaultTopic,
    }),
    [defaultTopic]
  );

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<keyof FormState, string>>({
    fullName: '',
    email: '',
    company: '',
    topic: '',
    message: '',
    consent: '',
    honeypot: '',
    captchaToken: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [captchaError, setCaptchaError] = useState('');

  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    setFormState(prev => ({ ...prev, topic: defaultTopic }));
  }, [defaultTopic]);

  useEffect(() => {
    if (!isCaptchaEnabled) return;
    if (!captchaSiteKey) {
      console.warn('Captcha sağlayıcısı yapılandırıldı ancak site key eksik.');
      return;
    }

    const container = captchaContainerRef.current;
    if (!container) return;

    const renderCaptcha = () => {
      if (!captchaProvider) return;
      if (!container) return;

      if (captchaProvider === 'hcaptcha') {
        if (!window.hcaptcha) return;

        if (captchaWidgetIdRef.current !== null) {
          window.hcaptcha.reset(captchaWidgetIdRef.current);
          return;
        }

        const widgetId = window.hcaptcha.render(container, {
          sitekey: captchaSiteKey,
          callback: token => {
            setCaptchaError('');
            setErrors(prev => ({ ...prev, captchaToken: '' }));
            setFormState(prev => ({ ...prev, captchaToken: token }));
          },
          'expired-callback': () => {
            setFormState(prev => ({ ...prev, captchaToken: '' }));
          },
          'error-callback': () => {
            setCaptchaError('Güvenlik doğrulaması yüklenirken bir sorun oluştu.');
          },
        });
        captchaWidgetIdRef.current = widgetId;
      } else if (captchaProvider === 'turnstile') {
        if (!window.turnstile) return;

        if (captchaWidgetIdRef.current) {
          window.turnstile.reset(captchaWidgetIdRef.current as string);
          return;
        }

        const widgetId = window.turnstile.render(container, {
          sitekey: captchaSiteKey,
          callback: token => {
            setCaptchaError('');
            setErrors(prev => ({ ...prev, captchaToken: '' }));
            setFormState(prev => ({ ...prev, captchaToken: token }));
          },
          'expired-callback': () => {
            setFormState(prev => ({ ...prev, captchaToken: '' }));
          },
          'error-callback': () => {
            setCaptchaError('Güvenlik doğrulaması yüklenirken bir sorun oluştu.');
          },
        });
        captchaWidgetIdRef.current = widgetId;
      }
    };

    const scriptSelector = `script[data-contact-captcha="${captchaProvider}"]`;
    const existingScript = document.querySelector<HTMLScriptElement>(scriptSelector);

    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        renderCaptcha();
      } else {
        const handleLoad = () => {
          existingScript.dataset.loaded = 'true';
          renderCaptcha();
          existingScript.removeEventListener('load', handleLoad);
        };
        existingScript.addEventListener('load', handleLoad);
        return () => existingScript.removeEventListener('load', handleLoad);
      }
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset.contactCaptcha = captchaProvider ?? '';
    script.src =
      captchaProvider === 'hcaptcha'
        ? 'https://js.hcaptcha.com/1/api.js?render=explicit'
        : 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      renderCaptcha();
    });
    script.addEventListener('error', () => {
      setCaptchaError('Güvenlik doğrulaması yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    });

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', renderCaptcha);
    };
  }, []);

  const validate = (state: FormState) => {
    const nextErrors: typeof errors = {
      fullName: '',
      email: '',
      company: '',
      topic: '',
      message: '',
      consent: '',
      honeypot: '',
      captchaToken: '',
    };

    if (!state.fullName.trim()) {
      nextErrors.fullName = 'Adınızı ve soyadınızı paylaşın.';
    }

    if (!state.email.trim()) {
      nextErrors.email = 'Geçerli bir e-posta adresi gereklidir.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      nextErrors.email = 'E-posta formatı geçerli görünmüyor.';
    }

    if (!state.message.trim() || state.message.trim().length < 20) {
      nextErrors.message = 'Mesajınız en az 20 karakter olmalıdır.';
    }

    if (!state.consent) {
      nextErrors.consent = 'İletişim izni gereklidir.';
    }

    if (state.honeypot) {
      nextErrors.honeypot = 'Geçersiz gönderim algılandı.';
    }

    if (isCaptchaEnabled && !state.captchaToken) {
      nextErrors.captchaToken = 'Lütfen güvenlik doğrulamasını tamamlayın.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setFeedback('');

    const validationResult = validate(formState);
    setErrors(validationResult);

    if (Object.values(validationResult).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const referrer = typeof document !== 'undefined' ? document.referrer : '';
      const payload = {
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        company: formState.company.trim() || undefined,
        topic: formState.topic,
        message: formState.message.trim(),
        consent: formState.consent,
        referrer: referrer || undefined,
        captchaToken: formState.captchaToken || undefined,
      };

      const response = await api.contact.submit(payload);

      setStatus('success');
      setFeedback(response.message ?? 'Mesajınızı aldık! Ekibimiz kısa süre içinde dönüş yapacak.');
      setFormState({ ...initialFormState });
      if (isCaptchaEnabled) {
        if (captchaProvider === 'hcaptcha' && window.hcaptcha) {
          window.hcaptcha.reset(captchaWidgetIdRef.current ?? undefined);
        }
        if (captchaProvider === 'turnstile' && window.turnstile && captchaWidgetIdRef.current) {
          window.turnstile.reset(captchaWidgetIdRef.current as string);
        }
        captchaWidgetIdRef.current = null;
      }
    } catch (error) {
      console.error('Contact form submission error', error);
      setStatus('error');
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Mesajınızı iletirken bir sorun oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setFormState(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ad Soyad</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Örn. Defne Yılmaz"
              value={formState.fullName}
              onChange={event => updateField('fullName', event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              autoComplete="name"
            />
            {errors.fullName ? (
              <p id="fullName-error" className="text-sm text-destructive">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Örn. defne@şirketiniz.com"
              value={formState.email}
              onChange={event => updateField('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Şirket / Organizasyon</Label>
            <Input
              id="company"
              name="company"
              placeholder="Şirket adı (opsiyonel)"
              value={formState.company}
              onChange={event => updateField('company', event.target.value)}
              autoComplete="organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Konunuz</Label>
            <Select value={formState.topic} onValueChange={value => updateField('topic', value)}>
              <SelectTrigger id="topic">
                <SelectValue placeholder="Konunuzu seçin" />
              </SelectTrigger>
              <SelectContent>
                {contactTopics.map(topic => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mesajınız</Label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Ekibimize iletmek istediğiniz detayları paylaşın."
            value={formState.message}
            onChange={event => updateField('message', event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message ? (
            <p id="message-error" className="text-sm text-destructive">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={formState.consent}
              onCheckedChange={value => updateField('consent', value === true)}
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground">
              İletişim talebim kapsamında benimle e-posta aracılığıyla iletişime geçilmesini kabul
              ediyorum. Gizlilik Politikası’nı okudum.
            </Label>
          </div>
          {errors.consent ? <p className="text-sm text-destructive">{errors.consent}</p> : null}
        </div>

        <div className="hidden">
          <Label htmlFor="website">Web sitesi</Label>
          <Input
            id="website"
            name="website"
            value={formState.honeypot}
            onChange={event => updateField('honeypot', event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
          {errors.honeypot ? <p className="text-sm text-destructive">{errors.honeypot}</p> : null}
        </div>

        {isCaptchaEnabled ? (
          <div className="space-y-2">
            <Label>Güvenlik Doğrulaması</Label>
            <div ref={captchaContainerRef} className="min-h-[78px]" aria-live="polite" />
            {captchaError ? <p className="text-sm text-destructive">{captchaError}</p> : null}
            {errors.captchaToken ? (
              <p className="text-sm text-destructive">{errors.captchaToken}</p>
            ) : null}
          </div>
        ) : null}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Gönderiliyor…' : 'Mesajı Gönder'}
        </Button>
      </form>

      {status !== 'idle' ? (
        <Alert variant={status === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{status === 'success' ? 'Mesajınız alındı' : 'Bir sorun oluştu'}</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
