import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const Unauthorized = () => {
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
        <Heading size="lg">Restricted area</Heading>
        <Text color="gray.600">
          Your role does not grant access to this section of the platform. Contact a Victor
          administrator if you believe this is incorrect.
        </Text>
        <Button as={RouterLink} to="/flights" colorScheme="brand">
          Back to dashboard
        </Button>
      </Stack>
    </Box>
  );
};


