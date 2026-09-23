import { api } from "./client";

/* One module per resource, mirroring the Express routes. Pages import these
   instead of touching fetch directly. */

export const facultyApi = {
  get: (options) => api.get("/faculty/profile", options),
  update: (body) => api.put("/faculty/profile", body),
};

export const coursesApi = {
  list: (params, options) => api.get("/courses", { ...options, params }),
  create: (body) => api.post("/courses", body),
  update: (id, body) => api.put(`/courses/${id}`, body),
  remove: (id) => api.delete(`/courses/${id}`),
};

export const studentsApi = {
  list: (params, options) => api.get("/students", { ...options, params }),
  create: (body) => api.post("/students", body),
  update: (id, body) => api.put(`/students/${id}`, body),
  remove: (id) => api.delete(`/students/${id}`),
};

export const liveClassesApi = {
  list: (params, options) => api.get("/live-classes", { ...options, params }),
  create: (body) => api.post("/live-classes", body),
  update: (id, body) => api.put(`/live-classes/${id}`, body),
  remove: (id) => api.delete(`/live-classes/${id}`),
};

export const assignmentsApi = {
  list: (params, options) => api.get("/assignments", { ...options, params }),
  create: (body) => api.post("/assignments", body),
  update: (id, body) => api.put(`/assignments/${id}`, body),
  remove: (id) => api.delete(`/assignments/${id}`),
};

export const quizzesApi = {
  list: (params, options) => api.get("/quizzes", { ...options, params }),
  create: (body) => api.post("/quizzes", body),
  update: (id, body) => api.put(`/quizzes/${id}`, body),
  remove: (id) => api.delete(`/quizzes/${id}`),
};

export const materialsApi = {
  list: (params, options) => api.get("/materials", { ...options, params }),
  create: (body) => api.post("/materials", body),
  update: (id, body) => api.put(`/materials/${id}`, body),
  remove: (id) => api.delete(`/materials/${id}`),
};

export const announcementsApi = {
  list: (params, options) => api.get("/announcements", { ...options, params }),
  create: (body) => api.post("/announcements", body),
  update: (id, body) => api.put(`/announcements/${id}`, body),
  remove: (id) => api.delete(`/announcements/${id}`),
};

export const attendanceApi = {
  register: (params, options) => api.get("/attendance", { ...options, params }),
  save: (body) => api.put("/attendance", body),
};

export const messagesApi = {
  list: (options) => api.get("/conversations", options),
  stats: (options) => api.get("/conversations/stats", options),
  create: (body) => api.post("/conversations", body),
  update: (id, body) => api.patch(`/conversations/${id}`, body),
  remove: (id) => api.delete(`/conversations/${id}`),
  send: (id, body) => api.post(`/conversations/${id}/messages`, body),
  attach: (id, body) => api.post(`/conversations/${id}/files`, body),
};

export { ApiError, errorMessage } from "./client";
