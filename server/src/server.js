import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { assertConnection, pool } from "./db/pool.js";

async function start() {
  try {
    await assertConnection();
    console.log(`Connected to MySQL database "${config.db.database}" at ${config.db.host}:${config.db.port}`);
  } catch (err) {
    console.error("Could not connect to MySQL:", err.message);
    console.error("Check server/.env, make sure MySQL is running, then run: npm run db:migrate && npm run db:seed");
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(config.port, () => {
    const base = `http://localhost:${config.port}`;
    console.log(`API listening on ${base}/api`);
    if (app.locals.servesFrontend) {
      console.log(`Dashboard served on ${base}`);
    } else {
      console.log(
        "No frontend build found — run `npm run build` in the project root to " +
          "serve the dashboard from this port, or use the Vite dev server."
      );
    }
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down…`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
