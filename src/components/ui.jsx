export function StatCard({ icon: Icon, label, value, sub, tint }) {
  const tints = {
    purple: "bg-brand-100 text-brand-700",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-rose-100 text-rose-600",
  };
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4 flex-1 min-w-[160px]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tints[tint] || tints.purple}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action, breadcrumb }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-brand-600 font-medium mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({ status }) {
  const map = {
    Active: "bg-emerald-100 text-emerald-700",
    Published: "bg-emerald-100 text-emerald-700",
    Present: "bg-emerald-100 text-emerald-700",
    Draft: "bg-indigo-100 text-indigo-700",
    Scheduled: "bg-amber-100 text-amber-700",
    Late: "bg-amber-100 text-amber-700",
    "Pending Review": "bg-amber-100 text-amber-700",
    Absent: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function PrimaryButton({ children, icon: Icon, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm transition-colors"
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function OutlineButton({ children, icon: Icon, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center gap-2 border border-brand-200 text-brand-700 hover:bg-brand-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="relative flex-1">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
      />
    </div>
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
    >
      {children}
    </select>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-card ${className}`}>
      {children}
    </div>
  );
}
