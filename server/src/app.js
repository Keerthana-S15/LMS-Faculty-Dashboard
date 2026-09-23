import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { HttpError } from "./utils/http.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  /*  A browser sends an Origin header on POST/PUT/DELETE even when the request
      is same-origin, so a too-strict allow-list breaks every write while reads
      keep working. In development we therefore accept any localhost port (the
      Vite dev server moves to 5174+ when 5173 is taken); in production only the
      origins listed in CORS_ORIGIN are allowed.  */
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = (origin) =>
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);

  app.use(
    cors({
      origin(origin, callback) {
        // Requests with no Origin header (curl, same-origin GET) are fine.
        if (!origin) return callback(null, true);
        if (config.corsOrigins.includes(origin)) return callback(null, true);
        if (!isProduction && isLocalhost(origin)) return callback(null, true);
        callback(new HttpError(403, `Origin ${origin} is not allowed by CORS.`));
      },
    })
  );
  app.use(express.json({ limit: "1mb" }));

  // One-line request log, enough to follow what the dashboard is calling.
  app.use((req, res, next) => {
    const started = Date.now();
    res.on("finish", () => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`);
    });
    next();
  });

  app.use("/api", routes);

  /*  Single-port mode: serve the built React app from the same server.
      `npm run build` (in the project root) writes dist/; when it exists we
      serve those files and send index.html for any non-/api path so the
      client-side router keeps working on refresh and deep links.
      In development this folder is usually absent — Vite serves the UI on
      5173 and proxies /api here — so the block simply does nothing.  */
  const here = path.dirname(fileURLToPath(import.meta.url));
  const distDir = path.resolve(here, "../../dist");
  const indexHtml = path.join(distDir, "index.html");
  const hasBuild = fs.existsSync(indexHtml);

  if (hasBuild) {
    app.use(
      express.static(distDir, {
        index: false,
        // Hashed asset filenames can be cached hard; index.html must not be.
        setHeaders(res, filePath) {
          if (filePath.endsWith("index.html")) res.setHeader("Cache-Control", "no-cache");
        },
      })
    );

    // SPA fallback — everything that isn't an API call renders the app.
    app.get(/^\/(?!api\/).*/, (req, res, next) => {
      if (req.method !== "GET") return next();
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(indexHtml);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.locals.servesFrontend = hasBuild;
  app.locals.distDir = distDir;

  return app;
}
