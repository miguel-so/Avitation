"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Password, Text } from "rizzui";
import { useAuth } from "@/contexts/auth-context";

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormInputs) => {
    setServerError(null);
    try {
      await login(values);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to sign in right now."
      );
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
    >
      <div>
        <Text as="h1" className="text-2xl font-semibold text-gray-900">
          Victor Executive Console
        </Text>
        <Text className="mt-1 text-sm text-gray-500">
          Sign in to orchestrate flights, passengers, QR passes, and documents.
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@victorexecutive.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <Text className="text-xs text-red-500">{errors.email.message}</Text>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <Password
            id="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <Text className="text-xs text-red-500">
              {errors.password.message}
            </Text>
          )}
        </div>
      </div>

      {serverError && (
        <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2">
          <Text className="text-sm text-red-600">{serverError}</Text>
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full text-base font-semibold"
        disabled={isBusy}
        isLoading={isBusy}
      >
        Sign in
      </Button>

      <div className="space-y-1 rounded-md bg-gray-50 p-3 text-xs text-gray-500">
        <div>
          <strong>Demo Access</strong>
        </div>
        <div>admin@victorexecutive.com / VictorAdmin!2025</div>
        <div>ops@victorexecutive.com / Operator!2025</div>
      </div>
    </form>
  );
}

