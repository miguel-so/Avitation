"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Text, Title, Badge } from "rizzui";
import { routes } from "@/config/routes";
import { useApiData } from "@/hooks/use-api-data";
import type { Flight, FlightsResponse } from "@/types/api";
import { Protected } from "@/components/common/protected";
import { CreateFlightModal } from "@/components/flights/modals/create-flight-modal";

const statusOptions: Array<{ label: string; value: Flight["status"] }> = [
  { label: "Planned", value: "PLANNED" },
  { label: "Ready", value: "READY" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const statusStyles: Record<Flight["status"], string> = {
  PLANNED: "bg-blue-100 text-blue-700",
  READY: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

const turnaroundLabels: Record<Flight["turnaroundStatus"], string> = {
  NOT_STARTED: "Awaiting",
  IN_PROGRESS: "On apron",
  COMPLETE: "Closed",
};

export function FlightsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Flight["status"] | "">("");
  const [isCreateOpen, setCreateOpen] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit: 20,
      search: search || undefined,
      status: status || undefined,
    }),
    [page, search, status]
  );

  const { data, isLoading, error, refetch } = useApiData<FlightsResponse>(
    "/flights",
    params
  );

  const flights = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.limit))
    : 1;

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Flight registry
            </Title>
            <Text className="text-sm text-gray-500">
              Manage every flight synchronised from mobile operations and the
              Victor backend.
            </Text>
          </div>

          <Button size="lg" onClick={() => setCreateOpen(true)}>
            Create flight
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 md:max-w-md">
            <label className="text-xs font-medium uppercase text-gray-500">
              Search
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Operator, airport or flight number…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex w-full flex-col gap-2 md:max-w-xs">
            <label className="text-xs font-medium uppercase text-gray-500">
              Status
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as Flight["status"] | "");
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Operator
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Route
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Departure
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Pax / Crew
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Turnaround
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Text className="text-sm text-gray-500">
                        Loading latest flights…
                      </Text>
                    </td>
                  </tr>
                )}

                {error && !isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-md space-y-2">
                        <Text className="font-medium text-red-600">
                          Unable to load flights
                        </Text>
                        <Text className="text-sm text-red-500">{error}</Text>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !error && flights.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Text className="text-sm text-gray-500">
                        No flights found. Adjust filters or create a new record.
                      </Text>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  flights.map((flight) => (
                    <tr
                      key={flight.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={routes.flights.details(flight.id)}
                            className="text-sm font-semibold text-gray-900 hover:underline"
                          >
                            {flight.operatorName}
                          </Link>
                          <Text className="text-xs text-gray-500">
                            {flight.aircraftManufacturer} {flight.aircraftModel}{" "}
                            {flight.aircraftRegistration
                              ? `• ${flight.aircraftRegistration}`
                              : ""}
                          </Text>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Text className="text-sm text-gray-800">
                          {flight.originAirportName} ({flight.originIata ?? "—"})
                        </Text>
                        <Text className="text-sm text-gray-400">→</Text>
                        <Text className="text-sm text-gray-800">
                          {flight.destinationAirportName} (
                          {flight.destinationIata ?? "—"})
                        </Text>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {flight.scheduledDeparture ?? "TBC"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {flight.passengerCount} / {flight.crewCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {turnaroundLabels[flight.turnaroundStatus]}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Badge className={statusStyles[flight.status]}>
                          {flight.status.replace("_", " ")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
              <span>
                Showing {(page - 1) * pagination.limit + 1}-
                {Math.min(page * pagination.limit, pagination.total)} of{" "}
                {pagination.total}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <CreateFlightModal
          isOpen={isCreateOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            refetch();
          }}
        />
      </div>
    </Protected>
  );
}

