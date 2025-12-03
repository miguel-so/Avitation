"use client";

import { useEffect, useState } from "react";
import { Button, Text, Title, Badge } from "rizzui";
import { getApiBaseUrl } from "@/lib/env";

interface QrLookupProps {
  token: string;
}

interface QrPayload {
  id: string;
  flightId: string;
  entityType: "PASSENGER" | "CREW";
  entityId: string;
  accessLevel: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  issuedAt: string;
  expiresAt: string | null;
  payload: Record<string, unknown>;
}

const apiBaseUrl = getApiBaseUrl();

export function QrLookup({ token }: QrLookupProps) {
  const [data, setData] = useState<QrPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/qr-pass/${token}`);
      if (!response.ok) {
        throw new Error("QR code not found or expired.");
      }
      const payload = (await response.json()) as QrPayload;
      setData(payload);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to verify QR code.";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <Title as="h1" className="text-2xl font-semibold text-gray-900">
          Victor QR validation
        </Title>
        <Text className="text-sm text-gray-500">
          Validate encrypted boarding tokens even in low-connectivity
          environments.
        </Text>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Decoding QR token…
        </div>
      )}

      {error && !isLoading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
          <Button variant="outline" onClick={refetch}>
            Try again
          </Button>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <Text className="text-xs font-medium uppercase text-gray-500">
                Access level
              </Text>
              <Text className="text-sm text-gray-700">{data.accessLevel}</Text>
            </div>
            <Badge
              className={`${
                data.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.status}
            </Badge>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Entity</span>
                <span>
                  {data.entityType} · {data.entityId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Flight ID</span>
                <span>{data.flightId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Issued</span>
                <span>{new Date(data.issuedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Expires</span>
                <span>
                  {data.expiresAt
                    ? new Date(data.expiresAt).toLocaleString()
                    : "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <Text className="text-xs font-medium uppercase text-gray-500">
              Payload snapshot
            </Text>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-white p-3 text-xs text-gray-500">
              {JSON.stringify(data.payload, null, 2)}
            </pre>
          </div>

          <Button onClick={refetch} className="w-full">
            Refresh token state
          </Button>
        </div>
      )}
    </div>
  );
}

