// import { BookOpen, Video, ClipboardList, Users, Megaphone, MapPin, Calendar } from "lucide-react";
// import { StatCard, Card, Badge } from "../components/ui";
// import {
//   courses,
//   todaysSchedule,
//   announcements,
//   pendingAssignments,
//   faculty,
// } from "../data/mockData";

// const tagColor = {
//   purple: "bg-brand-100 text-brand-700",
//   green: "bg-emerald-100 text-emerald-700",
//   orange: "bg-amber-100 text-amber-700",
//   blue: "bg-blue-100 text-blue-700",
// };

// export default function Dashboard() {
//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
//           <p className="text-sm text-gray-500">
//             Welcome back, <span className="text-brand-600 font-medium">{faculty.name}</span>
//           </p>
//         </div>
//         <div className="flex items-center gap-1.5 text-sm text-gray-500">
//           <Calendar size={15} />
//           Saturday, 31 May 2025
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <StatCard icon={BookOpen} label="My Courses" value="4" sub="Active Courses" tint="purple" />
//         <StatCard icon={Video} label="Live Classes" value="2" sub="Today's Classes" tint="green" />
//         <StatCard icon={ClipboardList} label="Assignments" value="6" sub="Pending to Review" tint="orange" />
//         <StatCard icon={Users} label="Students" value="128" sub="Total Students" tint="blue" />
//         <StatCard icon={Megaphone} label="Announcements" value="3" sub="Unread" tint="red" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         <Card className="lg:col-span-1 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-gray-900">My Courses</h2>
//             <a href="/courses" className="text-sm text-brand-600 font-medium hover:underline">View All</a>
//           </div>
//           <div className="space-y-4">
//             {courses.slice(0, 4).map((c) => (
//               <div key={c.id} className="flex items-center gap-3">
//                 <img src={c.image} alt={c.title} className="w-12 h-12 rounded-lg object-cover" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
//                   <p className="text-xs text-gray-500">{c.program}</p>
//                   <p className="text-xs text-gray-400">{c.students} Students</p>
//                 </div>
//                 <Badge status={c.status} />
//               </div>
//             ))}
//           </div>
//           <a href="/courses" className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline">
//             View All Courses →
//           </a>
//         </Card>

//         <Card className="lg:col-span-1 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
//             <a href="/live-classes" className="text-sm text-brand-600 font-medium hover:underline">View Calendar</a>
//           </div>
//           <div className="space-y-4">
//             {todaysSchedule.map((s) => (
//               <div key={s.id} className="flex items-start gap-3">
//                 <div className="text-right w-14 shrink-0">
//                   <p className="text-sm font-semibold text-gray-800">{s.time}</p>
//                   <p className="text-[11px] text-gray-400">{s.ampm}</p>
//                 </div>
//                 <div className="flex-1 border-l-2 border-gray-100 pl-3">
//                   <div className="flex items-center justify-between">
//                     <p className="text-sm font-medium text-gray-900">{s.title}</p>
//                     <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tagColor[s.color]}`}>
//                       {s.tag}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500">{s.meta}</p>
//                   <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                     <MapPin size={11} /> {s.room}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <a href="/live-classes" className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline">
//             View Full Schedule →
//           </a>
//         </Card>

//         <Card className="lg:col-span-1 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-gray-900">Pending Assignments</h2>
//             <a href="/assignments" className="text-sm text-brand-600 font-medium hover:underline">View All</a>
//           </div>
//           <div className="space-y-4">
//             {pendingAssignments.map((a) => (
//               <div key={a.id} className="flex items-start gap-3">
//                 <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
//                   <ClipboardList size={16} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">{a.title}</p>
//                   <p className="text-xs text-gray-500">{a.meta}</p>
//                   <p className="text-xs text-gray-400">Submitted: {a.submitted}</p>
//                 </div>
//                 <div className="text-right shrink-0">
//                   <p className="text-[11px] text-gray-400">Due</p>
//                   <p className="text-xs font-medium text-rose-500">{a.due}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <a href="/assignments" className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline">
//             View All Assignments →
//           </a>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
//         <Card className="lg:col-span-2 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="font-semibold text-gray-900">Recent Announcements</h2>
//             <a href="/announcements" className="text-sm text-brand-600 font-medium hover:underline">View All</a>
//           </div>
//           <div className="divide-y divide-gray-100">
//             {announcements.map((a) => (
//               <div key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
//                 <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
//                   <Megaphone size={16} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">{a.title}</p>
//                   <p className="text-xs text-gray-500">{a.desc}</p>
//                 </div>
//                 <p className="text-xs text-gray-400 shrink-0">{a.date}</p>
//               </div>
//             ))}
//           </div>
//         </Card>

//         <Card className="lg:col-span-1 p-5">
//           <h2 className="font-semibold text-gray-900 mb-4">My Profile</h2>
//           <div className="flex items-center gap-3">
//             <img
//               src="https://i.pravatar.cc/100?img=47"
//               alt={faculty.name}
//               className="w-14 h-14 rounded-full object-cover"
//             />
//             <div>
//               <p className="text-sm font-semibold text-brand-700">{faculty.name}</p>
//               <p className="text-xs text-gray-500">{faculty.role}</p>
//               <p className="text-xs text-gray-400">{faculty.department}</p>
//             </div>
//           </div>
//           <div className="mt-4 space-y-1.5 text-xs text-gray-500">
//             <p>Email: {faculty.email}</p>
//             <p>Phone: {faculty.phone}</p>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }




import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  ClipboardList,
  Users,
  Megaphone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Dot,
  CheckCheck,
} from "lucide-react";
import { StatCard, Card, Badge } from "../components/ui";
import {
  courses,
  announcements as seedAnnouncements,
  pendingAssignments,
  faculty,
} from "../data/mockData";

/* ------------------------------------------------------------------
   Schedule data built around today's date so the calendar, the
   countdowns and the "Live now" highlight all behave correctly.
   Replace SCHEDULE with your API result when the backend is ready.
-------------------------------------------------------------------*/
const at = (dayOffset, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const SCHEDULE = [
  { id: 1, title: "Anatomy and Physiology", meta: "Year I - Batch A", room: "Room 101", startAt: at(0, 9), endAt: at(0, 10), tone: "purple" },
  { id: 2, title: "Fundamentals of Nursing", meta: "Year I - Batch B", room: "Room 102", startAt: at(0, 11, 30), endAt: at(0, 12, 30), tone: "green" },
  { id: 3, title: "Pharmacology", meta: "Year II - Batch A", room: "Room 103", startAt: at(0, 14), endAt: at(0, 15), tone: "orange" },
  { id: 4, title: "Community Health Nursing", meta: "Year III - Batch B", room: "Room 104", startAt: at(0, 15, 30), endAt: at(0, 16, 30), tone: "blue" },
  { id: 5, title: "Medical-Surgical Nursing", meta: "Year II - Batch A", room: "Room 105", startAt: at(1, 9, 30), endAt: at(1, 10, 30), tone: "purple" },
  { id: 6, title: "Child Health Nursing", meta: "Year III - Batch A", room: "Room 106", startAt: at(1, 13), endAt: at(1, 14), tone: "green" },
  { id: 7, title: "Nutrition and Dietetics", meta: "Year II - Batch B", room: "Room 107", startAt: at(2, 10), endAt: at(2, 11), tone: "orange" },
  { id: 8, title: "Mental Health Nursing", meta: "Year IV - Batch A", room: "Room 108", startAt: at(3, 11), endAt: at(3, 12), tone: "blue" },
  { id: 9, title: "Anatomy and Physiology", meta: "Year I - Batch B", room: "Room 101", startAt: at(-1, 9), endAt: at(-1, 10), tone: "purple" },
];

const toneClass = {
  purple: "bg-brand-100 text-brand-700",
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
};

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfWeek = (d) => {
  const s = new Date(d);
  s.setDate(s.getDate() - s.getDay());
  s.setHours(0, 0, 0, 0);
  return s;
};

const fmtTime = (d) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

/** Days remaining until a due date like "02 Jun 2025". */
function daysUntil(dateStr, now) {
  const due = new Date(dateStr);
  if (isNaN(due)) return null;
  due.setHours(23, 59, 59, 999);
  return Math.ceil((due - now) / 86400000);
}

/* ---------------- week strip calendar ---------------- */

function WeekCalendar({ selected, onSelect, now, eventsByDay }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(selected));

  useEffect(() => {
    setWeekStart(startOfWeek(selected));
  }, [selected]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  const shiftWeek = (delta) => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + delta * 7);
    setWeekStart(next);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => shiftWeek(-1)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Previous week"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-xs font-medium text-gray-600">
          {weekStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => shiftWeek(1)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Next week"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isSelected = sameDay(d, selected);
          const isToday = sameDay(d, now);
          const count = eventsByDay(d).length;
          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelect(d)}
              className={`flex flex-col items-center py-1.5 rounded-lg text-xs transition-colors ${
                isSelected
                  ? "bg-brand-600 text-white"
                  : isToday
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className="text-[10px]">{DAY_SHORT[d.getDay()]}</span>
              <span className="font-semibold text-sm leading-tight">{d.getDate()}</span>
              <span
                className={`w-1 h-1 rounded-full mt-0.5 ${
                  count ? (isSelected ? "bg-white" : "bg-brand-500") : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Dashboard() {
  const [now, setNow] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [announcements, setAnnouncements] = useState(() =>
    seedAnnouncements.map((a) => ({ ...a, read: false }))
  );

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const eventsByDay = (day) => SCHEDULE.filter((s) => sameDay(s.startAt, day));

  const dayEvents = useMemo(
    () => eventsByDay(selectedDate).sort((a, b) => a.startAt - b.startAt),
    [selectedDate]
  );

  const todayEvents = useMemo(() => eventsByDay(now), [now]);
  const unreadCount = announcements.filter((a) => !a.read).length;
  const activeCourses = courses.filter((c) => c.status === "Active");
  const totalStudents = courses.reduce((sum, c) => sum + (Number(c.students) || 0), 0);

  const isViewingToday = sameDay(selectedDate, now);

  const stats = [
    { to: "/courses", icon: BookOpen, label: "My Courses", value: activeCourses.length, sub: "Active Courses", tint: "purple" },
    { to: "/live-classes", icon: Video, label: "Live Classes", value: todayEvents.length, sub: "Today's Classes", tint: "green" },
    { to: "/assignments", icon: ClipboardList, label: "Assignments", value: pendingAssignments.length, sub: "Pending to Review", tint: "orange" },
    { to: "/students", icon: Users, label: "Students", value: totalStudents, sub: "Total Students", tint: "blue" },
    { to: "/announcements", icon: Megaphone, label: "Announcements", value: unreadCount, sub: "Unread", tint: "red" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, <span className="text-brand-600 font-medium">{faculty.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <CalendarDays size={15} />
          {now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="flex-1 min-w-[160px] rounded-2xl transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <StatCard icon={s.icon} label={s.label} value={s.value} sub={s.sub} tint={s.tint} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My Courses */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
            <Link to="/courses" className="text-sm text-brand-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {courses.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/courses"
                className="flex items-center gap-3 rounded-xl -mx-2 px-2 py-1.5 hover:bg-gray-50"
              >
                <img src={c.image} alt={c.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.program}</p>
                  <p className="text-xs text-gray-400">{c.students} Students</p>
                </div>
                <Badge status={c.status} />
              </Link>
            ))}
          </div>
          <Link
            to="/courses"
            className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline"
          >
            View All Courses
          </Link>
        </Card>

        {/* Schedule with calendar */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              {isViewingToday
                ? "Today's Schedule"
                : selectedDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </h2>
            {!isViewingToday && (
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                Back to today
              </button>
            )}
          </div>

          <WeekCalendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            now={now}
            eventsByDay={eventsByDay}
          />

          <div className="space-y-4">
            {dayEvents.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No classes scheduled for this day.
              </p>
            )}
            {dayEvents.map((s) => {
              const live = now >= s.startAt && now <= s.endAt;
              const done = now > s.endAt;
              return (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="text-right w-14 shrink-0">
                    <p className={`text-sm font-semibold ${done ? "text-gray-400" : "text-gray-800"}`}>
                      {fmtTime(s.startAt).replace(/\s?[AP]M/, "")}
                    </p>
                    <p className="text-[11px] text-gray-400">{fmtTime(s.endAt)}</p>
                  </div>
                  <div
                    className={`flex-1 border-l-2 pl-3 ${
                      live ? "border-emerald-400" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-medium ${done ? "text-gray-400" : "text-gray-900"}`}>
                        {s.title}
                      </p>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          live
                            ? "bg-emerald-100 text-emerald-700"
                            : done
                            ? "bg-gray-100 text-gray-500"
                            : toneClass[s.tone]
                        }`}
                      >
                        {live ? "Live now" : done ? "Done" : "Live Class"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{s.meta}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {s.room}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/live-classes"
            className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline"
          >
            View Full Schedule
          </Link>
        </Card>

        {/* Pending assignments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Assignments</h2>
            <Link to="/assignments" className="text-sm text-brand-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {pendingAssignments.map((a) => {
              const left = daysUntil(a.due, now);
              const [got, total] = String(a.submitted).split("/").map(Number);
              const pct = total ? Math.round((got / total) * 100) : 0;
              const urgent = left !== null && left <= 2;
              return (
                <Link
                  key={a.id}
                  to="/assignments"
                  className="flex items-start gap-3 rounded-xl -mx-2 px-2 py-1.5 hover:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <ClipboardList size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.meta}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{a.submitted}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-gray-400">Due</p>
                    <p className={`text-xs font-medium ${urgent ? "text-rose-500" : "text-gray-600"}`}>
                      {a.due}
                    </p>
                    {left !== null && (
                      <p className="text-[10px] text-gray-400">
                        {left < 0 ? "Overdue" : left === 0 ? "Today" : `${left} days left`}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            to="/assignments"
            className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline"
          >
            View All Assignments
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Announcements */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Recent Announcements
              {unreadCount > 0 && (
                <span className="ml-2 text-[11px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full align-middle">
                  {unreadCount} unread
                </span>
              )}
            </h2>
            {unreadCount > 0 ? (
              <button
                onClick={() => setAnnouncements((list) => list.map((a) => ({ ...a, read: true })))}
                className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
              >
                <CheckCheck size={15} /> Mark all read
              </button>
            ) : (
              <Link to="/announcements" className="text-sm text-brand-600 font-medium hover:underline">
                View All
              </Link>
            )}
          </div>
          <div className="divide-y divide-gray-100">
            {announcements.map((a) => (
              <button
                key={a.id}
                onClick={() =>
                  setAnnouncements((list) =>
                    list.map((x) => (x.id === a.id ? { ...x, read: true } : x))
                  )
                }
                className="w-full flex items-start gap-3 py-3 text-left first:pt-0 last:pb-0 hover:bg-gray-50 rounded-xl px-2 -mx-2"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    a.read ? "bg-gray-100 text-gray-400" : "bg-rose-100 text-rose-500"
                  }`}
                >
                  <Megaphone size={16} />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      a.read ? "text-gray-600 font-normal" : "text-gray-900 font-medium"
                    }`}
                  >
                    {a.title}
                    {!a.read && <Dot size={18} className="text-rose-500 -ml-1" />}
                  </p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0">{a.date}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Profile */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Profile</h2>
            <Link to="/profile" className="text-sm text-brand-600 font-medium hover:underline">
              Edit
            </Link>
          </div>
          <Link to="/profile" className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=47"
              alt={faculty.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-brand-700">{faculty.name}</p>
              <p className="text-xs text-gray-500">{faculty.role}</p>
              <p className="text-xs text-gray-400">{faculty.department}</p>
            </div>
          </Link>
          <div className="mt-4 space-y-1.5 text-xs text-gray-500">
            <p>Email: {faculty.email}</p>
            <p>Phone: {faculty.phone}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{activeCourses.length}</p>
              <p className="text-[11px] text-gray-400">Active courses</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{todayEvents.length}</p>
              <p className="text-[11px] text-gray-400">Classes today</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}