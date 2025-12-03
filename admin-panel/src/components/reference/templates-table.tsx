"use client";

import { Button, Text, Title } from "rizzui";
import { Protected } from "@/components/common/protected";
import { useApiData } from "@/hooks/use-api-data";
import type { DocumentRecord } from "@/types/api";

interface DocumentTemplate {
  id: string;
  name: string;
  code: string;
  category: string;
  version: string;
  description: string | null;
  templateJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function TemplatesTable() {
  const { data, isLoading, error, refetch } = useApiData<{
    data: DocumentTemplate[];
  }>("/reference/templates");

  const templates = data?.data ?? [];

  return (
    <Protected>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              Document templates
            </Title>
            <Text className="text-sm text-gray-500">
              Server-side templates leveraged for PDF and structured exports.
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
                  Category
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Version
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-600">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    Loading document templates…
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
              {!isLoading && !error && templates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No document templates registered yet.
                  </td>
                </tr>
              )}
              {templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-4 py-3 text-gray-800">{template.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {template.category.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{template.version}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {template.description ?? "—"}
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

