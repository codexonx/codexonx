import type { Meta, StoryObj } from '@storybook/react';

import AIAgentPage from '@/modules/app/ai-agent/ai-agent-page';

const meta = {
  title: 'App/AI Agent/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-background/70 p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Mock Sidebar</span>
          <p className="mt-2">AI Agent görünümünün Storybook önizlemesi.</p>
        </aside>
        <main className="bg-background p-8">
          <AIAgentPage />
        </main>
      </div>
    </div>
  ),
};
