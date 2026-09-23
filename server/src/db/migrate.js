/**
 * Creates the database and tables from schema.sql.
 *   node src/db/migrate.js            create anything missing
 *   node src/db/migrate.js --fresh    drop every table first, then recreate
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { config } from "../config/env.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const fresh = process.argv.includes("--fresh");

const TABLES = [
  "attendance",
  "conversation_files",
  "messages",
  "conversations",
  "message_stats",
  "quiz_questions",
  "quizzes",
  "assignments",
  "materials",
  "announcements",
  "live_classes",
  "students",
  "courses",
  "faculty",
];

async function main() {
  const sql = await fs.readFile(path.join(here, "schema.sql"), "utf8");

  // Connect without a database first — schema.sql creates it.
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    if (fresh) {
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      await conn.query(`USE \`${config.db.database}\``);
      await conn.query("SET FOREIGN_KEY_CHECKS = 0");
      for (const table of TABLES) await conn.query(`DROP TABLE IF EXISTS \`${table}\``);
      await conn.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("Dropped existing tables.");
    }

    // schema.sql hardcodes `gcare_lms`; honour DB_NAME when it differs.
    const statements = sql.replaceAll("`gcare_lms`", `\`${config.db.database}\``);
    await conn.query(statements);
    console.log(`Schema applied to \`${config.db.database}\`.`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
