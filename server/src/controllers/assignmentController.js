import { query, queryOne } from "../db/pool.js";
import { asyncHandler, badRequest, notFound, parseId } from "../utils/http.js";
import { toSqlDateTime, validate } from "../utils/validate.js";

const toApi = (row) => ({
  id: row.id,
  title: row.title,
  course: row.course,
  meta: row.meta || "",
  description: row.description || "",
  dueAt: row.due_at,
  maxMarks: row.max_marks,
  totalStudents: row.total_students,
  submittedCount: row.submitted_count,
  status: row.status,
});

const STATUSES = ["Draft", "Pending Review", "Reviewed"];

const schema = {
  title: { type: "string", required: true, max: 160, message: "Give the assignment a title." },
  course: { type: "string", required: true, max: 160 },
  meta: { type: "string", max: 120 },
  description: { type: "string", max: 4000 },
  dueAt: { type: "date", required: true, message: "Pick a due date and time." },
  maxMarks: { type: "int", min: 0, max: 1000 },
  totalStudents: { type: "int", min: 1, max: 100000, message: "Enter how many students it goes to." },
  submittedCount: { type: "int", min: 0, max: 100000 },
  status: { type: "enum", values: STATUSES },
};

const COLUMN = {
  dueAt: "due_at", maxMarks: "max_marks",
  totalStudents: "total_students", submittedCount: "submitted_count",
};
const column = (key) => COLUMN[key] || key;

/** Submissions can never exceed the class size. */
function assertCounts(submitted, total) {
  if (submitted !== undefined && total !== undefined && Number(submitted) > Number(total)) {
    throw badRequest("Some fields need your attention.", {
      submittedCount: "Submissions can't be more than the number of students.",
    });
  }
}

export const listAssignments = asyncHandler(async (req, res) => {
  const { status, course, q } = req.query;
  const where = [];
  const params = [];

  if (status && status !== "all") {
    where.push("status = ?");
    params.push(status);
  }
  if (course && course !== "all") {
    where.push("course = ?");
    params.push(course);
  }
  if (q) {
    where.push("(title LIKE ? OR course LIKE ? OR meta LIKE ?)");
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  const rows = await query(
    `SELECT * FROM assignments ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY due_at ASC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getAssignment = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM assignments WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Assignment not found.");
  res.json({ data: toApi(row) });
});

export const createAssignment = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  assertCounts(f.submittedCount ?? 0, f.totalStudents ?? 30);

  const result = await query(
    `INSERT INTO assignments (title, course, meta, description, due_at, max_marks, total_students, submitted_count, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [f.title, f.course, f.meta ?? "", f.description ?? "", toSqlDateTime(f.dueAt),
     f.maxMarks ?? 20, f.totalStudents ?? 30, f.submittedCount ?? 0, f.status ?? "Draft"]
  );
  const row = await queryOne("SELECT * FROM assignments WHERE id = ?", [result.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const existing = await queryOne("SELECT * FROM assignments WHERE id = ?", [id]);
  if (!existing) throw notFound("Assignment not found.");

  const f = validate(req.body, schema);
  assertCounts(
    f.submittedCount ?? existing.submitted_count,
    f.totalStudents ?? existing.total_students
  );

  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(f)) {
    sets.push(`\`${column(key)}\` = ?`);
    params.push(value instanceof Date ? toSqlDateTime(value) : value);
  }
  if (sets.length) await query(`UPDATE assignments SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);

  const row = await queryOne("SELECT * FROM assignments WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM assignments WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Assignment not found.");
  res.status(204).end();
});
