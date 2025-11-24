import type { ApiResponse } from '../types/api';
import type { Document, Flight } from '../types/domain';
import { http } from './client';

export const getAuthorityFlights = async () => {
  const { data } = await http.get<ApiResponse<Flight[]>>('/authority/flights');
  return data.data;
};

export const getAuthorityGeneralDeclaration = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<Document>>(
    `/authority/flights/${flightId}/general-declaration`,
  );
  return data.data;
};

