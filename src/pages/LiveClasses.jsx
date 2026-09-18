// import { useState } from "react";
// import { CalendarPlus, MoreVertical, Clock, MapPin } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, Card } from "../components/ui";
// import { liveClasses } from "../data/mockData";

// const tabs = ["Upcoming Classes", "Ongoing Classes", "Completed Classes"];

// export default function LiveClasses() {
//   const [tab, setTab] = useState(tabs[0]);
//   const [query, setQuery] = useState("");

//   const filtered = liveClasses.filter((c) =>
//     c.title.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div>
//       <PageHeader
//         breadcrumb="Dashboard > Live Classes"
//         title="Live Classes"
//         subtitle="Manage your live classes and sessions"
//         action={<PrimaryButton icon={CalendarPlus}>Schedule Live Class</PrimaryButton>}
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

//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <SearchInput
//           placeholder="Search live classes..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>Anatomy and Physiology</option>
//           <option>Fundamentals of Nursing</option>
//           <option>Pharmacology</option>
//           <option>Community Health Nursing</option>
//         </Select>
//       </div>

//       <Card className="divide-y divide-gray-100">
//         {filtered.map((c) => (
//           <div key={c.id} className="flex items-center gap-4 p-4">
//             <div className="w-16 text-center shrink-0">
//               <p className="text-xl font-bold text-gray-900 leading-tight">{c.date}</p>
//               <p className="text-[11px] font-medium text-gray-400">{c.month}</p>
//               <p className="text-[11px] text-gray-400">{c.day}</p>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-gray-900">{c.title}</p>
//               <p className="text-xs text-gray-500">{c.meta}</p>
//               <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
//                 <span className="flex items-center gap-1"><Clock size={12} /> {c.time}</span>
//                 <span className="flex items-center gap-1"><MapPin size={12} /> {c.room}</span>
//               </div>
//             </div>
//             <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full shrink-0">
//               {c.status}
//             </span>
//             <button className="border border-brand-200 text-brand-600 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-brand-50 shrink-0">
//               Join
//             </button>
//             <button className="p-2 text-gray-400 hover:text-gray-600 shrink-0">
//               <MoreVertical size={16} />
//             </button>
//           </div>
//         ))}
//       </Card>
//     </div>
//   );
// }




import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarPlus,
  MoreVertical,
  Clock,
  MapPin,
  CalendarX,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, Card, Notice, Tabs, EmptyState, IconButton } from "../components/ui";

/* ------------------------------------------------------------------
   Sample data — real Date objects so the tabs and countdowns work.
   Replace this block with your API call when the backend is ready:
     const [classes, setClasses] = useState([]);
     useEffect(() => { getLiveClasses({ status: tab }).then(setClasses); }, [tab]);
-------------------------------------------------------------------*/
const at = (dayOffset, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const SAMPLE_CLASSES = [
  {
    id: 1,
    title: "Anatomy and Physiology",
    course: "Anatomy and Physiology",
    year: "Year I",
    batch: "Batch A",
    room: "Room 101",
    startAt: at(0, new Date().getHours() + 2, 0),
    endAt: at(0, new Date().getHours() + 3, 0),
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Fundamentals of Nursing",
    course: "Fundamentals of Nursing",
    year: "Year I",
    batch: "Batch B",
    room: "Room 102",
    startAt: at(0, new Date().getHours() + 4, 30),
    endAt: at(0, new Date().getHours() + 5, 30),
    meetingLink: "https://meet.google.com/klm-nopq-rst",
  },
  {
    id: 3,
    title: "Pharmacology",
    course: "Pharmacology",
    year: "Year II",
    batch: "Batch A",
    room: "Room 103",
    startAt: at(0, new Date().getHours(), new Date().getMinutes() - 10),
    endAt: at(0, new Date().getHours() + 1, new Date().getMinutes()),
    meetingLink: "https://meet.google.com/uvw-xyza-bcd",
  },
  {
    id: 4,
    title: "Community Health Nursing",
    course: "Community Health Nursing",
    year: "Year II",
    batch: "Batch B",
    room: "Room 104",
    startAt: at(1, 10, 0),
    endAt: at(1, 11, 0),
    meetingLink: "https://meet.google.com/efg-hijk-lmn",
  },
  {
    id: 5,
    title: "Medical-Surgical Nursing",
    course: "Medical-Surgical Nursing",
    year: "Year II",
    batch: "Batch A",
    room: "Room 105",
    startAt: at(-1, 14, 0),
    endAt: at(-1, 15, 0),
    meetingLink: "",
  },
  {
    id: 6,
    title: "Child Health Nursing",
    course: "Child Health Nursing",
    year: "Year III",
    batch: "Batch B",
    room: "Room 106",
    startAt: at(-2, 9, 0),
    endAt: at(-2, 10, 0),
    meetingLink: "",
  },
];

const TABS = [
  { key: "upcoming", label: "Upcoming Classes" },
  { key: "ongoing", label: "Ongoing Classes" },
  { key: "completed", label: "Completed Classes" },
];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatTimeRange(start, end) {
  const opts = { hour: "2-digit", minute: "2-digit", hour12: true };
  const s = start.toLocaleTimeString("en-IN", opts).toUpperCase();
  return end ? `${s} - ${end.toLocaleTimeString("en-IN", opts).toUpperCase()}` : s;
}

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function statusOf(c, now) {
  if (now >= c.startAt && now <= c.endAt) return "ongoing";
  if (now > c.endAt) return "completed";
  return "upcoming";
}

/** "Live now" / "Starts in 2 hours" / "Tomorrow" / "Completed" */
function statusLabel(c, now) {
  const state = statusOf(c, now);
  if (state === "ongoing") return { text: "Live now", tone: "live" };
  if (state === "completed") {
    return {
      text: sameDay(c.endAt, now)
        ? "Completed today"
        : c.endAt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      tone: "muted",
    };
  }

  const mins = Math.round((c.startAt - now) / 60000);
  if (mins < 60) return { text: `Starts in ${mins} min`, tone: "soon" };
  if (sameDay(c.startAt, now)) {
    const hrs = Math.round(mins / 60);
    return { text: `Starts in ${hrs} ${hrs === 1 ? "hour" : "hours"}`, tone: "soon" };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sameDay(c.startAt, tomorrow)) return { text: "Tomorrow", tone: "later" };

  const days = Math.ceil((c.startAt - now) / 86400000);
  return { text: `In ${days} days`, tone: "later" };
}

const toneClass = {
  live: "bg-emerald-100 text-emerald-700",
  soon: "bg-brand-100 text-brand-700",
  later: "bg-amber-100 text-amber-700",
  muted: "bg-gray-100 text-gray-500",
};

/** Join opens 15 minutes before the start and closes at the end. */
const isJoinable = (c, now) =>
  now >= new Date(c.startAt.getTime() - 15 * 60000) && now <= c.endAt;

function RowMenu({ onEdit, onCopyLink, onCancel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <IconButton icon={MoreVertical} label="More actions" onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Pencil size={14} /> Edit class
          </button>
          <button
            onClick={() => { setOpen(false); onCopyLink(); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Copy size={14} /> Copy join link
          </button>
          <button
            onClick={() => { setOpen(false); onCancel(); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={14} /> Cancel class
          </button>
        </div>
      )}
    </div>
  );
}

export default function LiveClasses() {
  const [classes, setClasses] = useState(SAMPLE_CLASSES);
  const [tab, setTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [now, setNow] = useState(() => new Date());
  const [notice, setNotice] = useState("");

  // Keeps the countdown pills and Join buttons accurate.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const courseOptions = useMemo(
    () => [...new Set(classes.map((c) => c.course))],
    [classes]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes
      .filter((c) => statusOf(c, now) === tab)
      .filter((c) => (course === "all" ? true : c.course === course))
      .filter(
        (c) =>
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.course.toLowerCase().includes(q) ||
          c.batch.toLowerCase().includes(q) ||
          c.room.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        tab === "completed" ? b.startAt - a.startAt : a.startAt - b.startAt
      );
  }, [classes, tab, course, query, now]);

  const countFor = (key) => classes.filter((c) => statusOf(c, now) === key).length;

  function handleJoin(c) {
    if (c.meetingLink) window.open(c.meetingLink, "_blank", "noopener,noreferrer");
    else setNotice("No meeting link has been added to this class yet.");
  }

  function handleCopyLink(c) {
    if (!c.meetingLink) return setNotice("No meeting link to copy.");
    navigator.clipboard.writeText(c.meetingLink);
    setNotice("Join link copied.");
  }

  function handleCancel(c) {
    if (!window.confirm(`Cancel "${c.title}"? Students will be notified.`)) return;
    setClasses((list) => list.filter((x) => x.id !== c.id));
    setNotice("Class cancelled.");
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard > Live Classes"
        title="Live Classes"
        subtitle="Manage your live classes and sessions"
        action={
          <PrimaryButton
            icon={CalendarPlus}
            onClick={() => setNotice("Scheduling form opens here.")}
          >
            Schedule Live Class
          </PrimaryButton>
        }
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} count={countFor} className="mb-5" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput
          placeholder="Search live classes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="divide-y divide-gray-100">
        {visible.length === 0 ? (
          <EmptyState
            icon={<CalendarX size={24} />}
            title={
              query || course !== "all"
                ? "No classes match your filters"
                : `No ${TABS.find((t) => t.key === tab).label.toLowerCase()} right now`
            }
            description={
              query || course !== "all"
                ? "Clear the search or pick a different course."
                : "Schedule a class and it will appear here for your students."
            }
          />
        ) : (
          visible.map((c) => {
            const pill = statusLabel(c, now);
            const joinable = isJoinable(c, now);
            return (
              <div
                key={c.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-3 p-4 transition-colors hover:bg-brand-50/40"
              >
                <div
                  className={`w-16 py-2 rounded-xl text-center shrink-0 ring-1 ${
                    pill.tone === "live"
                      ? "bg-emerald-50 ring-emerald-100"
                      : pill.tone === "muted"
                      ? "bg-gray-50 ring-gray-100"
                      : "bg-brand-50 ring-brand-100"
                  }`}
                >
                  <p
                    className={`text-xl font-bold leading-tight tabular-nums ${
                      pill.tone === "muted" ? "text-gray-500" : "text-gray-900"
                    }`}
                  >
                    {String(c.startAt.getDate()).padStart(2, "0")}
                  </p>
                  <p className="text-[11px] font-semibold text-gray-500 tracking-wide">
                    {MONTHS[c.startAt.getMonth()]}
                  </p>
                  <p className="text-[10px] text-gray-400">{DAYS[c.startAt.getDay()]}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">
                    {c.year} - {c.batch}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatTimeRange(c.startAt, c.endAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {c.room}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${toneClass[pill.tone]}`}
                >
                  {pill.tone === "live" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  {pill.text}
                </span>

                <button
                  onClick={() => handleJoin(c)}
                  disabled={!joinable}
                  title={joinable ? "Join the class" : "Opens 15 minutes before the class starts"}
                  className={`text-sm font-medium px-4 py-2 rounded-xl shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    pill.tone === "live"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50 disabled:hover:bg-white"
                  }`}
                >
                  {statusOf(c, now) === "completed" ? "View" : "Join"}
                </button>

                <RowMenu
                  onEdit={() => setNotice(`Edit form for "${c.title}" opens here.`)}
                  onCopyLink={() => handleCopyLink(c)}
                  onCancel={() => handleCancel(c)}
                />
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}