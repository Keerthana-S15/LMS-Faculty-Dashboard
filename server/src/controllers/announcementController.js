import { query, queryOne } from "../db/pool.js";
import { asyncHandler, notFound, parseId } from "../utils/http.js";
import { toSqlDateTime, validate } from "../utils/validate.js";

const toApi = (row) => ({
  id: row.id,
  title: row.title,
  body: row.body || "",
  audience: row.audience,
  priority: row.priority,
  status: row.status,
  pinned: Boolean(row.pinned),
  postedAt: row.posted_at,
});

const schema = {
  title: { type: "string", required: true, max: 200, message: "Give the announcement a title." },
  body: { type: "string", required: true, max: 4000, message: "Write the announcement." },
  audience: { type: "string", max: 120 },
  priority: { type: "enum", values: ["Normal", "Important", "Urgent"] },
  status: { type: "enum", values: ["Published", "Scheduled", "Draft"] },
  pinned: { type: "bool" },
  postedAt: { type: "date" },
};

const COLUMN = { postedAt: "posted_at" };
const column = (key) => COLUMN[key] || key;

export const listAnnouncements = asyncHandler(async (req, res) => {
  const { status, audience, q } = req.query;
  const where = [];
  const params = [];

  for (const [field, value] of [["status", status], ["audience", audience]]) {
    if (value && value !== "all") {
      where.push(`\`${field}\` = ?`);
      params.push(value);
    }
  }
  if (q) {
    where.push("(title LIKE ? OR body LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }

  // Pinned first, newest next — the order the list renders in.
  const rows = await query(
    `SELECT * FROM announcements ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY pinned DESC, posted_at DESC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getAnnouncement = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM announcements WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Announcement not found.");
  res.json({ data: toApi(row) });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  const result = await query(
    "INSERT INTO announcements (title, body, audience, priority, status, pinned, posted_at) VALUES (?,?,?,?,?,?,?)",
    [f.title, f.body, f.audience ?? "All Students", f.priority ?? "Normal",
     f.status ?? "Published", f.pinned ?? 0, toSqlDateTime(f.postedAt ?? new Date())]
  );
  const row = await queryOne("SELECT * FROM announcements WHERE id = ?", [result.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await queryOne("SELECT id FROM announcements WHERE id = ?", [id]))) {
    throw notFound("Announcement not found.");
  }

  const f = validate(req.body, schema);
  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(f)) {
    sets.push(`\`${column(key)}\` = ?`);
    params.push(value instanceof Date ? toSqlDateTime(value) : value);
  }
  if (sets.length) await query(`UPDATE announcements SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);

  const row = await queryOne("SELECT * FROM announcements WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM announcements WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Announcement not found.");
  res.status(204).end();
});
