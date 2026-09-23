/**
 * Thin fetch wrapper around the Express API.
 *
 * Every response is `{ data, meta? }` on success and `{ error: { message,
 * details? } }` on failure, so pages can rely on one error shape. The base URL
 * comes from VITE_API_URL and defaults to "/api", which the Vite dev server
 * proxies to the backend.
 */
const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

/** Error thrown for any non-2xx response; `details` holds per-field messages. */
export class ApiError extends Error {
  constructor(message, { status = 0, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/** Revives ISO date strings into Date objects, which the pages expect. */
function revive(value) {
  if (Array.isArray(value)) return value.map(revive);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = revive(v);
    return out;
  }
  if (typeof value === "string" && ISO_DATE.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return value;
}

/** Appends defined, non-"all" query params. */
function withQuery(path, params) {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Readable fallback when the response carries no error message of its own. */
function describeStatus(status) {
  // 502/503/504 from the dev proxy mean the API process isn't answering.
  if (status === 502 || status === 503 || status === 504) {
    return "Can't reach the API server. Make sure it's running (cd server && npm run dev).";
  }
  if (status === 404) return "That item no longer exists.";
  if (status === 409) return "That record already exists.";
  return `Request failed (${status}).`;
}

async function request(method, path, { body, params, signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${withQuery(path, params)}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Is the API running?", { status: 0 });
  }

  if (res.status === 204) return null;

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    if (!res.ok) throw new ApiError(describeStatus(res.status), { status: res.status });
    return null;
  }

  if (!res.ok) {
    const error = payload?.error ?? {};
    throw new ApiError(error.message || describeStatus(res.status), {
      status: res.status,
      details: error.details,
    });
  }

  return revive(payload?.data ?? null);
}

export const api = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
};

/** Turns any thrown error into a message safe to show in a Notice. */
export const errorMessage = (err, fallback = "Something went wrong.") => {
  if (err instanceof ApiError) {
    const first = err.details && Object.values(err.details).find(Boolean);
    return first || err.message || fallback;
  }
  return err?.message || fallback;
};
