"use client";

import { Button, Text, Title, Badge } from "rizzui";
import Link from "next/link";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";
import type { FlightsResponse } from "@/types/api";
import { routes } from "@/config/routes";

const statusToColor: Record<string, string> = {
  PLANNED: "bg-blue-100 text-blue-700",
  READY: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export function AuthorityConsole() {
  const { data, isLoading, error, refetch } = useApiData<FlightsResponse>(
    "/flights",
    { status: "READY", limit: 25 }
  );

  const flights = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Authority operations console
            </Title>
            <Text className="text-sm text-gray-500">
              Provide regulators with real-time visibility into manifests and
              submitted documents.
            </Text>
          </div>
          <Button variant="outline" onClick={refetch}>
            Refresh queue
          </Button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Title as="h2" className="text-sm font-semibold uppercase text-gray-500">
            Guidance
          </Title>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>
              Use this queue to monitor flights pending transmission to
              government systems.
            </li>
            <li>
              Access flight detail to download the latest General Declaration,
              passenger manifest and crew list.
            </li>
            <li>
              Ensure audit logs are exported weekly for compliance retention.
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Flight
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Schedule
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Pax / Crew
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-end font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    Loading pending notifications…
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && flights.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No READY flights at this time.
                  </td>
                </tr>
              )}
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="px-4 py-3 text-gray-800">
                    {flight.originAirportName} ({flight.originIata ?? "—"}) →
                    {flight.destinationAirportName} (
                    {flight.destinationIata ?? "—"})
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {flight.scheduledDeparture ?? "TBC"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {flight.passengerCount} / {flight.crewCount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <Badge className={statusToColor[flight.status]}>
                      {flight.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={routes.flights.details(flight.id)}
                      className="font-medium text-primary hover:underline"
                    >
                      Review flight
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Protected>
  );
}

