'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CodexonxCardProps extends BoxProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export const CodexonxCard = ({ header, footer, children, ...props }: CodexonxCardProps) => {
  return (
    <Box
      bg="gray.800"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.700"
      overflow="hidden"
      _hover={{
        borderColor: 'brand.500',
        transform: 'translateY(-2px)',
        boxShadow: 'xl',
      }}
      transition="all 0.2s"
      {...props}
    >
      {header && (
        <Box p={4} borderBottomWidth="1px" borderColor="gray.700">
          {header}
        </Box>
      )}
      <Box p={4}>{children}</Box>
      {footer && (
        <Box p={4} borderTopWidth="1px" borderColor="gray.700">
          {footer}
        </Box>
      )}
    </Box>
  );
};
