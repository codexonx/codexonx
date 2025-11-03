// Bu dosya TypeScript'in JSX tanımlarını ve diğer eksik tip tanımlarını sağlar

// JSX tiplerini tanımla
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// React namespace tiplerini tanımla (eğer gerekirse)
declare namespace React {
  interface FormEvent<T = Element> {
    preventDefault(): void;
    target: EventTarget & T;
  }
}

// Eksik modüllerin tiplerini tanımla
declare module '@radix-ui/react-toast' {
  export const ToastProvider: React.FC<any>;
  export const Toast: React.FC<any>;
  export const ToastTitle: React.FC<any>;
  export const ToastDescription: React.FC<any>;
  export const ToastClose: React.FC<any>;
  export const ToastViewport: React.FC<any>;
}

// Diğer eksik tip tanımları
declare module 'next-router-mock' {
  const mock: any;
  export default mock;
}

declare module 'next-router-mock/next-navigation' {
  const mock: any;
  export default mock;
}
