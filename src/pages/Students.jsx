// import { useState } from "react";
// import { Download, Eye, Users, UserRound, UserRound as Female, UserCheck } from "lucide-react";
// import { PageHeader, OutlineButton, SearchInput, Select, StatCard, Card } from "../components/ui";
// import { students } from "../data/mockData";

// export default function Students() {
//   const [query, setQuery] = useState("");

//   const filtered = students.filter(
//     (s) =>
//       s.name.toLowerCase().includes(query.toLowerCase()) ||
//       s.roll.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div>
//       <PageHeader
//         title="Students"
//         subtitle="View and manage your students"
//         action={<OutlineButton icon={Download}>Export</OutlineButton>}
//       />

//       <div className="flex flex-wrap gap-4 mb-6">
//         <StatCard icon={Users} label="Total Students" value="128" tint="purple" />
//         <StatCard icon={UserRound} label="Male Students" value="42" tint="blue" />
//         <StatCard icon={Female} label="Female Students" value="86" tint="red" />
//         <StatCard icon={UserCheck} label="Active Students" value="124" tint="green" />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <SearchInput placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>B.Sc Nursing - Year I</option>
//           <option>B.Sc Nursing - Year II</option>
//           <option>B.Sc Nursing - Year III</option>
//         </Select>
//         <Select defaultValue="All Batches">
//           <option>All Batches</option>
//           <option>Batch A</option>
//           <option>Batch B</option>
//         </Select>
//       </div>

//       <Card className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="text-left text-gray-500 border-b border-gray-100">
//               <th className="font-medium py-3 px-5">Student Name</th>
//               <th className="font-medium py-3 px-5">Roll Number</th>
//               <th className="font-medium py-3 px-5">Course</th>
//               <th className="font-medium py-3 px-5">Batch</th>
//               <th className="font-medium py-3 px-5">Email</th>
//               <th className="font-medium py-3 px-5">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filtered.map((s) => (
//               <tr key={s.id} className="hover:bg-gray-50">
//                 <td className="py-3 px-5 font-medium text-gray-900">{s.name}</td>
//                 <td className="py-3 px-5 text-gray-600">{s.roll}</td>
//                 <td className="py-3 px-5 text-gray-600">{s.course}</td>
//                 <td className="py-3 px-5 text-gray-600">{s.batch}</td>
//                 <td className="py-3 px-5 text-gray-600">{s.email}</td>
//                 <td className="py-3 px-5">
//                   <button className="p-1.5 text-brand-500 hover:text-brand-700">
//                     <Eye size={16} />
//                   </button>
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
  Download,
  Eye,
  Users,
  UserRound,
  UserCheck,
  UserRoundX,
  X,
  Mail,
  Phone,
  ArrowUpDown,
  SearchX,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileJson,
} from "lucide-react";
import { PageHeader, OutlineButton, SearchInput, Select, StatCard, Card, Badge } from "../components/ui";
import { students as seedStudents } from "../data/mockData";

const PER_PAGE = 8;

/* The seeded rows carry only name/roll/course/batch/email — fill in the
   fields the stat cards and the detail view need. Replace with your API
   result when the backend is ready. */
const EXTRA = {
  NUR1001: { gender: "Female", status: "Active", phone: "+91 98765 43210" },
  NUR1002: { gender: "Male", status: "Active", phone: "+91 98765 43211" },
  NUR1003: { gender: "Female", status: "Active", phone: "+91 98765 43212" },
  NUR1004: { gender: "Male", status: "Active", phone: "+91 98765 43213" },
  NUR1005: { gender: "Female", status: "Inactive", phone: "+91 98765 43214" },
  NUR1006: { gender: "Female", status: "Active", phone: "+91 98765 43215" },
  NUR1007: { gender: "Male", status: "Active", phone: "+91 98765 43216" },
};

const normalise = (list) =>
  list.map((s) => ({
    gender: "Female",
    status: "Active",
    phone: "",
    admissionYear: 2023,
    ...EXTRA[s.roll],
    ...s,
  }));

/* ---------------- CSV / JSON download ---------------- */

const COLUMNS = [
  { key: "name", label: "Student Name" },
  { key: "roll", label: "Roll Number" },
  { key: "course", label: "Course" },
  { key: "batch", label: "Batch" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "gender", label: "Gender" },
  { key: "status", label: "Status" },
];

/** Wraps a value so commas, quotes and newlines survive Excel. */
const csvCell = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const stamp = () => new Date().toISOString().slice(0, 10);

function exportCsv(rows, label) {
  const header = COLUMNS.map((c) => c.label).join(",");
  const body = rows.map((r) => COLUMNS.map((c) => csvCell(r[c.key])).join(",")).join("\n");
  // BOM keeps Excel happy with non-ASCII names.
  downloadFile(`\uFEFF${header}\n${body}`, `students-${label}-${stamp()}.csv`, "text/csv;charset=utf-8;");
}

function exportJson(rows, label) {
  const slim = rows.map((r) =>
    Object.fromEntries(COLUMNS.map((c) => [c.key, r[c.key] ?? ""]))
  );
  downloadFile(JSON.stringify(slim, null, 2), `students-${label}-${stamp()}.json`, "application/json");
}

/* ---------------- export dropdown ---------------- */

function ExportMenu({ filteredRows, allRows, onDone }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const run = (fn, rows, label, message) => {
    setOpen(false);
    if (rows.length === 0) return onDone("Nothing to export with the current filters.");
    fn(rows, label);
    onDone(message(rows.length));
  };

  return (
    <div className="relative" ref={ref}>
      <OutlineButton icon={Download} onClick={() => setOpen((v) => !v)}>
        Export
      </OutlineButton>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm z-30">
          <button
            onClick={() =>
              run(exportCsv, filteredRows, "filtered", (n) => `${n} students downloaded as CSV.`)
            }
            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span className="flex-1 text-left">
              CSV — current view
              <span className="block text-xs text-gray-400">{filteredRows.length} rows</span>
            </span>
          </button>
          <button
            onClick={() => run(exportCsv, allRows, "all", (n) => `All ${n} students downloaded as CSV.`)}
            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span className="flex-1 text-left">
              CSV — all students
              <span className="block text-xs text-gray-400">{allRows.length} rows</span>
            </span>
          </button>
          <button
            onClick={() => run(exportJson, filteredRows, "filtered", (n) => `${n} students downloaded as JSON.`)}
            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
          >
            <FileJson size={15} className="text-brand-600" />
            <span className="flex-1 text-left">JSON — current view</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- detail modal ---------------- */

function StudentModal({ student, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const row = (label, value) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Student details</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <img
              src={`https://i.pravatar.cc/120?u=${student.roll}`}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{student.name}</p>
              <p className="text-xs text-gray-500">{student.roll}</p>
              <div className="mt-1.5">
                <Badge status={student.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            <a
              href={`mailto:${student.email}`}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-brand-200 text-brand-700 hover:bg-brand-50 text-sm font-medium py-2 rounded-xl"
            >
              <Mail size={15} /> Email
            </a>
            {student.phone && (
              <a
                href={`tel:${student.phone.replace(/\s/g, "")}`}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-brand-200 text-brand-700 hover:bg-brand-50 text-sm font-medium py-2 rounded-xl"
              >
                <Phone size={15} /> Call
              </a>
            )}
          </div>

          <div>
            {row("Course", student.course)}
            {row("Batch", student.batch)}
            {row("Email", student.email)}
            {row("Phone", student.phone)}
            {row("Gender", student.gender)}
            {row("Status", student.status)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Students() {
  /*  Swap for your API when the backend is ready:
        useEffect(() => { getStudents().then((r) => setStudents(normalise(r))); }, []);  */
  const [students] = useState(() => normalise(seedStudents));

  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [batch, setBatch] = useState("all");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(id);
  }, [notice]);

  useEffect(() => setPage(1), [query, course, batch]);

  const courseOptions = useMemo(() => [...new Set(students.map((s) => s.course))].sort(), [students]);
  const batchOptions = useMemo(() => [...new Set(students.map((s) => s.batch))].sort(), [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = students.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.roll.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      return (
        matchesQuery &&
        (course === "all" || s.course === course) &&
        (batch === "all" || s.batch === batch)
      );
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key])) * dir);
  }, [students, query, course, batch, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats follow whatever is on screen, so filters stay meaningful.
  const scope = filtered;
  const stats = {
    total: scope.length,
    male: scope.filter((s) => s.gender === "Male").length,
    female: scope.filter((s) => s.gender === "Female").length,
    active: scope.filter((s) => s.status === "Active").length,
    inactive: scope.filter((s) => s.status !== "Active").length,
  };

  const isFiltered = query || course !== "all" || batch !== "all";

  const SortHeader = ({ label, sortKey }) => (
    <th className="font-medium py-3 px-5">
      <button
        onClick={() =>
          setSort((s) =>
            s.key === sortKey
              ? { key: sortKey, dir: s.dir === "asc" ? "desc" : "asc" }
              : { key: sortKey, dir: "asc" }
          )
        }
        className={`inline-flex items-center gap-1 hover:text-gray-700 ${
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
        title="Students"
        subtitle="View and manage your students"
        action={
          <ExportMenu filteredRows={filtered} allRows={students} onDone={setNotice} />
        }
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard icon={Users} label="Total Students" value={stats.total} sub={isFiltered ? "In current view" : undefined} tint="purple" />
        <StatCard icon={UserRound} label="Male Students" value={stats.male} tint="blue" />
        <StatCard icon={UserRound} label="Female Students" value={stats.female} tint="red" />
        <StatCard icon={UserCheck} label="Active Students" value={stats.active} tint="green" />
        <StatCard icon={UserRoundX} label="Inactive" value={stats.inactive} tint="orange" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput
          placeholder="Search by name, roll number or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="all">All Batches</option>
          {batchOptions.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </Select>
      </div>

      {notice && (
        <div className="mb-5 text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
          {notice}
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <SortHeader label="Student Name" sortKey="name" />
              <SortHeader label="Roll Number" sortKey="roll" />
              <SortHeader label="Course" sortKey="course" />
              <SortHeader label="Batch" sortKey="batch" />
              <th className="font-medium py-3 px-5">Email</th>
              <SortHeader label="Status" sortKey="status" />
              <th className="font-medium py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="py-3 px-5">
                  <button onClick={() => setDetail(s)} className="flex items-center gap-3 text-left">
                    <img
                      src={`https://i.pravatar.cc/60?u=${s.roll}`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900 hover:text-brand-600">{s.name}</span>
                  </button>
                </td>
                <td className="py-3 px-5 text-gray-600">{s.roll}</td>
                <td className="py-3 px-5 text-gray-600">{s.course}</td>
                <td className="py-3 px-5 text-gray-600">{s.batch}</td>
                <td className="py-3 px-5">
                  <a href={`mailto:${s.email}`} className="text-gray-600 hover:text-brand-600">
                    {s.email}
                  </a>
                </td>
                <td className="py-3 px-5"><Badge status={s.status} /></td>
                <td className="py-3 px-5">
                  <button
                    onClick={() => setDetail(s)}
                    className="p-1.5 text-brand-500 hover:text-brand-700"
                    title="View student"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-3">
              <SearchX size={24} />
            </div>
            <p className="text-sm font-medium text-gray-800">No students match your filters</p>
            <p className="text-sm text-gray-500 mt-1">Try a different search term, course or batch.</p>
            <button
              onClick={() => { setQuery(""); setCourse("all"); setBatch("all"); }}
              className="mt-4 text-sm font-medium text-brand-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium ${
                    page === i + 1 ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {detail && <StudentModal student={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}