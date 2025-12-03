import { getPool } from "../db/pool.js";

export const listAirports = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        iata_code AS iataCode,
        icao_code AS icaoCode,
        name,
        city,
        country,
        timezone,
        latitude,
        longitude,
        is_active AS isActive
     FROM airports
     WHERE is_active = 1
     ORDER BY name ASC`
  );
  return rows;
};

export const listAircraftTypes = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        manufacturer,
        model,
        icao_code AS icaoCode,
        iata_code AS iataCode,
        mtow_kg AS mtowKg,
        typical_crew AS typicalCrew,
        typical_pax AS typicalPax,
        is_active AS isActive
     FROM aircraft_types
     WHERE is_active = 1
     ORDER BY manufacturer ASC, model ASC`
  );
  return rows;
};

export const listOperators = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        name,
        address,
        contact_name AS contactName,
        contact_email AS contactEmail,
        contact_phone AS contactPhone,
        billing_email AS billingEmail,
        notes,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM operators
     ORDER BY name ASC`
  );
  return rows;
};

export const listRoles = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, name, description
     FROM roles
     ORDER BY name ASC`
  );
  return rows;
};

export const listDocumentTemplates = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        id,
        name,
        code,
        category,
        version,
        description,
        template_json AS templateJson,
        created_at AS createdAt,
        updated_at AS updatedAt
     FROM document_templates
     ORDER BY name ASC`
  );
  return rows;
};

