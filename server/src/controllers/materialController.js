import { query, queryOne } from "../db/pool.js";
import { asyncHandler, badRequest, notFound, parseId } from "../utils/http.js";
import { toSqlDateTime, validate } from "../utils/validate.js";

const toApi = (row) => ({
  id: row.id,
  title: row.title,
  course: row.course,
  meta: row.meta || "",
  topic: row.topic || "",
  type: row.type,
  ext: row.ext || "",
  sizeLabel: row.size_label || "-",
  url: row.url || "",
  uploadedAt: row.uploaded_at,
});

const TYPES = ["Document", "Video", "Audio", "Link"];

const schema = {
  title: { type: "string", required: true, max: 200, message: "Give the material a title." },
  course: { type: "string", required: true, max: 160 },
  meta: { type: "string", max: 120 },
  topic: { type: "string", max: 160 },
  type: { type: "enum", values: TYPES },
  ext: { type: "string", max: 20 },
  sizeLabel: { type: "string", max: 40 },
  url: { type: "string", max: 1024 },
  uploadedAt: { type: "date" },
};

const COLUMN = { sizeLabel: "size_label", uploadedAt: "uploaded_at" };
const column = (key) => COLUMN[key] || key;

export const listMaterials = asyncHandler(async (req, res) => {
  const { type, course, topic, q } = req.query;
  const where = [];
  const params = [];

  for (const [field, value] of [["type", type], ["course", course], ["topic", topic]]) {
    if (value && value !== "all") {
      where.push(`\`${field}\` = ?`);
      params.push(value);
    }
  }
  if (q) {
    where.push("(title LIKE ? OR course LIKE ? OR topic LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const rows = await query(
    `SELECT * FROM materials ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY uploaded_at DESC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getMaterial = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM materials WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Material not found.");
  res.json({ data: toApi(row) });
});

export const createMaterial = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  if (f.type === "Link" && !f.url) {
    throw badRequest("Some fields need your attention.", { url: "Paste the link to share." });
  }

  const result = await query(
    `INSERT INTO materials (title, course, meta, topic, type, ext, size_label, url, uploaded_at)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [f.title, f.course, f.meta ?? "", f.topic ?? "", f.type ?? "Document", f.ext ?? "",
     f.sizeLabel ?? "-", f.url ?? "", toSqlDateTime(f.uploadedAt ?? new Date())]
  );
  const row = await queryOne("SELECT * FROM materials WHERE id = ?", [result.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateMaterial = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const existing = await queryOne("SELECT * FROM materials WHERE id = ?", [id]);
  if (!existing) throw notFound("Material not found.");

  const f = validate(req.body, schema);
  if ((f.type ?? existing.type) === "Link" && !(f.url ?? existing.url)) {
    throw badRequest("Some fields need your attention.", { url: "Paste the link to share." });
  }

  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(f)) {
    sets.push(`\`${column(key)}\` = ?`);
    params.push(value instanceof Date ? toSqlDateTime(value) : value);
  }
  if (sets.length) await query(`UPDATE materials SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);

  const row = await queryOne("SELECT * FROM materials WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM materials WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Material not found.");
  res.status(204).end();
});
