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
} from "lucide-react";
import { faculty } from "../data/mockData";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/live-classes", label: "Live Classes", icon: Video },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/study-materials", label: "Study Materials", icon: FolderOpen },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[272px] shrink-0 bg-sidebar text-white z-40 flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center gap-2 px-6 pt-6 pb-4">
          <div className="w-9 h-9 rounded-lg bg-brand-500/40 flex items-center justify-center">
            <GraduationCap size={20} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">G Care Council</p>
            <p className="text-[11px] text-white/60">LMS Portal</p>
          </div>
        </div>

        <div className="flex flex-col items-center px-6 pb-6 border-b border-white/10">
          <img
            src="https://i.pravatar.cc/120?img=47"
            alt={faculty.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-white/10"
          />
          <p className="mt-3 font-semibold text-[15px]">{faculty.name}</p>
          <p className="text-xs text-white/60">{faculty.role}</p>
          <p className="text-xs text-white/60">{faculty.department}</p>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <NavLink
            to="/logout"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Power size={18} />
            Logout
          </NavLink>
        </div>
      </aside>
    </>
  );
}
