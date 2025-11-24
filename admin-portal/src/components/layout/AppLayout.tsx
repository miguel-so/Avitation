import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout = () => {
  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar />
      <Flex flex="1" direction="column" bg="gray.50">
        <Topbar />
        <Box flex="1" overflowY="auto" p="6">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

