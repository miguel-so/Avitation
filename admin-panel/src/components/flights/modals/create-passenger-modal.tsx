"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useApi } from "@/hooks/use-api";

interface CreatePassengerModalProps {
  flightId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface PassengerForm {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportCountry: string;
  passportExpiry: string;
  arrivalStatus:
    | "SCHEDULED"
    | "ARRIVED"
    | "READY_FOR_BOARDING"
    | "ON_BOARD"
    | "OFFLOADED";
  seatNumber: string;
  baggageCount: number;
  notes: string;
}

const genderOptions: PassengerForm["gender"][] = ["MALE", "FEMALE", "OTHER"];
const statusOptions: PassengerForm["arrivalStatus"][] = [
  "SCHEDULED",
  "ARRIVED",
  "READY_FOR_BOARDING",
  "ON_BOARD",
  "OFFLOADED",
];

export function CreatePassengerModal({
  flightId,
  isOpen,
  onClose,
  onCreated,
}: CreatePassengerModalProps) {
  const api = useApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PassengerForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "OTHER",
      dateOfBirth: "",
      nationality: "",
      passportNumber: "",
      passportCountry: "",
      passportExpiry: "",
      arrivalStatus: "SCHEDULED",
      seatNumber: "",
      baggageCount: 0,
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: PassengerForm) => {
    setServerError(null);
    try {
      await api.post(`/flights/${flightId}/passengers`, {
        ...values,
        baggageCount: Number(values.baggageCount) || 0,
      });
      reset();
      onCreated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to add passenger. Please try again.";
      setServerError(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" rounded="xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="space-y-1">
          <Text as="h2" className="text-xl font-semibold text-gray-900">
            Add passenger
          </Text>
          <Text className="text-sm text-gray-500">
            Capture the canonical passenger dataset as per ICAO Annex 9.
          </Text>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              First name
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <Text className="text-xs text-red-500">
                {errors.firstName.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Last name
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <Text className="text-xs text-red-500">
                {errors.lastName.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Gender
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("gender")}
            >
              {genderOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Date of birth
            </label>
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("dateOfBirth")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Nationality
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("nationality")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Passport number
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("passportNumber")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Passport country
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("passportCountry")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Passport expiry
            </label>
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("passportExpiry")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Seat number
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("seatNumber")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Baggage pieces
            </label>
            <input
              type="number"
              min={0}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("baggageCount", { valueAsNumber: true })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Status
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("arrivalStatus")}
            >
              {statusOptions.map((option) => (
                <option value={option} key={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase text-gray-500">
              Notes
            </label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("notes")}
            />
          </div>
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
            Save passenger
          </Button>
        </div>
      </form>
    </Modal>
  );
}

