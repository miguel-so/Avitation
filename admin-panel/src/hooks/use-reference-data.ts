"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import type {
  AirportsResponseItem,
  OperatorResponseItem,
  AircraftTypeResponseItem,
} from "@/types/api";

interface ReferenceDataState {
  airports: AirportsResponseItem[];
  operators: OperatorResponseItem[];
  aircraft: AircraftTypeResponseItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useReferenceData(): ReferenceDataState {
  const api = useApi();
  const [airports, setAirports] = useState<AirportsResponseItem[]>([]);
  const [operators, setOperators] = useState<OperatorResponseItem[]>([]);
  const [aircraft, setAircraft] = useState<AircraftTypeResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [airportRes, operatorRes, aircraftRes] = await Promise.all([
        api.get<{ data: AirportsResponseItem[] }>("/reference/airports"),
        api.get<{ data: OperatorResponseItem[] }>("/reference/operators"),
        api.get<{ data: AircraftTypeResponseItem[] }>("/reference/aircraft-types"),
      ]);
      setAirports(airportRes.data ?? []);
      setOperators(operatorRes.data ?? []);
      setAircraft(aircraftRes.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load reference data sources.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    airports,
    operators,
    aircraft,
    isLoading,
    error,
    refresh: load,
  };
}

