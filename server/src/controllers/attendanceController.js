import { query, withTransaction } from "../db/pool.js";
import { asyncHandler, badRequest } from "../utils/http.js";
import { toSqlDate, validate } from "../utils/validate.js";

const SESSIONS = ["s1", "s2"];
const STATUSES = ["Present", "Absent", "Late"];

/**
 * A register is the full roster for a course + batch + date, with whatever has
 * been saved for that day merged in. Students with no saved row come back
 * unmarked, which is what the page expects for a fresh day.
 */
export const getRegister = asyncHandler(async (req, res) => {
  const { course, batch, date } = req.query;
  if (!course || !batch || !date) {
    throw badRequest("Some fields need your attention.", {
      course: !course ? "Pick a course." : undefined,
      batch: !batch ? "Pick a batch." : undefined,
      date: !date ? "Pick a date." : undefined,
    });
  }
  const day = toSqlDate(date);

  const rows = await query(
    `SELECT s.id, s.name, s.roll,
            a.session, a.status, a.check_in, a.check_out, a.remarks
       FROM students s
       LEFT JOIN attendance a
         ON a.student_id = s.id AND a.course = ? AND a.batch = ? AND a.session_date = ?
      ORDER BY s.id ASC`,
    [course, batch, day]
  );

  const data = rows.map((r, i) => ({
    id: r.id,
    name: r.name,
    roll: r.roll,
    session: r.session || SESSIONS[i % SESSIONS.length],
    status: r.status || "",
    checkIn: r.check_in || "",
    checkOut: r.check_out || "",
    remarks: r.remarks || "",
  }));

  res.json({ data, meta: { course, batch, date: day, total: data.length } });
});

const rowSchema = {
  id: { type: "int", required: true, min: 1 },
  session: { type: "enum", values: SESSIONS },
  status: { type: "enum", values: STATUSES, nullable: true },
  checkIn: { type: "string", max: 20 },
  checkOut: { type: "string", max: 20 },
  remarks: { type: "string", max: 255 },
};

/** Saves the whole register in one transaction (upsert per student). */
export const saveRegister = asyncHandler(async (req, res) => {
  const { course, batch, date, rows } = req.body ?? {};
  if (!course || !batch || !date) {
    throw badRequest("Course, batch and date are required.");
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    throw badRequest("Send the register rows to save.");
  }
  const day = toSqlDate(date);

  const known = await query("SELECT id FROM students");
  const validIds = new Set(known.map((s) => s.id));

  const cleaned = rows.map((raw, i) => {
    const r = validate(raw, rowSchema, { requireAll: false });
    if (!validIds.has(r.id)) {
      throw badRequest(`Row ${i + 1} refers to a student that no longer exists.`);
    }
    return {
      id: r.id,
      session: r.session ?? SESSIONS[i % SESSIONS.length],
      status: r.status || null,
      checkIn: r.checkIn ?? "",
      checkOut: r.checkOut ?? "",
      remarks: r.remarks ?? "",
    };
  });

  await withTransaction(async (conn) => {
    await conn.query(
      `INSERT INTO attendance
         (course, batch, session_date, student_id, session, status, check_in, check_out, remarks)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         session   = VALUES(session),
         status    = VALUES(status),
         check_in  = VALUES(check_in),
         check_out = VALUES(check_out),
         remarks   = VALUES(remarks)`,
      [cleaned.map((r) => [course, batch, day, r.id, r.session, r.status, r.checkIn, r.checkOut, r.remarks])]
    );
  });

  res.json({ data: { saved: cleaned.length }, meta: { course, batch, date: day } });
});

/** Summary counts for a register — handy for reports and the stat cards. */
export const getSummary = asyncHandler(async (req, res) => {
  const { course, batch, date } = req.query;
  if (!course || !batch || !date) throw badRequest("Course, batch and date are required.");

  const [row] = await query(
    `SELECT
       (SELECT COUNT(*) FROM students) AS total,
       SUM(a.status = 'Present') AS present,
       SUM(a.status = 'Absent')  AS absent,
       SUM(a.status = 'Late')    AS late
     FROM attendance a
     WHERE a.course = ? AND a.batch = ? AND a.session_date = ?`,
    [course, batch, toSqlDate(date)]
  );

  const present = Number(row?.present || 0);
  const absent = Number(row?.absent || 0);
  const late = Number(row?.late || 0);
  const total = Number(row?.total || 0);

  res.json({ data: { total, present, absent, late, unmarked: total - (present + absent + late) } });
});
