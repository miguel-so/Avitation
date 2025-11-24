import type { ApiResponse } from '../types/api';
import type { Passenger } from '../types/domain';
import { http } from './client';

export const getPassengers = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<Passenger[]>>(`/flights/${flightId}/passengers`);
  return data.data;
};

