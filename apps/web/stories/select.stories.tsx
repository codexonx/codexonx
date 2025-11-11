import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const OPTIONS = [
  { value: 'basic', label: 'Standart Paket' },
  { value: 'pro', label: 'Profesyonel Paket' },
  { value: 'enterprise', label: 'Kurumsal Paket' },
];

const ControlledSelect = () => {
  const [value, setValue] = useState('pro');

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[240px]" aria-label="Paket seçimi">
        <SelectValue placeholder="Paket seçin" />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  component: Select,
  decorators: [
    Story => (
      <div className="flex min-h-[220px] items-center justify-center bg-background p-md text-foreground">
        <div className="space-y-xs">
          <label htmlFor="select-basic" className="text-sm font-medium">
            Paket Seçimi
          </label>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => <ControlledSelect />,
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="basic">
      <SelectTrigger className="w-[240px]" aria-label="Devre dışı paket seçimi">
        <SelectValue placeholder="Paket seçin" />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};
