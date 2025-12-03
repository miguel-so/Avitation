import { getPool } from "../db/pool.js";

export const listBaggageByFlight = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        b.id,
        b.flight_id AS flightId,
        b.passenger_id AS passengerId,
        p.first_name AS passengerFirstName,
        p.last_name AS passengerLastName,
        b.tag_code AS tagCode,
        b.weight_kg AS weightKg,
        b.pieces,
        b.status,
        b.last_scanned_at AS lastScannedAt,
        b.last_scanned_location AS lastScannedLocation,
        b.notes,
        b.created_at AS createdAt,
        b.updated_at AS updatedAt
     FROM baggage_items b
     LEFT JOIN passengers p ON p.id = b.passenger_id
     WHERE b.flight_id = ?
     ORDER BY b.created_at DESC`,
    [flightId]
  );
  return rows;
};

export const createBaggage = async (baggageId, flightId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO baggage_items
      (id, flight_id, passenger_id, tag_code, weight_kg, pieces, status, last_scanned_at, last_scanned_location, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      baggageId,
      flightId,
      payload.passengerId ?? null,
      payload.tagCode,
      payload.weightKg ?? null,
      payload.pieces ?? 1,
      payload.status ?? "CREATED",
      payload.lastScannedAt ?? null,
      payload.lastScannedLocation ?? null,
      payload.notes ?? null,
    ]
  );
};

export const updateBaggageStatus = async (baggageId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE baggage_items
     SET status = ?, last_scanned_at = ?, last_scanned_location = ?, notes = ?
     WHERE id = ?`,
    [
      payload.status,
      payload.lastScannedAt ?? null,
      payload.lastScannedLocation ?? null,
      payload.notes ?? null,
      baggageId,
    ]
  );
};

export const deleteBaggage = async (baggageId) => {
  const pool = getPool();
  await pool.query("DELETE FROM baggage_items WHERE id = ?", [baggageId]);
};

