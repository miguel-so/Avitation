import { getPool } from "../db/pool.js";

export const listPassengers = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        passenger_uid AS passengerUid,
        first_name AS firstName,
        last_name AS lastName,
        gender,
        date_of_birth AS dateOfBirth,
        nationality,
        passport_number AS passportNumber,
        passport_country AS passportCountry,
        passport_expiry AS passportExpiry,
        visa_number AS visaNumber,
        email,
        phone,
        arrival_status AS arrivalStatus,
        seat_number AS seatNumber,
        baggage_count AS baggageCount,
        notes,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM passengers
     WHERE flight_id = ?
     ORDER BY last_name ASC, first_name ASC`,
    [flightId]
  );
  return rows;
};

export const getPassenger = async (passengerId) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        flight_id AS flightId,
        passenger_uid AS passengerUid,
        first_name AS firstName,
        last_name AS lastName,
        gender,
        date_of_birth AS dateOfBirth,
        nationality,
        passport_number AS passportNumber,
        passport_country AS passportCountry,
        passport_expiry AS passportExpiry,
        visa_number AS visaNumber,
        email,
        phone,
        arrival_status AS arrivalStatus,
        seat_number AS seatNumber,
        baggage_count AS baggageCount,
        notes,
        created_at AS createdAt,
        updated_at AS UpdatedAt
     FROM passengers
     WHERE id = ?
     LIMIT 1`,
    [passengerId]
  );
  return rows?.[0] ?? null;
};

export const createPassenger = async (passengerId, flightId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO passengers
      (id, flight_id, passenger_uid, first_name, last_name, gender, date_of_birth,
       nationality, passport_number, passport_country, passport_expiry, visa_number,
       email, phone, arrival_status, seat_number, baggage_count, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      passengerId,
      flightId,
      payload.passengerUid,
      payload.firstName,
      payload.lastName,
      payload.gender ?? "OTHER",
      payload.dateOfBirth ?? null,
      payload.nationality ?? null,
      payload.passportNumber ?? null,
      payload.passportCountry ?? null,
      payload.passportExpiry ?? null,
      payload.visaNumber ?? null,
      payload.email ?? null,
      payload.phone ?? null,
      payload.arrivalStatus ?? "SCHEDULED",
      payload.seatNumber ?? null,
      payload.baggageCount ?? 0,
      payload.notes ?? null,
    ]
  );

  return getPassenger(passengerId);
};

export const updatePassenger = async (passengerId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE passengers
     SET
       first_name = ?,
       last_name = ?,
       gender = ?,
       date_of_birth = ?,
       nationality = ?,
       passport_number = ?,
       passport_country = ?,
       passport_expiry = ?,
       visa_number = ?,
       email = ?,
       phone = ?,
       arrival_status = ?,
       seat_number = ?,
       baggage_count = ?,
       notes = ?
     WHERE id = ?`,
    [
      payload.firstName,
      payload.lastName,
      payload.gender ?? "OTHER",
      payload.dateOfBirth ?? null,
      payload.nationality ?? null,
      payload.passportNumber ?? null,
      payload.passportCountry ?? null,
      payload.passportExpiry ?? null,
      payload.visaNumber ?? null,
      payload.email ?? null,
      payload.phone ?? null,
      payload.arrivalStatus ?? "SCHEDULED",
      payload.seatNumber ?? null,
      payload.baggageCount ?? 0,
      payload.notes ?? null,
      passengerId,
    ]
  );

  return getPassenger(passengerId);
};

export const deletePassenger = async (passengerId) => {
  const pool = getPool();
  await pool.query("DELETE FROM passengers WHERE id = ?", [passengerId]);
};

