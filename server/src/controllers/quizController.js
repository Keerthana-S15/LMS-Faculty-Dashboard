import { query, queryOne, withTransaction } from "../db/pool.js";
import { asyncHandler, badRequest, notFound, parseId } from "../utils/http.js";
import { validate } from "../utils/validate.js";

/** Options are stored as JSON; mysql2 may hand them back as a string. */
const parseOptions = (value) => {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const questionToApi = (row) => ({
  id: String(row.id),
  text: row.text || "",
  options: parseOptions(row.options),
  correct: row.correct_index,
  marks: row.marks,
});

/** Questions/marks/duration are derived, matching what the UI displays. */
const toApi = (row, questions = []) => ({
  id: row.id,
  title: row.title,
  course: row.course,
  meta: row.meta || "",
  durationMins: row.duration_mins,
  duration: `${row.duration_mins} min`,
  status: row.status,
  questionList: questions,
  questions: questions.length,
  marks: questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0),
});

const schema = {
  title: { type: "string", required: true, max: 160, message: "Give the quiz a title." },
  course: { type: "string", required: true, max: 160 },
  meta: { type: "string", max: 120 },
  durationMins: { type: "int", required: true, min: 1, max: 600, message: "Set a duration in minutes." },
  status: { type: "enum", values: ["Published", "Scheduled", "Draft"] },
  questionList: { type: "array" },
};

/** Normalises the question builder payload and rejects malformed entries. */
function normaliseQuestions(list) {
  if (!Array.isArray(list)) return null;
  return list.map((q, i) => {
    const options = Array.isArray(q.options) ? q.options.map((o) => String(o ?? "")) : [];
    if (options.length < 2) {
      throw badRequest("Some fields need your attention.", {
        questionList: `Question ${i + 1} needs at least two options.`,
      });
    }
    const correct = Number(q.correct) || 0;
    if (correct < 0 || correct >= options.length) {
      throw badRequest("Some fields need your attention.", {
        questionList: `Question ${i + 1} has no valid correct answer.`,
      });
    }
    return {
      position: i,
      text: String(q.text ?? ""),
      options,
      correct,
      marks: Math.max(0, Number(q.marks) || 0),
    };
  });
}

async function loadQuestions(quizId) {
  const rows = await query(
    "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY position ASC, id ASC",
    [quizId]
  );
  return rows.map(questionToApi);
}

async function replaceQuestions(conn, quizId, questions) {
  await conn.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quizId]);
  if (!questions.length) return;
  await conn.query(
    "INSERT INTO quiz_questions (quiz_id, position, text, options, correct_index, marks) VALUES ?",
    [questions.map((q) => [quizId, q.position, q.text, JSON.stringify(q.options), q.correct, q.marks])]
  );
}

export const listQuizzes = asyncHandler(async (req, res) => {
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

  const quizzes = await query(
    `SELECT * FROM quizzes ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY id DESC`,
    params
  );
  if (!quizzes.length) return res.json({ data: [] });

  // One extra query for all questions, then group in memory.
  const ids = quizzes.map((q) => q.id);
  const questionRows = await query(
    `SELECT * FROM quiz_questions WHERE quiz_id IN (${ids.map(() => "?").join(",")}) ORDER BY position ASC, id ASC`,
    ids
  );
  const byQuiz = new Map(ids.map((id) => [id, []]));
  for (const row of questionRows) byQuiz.get(row.quiz_id)?.push(questionToApi(row));

  res.json({ data: quizzes.map((row) => toApi(row, byQuiz.get(row.id) ?? [])) });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const row = await queryOne("SELECT * FROM quizzes WHERE id = ?", [id]);
  if (!row) throw notFound("Quiz not found.");
  res.json({ data: toApi(row, await loadQuestions(id)) });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const f = validate(req.body, schema, { requireAll: true });
  const questions = normaliseQuestions(f.questionList) ?? [];

  if (f.status === "Published" && questions.length === 0) {
    throw badRequest("Some fields need your attention.", {
      status: "Add at least one question before publishing.",
    });
  }

  const id = await withTransaction(async (conn) => {
    const [result] = await conn.query(
      "INSERT INTO quizzes (title, course, meta, duration_mins, status) VALUES (?,?,?,?,?)",
      [f.title, f.course, f.meta ?? "", f.durationMins, f.status ?? "Draft"]
    );
    await replaceQuestions(conn, result.insertId, questions);
    return result.insertId;
  });

  const row = await queryOne("SELECT * FROM quizzes WHERE id = ?", [id]);
  res.status(201).json({ data: toApi(row, await loadQuestions(id)) });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const existing = await queryOne("SELECT * FROM quizzes WHERE id = ?", [id]);
  if (!existing) throw notFound("Quiz not found.");

  const f = validate(req.body, schema);
  const questions = normaliseQuestions(f.questionList);

  const nextStatus = f.status ?? existing.status;
  if (nextStatus === "Published") {
    const count = questions ? questions.length : (await loadQuestions(id)).length;
    if (count === 0) {
      throw badRequest("Some fields need your attention.", {
        status: "Add at least one question before publishing.",
      });
    }
  }

  await withTransaction(async (conn) => {
    const COLUMN = { durationMins: "duration_mins" };
    const sets = [];
    const params = [];
    for (const [key, value] of Object.entries(f)) {
      if (key === "questionList") continue;
      sets.push(`\`${COLUMN[key] || key}\` = ?`);
      params.push(value);
    }
    if (sets.length) await conn.query(`UPDATE quizzes SET ${sets.join(", ")} WHERE id = ?`, [...params, id]);
    if (questions) await replaceQuestions(conn, id, questions);
  });

  const row = await queryOne("SELECT * FROM quizzes WHERE id = ?", [id]);
  res.json({ data: toApi(row, await loadQuestions(id)) });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM quizzes WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Quiz not found.");
  res.status(204).end();
});
