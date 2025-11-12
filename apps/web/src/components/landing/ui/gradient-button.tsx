'use client';

import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';

export type GradientButtonProps = Omit<ButtonProps, 'variant'> & {
  /**
   * When true, renders the outlined gradient style instead of the filled one.
   */
  outline?: boolean;
};

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ outline = false, ...props }, ref) => (
    <Button ref={ref} variant={outline ? 'gradient-outline' : 'gradient'} {...props} />
  )
);
GradientButton.displayName = 'GradientButton';

export { GradientButton };
