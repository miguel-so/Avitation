"use client";

import { Button, Text, Title } from "rizzui";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";

interface RoleRow {
  id: number;
  name: string;
  description: string | null;
}

export function RolesTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: RoleRow[];
  }>("/reference/roles");

  const roles = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Role matrix
            </Title>
            <Text className="text-sm text-gray-500">
              System roles mapped to Victor backend permissions.
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
                  Role
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={2} className="px-4 py-12 text-center text-gray-500">
                    Loading roles…
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan={2} className="px-4 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && roles.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-12 text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
              {roles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-3 text-gray-800">{role.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {role.description ?? "—"}
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

