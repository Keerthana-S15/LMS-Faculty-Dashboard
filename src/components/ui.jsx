import { useEffect, useState } from "react";
import { Search, X, CheckCircle2, AlertTriangle, Info, RefreshCw, ChevronRight, ChevronDown, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------
   Shared class strings. Pages reuse these for native inputs/labels so
   every form in the app looks and focuses the same way.
-------------------------------------------------------------------*/
export const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-[box-shadow,border-color] hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed";

export const labelClass = "block text-[13px] font-medium text-gray-700 mb-1.5";

export const errorTextClass = "text-xs text-rose-600 mt-1.5";

export const tableHeadRowClass =
  "text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/80 border-b border-gray-100";

export const tableHeadCellClass = "font-semibold py-3 px-5 whitespace-nowrap";

export const tableRowClass = "transition-colors hover:bg-brand-50/40";

export const menuClass =
  "absolute right-0 mt-1.5 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in";

export const menuItemClass =
  "w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors";

export const menuItemDangerClass =
  "w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 transition-colors";

/* ---------------- stat card ---------------- */

/* Each tint reuses the same palette as before: `icon` is the original tile
   colour; `glow`/`bar` are the same hue used only for hover accents. */
const tints = {
  purple: { icon: "bg-brand-100 text-brand-700", glow: "bg-brand-200", bar: "bg-brand-500", text: "text-brand-700" },
  green: { icon: "bg-emerald-100 text-emerald-600", glow: "bg-emerald-200", bar: "bg-emerald-500", text: "text-emerald-600" },
  orange: { icon: "bg-amber-100 text-amber-600", glow: "bg-amber-200", bar: "bg-amber-500", text: "text-amber-600" },
  blue: { icon: "bg-blue-100 text-blue-600", glow: "bg-blue-200", bar: "bg-blue-500", text: "text-blue-600" },
  red: { icon: "bg-rose-100 text-rose-600", glow: "bg-rose-200", bar: "bg-rose-500", text: "text-rose-600" },
};

/**
 * Stat tile. Hover lifts the card, sweeps a soft sheen across it, warms the
 * corner with the tint colour, animates the icon and draws an accent bar.
 * `interactive` (inside a StatButton/Link with `group`) adds the "open"
 * arrow and a press-down state; `active` keeps the highlighted look.
 */
export function StatCard({ icon: Icon, label, value, sub, tint, active = false, interactive = false }) {
  const t = tints[tint] || tints.purple;
  return (
    <div
      className={`group/stat relative isolate overflow-hidden h-full bg-white rounded-2xl border p-5 flex items-center gap-4 flex-1 min-w-[160px] transition-all duration-300 ease-out will-change-transform
        hover:-translate-y-1 hover:shadow-card-hover hover:border-brand-200
        ${active ? "border-brand-300 ring-2 ring-brand-200 shadow-card-hover" : "border-gray-100 shadow-card"}
        ${interactive ? "cursor-pointer group-active:translate-y-0 group-active:scale-[0.985] group-active:shadow-card group-focus-visible:border-brand-300" : ""}`}
    >
      {/* soft colour bloom in the corner */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover/stat:opacity-60 ${
          active ? "opacity-40" : ""
        } ${t.glow}`}
      />
      {/* faint watermark of the icon */}
      <Icon
        aria-hidden="true"
        size={84}
        strokeWidth={1.5}
        className={`pointer-events-none absolute -bottom-5 -right-4 opacity-[0.045] transition-all duration-500 ease-out group-hover/stat:opacity-[0.09] group-hover/stat:-rotate-6 group-hover/stat:scale-110 ${t.text}`}
      />
      {/* light sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/stat:left-full group-hover/stat:opacity-100"
      />

      <div
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-inset ring-white/60 shadow-sm transition-all duration-300 ease-out group-hover/stat:scale-110 group-hover/stat:-rotate-6 group-hover/stat:shadow-md ${t.icon}`}
      >
        <Icon
          size={22}
          className="transition-transform duration-300 ease-out group-hover/stat:rotate-6 group-hover/stat:scale-105"
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="text-[13px] font-medium text-gray-500 leading-snug transition-colors duration-300 group-hover/stat:text-gray-700">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight tabular-nums transition-transform duration-300 ease-out group-hover/stat:translate-x-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 mt-0.5 transition-colors duration-300 group-hover/stat:text-gray-500">
            {sub}
          </p>
        )}
      </div>

      {interactive && (
        <span
          aria-hidden="true"
          className={`absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out ${
            active
              ? "opacity-100 translate-x-0 translate-y-0"
              : "opacity-0 translate-y-1 -translate-x-1 group-hover/stat:opacity-100 group-hover/stat:translate-x-0 group-hover/stat:translate-y-0"
          } ${t.text}`}
        >
          <ArrowUpRight size={14} strokeWidth={2.25} />
        </span>
      )}

      {/* accent bar grows in from the left */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-[3px] rounded-r-full transition-all duration-500 ease-out ${
          active ? "w-full" : "w-0 group-hover/stat:w-full"
        } ${t.bar}`}
      />
    </div>
  );
}

/** Wraps a StatCard so the whole tile is a filter/button with hover + active states. */
export function StatButton({ onClick, active, children, className = "", ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex-1 min-w-[160px] text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- page header ---------------- */

export function PageHeader({ title, subtitle, action, breadcrumb }) {
  const crumbs =
    typeof breadcrumb === "string"
      ? breadcrumb.split(">").map((c) => c.trim()).filter(Boolean)
      : Array.isArray(breadcrumb)
      ? breadcrumb
      : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
            {crumbs.map((c, i) => (
              <span key={`${c}-${i}`} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
                <span className={i === crumbs.length - 1 ? "text-brand-600 font-medium" : ""}>{c}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}

/** Title + optional link/action row used at the top of cards. */
export function SectionHeader({ title, action, className = "" }) {
  return (
    <div className={`flex items-center justify-between gap-3 mb-4 ${className}`}>
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
  );
}

/* ---------------- badge ---------------- */

const badgeMap = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Present: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Reviewed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Sent: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Draft: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  Scheduled: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Late: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Pending Review": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Important: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Absent: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Inactive: "bg-rose-50 text-rose-700 ring-rose-600/20",
  Urgent: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const badgeDot = {
  Active: "bg-emerald-500",
  Published: "bg-emerald-500",
  Present: "bg-emerald-500",
  Reviewed: "bg-emerald-500",
  Sent: "bg-emerald-500",
  Draft: "bg-indigo-400",
  Scheduled: "bg-amber-500",
  Late: "bg-amber-500",
  "Pending Review": "bg-amber-500",
  Important: "bg-amber-500",
  Absent: "bg-rose-500",
  Inactive: "bg-rose-500",
  Urgent: "bg-rose-500",
};

export function Badge({ status, dot = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
        badgeMap[status] || "bg-gray-50 text-gray-600 ring-gray-500/20"
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${badgeDot[status] || "bg-gray-400"}`} />}
      {status}
    </span>
  );
}

/* ---------------- buttons ---------------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-xl transition-all duration-150 whitespace-nowrap select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const btnSize = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-4 py-2.5",
  lg: "px-5 py-3",
};

export function PrimaryButton({ children, icon: Icon, size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`${btnBase} ${btnSize[size]} bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md active:bg-brand-800 active:translate-y-px ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function OutlineButton({ children, icon: Icon, size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`${btnBase} ${btnSize[size]} border border-brand-200 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-300 active:bg-brand-100 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, icon: Icon, size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`${btnBase} ${btnSize[size]} border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function GhostButton({ children, icon: Icon, size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`${btnBase} ${btnSize[size]} text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function DangerButton({ children, icon: Icon, size = "md", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      {...props}
      className={`${btnBase} ${btnSize[size]} bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

/** Square icon-only button for row actions and toolbars. */
export function IconButton({ icon: Icon, label, tone = "default", size = 16, className = "", type = "button", ...props }) {
  const tones = {
    default: "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
    brand: "text-gray-400 hover:text-brand-600 hover:bg-brand-50",
    danger: "text-gray-400 hover:text-rose-600 hover:bg-rose-50",
  };
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      {...props}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]} ${className}`}
    >
      <Icon size={size} />
    </button>
  );
}

/* ---------------- inputs ---------------- */

export function SearchInput({ placeholder, value, onChange, className = "" }) {
  return (
    <div className={`relative flex-1 min-w-0 ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${inputClass} pl-10 ${value ? "pr-9" : "pr-4"} [&::-webkit-search-cancel-button]:hidden`}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange?.({ target: { value: "" } })}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}

export function Select({ children, className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className={`${inputClass} appearance-none pr-9 text-gray-700 cursor-pointer w-full`}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return <input {...props} className={`${inputClass} ${className}`} />;
}

export function Textarea({ className = "", rows = 3, ...props }) {
  return <textarea rows={rows} {...props} className={`${inputClass} resize-y ${className}`} />;
}

export function Label({ children, className = "", ...props }) {
  return (
    <label {...props} className={`${labelClass} ${className}`}>
      {children}
    </label>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className={errorTextClass}>{children}</p>;
}

/* ---------------- card ---------------- */

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      {...props}
      className={`bg-white rounded-2xl border border-gray-100 shadow-card ${
        hover ? "transition-all duration-200 hover:shadow-card-hover hover:border-brand-200 hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- tabs ---------------- */

/**
 * Underline tabs. `tabs` can be strings or `{ key, label }`. Pass `count`
 * (a function of the key) to show a pill with a number next to each label.
 */
export function Tabs({ tabs, value, onChange, count, className = "" }) {
  return (
    <div
      role="tablist"
      className={`flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-none ${className}`}
    >
      {tabs.map((t) => {
        const key = typeof t === "string" ? t : t.key;
        const label = typeof t === "string" ? t : t.label;
        const active = value === key;
        const n = count ? count(key) : null;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-2 px-3 pb-3 pt-1 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              active ? "text-brand-700" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {label}
            {n !== null && n !== undefined && (
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums ${
                  active ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {n}
              </span>
            )}
            <span
              className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors ${
                active ? "bg-brand-600" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Pill-style segmented control (e.g. "By Date | By Session"). */
export function SegmentedControl({ options, value, onChange, className = "" }) {
  return (
    <div className={`inline-flex bg-gray-100 rounded-xl p-1 text-sm ${className}`} role="group">
      {options.map((o) => {
        const key = typeof o === "string" ? o : o.key;
        const label = typeof o === "string" ? o : o.label;
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              active ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- states: empty / loading / error ---------------- */

export function EmptyState({ icon, title, description, action, compact = false, className = "" }) {
  return (
    <div className={`${compact ? "py-8 px-4" : "py-14 px-6"} text-center animate-fade-in ${className}`}>
      {icon && (
        <div
          className={`${
            compact ? "w-11 h-11 rounded-xl" : "w-14 h-14 rounded-2xl"
          } bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-3 ring-1 ring-brand-100`}
        >
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto text-balance">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-gray-100 rounded-lg ${className} before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent before:animate-shimmer`}
    />
  );
}

/** Generic loading placeholder; `rows` renders a table-like skeleton. */
export function LoadingState({ rows = 4, label = "Loading…" }) {
  return (
    <div className="p-5 space-y-3" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}) {
  return (
    <div className={`py-14 px-6 text-center animate-fade-in ${className}`} role="alert">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 ring-1 ring-rose-100">
        <AlertTriangle size={24} />
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>}
      {onRetry && (
        <div className="mt-5 flex justify-center">
          <SecondaryButton icon={RefreshCw} onClick={onRetry}>
            {retryLabel}
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}

/* ---------------- notice (toast) ---------------- */

const noticeTones = {
  info: { icon: Info, ring: "border-brand-200", iconClass: "text-brand-600 bg-brand-50" },
  success: { icon: CheckCircle2, ring: "border-emerald-200", iconClass: "text-emerald-600 bg-emerald-50" },
  warning: { icon: AlertTriangle, ring: "border-amber-200", iconClass: "text-amber-600 bg-amber-50" },
  error: { icon: AlertTriangle, ring: "border-rose-200", iconClass: "text-rose-600 bg-rose-50" },
};

/**
 * Toast-style feedback. Pages keep their own `notice` state and timeout;
 * this only renders it. Tone is inferred from the message when not given.
 */
export function Notice({ message, tone, onClose }) {
  if (!message) return null;
  const inferred =
    tone ||
    (/deleted|cancel|discard|removed|no |can't|cannot|couldn't|invalid|before|pick/i.test(message)
      ? "warning"
      : /saved|updated|created|sent|published|copied|download|uploaded|marked|pinned|duplicated|shared|scheduled|reset/i.test(
          message
        )
      ? "success"
      : "info");
  const t = noticeTones[inferred] || noticeTones.info;
  const Icon = t.icon;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[70] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto sm:max-w-sm animate-fade-up"
    >
      <div
        className={`flex items-start gap-3 bg-white border ${t.ring} rounded-xl shadow-dropdown px-4 py-3`}
      >
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.iconClass}`}>
          <Icon size={16} />
        </span>
        <p className="text-sm text-gray-800 flex-1 pt-1.5 leading-snug">{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="p-1 -mr-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Inline (non-floating) alert for persistent hints and warnings. */
export function InlineAlert({ children, tone = "info", icon: CustomIcon, className = "" }) {
  const styles = {
    info: "bg-brand-50 border-brand-100 text-brand-800",
    success: "bg-emerald-50 border-emerald-100 text-emerald-800",
    warning: "bg-amber-50 border-amber-100 text-amber-800",
    error: "bg-rose-50 border-rose-100 text-rose-800",
  };
  const Icon = CustomIcon || noticeTones[tone]?.icon || Info;
  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${styles[tone]} ${className}`}>
      <Icon size={17} className="shrink-0 mt-0.5 opacity-80" />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/* ---------------- modal ---------------- */

/**
 * Accessible modal shell: backdrop click + Escape close, body scroll lock.
 * Header/footer are optional slots; body scrolls independently.
 */
export function Modal({ open = true, onClose, title, subtitle, children, footer, size = "lg", className = "" }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={`bg-white rounded-2xl w-full ${sizes[size] || sizes.lg} max-h-[90vh] flex flex-col shadow-modal ring-1 ring-black/5 animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div className="min-w-0">
              {title && <h2 className="font-semibold text-gray-900">{title}</h2>}
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {onClose && <IconButton icon={X} label="Close" onClick={onClose} size={18} className="-mr-2 -mt-1" />}
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- misc ---------------- */

export function ProgressBar({ value = 0, tone = "brand", size = "sm", className = "" }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const fills = {
    brand: "bg-brand-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-rose-500",
  };
  return (
    <div
      className={`${size === "md" ? "h-2" : "h-1.5"} w-full bg-gray-100 rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-all duration-500 ${fills[tone] || fills.brand}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** Image avatar that falls back to initials when the picture fails to load. */
export function Avatar({ src, name = "", size = 40, className = "", ring = false }) {
  const [failed, setFailed] = useState(false);
  const px = { width: size, height: size };
  const text = size >= 56 ? "text-lg" : size >= 40 ? "text-sm" : "text-xs";
  const ringClass = ring ? "ring-2 ring-white shadow-sm" : "";

  if (!src || failed) {
    return (
      <span
        style={px}
        aria-label={name}
        className={`inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold ${text} ${ringClass} ${className}`}
      >
        {initialsOf(name) || "?"}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      style={px}
      onError={() => setFailed(true)}
      className={`rounded-full object-cover shrink-0 bg-gray-100 ${ringClass} ${className}`}
    />
  );
}

export function Divider({ className = "" }) {
  return <hr className={`border-0 border-t border-gray-100 ${className}`} />;
}
