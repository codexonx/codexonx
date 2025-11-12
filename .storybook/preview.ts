import type { Preview } from '@storybook/react';

import '../apps/web/app/globals.css';
import { WorkspaceProvider } from '../apps/web/src/contexts/workspace-context';

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
  globalTypes: {
    workspace: {
      name: 'Workspace',
      description: 'Aktif workspace seçimi',
      defaultValue: 'ws_orbit',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'ws_orbit', title: 'Orbit Labs' },
          { value: 'ws_neural', title: 'NeuralWorks' },
          { value: 'ws_atlas', title: 'Atlas Industries' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof window !== 'undefined') {
        const workspaceId = context.globals.workspace as string;
        if (workspaceId) {
          localStorage.setItem('active_workspace_id', workspaceId);
        }
      }

      return (
        <WorkspaceProvider>
          <Story />
        </WorkspaceProvider>
      );
    },
  ],
};

export default preview;
