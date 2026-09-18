import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, ChevronDown, UserCircle, LogOut, Megaphone, CheckCheck, Search } from "lucide-react";
import { faculty, announcements } from "../data/mockData";
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

/** Closes the dropdown on outside click or Escape. */
function useDismiss(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && onClose();
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);
  return ref;
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const profileRef = useDismiss(profileOpen, () => setProfileOpen(false));
  const notifRef = useDismiss(notifOpen, () => setNotifOpen(false));

  // Menus shouldn't linger after navigating.
  useEffect(() => {
    setProfileOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const title = PAGE_TITLES[pathname] || "Dashboard";
  const unread = announcements.filter((a) => !readIds.includes(a.id));

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
            {greeting}, {faculty.name.split(" ").slice(0, 2).join(" ")}
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
                        onClick={() => setReadIds((ids) => (ids.includes(a.id) ? ids : [...ids, a.id]))}
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
            onClick={() => setProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors ${
              profileOpen ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <Avatar src="https://i.pravatar.cc/80?img=47" name={faculty.name} size={32} />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[140px] truncate">
              {faculty.name}
            </span>
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>
          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-gray-100 py-1.5 text-sm origin-top-right animate-scale-in"
            >
              <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{faculty.name}</p>
                <p className="text-xs text-gray-500 truncate">{faculty.email}</p>
              </div>
              <Link
                to="/profile"
                role="menuitem"
                className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserCircle size={16} className="text-gray-400" /> My Profile
              </Link>
              <Link
                to="/logout"
                role="menuitem"
                className="flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={16} /> Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
