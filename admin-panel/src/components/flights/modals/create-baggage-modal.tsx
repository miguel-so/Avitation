"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useApi } from "@/hooks/use-api";
import type { Passenger } from "@/types/api";

interface CreateBaggageModalProps {
  flightId: string;
  passengers: Passenger[];
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface BaggageForm {
  passengerId: string;
  tagCode: string;
  weightKg: number;
  pieces: number;
  status: "CREATED" | "CHECKED_IN" | "LOADED" | "UNLOADED" | "MISSING";
  notes: string;
}

const statusOptions: BaggageForm["status"][] = [
  "CREATED",
  "CHECKED_IN",
  "LOADED",
  "UNLOADED",
  "MISSING",
];

export function CreateBaggageModal({
  flightId,
  passengers,
  isOpen,
  onClose,
  onCreated,
}: CreateBaggageModalProps) {
  const api = useApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BaggageForm>({
    defaultValues: {
      passengerId: "",
      tagCode: "",
      weightKg: 0,
      pieces: 1,
      status: "CREATED",
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: BaggageForm) => {
    setServerError(null);
    try {
      await api.post(`/flights/${flightId}/baggage`, {
        ...values,
        weightKg: values.weightKg ? Number(values.weightKg) : null,
        pieces: values.pieces ? Number(values.pieces) : 1,
        passengerId: values.passengerId || null,
      });
      reset();
      onCreated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to add baggage. Please try again.";
      setServerError(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" rounded="xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="space-y-1">
          <Text as="h2" className="text-xl font-semibold text-gray-900">
            Register baggage
          </Text>
          <Text className="text-sm text-gray-500">
            Generate a QR-traceable baggage record for ground handlers.
          </Text>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase text-gray-500">
            Tag code
          </label>
          <input
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("tagCode", { required: "Tag code is required" })}
          />
          {errors.tagCode && (
            <Text className="text-xs text-red-500">
              {errors.tagCode.message}
            </Text>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase text-gray-500">
            Linked passenger
          </label>
          <select
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("passengerId")}
          >
            <option value="">Unassigned</option>
            {passengers.map((passenger) => (
              <option key={passenger.id} value={passenger.id}>
                {passenger.firstName} {passenger.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Weight (kg)
            </label>
            <input
              type="number"
              min={0}
              step="0.1"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("weightKg", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Pieces
            </label>
            <input
              type="number"
              min={1}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("pieces", {
                valueAsNumber: true,
                min: { value: 1, message: "At least one piece required" },
              })}
            />
            {errors.pieces && (
              <Text className="text-xs text-red-500">
                {errors.pieces.message}
              </Text>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase text-gray-500">
            Status
          </label>
          <select
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("status")}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium uppercase text-gray-500">
            Notes
          </label>
          <textarea
            rows={3}
            className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            {...register("notes")}
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
            Save baggage
          </Button>
        </div>
      </form>
    </Modal>
  );
}

