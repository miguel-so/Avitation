"use client";

import { Button, Text, Title } from "rizzui";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";
import type { OperatorResponseItem } from "@/types/api";

export function OperatorsTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: OperatorResponseItem[];
  }>("/reference/operators");

  const operators = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Operator registry
            </Title>
            <Text className="text-sm text-gray-500">
              Keep carrier and handler entities synchronised across the Victor
              ecosystem.
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
                  Operator
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Contact
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Billing
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Loading operator registry…
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
              {!isLoading && !error && operators.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No operators registered yet.
                  </td>
                </tr>
              )}
              {operators.map((operator) => (
                <tr key={operator.id}>
                  <td className="px-4 py-3 text-gray-800">{operator.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {operator.contactName ?? "—"}
                    <br />
                    <span className="text-xs text-gray-400">
                      {operator.contactEmail ?? "—"} ·{" "}
                      {operator.contactPhone ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {operator.billingEmail ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {operator.notes ?? "—"}
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

