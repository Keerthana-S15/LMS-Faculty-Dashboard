import "dotenv/config";

/** Reads an env var, falling back to a default; throws when required and unset. */
function read(key, fallback, { required = false } = {}) {
  const value = process.env[key] ?? fallback;
  if (required && (value === undefined || value === "")) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: Number(read("PORT", 4000)),
  db: {
    host: read("DB_HOST", "localhost"),
    port: Number(read("DB_PORT", 3306)),
    user: read("DB_USER", "root"),
    password: read("DB_PASSWORD", ""),
    database: read("DB_NAME", "gcare_lms"),
  },
  corsOrigins: String(read("CORS_ORIGIN", "http://localhost:5173"))
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};
