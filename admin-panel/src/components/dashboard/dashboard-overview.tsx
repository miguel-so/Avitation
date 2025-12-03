"use client";

import { useMemo } from "react";
import { Title, Text, Badge } from "rizzui";
import { useApiData } from "@/hooks/use-api-data";
import type { Flight, FlightsResponse } from "@/types/api";
import Link from "next/link";
import { routes } from "@/config/routes";

const statusBadgeColor: Record<Flight["status"], string> = {
  PLANNED: "bg-blue-100 text-blue-700",
  READY: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export function DashboardOverview() {
  const { data, isLoading, error, refetch } = useApiData<FlightsResponse>(
    "/flights",
    { limit: 8 }
  );

  const flights = data?.data ?? [];

  const metrics = useMemo(() => {
    const totals = {
      planned: flights.filter((flight) => flight.status === "PLANNED").length,
      ready: flights.filter((flight) => flight.status === "READY").length,
      inProgress: flights.filter(
        (flight) => flight.status === "IN_PROGRESS"
      ).length,
      completed: flights.filter(
        (flight) => flight.status === "COMPLETED"
      ).length,
    };

    return [
      {
        title: "Scheduled flights",
        value: totals.planned,
        description: "Flights confirmed and awaiting OPS briefing.",
      },
      {
        title: "Ready for departure",
        value: totals.ready,
        description: "Aircraft, crew and passengers cleared to depart.",
      },
      {
        title: "Live turnarounds",
        value: totals.inProgress,
        description: "Ground crews coordinating in real time.",
      },
      {
        title: "Completed in last cycle",
        value: totals.completed,
        description: "Flights closed in the last 24 hours.",
      },
    ];
  }, [flights]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Title as="h1" className="text-2xl font-semibold text-gray-900">
          Mission Control
        </Title>
        <Text className="text-sm text-gray-500">
          Consolidated view of Victor operations across flights, passengers and
          authority touch points.
        </Text>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <Text className="text-sm font-medium text-gray-500">
              {metric.title}
            </Text>
            <Title as="p" className="mt-2 text-3xl font-semibold text-gray-900">
              {metric.value}
            </Title>
            <Text className="mt-3 text-sm text-gray-500">
              {metric.description}
            </Text>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <Title as="h2" className="text-lg font-semibold text-gray-900">
              Upcoming movements
            </Title>
            <Text className="text-sm text-gray-500">
              Flights within the next 48 hours that require coordination.
            </Text>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Text className="text-sm text-gray-500">
              Loading flight manifest…
            </Text>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Text className="font-medium text-red-600">
              Unable to load flights
            </Text>
            <Text className="max-w-sm text-sm text-red-500">
              {error}. Please verify backend connectivity and try again.
            </Text>
          </div>
        )}

        {!isLoading && !error && flights.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <Text className="text-sm text-gray-500">
              No scheduled movements found. Create a flight to get started.
            </Text>
          </div>
        )}

        {!isLoading && !error && flights.length > 0 && (
          <div className="divide-y divide-gray-100">
            {flights.map((flight) => (
              <Link
                key={flight.id}
                href={routes.flights.details(flight.id)}
                className="flex flex-col gap-2 px-6 py-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    {flight.operatorName}
                  </Text>
                  <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {flight.originAirportName} ({flight.originIata ?? "—"}) →
                    {flight.destinationAirportName} (
                    {flight.destinationIata ?? "—"})
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Departure {flight.scheduledDeparture ?? "TBC"}
                  </Text>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={statusBadgeColor[flight.status]}>
                    {flight.status.replace("_", " ")}
                  </Badge>
                  <Text className="text-xs font-medium text-gray-500">
                    Pax {flight.passengerCount} • Crew {flight.crewCount}
                  </Text>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

