import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mutlak URL oluşturur
 * @param path - Relatif path
 */
export function absoluteUrl(path: string) {
  // Eğer server-side render ise ve process.env.NEXT_PUBLIC_APP_URL mevcutsa kullan
  if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  }

  // Client-side, geçerli origin'i kullan
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }

  // Fallback, yerel geliştirme için
  return `http://localhost:3000${path}`;
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount);
}
