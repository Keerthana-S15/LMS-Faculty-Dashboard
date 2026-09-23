import { query, queryOne } from "../db/pool.js";
import { asyncHandler, badRequest, notFound, parseId } from "../utils/http.js";
import { toSqlDateTime, validate } from "../utils/validate.js";

const toApi = (row) => ({
  id: row.id,
  title: row.title,
  course: row.course,
  year: row.year,
  batch: row.batch,
  room: row.room,
  startAt: row.start_at,
  endAt: row.end_at,
  meetingLink: row.meeting_link || "",
});

const schema = {
  title: { type: "string", required: true, max: 160, message: "Give the class a title." },
  course: { type: "string", required: true, max: 160 },
  year: { type: "string", max: 40 },
  batch: { type: "string", max: 60 },
  room: { type: "string", max: 60 },
  startAt: { type: "date", required: true, message: "Pick a start date and time." },
  endAt: { type: "date", required: true, message: "Pick an end date and time." },
  meetingLink: { type: "string", max: 512 },
};

const COLUMN = { startAt: "start_at", endAt: "end_at", meetingLink: "meeting_link" };
const column = (key) => COLUMN[key] || key;

/** Rejects an end time that isn't after the start. */
function assertRange(start, end) {
  if (start && end && new Date(end) <= new Date(start)) {
    throw badRequest("Some fields need your attention.", {
      endAt: "The class must end after it starts.",
    });
  }
}

export const listLiveClasses = asyncHandler(async (req, res) => {
  const { course, from, to } = req.query;
  const where = [];
  const params = [];

  if (course && course !== "all") {
    where.push("course = ?");
    params.push(course);
  }
  if (from) {
    where.push("start_at >= ?");
    params.push(toSqlDateTime(from));
  }
  if (to) {
    where.push("start_at <= ?");
    params.push(toSqlDateTime(to));
  }

  const rows = await query(
    `SELECT * FROM live_classes ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY start_at ASC`,
    params
  );
  res.json({ data: rows.map(toApi) });
});

export const getLiveClass = asyncHandler(async (req, res) => {
  const row = await queryOne("SELECT * FROM live_classes WHERE id = ?", [parseId(req.params.id)]);
  if (!row) throw notFound("Live class not found.");
  res.json({ data: toApi(row) });
});

export const createLiveClass = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  assertRange(f.startAt, f.endAt);

  const result = await query(
    "INSERT INTO live_classes (title, course, year, batch, room, start_at, end_at, meeting_link) VALUES (?,?,?,?,?,?,?,?)",
    [f.title, f.course, f.year ?? null, f.batch ?? null, f.room ?? null,
     toSqlDateTime(f.startAt), toSqlDateTime(f.endAt), f.meetingLink ?? ""]
  );
  const row = await queryOne("SELECT * FROM live_classes WHERE id = ?", [result.insertId]);
  res.status(201).json({ data: toApi(row) });
});

export const updateLiveClass = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const existing = await queryOne("SELECT * FROM live_classes WHERE id = ?", [id]);
  if (!existing) throw notFound("Live class not found.");

  const f = validate(req.body, schema);
  assertRange(f.startAt ?? existing.start_at, f.endAt ?? existing.end_at);

  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(f)) {
    sets.push(`\`${column(key)}\` = ?`);
    params.push(value instanceof Date ? toSqlDateTime(value) : value);
  }
  if (sets.length) await query(`UPDATE live_classes SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);

  const row = await queryOne("SELECT * FROM live_classes WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteLiveClass = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM live_classes WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Live class not found.");
  res.status(204).end();
});
