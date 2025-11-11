import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Checkbox',
  component: Checkbox,
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
    const ControlledCheckbox = () => {
      const [checked, setChecked] = useState(false);
      return (
        <label className="flex items-center gap-xs text-foreground">
          <Checkbox checked={checked} onCheckedChange={setChecked} id="basic-checkbox" />
          <span>Bildirim e-postaları gönder</span>
        </label>
      );
    };

    return <ControlledCheckbox />;
  },
};

export const Disabled: Story = {
  render: () => (
    <label className="flex items-center gap-xs text-muted-foreground">
      <Checkbox id="disabled-checkbox" disabled defaultChecked />
      <span>Devre dışı checkbox</span>
    </label>
  ),
};
