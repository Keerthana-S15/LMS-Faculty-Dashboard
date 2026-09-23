import { query, queryOne } from "../db/pool.js";
import { asyncHandler, notFound } from "../utils/http.js";
import { validate } from "../utils/validate.js";

/** DB row -> the camelCase shape the dashboard already renders. */
const toApi = (row) =>
  row && {
    id: row.id,
    name: row.name,
    avatar: row.avatar_url || "",
    role: row.role,
    department: row.department,
    college: row.college,
    email: row.email,
    phone: row.phone,
    location: row.location,
    employeeId: row.employee_id,
    joinDate: row.join_date,
    qualification: row.qualification,
    designation: row.designation,
    experience: row.experience,
    teachingSince: row.teaching_since,
    about: row.about,
    stats: {
      liveClassesConducted: row.live_classes_conducted,
      publishedMaterials: row.published_materials,
    },
  };

const schema = {
  name: { type: "string", required: true, max: 120, message: "Name can't be empty." },
  email: { type: "email", required: true },
  phone: { type: "string", max: 40, pattern: /^[\d+\-()\s]{10,}$/, message: "Enter a valid phone number." },
  location: { type: "string", max: 160 },
  department: { type: "string", max: 120 },
  college: { type: "string", max: 160 },
  qualification: { type: "string", max: 160 },
  designation: { type: "string", max: 120 },
  experience: { type: "string", max: 80 },
  teachingSince: { type: "string", max: 20 },
  joinDate: { type: "string", max: 40 },
  about: { type: "string", max: 4000 },
  avatar: { type: "string", max: 512 },
};

const COLUMN = {
  name: "name", email: "email", phone: "phone", location: "location",
  department: "department", college: "college", qualification: "qualification",
  designation: "designation", experience: "experience", teachingSince: "teaching_since",
  joinDate: "join_date", about: "about", avatar: "avatar_url",
};

/** The dashboard is single-faculty: row 1 is the signed-in user. */
async function current() {
  const row = await queryOne("SELECT * FROM faculty ORDER BY id LIMIT 1");
  if (!row) throw notFound("No faculty record found. Run the seed script first.");
  return row;
}

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ data: toApi(await current()) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  // Validate before touching the database so bad input fails fast.
  const fields = validate(req.body, schema);
  const row = await current();

  const sets = [];
  const params = [];
  for (const [key, value] of Object.entries(fields)) {
    sets.push(`\`${COLUMN[key]}\` = ?`);
    params.push(value);
  }
  if (sets.length) {
    params.push(row.id);
    await query(`UPDATE faculty SET ${sets.join(", ")} WHERE id = ?`, params);
  }

  res.json({ data: toApi(await current()) });
});
