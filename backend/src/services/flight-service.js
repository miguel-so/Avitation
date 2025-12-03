import { getPool } from "../db/pool.js";

const baseSelect = `
  SELECT
    f.id,
    f.flight_uid AS flightUid,
    f.flight_number AS flightNumber,
    f.operator_id AS operatorId,
    o.name AS operatorName,
    f.aircraft_type_id AS aircraftTypeId,
    a.model AS aircraftModel,
    a.manufacturer AS aircraftManufacturer,
    f.aircraft_registration AS aircraftRegistration,
    f.mtow_kg AS mtowKg,
    f.origin_airport_id AS originAirportId,
    ao.name AS originAirportName,
    ao.iata_code AS originIata,
    f.destination_airport_id AS destinationAirportId,
    ad.name AS destinationAirportName,
    ad.iata_code AS destinationIata,
    f.departure_date AS departureDate,
    f.scheduled_departure AS scheduledDeparture,
    f.actual_departure AS actualDeparture,
    f.scheduled_arrival AS scheduledArrival,
    f.actual_arrival AS actualArrival,
    f.captain_name AS captainName,
    f.first_officer_name AS firstOfficerName,
    f.passenger_count AS passengerCount,
    f.crew_count AS crewCount,
    f.status,
    f.turnaround_status AS turnaroundStatus,
    f.purpose,
    f.remarks,
    f.created_at AS createdAt,
    f.updated_at AS updatedAt
  FROM flights f
  INNER JOIN operators o ON o.id = f.operator_id
  INNER JOIN aircraft_types a ON a.id = f.aircraft_type_id
  INNER JOIN airports ao ON ao.id = f.origin_airport_id
  INNER JOIN airports ad ON ad.id = f.destination_airport_id
`;

export const listFlights = async ({
  page = 1,
  limit = 20,
  search = "",
  status,
  operatorId,
  originAirportId,
  destinationAirportId,
  departureDateFrom,
  departureDateTo,
}) => {
  const pool = getPool();
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      "(f.flight_number LIKE ? OR o.name LIKE ? OR ao.name LIKE ? OR ad.name LIKE ?)"
    );
    const likeValue = `%${search}%`;
    params.push(likeValue, likeValue, likeValue, likeValue);
  }

  if (status) {
    conditions.push("f.status = ?");
    params.push(status);
  }

  if (operatorId) {
    conditions.push("f.operator_id = ?");
    params.push(operatorId);
  }

  if (originAirportId) {
    conditions.push("f.origin_airport_id = ?");
    params.push(originAirportId);
  }

  if (destinationAirportId) {
    conditions.push("f.destination_airport_id = ?");
    params.push(destinationAirportId);
  }

  if (departureDateFrom) {
    conditions.push("f.departure_date >= ?");
    params.push(departureDateFrom);
  }

  if (departureDateTo) {
    conditions.push("f.departure_date <= ?");
    params.push(departureDateTo);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `${baseSelect}
     ${whereClause}
     ORDER BY f.scheduled_departure ASC
     LIMIT ?
     OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM flights f
     INNER JOIN operators o ON o.id = f.operator_id
     INNER JOIN aircraft_types a ON a.id = f.aircraft_type_id
     INNER JOIN airports ao ON ao.id = f.origin_airport_id
     INNER JOIN airports ad ON ad.id = f.destination_airport_id
     ${whereClause}`,
    params
  );

  return { data: rows, pagination: { page, limit, total } };
};

export const getFlightById = async (flightId) => {
  const pool = getPool();
  const [rows] = await pool.query(`${baseSelect} WHERE f.id = ? LIMIT 1`, [
    flightId,
  ]);

  return rows?.[0] ?? null;
};

export const createFlight = async (flightId, payload) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO flights
      (id, flight_number, flight_uid, operator_id, aircraft_type_id, aircraft_registration, mtow_kg,
       origin_airport_id, destination_airport_id, departure_date, scheduled_departure, scheduled_arrival,
       actual_departure, actual_arrival, captain_name, first_officer_name, passenger_count, crew_count,
       status, turnaround_status, purpose, remarks, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      flightId,
      payload.flightNumber ?? null,
      payload.flightUid,
      payload.operatorId,
      payload.aircraftTypeId,
      payload.aircraftRegistration ?? null,
      payload.mtowKg ?? null,
      payload.originAirportId,
      payload.destinationAirportId,
      payload.departureDate,
      payload.scheduledDeparture ?? null,
      payload.scheduledArrival ?? null,
      payload.actualDeparture ?? null,
      payload.actualArrival ?? null,
      payload.captainName ?? null,
      payload.firstOfficerName ?? null,
      payload.passengerCount ?? 0,
      payload.crewCount ?? 0,
      payload.status ?? "PLANNED",
      payload.turnaroundStatus ?? "NOT_STARTED",
      payload.purpose ?? "PRIVATE",
      payload.remarks ?? null,
      payload.createdBy ?? null,
      payload.updatedBy ?? null,
    ]
  );

  return getFlightById(flightId);
};

export const updateFlight = async (flightId, payload) => {
  const pool = getPool();
  await pool.query(
    `UPDATE flights
     SET
      flight_number = ?,
      operator_id = ?,
      aircraft_type_id = ?,
      aircraft_registration = ?,
      mtow_kg = ?,
      origin_airport_id = ?,
      destination_airport_id = ?,
      departure_date = ?,
      scheduled_departure = ?,
      scheduled_arrival = ?,
      actual_departure = ?,
      actual_arrival = ?,
      captain_name = ?,
      first_officer_name = ?,
      passenger_count = ?,
      crew_count = ?,
      status = ?,
      turnaround_status = ?,
      purpose = ?,
      remarks = ?,
      updated_by = ?
     WHERE id = ?`,
    [
      payload.flightNumber ?? null,
      payload.operatorId,
      payload.aircraftTypeId,
      payload.aircraftRegistration ?? null,
      payload.mtowKg ?? null,
      payload.originAirportId,
      payload.destinationAirportId,
      payload.departureDate,
      payload.scheduledDeparture ?? null,
      payload.scheduledArrival ?? null,
      payload.actualDeparture ?? null,
      payload.actualArrival ?? null,
      payload.captainName ?? null,
      payload.firstOfficerName ?? null,
      payload.passengerCount ?? 0,
      payload.crewCount ?? 0,
      payload.status ?? "PLANNED",
      payload.turnaroundStatus ?? "NOT_STARTED",
      payload.purpose ?? "PRIVATE",
      payload.remarks ?? null,
      payload.updatedBy ?? null,
      flightId,
    ]
  );

  return getFlightById(flightId);
};

export const deleteFlight = async (flightId) => {
  const pool = getPool();
  await pool.query("DELETE FROM flights WHERE id = ?", [flightId]);
};

