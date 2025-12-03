import { getPool } from "../db/pool.js";

export const listNotificationsByFlight = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        flight_id AS flightId,
        authority_type AS authorityType,
        destination,
        document_id AS documentId,
        status,
        response_message AS responseMessage,
        sent_at AS sentAt,
        retry_count AS retryCount,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM authority_notifications
     WHERE flight_id = ?
     ORDER BY created_at DESC`,
    [flightId]
  );
  return rows;
};

export const createNotification = async (notificationId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO authority_notifications
      (id, flight_id, authority_type, destination, document_id, status, response_message, sent_at, retry_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      notificationId,
      payload.flightId,
      payload.authorityType,
      payload.destination ?? null,
      payload.documentId ?? null,
      payload.status ?? "PENDING",
      payload.responseMessage ?? null,
      payload.sentAt ?? null,
      payload.retryCount ?? 0,
    ]
  );
};

export const updateNotificationStatus = async (notificationId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE authority_notifications
     SET status = ?, response_message = ?, sent_at = ?, retry_count = ?
     WHERE id = ?`,
    [
      payload.status,
      payload.responseMessage ?? null,
      payload.sentAt ?? null,
      payload.retryCount ?? 0,
      notificationId,
    ]
  );
};

