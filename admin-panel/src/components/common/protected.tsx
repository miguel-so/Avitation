"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Text } from "rizzui";
import { useAuth } from "@/contexts/auth-context";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/signin");
    }
  }, [isLoading, router, session]);

  if (isLoading || !session) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white p-8">
        <Loader size="lg" />
        <Text className="text-sm text-gray-500">
          Verifying your credentials…
        </Text>
      </div>
    );
  }

  return <>{children}</>;
}

