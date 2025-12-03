export interface Flight {
  id: string;
  flightUid: string;
  flightNumber: string | null;
  operatorId: string;
  operatorName: string;
  aircraftTypeId: string;
  aircraftModel: string;
  aircraftManufacturer: string;
  aircraftRegistration: string | null;
  mtowKg: number | null;
  originAirportId: string;
  originAirportName: string;
  originIata: string | null;
  destinationAirportId: string;
  destinationAirportName: string;
  destinationIata: string | null;
  departureDate: string;
  scheduledDeparture: string | null;
  actualDeparture: string | null;
  scheduledArrival: string | null;
  actualArrival: string | null;
  captainName: string | null;
  firstOfficerName: string | null;
  passengerCount: number;
  crewCount: number;
  status: "PLANNED" | "READY" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  turnaroundStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  purpose: "COMMERCIAL" | "PRIVATE" | "CARGO" | "OTHER";
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Passenger {
  id: string;
  passengerUid: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  passportCountry: string | null;
  passportExpiry: string | null;
  visaNumber: string | null;
  email: string | null;
  phone: string | null;
  arrivalStatus:
    | "SCHEDULED"
    | "ARRIVED"
    | "READY_FOR_BOARDING"
    | "ON_BOARD"
    | "OFFLOADED";
  seatNumber: string | null;
  baggageCount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrewMember {
  id: string;
  crewUid: string;
  firstName: string;
  lastName: string;
  nationality: string | null;
  position: string | null;
  dutyType: "OPERATING" | "DEADHEADING" | "STANDBY";
  licenseNumber: string | null;
  licenseExpiry: string | null;
  arrivalStatus: "SCHEDULED" | "ARRIVED" | "ON_BOARD";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaggageItem {
  id: string;
  flightId: string;
  passengerId: string | null;
  passengerFirstName: string | null;
  passengerLastName: string | null;
  tagCode: string;
  weightKg: number | null;
  pieces: number;
  status: "CREATED" | "CHECKED_IN" | "LOADED" | "UNLOADED" | "MISSING";
  lastScannedAt: string | null;
  lastScannedLocation: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  flightId: string;
  templateId: string | null;
  type:
    | "GENERAL_DECLARATION"
    | "PASSENGER_MANIFEST"
    | "CREW_LIST"
    | "BAGGAGE_REPORT"
    | "OTHER";
  storagePath: string | null;
  storageUrl: string | null;
  metadata: Record<string, unknown> | null;
  signatureRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorityNotification {
  id: string;
  flightId: string;
  authorityType: string;
  destination: string | null;
  documentId: string | null;
  status: "PENDING" | "SENT" | "FAILED";
  responseMessage: string | null;
  sentAt: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AirportsResponseItem {
  id: string;
  iataCode: string | null;
  icaoCode: string | null;
  name: string;
  city: string | null;
  country: string | null;
  timezone: string | null;
}

export interface OperatorResponseItem {
  id: string;
  name: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  billingEmail: string | null;
  notes: string | null;
}

export interface AircraftTypeResponseItem {
  id: string;
  manufacturer: string;
  model: string;
  icaoCode: string | null;
  iataCode: string | null;
  mtowKg: number | null;
  typicalCrew: number | null;
  typicalPax: number | null;
}

export interface VictorUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: "ACTIVE" | "DISABLED" | "INVITE_PENDING";
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlightsResponse {
  data: Flight[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface FlightDetailResponse {
  flight: Flight;
  passengers: Passenger[];
  crew: CrewMember[];
  baggage: BaggageItem[];
  documents: DocumentRecord[];
  notifications: AuthorityNotification[];
}

