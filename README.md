# G Care Council LMS — Faculty Portal

Full-stack faculty dashboard: **React + Vite + Tailwind CSS** frontend and a
**Node.js + Express + MySQL** REST API.

```
LMS-faculty-dashboard-main/
├── src/                 React frontend (unchanged UI)
│   ├── api/             fetch client + one module per resource
│   ├── hooks/           useResource — load / reload / loading / error
│   └── pages/           the 12 dashboard pages
└── server/              Express API
    └── src/
        ├── config/      dotenv-backed config
        ├── db/          mysql2 pool, schema.sql, migrate.js, seed.js
        ├── controllers/ one per resource
        ├── routes/      REST route table
        ├── middleware/  central error handler
        └── utils/       validation helpers
```

## Prerequisites

- Node.js 18+ (tested on 24)
- MySQL 8+ running locally, with a database named `gcare_lms`

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Edit `server/.env` with your MySQL credentials:

```ini
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gcare_lms
CORS_ORIGIN=http://localhost:5173
```

Create the tables and load the starter data:

```bash
npm run db:migrate          # creates the database (if needed) + all tables
npm run db:seed             # fills them with the dashboard's dataset
```

Useful variants:

```bash
npm run db:migrate -- --fresh   # drop every table, then recreate
npm run db:reset                # --fresh migrate + seed in one go
```

Prefer MySQL Workbench? Open and run `server/src/db/schema.sql` there instead
of `db:migrate`, then run `npm run db:seed`.

Start the API:

```bash
npm run dev                 # auto-restarts on change (node --watch)
# or: npm start
```

It prints `API listening on http://localhost:4000/api`. Check it with:

- <http://localhost:4000/api> — index of available endpoints
- <http://localhost:4000/api/health> — server is up
- <http://localhost:4000/api/health/db> — server is up *and* MySQL is reachable

Note the routes live under `/api`; the bare root (<http://localhost:4000/>)
returns a 404 by design.

### 2. Frontend

In a second terminal, from the project root:

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. The Vite dev server proxies `/api` to
`http://localhost:4000`, so no CORS setup is needed while developing.

To point the frontend somewhere else, copy `.env.example` to `.env` and set
`VITE_API_URL` (the URL the browser calls) or `VITE_API_PROXY` (where the dev
proxy forwards).

### Single-port mode (one server, one URL)

Express can serve the built React app and the API together, so everything runs
on **http://localhost:4000** from a single process:

```bash
npm run start               # builds dist/, then starts the API which serves it
```

Already built? Just start the server:

```bash
npm run server              # same as: npm start --prefix server
```

`server/src/app.js` serves `dist/` when it exists and falls back to
`index.html` for any non-`/api` path, so client-side routes and refreshes work.
Rebuild (`npm run build`) after changing frontend code.

Two-terminal development (hot reload) still works exactly as above — Vite on
5173 proxying `/api` to 4000.

## API

Base URL `/api`. Every response is `{ "data": ... }`; every error is
`{ "error": { "message": "...", "details": { "field": "..." } } }`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | API index — lists the available endpoints |
| GET | `/health` | Liveness: is the server up? |
| GET | `/health/db` | Readiness: is MySQL reachable? |
| GET / PUT | `/faculty/profile` | Signed-in faculty record |
| GET / POST | `/courses` | List (filters: `status`, `semester`, `q`) / create |
| GET / PUT / DELETE | `/courses/:id` | Read / update / delete |
| GET / POST | `/students` | List (`course`, `batch`, `status`, `gender`, `q`) / create |
| GET / PUT / DELETE | `/students/:id` | Read / update / delete |
| GET / POST | `/live-classes` | List (`course`, `from`, `to`) / create |
| GET / PUT / DELETE | `/live-classes/:id` | Read / update / delete |
| GET / POST | `/assignments` | List (`status`, `course`, `q`) / create |
| GET / PUT / DELETE | `/assignments/:id` | Read / update / delete |
| GET / POST | `/quizzes` | List with questions / create with questions |
| GET / PUT / DELETE | `/quizzes/:id` | Read / update (replaces questions) / delete |
| GET / POST | `/materials` | List (`type`, `course`, `topic`, `q`) / create |
| GET / PUT / DELETE | `/materials/:id` | Read / update / delete |
| GET / POST | `/announcements` | List (`status`, `audience`, `q`) / create |
| GET / PUT / DELETE | `/announcements/:id` | Read / update / delete |
| GET | `/attendance?course=&batch=&date=` | Register: roster + saved marks |
| PUT | `/attendance` | Save the whole register (upsert per student) |
| GET | `/attendance/summary` | Present / absent / late counts |
| GET / POST | `/conversations` | Threads with messages and files / start a thread |
| GET | `/conversations/stats` | Totals for the Messages stat cards |
| PATCH / DELETE | `/conversations/:id` | Unread count / delete |
| POST | `/conversations/:id/messages` | Send a message |
| POST | `/conversations/:id/files` | Record a shared file |

### Validation & errors

- Request bodies run through a small schema validator; failures return **400**
  with a `details` object, which the forms render next to the matching field.
- Unknown ids return **404**, duplicate keys **409**, and database outages
  **503** with a friendly message. Nothing leaks a raw SQL error.
- Every page shows a skeleton while loading and an error card with a **Try
  again** button if a request fails.

## Database

`server/src/db/schema.sql` defines: `faculty`, `courses`, `students`,
`live_classes`, `assignments`, `quizzes`, `quiz_questions`, `materials`,
`announcements`, `attendance`, `conversations`, `messages`,
`conversation_files`, `message_stats`.

Notes:

- `attendance` is unique per `(course, batch, session_date, student_id)`, so
  saving a register upserts rather than duplicating.
- `quiz_questions` and the message tables cascade on delete.
- Dates are stored as `DATETIME` and returned as ISO strings, which the
  frontend revives into `Date` objects.

## Notes

- Routing: `react-router-dom`. Icons: `lucide-react`. Styling: Tailwind CSS
  with the custom `brand`/`sidebar` palette.
- Fully responsive: the sidebar collapses to a slide-in drawer on mobile.
- Uploaded study material and profile photos stay in the browser as object
  URLs; the API stores the metadata. Add a file-upload endpoint when you need
  the bytes persisted, then save the returned URL.
