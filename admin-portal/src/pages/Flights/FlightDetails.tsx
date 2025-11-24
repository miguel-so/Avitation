import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FiDownload, FiRefreshCcw } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import { generateGeneralDeclaration, getFlightDocuments } from '../../api/documents';
import { getFlightById } from '../../api/flights';
import type { Document, FlightDetail } from '../../types/domain';
import { useApiError } from '../../hooks/useApiError';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(new Date(value), 'dd MMM yyyy HH:mm');
  } catch {
    return value;
  }
};

const statusColor: Record<FlightDetail['status'], string> = {
  PLANNED: 'blue',
  ACTIVE: 'green',
  COMPLETED: 'gray',
  CANCELLED: 'red',
};

const DocumentsSection = ({
  documents,
  onGenerate,
  isGenerating,
}: {
  documents: Document[];
  onGenerate: () => void;
  isGenerating: boolean;
}) => {
  return (
    <Stack spacing="4">
      <Flex justify="space-between" align="center">
        <Heading size="md">Documents</Heading>
        <Button
          leftIcon={<FiDownload />}
          colorScheme="brand"
          onClick={onGenerate}
          isLoading={isGenerating}
        >
          Generate General Declaration
        </Button>
      </Flex>
      <Stack spacing="3">
        {documents.length === 0 ? (
          <Box
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
            p="6"
            textAlign="center"
          >
            <Heading size="sm" mb="1">
              No documents yet
            </Heading>
            <Text color="gray.600">
              Generate a General Declaration to kick off the document pipeline for this flight.
            </Text>
          </Box>
        ) : (
          documents.map((document) => (
            <Box
              key={document.id}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="gray.100"
              bg="white"
              p="4"
            >
              <HStack justify="space-between" align="center">
                <Stack spacing="1">
                  <Text fontWeight="semibold">{document.type.replace('_', ' ')}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Storage key: {document.storageKey}
                  </Text>
                </Stack>
                <Stack align="flex-end" spacing="1">
                  <Tag colorScheme={document.status === 'GENERATED' ? 'green' : 'gray'}>
                    {document.status}
                  </Tag>
                  <Text fontSize="sm" color="gray.500">
                    Generated {formatDateTime(document.generatedAt)}
                  </Text>
                </Stack>
              </HStack>
            </Box>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export const FlightDetails = () => {
  const { flightId = '' } = useParams();
  const toast = useToast();
  const queryClient = useQueryClient();
  const handleError = useApiError();

  const flightQuery = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => getFlightById(flightId),
    enabled: Boolean(flightId),
    onError: (error) => {
      handleError(error, 'Unable to load flight detail.');
    },
  });

  const documentsQuery = useQuery({
    queryKey: ['flight', flightId, 'documents'],
    queryFn: () => getFlightDocuments(flightId),
    enabled: Boolean(flightId),
    onError: (error) => {
      handleError(error, 'Unable to load documents.');
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => generateGeneralDeclaration(flightId),
    onSuccess: () => {
      toast({
        title: 'General Declaration generated',
        description: 'The document metadata is now available for download and notifications.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      void queryClient.invalidateQueries({ queryKey: ['flight', flightId, 'documents'] });
      void queryClient.invalidateQueries({ queryKey: ['flight', flightId] });
    },
    onError: (error) => {
      handleError(error, 'Failed to generate the General Declaration.');
    },
  });

  if (flightQuery.isLoading) {
    return (
      <Flex align="center" justify="center" h="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!flightQuery.data) {
    return (
      <Box
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
        p="10"
        textAlign="center"
      >
        <Heading size="md" mb="2">
          Flight not found
        </Heading>
        <Text color="gray.600">Return to the flight dashboard and try again.</Text>
      </Box>
    );
  }

  const flight = flightQuery.data;

  return (
    <Stack spacing="6">
      <Flex align={{ base: 'flex-start', md: 'center' }} justify="space-between" wrap="wrap" gap="4">
        <Stack spacing="1">
          <Heading size="lg">Flight {flight.uid}</Heading>
          <Text color="gray.600">
            {flight.departureAirport?.icaoCode ?? flight.departureAirportId} →{' '}
            {flight.arrivalAirport?.icaoCode ?? flight.arrivalAirportId}
          </Text>
        </Stack>
        <Badge colorScheme={statusColor[flight.status]} borderRadius="md" px="3" py="1">
          {flight.status}
        </Badge>
      </Flex>

      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap="4"
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
        p="6"
        shadow="sm"
      >
        <GridItem>
          <Text fontSize="sm" color="gray.500">
            Operator
          </Text>
          <Text fontWeight="semibold">{flight.operatorName}</Text>
          <Text fontSize="sm" color="gray.500">
            {flight.aircraftRegistration} • {flight.aircraftType}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" color="gray.500">
            Scheduled departure
          </Text>
          <Text fontWeight="semibold">{formatDateTime(flight.scheduledDeparture)}</Text>
          <Text fontSize="sm" color="gray.500">
            Actual: {formatDateTime(flight.actualDeparture)}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" color="gray.500">
            Scheduled arrival
          </Text>
          <Text fontWeight="semibold">{formatDateTime(flight.scheduledArrival)}</Text>
          <Text fontSize="sm" color="gray.500">
            Actual: {formatDateTime(flight.actualArrival)}
          </Text>
        </GridItem>
      </Grid>

      <Tabs colorScheme="brand" isFitted>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Passengers</Tab>
          <Tab>Crew</Tab>
          <Tab>Documents</Tab>
          <Tab>Baggage</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <Box borderWidth="1px" borderRadius="lg" borderColor="gray.100" p="4" bg="white">
                <Heading size="sm" mb="2">
                  Operational status
                </Heading>
                <Stack spacing="1.5">
                  <Text fontSize="sm" color="gray.500">
                    Turnaround
                  </Text>
                  <Text fontWeight="medium">{flight.turnaroundStatus ?? 'Not set'}</Text>
                  <Divider />
                  <Text fontSize="sm" color="gray.500">
                    Passenger count
                  </Text>
                  <Text fontWeight="medium">{flight.passengers.length}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Crew count
                  </Text>
                  <Text fontWeight="medium">{flight.crew.length}</Text>
                </Stack>
              </Box>
              <Box borderWidth="1px" borderRadius="lg" borderColor="gray.100" p="4" bg="white">
                <Heading size="sm" mb="2">
                  QR status
                </Heading>
                <Text color="gray.600">
                  Generate QR passes for passengers and crew from the mobile app; they will sync here
                  automatically once generated via the backend.
                </Text>
              </Box>
            </SimpleGrid>
          </TabPanel>
          <TabPanel>
            <Stack spacing="3">
              {flight.passengers.length === 0 ? (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  p="6"
                  textAlign="center"
                >
                  <Heading size="sm" mb="1">
                    No passengers yet
                  </Heading>
                  <Text color="gray.600">
                    Add passengers from the mobile app through passport scanning or manual entry.
                  </Text>
                </Box>
              ) : (
                flight.passengers.map((passenger) => (
                  <Box
                    key={passenger.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.100"
                    bg="white"
                    p="4"
                  >
                    <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="4">
                      <Stack spacing="1">
                        <Text fontWeight="semibold">{passenger.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Seat {passenger.seatNumber ?? 'TBD'} • {passenger.nationality ?? 'Nationality TBD'}
                        </Text>
                      </Stack>
                      <Stack align="flex-end" spacing="1">
                        <Tag colorScheme={passenger.status ? 'green' : 'gray'}>
                          {passenger.status ?? 'Pending'}
                        </Tag>
                        <Text fontSize="xs" color="gray.500">
                          Baggage pieces: {passenger.baggageCount ?? 0}
                        </Text>
                      </Stack>
                    </Flex>
                    {passenger.notes && (
                      <Text mt="3" fontSize="sm" color="gray.600">
                        Notes: {passenger.notes}
                      </Text>
                    )}
                  </Box>
                ))
              )}
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack spacing="3">
              {flight.crew.length === 0 ? (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  p="6"
                  textAlign="center"
                >
                  <Heading size="sm" mb="1">
                    No crew synced yet
                  </Heading>
                  <Text color="gray.600">
                    The mobile app is responsible for feeding crew manifest data to the backend.
                  </Text>
                </Box>
              ) : (
                flight.crew.map((crewMember) => (
                  <Box
                    key={crewMember.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.100"
                    bg="white"
                    p="4"
                  >
                    <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="4">
                      <Stack spacing="1">
                        <Text fontWeight="semibold">{crewMember.fullName}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {crewMember.rank ?? 'Rank TBD'} • {crewMember.dutyType ?? 'Duty TBD'}
                        </Text>
                      </Stack>
                      <Stack align="flex-end" spacing="1">
                        <Text fontSize="xs" color="gray.500">
                          Licence: {crewMember.licenceNumber ?? '—'}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Expiry: {crewMember.licenceExpiry ?? '—'}
                        </Text>
                      </Stack>
                    </Flex>
                    {crewMember.notes && (
                      <Text mt="3" fontSize="sm" color="gray.600">
                        Notes: {crewMember.notes}
                      </Text>
                    )}
                  </Box>
                ))
              )}
            </Stack>
          </TabPanel>
          <TabPanel>
            <DocumentsSection
              documents={documentsQuery.data ?? []}
              onGenerate={() => generateMutation.mutate()}
              isGenerating={generateMutation.isLoading}
            />
          </TabPanel>
          <TabPanel>
            <Stack spacing="3">
              {flight.baggageItems.length === 0 ? (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  p="6"
                  textAlign="center"
                >
                  <Heading size="sm" mb="1">
                    Baggage tracking pending
                  </Heading>
                  <Text color="gray.600">
                    Generate baggage tags and scan them via the mobile app to populate this view.
                  </Text>
                </Box>
              ) : (
                flight.baggageItems.map((item) => (
                  <Box
                    key={item.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.100"
                    bg="white"
                    p="4"
                  >
                    <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap="4">
                      <Stack spacing="1">
                        <Text fontWeight="semibold">Tag {item.tagCode}</Text>
                        <Text fontSize="sm" color="gray.500">
                          Pieces: {item.pieces} • Weight: {item.weightKg ?? '—'} kg
                        </Text>
                      </Stack>
                      <Stack align="flex-end" spacing="1">
                        <Tag>{item.status}</Tag>
                        <HStack spacing="1" color="gray.500" fontSize="xs">
                          <Icon as={FiRefreshCcw} />
                          <Text>{formatDateTime(item.lastScannedAt)}</Text>
                        </HStack>
                      </Stack>
                    </HStack>
                  </Box>
                ))
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};


