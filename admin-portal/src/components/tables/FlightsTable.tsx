import {
  Badge,
  Box,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import type { Flight } from '../../types/domain';

interface FlightsTableProps {
  flights: Flight[];
}

const statusColor: Record<Flight['status'], string> = {
  PLANNED: 'blue',
  ACTIVE: 'green',
  COMPLETED: 'gray',
  CANCELLED: 'red',
};

export const FlightsTable = ({ flights }: FlightsTableProps) => {
  return (
    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" shadow="sm">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Flight UID</Th>
            <Th>Operator</Th>
            <Th>Route</Th>
            <Th>Departure</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {flights.map((flight) => (
            <Tr key={flight.id}>
              <Td>
                <Text fontWeight="semibold">{flight.uid}</Text>
                <Text fontSize="sm" color="gray.500">
                  {flight.aircraftRegistration} • {flight.aircraftType}
                </Text>
              </Td>
              <Td>{flight.operatorName}</Td>
              <Td>
                <Text fontWeight="medium">
                  {flight.departureAirport?.icaoCode ?? flight.departureAirportId} →{' '}
                  {flight.arrivalAirport?.icaoCode ?? flight.arrivalAirportId}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {flight.departureAirport?.city ?? ''}{' '}
                  {flight.departureAirport?.country ? `• ${flight.departureAirport.country}` : ''}
                </Text>
              </Td>
              <Td>
                {format(new Date(flight.scheduledDeparture), 'dd MMM yyyy HH:mm')}
              </Td>
              <Td>
                <Badge colorScheme={statusColor[flight.status]}>{flight.status}</Badge>
              </Td>
              <Td textAlign="right">
                <HStack as={Link} to={`/flights/${flight.id}`} spacing="1" color="brand.500">
                  <Text>View</Text>
                  <Icon as={FiExternalLink} />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

