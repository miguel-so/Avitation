import { validationResult } from "express-validator";
import { getFlightById } from "../services/flight-service.js";
import { listPassengers } from "../services/passenger-service.js";
import { listCrew } from "../services/crew-service.js";
import {
  listDocuments,
  createDocumentRecord,
  generateGeneralDeclarationPdf,
} from "../services/document-service.js";
import { createId } from "../utils/uid.js";

export const handleListDocuments = async (req, res) => {
  const documents = await listDocuments(req.params.flightId);
  res.json({ data: documents });
};

export const handleGenerateGeneralDeclaration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  const flight = await getFlightById(req.params.flightId);
  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  const [passengers, crew] = await Promise.all([
    listPassengers(flight.id),
    listCrew(flight.id),
  ]);

  const documentId = createId();
  const { filePath, fileName } = await generateGeneralDeclarationPdf({
    documentId,
    flight,
    passengers,
    crew,
  });

  const storageUrl = `/documents/${fileName}`;

  await createDocumentRecord(documentId, {
    flightId: flight.id,
    templateId: req.body.templateId ?? null,
    type: "GENERAL_DECLARATION",
    storagePath: filePath,
    storageUrl,
    metadata: {
      passengerCount: passengers.length,
      crewCount: crew.length,
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.sub ?? null,
    },
    signatureRequired: true,
    createdBy: req.user?.sub ?? null,
  });

  res.status(201).json({
    id: documentId,
    type: "GENERAL_DECLARATION",
    storageUrl,
    storagePath: filePath,
  });
};

