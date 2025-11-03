import '@testing-library/jest-dom';

// Jest DOM matchers tiplerini global olarak ekle
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      // Diğer jest-dom matchers...
    }
  }
}
