import type { Meta, StoryObj } from '@storybook/react';

import HeroSection from '@/modules/marketing/hero/hero-section';
import PricingPage from '@/modules/marketing/pricing/pricing-page';

const meta = {
  title: 'Marketing/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Hero: Story = {
  render: () => (
    <div className="bg-background">
      <HeroSection />
    </div>
  ),
};

export const Pricing: Story = {
  render: () => (
    <div className="bg-background">
      <PricingPage />
    </div>
  ),
};
