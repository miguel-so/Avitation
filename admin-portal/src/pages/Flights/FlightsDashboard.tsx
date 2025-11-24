import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getFlights } from '../../api/flights';
import { FlightsTable } from '../../components/tables/FlightsTable';
import { useApiError } from '../../hooks/useApiError';
import type { FlightFilters } from '../../api/flights';
import type { FlightStatus } from '../../types/domain';

const statusOptions: Array<{ label: string; value: FlightStatus }> = [
  { label: 'Planned', value: 'PLANNED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const FlightsDashboard = () => {
  const handleError = useApiError();
  const [filters, setFilters] = useState<{ operator: string; status: string; airport: string }>({
    operator: '',
    status: '',
    airport: '',
  });

  const queryFilters: FlightFilters = useMemo(() => {
    return {
      operator: filters.operator || undefined,
      status: (filters.status as FlightStatus | '') || undefined,
      airport: filters.airport || undefined,
    };
  }, [filters]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['flights', queryFilters],
    queryFn: () => getFlights({ pageSize: 25, ...queryFilters }),
    retry: 1,
    onError: (error) => {
      handleError(error, 'Unable to load flights.');
    },
  });

  const flights = data?.data ?? [];
  const pagination = data?.meta?.pagination;

  const resetFilters = () => {
    setFilters({ operator: '', status: '', airport: '' });
  };

  return (
    <Stack spacing="6">
      <Flex align="center" justify="space-between">
        <Box>
          <Heading size="lg">Flights</Heading>
          <Text color="gray.600">
            Monitor live and upcoming movements across operators, airports and authorities.
          </Text>
        </Box>
        <Badge colorScheme="brand" borderRadius="md" px="3" py="1">
          API driven • Real time ready
        </Badge>
      </Flex>

      <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" p="6" shadow="sm">
        <Stack spacing="4">
          <Heading size="md">Filters</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
            <Stack spacing="1.5">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Operator
              </Text>
              <Input
                placeholder="Search by operator"
                value={filters.operator}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, operator: event.target.value }))
                }
              />
            </Stack>

            <Stack spacing="1.5">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Airport (ICAO/IATA)
              </Text>
              <Input
                placeholder="LIRF"
                value={filters.airport}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, airport: event.target.value.toUpperCase() }))
                }
              />
            </Stack>

            <Stack spacing="1.5">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Status
              </Text>
              <Select
                placeholder="All statuses"
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Stack>
          </SimpleGrid>
          <HStack spacing="3">
            <Button variant="ghost" onClick={resetFilters}>
              Reset
            </Button>
            {isFetching && (
              <HStack spacing="2" color="gray.500">
                <Spinner size="sm" />
                <Text fontSize="sm">Refreshing</Text>
              </HStack>
            )}
          </HStack>
        </Stack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="4">
        <Stat bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" p="4">
          <StatLabel>Total flights</StatLabel>
          <StatNumber>{pagination?.total ?? '--'}</StatNumber>
        </Stat>
        <Stat bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" p="4">
          <StatLabel>Active</StatLabel>
          <StatNumber>
            {flights.filter((flight) => flight.status === 'ACTIVE').length ?? 0}
          </StatNumber>
        </Stat>
        <Stat bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" p="4">
          <StatLabel>Completed</StatLabel>
          <StatNumber>
            {flights.filter((flight) => flight.status === 'COMPLETED').length ?? 0}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      {isLoading ? (
        <Flex align="center" justify="center" py="12">
          <Spinner size="xl" />
        </Flex>
      ) : flights.length === 0 ? (
        <Box
          bg="white"
          borderRadius="lg"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.200"
          p="12"
          textAlign="center"
        >
          <Heading size="md" mb="2">
            No flights match the current filters
          </Heading>
          <Text color="gray.600">
            Adjust the filters or ingest new flights via the mobile app to populate the dashboard.
          </Text>
        </Box>
      ) : (
        <FlightsTable flights={flights} />
      )}
    </Stack>
  );
};


