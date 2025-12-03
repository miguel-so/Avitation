"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/contexts/auth-context";
import { Title, Text } from "rizzui";

export default function SignInPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, session]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 pt-10 text-center">
        <Title as="h2" className="text-lg font-semibold">
          Preparing cockpit
        </Title>
        <Text className="max-w-xs text-sm text-gray-500">
          Loading your session. This will only take a moment.
        </Text>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return <LoginForm />;
}

