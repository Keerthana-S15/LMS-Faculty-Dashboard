import { query, queryOne } from "../db/pool.js";
import { asyncHandler, notFound, parseId } from "../utils/http.js";
import { validate } from "../utils/validate.js";

const toApi = (row) => ({
  id: row.id,
  name: row.name,
  roll: row.roll,
  course: row.course,
  batch: row.batch,
  email: row.email,
  phone: row.phone,
  gender: row.gender,
  status: row.status,
  admissionYear: row.admission_year,
});

const schema = {
  name: { type: "string", required: true, max: 120 },
  roll: { type: "string", required: true, max: 40 },
  course: { type: "string", max: 120 },
  batch: { type: "string", max: 60 },
  email: { type: "email" },
  phone: { type: "string", max: 40 },
  gender: { type: "enum", values: ["Male", "Female", "Other"] },
  status: { type: "enum", values: ["Active", "Inactive"] },
  admissionYear: { type: "int", min: 1900, max: 2200 },
};

const COLUMN = { admissionYear: "admission_year" };
const column = (key) => COLUMN[key] || key;

export const listStudents = asyncHandler(async (req, res) => {
  const { course, batch, status, gender, q } = req.query;
  const where = [];
  const params = [];

  for (const [field, value] of [["course", course], ["batch", batch], ["status", status], ["gender", gender]]) {
    if (value && value !== "all") {
      where.push(`\`${field}\` = ?`);
      params.push(value);
    }
  }
  if (q) {
    where.push("(name LIKE ? OR roll LIKE ? OR email LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const rows = await query(
    `SELECT * FROM students ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY name ASC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getStudent = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM students WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Student not found.");
  res.json({ data: toApi(row) });
});

export const createStudent = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  const result = await query(
    "INSERT INTO students (name, roll, course, batch, email, phone, gender, status, admission_year) VALUES (?,?,?,?,?,?,?,?,?)",
    [f.name, f.roll, f.course ?? null, f.batch ?? null, f.email ?? null, f.phone ?? null,
     f.gender ?? "Female", f.status ?? "Active", f.admissionYear ?? 2023]
  );
  const row = await queryOne("SELECT * FROM students WHERE id = ?", [result.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await queryOne("SELECT id FROM students WHERE id = ?", [id]))) throw notFound("Student not found.");

  const f = validate(req.body, schema);
  const sets = Object.keys(f).map((k) => `\`${column(k)}\` = ?`);
  if (sets.length) await query(`UPDATE students SET ${sets.join(", ")} WHERE id = ?`, [...Object.values(f), id]);

  const row = await queryOne("SELECT * FROM students WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM students WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Student not found.");
  res.status(204).end();
});
