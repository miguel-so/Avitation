"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useApi } from "@/hooks/use-api";

interface CreateCrewModalProps {
  flightId: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CrewForm {
  firstName: string;
  lastName: string;
  nationality: string;
  position: string;
  dutyType: "OPERATING" | "DEADHEADING" | "STANDBY";
  licenseNumber: string;
  licenseExpiry: string;
  arrivalStatus: "SCHEDULED" | "ARRIVED" | "ON_BOARD";
  notes: string;
}

const dutyOptions: CrewForm["dutyType"][] = [
  "OPERATING",
  "DEADHEADING",
  "STANDBY",
];

const statusOptions: CrewForm["arrivalStatus"][] = [
  "SCHEDULED",
  "ARRIVED",
  "ON_BOARD",
];

export function CreateCrewModal({
  flightId,
  isOpen,
  onClose,
  onCreated,
}: CreateCrewModalProps) {
  const api = useApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CrewForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      nationality: "",
      position: "",
      dutyType: "OPERATING",
      licenseNumber: "",
      licenseExpiry: "",
      arrivalStatus: "SCHEDULED",
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (values: CrewForm) => {
    setServerError(null);
    try {
      await api.post(`/flights/${flightId}/crew`, values);
      reset();
      onCreated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to add crew member. Please try again.";
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
            Add crew member
          </Text>
          <Text className="text-sm text-gray-500">
            Register crew information aligned with operational standards and
            authority compliance.
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
              Nationality
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("nationality")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Position / Rank
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("position")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Duty type
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("dutyType")}
            >
              {dutyOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              License number
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("licenseNumber")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              License expiry
            </label>
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("licenseExpiry")}
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
                  {option}
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
            Save crew member
          </Button>
        </div>
      </form>
    </Modal>
  );
}

