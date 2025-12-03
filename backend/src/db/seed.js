import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { getPool } from "./pool.js";
import { logger } from "../logger.js";

const insertIgnoreDuplicate = async (pool, sql, params) => {
  try {
    await pool.query(sql, params);
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return;
    }
    throw error;
  }
};

const fetchSingleValue = async (pool, sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows?.[0] ?? null;
};

export const seedDatabase = async () => {
  const pool = getPool();

  // Roles
  const roles = [
    { name: "VictorAdmin", description: "Victor platform administrator" },
    { name: "OperatorAdmin", description: "Operator/airline administrator" },
    { name: "Handler", description: "Ground handler with operational access" },
    { name: "AuthorityUser", description: "Government authority portal user" },
  ];

  for (const role of roles) {
    await insertIgnoreDuplicate(
      pool,
      "INSERT INTO roles (name, description) VALUES (?, ?)",
      [role.name, role.description]
    );
  }

  const getRoleId = async (name) => {
    const role = await fetchSingleValue(
      pool,
      "SELECT id FROM roles WHERE name = ? LIMIT 1",
      [name]
    );
    return role?.id;
  };

  // Users
  const adminPassword = await bcrypt.hash("VictorAdmin!2025", 10);
  const operatorPassword = await bcrypt.hash("Operator!2025", 10);

  const adminId = randomUUID();
  await insertIgnoreDuplicate(
    pool,
    `INSERT INTO users (id, email, password_hash, full_name, role_id, status)
     VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      adminId,
      "admin@victorexecutive.com",
      adminPassword,
      "Victor Platform Admin",
      await getRoleId("VictorAdmin"),
    ]
  );

  const operatorAdminId = randomUUID();
  await insertIgnoreDuplicate(
    pool,
    `INSERT INTO users (id, email, password_hash, full_name, role_id, status)
     VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      operatorAdminId,
      "ops@victorexecutive.com",
      operatorPassword,
      "Operator Control",
      await getRoleId("OperatorAdmin"),
    ]
  );

  // Airports
  const airports = [
    {
      iata: "LCY",
      icao: "EGLC",
      name: "London City Airport",
      city: "London",
      country: "United Kingdom",
      timezone: "Europe/London",
      lat: 51.5053,
      lon: 0.0553,
    },
    {
      iata: "NCE",
      icao: "LFMN",
      name: "Nice Côte d'Azur Airport",
      city: "Nice",
      country: "France",
      timezone: "Europe/Paris",
      lat: 43.6653,
      lon: 7.2150,
    },
    {
      iata: "JFK",
      icao: "KJFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "United States",
      timezone: "America/New_York",
      lat: 40.6413,
      lon: -73.7781,
    },
  ];

  const airportIds = {};

  for (const airport of airports) {
    const id = randomUUID();
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO airports
        (id, iata_code, icao_code, name, city, country, timezone, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        airport.iata,
        airport.icao,
        airport.name,
        airport.city,
        airport.country,
        airport.timezone,
        airport.lat,
        airport.lon,
      ]
    );

    const existing = await fetchSingleValue(
      pool,
      "SELECT id FROM airports WHERE iata_code = ? LIMIT 1",
      [airport.iata]
    );
    airportIds[airport.iata] = existing?.id ?? id;
  }

  // Aircraft types
  const aircraftTypes = [
    {
      manufacturer: "Embraer",
      model: "Phenom 300E",
      icao: "E55P",
      iata: "EMB",
      mtow: 7950,
      crew: 2,
      pax: 8,
    },
    {
      manufacturer: "Bombardier",
      model: "Challenger 350",
      icao: "CL35",
      iata: "C35",
      mtow: 18180,
      crew: 2,
      pax: 10,
    },
  ];

  const aircraftTypeIds = {};

  for (const aircraft of aircraftTypes) {
    const id = randomUUID();
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO aircraft_types
        (id, manufacturer, model, icao_code, iata_code, mtow_kg, typical_crew, typical_pax)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        aircraft.manufacturer,
        aircraft.model,
        aircraft.icao,
        aircraft.iata,
        aircraft.mtow,
        aircraft.crew,
        aircraft.pax,
      ]
    );

    const existing = await fetchSingleValue(
      pool,
      "SELECT id FROM aircraft_types WHERE icao_code = ? LIMIT 1",
      [aircraft.icao]
    );
    aircraftTypeIds[aircraft.icao] = existing?.id ?? id;
  }

  // Operators
  const operators = [
    {
      name: "Victor Executive",
      address: "1 Charter Way, London, UK",
      contactName: "Emma Foster",
      contactEmail: "emma.foster@victorexecutive.com",
      contactPhone: "+44 20 1234 5678",
      billingEmail: "finance@victorexecutive.com",
      notes: "Primary Victor operations control.",
    },
    {
      name: "Alpine Sky Services",
      address: "2 Rue de l'Aviation, Nice, France",
      contactName: "Julien Martin",
      contactEmail: "julien@alpinesky.eu",
      contactPhone: "+33 4 93 12 34 56",
      billingEmail: "accounting@alpinesky.eu",
      notes: "Regional partner for Mediterranean operations.",
    },
  ];

  const operatorIds = {};

  for (const operator of operators) {
    const id = randomUUID();
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO operators
        (id, name, address, contact_name, contact_email, contact_phone, billing_email, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        operator.name,
        operator.address,
        operator.contactName,
        operator.contactEmail,
        operator.contactPhone,
        operator.billingEmail,
        operator.notes,
      ]
    );

    const existing = await fetchSingleValue(
      pool,
      "SELECT id FROM operators WHERE name = ? LIMIT 1",
      [operator.name]
    );
    operatorIds[operator.name] = existing?.id ?? id;
  }

  // Flights
  const flights = [
    {
      flightUid: randomUUID(),
      operator: operatorIds["Victor Executive"],
      aircraft: aircraftTypeIds["E55P"],
      registration: "G-VCTR",
      mtow: 7900,
      origin: airportIds["LCY"],
      destination: airportIds["NCE"],
      departureDate: "2025-01-14",
      scheduledDeparture: "2025-01-14 07:30:00",
      scheduledArrival: "2025-01-14 09:45:00",
      captain: "James Carter",
      firstOfficer: "Sophie White",
      passengerCount: 5,
      crewCount: 3,
      status: "PLANNED",
      turnaround: "NOT_STARTED",
      purpose: "PRIVATE",
      remarks: "VIP passenger requires expedited immigration on arrival.",
      createdBy: adminId,
    },
    {
      flightUid: randomUUID(),
      operator: operatorIds["Alpine Sky Services"],
      aircraft: aircraftTypeIds["CL35"],
      registration: "F-ALPS",
      mtow: 18100,
      origin: airportIds["NCE"],
      destination: airportIds["JFK"],
      departureDate: "2025-01-16",
      scheduledDeparture: "2025-01-16 10:00:00",
      scheduledArrival: "2025-01-16 18:00:00",
      captain: "Luc Moreau",
      firstOfficer: "Anna Keller",
      passengerCount: 8,
      crewCount: 4,
      status: "READY",
      turnaround: "IN_PROGRESS",
      purpose: "COMMERCIAL",
      remarks: "Authority briefing scheduled 2 hours prior to departure.",
      createdBy: operatorAdminId,
    },
  ];

  const flightIds = {};

  for (const flight of flights) {
    const id = randomUUID();
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO flights
        (id, flight_number, flight_uid, operator_id, aircraft_type_id, aircraft_registration, mtow_kg,
         origin_airport_id, destination_airport_id, departure_date, scheduled_departure, scheduled_arrival,
         captain_name, first_officer_name, passenger_count, crew_count, status, turnaround_status, purpose,
         remarks, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        null,
        flight.flightUid,
        flight.operator,
        flight.aircraft,
        flight.registration,
        flight.mtow,
        flight.origin,
        flight.destination,
        flight.departureDate,
        flight.scheduledDeparture,
        flight.scheduledArrival,
        flight.captain,
        flight.firstOfficer,
        flight.passengerCount,
        flight.crewCount,
        flight.status,
        flight.turnaround,
        flight.purpose,
        flight.remarks,
        flight.createdBy,
      ]
    );

    const existing = await fetchSingleValue(
      pool,
      "SELECT id FROM flights WHERE flight_uid = ? LIMIT 1",
      [flight.flightUid]
    );
    flightIds[flight.flightUid] = existing?.id ?? id;
  }

  // Passengers
  const passengers = [
    {
      flightUid: flights[0].flightUid,
      firstName: "Charlotte",
      lastName: "King",
      gender: "FEMALE",
      dob: "1986-04-05",
      nationality: "United Kingdom",
      passportNumber: "123456789",
      passportCountry: "United Kingdom",
      passportExpiry: "2032-07-01",
      status: "SCHEDULED",
      seat: "2A",
      baggage: 2,
      notes: "Requires meet-and-greet at LCY.",
    },
    {
      flightUid: flights[0].flightUid,
      firstName: "Oliver",
      lastName: "Grant",
      gender: "MALE",
      dob: "1978-11-22",
      nationality: "United Kingdom",
      passportNumber: "987654321",
      passportCountry: "United Kingdom",
      passportExpiry: "2030-02-12",
      status: "SCHEDULED",
      seat: "2B",
      baggage: 1,
      notes: null,
    },
    {
      flightUid: flights[1].flightUid,
      firstName: "Amelia",
      lastName: "Boyer",
      gender: "FEMALE",
      dob: "1990-09-18",
      nationality: "France",
      passportNumber: "20AB34567",
      passportCountry: "France",
      passportExpiry: "2031-09-17",
      status: "SCHEDULED",
      seat: "3C",
      baggage: 3,
      notes: "Wheelchair assistance requested at NCE.",
    },
  ];

  const passengerIds = {};

  for (const passenger of passengers) {
    const flightId = flightIds[passenger.flightUid];
    if (!flightId) continue;

    const id = randomUUID();
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO passengers
        (id, flight_id, passenger_uid, first_name, last_name, gender, date_of_birth,
         nationality, passport_number, passport_country, passport_expiry,
         arrival_status, seat_number, baggage_count, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        flightId,
        randomUUID(),
        passenger.firstName,
        passenger.lastName,
        passenger.gender,
        passenger.dob,
        passenger.nationality,
        passenger.passportNumber,
        passenger.passportCountry,
        passenger.passportExpiry,
        passenger.status,
        passenger.seat,
        passenger.baggage,
        passenger.notes,
      ]
    );

    const existing = await fetchSingleValue(
      pool,
      `SELECT id FROM passengers
       WHERE first_name = ? AND last_name = ? AND flight_id = ?
       LIMIT 1`,
      [passenger.firstName, passenger.lastName, flightId]
    );
    passengerIds[`${passenger.firstName}-${passenger.lastName}`] =
      existing?.id ?? id;
  }

  // Crew
  const crewMembers = [
    {
      flightUid: flights[0].flightUid,
      firstName: "James",
      lastName: "Carter",
      position: "Captain",
      duty: "OPERATING",
      licenseNumber: "LCY-ATPL-4455",
      licenseExpiry: "2027-06-30",
    },
    {
      flightUid: flights[0].flightUid,
      firstName: "Sophie",
      lastName: "White",
      position: "First Officer",
      duty: "OPERATING",
      licenseNumber: "LCY-CPL-5588",
      licenseExpiry: "2026-09-15",
    },
    {
      flightUid: flights[1].flightUid,
      firstName: "Luc",
      lastName: "Moreau",
      position: "Captain",
      duty: "OPERATING",
      licenseNumber: "LFMN-ATPL-9981",
      licenseExpiry: "2028-01-04",
    },
  ];

  for (const crew of crewMembers) {
    const flightId = flightIds[crew.flightUid];
    if (!flightId) continue;

    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO crew_members
        (id, flight_id, crew_uid, first_name, last_name, position, duty_type,
         license_number, license_expiry, arrival_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')`,
      [
        randomUUID(),
        flightId,
        randomUUID(),
        crew.firstName,
        crew.lastName,
        crew.position,
        crew.duty,
        crew.licenseNumber,
        crew.licenseExpiry,
      ]
    );
  }

  // Baggage
  const baggageItems = [
    {
      flightUid: flights[0].flightUid,
      passengerKey: "Charlotte-King",
      tag: "VIC-LCY-0001",
      weight: 18.4,
      pieces: 1,
      status: "CHECKED_IN",
    },
    {
      flightUid: flights[0].flightUid,
      passengerKey: "Oliver-Grant",
      tag: "VIC-LCY-0002",
      weight: 12.1,
      pieces: 1,
      status: "CREATED",
    },
    {
      flightUid: flights[1].flightUid,
      passengerKey: "Amelia-Boyer",
      tag: "ALP-NCE-0001",
      weight: 23.6,
      pieces: 2,
      status: "CREATED",
    },
  ];

  for (const baggage of baggageItems) {
    const flightId = flightIds[baggage.flightUid];
    if (!flightId) continue;
    const passengerId = passengerIds[baggage.passengerKey] ?? null;

    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO baggage_items
        (id, flight_id, passenger_id, tag_code, weight_kg, pieces, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        flightId,
        passengerId,
        baggage.tag,
        baggage.weight,
        baggage.pieces,
        baggage.status,
      ]
    );
  }

  // Document templates
  const templates = [
    {
      name: "ICAO General Declaration",
      code: "GD-ICAO-1",
      category: "GENERAL_DECLARATION",
      version: "1.0",
      description:
        "Standard ICAO Annex 9 compliant General Declaration template.",
      template: {
        title: "General Declaration",
        sections: [
          "Flight Information",
          "Crew List",
          "Passenger Summary",
          "Customs and Immigration",
        ],
      },
    },
    {
      name: "Passenger Manifest",
      code: "PM-STD-1",
      category: "PASSENGER_MANIFEST",
      version: "1.0",
      description: "Passenger manifest for authority sharing.",
      template: {
        columns: [
          "Full Name",
          "Nationality",
          "Passport Number",
          "Seat",
          "Status",
        ],
      },
    },
  ];

  for (const template of templates) {
    await insertIgnoreDuplicate(
      pool,
      `INSERT INTO document_templates
        (id, name, code, category, version, description, template_json)
       VALUES (?, ?, ?, ?, ?, ?, CAST(? AS JSON))`,
      [
        randomUUID(),
        template.name,
        template.code,
        template.category,
        template.version,
        template.description,
        JSON.stringify(template.template),
      ]
    );
  }

  logger.info("Database seed routine completed");
};

