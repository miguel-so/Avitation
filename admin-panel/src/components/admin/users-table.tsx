"use client";

import { Button, Text, Title, Badge } from "rizzui";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";
import type { VictorUser } from "@/types/api";

const roleColor: Record<string, string> = {
  VictorAdmin: "bg-primary/10 text-primary",
  OperatorAdmin: "bg-emerald-100 text-emerald-700",
  Handler: "bg-blue-100 text-blue-700",
  AuthorityUser: "bg-amber-100 text-amber-700",
};

export function UsersTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: VictorUser[];
  }>("/users");

  const users = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Platform users
            </Title>
            <Text className="text-sm text-gray-500">
              Review current Victor accounts and their assigned roles.
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
                  User
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Last login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Loading platform users…
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
              {!isLoading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No users registered yet.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-gray-800">
                    {user.fullName}
                    <br />
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <Badge className={roleColor[user.role] ?? "bg-gray-100 text-gray-600"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.status}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "Never"}
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

