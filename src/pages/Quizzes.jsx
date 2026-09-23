// import { useState } from "react";
// import { Plus, Eye, Pencil, MoreVertical, ClipboardCheck, ClipboardList, Clock, FileX } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card, StatCard } from "../components/ui";
// import { quizzes } from "../data/mockData";

// export default function Quizzes() {
//   const [query, setQuery] = useState("");

//   const filtered = quizzes.filter((q) => q.title.toLowerCase().includes(query.toLowerCase()));

//   const total = quizzes.length;
//   const published = quizzes.filter((q) => q.status === "Published").length;
//   const scheduled = quizzes.filter((q) => q.status === "Scheduled").length;
//   const drafts = quizzes.filter((q) => q.status === "Draft").length;

//   return (
//     <div>
//       <PageHeader
//         title="Quizzes"
//         subtitle="Create and manage quizzes"
//         action={<PrimaryButton icon={Plus}>Create Quiz</PrimaryButton>}
//       />

//       <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
//         <StatCard icon={ClipboardList} label="Total Quizzes" value={total} tint="purple" />
//         <StatCard icon={ClipboardCheck} label="Published" value={published} tint="green" />
//         <StatCard icon={Clock} label="Scheduled" value={scheduled} tint="orange" />
//         <StatCard icon={FileX} label="Drafts" value={drafts} tint="red" />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <SearchInput placeholder="Search quizzes..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>Anatomy & Physiology</option>
//           <option>Fundamentals of Nursing</option>
//         </Select>
//         <Select defaultValue="All Status">
//           <option>All Status</option>
//           <option>Published</option>
//           <option>Scheduled</option>
//           <option>Draft</option>
//         </Select>
//       </div>

//       <Card className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className={tableHeadRowClass}>
//               <th className={tableHeadCellClass}>Quiz Title</th>
//               <th className={tableHeadCellClass}>Course</th>
//               <th className={tableHeadCellClass}>Questions</th>
//               <th className={tableHeadCellClass}>Total Marks</th>
//               <th className={tableHeadCellClass}>Duration</th>
//               <th className={tableHeadCellClass}>Status</th>
//               <th className={tableHeadCellClass}>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filtered.map((q) => (
//               <tr key={q.id} className={tableRowClass}>
//                 <td className="py-3.5 px-5">
//                   <p className="font-medium text-gray-900">{q.title}</p>
//                   <p className="text-xs text-gray-400">{q.meta}</p>
//                 </td>
//                 <td className="py-3.5 px-5 text-gray-600">{q.course}</td>
//                 <td className="py-3.5 px-5 text-gray-600">{q.questions}</td>
//                 <td className="py-3.5 px-5 text-gray-600">{q.marks}</td>
//                 <td className="py-3.5 px-5 text-gray-600">{q.duration}</td>
//                 <td className="py-3.5 px-5"><Badge status={q.status} /></td>
//                 <td className="py-3.5 px-5">
//                   <div className="flex items-center gap-1 text-gray-400">
//                     <button className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Eye size={16} /></button>
//                     <button className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Pencil size={15} /></button>
//                     <button className="p-1.5 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors"><MoreVertical size={16} /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Eye,
  Pencil,
  MoreVertical,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileX,
  X,
  Copy,
  Trash2,
  Send,
  Undo2,
  Trash,
  ArrowUpDown,
  SearchX,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card, StatCard, Notice, EmptyState, SecondaryButton, StatButton, LoadingState, ErrorState, inputClass, labelClass, tableHeadRowClass, tableHeadCellClass, tableRowClass } from "../components/ui";
import { quizzesApi, errorMessage } from "../api";
import { useResource } from "../hooks/useResource";

const STATUSES = ["Published", "Scheduled", "Draft"];

const COURSES = [
  "Anatomy & Physiology",
  "Fundamentals of Nursing",
  "Pharmacology",
  "Community Health Nursing",
  "Medical-Surgical Nursing",
  "Child Health Nursing",
  "Mental Health Nursing",
];

const blankQuestion = () => ({
  id: crypto.randomUUID(),
  text: "",
  options: ["", "", "", ""],
  correct: 0,
  marks: 1,
});

const EMPTY_QUIZ = {
  title: "",
  course: COURSES[0],
  meta: "",
  durationMins: 20,
  status: "Draft",
  questionList: [],
};

/** mockData stores duration as "20 min" — read it back as a number. */
const minutesOf = (q) =>
  q.durationMins ?? (Number(String(q.duration || "").replace(/\D/g, "")) || 0);

/* ---------------- create / edit modal ---------------- */

function QuizModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [tab, setTab] = useState("details");
  const [form, setForm] = useState(() => ({
    ...EMPTY_QUIZ,
    ...initial,
    durationMins: initial ? minutesOf(initial) : EMPTY_QUIZ.durationMins,
    questionList: initial?.questionList ?? [],
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  const updateQuestion = (id, patch) =>
    setForm((f) => ({
      ...f,
      questionList: f.questionList.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));

  const addQuestion = () =>
    setForm((f) => ({ ...f, questionList: [...f.questionList, blankQuestion()] }));

  const removeQuestion = (id) =>
    setForm((f) => ({ ...f, questionList: f.questionList.filter((q) => q.id !== id) }));

  // Questions and marks are derived from the builder, never typed by hand.
  const questionCount = form.questionList.length;
  const totalMarks = form.questionList.reduce((s, q) => s + (Number(q.marks) || 0), 0);

  async function handleSubmit() {
    const next = {};
    if (!form.title.trim()) next.title = "Give the quiz a title.";
    if (!form.durationMins || Number(form.durationMins) <= 0)
      next.durationMins = "Set a duration in minutes.";
    if (form.status === "Published" && questionCount === 0)
      next.status = "Add at least one question before publishing.";
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.status) setTab("questions");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        durationMins: Number(form.durationMins),
        duration: `${Number(form.durationMins)} min`,
        questions: questionCount,
        marks: totalMarks,
      });
      onClose();
    } catch (err) {
      const details = err?.details || { title: errorMessage(err, "Couldn't save this quiz.") };
      setErrors(details);
      if (details.status || details.questionList) setTab("questions");
    } finally {
      setSaving(false);
    }
  }

  const field = inputClass;
  const label = labelClass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{isEdit ? "Edit quiz" : "Create quiz"}</h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-6 px-6 border-b border-gray-100">
          {[
            { key: "details", label: "Details" },
            { key: "questions", label: `Questions (${questionCount})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 text-sm font-medium border-b-2 -mb-px ${
                tab === t.key
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {tab === "details" && (
            <>
              <div>
                <label className={label}>Quiz title</label>
                <input autoFocus className={field} value={form.title} onChange={set("title")} placeholder="Anatomy Quiz - Unit 1" />
                {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Course</label>
                  <select className={field} value={form.course} onChange={set("course")}>
                    {COURSES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label}>Year &amp; batch</label>
                  <input className={field} value={form.meta} onChange={set("meta")} placeholder="Year I - Batch A" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Duration (minutes)</label>
                  <input className={field} value={form.durationMins} onChange={set("durationMins")} inputMode="numeric" />
                  {errors.durationMins && <p className="text-xs text-rose-600 mt-1.5">{errors.durationMins}</p>}
                </div>
                <div>
                  <label className={label}>Status</label>
                  <select className={field} value={form.status} onChange={set("status")}>
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.status && <p className="text-xs text-rose-600 mt-1.5">{errors.status}</p>}
                </div>
              </div>

              <div className="flex gap-4 bg-gray-50 rounded-xl p-4 text-sm">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs">Questions</p>
                  <p className="font-semibold text-gray-900">{questionCount}</p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs">Total marks</p>
                  <p className="font-semibold text-gray-900">{totalMarks}</p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="font-semibold text-gray-900">{form.durationMins || 0} min</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Questions and marks update automatically as you build the question list.
              </p>
            </>
          )}

          {tab === "questions" && (
            <>
              {form.questionList.length === 0 && (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm text-gray-500">No questions yet.</p>
                  <button
                    onClick={addQuestion}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
                  >
                    <Plus size={15} /> Add the first question
                  </button>
                </div>
              )}

              {form.questionList.map((q, qi) => (
                <div key={q.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
                      {qi + 1}
                    </span>
                    <input
                      className={field}
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      placeholder="Type the question"
                    />
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 shrink-0"
                      aria-label="Remove question"
                    >
                      <Trash size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-9">
                    {q.options.map((opt, oi) => (
                      <label
                        key={oi}
                        className={`flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer ${
                          q.correct === oi ? "border-emerald-300 bg-emerald-50" : "border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={q.correct === oi}
                          onChange={() => updateQuestion(q.id, { correct: oi })}
                          className="accent-emerald-600"
                        />
                        <input
                          className="flex-1 bg-transparent text-sm focus:outline-none"
                          value={opt}
                          onChange={(e) => {
                            const options = [...q.options];
                            options[oi] = e.target.value;
                            updateQuestion(q.id, { options });
                          }}
                          placeholder={`Option ${oi + 1}`}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-3 pl-9">
                    <span className="text-xs text-gray-500">Marks</span>
                    <input
                      className="w-16 px-2.5 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                      value={q.marks}
                      onChange={(e) => updateQuestion(q.id, { marks: e.target.value })}
                      inputMode="numeric"
                    />
                    <span className="text-xs text-gray-400">
                      Tick the radio next to the correct answer.
                    </span>
                  </div>
                </div>
              ))}

              {form.questionList.length > 0 && (
                <button
                  onClick={addQuestion}
                  className="w-full border border-dashed border-gray-200 rounded-xl py-3 text-sm font-medium text-brand-600 hover:bg-brand-50"
                >
                  <Plus size={15} className="inline -mt-0.5 mr-1" /> Add question
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <span className="text-xs text-gray-400">
            {questionCount} questions · {totalMarks} marks
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- preview modal ---------------- */

function PreviewModal({ quiz, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{quiz.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {quiz.course} · {quiz.meta || "All batches"} · {quiz.duration} · {quiz.marks} marks
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {(quiz.questionList?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              This quiz has no questions added yet. Open it in edit mode to build the question list.
            </p>
          ) : (
            quiz.questionList.map((q, i) => (
              <div key={q.id}>
                <p className="text-sm font-medium text-gray-900">
                  {i + 1}. {q.text || "Untitled question"}
                  <span className="ml-2 text-xs text-gray-400">({q.marks} marks)</span>
                </p>
                <div className="mt-2 space-y-1.5 pl-4">
                  {q.options.map((opt, oi) => (
                    <p
                      key={oi}
                      className={`text-sm px-3 py-1.5 rounded-lg ${
                        q.correct === oi
                          ? "bg-emerald-50 text-emerald-800 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt || "—"}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- row menu ---------------- */

function RowMenu({ quiz, onDuplicate, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const published = quiz.status === "Published";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button
            onClick={() => { setOpen(false); onToggleStatus(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            {published ? <Undo2 size={14} /> : <Send size={14} />}
            {published ? "Move to draft" : "Publish now"}
          </button>
          <button
            onClick={() => { setOpen(false); onDuplicate(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Copy size={14} /> Duplicate
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Quizzes() {
  // Quizzes (with their question lists) come from GET /api/quizzes.
  const {
    data: quizzes,
    setData: setQuizzes,
    loading,
    error,
    reload,
  } = useResource((signal) => quizzesApi.list(undefined, { signal }), []);

  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: "title", dir: "asc" });
  const [editing, setEditing] = useState(null); // null | {} | quiz
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const courseOptions = useMemo(
    () => [...new Set(quizzes.map((q) => q.course))].sort(),
    [quizzes]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = quizzes.filter((z) => {
      const matchesQuery =
        !q ||
        z.title.toLowerCase().includes(q) ||
        z.course.toLowerCase().includes(q) ||
        (z.meta || "").toLowerCase().includes(q);
      return (
        matchesQuery &&
        (course === "all" || z.course === course) &&
        (status === "all" || z.status === status)
      );
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = sort.key === "duration" ? minutesOf(a) : a[sort.key];
      const bv = sort.key === "duration" ? minutesOf(b) : b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [quizzes, query, course, status, sort]);

  const counts = {
    total: quizzes.length,
    published: quizzes.filter((q) => q.status === "Published").length,
    scheduled: quizzes.filter((q) => q.status === "Scheduled").length,
    drafts: quizzes.filter((q) => q.status === "Draft").length,
  };

  const payload = (data) => ({
    title: data.title,
    course: data.course,
    meta: data.meta,
    durationMins: Number(data.durationMins) || 0,
    status: data.status,
    questionList: (data.questionList ?? []).map((q) => ({
      text: q.text,
      options: q.options,
      correct: Number(q.correct) || 0,
      marks: Number(q.marks) || 0,
    })),
  });

  const applySaved = (saved) =>
    setQuizzes((list) => (list.some((q) => q.id === saved.id)
      ? list.map((q) => (q.id === saved.id ? saved : q))
      : [saved, ...list]));

  async function handleSave(data) {
    const saved = data.id
      ? await quizzesApi.update(data.id, payload(data))
      : await quizzesApi.create(payload(data));
    applySaved(saved);
    setNotice(`"${saved.title}" ${data.id ? "updated" : "created"}.`);
  }

  async function handleDuplicate(quiz) {
    try {
      const saved = await quizzesApi.create({
        ...payload(quiz),
        title: `${quiz.title} (Copy)`,
        status: "Draft",
      });
      applySaved(saved);
      setNotice("Quiz duplicated as a draft.");
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't duplicate that quiz."));
    }
  }

  async function handleToggleStatus(quiz) {
    const next = quiz.status === "Published" ? "Draft" : "Published";
    if (next === "Published" && (quiz.questionList?.length ?? 0) === 0) {
      setNotice("Add at least one question before publishing.");
      return;
    }
    try {
      applySaved(await quizzesApi.update(quiz.id, { status: next }));
      setNotice(next === "Published" ? "Quiz published." : "Quiz moved to draft.");
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't change that quiz."));
    }
  }

  async function handleDelete(quiz) {
    if (!window.confirm(`Delete "${quiz.title}"? This cannot be undone.`)) return;
    try {
      await quizzesApi.remove(quiz.id);
      setQuizzes((list) => list.filter((q) => q.id !== quiz.id));
      setNotice(`"${quiz.title}" deleted.`);
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't delete that quiz."));
    }
  }

  const SortHeader = ({ label, sortKey, className = "" }) => (
    <th className={`${tableHeadCellClass} ${className}`}>
      <button
        onClick={() =>
          setSort((s) =>
            s.key === sortKey ? { key: sortKey, dir: s.dir === "asc" ? "desc" : "asc" } : { key: sortKey, dir: "asc" }
          )
        }
        className={`inline-flex items-center gap-1 rounded-md uppercase tracking-wider transition-colors hover:text-gray-800 ${
          sort.key === sortKey ? "text-brand-600" : ""
        }`}
      >
        {label}
        <ArrowUpDown size={12} />
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader
        title="Quizzes"
        subtitle="Create and manage quizzes"
        action={
          <PrimaryButton icon={Plus} onClick={() => setEditing({})}>
            Create Quiz
          </PrimaryButton>
        }
      />

      <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        <StatButton onClick={() => setStatus("all")} active={status === "all"}>
          <StatCard icon={ClipboardList} label="Total Quizzes" value={counts.total} tint="purple" interactive active={status === "all"} />
        </StatButton>
        <StatButton onClick={() => setStatus("Published")} active={status === "Published"}>
          <StatCard icon={ClipboardCheck} label="Published" value={counts.published} tint="green" interactive active={status === "Published"} />
        </StatButton>
        <StatButton onClick={() => setStatus("Scheduled")} active={status === "Scheduled"}>
          <StatCard icon={Clock} label="Scheduled" value={counts.scheduled} tint="orange" interactive active={status === "Scheduled"} />
        </StatButton>
        <StatButton onClick={() => setStatus("Draft")} active={status === "Draft"}>
          <StatCard icon={FileX} label="Drafts" value={counts.drafts} tint="red" interactive active={status === "Draft"} />
        </StatButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput placeholder="Search quizzes..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="overflow-x-auto">
        {loading ? (
          <LoadingState rows={5} label="Loading quizzes…" />
        ) : error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className={tableHeadRowClass}>
              <SortHeader label="Quiz Title" sortKey="title" />
              <SortHeader label="Course" sortKey="course" />
              <SortHeader label="Questions" sortKey="questions" />
              <SortHeader label="Total Marks" sortKey="marks" />
              <SortHeader label="Duration" sortKey="duration" />
              <SortHeader label="Status" sortKey="status" />
              <th className={tableHeadCellClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((q) => (
              <tr key={q.id} className={tableRowClass}>
                <td className="py-3.5 px-5">
                  <button onClick={() => setPreview(q)} className="text-left">
                    <p className="font-medium text-gray-900 hover:text-brand-600 transition-colors">{q.title}</p>
                    <p className="text-xs text-gray-400">{q.meta}</p>
                  </button>
                </td>
                <td className="py-3.5 px-5 text-gray-600">{q.course}</td>
                <td className="py-3.5 px-5 text-gray-600">{q.questions}</td>
                <td className="py-3.5 px-5 text-gray-600">{q.marks}</td>
                <td className="py-3.5 px-5 text-gray-600">{q.duration}</td>
                <td className="py-3.5 px-5"><Badge status={q.status} /></td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1 text-gray-400">
                    <button onClick={() => setPreview(q)} className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Preview">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => setEditing(q)} className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <RowMenu
                      quiz={q}
                      onDuplicate={() => handleDuplicate(q)}
                      onToggleStatus={() => handleToggleStatus(q)}
                      onDelete={() => handleDelete(q)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={quizzes.length === 0 ? <ClipboardList size={24} /> : <SearchX size={24} />}
            title={quizzes.length === 0 ? "No quizzes yet" : "No quizzes match your filters"}
            description={
              quizzes.length === 0
                ? "Create a quiz and it will appear here."
                : "Clear the search, course or status filter."
            }
            action={
              quizzes.length === 0
                ? (<PrimaryButton icon={Plus} onClick={() => setEditing({})}>Create Quiz</PrimaryButton>)
                : (<SecondaryButton onClick={() => { setQuery(""); setCourse("all"); setStatus("all"); }}>Clear filters</SecondaryButton>)
            }
          />
        )}
      </Card>

      {editing && (
        <QuizModal
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {preview && <PreviewModal quiz={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}