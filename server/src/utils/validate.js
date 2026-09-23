import { badRequest } from "./http.js";

/**
 * Small schema validator — enough for this API and dependency-free.
 *
 *   validate(req.body, {
 *     title:  { type: "string", required: true, max: 160 },
 *     status: { type: "enum", values: ["Draft", "Published"] },
 *   })
 *
 * Returns a clean object containing only the declared keys. Fields that are
 * absent are omitted (so the same schema works for POST and PATCH), and every
 * failure is collected so the client gets all of them at once.
 */
export function validate(body, schema, { requireAll = false } = {}) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw badRequest("Request body must be a JSON object.");
  }

  const out = {};
  const errors = {};

  for (const [key, rule] of Object.entries(schema)) {
    const present = Object.prototype.hasOwnProperty.call(body, key);
    let value = body[key];

    if (!present || value === undefined || value === null || value === "") {
      const missing = rule.required && (requireAll || !present || value === "" || value === null);
      if (missing) {
        errors[key] = rule.message || `${label(key)} is required.`;
      } else if (present && rule.nullable) {
        out[key] = null;
      } else if (present && rule.type === "string" && value === "") {
        out[key] = "";
      }
      continue;
    }

    switch (rule.type) {
      case "string": {
        value = String(value).trim();
        if (rule.required && !value) {
          errors[key] = rule.message || `${label(key)} is required.`;
          continue;
        }
        if (rule.max && value.length > rule.max) {
          errors[key] = `${label(key)} must be ${rule.max} characters or fewer.`;
          continue;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[key] = rule.message || `${label(key)} is not valid.`;
          continue;
        }
        out[key] = value;
        break;
      }
      case "int": {
        const n = Number(value);
        if (!Number.isFinite(n) || !Number.isInteger(n)) {
          errors[key] = rule.message || `${label(key)} must be a whole number.`;
          continue;
        }
        if (rule.min !== undefined && n < rule.min) {
          errors[key] = `${label(key)} must be ${rule.min} or more.`;
          continue;
        }
        if (rule.max !== undefined && n > rule.max) {
          errors[key] = `${label(key)} must be ${rule.max} or less.`;
          continue;
        }
        out[key] = n;
        break;
      }
      case "bool": {
        out[key] = value === true || value === 1 || value === "true" || value === "1" ? 1 : 0;
        break;
      }
      case "enum": {
        const v = String(value);
        if (!rule.values.includes(v)) {
          errors[key] = rule.message || `${label(key)} must be one of: ${rule.values.join(", ")}.`;
          continue;
        }
        out[key] = v;
        break;
      }
      case "date": {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) {
          errors[key] = rule.message || `${label(key)} must be a valid date.`;
          continue;
        }
        out[key] = d;
        break;
      }
      case "email": {
        const v = String(value).trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          errors[key] = rule.message || "Enter a valid email address.";
          continue;
        }
        out[key] = v;
        break;
      }
      case "array": {
        if (!Array.isArray(value)) {
          errors[key] = rule.message || `${label(key)} must be a list.`;
          continue;
        }
        out[key] = value;
        break;
      }
      default:
        out[key] = value;
    }
  }

  if (Object.keys(errors).length) {
    throw badRequest("Some fields need your attention.", errors);
  }
  if (!requireAll && Object.keys(out).length === 0) {
    throw badRequest("No valid fields were provided.");
  }
  return out;
}

/** "totalStudents" -> "Total students" for readable messages. */
function label(key) {
  const spaced = key.replace(/([A-Z])/g, " $1").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** MySQL DATETIME string from a Date (or a value a Date can parse). */
export const toSqlDateTime = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

/** MySQL DATE string (YYYY-MM-DD). */
export const toSqlDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
};
