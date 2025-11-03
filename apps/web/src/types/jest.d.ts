// Jest için global tiplemeler

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

    interface FunctionLike {
      readonly name: string;
    }

    type MockableFunction = (...args: any[]) => any;
    type MethodKeysOf<T> = { [K in keyof T]: T[K] extends MockableFunction ? K : never }[keyof T];
    type PropertyKeysOf<T> = { [K in keyof T]: T[K] extends MockableFunction ? never : K }[keyof T];
    type ArgumentsOf<T> = T extends (...args: infer A) => any ? A : never;
    type ConstructorArgumentsOf<T> = T extends new (...args: infer A) => any ? A : never;
    type MaybeMockedConstructor<T> = T extends new (...args: any[]) => infer R ? jest.MockInstance<R, ConstructorArgumentsOf<T>> : T;
    type MockedFunction<T extends MockableFunction> = jest.MockInstance<ReturnType<T>, ArgumentsOf<T>>;
    type MockedFunctionDeep<T extends MockableFunction> = MockedFunction<T> & MockedObjectDeep<T>;
    type MockedObject<T> = MaybeMockedConstructor<T> & { [K in MethodKeysOf<T>]: MockedFunction<T[K]> } & { [K in PropertyKeysOf<T>]: T[K] };
    type MockedObjectDeep<T> = MaybeMockedConstructor<T> & { [K in MethodKeysOf<T>]: MockedFunctionDeep<T[K]> } & { [K in PropertyKeysOf<T>]: MaybeMockedDeep<T[K]> };
    type MaybeMockedDeep<T> = T extends MockableFunction ? MockedFunctionDeep<T> : T extends object ? MockedObjectDeep<T> : T;
    type MockInstance<T, Y extends any[]> = Mock<T, Y> & Function;
  }

  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: jest.ProvidesCallback, timeout?: number): void;
  function it(name: string, fn: jest.ProvidesCallback, timeout?: number): void;
  function expect<T>(actual: T): jest.Matchers<T>;
  function beforeAll(fn: jest.ProvidesCallback, timeout?: number): void;
  function beforeEach(fn: jest.ProvidesCallback, timeout?: number): void;
  function afterAll(fn: jest.ProvidesCallback, timeout?: number): void;
  function afterEach(fn: jest.ProvidesCallback, timeout?: number): void;

  const jest: {
    fn: <T = any>(implementation?: (...args: any[]) => T) => jest.Mock<T>;
    spyOn: <T extends {}, M extends keyof T>(object: T, method: M) => jest.Mock<T[M]>;
    mock: (moduleName: string, factory?: any, options?: any) => void;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
  };
}

export {};
