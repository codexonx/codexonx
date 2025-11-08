'use client';

import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';

type WaitlistFormStatus = 'idle' | 'loading' | 'success' | 'error';

type WaitlistFormProps = {
  className?: string;
};

type WaitlistFormState = {
  name: string;
  email: string;
  teamSize: string;
};

const defaultFormState: WaitlistFormState = {
  name: '',
  email: '',
  teamSize: '',
};

export function WaitlistForm({ className }: WaitlistFormProps) {
  const [formState, setFormState] = useState<WaitlistFormState>(defaultFormState);
  const [status, setStatus] = useState<WaitlistFormStatus>('idle');
  const [message, setMessage] = useState<string>('');

  const handleChange =
    (field: keyof WaitlistFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormState(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      await api.waitlist.join({
        name: formState.name.trim(),
        email: formState.email.trim(),
        teamSize: formState.teamSize,
      });

      setStatus('success');
      setMessage(
        'Bekleme listesine başarıyla kaydoldunuz. 48 saat içinde sizinle iletişime geçeceğiz.'
      );
      setFormState(defaultFormState);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu';
      setStatus('error');
      setMessage(errorMessage);
    }
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-4', className)}>
      <label className="text-sm font-medium text-foreground" htmlFor="waitlist-name">
        Ad Soyad
      </label>
      <Input
        id="waitlist-name"
        name="name"
        type="text"
        required
        value={formState.name}
        onChange={handleChange('name')}
        disabled={isLoading}
        placeholder="Örn. Elif Yılmaz"
        className="h-11"
      />

      <label className="text-sm font-medium text-foreground" htmlFor="waitlist-email">
        İş e-postası
      </label>
      <Input
        id="waitlist-email"
        name="email"
        type="email"
        required
        value={formState.email}
        onChange={handleChange('email')}
        disabled={isLoading}
        placeholder="email@şirket.com"
        className="h-11"
      />

      <label className="text-sm font-medium text-foreground" htmlFor="waitlist-team-size">
        Ekip büyüklüğü
      </label>
      <select
        id="waitlist-team-size"
        name="teamSize"
        required
        value={formState.teamSize}
        onChange={handleChange('teamSize')}
        disabled={isLoading}
        className="h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="" disabled>
          Seçiniz
        </option>
        <option value="1-10">1-10</option>
        <option value="11-50">11-50</option>
        <option value="51-200">51-200</option>
        <option value="200+">200+</option>
      </select>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        {isLoading ? 'Gönderiliyor...' : 'Bekleme listesine katıl'}
      </Button>

      {message ? (
        <p
          className={cn(
            'text-sm',
            isSuccess && 'text-emerald-500',
            isError && 'text-red-500',
            !isSuccess && !isError && 'text-muted-foreground'
          )}
        >
          {message}
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Formu göndererek gizlilik politikasını kabul etmiş olursunuz. En fazla 48 saat içinde size
        dönüş yapacağız.
      </p>
    </form>
  );
}
