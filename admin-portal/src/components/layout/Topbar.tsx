import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiBell, FiMoon, FiSun } from 'react-icons/fi';

import { useAuth } from '../../hooks/useAuth';

export const Topbar = () => {
  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Flex
      align="center"
      justify="space-between"
      px="6"
      py="4"
      bg={bg}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <Box>
        <Text fontWeight="semibold" color="gray.600">
          Welcome back,
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          {user?.email}
        </Text>
      </Box>
      <HStack spacing="3">
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          variant="ghost"
          onClick={toggleColorMode}
        />
        <IconButton aria-label="Notifications" icon={<FiBell />} variant="ghost" />
        <Avatar size="sm" name={user?.email} />
      </HStack>
    </Flex>
  );
};

