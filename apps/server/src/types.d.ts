// Server tarafı için temel tiplemeleri içerir

// Prisma Client tiplemeleri
declare module '../lib/prisma' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}

// Ortak tipler
declare global {
  type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';
  type WorkspacePlan = 'FREE' | 'PRO' | 'ENTERPRISE';

  interface UserWorkspaceSummary {
    id: string;
    name: string;
    slug: string;
    role: WorkspaceRole;
    plan: WorkspacePlan;
  }

  interface RequestUser {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
    workspaces: UserWorkspaceSummary[];
    activeWorkspace?: UserWorkspaceSummary;
  }

  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};

// Test tiplemeleri
declare global {
  type JestDone = (reason?: string | Error) => void;
  type JestHook = () => unknown | Promise<unknown>;
  type JestHookWithDone = (done: JestDone) => void;
  type JestTestHandler = JestHook | JestHookWithDone;

  interface JestMock<T = unknown, Y extends unknown[] = unknown[]> {
    (...args: Y): T;
    mockImplementation(fn: (...args: Y) => T): this;
    mockReturnThis(): this;
    mockReturnValue(value: T): this;
    mockReturnValueOnce(value: T): this;
    mockResolvedValue(value: T): this;
    mockResolvedValueOnce(value: T): this;
    mockRejectedValue(value: unknown): this;
    mockRejectedValueOnce(value: unknown): this;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): this;
    getMockName(): string;
    mockName(name: string): this;
    mock: {
      calls: Y[];
      instances: T[];
      invocationCallOrder: number[];
      results: Array<{ type: string; value: unknown }>;
    };
  }

  function describe(name: string, fn: JestHook): void;
  function test(name: string, fn: JestTestHandler, timeout?: number): void;
  function it(name: string, fn: JestTestHandler, timeout?: number): void;
  function expect<T>(actual: T): unknown;
  function beforeAll(fn: JestTestHandler, timeout?: number): void;
  function beforeEach(fn: JestTestHandler, timeout?: number): void;
  function afterAll(fn: JestTestHandler, timeout?: number): void;
  function afterEach(fn: JestTestHandler, timeout?: number): void;

  const jest: {
    fn: <T = unknown, Y extends unknown[] = unknown[]>(
      implementation?: (...args: Y) => T
    ) => JestMock<T, Y>;
    spyOn: <T extends Record<string, unknown>, M extends keyof T>(
      object: T,
      method: M
    ) => JestMock<T[M]>;
    mock: (moduleName: string, factory?: () => unknown, options?: { virtual?: boolean }) => void;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };
}
