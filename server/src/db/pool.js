import mysql from "mysql2/promise";
import { config } from "../config/env.js";

/**
 * Shared connection pool. `dateStrings` is off so DATETIME columns come back
 * as JS Dates and serialise to ISO strings the frontend can parse directly.
 */
export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4_general_ci",
  timezone: "Z",
});

/** Runs a query and returns the rows. */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Runs a query and returns the first row, or null. */
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}

/** Runs `fn` inside a transaction, rolling back on any error. */
export async function withTransaction(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/** Verifies the database is reachable before the server starts listening. */
export async function assertConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}
