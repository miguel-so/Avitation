"use client";

import { useState } from "react";
import { Button, Text } from "rizzui";
import { Modal } from "@/components/modal";
import { useApi } from "@/hooks/use-api";

interface GenerateGeneralDeclarationModalProps {
  flightId: string;
  isOpen: boolean;
  onClose: () => void;
  onGenerated: () => void;
}

export function GenerateGeneralDeclarationModal({
  flightId,
  isOpen,
  onClose,
  onGenerated,
}: GenerateGeneralDeclarationModalProps) {
  const api = useApi();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setServerError(null);
    onClose();
  };

  const handleGenerate = async () => {
    setServerError(null);
    setSubmitting(true);
    try {
      await api.post(`/flights/${flightId}/general-declaration/generate`);
      onGenerated();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to generate general declaration.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" rounded="xl">
      <div className="space-y-6 p-6 md:p-8">
        <div className="space-y-1">
          <Text as="h2" className="text-xl font-semibold text-gray-900">
            Generate General Declaration
          </Text>
          <Text className="text-sm text-gray-500">
            The declaration will merge passenger, crew and flight data into the
            ICAO-compliant template and store the PDF in the Victor repository.
          </Text>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <ul className="list-disc space-y-2 pl-4">
            <li>Ensures data consistency with the mobile scanning pipeline.</li>
            <li>
              Generates a downloadable PDF and stores metadata for audit
              tracking.
            </li>
            <li>
              Triggers authority notifications for configured jurisdictions.
            </li>
          </ul>
        </div>

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} isLoading={isSubmitting}>
            Generate declaration
          </Button>
        </div>
      </div>
    </Modal>
  );
}

