export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U
): T & U {
  const output: Record<string, unknown> = { ...target };

  Object.entries(source).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key] as Record<string, unknown>, value);
      return;
    }

    output[key] = value;
  });

  return output as T & U;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K> {
  const result: Partial<T> = {};

  keys.forEach(key => {
    if (key in object) {
      result[key] = object[key];
    }
  });

  return result as Pick<T, K>;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: K[]
): Omit<T, K> {
  const result: Partial<T> = { ...object };
  keys.forEach(key => {
    if (key in result) {
      delete result[key];
    }
  });

  return result as Omit<T, K>;
}
