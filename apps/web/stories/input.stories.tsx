import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  args: {
    placeholder: 'Adınızı girin',
    type: 'text',
  },
  decorators: [
    Story => (
      <div className="flex min-h-[200px] items-center justify-center bg-background p-md">
        <div className="w-[280px] space-y-xs text-foreground">
          <label htmlFor="input-basic" className="text-sm font-medium">
            Ad Soyad
          </label>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = {
  name: 'Metin Alanı',
  render: args => <Input id="input-basic" {...args} />,
};

export const Disabled: Story = {
  name: 'Devre Dışı',
  args: {
    disabled: true,
    value: 'devre dışı durum',
  },
  render: args => <Input id="input-disabled" {...args} />,
};
