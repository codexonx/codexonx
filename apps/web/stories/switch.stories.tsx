import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Switch } from '@/components/ui/switch';

const meta: Meta<typeof Switch> = {
  title: 'Design System/Switch',
  component: Switch,
  decorators: [
    Story => (
      <div className="flex min-h-[200px] items-center justify-center bg-background p-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    const ControlledSwitch = () => {
      const [checked, setChecked] = useState(false);
      return <Switch checked={checked} onCheckedChange={setChecked} aria-label="Temel switch" />;
    };

    return <ControlledSwitch />;
  },
};

export const Disabled: Story = {
  render: () => <Switch disabled aria-label="Devre dışı switch" defaultChecked />,
};
