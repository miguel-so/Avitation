import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.100"
      p="10"
      textAlign="center"
      maxW="xl"
      mx="auto"
      mt="16"
    >
      <Stack spacing="4">
        <Heading size="lg">Page not found</Heading>
        <Text color="gray.600">
          The requested resource could not be located. Use the navigation to reach an available
          module.
        </Text>
        <Button as={RouterLink} to="/flights" colorScheme="brand">
          Go to flights
        </Button>
      </Stack>
    </Box>
  );
};


