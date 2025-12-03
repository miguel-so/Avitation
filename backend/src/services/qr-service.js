import { randomBytes } from "crypto";
import { getPool } from "../db/pool.js";

const generateToken = () => randomBytes(24).toString("base64url");

export const createQrPass = async (qrId, flightId, payload) => {
  const pool = getPool();
  const token = payload.token ?? generateToken();

  await pool.query(
    `INSERT INTO qr_passes
      (id, flight_id, entity_type, entity_id, token, access_level, issued_at, expires_at, sent_at, status, payload)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON))`,
    [
      qrId,
      flightId,
      payload.entityType,
      payload.entityId,
      token,
      payload.accessLevel ?? "PASSENGER",
      payload.issuedAt ?? new Date(),
      payload.expiresAt ?? null,
      payload.sentAt ?? null,
      payload.status ?? "ACTIVE",
      JSON.stringify(payload.payload ?? {}),
    ]
  );

  return { id: qrId, token };
};

export const updateQrPass = async (qrId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE qr_passes
     SET status = ?, expires_at = ?, sent_at = ?, payload = CAST(? AS JSON)
     WHERE id = ?`,
    [
      payload.status ?? "ACTIVE",
      payload.expiresAt ?? null,
      payload.sentAt ?? null,
      JSON.stringify(payload.payload ?? {}),
      qrId,
    ]
  );
};

export const getQrPassByToken = async (token) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        q.id,
        q.flight_id AS flightId,
        q.entity_type AS entityType,
        q.entity_id AS entityId,
        q.token,
        q.access_level AS accessLevel,
        q.issued_at AS issuedAt,
        q.expires_at AS expiresAt,
        q.sent_at AS sentAt,
        q.status,
        q.payload
     FROM qr_passes q
     WHERE q.token = ?
     LIMIT 1`,
    [token]
  );
  return rows?.[0] ?? null;
};

