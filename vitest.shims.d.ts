/// <reference types="@vitest/browser-playwright" />

declare module '@storybook/addon-vitest/vitest-plugin' {
  import type { Plugin } from 'vitest/config';

  interface StorybookTestOptions {
    configDir: string;
  }

  export function storybookTest(options: StorybookTestOptions): Plugin;
}
