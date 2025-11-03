// Server tarafı için temel tiplemeleri içerir

// Prisma Client tiplemeleri
declare module '../lib/prisma' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}

// Express tiplemeleri
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

// API Yanıt tipleri
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// Proje modeli tipleri
interface Project {
  id: string;
  name: string;
  description?: string;
  apiKey: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Kullanıcı modeli tipleri
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  projects?: Project[];
}

// Abonelik modeli tipleri
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Plan modeli tipleri
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Test tiplemeleri
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation(fn: (...args: Y) => T): this;
      mockReturnThis(): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue(value: T): this;
      mockResolvedValueOnce(value: T): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
      getMockName(): string;
      mockName(name: string): this;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: Array<{ type: string; value: any }>;
      };
    }
  }

  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: Function, timeout?: number): void;
  function it(name: string, fn: Function, timeout?: number): void;
  function expect<T>(actual: T): any;
  function beforeAll(fn: Function, timeout?: number): void;
  function beforeEach(fn: Function, timeout?: number): void;
  function afterAll(fn: Function, timeout?: number): void;
  function afterEach(fn: Function, timeout?: number): void;

  const jest: {
    fn: <T = any>(implementation?: (...args: any[]) => T) => jest.Mock<T>;
    spyOn: <T extends {}, M extends keyof T>(object: T, method: M) => jest.Mock<T[M]>;
    mock: (moduleName: string, factory?: any, options?: any) => void;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };
}
