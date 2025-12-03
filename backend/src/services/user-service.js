import { getPool } from "../db/pool.js";

export const findUserByEmail = async (email) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.password_hash, u.full_name, u.status, u.role_id, r.name AS role_name
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     WHERE u.email = ?
     LIMIT 1`,
    [email]
  );
  return rows?.[0] ?? null;
};

export const updateLastLogin = async (userId) => {
  const pool = getPool();
  await pool.query(
    "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [userId]
  );
};

export const listUsers = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
        u.id,
        u.email,
        u.full_name AS fullName,
        u.status,
        u.last_login_at AS lastLoginAt,
        u.created_at AS createdAt,
        u.updated_at AS updatedAt,
        r.name AS role
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at DESC`
  );
  return rows;
};

