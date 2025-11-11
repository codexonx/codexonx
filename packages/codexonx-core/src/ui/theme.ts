export type ThemeName = 'codexonx-dark' | 'codexonx-light' | 'codexonx-midnight';

export interface ThemeTokenGroup {
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface CodexonxTheme {
  name: ThemeName;
  tokens: ThemeTokenGroup;
  typography: TypographyScale;
  radius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const CODEXONX_THEMES: Record<ThemeName, CodexonxTheme> = {
  'codexonx-dark': {
    name: 'codexonx-dark',
    tokens: {
      surface: '#0F172A',
      surfaceElevated: '#111C35',
      surfaceSunken: '#0C1221',
      primary: '#6366F1',
      primaryForeground: '#F9FAFB',
      accent: '#22D3EE',
      accentForeground: '#0F172A',
      border: '#1E293B',
      muted: '#1B2540',
      mutedForeground: '#CBD5F5',
      destructive: '#EF4444',
      destructiveForeground: '#F9FAFB',
    },
    typography: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    radius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      pill: '999px',
    },
    shadows: {
      sm: '0px 1px 3px rgba(15, 23, 42, 0.3)',
      md: '0px 12px 24px rgba(15, 23, 42, 0.35)',
      lg: '0px 32px 64px rgba(15, 23, 42, 0.45)',
    },
  },
  'codexonx-light': {
    name: 'codexonx-light',
    tokens: {
      surface: '#F8FAFC',
      surfaceElevated: '#FFFFFF',
      surfaceSunken: '#E2E8F0',
      primary: '#4338CA',
      primaryForeground: '#FFFFFF',
      accent: '#0EA5E9',
      accentForeground: '#F1F5F9',
      border: '#CBD5F5',
      muted: '#E2E8F0',
      mutedForeground: '#1E293B',
      destructive: '#DC2626',
      destructiveForeground: '#FFFFFF',
    },
    typography: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    radius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      pill: '999px',
    },
    shadows: {
      sm: '0px 1px 3px rgba(148, 163, 184, 0.2)',
      md: '0px 10px 20px rgba(148, 163, 184, 0.25)',
      lg: '0px 28px 48px rgba(148, 163, 184, 0.3)',
    },
  },
  'codexonx-midnight': {
    name: 'codexonx-midnight',
    tokens: {
      surface: '#050816',
      surfaceElevated: '#0A1124',
      surfaceSunken: '#04060E',
      primary: '#A855F7',
      primaryForeground: '#FEF9FF',
      accent: '#38BDF8',
      accentForeground: '#030712',
      border: '#111827',
      muted: '#1F2937',
      mutedForeground: '#E0E7FF',
      destructive: '#F87171',
      destructiveForeground: '#1F2937',
    },
    typography: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    radius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      pill: '999px',
    },
    shadows: {
      sm: '0px 2px 6px rgba(8, 13, 29, 0.45)',
      md: '0px 14px 28px rgba(8, 13, 29, 0.5)',
      lg: '0px 36px 72px rgba(8, 13, 29, 0.55)',
    },
  },
};

export function getTheme(name: ThemeName): CodexonxTheme {
  return CODEXONX_THEMES[name];
}
