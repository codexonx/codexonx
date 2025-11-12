/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './app/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'background-strong': 'hsl(var(--background-strong))',
        'background-muted': 'hsl(var(--background-muted))',
        success: 'hsl(var(--token-color-success))',
        warning: 'hsl(var(--token-color-warning))',
        info: 'hsl(var(--token-color-info))',
        danger: 'hsl(var(--token-color-danger))',
      },
      spacing: {
        '2xs': 'var(--token-space-2xs)',
        xs: 'var(--token-space-xs)',
        sm: 'var(--token-space-sm)',
        md: 'var(--token-space-md)',
        lg: 'var(--token-space-lg)',
        xl: 'var(--token-space-xl)',
        '2xl': 'var(--token-space-2xl)',
      },
      borderRadius: {
        none: '0px',
        xs: 'var(--token-radius-xs)',
        sm: 'var(--token-radius-sm)',
        DEFAULT: 'var(--token-radius-sm)',
        md: 'var(--token-radius-md)',
        lg: 'var(--token-radius-lg)',
        xl: 'var(--token-radius-xl)',
        '2xl': 'var(--token-radius-2xl)',
        '3xl': 'var(--token-radius-3xl)',
        full: 'var(--token-radius-pill)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-orbitron)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        sm: 'var(--token-shadow-sm)',
        DEFAULT: 'var(--token-shadow-sm)',
        md: 'var(--token-shadow-md)',
        lg: 'var(--token-shadow-lg)',
        xl: 'var(--token-shadow-xl)',
        glass: 'var(--token-shadow-glass)',
        'primary-glow': 'var(--token-shadow-primary-glow)',
        'secondary-glow': 'var(--token-shadow-secondary-glow)',
        halo: 'var(--token-shadow-halo)',
        'purple-halo': 'var(--token-shadow-purple-halo)',
        none: 'none',
      },
      backgroundImage: {
        'gradient-primary': 'var(--token-gradient-primary)',
        'gradient-surface': 'var(--token-gradient-surface)',
        'gradient-card': 'var(--token-gradient-card)',
      },
      transitionDuration: {
        fast: 'var(--token-duration-fast)',
        normal: 'var(--token-duration-normal)',
        slow: 'var(--token-duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--token-easing-standard)',
        accelerate: 'var(--token-easing-accelerate)',
        decelerate: 'var(--token-easing-decelerate)',
      },
      zIndex: {
        1: 1,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
