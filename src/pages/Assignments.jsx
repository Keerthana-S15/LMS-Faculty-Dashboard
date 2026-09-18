// import { useState } from "react";
// import { Plus, MoreVertical, FileText } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card } from "../components/ui";
// import { assignments } from "../data/mockData";

// const tabs = ["All Assignments", "Pending Review", "Reviewed", "Drafts"];

// export default function Assignments() {
//   const [tab, setTab] = useState(tabs[0]);
//   const [query, setQuery] = useState("");

//   const filtered = assignments.filter((a) => {
//     const matchesQuery = a.title.toLowerCase().includes(query.toLowerCase());
//     const matchesTab =
//       tab === "All Assignments" ||
//       (tab === "Pending Review" && a.status === "Pending Review") ||
//       (tab === "Drafts" && a.status === "Draft") ||
//       (tab === "Reviewed" && a.status === "Reviewed");
//     return matchesQuery && matchesTab;
//   });

//   return (
//     <div>
//       <PageHeader
//         title="Assignments"
//         subtitle="Create and manage assignments"
//         action={<PrimaryButton icon={Plus}>Create Assignment</PrimaryButton>}
//       />

//       <div className="flex gap-6 border-b border-gray-200 mb-5">
//         {tabs.map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
//               tab === t
//                 ? "border-brand-600 text-brand-600"
//                 : "border-transparent text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <SearchInput
//           placeholder="Search assignments..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>Anatomy & Physiology</option>
//           <option>Fundamentals of Nursing</option>
//           <option>Pharmacology</option>
//         </Select>
//       </div>

//       <Card className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className={tableHeadRowClass}>
//               <th className={tableHeadCellClass}>Assignment Title</th>
//               <th className={tableHeadCellClass}>Course</th>
//               <th className={tableHeadCellClass}>Due Date</th>
//               <th className={tableHeadCellClass}>Submitted</th>
//               <th className={tableHeadCellClass}>Status</th>
//               <th className={tableHeadCellClass}>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filtered.map((a) => (
//               <tr key={a.id} className={tableRowClass}>
//                 <td className="py-3.5 px-5">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
//                       <FileText size={15} />
//                     </div>
//                     <span className="font-medium text-gray-900">{a.title}</span>
//                   </div>
//                 </td>
//                 <td className="py-3.5 px-5 text-gray-600">
//                   <p>{a.course}</p>
//                   <p className="text-xs text-gray-400">{a.meta}</p>
//                 </td>
//                 <td className="py-3.5 px-5 text-rose-500">{a.due}</td>
//                 <td className="py-3.5 px-5 text-gray-600">{a.submitted}</td>
//                 <td className="py-3.5 px-5"><Badge status={a.status} /></td>
//                 <td className="py-3.5 px-5">
//                   <button className="p-1.5 text-gray-400 hover:text-gray-600">
//                     <MoreVertical size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {filtered.length === 0 && (
//           <p className="text-sm text-gray-400 text-center py-10">No assignments found.</p>
//         )}
//       </Card>
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  MoreVertical,
  FileText,
  X,
  Pencil,
  Copy,
  Trash2,
  Send,
  Undo2,
  CheckCircle2,
  ArrowUpDown,
  SearchX,
  ClipboardList,
  Eye,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card, Notice, Tabs, EmptyState, SecondaryButton, inputClass, labelClass, tableHeadRowClass, tableHeadCellClass, tableRowClass } from "../components/ui";
import { assignments as seedAssignments } from "../data/mockData";

const TABS = [
  { key: "all", label: "All Assignments" },
  { key: "Pending Review", label: "Pending Review" },
  { key: "Reviewed", label: "Reviewed" },
  { key: "Draft", label: "Drafts" },
];

const COURSES = [
  "Anatomy & Physiology",
  "Fundamentals of Nursing",
  "Pharmacology",
  "Community Health Nursing",
  "Medical-Surgical Nursing",
  "Child Health Nursing",
  "Mental Health Nursing",
];

/* ------------------------------------------------------------------
   The seeded rows carry due dates as "02 Jun 2025 11:59 PM" strings and
   submissions as "18/32". Normalise both into real values once, and
   spread the due dates around today so the countdowns stay meaningful.
-------------------------------------------------------------------*/
const DUE_OFFSETS = [1, 3, 5, 8, 12];

function normalise(list) {
  return list.map((a, i) => {
    const [got, total] = String(a.submitted).split("/").map((n) => Number(n) || 0);
    const due = new Date();
    due.setDate(due.getDate() + (DUE_OFFSETS[i] ?? 7));
    due.setHours(23, 59, 0, 0);
    return {
      ...a,
      dueAt: due,
      submittedCount: got,
      totalStudents: total || 30,
      description: a.description || "",
      maxMarks: a.maxMarks ?? 20,
    };
  });
}

const fmtDue = (d) =>
  `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ${d
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toUpperCase()}`;

const toInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

function dueLabel(d, now) {
  const days = Math.ceil((d - now) / 86400000);
  if (days < 0) return { text: "Overdue", urgent: true };
  if (days === 0) return { text: "Due today", urgent: true };
  if (days === 1) return { text: "1 day left", urgent: true };
  return { text: `${days} days left`, urgent: days <= 2 };
}

/* ---------------- create / edit modal ---------------- */

function AssignmentModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => ({
    title: "",
    course: COURSES[0],
    meta: "",
    description: "",
    maxMarks: 20,
    totalStudents: 30,
    submittedCount: 0,
    status: "Draft",
    dueAt: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(23, 59, 0, 0);
      return d;
    })(),
    ...initial,
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  function handleSubmit() {
    const next = {};
    if (!form.title.trim()) next.title = "Give the assignment a title.";
    if (!form.dueAt || isNaN(new Date(form.dueAt))) next.dueAt = "Pick a due date and time.";
    if (Number(form.totalStudents) <= 0) next.totalStudents = "Enter how many students it goes to.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave({
      ...form,
      title: form.title.trim(),
      dueAt: new Date(form.dueAt),
      maxMarks: Number(form.maxMarks) || 0,
      totalStudents: Number(form.totalStudents),
      submittedCount: Number(form.submittedCount) || 0,
    });
    onClose();
  }

  const field = inputClass;
  const label = labelClass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit assignment" : "Create assignment"}
          </h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={label}>Assignment title</label>
            <input autoFocus className={field} value={form.title} onChange={set("title")} placeholder="Anatomy Quiz - Unit 2" />
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

          <div>
            <label className={label}>Instructions for students</label>
            <textarea
              rows={3}
              className={field}
              value={form.description}
              onChange={set("description")}
              placeholder="What should students submit, and in what format?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Due date &amp; time</label>
              <input
                type="datetime-local"
                className={field}
                value={toInputValue(new Date(form.dueAt))}
                onChange={(e) => setForm((f) => ({ ...f, dueAt: new Date(e.target.value) }))}
              />
              {errors.dueAt && <p className="text-xs text-rose-600 mt-1.5">{errors.dueAt}</p>}
            </div>
            <div>
              <label className={label}>Maximum marks</label>
              <input className={field} value={form.maxMarks} onChange={set("maxMarks")} inputMode="numeric" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Students assigned</label>
              <input className={field} value={form.totalStudents} onChange={set("totalStudents")} inputMode="numeric" />
              {errors.totalStudents && <p className="text-xs text-rose-600 mt-1.5">{errors.totalStudents}</p>}
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={field} value={form.status} onChange={set("status")}>
                <option>Draft</option>
                <option>Pending Review</option>
                <option>Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors text-white text-sm font-medium"
          >
            {isEdit ? "Save changes" : "Create assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- detail drawer ---------------- */

function DetailModal({ item, now, onClose, onEdit }) {
  const pct = item.totalStudents
    ? Math.round((item.submittedCount / item.totalStudents) * 100)
    : 0;
  const due = dueLabel(item.dueAt, now);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{item.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {item.course} · {item.meta || "All batches"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Due</p>
              <p className="text-sm font-semibold text-gray-900">{fmtDue(item.dueAt)}</p>
              <p className={`text-xs mt-0.5 ${due.urgent ? "text-rose-500" : "text-gray-500"}`}>
                {due.text}
              </p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400">Maximum marks</p>
              <p className="text-sm font-semibold text-gray-900">{item.maxMarks}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                <Badge status={item.status} />
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm text-gray-600">Submissions</p>
              <p className="text-sm font-medium text-gray-900">
                {item.submittedCount}/{item.totalStudents} ({pct}%)
              </p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {item.totalStudents - item.submittedCount} students yet to submit.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Instructions</p>
            <p className="text-sm text-gray-500">
              {item.description || "No instructions were added for this assignment."}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(); }}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors text-white text-sm font-medium"
          >
            Edit assignment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- row menu ---------------- */

function RowMenu({ item, onEdit, onDuplicate, onPublish, onMarkReviewed, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1.5 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="More actions">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Pencil size={14} /> Edit
          </button>
          {item.status === "Draft" ? (
            <button
              onClick={() => { setOpen(false); onPublish(); }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Send size={14} /> Publish to students
            </button>
          ) : (
            <button
              onClick={() => { setOpen(false); onPublish(); }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Undo2 size={14} /> Move to draft
            </button>
          )}
          {item.status === "Pending Review" && (
            <button
              onClick={() => { setOpen(false); onMarkReviewed(); }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <CheckCircle2 size={14} /> Mark as reviewed
            </button>
          )}
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

export default function Assignments() {
  /*  Swap for your API when the backend is ready:
        useEffect(() => { getAssignments().then((r) => setItems(normalise(r))); }, []);
      and call POST / PUT / DELETE inside handleSave, handleDelete, etc.  */
  const [items, setItems] = useState(() => normalise(seedAssignments));

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [sort, setSort] = useState({ key: "dueAt", dir: "asc" });
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const courseOptions = useMemo(() => [...new Set(items.map((a) => a.course))].sort(), [items]);

  const countFor = (key) =>
    key === "all" ? items.length : items.filter((a) => a.status === key).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.course.toLowerCase().includes(q) ||
        (a.meta || "").toLowerCase().includes(q);
      return (
        matchesQuery &&
        (tab === "all" || a.status === tab) &&
        (course === "all" || a.course === course)
      );
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.key === "dueAt") return (a.dueAt - b.dueAt) * dir;
      if (sort.key === "submitted") return (a.submittedCount - b.submittedCount) * dir;
      return String(a[sort.key]).localeCompare(String(b[sort.key])) * dir;
    });
  }, [items, tab, query, course, sort]);

  const nextId = () => Math.max(0, ...items.map((a) => a.id)) + 1;

  function handleSave(data) {
    if (data.id) {
      setItems((list) => list.map((a) => (a.id === data.id ? { ...a, ...data } : a)));
      setNotice(`"${data.title}" updated.`);
    } else {
      setItems((list) => [{ ...data, id: nextId() }, ...list]);
      setNotice(`"${data.title}" created.`);
    }
  }

  function handleDuplicate(item) {
    setItems((list) => [
      { ...item, id: nextId(), title: `${item.title} (Copy)`, status: "Draft", submittedCount: 0 },
      ...list,
    ]);
    setNotice("Assignment duplicated as a draft.");
  }

  function handlePublish(item) {
    const next = item.status === "Draft" ? "Pending Review" : "Draft";
    setItems((list) => list.map((a) => (a.id === item.id ? { ...a, status: next } : a)));
    setNotice(next === "Draft" ? "Moved to draft." : "Published to students.");
  }

  function handleMarkReviewed(item) {
    setItems((list) => list.map((a) => (a.id === item.id ? { ...a, status: "Reviewed" } : a)));
    setNotice(`"${item.title}" marked as reviewed.`);
  }

  function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setItems((list) => list.filter((a) => a.id !== item.id));
    setNotice(`"${item.title}" deleted.`);
  }

  const SortHeader = ({ label, sortKey }) => (
    <th className={tableHeadCellClass}>
      <button
        onClick={() =>
          setSort((s) =>
            s.key === sortKey
              ? { key: sortKey, dir: s.dir === "asc" ? "desc" : "asc" }
              : { key: sortKey, dir: "asc" }
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
        title="Assignments"
        subtitle="Create and manage assignments"
        action={
          <PrimaryButton icon={Plus} onClick={() => setEditing({})}>
            Create Assignment
          </PrimaryButton>
        }
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} count={countFor} className="mb-5" />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput
          placeholder="Search assignments..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={tableHeadRowClass}>
              <SortHeader label="Assignment Title" sortKey="title" />
              <SortHeader label="Course" sortKey="course" />
              <SortHeader label="Due Date" sortKey="dueAt" />
              <SortHeader label="Submitted" sortKey="submitted" />
              <SortHeader label="Status" sortKey="status" />
              <th className={tableHeadCellClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((a) => {
              const due = dueLabel(a.dueAt, now);
              const pct = a.totalStudents
                ? Math.round((a.submittedCount / a.totalStudents) * 100)
                : 0;
              return (
                <tr key={a.id} className={tableRowClass}>
                  <td className="py-3.5 px-5">
                    <button onClick={() => setDetail(a)} className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                        <FileText size={15} />
                      </div>
                      <span className="font-medium text-gray-900 hover:text-brand-600 transition-colors">{a.title}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">
                    <p>{a.course}</p>
                    <p className="text-xs text-gray-400">{a.meta}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <p className={`whitespace-nowrap ${due.urgent ? "text-rose-500 font-medium" : "text-gray-600"}`}>{fmtDue(a.dueAt)}</p>
                    <p className="text-xs text-gray-400">{due.text}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2 min-w-[110px]">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {a.submittedCount}/{a.totalStudents}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5"><Badge status={a.status} /></td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 text-gray-400">
                      <button onClick={() => setDetail(a)} className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors" title="View details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setEditing(a)} className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <RowMenu
                        item={a}
                        onEdit={() => setEditing(a)}
                        onDuplicate={() => handleDuplicate(a)}
                        onPublish={() => handlePublish(a)}
                        onMarkReviewed={() => handleMarkReviewed(a)}
                        onDelete={() => handleDelete(a)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visible.length === 0 && (
          <EmptyState
            icon={items.length === 0 ? <ClipboardList size={24} /> : <SearchX size={24} />}
            title={items.length === 0 ? "No assignments yet" : "No assignments match your filters"}
            description={
              items.length === 0
                ? "Create an assignment and it will appear here."
                : "Try a different tab, course or search term."
            }
            action={
              items.length === 0
                ? (<PrimaryButton icon={Plus} onClick={() => setEditing({})}>Create Assignment</PrimaryButton>)
                : (<SecondaryButton onClick={() => { setQuery(""); setCourse("all"); setTab("all"); }}>Clear filters</SecondaryButton>)
            }
          />
        )}
      </Card>

      {editing && (
        <AssignmentModal
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {detail && (
        <DetailModal
          item={detail}
          now={now}
          onClose={() => setDetail(null)}
          onEdit={() => setEditing(detail)}
        />
      )}
    </div>
  );
}