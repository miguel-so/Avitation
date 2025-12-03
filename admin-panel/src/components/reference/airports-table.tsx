"use client";

import { Button, Text, Title } from "rizzui";
import { useApiData } from "@/hooks/use-api-data";
import type { AirportsResponseItem } from "@/types/api";
import { Protected } from "@/components/common/protected";

export function AirportsTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: AirportsResponseItem[];
  }>("/reference/airports");

  const airports = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Airport master data
            </Title>
            <Text className="text-sm text-gray-500">
              Canonical aerodrome directory synchronised across mobile and
              backend subsystems.
            </Text>
          </div>
          <Button variant="outline" onClick={refetch}>
            Refresh list
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Codes
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  City / Country
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Timezone
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Loading airport directory…
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && airports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No airports registered yet.
                  </td>
                </tr>
              )}
              {airports.map((airport) => (
                <tr key={airport.id}>
                  <td className="px-4 py-3 text-gray-800">{airport.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {airport.iataCode ?? "—"} / {airport.icaoCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {airport.city ?? "—"}, {airport.country ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {airport.timezone ?? "—"}
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

