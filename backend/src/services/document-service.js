import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import PDFDocument from "pdfkit";
import slugify from "slugify";
import { getPool } from "../db/pool.js";
import { logger } from "../logger.js";

const storageDir = path.resolve(process.cwd(), "storage", "documents");

const ensureStorageDir = async () => {
  try {
    await fsPromises.mkdir(storageDir, { recursive: true });
  } catch (error) {
    logger.error("Failed to ensure storage directory", { error });
    throw error;
  }
};

export const listDocuments = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        d.id,
        d.flight_id AS flightId,
        d.template_id AS templateId,
        d.type,
        d.storage_path AS storagePath,
        d.storage_url AS storageUrl,
        d.metadata,
        d.signature_required AS signatureRequired,
        d.created_at AS createdAt,
        d.updated_at AS updatedAt
     FROM documents d
     WHERE d.flight_id = ?
     ORDER BY d.created_at DESC`,
    [flightId]
  );
  return rows;
};

export const createDocumentRecord = async (documentId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO documents
      (id, flight_id, template_id, type, storage_path, storage_url, metadata, signature_required, created_by)
     VALUES (?, ?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?)`,
    [
      documentId,
      payload.flightId,
      payload.templateId ?? null,
      payload.type ?? "OTHER",
      payload.storagePath ?? null,
      payload.storageUrl ?? null,
      JSON.stringify(payload.metadata ?? {}),
      payload.signatureRequired ? 1 : 0,
      payload.createdBy ?? null,
    ]
  );
};

export const generateGeneralDeclarationPdf = async ({
  documentId,
  flight,
  passengers,
  crew,
}) => {
  await ensureStorageDir();

  const fileName = `${slugify(flight.flightNumber ?? flight.flightUid ?? "flight", {
    lower: true,
    strict: true,
  })}-${documentId}.pdf`;
  const filePath = path.join(storageDir, fileName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("Victor Executive - General Declaration", {
      align: "center",
    });
    doc.moveDown();

    doc
      .fontSize(12)
      .text(`Flight UID: ${flight.flightUid}`)
      .text(
        `Route: ${flight.originAirportName} (${flight.originIata}) → ${flight.destinationAirportName} (${flight.destinationIata})`
      )
      .text(`Operator: ${flight.operatorName}`)
      .text(
        `Aircraft: ${flight.aircraftManufacturer} ${flight.aircraftModel} (${flight.aircraftRegistration})`
      )
      .text(`Scheduled Departure: ${flight.scheduledDeparture ?? "TBC"}`)
      .text(`Scheduled Arrival: ${flight.scheduledArrival ?? "TBC"}`)
      .moveDown();

    doc.fontSize(14).text("Crew Members", { underline: true });
    doc.moveDown(0.5);
    crew.forEach((member, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${member.firstName} ${member.lastName} – ${member.position} (${member.nationality ?? "N/A"})`
        );
    });
    if (crew.length === 0) {
      doc.fontSize(12).text("No crew recorded.");
    }
    doc.moveDown();

    doc.fontSize(14).text("Passengers", { underline: true });
    doc.moveDown(0.5);
    passengers.forEach((pax, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${pax.firstName} ${pax.lastName} – ${pax.nationality ?? "N/A"} – Passport ${pax.passportNumber ?? "N/A"}`
        );
    });
    if (passengers.length === 0) {
      doc.fontSize(12).text("No passengers recorded.");
    }
    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Passenger Count: ${passengers.length} | Crew Count: ${crew.length}`,
        { align: "right" }
      );

    doc
      .moveDown(2)
      .fontSize(10)
      .text(
        "This document was generated automatically by Victor Executive platform based on the latest operational data.",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filePath, fileName };
};

