import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const meta: Meta = {
  title: 'Design System/Tooltip',
  decorators: [
    Story => (
      <TooltipProvider delayDuration={200} disableHoverableContent>
        <div className="flex min-h-[200px] items-center justify-center bg-background p-md">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="default">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Basit bir açıklama metni.</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Uzun içerik</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        Detaylı açıklama metni. Bu tooltip, tasarım tokenları sayesinde maksimum genişlik, ok rengi
        ve gölge gibi stilleri tutarlı biçimde uygular.
      </TooltipContent>
    </Tooltip>
  ),
};
