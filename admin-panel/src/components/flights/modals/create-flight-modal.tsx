"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useReferenceData } from "@/hooks/use-reference-data";
import { useApi } from "@/hooks/use-api";

interface CreateFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface CreateFlightForm {
  operatorId: string;
  aircraftTypeId: string;
  aircraftRegistration: string;
  originAirportId: string;
  destinationAirportId: string;
  departureDate: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  passengerCount: number;
  crewCount: number;
  status: "PLANNED" | "READY" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  turnaroundStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  remarks: string;
}

const statusOptions: CreateFlightForm["status"][] = [
  "PLANNED",
  "READY",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const turnaroundOptions: CreateFlightForm["turnaroundStatus"][] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETE",
];

const today = new Date();
const toDateInput = (value: Date) => {
  const pad = (num: number) => `${num}`.padStart(2, "0");
  const yyyy = value.getFullYear();
  const mm = pad(value.getMonth() + 1);
  const dd = pad(value.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

const toDateTimeInput = (value: Date) => {
  const pad = (num: number) => `${num}`.padStart(2, "0");
  const yyyy = value.getFullYear();
  const mm = pad(value.getMonth() + 1);
  const dd = pad(value.getDate());
  const hh = pad(value.getHours());
  const min = pad(value.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const defaultDepartureDate = toDateInput(today);
const defaultDepartureTime = toDateTimeInput(
  new Date(today.getTime() + 60 * 60 * 1000)
);
const defaultArrivalTime = toDateTimeInput(
  new Date(today.getTime() + 2 * 60 * 60 * 1000)
);

export function CreateFlightModal({
  isOpen,
  onClose,
  onCreated,
}: CreateFlightModalProps) {
  const api = useApi();
  const { airports, aircraft, operators, isLoading, error, refresh } =
    useReferenceData();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFlightForm>({
    defaultValues: {
      operatorId: "",
      aircraftTypeId: "",
      aircraftRegistration: "",
      originAirportId: "",
      destinationAirportId: "",
      departureDate: defaultDepartureDate,
      scheduledDeparture: defaultDepartureTime,
      scheduledArrival: defaultArrivalTime,
      passengerCount: 0,
      crewCount: 0,
      status: "PLANNED",
      turnaroundStatus: "NOT_STARTED",
      remarks: "",
    },
  });

  const selectedOrigin = watch("originAirportId");
  const [serverError, setServerError] = useState<string | null>(null);

  const filteredDestinationAirports = useMemo(() => {
    if (!selectedOrigin) return airports;
    return airports.filter((airport) => airport.id !== selectedOrigin);
  }, [airports, selectedOrigin]);

  const onSubmit = async (values: CreateFlightForm) => {
    setServerError(null);
    try {
      await api.post("/flights", {
        operatorId: values.operatorId,
        aircraftTypeId: values.aircraftTypeId,
        aircraftRegistration:
          values.aircraftRegistration.trim() || undefined,
        originAirportId: values.originAirportId,
        destinationAirportId: values.destinationAirportId,
        departureDate: values.departureDate,
        scheduledDeparture: values.scheduledDeparture || null,
        scheduledArrival: values.scheduledArrival || null,
        passengerCount: Number(values.passengerCount) || 0,
        crewCount: Number(values.crewCount) || 0,
        status: values.status,
        turnaroundStatus: values.turnaroundStatus,
        remarks: values.remarks?.trim() || null,
      });
      reset();
      onCreated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create flight. Please try again.";
      setServerError(message);
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" rounded="xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="flex flex-col gap-1">
          <Text as="h2" className="text-xl font-semibold text-gray-900">
            Create a new flight
          </Text>
          <Text className="text-sm text-gray-500">
            Define the core operational data for a new Victor movement.
          </Text>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
            Loading reference data…
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}{" "}
            <button
              type="button"
              className="font-semibold underline"
              onClick={refresh}
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Operator
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              disabled={isLoading}
              {...register("operatorId", { required: "Operator is required" })}
            >
              <option value="">Select operator</option>
              {operators.map((operator) => (
                <option value={operator.id} key={operator.id}>
                  {operator.name}
                </option>
              ))}
            </select>
            {errors.operatorId && (
              <Text className="text-xs text-red-500">
                {errors.operatorId.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Aircraft type
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              disabled={isLoading}
              {...register("aircraftTypeId", {
                required: "Aircraft type is required",
              })}
            >
              <option value="">Select aircraft</option>
              {aircraft.map((aircraftType) => (
                <option value={aircraftType.id} key={aircraftType.id}>
                  {aircraftType.manufacturer} {aircraftType.model} (
                  {aircraftType.icaoCode ?? aircraftType.iataCode ?? "N/A"})
                </option>
              ))}
            </select>
            {errors.aircraftTypeId && (
              <Text className="text-xs text-red-500">
                {errors.aircraftTypeId.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium uppercase text-gray-500">
              Aircraft registration
            </label>
            <input
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. G-VCTR"
              {...register("aircraftRegistration")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Origin airport
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              disabled={isLoading}
              {...register("originAirportId", {
                required: "Origin is required",
              })}
            >
              <option value="">Select origin</option>
              {airports.map((airport) => (
                <option value={airport.id} key={airport.id}>
                  {airport.name} ({airport.iataCode ?? airport.icaoCode ?? "N/A"}
                  )
                </option>
              ))}
            </select>
            {errors.originAirportId && (
              <Text className="text-xs text-red-500">
                {errors.originAirportId.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Destination airport
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              disabled={isLoading}
              {...register("destinationAirportId", {
                required: "Destination is required",
              })}
            >
              <option value="">Select destination</option>
              {filteredDestinationAirports.map((airport) => (
                <option value={airport.id} key={airport.id}>
                  {airport.name} ({airport.iataCode ?? airport.icaoCode ?? "N/A"}
                  )
                </option>
              ))}
            </select>
            {errors.destinationAirportId && (
              <Text className="text-xs text-red-500">
                {errors.destinationAirportId.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Departure date
            </label>
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("departureDate", {
                required: "Departure date is required",
              })}
            />
            {errors.departureDate && (
              <Text className="text-xs text-red-500">
                {errors.departureDate.message}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Scheduled departure
            </label>
            <input
              type="datetime-local"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("scheduledDeparture")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Scheduled arrival
            </label>
            <input
              type="datetime-local"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("scheduledArrival")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase text-gray-500">
                Passenger count
              </label>
              <input
                type="number"
                min={0}
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                {...register("passengerCount", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Passenger count must be positive" },
                })}
              />
              {errors.passengerCount && (
                <Text className="text-xs text-red-500">
                  {errors.passengerCount.message}
                </Text>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase text-gray-500">
                Crew count
              </label>
              <input
                type="number"
                min={0}
                className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                {...register("crewCount", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Crew count must be positive" },
                })}
              />
              {errors.crewCount && (
                <Text className="text-xs text-red-500">
                  {errors.crewCount.message}
                </Text>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Operational status
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("status")}
            >
              {statusOptions.map((value) => (
                <option value={value} key={value}>
                  {value.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase text-gray-500">
              Turnaround state
            </label>
            <select
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              {...register("turnaroundStatus")}
            >
              {turnaroundOptions.map((value) => (
                <option value={value} key={value}>
                  {value.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase text-gray-500">
              Remarks
            </label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Operational notes, VIP handling, crew briefing details…"
              {...register("remarks")}
            />
          </div>
        </div>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
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
            Save flight
          </Button>
        </div>
      </form>
    </Modal>
  );
}

