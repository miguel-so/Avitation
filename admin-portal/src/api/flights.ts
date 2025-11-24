import type { ApiResponse, PaginatedApiResponse } from '../types/api';
import type { Flight, FlightDetail } from '../types/domain';
import { http } from './client';

export interface FlightFilters {
  page?: number;
  pageSize?: number;
  operator?: string;
  airport?: string;
  status?: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export const getFlights = async (filters: FlightFilters = {}) => {
  const { data } = await http.get<PaginatedApiResponse<Flight>>('/flights', {
    params: filters,
  });

  return data;
};

export const getFlightById = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<FlightDetail>>(`/flights/${flightId}`);
  return data.data;
};

