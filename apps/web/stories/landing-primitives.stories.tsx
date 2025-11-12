import type { Meta, StoryObj } from '@storybook/react';

import { GradientButton } from '@/components/landing/ui/gradient-button';
import { GlassCard } from '@/components/landing/glass-card';
import { SectionHeading } from '@/components/landing/ui/section-heading';

const meta = {
  title: 'Landing/Primitives',
  component: GlassCard,
  tags: ['autodocs'],
} satisfies Meta<typeof GlassCard>;

export default meta;

type Story = StoryObj<typeof GlassCard>;

export const Surfaces: Story = {
  render: () => (
    <div className="flex flex-col gap-xl">
      <SectionHeading
        eyebrow="Design System"
        title="Aurora glass surfaces"
        lead="Emergent-inspired glass cards with glow halos and gradient fills."
      />
      <div className="grid gap-lg md:grid-cols-3">
        <GlassCard>
          <h3 className="text-xl font-semibold">Default Surface</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            Gradient surface designed for primary sections.
          </p>
        </GlassCard>
        <GlassCard surface="muted">
          <h3 className="text-xl font-semibold">Muted Surface</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            Subtle glass background for secondary callouts.
          </p>
        </GlassCard>
        <GlassCard surface="primary" glow>
          <h3 className="text-xl font-semibold">Primary Aurora</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            Aurora gradient with halo glow for key CTAs.
          </p>
        </GlassCard>
      </div>
    </div>
  ),
};

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-lg">
      <SectionHeading
        align="left"
        eyebrow="Call-to-action"
        title="Gradient button variants"
        lead="Filled and outline gradient buttons reusing the shared button primitives."
      />
      <div className="flex flex-wrap gap-md">
        <GradientButton>Start free trial</GradientButton>
        <GradientButton outline>Schedule live demo</GradientButton>
        <GradientButton size="pill">Join the beta</GradientButton>
      </div>
    </div>
  ),
};
