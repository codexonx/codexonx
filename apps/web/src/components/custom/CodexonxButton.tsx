'use client';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface CodexonxButtonProps extends ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

export const CodexonxButton = forwardRef<HTMLButtonElement, CodexonxButtonProps>(
  ({ children, variant = 'solid', size = 'md', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        size={size}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
        transition="all 0.2s"
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

CodexonxButton.displayName = 'CodexonxButton';
