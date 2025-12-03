"use client";

import { Button, Text, Title } from "rizzui";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";
import type { AircraftTypeResponseItem } from "@/types/api";

export function AircraftTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: AircraftTypeResponseItem[];
  }>("/reference/aircraft-types");

  const aircraft = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Aircraft catalogue
            </Title>
            <Text className="text-sm text-gray-500">
              Harmonised aircraft definitions for documentation and payload
              calculations.
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
                  Manufacturer / Model
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Codes
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  MTOW
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Typical crew / pax
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Loading aircraft catalogue…
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
              {!isLoading && !error && aircraft.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No aircraft types registered yet.
                  </td>
                </tr>
              )}
              {aircraft.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-gray-800">
                    {item.manufacturer} {item.model}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.icaoCode ?? "—"} / {item.iataCode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.mtowKg ? `${item.mtowKg} kg` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.typicalCrew ?? "—"} / {item.typicalPax ?? "—"}
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

