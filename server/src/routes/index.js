import { Router } from "express";

import { assertConnection } from "../db/pool.js";

import * as faculty from "../controllers/facultyController.js";
import * as courses from "../controllers/courseController.js";
import * as students from "../controllers/studentController.js";
import * as liveClasses from "../controllers/liveClassController.js";
import * as assignments from "../controllers/assignmentController.js";
import * as quizzes from "../controllers/quizController.js";
import * as materials from "../controllers/materialController.js";
import * as announcements from "../controllers/announcementController.js";
import * as attendance from "../controllers/attendanceController.js";
import * as messages from "../controllers/messageController.js";

const router = Router();

/* The router is mounted at /api, so these paths are /api/<path>. */

/** API index — lists what this server exposes, so GET /api isn't a dead end. */
router.get("/", (req, res) =>
  res.json({
    data: {
      name: "G Care LMS Faculty API",
      status: "ok",
      endpoints: [
        "/api/health",
        "/api/faculty/profile",
        "/api/courses",
        "/api/students",
        "/api/live-classes",
        "/api/assignments",
        "/api/quizzes",
        "/api/materials",
        "/api/announcements",
        "/api/attendance",
        "/api/conversations",
      ],
    },
  })
);

/** Liveness probe: confirms the process is up (see /api/health/db for MySQL). */
router.get("/health", (req, res) =>
  res.json({ data: { status: "ok", time: new Date().toISOString() } })
);

/** Readiness probe: also pings MySQL, so you can tell the two apart. */
router.get("/health/db", async (req, res, next) => {
  try {
    await assertConnection();
    res.json({ data: { status: "ok", database: "connected", time: new Date().toISOString() } });
  } catch (err) {
    next(err);
  }
});

/* ------------------------------------------------------------- faculty --- */
router.get("/faculty/profile", faculty.getProfile);
router.put("/faculty/profile", faculty.updateProfile);
router.patch("/faculty/profile", faculty.updateProfile);

/* ------------------------------------------------------------- courses --- */
router.get("/courses", courses.listCourses);
router.post("/courses", courses.createCourse);
router.get("/courses/:id", courses.getCourse);
router.put("/courses/:id", courses.updateCourse);
router.patch("/courses/:id", courses.updateCourse);
router.delete("/courses/:id", courses.deleteCourse);

/* ------------------------------------------------------------ students --- */
router.get("/students", students.listStudents);
router.post("/students", students.createStudent);
router.get("/students/:id", students.getStudent);
router.put("/students/:id", students.updateStudent);
router.patch("/students/:id", students.updateStudent);
router.delete("/students/:id", students.deleteStudent);

/* -------------------------------------------------------- live classes --- */
router.get("/live-classes", liveClasses.listLiveClasses);
router.post("/live-classes", liveClasses.createLiveClass);
router.get("/live-classes/:id", liveClasses.getLiveClass);
router.put("/live-classes/:id", liveClasses.updateLiveClass);
router.patch("/live-classes/:id", liveClasses.updateLiveClass);
router.delete("/live-classes/:id", liveClasses.deleteLiveClass);

/* --------------------------------------------------------- assignments --- */
router.get("/assignments", assignments.listAssignments);
router.post("/assignments", assignments.createAssignment);
router.get("/assignments/:id", assignments.getAssignment);
router.put("/assignments/:id", assignments.updateAssignment);
router.patch("/assignments/:id", assignments.updateAssignment);
router.delete("/assignments/:id", assignments.deleteAssignment);

/* ------------------------------------------------------------- quizzes --- */
router.get("/quizzes", quizzes.listQuizzes);
router.post("/quizzes", quizzes.createQuiz);
router.get("/quizzes/:id", quizzes.getQuiz);
router.put("/quizzes/:id", quizzes.updateQuiz);
router.patch("/quizzes/:id", quizzes.updateQuiz);
router.delete("/quizzes/:id", quizzes.deleteQuiz);

/* ---------------------------------------------------- study materials ----- */
router.get("/materials", materials.listMaterials);
router.post("/materials", materials.createMaterial);
router.get("/materials/:id", materials.getMaterial);
router.put("/materials/:id", materials.updateMaterial);
router.patch("/materials/:id", materials.updateMaterial);
router.delete("/materials/:id", materials.deleteMaterial);

/* ------------------------------------------------------- announcements --- */
router.get("/announcements", announcements.listAnnouncements);
router.post("/announcements", announcements.createAnnouncement);
router.get("/announcements/:id", announcements.getAnnouncement);
router.put("/announcements/:id", announcements.updateAnnouncement);
router.patch("/announcements/:id", announcements.updateAnnouncement);
router.delete("/announcements/:id", announcements.deleteAnnouncement);

/* ---------------------------------------------------------- attendance --- */
router.get("/attendance", attendance.getRegister);
router.put("/attendance", attendance.saveRegister);
router.get("/attendance/summary", attendance.getSummary);

/* ------------------------------------------------------------ messages --- */
router.get("/conversations", messages.listConversations);
router.post("/conversations", messages.createConversation);
router.get("/conversations/stats", messages.getStats);
router.patch("/conversations/:id", messages.updateConversation);
router.delete("/conversations/:id", messages.deleteConversation);
router.post("/conversations/:id/messages", messages.sendMessage);
router.post("/conversations/:id/files", messages.addFile);

export default router;
