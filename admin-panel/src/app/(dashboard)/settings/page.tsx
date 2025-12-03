"use client";

import { Protected } from "@/components/common/protected";
import { Title, Text } from "rizzui";

export default function SettingsPage() {
  return (
    <Protected>
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Title as="h1" className="text-2xl font-semibold text-gray-900">
          Platform settings
        </Title>
        <Text className="text-sm text-gray-500">
          Configure integration endpoints, email gateways and audit retention
          policies. This section is a scaffold for further expansion.
        </Text>
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          Coming soon — connect notification providers, manage JWT secrets, and
          configure Victor’s offline synchronisation policies.
        </div>
      </div>
    </Protected>
  );
}

