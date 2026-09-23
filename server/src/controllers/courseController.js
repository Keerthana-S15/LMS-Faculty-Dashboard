import { query, queryOne } from "../db/pool.js";
import { asyncHandler, notFound, parseId } from "../utils/http.js";
import { validate } from "../utils/validate.js";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80";

const toApi = (row) => ({
  id: row.id,
  title: row.title,
  program: row.program,
  semester: row.semester,
  students: row.students,
  status: row.status,
  image: row.image || DEFAULT_IMAGE,
});

const schema = {
  title: { type: "string", required: true, max: 160, message: "Give the course a name." },
  program: { type: "string", max: 120 },
  semester: { type: "string", max: 60 },
  students: { type: "int", min: 0, max: 100000, message: "Enter a number of students, or leave it blank." },
  status: { type: "enum", values: ["Active", "Draft"] },
  image: { type: "string", max: 512 },
};

export const listCourses = asyncHandler(async (req, res) => {
  const { status, semester, q } = req.query;
  const where = [];
  const params = [];

  if (status && status !== "all") {
    where.push("status = ?");
    params.push(status);
  }
  if (semester && semester !== "all") {
    where.push("semester = ?");
    params.push(semester);
  }
  if (q) {
    where.push("(title LIKE ? OR program LIKE ? OR semester LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const rows = await query(
    `SELECT * FROM courses ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY id DESC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getCourse = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM courses WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Course not found.");
  res.json({ data: toApi(row) });
});

export const createCourse = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  const rows = await query(
    "INSERT INTO courses (title, program, semester, students, status, image) VALUES (?,?,?,?,?,?)",
    [f.title, f.program ?? null, f.semester ?? null, f.students ?? 0, f.status ?? "Active", f.image || DEFAULT_IMAGE]
  );
  const row = await queryOne("SELECT * FROM courses WHERE id = ?", [rows.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const existing = await queryOne("SELECT id FROM courses WHERE id = ?", [id]);
  if (!existing) throw notFound("Course not found.");

  const f = validate(req.body, schema);
  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(f)) {
    sets.push(`\`${key}\` = ?`);
    params.push(key === "image" && !value ? DEFAULT_IMAGE : value);
  }
  if (sets.length) {
    params.push(id);
    await query(`UPDATE courses SET ${sets.join(", ")} WHERE id = ?`, params);
  }

  const row = await queryOne("SELECT * FROM courses WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const result = await query("DELETE FROM courses WHERE id = ?", [id]);
  if (!result.affectedRows) throw notFound("Course not found.");
  res.status(204).end();
});
