import { useToast } from '@chakra-ui/react';
import axios from 'axios';

export const useApiError = () => {
  const toast = useToast();

  return (error: unknown, description?: string) => {
    let message = description ?? 'An unexpected error occurred.';

    if (axios.isAxiosError(error)) {
      message =
        (error.response?.data?.error?.message as string) ??
        error.message ??
        description ??
        'An unexpected error occurred.';
    }

    toast({
      title: 'Request failed',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };
};

