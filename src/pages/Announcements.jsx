// import { useState } from "react";
// import { Plus, Megaphone, MoreVertical } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, Card } from "../components/ui";
// import { announcements } from "../data/mockData";

// export default function Announcements() {
//   const [query, setQuery] = useState("");
//   const filtered = announcements.filter((a) =>
//     a.title.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div>
//       <PageHeader
//         title="Announcements"
//         subtitle="Post and manage announcements for your students"
//         action={<PrimaryButton icon={Plus}>New Announcement</PrimaryButton>}
//       />

//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <SearchInput placeholder="Search announcements..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>Anatomy and Physiology</option>
//           <option>Fundamentals of Nursing</option>
//         </Select>
//       </div>

//       <Card className="divide-y divide-gray-100">
//         {filtered.map((a) => (
//           <div key={a.id} className="flex items-start gap-4 p-5">
//             <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
//               <Megaphone size={18} />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-gray-900">{a.title}</p>
//               <p className="text-sm text-gray-500 mt-0.5">{a.desc}</p>
//               <p className="text-xs text-gray-400 mt-2">{a.date}</p>
//             </div>
//             <button className="p-1.5 text-gray-400 hover:text-gray-600">
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
  Plus,
  Megaphone,
  MoreVertical,
  X,
  Pencil,
  Pin,
  PinOff,
  Copy,
  Trash2,
  Send,
  Undo2,
  SearchX,
  AlertTriangle,
  Users,
  CalendarClock,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, Card, Notice, Tabs, EmptyState, SecondaryButton, LoadingState, ErrorState, inputClass, labelClass } from "../components/ui";
import { announcementsApi, errorMessage } from "../api";
import { useResource } from "../hooks/useResource";

const AUDIENCES = [
  "All Students",
  "B.Sc Nursing - Year I",
  "B.Sc Nursing - Year II",
  "B.Sc Nursing - Year III",
  "B.Sc Nursing - Year IV",
  "Faculty - Nursing Dept",
];

const PRIORITIES = ["Normal", "Important", "Urgent"];

const TABS = [
  { key: "all", label: "All" },
  { key: "Published", label: "Published" },
  { key: "Scheduled", label: "Scheduled" },
  { key: "Draft", label: "Drafts" },
];

const priorityStyle = {
  Normal: "bg-gray-100 text-gray-600",
  Important: "bg-amber-100 text-amber-700",
  Urgent: "bg-rose-100 text-rose-700",
};

const statusStyle = {
  Published: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Draft: "bg-indigo-100 text-indigo-700",
};

const toInputValue = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** "2 hours ago" / "in 3 days" */
function relative(d, now) {
  const mins = Math.round((d - now) / 60000);
  const abs = Math.abs(mins);
  const future = mins > 0;
  const phrase = (n, unit) => (future ? `in ${n} ${unit}` : `${n} ${unit} ago`);
  if (abs < 60) return phrase(Math.max(abs, 1), abs === 1 ? "minute" : "minutes");
  if (abs < 1440) {
    const h = Math.round(abs / 60);
    return phrase(h, h === 1 ? "hour" : "hours");
  }
  const days = Math.round(abs / 1440);
  if (days < 30) return phrase(days, days === 1 ? "day" : "days");
  return fmtDate(d);
}

/* ---------------- compose modal ---------------- */

function AnnouncementModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => ({
    title: "",
    body: "",
    audience: AUDIENCES[0],
    priority: "Normal",
    status: "Published",
    pinned: false,
    postedAt: new Date(),
    ...initial,
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  function submit(status) {
    const next = {};
    if (!form.title.trim()) next.title = "Give the announcement a title.";
    if (!form.body.trim()) next.body = "Write the message students will read.";
    if (status === "Scheduled" && new Date(form.postedAt) <= new Date())
      next.postedAt = "Pick a future date and time to schedule.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave({
      ...form,
      status,
      title: form.title.trim(),
      body: form.body.trim(),
      postedAt: status === "Scheduled" ? new Date(form.postedAt) : new Date(),
    });
    onClose();
  }

  const field = inputClass;
  const label = labelClass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {isEdit ? "Edit announcement" : "New announcement"}
          </h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={label}>Title</label>
            <input autoFocus className={field} value={form.title} onChange={set("title")} placeholder="Practical Exam Schedule - June" />
            {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className={label}>Message</label>
            <textarea
              rows={4}
              className={field}
              value={form.body}
              onChange={set("body")}
              placeholder="What do students need to know?"
            />
            {errors.body && <p className="text-xs text-rose-600 mt-1.5">{errors.body}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Audience</label>
              <select className={field} value={form.audience} onChange={set("audience")}>
                {AUDIENCES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Priority</label>
              <select className={field} value={form.priority} onChange={set("priority")}>
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={label}>Publish at (for scheduling)</label>
            <input
              type="datetime-local"
              className={field}
              value={toInputValue(new Date(form.postedAt))}
              onChange={(e) => setForm((f) => ({ ...f, postedAt: new Date(e.target.value) }))}
            />
            {errors.postedAt && <p className="text-xs text-rose-600 mt-1.5">{errors.postedAt}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
              className="rounded border-gray-300"
            />
            Pin to the top of the list
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => submit("Draft")}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Save as draft
          </button>
          <button
            onClick={() => submit("Scheduled")}
            className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50"
          >
            Schedule
          </button>
          <button
            onClick={() => submit("Published")}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors text-white text-sm font-medium"
          >
            Publish now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- row menu ---------------- */

function RowMenu({ item, onEdit, onTogglePin, onToggleStatus, onDuplicate, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const published = item.status === "Published";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Pencil size={14} /> Edit
          </button>
          <button onClick={() => { setOpen(false); onTogglePin(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            {item.pinned ? <PinOff size={14} /> : <Pin size={14} />}
            {item.pinned ? "Unpin" : "Pin to top"}
          </button>
          <button onClick={() => { setOpen(false); onToggleStatus(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            {published ? <Undo2 size={14} /> : <Send size={14} />}
            {published ? "Move to draft" : "Publish now"}
          </button>
          <button onClick={() => { setOpen(false); onDuplicate(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Copy size={14} /> Duplicate
          </button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Announcements() {
  // Announcements come from GET /api/announcements (postedAt is a Date).
  const {
    data: items,
    setData: setItems,
    loading,
    error,
    reload,
  } = useResource((signal) => announcementsApi.list(undefined, { signal }), []);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState("all");
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const audienceOptions = useMemo(() => [...new Set(items.map((a) => a.audience))].sort(), [items]);

  const countFor = (key) =>
    key === "all" ? items.length : items.filter((a) => a.status === key).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((a) => {
        const matchesQuery =
          !q || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q);
        return (
          matchesQuery &&
          (tab === "all" || a.status === tab) &&
          (audience === "all" || a.audience === audience)
        );
      })
      // Pinned first, newest next.
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.postedAt - a.postedAt);
  }, [items, tab, query, audience]);

  const payload = (data) => ({
    title: data.title,
    body: data.body,
    audience: data.audience,
    priority: data.priority,
    status: data.status,
    pinned: Boolean(data.pinned),
    postedAt: new Date(data.postedAt).toISOString(),
  });

  const applySaved = (saved) =>
    setItems((list) => (list.some((a) => a.id === saved.id)
      ? list.map((a) => (a.id === saved.id ? saved : a))
      : [saved, ...list]));

  async function handleSave(data) {
    const saved = data.id
      ? await announcementsApi.update(data.id, payload(data))
      : await announcementsApi.create(payload(data));
    applySaved(saved);
    setNotice(
      data.id
        ? `"${saved.title}" updated.`
        : saved.status === "Published"
        ? `Published to ${saved.audience}.`
        : saved.status === "Scheduled"
        ? `Scheduled for ${fmtDate(saved.postedAt)}.`
        : "Saved as draft."
    );
  }

  /** Optimistic patch, rolled back if the API rejects it. */
  async function update(id, patch) {
    const before = items.find((a) => a.id === id);
    setItems((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    try {
      applySaved(await announcementsApi.update(id, patch));
    } catch (err) {
      if (before) setItems((list) => list.map((a) => (a.id === id ? before : a)));
      setNotice(errorMessage(err, "Couldn't update that announcement."));
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await announcementsApi.remove(item.id);
      setItems((list) => list.filter((a) => a.id !== item.id));
      setNotice(`"${item.title}" deleted.`);
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't delete that announcement."));
    }
  }

  const toggleExpand = (id) =>
    setExpanded((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Post and manage announcements for your students"
        action={
          <PrimaryButton icon={Plus} onClick={() => setEditing({})}>
            New Announcement
          </PrimaryButton>
        }
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} count={countFor} className="mb-5" />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput
          placeholder="Search announcements..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option value="all">All Audiences</option>
          {audienceOptions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="divide-y divide-gray-100">
        {loading && <LoadingState rows={4} label="Loading announcements…" />}
        {!loading && error && <ErrorState description={error} onRetry={reload} />}
        {!loading && !error && visible.map((a) => {
          const isOpen = expanded.includes(a.id);
          const long = a.body.length > 120;
          return (
            <div key={a.id} className={`flex items-start gap-4 p-5 transition-colors hover:bg-gray-50/70 ${a.pinned ? "bg-brand-50/40 border-l-2 border-l-brand-400" : ""}`}>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.priority === "Urgent"
                    ? "bg-rose-100 text-rose-600"
                    : a.priority === "Important"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-brand-100 text-brand-600"
                }`}
              >
                {a.priority === "Urgent" ? <AlertTriangle size={18} /> : <Megaphone size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                  {a.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                      <Pin size={10} /> Pinned
                    </span>
                  )}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                  {a.priority !== "Normal" && (
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${priorityStyle[a.priority]}`}>
                      {a.priority}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {isOpen || !long ? a.body : `${a.body.slice(0, 120)}…`}
                  {long && (
                    <button
                      onClick={() => toggleExpand(a.id)}
                      className="ml-1.5 text-brand-600 font-medium hover:text-brand-700 hover:underline"
                    >
                      {isOpen ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {a.audience}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock size={12} />
                    {a.status === "Scheduled" ? "Goes out " : ""}
                    {relative(a.postedAt, now)} · {fmtDate(a.postedAt)}
                  </span>
                </div>
              </div>

              <RowMenu
                item={a}
                onEdit={() => setEditing(a)}
                onTogglePin={() => {
                  update(a.id, { pinned: !a.pinned });
                  setNotice(a.pinned ? "Unpinned." : "Pinned to top.");
                }}
                onToggleStatus={() => {
                  const next = a.status === "Published" ? "Draft" : "Published";
                  update(a.id, { status: next, postedAt: next === "Published" ? new Date() : a.postedAt });
                  setNotice(next === "Published" ? "Published." : "Moved to draft.");
                }}
                onDuplicate={() => {
                  setItems((list) => [
                    { ...a, id: nextId(), title: `${a.title} (Copy)`, status: "Draft", pinned: false },
                    ...list,
                  ]);
                  setNotice("Duplicated as a draft.");
                }}
                onDelete={() => handleDelete(a)}
              />
            </div>
          );
        })}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={items.length === 0 ? <Megaphone size={24} /> : <SearchX size={24} />}
            title={items.length === 0 ? "No announcements yet" : "Nothing matches your filters"}
            description={
              items.length === 0
                ? "Post an update and your students will see it here."
                : "Try a different tab, audience or search term."
            }
            action={
              items.length === 0
                ? (<PrimaryButton icon={Plus} onClick={() => setEditing({})}>New Announcement</PrimaryButton>)
                : (<SecondaryButton onClick={() => { setQuery(""); setAudience("all"); setTab("all"); }}>Clear filters</SecondaryButton>)
            }
          />
        )}
      </Card>

      {editing && (
        <AnnouncementModal
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}