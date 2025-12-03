"use client";

import { useParams } from "next/navigation";
import { QrLookup } from "@/components/qr/qr-lookup";

export default function QrLookupPage() {
  const params = useParams<{ token: string }>();
  return <QrLookup token={params.token} />;
}

