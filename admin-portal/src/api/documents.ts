import type { ApiResponse } from '../types/api';
import type { Document } from '../types/domain';
import { http } from './client';

export const getFlightDocuments = async (flightId: string) => {
  const { data } = await http.get<ApiResponse<Document[]>>(`/flights/${flightId}/documents`);
  return data.data;
};

export const generateGeneralDeclaration = async (flightId: string) => {
  const { data } = await http.post<ApiResponse<Document>>(
    `/flights/${flightId}/general-declaration/generate`,
  );
  return data.data;
};

