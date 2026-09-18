// import { useState } from "react";
// import { Plus, MoreVertical, Users } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card } from "../components/ui";
// import { courses } from "../data/mockData";

// export default function MyCourses() {
//   const [query, setQuery] = useState("");
//   const [semester, setSemester] = useState("All Semesters");

//   const filtered = courses.filter((c) => {
//     const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
//     const matchesSemester = semester === "All Semesters" || c.semester === semester;
//     return matchesQuery && matchesSemester;
//   });

//   return (
//     <div>
//       <PageHeader
//         title="My Courses"
//         subtitle="Manage and view all your courses"
//         action={<PrimaryButton icon={Plus}>Create Course</PrimaryButton>}
//       />

//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <SearchInput
//           placeholder="Search courses..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
//           <option>All Semesters</option>
//           <option>Semester I</option>
//           <option>Semester III</option>
//           <option>Semester IV</option>
//           <option>Semester V</option>
//           <option>Semester VI</option>
//           <option>Semester VII</option>
//         </Select>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {filtered.map((c) => (
//           <Card key={c.id} className="overflow-hidden">
//             <div className="relative">
//               <img src={c.image} alt={c.title} className="w-full h-36 object-cover" />
//               <button className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:bg-white">
//                 <MoreVertical size={15} />
//               </button>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
//               <p className="text-xs text-gray-500 mt-0.5">{c.program}</p>
//               <p className="text-xs text-gray-400">{c.semester}</p>
//               <div className="flex items-center justify-between mt-3">
//                 <span className="flex items-center gap-1 text-xs text-gray-500">
//                   <Users size={13} /> {c.students} Students
//                 </span>
//                 <Badge status={c.status} />
//               </div>
//             </div>
//           </Card>
//         ))}
//         {filtered.length === 0 && (
//           <p className="text-sm text-gray-400 col-span-full text-center py-10">
//             No courses match your search.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  MoreVertical,
  Users,
  X,
  Pencil,
  Copy,
  Trash2,
  BookOpen,
  ImageOff,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, Badge, Card, Notice, EmptyState, inputClass, labelClass } from "../components/ui";
import { courses as seedCourses } from "../data/mockData";

const SEMESTERS = [
  "Semester I",
  "Semester II",
  "Semester III",
  "Semester IV",
  "Semester V",
  "Semester VI",
  "Semester VII",
  "Semester VIII",
];

const PROGRAMS = [
  "B.Sc Nursing - Year I",
  "B.Sc Nursing - Year II",
  "B.Sc Nursing - Year III",
  "B.Sc Nursing - Year IV",
];

const EMPTY_FORM = {
  title: "",
  program: PROGRAMS[0],
  semester: SEMESTERS[0],
  students: "",
  image: "",
  status: "Active",
};

/* ---------------- Course form modal (create + edit) ---------------- */

function CourseModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Give the course a name.";
    if (form.students !== "" && (isNaN(form.students) || Number(form.students) < 0))
      next.students = "Enter a number of students, or leave it blank.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        students: Number(form.students) || 0,
        image:
          form.image.trim() ||
          "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80",
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const field = inputClass;
  const label = labelClass;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit course" : "Create course"}
          </h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={label}>Course name</label>
            <input
              autoFocus
              className={field}
              value={form.title}
              onChange={set("title")}
              placeholder="Anatomy and Physiology"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Program</label>
              <select className={field} value={form.program} onChange={set("program")}>
                {PROGRAMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Semester</label>
              <select className={field} value={form.semester} onChange={set("semester")}>
                {SEMESTERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Enrolled students</label>
              <input
                className={field}
                value={form.students}
                onChange={set("students")}
                placeholder="32"
                inputMode="numeric"
              />
              {errors.students && <p className="text-xs text-rose-600 mt-1.5">{errors.students}</p>}
            </div>
            <div>
              <label className={label}>Status</label>
              <select className={field} value={form.status} onChange={set("status")}>
                <option>Active</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Cover image URL</label>
            <input
              className={field}
              value={form.image}
              onChange={set("image")}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave blank and a default cover is used.
            </p>
          </div>

          {form.image && (
            <img
              src={form.image}
              alt=""
              className="w-full h-32 object-cover rounded-xl border border-gray-100"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
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
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium"
          >
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create course"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- card kebab menu ---------------- */

function CardMenu({ onEdit, onDuplicate, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="absolute top-2 right-2 z-10" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Course actions"
        className="w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Pencil size={14} /> Edit
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

export default function MyCourses() {
  /*  Swap this for your API when the backend is ready:
        useEffect(() => { getCourses().then(setCourses); }, []);
      and make handleSave / handleDelete call POST / PUT / DELETE.  */
  const [courses, setCourses] = useState(seedCourses);

  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("All Semesters");
  const [modal, setModal] = useState(null); // null | {} | course
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const semesterOptions = useMemo(
    () => [...new Set(courses.map((c) => c.semester))].sort(),
    [courses]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.program.toLowerCase().includes(q) ||
        c.semester.toLowerCase().includes(q);
      const matchesSemester = semester === "All Semesters" || c.semester === semester;
      return matchesQuery && matchesSemester;
    });
  }, [courses, query, semester]);

  function handleSave(data) {
    if (data.id) {
      setCourses((list) => list.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
      setNotice(`"${data.title}" updated.`);
    } else {
      const id = Math.max(0, ...courses.map((c) => c.id)) + 1;
      setCourses((list) => [{ ...data, id }, ...list]);
      setNotice(`"${data.title}" created.`);
    }
  }

  function handleDuplicate(course) {
    const id = Math.max(0, ...courses.map((c) => c.id)) + 1;
    setCourses((list) => [
      { ...course, id, title: `${course.title} (Copy)`, status: "Draft", students: 0 },
      ...list,
    ]);
    setNotice("Course duplicated as a draft.");
  }

  function handleDelete(course) {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setCourses((list) => list.filter((c) => c.id !== course.id));
    setNotice(`"${course.title}" deleted.`);
  }

  return (
    <div>
      <PageHeader
        title="My Courses"
        subtitle="Manage and view all your courses"
        action={
          <PrimaryButton icon={Plus} onClick={() => setModal({})}>
            Create Course
          </PrimaryButton>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option>All Semesters</option>
          {semesterOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={courses.length === 0 ? <BookOpen size={24} /> : <ImageOff size={24} />}
            title={courses.length === 0 ? "No courses yet" : "No courses match your filters"}
            description={
              courses.length === 0
                ? "Create your first course and it will show up here."
                : "Clear the search or pick a different semester."
            }
            action={
              courses.length === 0 ? (
                <PrimaryButton icon={Plus} onClick={() => setModal({})}>
                  Create Course
                </PrimaryButton>
              ) : null
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c) => (
            <Card key={c.id} hover className="overflow-hidden group flex flex-col">
              <div className="relative overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                <CardMenu
                  onEdit={() => setModal(c)}
                  onDuplicate={() => handleDuplicate(c)}
                  onDelete={() => handleDelete(c)}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{c.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{c.program}</p>
                <p className="text-xs text-gray-400">{c.semester}</p>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={13} /> {c.students} Students
                  </span>
                  <Badge status={c.status} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <CourseModal
          initial={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}