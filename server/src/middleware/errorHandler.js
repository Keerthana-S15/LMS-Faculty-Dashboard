import { HttpError } from "../utils/http.js";

/** 404 for unknown routes. */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.originalUrl}` } });
}

/**
 * Single place where every failure becomes a JSON body of the shape
 * `{ error: { message, details? } }`, which the frontend api client reads.
 */
export function errorHandler(err, req, res, _next) { // eslint-disable-line no-unused-vars
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  // Malformed JSON from express.json()
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "Request body is not valid JSON." } });
  }

  // Friendly messages for the MySQL errors this API can realistically hit.
  switch (err?.code) {
    case "ER_DUP_ENTRY":
      return res.status(409).json({ error: { message: "That record already exists." } });
    case "ER_NO_REFERENCED_ROW":
    case "ER_NO_REFERENCED_ROW_2":
      return res.status(400).json({ error: { message: "A referenced record does not exist." } });
    case "ER_ROW_IS_REFERENCED":
    case "ER_ROW_IS_REFERENCED_2":
      return res.status(409).json({ error: { message: "That record is still in use elsewhere." } });
    case "ER_DATA_TOO_LONG":
      return res.status(400).json({ error: { message: "One of the values is too long." } });
    case "ECONNREFUSED":
    case "PROTOCOL_CONNECTION_LOST":
    case "ER_ACCESS_DENIED_ERROR":
    case "ER_BAD_DB_ERROR":
      console.error("Database error:", err.message);
      return res.status(503).json({ error: { message: "The database is unavailable. Please try again." } });
    default:
      break;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: { message: "Something went wrong on the server." } });
}
