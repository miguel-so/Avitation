import { getPool } from "../db/pool.js";

export const createRefreshToken = async (tokenId, userId, token, expiresAt) => {
  const pool = getPool();
  await pool.query(
    `INSERT INTO refresh_tokens (id, user_id, token, expires_at)
     VALUES (?, ?, ?, ?)`,
    [tokenId, userId, token, expiresAt]
  );
};

export const findRefreshToken = async (token) => {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, user_id, token, expires_at
     FROM refresh_tokens
     WHERE token = ?
     LIMIT 1`,
    [token]
  );
  return rows?.[0] ?? null;
};

export const deleteRefreshToken = async (token) => {
  const pool = getPool();
  await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [token]);
};

export const deleteRefreshTokensForUser = async (userId) => {
  const pool = getPool();
  await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
};

