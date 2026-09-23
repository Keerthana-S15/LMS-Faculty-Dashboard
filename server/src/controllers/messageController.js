import { query, queryOne, withTransaction } from "../db/pool.js";
import { asyncHandler, notFound, parseId } from "../utils/http.js";
import { toSqlDateTime, validate } from "../utils/validate.js";

const nowLabel = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

const messageToApi = (row) => ({
  id: String(row.id),
  from: row.sender,
  text: row.text,
  time: row.time_label || "",
});

const toApi = (row, messages = [], files = []) => ({
  id: row.id,
  name: row.name,
  role: row.is_group ? "Group" : row.role,
  meta: row.meta || "",
  isGroup: Boolean(row.is_group),
  unread: row.unread,
  studentId: row.student_ref || "",
  email: row.email || "",
  phone: row.phone || "",
  last: row.last_text || "",
  time: row.last_label || "",
  messages,
  files: files.map((f) => ({ name: f.name, size: f.size_label || "" })),
});

/** Conversations with their messages and files, newest activity first. */
export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await query("SELECT * FROM conversations ORDER BY updated_at DESC, id ASC");
  if (!conversations.length) return res.json({ data: [] });

  const ids = conversations.map((c) => c.id);
  const placeholders = ids.map(() => "?").join(",");
  const messages = await query(
    `SELECT * FROM messages WHERE conversation_id IN (${placeholders}) ORDER BY sent_at ASC, id ASC`,
    ids
  );
  const files = await query(
    `SELECT * FROM conversation_files WHERE conversation_id IN (${placeholders}) ORDER BY id ASC`,
    ids
  );

  const msgBy = new Map(ids.map((id) => [id, []]));
  const fileBy = new Map(ids.map((id) => [id, []]));
  for (const m of messages) msgBy.get(m.conversation_id)?.push(messageToApi(m));
  for (const f of files) fileBy.get(f.conversation_id)?.push(f);

  res.json({ data: conversations.map((c) => toApi(c, msgBy.get(c.id) ?? [], fileBy.get(c.id) ?? [])) });
});

export const getStats = asyncHandler(async (req, res) => {
  const [row] = await query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(unread), 0) AS unread,
            COALESCE(SUM(is_group), 0) AS group_count
       FROM conversations`
  );
  const baseline = await queryOne("SELECT sent_baseline FROM message_stats WHERE id = 1");
  const [sent] = await query("SELECT COUNT(*) AS n FROM messages WHERE sender = 'me'");

  res.json({
    data: {
      total: Number(row.total),
      unread: Number(row.unread),
      groups: Number(row.group_count),
      sent: Number(baseline?.sent_baseline ?? 0) + Number(sent.n),
    },
  });
});

const conversationSchema = {
  name: { type: "string", required: true, max: 120, message: "Pick someone to message." },
  role: { type: "string", max: 60 },
  meta: { type: "string", max: 160 },
  isGroup: { type: "bool" },
  studentId: { type: "string", max: 40 },
  email: { type: "email" },
  phone: { type: "string", max: 40 },
  text: { type: "string", required: true, max: 2000, message: "Write a message." },
};

/**
 * Starts a conversation, or appends to the existing one with the same name —
 * mirroring how the compose modal behaved before.
 */
export const createConversation = asyncHandler(async (req, res) => {
  const f = validate(req.body, conversationSchema, { requireAll: true });
  const label = nowLabel();

  const id = await withTransaction(async (conn) => {
    const [[existing]] = await conn.query("SELECT * FROM conversations WHERE name = ? LIMIT 1", [f.name]);
    let conversationId = existing?.id;

    if (!conversationId) {
      const [result] = await conn.query(
        `INSERT INTO conversations (name, role, meta, is_group, unread, student_ref, email, phone, last_text, last_label)
         VALUES (?,?,?,?,0,?,?,?,?,?)`,
        [f.name, f.role ?? "Student", f.meta ?? "", f.isGroup ?? 0,
         f.studentId ?? null, f.email ?? null, f.phone ?? null, f.text, "Now"]
      );
      conversationId = result.insertId;
    } else {
      await conn.query(
        "UPDATE conversations SET last_text = ?, last_label = 'Now', unread = 0 WHERE id = ?",
        [f.text, conversationId]
      );
    }

    await conn.query(
      "INSERT INTO messages (conversation_id, sender, text, time_label, sent_at) VALUES (?,?,?,?,?)",
      [conversationId, "me", f.text, label, toSqlDateTime(new Date())]
    );
    return conversationId;
  });

  const row = await queryOne("SELECT * FROM conversations WHERE id = ?", [id]);
  const messages = await query("SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC, id ASC", [id]);
  const files = await query("SELECT * FROM conversation_files WHERE conversation_id = ? ORDER BY id ASC", [id]);

  res.status(201).json({ data: toApi(row, messages.map(messageToApi), files) });
});

export const updateConversation = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await queryOne("SELECT id FROM conversations WHERE id = ?", [id]))) {
    throw notFound("Conversation not found.");
  }

  const f = validate(req.body, { unread: { type: "int", min: 0, max: 999 } });
  if (f.unread !== undefined) {
    await query("UPDATE conversations SET unread = ? WHERE id = ?", [f.unread, id]);
  }

  const row = await queryOne("SELECT * FROM conversations WHERE id = ?", [id]);
  res.json({ data: toApi(row) });
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM conversations WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw notFound("Conversation not found.");
  res.status(204).end();
});

const messageSchema = {
  text: { type: "string", required: true, max: 2000, message: "Write a message." },
  from: { type: "enum", values: ["me", "them"] },
};

export const sendMessage = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await queryOne("SELECT id FROM conversations WHERE id = ?", [id]))) {
    throw notFound("Conversation not found.");
  }

  const f = validate(req.body, messageSchema, { requireAll: true });
  const label = nowLabel();

  const messageId = await withTransaction(async (conn) => {
    const [result] = await conn.query(
      "INSERT INTO messages (conversation_id, sender, text, time_label, sent_at) VALUES (?,?,?,?,?)",
      [id, f.from ?? "me", f.text, label, toSqlDateTime(new Date())]
    );
    await conn.query(
      "UPDATE conversations SET last_text = ?, last_label = 'Now' WHERE id = ?",
      [f.text, id]
    );
    return result.insertId;
  });

  const row = await queryOne("SELECT * FROM messages WHERE id = ?", [messageId]);
  res.status(201).json({ data: messageToApi(row) });
});

const fileSchema = {
  name: { type: "string", required: true, max: 255 },
  size: { type: "string", max: 40 },
};

/** Records a shared file and posts the matching chat bubble. */
export const addFile = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  if (!(await queryOne("SELECT id FROM conversations WHERE id = ?", [id]))) {
    throw notFound("Conversation not found.");
  }

  const f = validate(req.body, fileSchema, { requireAll: true });
  const text = `📎 ${f.name}`;
  const label = nowLabel();

  await withTransaction(async (conn) => {
    await conn.query("INSERT INTO conversation_files (conversation_id, name, size_label) VALUES (?,?,?)", [
      id, f.name, f.size ?? "",
    ]);
    await conn.query(
      "INSERT INTO messages (conversation_id, sender, text, time_label, sent_at) VALUES (?,?,?,?,?)",
      [id, "me", text, label, toSqlDateTime(new Date())]
    );
    await conn.query("UPDATE conversations SET last_text = ?, last_label = 'Now' WHERE id = ?", [text, id]);
  });

  const row = await queryOne("SELECT * FROM conversations WHERE id = ?", [id]);
  const messages = await query("SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC, id ASC", [id]);
  const files = await query("SELECT * FROM conversation_files WHERE conversation_id = ? ORDER BY id ASC", [id]);

  res.status(201).json({ data: toApi(row, messages.map(messageToApi), files) });
});
