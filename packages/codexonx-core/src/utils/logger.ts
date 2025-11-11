/* eslint-disable no-console */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  namespace?: string;
  enabled?: boolean;
  level?: LogLevel;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export class CodexonxLogger {
  private readonly namespace?: string;
  private readonly enabled: boolean;
  private readonly level: LogLevel;

  constructor({ namespace, enabled = true, level = 'info' }: LoggerOptions = {}) {
    this.namespace = namespace;
    this.enabled = enabled;
    this.level = level;
  }

  debug(...messages: unknown[]) {
    this.log('debug', ...messages);
  }

  info(...messages: unknown[]) {
    this.log('info', ...messages);
  }

  warn(...messages: unknown[]) {
    this.log('warn', ...messages);
  }

  error(...messages: unknown[]) {
    this.log('error', ...messages);
  }

  private log(level: LogLevel, ...messages: unknown[]) {
    if (!this.enabled) {
      return;
    }

    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.level]) {
      return;
    }

    const prefix = this.namespace ? `[${this.namespace}]` : '[codexonx]';
    const payload = [prefix, ...messages];

    switch (level) {
      case 'debug':
        console.debug(...payload);
        break;
      case 'info':
        console.info(...payload);
        break;
      case 'warn':
        console.warn(...payload);
        break;
      case 'error':
        console.error(...payload);
        break;
      default:
        console.log(...payload);
    }
  }
}

export const logger = new CodexonxLogger({ namespace: 'codexonx-core', level: 'debug' });
