import type { ApiResponse } from '../types/api';
import type { CrewMember } from '../types/domain';
import { http } from './client';

export const getCrew = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<CrewMember[]>>(`/flights/${flightId}/crew`);
  return data.data;
};

