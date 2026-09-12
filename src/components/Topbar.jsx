import { useState } from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { faculty } from "../data/mockData";

export default function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-gray-100 px-4 lg:px-6 h-16">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 text-brand-900 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell size={19} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <img
              src="https://i.pravatar.cc/80?img=47"
              alt={faculty.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {faculty.name}
            </span>
            <ChevronDown size={15} className="text-gray-400" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm">
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
                My Profile
              </a>
              <a href="/logout" className="block px-4 py-2 hover:bg-gray-50 text-red-500">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
