// import { useState } from "react";
// import { Upload, Eye, Download, MoreVertical, Folder, FileText, PlayCircle, Headphones, Link2 } from "lucide-react";
// import { PageHeader, PrimaryButton, SearchInput, Select, StatCard, Card } from "../components/ui";
// import { materials } from "../data/mockData";

// const typeIcon = {
//   Document: { icon: FileText, tint: "text-red-500 bg-red-50" },
//   Video: { icon: PlayCircle, tint: "text-emerald-500 bg-emerald-50" },
//   Audio: { icon: Headphones, tint: "text-amber-500 bg-amber-50" },
//   Link: { icon: Link2, tint: "text-blue-500 bg-blue-50" },
// };

// const typeBadge = {
//   Document: "bg-indigo-100 text-indigo-700",
//   Video: "bg-emerald-100 text-emerald-700",
//   Audio: "bg-amber-100 text-amber-700",
//   Link: "bg-rose-100 text-rose-700",
// };

// export default function StudyMaterials() {
//   const [query, setQuery] = useState("");
//   const filtered = materials.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

//   const counts = {
//     total: materials.length,
//     documents: materials.filter((m) => m.type === "Document").length,
//     videos: materials.filter((m) => m.type === "Video").length,
//     audios: materials.filter((m) => m.type === "Audio").length,
//     links: materials.filter((m) => m.type === "Link").length,
//   };

//   return (
//     <div>
//       <PageHeader
//         breadcrumb="Dashboard > Study Materials"
//         title="Study Materials"
//         subtitle="Upload and manage study materials for students"
//         action={<PrimaryButton icon={Upload}>Upload Material</PrimaryButton>}
//       />

//       <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
//         <StatCard icon={Folder} label="Total Materials" value={counts.total} tint="purple" />
//         <StatCard icon={FileText} label="Documents" value={counts.documents} tint="blue" />
//         <StatCard icon={PlayCircle} label="Videos" value={counts.videos} tint="green" />
//         <StatCard icon={Headphones} label="Audios" value={counts.audios} tint="orange" />
//         <StatCard icon={Link2} label="Links" value={counts.links} tint="red" />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-3 mb-5">
//         <SearchInput placeholder="Search materials..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         <Select defaultValue="All Courses">
//           <option>All Courses</option>
//           <option>Anatomy and Physiology</option>
//           <option>Fundamentals of Nursing</option>
//         </Select>
//         <Select defaultValue="All Topics">
//           <option>All Topics</option>
//         </Select>
//         <Select defaultValue="All Types">
//           <option>All Types</option>
//           <option>Document</option>
//           <option>Video</option>
//           <option>Audio</option>
//           <option>Link</option>
//         </Select>
//       </div>

//       <Card className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className={tableHeadRowClass}>
//               <th className={tableHeadCellClass}>Title</th>
//               <th className={tableHeadCellClass}>Course</th>
//               <th className={tableHeadCellClass}>Topic</th>
//               <th className={tableHeadCellClass}>Type</th>
//               <th className={tableHeadCellClass}>Uploaded On</th>
//               <th className={tableHeadCellClass}>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filtered.map((m) => {
//               const { icon: Icon, tint } = typeIcon[m.type];
//               return (
//                 <tr key={m.id} className={tableRowClass}>
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
//                         <Icon size={16} />
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">{m.title}</p>
//                         <p className="text-xs text-gray-400">{m.size !== "-" ? m.size : m.ext}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3.5 px-5 text-gray-600">
//                     <p>{m.course}</p>
//                     <p className="text-xs text-gray-400">{m.meta}</p>
//                   </td>
//                   <td className="py-3.5 px-5 text-gray-600">{m.topic}</td>
//                   <td className="py-3.5 px-5">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge[m.type]}`}>
//                       {m.type}
//                     </span>
//                   </td>
//                   <td className="py-3.5 px-5 text-gray-500 whitespace-nowrap">{m.uploaded}</td>
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-1 text-gray-400">
//                       <button className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Eye size={16} /></button>
//                       <button className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Download size={15} /></button>
//                       <button className="p-1.5 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors"><MoreVertical size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </Card>
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Eye,
  Download,
  MoreVertical,
  Folder,
  FileText,
  PlayCircle,
  Headphones,
  Link2,
  X,
  Pencil,
  Trash2,
  Copy,
  ArrowUpDown,
  SearchX,
  UploadCloud,
  ExternalLink,
} from "lucide-react";
import { PageHeader, PrimaryButton, SearchInput, Select, StatCard, Card, Notice, EmptyState, SecondaryButton, LoadingState, ErrorState, inputClass, labelClass, tableHeadRowClass, tableHeadCellClass, tableRowClass, StatButton } from "../components/ui";
import { materialsApi, errorMessage } from "../api";
import { useResource } from "../hooks/useResource";

const COURSES = [
  "Anatomy and Physiology",
  "Fundamentals of Nursing",
  "Pharmacology",
  "Community Health Nursing",
  "Medical-Surgical Nursing",
  "Child Health Nursing",
  "Mental Health Nursing",
];

const TYPES = ["Document", "Video", "Audio", "Link"];

const typeIcon = {
  Document: { icon: FileText, tint: "text-red-500 bg-red-50" },
  Video: { icon: PlayCircle, tint: "text-emerald-500 bg-emerald-50" },
  Audio: { icon: Headphones, tint: "text-amber-500 bg-amber-50" },
  Link: { icon: Link2, tint: "text-blue-500 bg-blue-50" },
};

const typeBadge = {
  Document: "bg-indigo-100 text-indigo-700",
  Video: "bg-emerald-100 text-emerald-700",
  Audio: "bg-amber-100 text-amber-700",
  Link: "bg-rose-100 text-rose-700",
};

/* ---------------- helpers ---------------- */

const formatSize = (bytes) => {
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Work out Document / Video / Audio from the file's MIME type. */
const typeFromFile = (file) => {
  if (file.type.startsWith("video/")) return "Video";
  if (file.type.startsWith("audio/")) return "Audio";
  return "Document";
};

const extFromName = (name) => (name.split(".").pop() || "FILE").toUpperCase().slice(0, 4);

const fmtStamp = (d) =>
  `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ${d
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toUpperCase()}`;

/* Seeded rows carry display strings; normalise them into real values. */
/* ---------------- upload modal ---------------- */

function UploadModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState(() => ({
    title: "",
    course: COURSES[0],
    meta: "",
    topic: "",
    type: "Document",
    url: "",
    file: null,
    sizeLabel: "-",
    ext: "PDF",
    ...initial,
  }));
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  function takeFile(file) {
    if (!file) return;
    setForm((f) => ({
      ...f,
      file,
      title: f.title || file.name.replace(/\.[^.]+$/, ""),
      type: typeFromFile(file),
      ext: extFromName(file.name),
      sizeLabel: formatSize(file.size),
      url: URL.createObjectURL(file),
    }));
    setErrors((err) => ({ ...err, file: "" }));
  }

  function handleSubmit() {
    const next = {};
    if (!form.title.trim()) next.title = "Give the material a title.";
    if (form.type === "Link" && !form.url.trim()) next.url = "Paste the link to share.";
    if (form.type !== "Link" && !form.file && !isEdit) next.file = "Choose a file to upload.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave({
      ...form,
      title: form.title.trim(),
      sizeLabel: form.type === "Link" ? "-" : form.sizeLabel,
      ext: form.type === "Link" ? "LINK" : form.ext,
      uploadedAt: isEdit ? form.uploadedAt : new Date(),
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
            {isEdit ? "Edit material" : "Upload material"}
          </h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={label}>Material type</label>
            <div className="flex gap-2">
              {TYPES.map((t) => {
                const { icon: Icon } = typeIcon[t];
                return (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium ${
                      form.type === t
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {form.type === "Link" ? (
            <div>
              <label className={label}>Link URL</label>
              <input className={field} value={form.url} onChange={set("url")} placeholder="https://www.who.int/..." />
              {errors.url && <p className="text-xs text-rose-600 mt-1.5">{errors.url}</p>}
            </div>
          ) : (
            <div>
              <label className={label}>File</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  takeFile(e.dataTransfer.files?.[0]);
                }}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragging ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <UploadCloud size={26} className="mx-auto text-brand-500 mb-2" />
                {form.file ? (
                  <>
                    <p className="text-sm font-medium text-gray-800">{form.file.name}</p>
                    <p className="text-xs text-gray-400">
                      {form.sizeLabel} · {form.type}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Drag a file here, or click to browse</p>
                    <p className="text-xs text-gray-400 mt-0.5">PDF, PPT, DOC, MP4, MP3 and more</p>
                  </>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => takeFile(e.target.files?.[0])}
              />
              {errors.file && <p className="text-xs text-rose-600 mt-1.5">{errors.file}</p>}
            </div>
          )}

          <div>
            <label className={label}>Title</label>
            <input className={field} value={form.title} onChange={set("title")} placeholder="Anatomy - Unit 1 Notes" />
            {errors.title && <p className="text-xs text-rose-600 mt-1.5">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Course</label>
              <select className={field} value={form.course} onChange={set("course")}>
                {COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Year &amp; batch</label>
              <input className={field} value={form.meta} onChange={set("meta")} placeholder="Year I - Batch A" />
            </div>
          </div>

          <div>
            <label className={label}>Topic</label>
            <input className={field} value={form.topic} onChange={set("topic")} placeholder="Introduction to Human Body" />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors text-white text-sm font-medium"
          >
            {isEdit ? "Save changes" : "Upload material"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- preview modal ---------------- */

function PreviewModal({ item, onClose }) {
  const { icon: Icon, tint } = typeIcon[item.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tint}`}>
              <Icon size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{item.title}</h2>
              <p className="text-xs text-gray-500">
                {item.course} · {item.meta || "All batches"} · {item.sizeLabel}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {item.type === "Video" && item.url && (
            <video src={item.url} controls className="w-full rounded-xl bg-black" />
          )}
          {item.type === "Audio" && item.url && (
            <audio src={item.url} controls className="w-full" />
          )}
          {item.type === "Document" && item.url && (
            <iframe src={item.url} title={item.title} className="w-full h-[420px] rounded-xl border border-gray-100" />
          )}
          {item.type === "Link" && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium hover:underline break-all"
            >
              <ExternalLink size={15} /> {item.url || "No link added"}
            </a>
          )}
          {!item.url && item.type !== "Link" && (
            <p className="text-sm text-gray-500 text-center py-10">
              This entry has no stored file yet — re-upload it to preview the content here.
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Topic</p>
              <p className="text-gray-800">{item.topic || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Uploaded on</p>
              <p className="text-gray-800">{fmtStamp(item.uploadedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- row menu ---------------- */

function RowMenu({ item, onEdit, onCopyLink, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1.5 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="More actions">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Pencil size={14} /> Edit details
          </button>
          <button
            onClick={() => { setOpen(false); onCopyLink(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Copy size={14} /> Copy link
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function StudyMaterials() {
  /*  Metadata comes from GET /api/materials. The picked File stays in the
      browser (object URL) — swap this for a multipart upload endpoint when
      file storage is added, then POST the returned URL.  */
  const {
    data: items,
    setData: setItems,
    loading,
    error,
    reload,
  } = useResource((signal) => materialsApi.list(undefined, { signal }), []);

  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [topic, setTopic] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState({ key: "uploadedAt", dir: "desc" });
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const courseOptions = useMemo(() => [...new Set(items.map((m) => m.course))].sort(), [items]);
  const topicOptions = useMemo(
    () => [...new Set(items.map((m) => m.topic).filter(Boolean))].sort(),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter((m) => {
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.course.toLowerCase().includes(q) ||
        (m.topic || "").toLowerCase().includes(q);
      return (
        matchesQuery &&
        (course === "all" || m.course === course) &&
        (topic === "all" || m.topic === topic) &&
        (type === "all" || m.type === type)
      );
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sort.key === "uploadedAt") return (a.uploadedAt - b.uploadedAt) * dir;
      return String(a[sort.key]).localeCompare(String(b[sort.key])) * dir;
    });
  }, [items, query, course, topic, type, sort]);

  const counts = {
    total: items.length,
    documents: items.filter((m) => m.type === "Document").length,
    videos: items.filter((m) => m.type === "Video").length,
    audios: items.filter((m) => m.type === "Audio").length,
    links: items.filter((m) => m.type === "Link").length,
  };

  const payload = (data) => ({
    title: data.title,
    course: data.course,
    meta: data.meta,
    topic: data.topic,
    type: data.type,
    ext: data.ext,
    sizeLabel: data.sizeLabel,
    url: data.url,
    uploadedAt: new Date(data.uploadedAt ?? Date.now()).toISOString(),
  });

  async function handleSave(data) {
    if (data.id) {
      const saved = await materialsApi.update(data.id, payload(data));
      // Keep the local object URL so a just-picked file still previews.
      setItems((list) => list.map((m) => (m.id === saved.id ? { ...saved, file: data.file ?? null, url: data.url || saved.url } : m)));
      setNotice(`"${saved.title}" updated.`);
    } else {
      const saved = await materialsApi.create(payload(data));
      setItems((list) => [{ ...saved, file: data.file ?? null, url: data.url || saved.url }, ...list]);
      setNotice(`"${saved.title}" uploaded.`);
    }
  }

  function handleDownload(item) {
    if (item.type === "Link") {
      if (!item.url) return setNotice("No link stored for this entry.");
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!item.url) return setNotice("No file stored for this entry yet.");
    const link = document.createElement("a");
    link.href = item.url;
    link.download = `${item.title}.${(item.ext || "file").toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotice(`Downloading "${item.title}".`);
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.title}"? Students will lose access.`)) return;
    try {
      await materialsApi.remove(item.id);
      if (item.file && item.url) URL.revokeObjectURL(item.url);
      setItems((list) => list.filter((m) => m.id !== item.id));
      setNotice(`"${item.title}" deleted.`);
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't delete that material."));
    }
  }

  const SortHeader = ({ label, sortKey }) => (
    <th className={tableHeadCellClass}>
      <button
        onClick={() =>
          setSort((s) =>
            s.key === sortKey
              ? { key: sortKey, dir: s.dir === "asc" ? "desc" : "asc" }
              : { key: sortKey, dir: "asc" }
          )
        }
        className={`inline-flex items-center gap-1 rounded-md uppercase tracking-wider transition-colors hover:text-gray-800 ${
          sort.key === sortKey ? "text-brand-600" : ""
        }`}
      >
        {label}
        <ArrowUpDown size={12} />
      </button>
    </th>
  );

  const statCard = (key, icon, label, value, tint) => (
    <StatButton onClick={() => setType(key)} active={type === key}>
      <StatCard icon={icon} label={label} value={value} tint={tint} interactive active={type === key} />
    </StatButton>
  );

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard > Study Materials"
        title="Study Materials"
        subtitle="Upload and manage study materials for students"
        action={
          <PrimaryButton icon={Upload} onClick={() => setEditing({})}>
            Upload Material
          </PrimaryButton>
        }
      />

      <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        {statCard("all", Folder, "Total Materials", counts.total, "purple")}
        {statCard("Document", FileText, "Documents", counts.documents, "blue")}
        {statCard("Video", PlayCircle, "Videos", counts.videos, "green")}
        {statCard("Audio", Headphones, "Audios", counts.audios, "orange")}
        {statCard("Link", Link2, "Links", counts.links, "red")}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput placeholder="Search materials..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">All Topics</option>
          {topicOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="overflow-x-auto">
        {loading ? (
          <LoadingState rows={5} label="Loading study materials…" />
        ) : error ? (
          <ErrorState description={error} onRetry={reload} />
        ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className={tableHeadRowClass}>
              <SortHeader label="Title" sortKey="title" />
              <SortHeader label="Course" sortKey="course" />
              <SortHeader label="Topic" sortKey="topic" />
              <SortHeader label="Type" sortKey="type" />
              <SortHeader label="Uploaded On" sortKey="uploadedAt" />
              <th className={tableHeadCellClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((m) => {
              const { icon: Icon, tint } = typeIcon[m.type];
              return (
                <tr key={m.id} className={tableRowClass}>
                  <td className="py-3.5 px-5">
                    <button onClick={() => setPreview(m)} className="flex items-center gap-3 text-left">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 hover:text-brand-600 transition-colors">{m.title}</p>
                        <p className="text-xs text-gray-400">
                          {m.sizeLabel !== "-" ? m.sizeLabel : m.ext}
                        </p>
                      </div>
                    </button>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">
                    <p>{m.course}</p>
                    <p className="text-xs text-gray-400">{m.meta}</p>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">{m.topic || "—"}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge[m.type]}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-gray-500 whitespace-nowrap">{fmtStamp(m.uploadedAt)}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 text-gray-400">
                      <button onClick={() => setPreview(m)} className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(m)}
                        className="p-1.5 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        title={m.type === "Link" ? "Open link" : "Download"}
                      >
                        <Download size={15} />
                      </button>
                      <RowMenu
                        item={m}
                        onEdit={() => setEditing(m)}
                        onCopyLink={() => {
                          if (!m.url) return setNotice("Nothing to copy for this entry.");
                          navigator.clipboard.writeText(m.url);
                          setNotice("Link copied.");
                        }}
                        onDelete={() => handleDelete(m)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={items.length === 0 ? <Folder size={24} /> : <SearchX size={24} />}
            title={items.length === 0 ? "No materials yet" : "No materials match your filters"}
            description={
              items.length === 0
                ? "Upload notes, slides, recordings or links for your students."
                : "Try a different search term, course, topic or type."
            }
            action={
              items.length === 0
                ? (<PrimaryButton icon={Upload} onClick={() => setEditing({})}>Upload Material</PrimaryButton>)
                : (<SecondaryButton onClick={() => { setQuery(""); setCourse("all"); setTopic("all"); setType("all"); }}>Clear filters</SecondaryButton>)
            }
          />
        )}
      </Card>

      {editing && (
        <UploadModal
          initial={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}