import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

import { components } from './components';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      50: '#e8f4ff',
      100: '#c4dcff',
      200: '#9ec2ff',
      300: '#78a8ff',
      400: '#528eff',
      500: '#2b74ff',
      600: '#1f5ad6',
      700: '#1542a8',
      800: '#0b2a7a',
      900: '#02134f',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components,
});

