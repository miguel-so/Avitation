import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';

export const SettingsLanding = () => {
  return (
    <Stack spacing="6">
      <Heading size="lg">Platform Configuration</Heading>
      <Text color="gray.600">
        Victor Admin centralises the master data used by the operational mobile app and the public
        portal. Use the configuration sections below to manage airports, templates, and user access.
      </Text>

      <Accordion allowMultiple bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100">
        <AccordionItem border="none">
          <AccordionButton px="6" py="4">
            <Box flex="1" textAlign="left">
              <Heading size="sm">Airport registry</Heading>
              <Text fontSize="sm" color="gray.500">
                Maintain the canonical list of airports, IATA/ICAO codes and timezones.
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="6" pb="6">
            <Text color="gray.600" mb="4">
              The backend exposes `POST /api/airports` and `PUT /api/airports/:id` endpoints (to be
              implemented) that the mobile app consumes during synchronisation. Each modification is
              versioned and propagated to clients on next sync.
            </Text>
            <Button colorScheme="brand" isDisabled>
              Coming soon — Manage airports
            </Button>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton px="6" py="4">
            <Box flex="1" textAlign="left">
              <Heading size="sm">Template management</Heading>
              <Text fontSize="sm" color="gray.500">
                Upload and version PDF templates used for General Declaration and manifests.
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="6" pb="6">
            <Text color="gray.600" mb="4">
              Templates live in secure storage. Updating a template immediately affects subsequent
              document generations while preserving historical documents. Integration with S3 or any
              S3-compatible service is supported by the backend provider layer.
            </Text>
            <Button colorScheme="brand" isDisabled>
              Coming soon — Upload template
            </Button>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem border="none">
          <AccordionButton px="6" py="4">
            <Box flex="1" textAlign="left">
              <Heading size="sm">User &amp; role governance</Heading>
              <Text fontSize="sm" color="gray.500">
                Control VictorAdmin, OperatorAdmin, Handler and Authority accounts.
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="6" pb="6">
            <Text color="gray.600" mb="4">
              Role-based access control is enforced at the API layer. This section will surface user
              provisioning workflows, invitation emails and access logs.
            </Text>
            <Button colorScheme="brand" isDisabled>
              Coming soon — Manage users
            </Button>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};


