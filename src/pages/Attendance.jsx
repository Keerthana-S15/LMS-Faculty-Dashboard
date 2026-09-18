// import { useState } from "react";
// import { Download, Filter, Calendar as CalendarIcon, Users, CheckCircle2, XCircle, Clock3 } from "lucide-react";
// import { PageHeader, OutlineButton, PrimaryButton, Select, StatCard, Card, Badge } from "../components/ui";
// import { attendance } from "../data/mockData";

// export default function Attendance() {
//   const [view, setView] = useState("By Date");

//   const total = attendance.length;
//   const present = attendance.filter((a) => a.status === "Present").length;
//   const absent = attendance.filter((a) => a.status === "Absent").length;
//   const late = attendance.filter((a) => a.status === "Late").length;

//   return (
//     <div>
//       <PageHeader
//         title="Attendance"
//         subtitle="View and manage student attendance"
//         action={<OutlineButton icon={Download}>Export Report</OutlineButton>}
//       />

//       <div className="flex flex-col lg:flex-row gap-3 mb-6">
//         <Select defaultValue="Anatomy and Physiology">
//           <option>Anatomy and Physiology</option>
//           <option>Fundamentals of Nursing</option>
//           <option>Pharmacology</option>
//         </Select>
//         <Select defaultValue="Year I - Batch A">
//           <option>Year I - Batch A</option>
//           <option>Year I - Batch B</option>
//         </Select>
//         <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600">
//           <CalendarIcon size={15} />
//           20 May 2025
//         </div>
//         <PrimaryButton icon={Filter}>Apply Filters</PrimaryButton>
//       </div>

//       <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
//         <StatCard icon={Users} label="Total Students" value={total} tint="purple" />
//         <StatCard icon={CheckCircle2} label="Present" value={`${present} (81.25%)`} tint="green" />
//         <StatCard icon={XCircle} label="Absent" value={`${absent} (18.75%)`} tint="red" />
//         <StatCard icon={Clock3} label="Late" value={`${late} (6.25%)`} tint="blue" />
//       </div>

//       <Card className="p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-semibold text-gray-900">Student Attendance List</h2>
//           <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
//             {["By Date", "By Session"].map((v) => (
//               <button
//                 key={v}
//                 onClick={() => setView(v)}
//                 className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
//                   view === v ? "bg-brand-600 text-white" : "text-gray-500"
//                 }`}
//               >
//                 {v}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className={tableHeadRowClass}>
//                 <th className="font-semibold py-3 px-4 w-8">
//                   <input type="checkbox" className="rounded border-gray-300" />
//                 </th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">#</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Student Name</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Roll Number</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Status</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Check In</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Check Out</th>
//                 <th className="font-semibold py-3 px-3 whitespace-nowrap">Remarks</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {attendance.map((a, i) => (
//                 <tr key={a.id} className={tableRowClass}>
//                   <td className="py-3 px-4">
//                     <input type="checkbox" className="rounded border-gray-300" />
//                   </td>
//                   <td className="py-3 px-3 text-gray-500">{i + 1}</td>
//                   <td className="py-3 px-3 font-medium text-gray-900">{a.name}</td>
//                   <td className="py-3 px-3 text-gray-600">{a.roll}</td>
//                   <td className="py-3 px-3"><Badge status={a.status} /></td>
//                   <td className="py-3 px-3 text-gray-600">{a.checkIn}</td>
//                   <td className="py-3 px-3 text-gray-600">{a.checkOut}</td>
//                   <td className="py-3 px-3 text-gray-500">{a.remarks}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  Save,
  CheckCheck,
  RotateCcw,
  SearchX,
} from "lucide-react";
import { PageHeader, OutlineButton, PrimaryButton, Select, StatCard, Card, Notice, EmptyState, tableHeadRowClass, SecondaryButton, SegmentedControl } from "../components/ui";
import { attendance as seedAttendance, students as seedStudents } from "../data/mockData";

const COURSES = [
  "Anatomy and Physiology",
  "Fundamentals of Nursing",
  "Pharmacology",
  "Community Health Nursing",
  "Medical-Surgical Nursing",
];

const BATCHES = ["Year I - Batch A", "Year I - Batch B", "Year II - Batch A", "Year II - Batch B"];

const SESSIONS = [
  { id: "s1", label: "Session 1", time: "09:00 AM - 10:00 AM" },
  { id: "s2", label: "Session 2", time: "11:30 AM - 12:30 PM" },
];

const STATUSES = ["Present", "Absent", "Late"];

const toKey = (d) => d.toISOString().slice(0, 10);
const todayKey = () => toKey(new Date());

/* ------------------------------------------------------------------
   A register is built per course + batch + date. The seeded rows are
   used for the first combination; anything else starts unmarked so the
   faculty can fill it in. Replace with your API when ready:
     getAttendance({ course, batch, date }).then(setRows)
-------------------------------------------------------------------*/
const roster = seedStudents.map((s) => ({ id: s.id, name: s.name, roll: s.roll }));

function buildRegister(course, batch, dateKey) {
  const isSeeded = course === COURSES[0] && batch === BATCHES[0];
  return roster.map((student, i) => {
    const seeded = isSeeded ? seedAttendance[i] : null;
    return {
      ...student,
      session: SESSIONS[i % 2].id,
      status: seeded?.status ?? "",
      checkIn: seeded?.checkIn && seeded.checkIn !== "-" ? seeded.checkIn : "",
      checkOut: seeded?.checkOut && seeded.checkOut !== "-" ? seeded.checkOut : "",
      remarks: seeded?.remarks && seeded.remarks !== "-" ? seeded.remarks : "",
    };
  });
}

const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

const statusStyle = {
  Present: "bg-emerald-600 text-white",
  Absent: "bg-rose-500 text-white",
  Late: "bg-amber-500 text-white",
};

const pct = (n, total) => (total ? `${((n / total) * 100).toFixed(1)}%` : "0%");

/* ---------------- CSV export ---------------- */

const csvCell = (v) => {
  const t = v == null || v === "" ? "-" : String(v);
  return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

function exportCsv(rows, { course, batch, date }) {
  const header = ["#", "Student Name", "Roll Number", "Status", "Check In", "Check Out", "Remarks"];
  const body = rows.map((r, i) =>
    [i + 1, r.name, r.roll, r.status || "Not Marked", r.checkIn, r.checkOut, r.remarks]
      .map(csvCell)
      .join(",")
  );
  const meta = [`Course:,${csvCell(course)}`, `Batch:,${csvCell(batch)}`, `Date:,${csvCell(date)}`, ""];
  const csv = `\uFEFF${meta.join("\n")}\n${header.join(",")}\n${body.join("\n")}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-${batch.replace(/\s+/g, "-").toLowerCase()}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ---------------- page ---------------- */

export default function Attendance() {
  // Draft filters live separately so "Apply Filters" actually does something.
  const [draft, setDraft] = useState({ course: COURSES[0], batch: BATCHES[0], date: todayKey() });
  const [applied, setApplied] = useState(draft);

  const [rows, setRows] = useState(() => buildRegister(applied.course, applied.batch, applied.date));
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState("By Date");
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setRows(buildRegister(applied.course, applied.batch, applied.date));
    setSelected([]);
    setDirty(false);
  }, [applied]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const filtersChanged =
    draft.course !== applied.course || draft.batch !== applied.batch || draft.date !== applied.date;

  const setStatus = (ids, status) => {
    setRows((list) =>
      list.map((r) =>
        ids.includes(r.id)
          ? {
              ...r,
              status,
              checkIn: status === "Absent" ? "" : r.checkIn || nowTime(),
              checkOut: status === "Absent" ? "" : r.checkOut,
              remarks: status === "Absent" && !r.remarks ? "Not Marked" : r.remarks,
            }
          : r
      )
    );
    setDirty(true);
  };

  const setRemarks = (id, remarks) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, remarks } : r)));
    setDirty(true);
  };

  const allSelected = selected.length === rows.length && rows.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : rows.map((r) => r.id));
  const toggleOne = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const counts = useMemo(() => {
    const total = rows.length;
    return {
      total,
      present: rows.filter((r) => r.status === "Present").length,
      absent: rows.filter((r) => r.status === "Absent").length,
      late: rows.filter((r) => r.status === "Late").length,
      unmarked: rows.filter((r) => !r.status).length,
    };
  }, [rows]);

  const bySession = useMemo(
    () =>
      SESSIONS.map((s) => {
        const list = rows.filter((r) => r.session === s.id);
        return {
          ...s,
          list,
          present: list.filter((r) => r.status === "Present").length,
          absent: list.filter((r) => r.status === "Absent").length,
          late: list.filter((r) => r.status === "Late").length,
        };
      }),
    [rows]
  );

  function handleSave() {
    // POST the register here when the backend is ready.
    setDirty(false);
    setNotice(`Attendance saved for ${applied.batch} on ${applied.date}.`);
  }

  function handleMarkAllPresent() {
    setStatus(rows.map((r) => r.id), "Present");
    setNotice("All students marked present.");
  }

  function handleReset() {
    setRows(buildRegister(applied.course, applied.batch, applied.date));
    setSelected([]);
    setDirty(false);
    setNotice("Changes discarded.");
  }

  const StatusPicker = ({ row }) => (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white divide-x divide-gray-200 overflow-hidden shadow-sm">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => setStatus([row.id], s)}
          title={s}
          aria-pressed={row.status === s}
          className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
            row.status === s ? statusStyle[s] : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          {s === "Present" ? "P" : s === "Absent" ? "A" : "L"}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="View and manage student attendance"
        action={
          <OutlineButton
            icon={Download}
            onClick={() => {
              exportCsv(rows, applied);
              setNotice("Attendance report downloaded.");
            }}
          >
            Export Report
          </OutlineButton>
        }
      />

      <Card className="p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-3">
        <Select value={draft.course} onChange={(e) => setDraft((d) => ({ ...d, course: e.target.value }))}>
          {COURSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select value={draft.batch} onChange={(e) => setDraft((d) => ({ ...d, batch: e.target.value }))}>
          {BATCHES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </Select>
        <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-700 hover:border-gray-300 focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-400 transition-[box-shadow,border-color]">
          <CalendarDays size={15} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={draft.date}
            max={todayKey()}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
            className="bg-transparent focus:outline-none min-w-0"
            aria-label="Attendance date"
          />
        </label>
        <PrimaryButton icon={Filter} onClick={() => setApplied(draft)}>
          Apply Filters
        </PrimaryButton>
        {filtersChanged && (
          <span className="inline-flex items-center self-center text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1 animate-fade-in">
            Filters changed — apply to reload
          </span>
        )}
      </Card>

      <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        <StatCard icon={Users} label="Total Students" value={counts.total} sub={`${counts.unmarked} not marked`} tint="purple" />
        <StatCard icon={CheckCircle2} label="Present" value={`${counts.present} (${pct(counts.present, counts.total)})`} tint="green" />
        <StatCard icon={XCircle} label="Absent" value={`${counts.absent} (${pct(counts.absent, counts.total)})`} tint="red" />
        <StatCard icon={Clock3} label="Late" value={`${counts.late} (${pct(counts.late, counts.total)})`} tint="blue" />
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Student Attendance List</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {applied.course} · {applied.batch} ·{" "}
              {new Date(applied.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 text-sm font-medium border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 px-3 py-2 rounded-xl transition-colors"
            >
              <CheckCheck size={15} /> Mark all present
            </button>
            <SegmentedControl options={["By Date", "By Session"]} value={view} onChange={setView} />
          </div>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5 animate-fade-in">
            <span className="text-sm text-brand-800 font-medium">{selected.length} selected</span>
            <span className="text-xs text-gray-500">Mark as</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(selected, s); setSelected([]); }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80 ${statusStyle[s]}`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => setSelected([])}
              className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
            >
              Clear selection
            </button>
          </div>
        )}

        {view === "By Session" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {bySession.map((s) => (
              <div key={s.id} className="bg-gray-50/70 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{s.label}</p>
                  <span className="text-xs text-gray-400">{s.time}</span>
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-emerald-600">Present {s.present}</span>
                  <span className="text-rose-500">Absent {s.absent}</span>
                  <span className="text-amber-600">Late {s.late}</span>
                  <span className="text-gray-400 ml-auto">{s.list.length} students</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={tableHeadRowClass}>
                <th className="font-semibold py-3 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">#</th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Student Name</th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Roll Number</th>
                {view === "By Session" && <th className="font-semibold py-3 px-3 whitespace-nowrap">Session</th>}
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Status</th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Check In</th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Check Out</th>
                <th className="font-semibold py-3 px-3 whitespace-nowrap">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r, i) => (
                <tr key={r.id} className={`transition-colors hover:bg-brand-50/40 ${selected.includes(r.id) ? "bg-brand-50/60" : ""}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(r.id)}
                      onChange={() => toggleOne(r.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-3 text-gray-500">{i + 1}</td>
                  <td className="py-3 px-3 font-medium text-gray-900">{r.name}</td>
                  <td className="py-3 px-3 text-gray-600">{r.roll}</td>
                  {view === "By Session" && (
                    <td className="py-3 px-3 text-gray-500">
                      {SESSIONS.find((s) => s.id === r.session)?.label}
                    </td>
                  )}
                  <td className="py-3 px-3">
                    <StatusPicker row={r} />
                  </td>
                  <td className="py-3 px-3 text-gray-600">{r.checkIn || "-"}</td>
                  <td className="py-3 px-3 text-gray-600">{r.checkOut || "-"}</td>
                  <td className="py-3 px-3">
                    <input
                      value={r.remarks}
                      onChange={(e) => setRemarks(r.id, e.target.value)}
                      placeholder="Add remark"
                      className="w-full max-w-[180px] px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-200 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 text-sm text-gray-600 bg-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <EmptyState
              icon={<SearchX size={24} />}
              title="No students in this batch"
              description="Pick a different course or batch and apply again."
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {counts.present} present · {counts.absent} absent · {counts.late} late · {counts.unmarked} not marked
          </p>
          <div className="flex items-center gap-2">
            {dirty && (
              <SecondaryButton icon={RotateCcw} size="sm" onClick={handleReset}>
                Discard
              </SecondaryButton>
            )}
            <PrimaryButton icon={Save} size="sm" onClick={handleSave} disabled={!dirty}>
              {dirty ? "Save attendance" : "All changes saved"}
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}