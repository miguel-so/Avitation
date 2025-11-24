import type { ApiResponse } from '../types/api';
import type { BaggageItem } from '../types/domain';
import { http } from './client';

export const getBaggage = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<BaggageItem[]>>(`/flights/${flightId}/baggage`);
  return data.data;
};


