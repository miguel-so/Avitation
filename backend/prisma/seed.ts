import { DocumentType, FlightStatus, PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/lib/crypto';

const prisma = new PrismaClient();

const roles = [
  { name: 'VictorAdmin', description: 'Platform administrators with full access' },
  { name: 'OperatorAdmin', description: 'Operator and handling company managers' },
  { name: 'Handler', description: 'Ground handlers operating QR and baggage workflows' },
  { name: 'AuthorityUser', description: 'Government and authority observers' },
];

const airports = [
  {
    id: 'LIPX',
    name: 'Verona Villafranca Airport',
    icaoCode: 'LIPX',
    iataCode: 'VRN',
    city: 'Verona',
    country: 'Italy',
    timezone: 'Europe/Rome',
  },
  {
    id: 'EGSS',
    name: 'London Stansted Airport',
    icaoCode: 'EGSS',
    iataCode: 'STN',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
  },
  {
    id: 'OMDB',
    name: 'Dubai International Airport',
    icaoCode: 'OMDB',
    iataCode: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    timezone: 'Asia/Dubai',
  },
];

const createDocumentTemplates = async () => {
  const generalDeclaration = await prisma.documentTemplate.upsert({
    where: {
      type_version: {
        type: DocumentType.GENERAL_DECLARATION,
        version: 'v1',
      },
    },
    update: {
      name: 'General Declaration v1',
      description: 'ICAO Annex 9 compliant general declaration template',
      storageKey: 'templates/general-declaration-v1.pdf',
      isActive: true,
    },
    create: {
      name: 'General Declaration v1',
      description: 'ICAO Annex 9 compliant general declaration template',
      type: DocumentType.GENERAL_DECLARATION,
      version: 'v1',
      storageKey: 'templates/general-declaration-v1.pdf',
      isActive: true,
    },
  });

  const passengerManifest = await prisma.documentTemplate.upsert({
    where: {
      type_version: {
        type: DocumentType.PASSENGER_MANIFEST,
        version: 'v1',
      },
    },
    update: {
      name: 'Passenger Manifest v1',
      storageKey: 'templates/passenger-manifest-v1.pdf',
      isActive: true,
    },
    create: {
      name: 'Passenger Manifest v1',
      description: 'Standard passenger manifest layout',
      type: DocumentType.PASSENGER_MANIFEST,
      version: 'v1',
      storageKey: 'templates/passenger-manifest-v1.pdf',
      isActive: true,
    },
  });

  return { generalDeclaration, passengerManifest };
};

const seedFlights = async () => {
  const veronaToLondon = await prisma.flight.upsert({
    where: { uid: 'VIC-2025-001' },
    update: {
      status: FlightStatus.ACTIVE,
    },
    create: {
      uid: 'VIC-2025-001',
      operatorName: 'Victor Aviation',
      aircraftType: 'Gulfstream G650',
      aircraftRegistration: 'VT-EXEC',
      mtow: 99000,
      purpose: 'Executive transport',
      departureAirportId: 'LIPX',
      arrivalAirportId: 'EGSS',
      scheduledDeparture: new Date('2025-12-01T08:00:00Z'),
      actualDeparture: new Date('2025-12-01T08:12:00Z'),
      scheduledArrival: new Date('2025-12-01T10:30:00Z'),
      status: FlightStatus.ACTIVE,
      turnaroundStatus: 'Arriving passengers processed',
      captainName: 'Alessandro Rossi',
      firstOfficerName: 'Maria Bianchi',
    },
  });

  const londonToDubai = await prisma.flight.upsert({
    where: { uid: 'VIC-2025-002' },
    update: {},
    create: {
      uid: 'VIC-2025-002',
      operatorName: 'Victor Aviation',
      aircraftType: 'Bombardier Global 7500',
      aircraftRegistration: 'VT-ELITE',
      mtow: 114850,
      purpose: 'Repositioning',
      departureAirportId: 'EGSS',
      arrivalAirportId: 'OMDB',
      scheduledDeparture: new Date('2025-12-03T06:00:00Z'),
      scheduledArrival: new Date('2025-12-03T14:30:00Z'),
      status: FlightStatus.PLANNED,
      captainName: 'James Smith',
      firstOfficerName: 'Elena Petrova',
    },
  });

  return { veronaToLondon, londonToDubai };
};

const seedPassengersAndCrew = async (flightId: string) => {
  await prisma.passenger.upsert({
    where: { uid: 'PASSENGER-JOHN-DOE' },
    update: {
      flightId,
      status: 'arrived',
    },
    create: {
      uid: 'PASSENGER-JOHN-DOE',
      flightId,
      fullName: 'Johnathan Doe',
      gender: 'M',
      dateOfBirth: new Date('1983-04-17'),
      nationality: 'United States',
      passportNumber: '123456789',
      passportCountry: 'United States',
      passportExpiry: new Date('2033-04-16'),
      status: 'arrived',
      seatNumber: '2A',
      baggageCount: 2,
      notes: 'Requires fast-track service',
    },
  });

  await prisma.passenger.upsert({
    where: { uid: 'PASSENGER-EMMA-LI' },
    update: {
      flightId,
      status: 'ready_for_boarding',
    },
    create: {
      uid: 'PASSENGER-EMMA-LI',
      flightId,
      fullName: 'Emma Li',
      gender: 'F',
      dateOfBirth: new Date('1990-09-09'),
      nationality: 'Singapore',
      passportNumber: 'S1234567G',
      passportCountry: 'Singapore',
      passportExpiry: new Date('2030-11-01'),
      status: 'ready_for_boarding',
      seatNumber: '3A',
      baggageCount: 1,
    },
  });

  await prisma.crewMember.upsert({
    where: { uid: 'CREW-ALESSANDRO-ROSSI' },
    update: { flightId },
    create: {
      uid: 'CREW-ALESSANDRO-ROSSI',
      flightId,
      fullName: 'Alessandro Rossi',
      rank: 'Captain',
      nationality: 'Italy',
      licenceNumber: 'ITA-CPT-9981',
      licenceExpiry: new Date('2028-05-20'),
      dutyType: 'operating',
    },
  });

  await prisma.crewMember.upsert({
    where: { uid: 'CREW-MARIA-BIANCHI' },
    update: { flightId },
    create: {
      uid: 'CREW-MARIA-BIANCHI',
      flightId,
      fullName: 'Maria Bianchi',
      rank: 'First Officer',
      nationality: 'Italy',
      licenceNumber: 'ITA-FO-8821',
      licenceExpiry: new Date('2027-10-12'),
      dutyType: 'operating',
    },
  });

  await prisma.baggageItem.upsert({
    where: { tagCode: 'BG-VIC-001' },
    update: {
      flightId,
      status: 'loaded',
      lastScannedAt: new Date(),
    },
    create: {
      tagCode: 'BG-VIC-001',
      flightId,
      weightKg: 18.4,
      pieces: 1,
      status: 'loaded',
      metadata: {
        lastLocation: 'LIPX Ramp 2',
      },
    },
  });

  await prisma.flight.update({
    where: { id: flightId },
    data: {
      passengerCount: await prisma.passenger.count({ where: { flightId } }),
      crewCount: await prisma.crewMember.count({ where: { flightId } }),
    },
  });
};

const seedDocuments = async (flightId: string, templateId: string) => {
  const storageKey = `documents/${flightId}/general-declaration-v1.pdf`;
  const existing = await prisma.document.findFirst({
    where: {
      flightId,
      type: DocumentType.GENERAL_DECLARATION,
      storageKey,
    },
  });

  if (!existing) {
    await prisma.document.create({
      data: {
        flightId,
        type: DocumentType.GENERAL_DECLARATION,
        status: 'GENERATED',
        storageKey,
        templateId,
        generatedAt: new Date(),
        metadata: {
          templateVersion: 'v1',
        },
      },
    });
  }
};

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { id: airport.id },
      update: {
        name: airport.name,
        icaoCode: airport.icaoCode,
        iataCode: airport.iataCode ?? null,
        city: airport.city,
        country: airport.country,
        timezone: airport.timezone,
      },
      create: airport,
    });
  }

  const victorAdminRole = await prisma.role.findUnique({ where: { name: 'VictorAdmin' } });
  const operatorRole = await prisma.role.findUnique({ where: { name: 'OperatorAdmin' } });

  if (!victorAdminRole || !operatorRole) {
    throw new Error('Required roles could not be initialised');
  }

  const adminPasswordHash = await hashPassword('ChangeMe123!');
  await prisma.user.upsert({
    where: { email: 'victor.admin@victorexecutive.com' },
    update: {
      passwordHash: adminPasswordHash,
      roleId: victorAdminRole.id,
      status: 'ACTIVE',
    },
    create: {
      email: 'victor.admin@victorexecutive.com',
      passwordHash: adminPasswordHash,
      roleId: victorAdminRole.id,
      status: 'ACTIVE',
    },
  });

  const operatorPasswordHash = await hashPassword('Operator123!');
  await prisma.user.upsert({
    where: { email: 'operator@victorexecutive.com' },
    update: {
      passwordHash: operatorPasswordHash,
      roleId: operatorRole.id,
      status: 'ACTIVE',
    },
    create: {
      email: 'operator@victorexecutive.com',
      passwordHash: operatorPasswordHash,
      roleId: operatorRole.id,
      status: 'ACTIVE',
    },
  });

  const templates = await createDocumentTemplates();
  const flights = await seedFlights();

  await seedPassengersAndCrew(flights.veronaToLondon.id);
  await seedDocuments(flights.veronaToLondon.id, templates.generalDeclaration.id);

  console.log('Seed data created successfully.');
  console.log('Admin credentials: victor.admin@victorexecutive.com / ChangeMe123!');
  console.log('Operator credentials: operator@victorexecutive.com / Operator123!');
}

main()
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


