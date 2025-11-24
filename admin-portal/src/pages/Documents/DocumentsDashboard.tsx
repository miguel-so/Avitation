import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { getFlightById, getFlights } from '../../api/flights';
import { useApiError } from '../../hooks/useApiError';
import type { FlightDetail } from '../../types/domain';

export const DocumentsDashboard = () => {
  const handleError = useApiError();

  const { data, isLoading } = useQuery({
    queryKey: ['documents-dashboard'],
    queryFn: async () => {
      const response = await getFlights({ pageSize: 5 });
      const flightDetails = await Promise.all(
        response.data.map((flight) => getFlightById(flight.id)),
      );
      return flightDetails;
    },
    onError: (error) => {
      handleError(error, 'Unable to load document overview.');
    },
  });

  const flights = (data ?? []) as FlightDetail[];

  return (
    <Stack spacing="6">
      <Heading size="lg">Document Control</Heading>
      <Text color="gray.600">
        Documents are generated from canonical data sets. Use this view to monitor the latest PDFs
        produced across the most recent flights.
      </Text>

      {isLoading ? (
        <Flex align="center" justify="center" h="40vh">
          <Spinner size="xl" />
        </Flex>
      ) : flights.length === 0 ? (
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="gray.100"
          borderRadius="lg"
          p="10"
          textAlign="center"
        >
          <Heading size="md" mb="2">
            No documents generated yet
          </Heading>
          <Text color="gray.600">
            Once flights have passengers, crew and baggage assigned you can generate documents from
            the flight detail page.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
          {flights.map((flight) => (
            <Box
              key={flight.id}
              borderWidth="1px"
              borderColor="gray.100"
              borderRadius="lg"
              bg="white"
              p="5"
            >
              <Stack spacing="3">
                <Flex justify="space-between" align="center">
                  <Heading size="sm">{flight.uid}</Heading>
                  <Tag>{flight.status}</Tag>
                </Flex>
                <Text fontSize="sm" color="gray.500">
                  {flight.departureAirport?.icaoCode ?? flight.departureAirportId} →{' '}
                  {flight.arrivalAirport?.icaoCode ?? flight.arrivalAirportId}
                </Text>
                <Stack spacing="2">
                  {flight.documents.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">
                      No documents generated yet.
                    </Text>
                  ) : (
                    flight.documents.map((document) => (
                      <Flex
                        key={document.id}
                        justify="space-between"
                        align="center"
                        borderWidth="1px"
                        borderColor="gray.100"
                        borderRadius="md"
                        px="3"
                        py="2"
                      >
                        <Text fontSize="sm">{document.type.replace('_', ' ')}</Text>
                        <Tag size="sm" colorScheme={document.status === 'GENERATED' ? 'green' : 'gray'}>
                          {document.status}
                        </Tag>
                      </Flex>
                    ))
                  )}
                </Stack>
                <Button as={RouterLink} to={`/flights/${flight.id}`} colorScheme="brand">
                  Manage flight
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};


