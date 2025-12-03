"use client";

import { useMemo, useState } from "react";
import { Button, Badge, Text, Title } from "rizzui";
import { useApiData } from "@/hooks/use-api-data";
import type {
  FlightDetailResponse,
  Passenger,
  CrewMember,
  BaggageItem,
  DocumentRecord,
  AuthorityNotification,
} from "@/types/api";
import { useApi } from "@/hooks/use-api";
import { CreatePassengerModal } from "@/components/flights/modals/create-passenger-modal";
import { CreateCrewModal } from "@/components/flights/modals/create-crew-modal";
import { CreateBaggageModal } from "@/components/flights/modals/create-baggage-modal";
import { GenerateGeneralDeclarationModal } from "@/components/flights/modals/generate-gd-modal";
import { CreateQrPassModal } from "@/components/flights/modals/create-qr-pass-modal";

const tabList = [
  { key: "overview", label: "Overview" },
  { key: "passengers", label: "Passengers" },
  { key: "crew", label: "Crew" },
  { key: "baggage", label: "Baggage" },
  { key: "documents", label: "Documents" },
  { key: "authority", label: "Authority logs" },
] as const;

type TabKey = (typeof tabList)[number]["key"];

const flightStatusColor = {
  PLANNED: "bg-blue-100 text-blue-700",
  READY: "bg-emerald-100 text-emerald-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
} as const;

interface FlightDetailProps {
  flightId: string;
  initialTab?: string;
}

export function FlightDetail({ flightId, initialTab }: FlightDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const normalized = tabList.find(
      (tab) => tab.key === (initialTab as TabKey)
    );
    return normalized?.key ?? "overview";
  });
  const [isPassengerModalOpen, setPassengerModalOpen] = useState(false);
  const [isCrewModalOpen, setCrewModalOpen] = useState(false);
  const [isBaggageModalOpen, setBaggageModalOpen] = useState(false);
  const [isGdModalOpen, setGdModalOpen] = useState(false);
  const [qrEntity, setQrEntity] = useState<
    { entityType: "PASSENGER" | "CREW"; entityId: string } | undefined
  >(undefined);

  const api = useApi();
  const { data, isLoading, error, refetch } =
    useApiData<FlightDetailResponse>(`/flights/${flightId}`);

  const flight = data?.flight;
  const passengers = data?.passengers ?? [];
  const crew = data?.crew ?? [];
  const baggage = data?.baggage ?? [];
  const documents = data?.documents ?? [];
  const notifications = data?.notifications ?? [];

  const stats = useMemo(() => {
    if (!flight) return [];
    return [
      {
        label: "Passengers",
        value: passengers.length,
        hint: "Linked to offline passport scans",
      },
      {
        label: "Crew",
        value: crew.length,
        hint: "Operating and deadheading",
      },
      {
        label: "Baggage tags",
        value: baggage.length,
        hint: "QR traceability tokens",
      },
      {
        label: "Documents",
        value: documents.length,
        hint: "Generated from canonical templates",
      },
    ];
  }, [baggage.length, crew.length, documents.length, flight, passengers.length]);

  const handleGenerateQr = (entityType: "PASSENGER" | "CREW", entityId: string) =>
    setQrEntity({ entityType, entityId });

  const removePassenger = async (passenger: Passenger) => {
    await api.del(`/passengers/${passenger.id}`);
    refetch();
  };

  const removeCrew = async (member: CrewMember) => {
    await api.del(`/crew/${member.id}`);
    refetch();
  };

  const removeBaggage = async (item: BaggageItem) => {
    await api.del(`/baggage/${item.id}`);
    refetch();
  };

  const resendNotification = async (notification: AuthorityNotification) => {
    await api.put(`/authority-notifications/${notification.id}`, {
      status: "PENDING",
      retryCount: notification.retryCount + 1,
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
        <Text className="text-sm text-gray-500">
          Loading flight manifest…
        </Text>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
        <Title as="h2" className="text-lg font-semibold text-red-600">
          Unable to load flight
        </Title>
        <Text className="mt-2 text-sm text-red-500">
          {error ?? "The requested flight could not be found."}
        </Text>
        <Button className="mt-4" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Title as="h1" className="text-2xl font-semibold text-gray-900">
              {flight.operatorName}
            </Title>
            <Badge className={flightStatusColor[flight.status]}>
              {flight.status.replace("_", " ")}
            </Badge>
          </div>
          <Text className="text-sm text-gray-500">
            {flight.originAirportName} ({flight.originIata ?? "—"}) →{" "}
            {flight.destinationAirportName} ({flight.destinationIata ?? "—"})
          </Text>
          <Text className="text-sm text-gray-400">
            Departure {flight.scheduledDeparture ?? "TBC"} • MTOW{" "}
            {flight.mtowKg ?? "—"}kg
          </Text>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setGdModalOpen(true)}>
            Generate General Declaration
          </Button>
          <Button onClick={() => setPassengerModalOpen(true)}>
            Add passenger
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Text className="text-xs font-medium uppercase text-gray-500">
              {stat.label}
            </Text>
            <Title as="p" className="mt-2 text-2xl font-semibold text-gray-900">
              {stat.value}
            </Title>
            <Text className="mt-2 text-xs text-gray-500">{stat.hint}</Text>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6">
          <div className="flex flex-wrap gap-4">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-3 py-4 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Title as="h3" className="text-sm font-semibold uppercase">
                  Flight details
                </Title>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-500">Captain</span>
                  <span>{flight.captainName ?? "—"}</span>
                  <span className="font-medium text-gray-500">
                    First officer
                  </span>
                  <span>{flight.firstOfficerName ?? "—"}</span>
                  <span className="font-medium text-gray-500">
                    Departure window
                  </span>
                  <span>{flight.scheduledDeparture ?? "TBC"}</span>
                  <span className="font-medium text-gray-500">
                    Arrival window
                  </span>
                  <span>{flight.scheduledArrival ?? "TBC"}</span>
                  <span className="font-medium text-gray-500">
                    Purpose
                  </span>
                  <span>{flight.purpose}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Title as="h3" className="text-sm font-semibold uppercase">
                  Operational notes
                </Title>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  {flight.remarks ? (
                    <p>{flight.remarks}</p>
                  ) : (
                    <p>No notes captured for this movement.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "passengers" && (
            <PassengerTable
              passengers={passengers}
              onAdd={() => setPassengerModalOpen(true)}
              onGenerateQr={(passengerId) =>
                handleGenerateQr("PASSENGER", passengerId)
              }
              onRemove={removePassenger}
            />
          )}

          {activeTab === "crew" && (
            <CrewTable
              crew={crew}
              onAdd={() => setCrewModalOpen(true)}
              onGenerateQr={(crewId) => handleGenerateQr("CREW", crewId)}
              onRemove={removeCrew}
            />
          )}

          {activeTab === "baggage" && (
            <BaggageTable
              baggage={baggage}
              passengers={passengers}
              onAdd={() => setBaggageModalOpen(true)}
              onRemove={removeBaggage}
            />
          )}

          {activeTab === "documents" && (
            <DocumentTable documents={documents} />
          )}

          {activeTab === "authority" && (
            <AuthorityTable
              notifications={notifications}
              onResend={resendNotification}
            />
          )}
        </div>
      </div>

      <CreatePassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => setPassengerModalOpen(false)}
        flightId={flightId}
        onCreated={() => {
          refetch();
          setPassengerModalOpen(false);
        }}
      />

      <CreateCrewModal
        isOpen={isCrewModalOpen}
        onClose={() => setCrewModalOpen(false)}
        flightId={flightId}
        onCreated={() => {
          refetch();
          setCrewModalOpen(false);
        }}
      />

      <CreateBaggageModal
        isOpen={isBaggageModalOpen}
        onClose={() => setBaggageModalOpen(false)}
        flightId={flightId}
        passengers={passengers}
        onCreated={() => {
          refetch();
          setBaggageModalOpen(false);
        }}
      />

      <GenerateGeneralDeclarationModal
        isOpen={isGdModalOpen}
        onClose={() => setGdModalOpen(false)}
        flightId={flightId}
        onGenerated={() => {
          refetch();
          setGdModalOpen(false);
        }}
      />

      <CreateQrPassModal
        flightId={flightId}
        entity={qrEntity}
        onClose={() => setQrEntity(undefined)}
        onGenerated={() => {
          setQrEntity(undefined);
          refetch();
        }}
      />
    </div>
  );
}

function PassengerTable({
  passengers,
  onAdd,
  onGenerateQr,
  onRemove,
}: {
  passengers: Passenger[];
  onAdd: () => void;
  onGenerateQr: (passengerId: string) => void;
  onRemove: (passenger: Passenger) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Title as="h3" className="text-sm font-semibold uppercase text-gray-500">
          Registered passengers
        </Title>
        <Button size="sm" onClick={onAdd}>
          Add passenger
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Full name
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Passport
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-end font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {passengers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No passengers linked yet.
                </td>
              </tr>
            )}
            {passengers.map((passenger) => (
              <tr key={passenger.id}>
                <td className="px-4 py-3 text-gray-800">
                  {passenger.firstName} {passenger.lastName}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {passenger.passportNumber ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {passenger.arrivalStatus.replaceAll("_", " ")}
                </td>
                <td className="flex items-center justify-end gap-2 px-4 py-3 text-sm">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateQr(passenger.id)}
                  >
                    Create QR
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => onRemove(passenger)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CrewTable({
  crew,
  onAdd,
  onGenerateQr,
  onRemove,
}: {
  crew: CrewMember[];
  onAdd: () => void;
  onGenerateQr: (crewId: string) => void;
  onRemove: (crew: CrewMember) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Title as="h3" className="text-sm font-semibold uppercase text-gray-500">
          Crew roster
        </Title>
        <Button size="sm" onClick={onAdd}>
          Add crew member
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Full name
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Position
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                License
              </th>
              <th className="px-4 py-3 text-end font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {crew.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No crew members assigned.
                </td>
              </tr>
            )}
            {crew.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 text-gray-800">
                  {member.firstName} {member.lastName}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {member.position ?? "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {member.licenseNumber ?? "—"}
                </td>
                <td className="flex items-center justify-end gap-2 px-4 py-3 text-sm">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onGenerateQr(member.id)}
                  >
                    Create QR
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => onRemove(member)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BaggageTable({
  baggage,
  passengers,
  onAdd,
  onRemove,
}: {
  baggage: BaggageItem[];
  passengers: Passenger[];
  onAdd: () => void;
  onRemove: (bag: BaggageItem) => Promise<void>;
}) {
  const passengerLookup = useMemo(() => {
    const map = new Map<string, Passenger>();
    passengers.forEach((passenger) => map.set(passenger.id, passenger));
    return map;
  }, [passengers]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Title as="h3" className="text-sm font-semibold uppercase text-gray-500">
          Baggage tracking
        </Title>
        <Button size="sm" onClick={onAdd}>
          Register baggage
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Tag
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Passenger
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Weight
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-end font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {baggage.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No baggage registered for this flight.
                </td>
              </tr>
            )}
            {baggage.map((bag) => {
              const pax = bag.passengerId
                ? passengerLookup.get(bag.passengerId)
                : null;
              return (
                <tr key={bag.id}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {bag.tagCode}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {pax ? `${pax.firstName} ${pax.lastName}` : "Unassigned"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {bag.weightKg ? `${bag.weightKg} kg` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{bag.status}</td>
                  <td className="px-4 py-3 text-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => onRemove(bag)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentTable({ documents }: { documents: DocumentRecord[] }) {
  return (
    <div className="space-y-4">
      <Title as="h3" className="text-sm font-semibold uppercase text-gray-500">
        Generated documents
      </Title>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Type
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Created
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Metadata
              </th>
              <th className="px-4 py-3 text-end font-semibold text-gray-600">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No documents have been generated yet.
                </td>
              </tr>
            )}
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {document.type.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(document.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {document.metadata
                    ? JSON.stringify(document.metadata)
                    : "—"}
                </td>
                <td className="px-4 py-3 text-end">
                  {document.storageUrl ? (
                    <a
                      href={document.storageUrl}
                      className="font-medium text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    <Text className="text-xs text-gray-400">Not synced</Text>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuthorityTable({
  notifications,
  onResend,
}: {
  notifications: AuthorityNotification[];
  onResend: (notification: AuthorityNotification) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <Title as="h3" className="text-sm font-semibold uppercase text-gray-500">
        Authority notifications
      </Title>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Authority
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-start font-semibold text-gray-600">
                Last event
              </th>
              <th className="px-4 py-3 text-end font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notifications.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No authority notifications logged yet.
                </td>
              </tr>
            )}
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="px-4 py-3 text-gray-800">
                  {notification.authorityType}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {notification.status}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {notification.sentAt
                    ? new Date(notification.sentAt).toLocaleString()
                    : "Not sent"}
                </td>
                <td className="px-4 py-3 text-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResend(notification)}
                  >
                    Re-queue
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

