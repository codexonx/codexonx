import type { Preview } from '@storybook/react';

import '../apps/web/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--background)' },
        { name: 'dark', value: 'var(--token-surface-inverse)' },
      ],
    },
  },
};

export default preview;
