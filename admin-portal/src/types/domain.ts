export type UserRole = 'VictorAdmin' | 'OperatorAdmin' | 'Handler' | 'AuthorityUser';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

export type FlightStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface AirportSummary {
  id: string;
  name: string;
  city: string;
  country: string;
  icaoCode: string;
  iataCode?: string | null;
}

export interface Flight {
  id: string;
  uid: string;
  operatorName: string;
  aircraftType: string;
  aircraftRegistration: string;
  departureAirportId: string;
  arrivalAirportId: string;
  departureAirport?: AirportSummary | null;
  arrivalAirport?: AirportSummary | null;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string | null;
  actualArrival?: string | null;
  status: FlightStatus;
  turnaroundStatus?: string | null;
}

export interface Passenger {
  id: string;
  fullName: string;
  gender?: string | null;
  nationality?: string | null;
  status?: string | null;
  seatNumber?: string | null;
  baggageCount?: number;
  notes?: string | null;
}

export interface CrewMember {
  id: string;
  fullName: string;
  rank?: string | null;
  dutyType?: string | null;
  licenceNumber?: string | null;
  licenceExpiry?: string | null;
  notes?: string | null;
}

export type DocumentType =
  | 'GENERAL_DECLARATION'
  | 'PASSENGER_MANIFEST'
  | 'CREW_LIST'
  | 'BAGGAGE_REPORT';

export type DocumentStatus = 'PENDING' | 'GENERATED' | 'SENT' | 'ARCHIVED';

export interface Document {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  storageKey: string;
  generatedAt?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface BaggageItem {
  id: string;
  tagCode: string;
  weightKg?: number | null;
  pieces: number;
  status: string;
  lastScannedAt?: string | null;
  passengerId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface FlightDetail extends Flight {
  passengers: Passenger[];
  crew: CrewMember[];
  documents: Document[];
  baggageItems: BaggageItem[];
}


