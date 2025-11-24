import {
  Box,
  Flex,
  Icon,
  Link as ChakraLink,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiAirplay, FiClipboard, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles?: string[];
}

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Flights', to: '/flights', icon: FiAirplay },
    {
      label: 'Documents',
      to: '/documents',
      icon: FiClipboard,
      roles: ['VictorAdmin', 'OperatorAdmin'],
    },
    {
      label: 'Authority terminal',
      to: '/authority',
      icon: FiShield,
      roles: ['AuthorityUser', 'VictorAdmin'],
    },
    { label: 'Settings', to: '/settings', icon: FiSettings, roles: ['VictorAdmin'] },
  ];

  return (
    <Flex
      direction="column"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.100"
      w="64"
      h="100vh"
      px="6"
      py="8"
    >
      <Box mb="8">
        <Text fontSize="lg" fontWeight="bold" color="brand.600">
          Victor Admin
        </Text>
        <Text fontSize="sm" color="gray.500">
          {user?.role ?? 'Operational Control'}
        </Text>
      </Box>
      <VStack align="stretch" spacing="2" flex="1">
        {navItems
          .filter((item) => {
            if (!item.roles) return true;
            return item.roles.includes(user?.role ?? '');
          })
          .map((item) => (
            <ChakraLink
              key={item.label}
              as={NavLink}
              to={item.to}
              display="flex"
              alignItems="center"
              px="3"
              py="2.5"
              borderRadius="md"
              color="gray.600"
              _hover={{ textDecoration: 'none', bg: 'gray.100' }}
              _activeLink={{ bg: 'brand.50', color: 'brand.600', fontWeight: 'semibold' }}
            >
              <Icon as={item.icon} boxSize="4" mr="3" />
              {item.label}
            </ChakraLink>
          ))}
      </VStack>
      <Flex
        align="center"
        mt="auto"
        pt="4"
        borderTopWidth="1px"
        borderColor="gray.100"
        cursor="pointer"
        color="gray.500"
        onClick={logout}
        _hover={{ color: 'brand.600' }}
      >
        <Icon as={FiLogOut} mr="2" />
        <Text fontSize="sm">Sign out</Text>
      </Flex>
    </Flex>
  );
};

