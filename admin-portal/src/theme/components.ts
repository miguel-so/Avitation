import type { ComponentStyleConfig } from '@chakra-ui/react';

const Button: ComponentStyleConfig = {
  baseStyle: {
    rounded: 'md',
    fontWeight: 'semibold',
  },
  sizes: {
    md: {
      px: 5,
      py: 3,
    },
  },
  variants: {
    solid: {
      bg: 'brand.500',
      color: 'white',
      _hover: { bg: 'brand.600' },
      _active: { bg: 'brand.700' },
    },
    outline: {
      borderColor: 'brand.500',
      color: 'brand.500',
      _hover: { bg: 'brand.50' },
    },
  },
  defaultProps: {
    variant: 'solid',
  },
};

const Card: ComponentStyleConfig = {
  baseStyle: {
    bg: 'white',
    rounded: 'lg',
    shadow: 'sm',
    borderWidth: '1px',
    borderColor: 'gray.100',
    p: 6,
  },
};

export const components = {
  Button,
  Card,
};

