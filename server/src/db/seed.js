/**
 * Seeds the database with the dataset the dashboard originally shipped with
 * (the former src/data/mockData.js). Safe to re-run: it clears the tables it
 * fills first, so `npm run db:seed` always produces the same starting point.
 */
import { pool, withTransaction } from "./pool.js";

/* Dates are generated relative to today so countdowns, the week calendar and
   the "live now" states stay meaningful whenever the project is seeded. */
const at = (dayOffset, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};
const sql = (d) => d.toISOString().slice(0, 19).replace("T", " ");

const faculty = {
  name: "ReenaPoongavanam",
  avatar_url: null,
  role: "Faculty",
  department: "Nursing Department",
  college: "G Care Nursing College",
  email: "keerthana26@gmail.com",
  phone: "+91 98765 43210",
  location: "Chennai, Tamil Nadu, India",
  employee_id: "GCN/FAC/2023/015",
  join_date: "12 Aug 2023",
  qualification: "M.Sc Nursing, Ph.D",
  designation: "Associate Professor",
  experience: "8 Years 6 Months",
  teaching_since: "2016",
  about:
    "I am an Associate Professor in the Nursing Department with experience in teaching and guiding students in academics and research. Passionate about quality education and holistic student development.",
  live_classes_conducted: 28,
  published_materials: 32,
};

const courses = [
  ["Anatomy and Physiology", "B.Sc Nursing - Year I", "Semester I", 32, "Active", "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80"],
  ["Fundamentals of Nursing", "B.Sc Nursing - Year I", "Semester I", 28, "Active", "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&q=80"],
  ["Pharmacology", "B.Sc Nursing - Year II", "Semester III", 35, "Active", "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80"],
  ["Community Health Nursing", "B.Sc Nursing - Year III", "Semester V", 33, "Active", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80"],
  ["Medical-Surgical Nursing", "B.Sc Nursing - Year II", "Semester IV", 30, "Active", "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80"],
  ["Child Health Nursing", "B.Sc Nursing - Year III", "Semester VI", 27, "Active", "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&q=80"],
  ["Nutrition and Dietetics", "B.Sc Nursing - Year II", "Semester III", 29, "Active", "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"],
  ["Mental Health Nursing", "B.Sc Nursing - Year IV", "Semester VII", 25, "Active", "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=400&q=80"],
];

const students = [
  ["Anitha R", "NUR1001", "B.Sc Nursing - Year I", "Batch A", "anitha.r@email.com", "+91 98765 43210", "Female", "Active"],
  ["Bharath Kumar", "NUR1002", "B.Sc Nursing - Year I", "Batch A", "bharath.k@email.com", "+91 98765 43211", "Male", "Active"],
  ["Divya S", "NUR1003", "B.Sc Nursing - Year I", "Batch B", "divya.s@email.com", "+91 98765 43212", "Female", "Active"],
  ["Gokul Raj", "NUR1004", "B.Sc Nursing - Year II", "Batch A", "gokul.r@email.com", "+91 98765 43213", "Male", "Active"],
  ["Harini M", "NUR1005", "B.Sc Nursing - Year II", "Batch B", "harini.m@email.com", "+91 98765 43214", "Female", "Inactive"],
  ["Indhu Priya", "NUR1006", "B.Sc Nursing - Year III", "Batch A", "indhu.p@email.com", "+91 98765 43215", "Female", "Active"],
  ["Jegan M", "NUR1007", "B.Sc Nursing - Year III", "Batch B", "jegan.m@email.com", "+91 98765 43216", "Male", "Active"],
];

const liveClasses = [
  ["Anatomy and Physiology", "Anatomy and Physiology", "Year I", "Batch A", "Room 101", at(0, 9), at(0, 10), "https://meet.google.com/abc-defg-hij"],
  ["Fundamentals of Nursing", "Fundamentals of Nursing", "Year I", "Batch B", "Room 102", at(0, 11, 30), at(0, 12, 30), "https://meet.google.com/klm-nopq-rst"],
  ["Pharmacology", "Pharmacology", "Year II", "Batch A", "Room 103", at(0, 14), at(0, 15), "https://meet.google.com/uvw-xyza-bcd"],
  ["Community Health Nursing", "Community Health Nursing", "Year III", "Batch B", "Room 104", at(0, 15, 30), at(0, 16, 30), "https://meet.google.com/efg-hijk-lmn"],
  ["Medical-Surgical Nursing", "Medical-Surgical Nursing", "Year II", "Batch A", "Room 105", at(1, 9, 30), at(1, 10, 30), ""],
  ["Child Health Nursing", "Child Health Nursing", "Year III", "Batch A", "Room 106", at(1, 13), at(1, 14), ""],
  ["Nutrition and Dietetics", "Nutrition and Dietetics", "Year II", "Batch B", "Room 107", at(2, 10), at(2, 11), ""],
  ["Mental Health Nursing", "Mental Health Nursing", "Year IV", "Batch A", "Room 108", at(3, 11), at(3, 12), ""],
  ["Anatomy and Physiology", "Anatomy and Physiology", "Year I", "Batch B", "Room 101", at(-1, 9), at(-1, 10), ""],
  ["Medical-Surgical Nursing", "Medical-Surgical Nursing", "Year II", "Batch A", "Room 105", at(-1, 14), at(-1, 15), ""],
  ["Child Health Nursing", "Child Health Nursing", "Year III", "Batch B", "Room 106", at(-2, 9), at(-2, 10), ""],
];

const assignments = [
  ["Anatomy Quiz - Unit 2", "Anatomy & Physiology", "Year I - Batch A", "", at(1, 23, 59), 20, 32, 18, "Pending Review"],
  ["Nursing Process Assignment", "Fundamentals of Nursing", "Year I - Batch B", "", at(3, 23, 59), 20, 28, 21, "Pending Review"],
  ["Drug Classification Task", "Pharmacology", "Year II - Batch A", "", at(5, 23, 59), 20, 35, 14, "Pending Review"],
  ["Community Health Survey", "Community Health Nursing", "Year II - Batch B", "", at(8, 23, 59), 20, 33, 20, "Draft"],
  ["Case Study Analysis", "Medical-Surgical Nursing", "Year II - Batch A", "", at(12, 23, 59), 20, 30, 0, "Draft"],
];

const quizzes = [
  ["Anatomy Quiz - Unit 1", "Anatomy & Physiology", "Year I - Batch A", 20, "Published"],
  ["Fundamentals of Nursing Quiz", "Fundamentals of Nursing", "Year I - Batch B", 30, "Published"],
  ["Pharmacology - Unit 1 Quiz", "Pharmacology", "Year II - Batch A", 20, "Scheduled"],
  ["Community Health Quiz", "Community Health Nursing", "Year II - Batch B", 30, "Draft"],
  ["Medical-Surgical Nursing Quiz", "Medical-Surgical Nursing", "Year II - Batch A", 30, "Draft"],
];

const materials = [
  ["Anatomy - Unit 1 Notes", "Anatomy and Physiology", "Year I - Batch A", "Introduction to Human Body", "Document", "PDF", "2.4 MB", "", at(-3, 10, 30)],
  ["Nursing Process Explained", "Fundamentals of Nursing", "Year I - Batch B", "Nursing Process", "Video", "MP4", "45.6 MB", "", at(-4, 14, 15)],
  ["Pharmacology - Drugs Classification", "Pharmacology", "Year II - Batch A", "Drug Classification", "Document", "PPT", "3.1 MB", "", at(-5, 11, 45)],
  ["Community Health Nursing Audio Lecture", "Community Health Nursing", "Year II - Batch B", "Community Health", "Audio", "MP3", "12.8 MB", "", at(-6, 9, 20)],
  ["WHO - Patient Safety Guidelines", "Medical-Surgical Nursing", "Year I - Batch A", "Patient Safety", "Link", "LINK", "-", "https://www.who.int/teams/integrated-health-services/patient-safety", at(-7, 16, 5)],
];

const announcements = [
  ["Practical Exam Schedule - June 2025", "B.Sc Nursing Year I & II students, please check the practical exam schedule.", "All Students", "Important", "Published", 0, at(-1, 10, 30)],
  ["World No Tobacco Day Awareness Program", "All students are informed about the awareness program on 31st May.", "All Students", "Normal", "Published", 0, at(-2, 10, 30)],
  ["New Study Material Uploaded", "Pharmacology Unit 3 study material has been uploaded.", "All Students", "Normal", "Published", 0, at(-3, 10, 30)],
];

/* Today's register for the first course + batch, matching the original seed. */
const attendanceToday = [
  ["NUR1001", "s1", "Present", "09:02 AM", "11:55 AM", ""],
  ["NUR1002", "s2", "Present", "09:01 AM", "11:58 AM", ""],
  ["NUR1003", "s1", "Absent", "", "", "Not Marked"],
  ["NUR1004", "s2", "Present", "09:05 AM", "11:57 AM", ""],
  ["NUR1005", "s1", "Late", "09:20 AM", "11:59 AM", "Late by 18 mins"],
  ["NUR1006", "s2", "Present", "09:00 AM", "11:56 AM", ""],
  ["NUR1007", "s1", "Absent", "", "", "Medical Leave"],
];

const conversations = [
  {
    row: ["Anitha R", "Student", "B.Sc Nursing - Year I (Batch A)", 0, 2, "NUR1001", "anitha.r@email.com", "+91 98765 43210", "Good morning ma'am, I have a doubt...", "10:32 AM"],
    messages: [
      ["them", "Good morning ma'am,\nI have a doubt regarding today's topic.", "10:30 AM", at(0, 10, 30)],
      ["me", "Good morning Anitha,\nSure, please go ahead and ask your doubt.", "10:31 AM", at(0, 10, 31)],
      ["them", "In the diagram you explained, the last step is a bit unclear to me. Could you explain it once more?", "10:32 AM", at(0, 10, 32)],
      ["me", "Of course. I'll explain it again in the next live class and also share a reference document.", "10:33 AM", at(0, 10, 33)],
    ],
    files: [
      ["Class Notes - Blood Circulation.pdf", "1.2 MB"],
      ["Diagram Explanation.docx", "890 KB"],
    ],
  },
  {
    row: ["Bharath Kumar", "Student", "B.Sc Nursing - Year I (Batch A)", 0, 0, "NUR1002", "bharath.k@email.com", "+91 98765 43211", "Thank you ma'am for the feedback.", "Yesterday"],
    messages: [["them", "Thank you ma'am for the feedback.", "Yesterday", at(-1, 16, 0)]],
    files: [],
  },
  {
    row: ["Nursing Year I - Batch A", "Group", "4 members", 1, 5, null, null, null, "Anitha R: Notes for today's class...", "Yesterday"],
    messages: [["them", "Anitha R: Notes for today's class...", "Yesterday", at(-1, 17, 10)]],
    files: [],
  },
  {
    row: ["Divya S", "Student", "B.Sc Nursing - Year I (Batch B)", 0, 0, "NUR1003", "divya.s@email.com", "+91 98765 43212", "Ma'am, can you share the assignment...", "20 May"],
    messages: [["them", "Ma'am, can you share the assignment...", "20 May", at(-4, 12, 0)]],
    files: [],
  },
  {
    row: ["Faculty - Nursing Dept", "Group", "Dr. Kavitha R: Meeting at 4 PM today.", 1, 0, null, null, null, "Dr. Kavitha R: Meeting at 4 PM today.", "19 May"],
    messages: [["them", "Dr. Kavitha R: Meeting at 4 PM today.", "19 May", at(-5, 15, 0)]],
    files: [],
  },
  {
    row: ["Gokul Raj", "Student", "B.Sc Nursing - Year II (Batch A)", 0, 0, "NUR1004", "gokul.r@email.com", "+91 98765 43213", "Thank you ma'am.", "18 May"],
    messages: [["them", "Thank you ma'am.", "18 May", at(-6, 11, 0)]],
    files: [],
  },
  {
    row: ["Harini M", "Student", "B.Sc Nursing - Year II (Batch B)", 0, 0, "NUR1005", "harini.m@email.com", "+91 98765 43214", "Noted, thank you.", "17 May"],
    messages: [["them", "Noted, thank you.", "17 May", at(-7, 10, 0)]],
    files: [],
  },
];

async function seed() {
  await withTransaction(async (conn) => {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "attendance", "conversation_files", "messages", "conversations", "message_stats",
      "quiz_questions", "quizzes", "assignments", "materials", "announcements",
      "live_classes", "students", "courses", "faculty",
    ]) {
      await conn.query(`TRUNCATE TABLE \`${table}\``);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.query("INSERT INTO faculty SET ?", [faculty]);

    await conn.query(
      "INSERT INTO courses (title, program, semester, students, status, image) VALUES ?",
      [courses]
    );

    await conn.query(
      "INSERT INTO students (name, roll, course, batch, email, phone, gender, status) VALUES ?",
      [students]
    );

    await conn.query(
      "INSERT INTO live_classes (title, course, year, batch, room, start_at, end_at, meeting_link) VALUES ?",
      [liveClasses.map((r) => [r[0], r[1], r[2], r[3], r[4], sql(r[5]), sql(r[6]), r[7]])]
    );

    await conn.query(
      "INSERT INTO assignments (title, course, meta, description, due_at, max_marks, total_students, submitted_count, status) VALUES ?",
      [assignments.map((r) => [r[0], r[1], r[2], r[3], sql(r[4]), r[5], r[6], r[7], r[8]])]
    );

    await conn.query(
      "INSERT INTO quizzes (title, course, meta, duration_mins, status) VALUES ?",
      [quizzes]
    );

    await conn.query(
      "INSERT INTO materials (title, course, meta, topic, type, ext, size_label, url, uploaded_at) VALUES ?",
      [materials.map((r) => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], sql(r[8])])]
    );

    await conn.query(
      "INSERT INTO announcements (title, body, audience, priority, status, pinned, posted_at) VALUES ?",
      [announcements.map((r) => [r[0], r[1], r[2], r[3], r[4], r[5], sql(r[6])])]
    );

    // Attendance needs the generated student ids.
    const [studentRows] = await conn.query("SELECT id, roll FROM students");
    const idByRoll = new Map(studentRows.map((s) => [s.roll, s.id]));
    const today = new Date().toISOString().slice(0, 10);
    await conn.query(
      "INSERT INTO attendance (course, batch, session_date, student_id, session, status, check_in, check_out, remarks) VALUES ?",
      [
        attendanceToday.map(([roll, session, status, checkIn, checkOut, remarks]) => [
          "Anatomy and Physiology", "Year I - Batch A", today, idByRoll.get(roll), session,
          status, checkIn, checkOut, remarks,
        ]),
      ]
    );

    for (const c of conversations) {
      const [res] = await conn.query(
        "INSERT INTO conversations (name, role, meta, is_group, unread, student_ref, email, phone, last_text, last_label) VALUES (?,?,?,?,?,?,?,?,?,?)",
        c.row
      );
      const id = res.insertId;
      if (c.messages.length) {
        await conn.query(
          "INSERT INTO messages (conversation_id, sender, text, time_label, sent_at) VALUES ?",
          [c.messages.map(([sender, text, label, when]) => [id, sender, text, label, sql(when)])]
        );
      }
      if (c.files.length) {
        await conn.query("INSERT INTO conversation_files (conversation_id, name, size_label) VALUES ?", [
          c.files.map(([name, size]) => [id, name, size]),
        ]);
      }
    }

    await conn.query("INSERT INTO message_stats (id, sent_baseline) VALUES (1, 156)");
  });

  console.log("Seed complete.");
}

seed()
  .then(() => pool.end())
  .catch(async (err) => {
    console.error("Seed failed:", err.message);
    await pool.end();
    process.exit(1);
  });
