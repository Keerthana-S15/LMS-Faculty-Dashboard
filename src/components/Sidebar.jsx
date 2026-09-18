import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ClipboardList,
  HelpCircle,
  Users,
  CalendarCheck,
  FolderOpen,
  Megaphone,
  MessageSquare,
  UserCircle,
  Power,
  GraduationCap,
  X,
  ChevronRight,
} from "lucide-react";
import { useFaculty } from "../context/useFaculty";
import { Avatar } from "./ui";

/* Nav is grouped so the long list scans faster; routes are unchanged. */
const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Teaching",
    items: [
      { to: "/courses", label: "My Courses", icon: BookOpen },
      { to: "/live-classes", label: "Live Classes", icon: Video },
      { to: "/assignments", label: "Assignments", icon: ClipboardList },
      { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
      { to: "/study-materials", label: "Study Materials", icon: FolderOpen },
    ],
  },
  {
    label: "Students",
    items: [
      { to: "/students", label: "Students", icon: Users },
      { to: "/attendance", label: "Attendance", icon: CalendarCheck },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/announcements", label: "Announcements", icon: Megaphone },
      { to: "/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/profile", label: "Profile", icon: UserCircle }],
  },
];

const linkClass = ({ isActive }) =>
  `group relative flex items-center gap-3 pl-3.5 pr-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
    isActive
      ? "bg-white/[0.14] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      : "text-white/65 hover:bg-white/[0.08] hover:text-white"
  }`;

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={linkClass}>
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-brand-300 transition-all duration-200 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}
          />
          <Icon
            size={18}
            className={`shrink-0 transition-colors ${
              isActive ? "text-brand-200" : "text-white/55 group-hover:text-white"
            }`}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { profile: faculty, photo } = useFaculty();
  // Close the drawer with Escape and keep the page from scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-[2px] z-30 lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        aria-label="Main navigation"
        className={`fixed lg:sticky top-0 left-0 h-screen w-[272px] shrink-0 bg-sidebar text-white z-40 flex flex-col transition-transform duration-300 ease-out shadow-2xl lg:shadow-none
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* brand */}
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/40 ring-1 ring-white/10">
              <GraduationCap size={21} />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-tight">G Care Council</p>
              <p className="text-[11px] text-white/55 font-medium uppercase tracking-wider">LMS Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* profile card — links to /profile, like the nav item below */}
        <NavLink
          to="/profile"
          onClick={onClose}
          title="View my profile"
          className={({ isActive }) =>
            `group mx-4 mb-3 rounded-2xl ring-1 p-3.5 flex items-center gap-3 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              isActive
                ? "bg-white/[0.14] ring-white/20"
                : "bg-white/[0.06] ring-white/10 hover:bg-white/[0.1] hover:ring-white/20"
            }`
          }
        >
          <Avatar key={photo} src={photo} name={faculty.name} size={44} ring />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{faculty.name}</p>
            <p className="text-[11px] text-white/60 truncate">{faculty.role}</p>
            <p className="text-[11px] text-white/45 truncate">{faculty.department}</p>
          </div>
          <ChevronRight
            size={16}
            className="shrink-0 text-white/30 transition-all group-hover:text-white/70 group-hover:translate-x-0.5"
          />
        </NavLink>

        {/* navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-dark px-3 pb-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3.5 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/35">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.to} {...item} onClick={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* footer */}
        <div className="px-3 py-3 border-t border-white/10">
          <NavLink
            to="/logout"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                isActive
                  ? "bg-rose-500/20 text-white font-semibold"
                  : "text-white/65 hover:bg-rose-500/15 hover:text-white"
              }`
            }
          >
            <Power size={18} className="text-rose-300" />
            Logout
          </NavLink>
        </div>
      </aside>
    </>
  );
}
