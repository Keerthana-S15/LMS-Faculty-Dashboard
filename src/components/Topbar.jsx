import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Megaphone,
  CheckCheck,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  BadgeCheck,
  Award,
  BookOpen,
  Users,
} from "lucide-react";
import { announcements, courses } from "../data/mockData";
import { useFaculty } from "../context/useFaculty";
import { Avatar } from "./ui";

/* Route → title shown in the bar; keeps the user oriented on small screens
   where the sidebar is hidden. */
const PAGE_TITLES = {
  "/": "Dashboard",
  "/courses": "My Courses",
  "/live-classes": "Live Classes",
  "/assignments": "Assignments",
  "/quizzes": "Quizzes",
  "/students": "Students",
  "/attendance": "Attendance",
  "/study-materials": "Study Materials",
  "/announcements": "Announcements",
  "/messages": "Messages",
  "/profile": "My Profile",
  "/logout": "Logout",
};

/**
 * Closes a dropdown on outside pointer-down or Escape. `extraRef` lets a
 * popover rendered elsewhere in the DOM (a portal) count as "inside".
 */
function useDismiss(open, onClose, extraRef) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const inside = (el, e) => el && (el === e.target || el.contains(e.target));
    const onDown = (e) => {
      if (inside(ref.current, e) || inside(extraRef?.current, e)) return;
      onClose();
    };
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose, extraRef]);
  return ref;
}

/** Fixed position for a popover hanging off the bottom-right of `anchorRef`. */
function useAnchoredPosition(open, anchorRef) {
  const [pos, setPos] = useState({ top: 0, right: 0 });
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      setPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef]);
  return pos;
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  // Live faculty record — reflects edits and photo changes made on /profile.
  const { profile: faculty, photo } = useFaculty();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const profilePopoverRef = useRef(null);
  const profileRef = useDismiss(profileOpen, () => setProfileOpen(false), profilePopoverRef);
  const notifRef = useDismiss(notifOpen, () => setNotifOpen(false));
  const profilePos = useAnchoredPosition(profileOpen, profileRef);

  const title = PAGE_TITLES[pathname] || "Dashboard";
  const unread = announcements.filter((a) => !readIds.includes(a.id));

  // Quick facts for the profile card, derived from the same data the
  // Dashboard and Profile pages use.
  const activeCourses = courses.filter((c) => c.status === "Active").length;
  const totalStudents = courses.reduce((sum, c) => sum + (Number(c.students) || 0), 0);
  const profileFacts = [
    { icon: Mail, label: "Email", value: faculty.email, href: `mailto:${faculty.email}` },
    { icon: Phone, label: "Phone", value: faculty.phone, href: faculty.phone ? `tel:${String(faculty.phone).replace(/\s+/g, "")}` : undefined },
    { icon: MapPin, label: "Location", value: faculty.location },
    { icon: Building2, label: "College", value: faculty.college },
    { icon: GraduationCap, label: "Qualification", value: faculty.qualification },
    { icon: BadgeCheck, label: "Employee ID", value: faculty.employeeId },
  ].filter((f) => f.value);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-white/85 backdrop-blur border-b border-gray-100 px-4 lg:px-8 h-16">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-gray-900 truncate leading-tight">{title}</p>
          <p className="hidden sm:block text-[11px] text-gray-400 leading-tight">
            {greeting}, {String(faculty.name || "").split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          to="/students"
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg text-sm text-gray-400 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-colors w-52"
          title="Find a student"
        >
          <Search size={15} />
          <span className="truncate">Find a student…</span>
        </Link>

        {/* notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ""}`}
            aria-expanded={notifOpen}
            className={`relative p-2 rounded-lg transition-colors ${
              notifOpen ? "bg-brand-50 text-brand-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <Bell size={19} />
            {unread.length > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold leading-4 text-center ring-2 ring-white">
                {unread.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-[min(92vw,340px)] bg-white rounded-2xl shadow-dropdown border border-gray-100 overflow-hidden origin-top-right animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                {unread.length > 0 && (
                  <button
                    onClick={() => setReadIds(announcements.map((a) => a.id))}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>
              <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {announcements.map((a) => {
                  const isRead = readIds.includes(a.id);
                  return (
                    <li key={a.id}>
                      <Link
                        to="/announcements"
                        onClick={() => {
                          setReadIds((ids) => (ids.includes(a.id) ? ids : [...ids, a.id]));
                          setNotifOpen(false);
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isRead ? "bg-gray-100 text-gray-400" : "bg-brand-100 text-brand-600"
                          }`}
                        >
                          <Megaphone size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block text-sm truncate ${isRead ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                            {a.title}
                          </span>
                          <span className="block text-xs text-gray-500 line-clamp-2">{a.desc}</span>
                          <span className="block text-[11px] text-gray-400 mt-1">{a.date}</span>
                        </span>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                to="/announcements"
                onClick={() => setNotifOpen(false)}
                className="block text-center text-sm font-medium text-brand-600 hover:bg-brand-50 px-4 py-2.5 border-t border-gray-100 transition-colors"
              >
                View all announcements
              </Link>
            </div>
          )}
        </div>

        {/* profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-haspopup="dialog"
            aria-expanded={profileOpen}
            aria-controls="faculty-profile-popover"
            title="View my profile"
            className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              profileOpen ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <Avatar key={photo} src={photo} name={faculty.name} size={32} ring />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[140px] truncate">
              {faculty.name}
            </span>
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>
          {/* Rendered in a portal on <body> so no header/page stacking context
              or overflow can hide it; positioned against the button. */}
          {profileOpen &&
            createPortal(
            <div
              id="faculty-profile-popover"
              ref={profilePopoverRef}
              role="dialog"
              aria-label="Faculty profile"
              style={{ top: profilePos.top, right: profilePos.right }}
              className="fixed z-[80] w-[min(92vw,340px)] max-h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-2xl shadow-dropdown border border-gray-100 text-sm origin-top-right animate-scale-in"
            >
              {/* identity */}
              <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-brand-50 via-white to-white border-b border-gray-100">
                <div className="flex items-start gap-3.5">
                  <Avatar key={photo} src={photo} name={faculty.name} size={56} ring className="shadow-card" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-gray-900 leading-tight truncate">{faculty.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">
                      {faculty.designation || faculty.role}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{faculty.department}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 px-2 py-0.5 rounded-full">
                        <BadgeCheck size={11} /> {faculty.role}
                      </span>
                      {faculty.experience && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200 px-2 py-0.5 rounded-full">
                          <Award size={11} /> {faculty.experience}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* quick stats */}
              <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                <Link
                  to="/courses"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                    <BookOpen size={15} />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-gray-900 leading-tight tabular-nums">{activeCourses}</span>
                    <span className="block text-[11px] text-gray-500">Active courses</span>
                  </span>
                </Link>
                <Link
                  to="/students"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users size={15} />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-gray-900 leading-tight tabular-nums">{totalStudents}</span>
                    <span className="block text-[11px] text-gray-500">Students</span>
                  </span>
                </Link>
              </div>

              {/* details */}
              <ul className="px-2 py-2 space-y-0.5">
                {profileFacts.map((f) => {
                  const Icon = f.icon;
                  const inner = (
                    <>
                      <Icon size={15} className="text-gray-400 shrink-0 mt-0.5" />
                      <span className="min-w-0">
                        <span className="block text-[11px] text-gray-400 leading-tight">{f.label}</span>
                        <span className="block text-[13px] text-gray-800 truncate">{f.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={f.label}>
                      {f.href ? (
                        <a href={f.href} className="flex items-start gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-start gap-2.5 px-3 py-1.5 rounded-lg">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* actions */}
              <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-gray-50/60">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium shadow-sm hover:bg-brand-700 active:bg-brand-800 transition-colors"
                >
                  <UserCircle size={16} /> View full profile
                </Link>
                <Link
                  to="/logout"
                  onClick={() => setProfileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-rose-600 text-sm font-medium hover:bg-rose-50 hover:border-rose-200 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} /> Logout
                </Link>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </header>
  );
}
