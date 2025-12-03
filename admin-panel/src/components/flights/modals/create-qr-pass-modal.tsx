"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useApi } from "@/hooks/use-api";

interface CreateQrPassModalProps {
  flightId: string;
  entity:
    | { entityType: "PASSENGER" | "CREW"; entityId: string }
    | undefined;
  onClose: () => void;
  onGenerated: () => void;
}

interface QrForm {
  accessLevel: "PASSENGER" | "CREW" | "HANDLER" | "AUTHORITY";
  expiresAt: string;
}

const tomorrow = () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const pad = (num: number) => `${num}`.padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

export function CreateQrPassModal({
  flightId,
  entity,
  onClose,
  onGenerated,
}: CreateQrPassModalProps) {
  const api = useApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<QrForm>({
    defaultValues: {
      accessLevel: "PASSENGER",
      expiresAt: tomorrow(),
    },
  });

  if (!entity) {
    return null;
  }

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: QrForm) => {
    setServerError(null);
    try {
      if (entity.entityType === "PASSENGER") {
        await api.post(
          `/flights/${flightId}/passengers/${entity.entityId}/qr-pass`,
          {
            accessLevel: values.accessLevel,
            expiresAt: values.expiresAt,
          }
        );
      } else {
        await api.post(`/flights/${flightId}/crew/${entity.entityId}/qr-pass`, {
          accessLevel: values.accessLevel,
          expiresAt: values.expiresAt,
        });
      }
      reset();
      onGenerated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to generate QR pass. Please try again.";
      setServerError(message);
    }
  };

  return (
    <Modal isOpen={Boolean(entity)} onClose={handleClose} size="sm" rounded="xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="space-y-1">
          <Text as="h2" className="text-xl font-semibold text-gray-900">
            Generate QR pass
          </Text>
          <Text className="text-sm text-gray-500">
            Issue a secure, encrypted QR token for on-ramp verification.
          </Text>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase text-gray-500">
            Access level
          </label>
          <select
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("accessLevel")}
          >
            <option value="PASSENGER">Passenger</option>
            <option value="CREW">Crew</option>
            <option value="HANDLER">Handler</option>
            <option value="AUTHORITY">Authority</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase text-gray-500">
            Expires at
          </label>
          <input
            type="datetime-local"
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("expiresAt")}
          />
        </div>

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Generate QR
          </Button>
        </div>
      </form>
    </Modal>
  );
}

