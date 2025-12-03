import { getPool } from "../db/pool.js";

export const listCrew = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        crew_uid AS crewUid,
        first_name AS firstName,
        last_name AS lastName,
        nationality,
        position,
        duty_type AS dutyType,
        license_number AS licenseNumber,
        license_expiry AS licenseExpiry,
        arrival_status AS arrivalStatus,
        notes,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM crew_members
     WHERE flight_id = ?
     ORDER BY position ASC, last_name ASC`,
    [flightId]
  );
  return rows;
};

export const getCrewMember = async (crewId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        flight_id AS flightId,
        crew_uid AS crewUid,
        first_name AS firstName,
        last_name AS lastName,
        nationality,
        position,
        duty_type AS dutyType,
        license_number AS licenseNumber,
        license_expiry AS licenseExpiry,
        arrival_status AS arrivalStatus,
        notes,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM crew_members
     WHERE id = ?
     LIMIT 1`,
    [crewId]
  );
  return rows?.[0] ?? null;
};

export const createCrewMember = async (crewId, flightId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO crew_members
      (id, flight_id, crew_uid, first_name, last_name, nationality, position,
       duty_type, license_number, license_expiry, arrival_status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      crewId,
      flightId,
      payload.crewUid,
      payload.firstName,
      payload.lastName,
      payload.nationality ?? null,
      payload.position ?? null,
      payload.dutyType ?? "OPERATING",
      payload.licenseNumber ?? null,
      payload.licenseExpiry ?? null,
      payload.arrivalStatus ?? "SCHEDULED",
      payload.notes ?? null,
    ]
  );

  return getCrewMember(crewId);
};

export const updateCrewMember = async (crewId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE crew_members
     SET
       first_name = ?,
       last_name = ?,
       nationality = ?,
       position = ?,
       duty_type = ?,
       license_number = ?,
       license_expiry = ?,
       arrival_status = ?,
       notes = ?
     WHERE id = ?`,
    [
      payload.firstName,
      payload.lastName,
      payload.nationality ?? null,
      payload.position ?? null,
      payload.dutyType ?? "OPERATING",
      payload.licenseNumber ?? null,
      payload.licenseExpiry ?? null,
      payload.arrivalStatus ?? "SCHEDULED",
      payload.notes ?? null,
      crewId,
    ]
  );

  return getCrewMember(crewId);
};

export const deleteCrewMember = async (crewId) => {
  const pool = getPool();
  await pool.query("DELETE FROM crew_members WHERE id = ?", [crewId]);
};

