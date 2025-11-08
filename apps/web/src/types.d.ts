// Bu dosya TypeScript'in JSX tanımlarını ve diğer eksik tip tanımlarını sağlar

// JSX tiplerini tanımla
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

// React namespace tiplerini tanımla (eğer gerekirse)
declare namespace React {
  interface FormEvent<T = Element> {
    preventDefault(): void;
    target: EventTarget & T;
  }
}

// NextAuth tip genişletmeleri
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    picture?: string | null;
  }
}

// NextAuth Prisma adapter tipi için deklarasyon
declare module '@next-auth/prisma-adapter' {
  import type { Adapter } from 'next-auth/adapters';
  import type { PrismaClient } from '@prisma/client';

  export function PrismaAdapter(client: PrismaClient): Adapter;
}

// Bcryptjs modülü için deklarasyon
declare module 'bcryptjs' {
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
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
