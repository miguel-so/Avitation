import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import type { LoginPayload } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useApiError } from '../../hooks/useApiError';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof schema>;

export const Login = () => {
  const { isAuthenticated, login, isInitialized } = useAuth();
  const handleError = useApiError();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const from =
    (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? '/flights';

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values as LoginPayload);
      navigate(from, { replace: true });
    } catch (error) {
      handleError(error, 'Unable to sign in with the provided credentials.');
    }
  };

  if (isInitialized && isAuthenticated) {
    return <Navigate to="/flights" replace />;
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px="6">
      <Box
        w="full"
        maxW="md"
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        p="10"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Stack spacing="6" mb="6" textAlign="center">
          <Heading size="lg">Victor Executive Portal</Heading>
          <Text color="gray.600">
            Sign in to orchestrate flights, passengers, documents and authority workflows.
          </Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing="5">
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="ops@victorexecutive.com"
                autoComplete="email"
                {...register('email')}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.password)}>
              <FormLabel>Password</FormLabel>
              <Input type="password" autoComplete="current-password" {...register('password')} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="brand" size="lg" isLoading={isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};


