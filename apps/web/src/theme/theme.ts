import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#FFF5F5',
    100: '#FED7D7',
    200: '#FEB2B2',
    300: '#FC8181',
    400: '#F56565',
    500: '#E53E3E', // Primary orange
    600: '#C53030',
    700: '#9B2C2C',
    800: '#822727',
    900: '#63171B',
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
  black: '#000000',
  white: '#FFFFFF',
  orange: {
    500: '#FF6B35', // Bright orange for accents
    600: '#E65100',
  },
};

const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
  mono: 'Fira Code, monospace',
};

const styles = {
  global: {
    'html, body': {
      bg: 'black',
      color: 'white',
    },
    '::selection': {
      bg: 'brand.500',
      color: 'white',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'gray.800',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'brand.500',
      borderRadius: 'full',
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
      _focus: {
        boxShadow: '0 0 0 3px var(--chakra-colors-brand-500)',
      },
    },
    variants: {
      solid: (props: { colorMode: string }) => ({
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.700',
        },
      }),
      outline: {
        border: '2px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'rgba(255, 107, 53, 0.1)',
        },
      },
      ghost: {
        color: 'whiteAlpha.900',
        _hover: {
          bg: 'whiteAlpha.200',
        },
      },
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: 'gray.800',
          _hover: {
            bg: 'gray.700',
          },
          _focus: {
            bg: 'gray.700',
            borderColor: 'brand.500',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Textarea: {
    variants: {
      filled: {
        bg: 'gray.800',
        _hover: {
          bg: 'gray.700',
        },
        _focus: {
          bg: 'gray.700',
          borderColor: 'brand.500',
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'gray.800',
        borderRadius: 'lg',
        boxShadow: 'lg',
      },
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
  config,
});
