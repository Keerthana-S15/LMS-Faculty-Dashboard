// import { useState } from "react";
// import { Edit3, Search, Filter, Phone, Video, MoreVertical, Send, FileText, MessageSquare, Mail, Users2, Paperclip } from "lucide-react";
// import { PageHeader, PrimaryButton, StatCard, Card } from "../components/ui";
// import { conversations, messageStats } from "../data/mockData";

// const filterTabs = ["All", "Unread", "Students", "Faculty", "Groups"];

// export default function Messages() {
//   const [active, setActive] = useState(conversations[0]);
//   const [filter, setFilter] = useState("All");
//   const [draft, setDraft] = useState("");

//   const filtered = conversations.filter((c) => {
//     if (filter === "All") return true;
//     if (filter === "Unread") return c.unread > 0;
//     if (filter === "Groups") return c.isGroup;
//     if (filter === "Students") return c.role === "Student";
//     if (filter === "Faculty") return c.role === "Faculty" || c.name.includes("Faculty");
//     return true;
//   });

//   return (
//     <div>
//       <PageHeader
//         breadcrumb="Dashboard > Messages"
//         title="Messages"
//         subtitle="Communicate with students and faculty"
//         action={<PrimaryButton icon={Edit3}>New Message</PrimaryButton>}
//       />

//       <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
//         <StatCard icon={MessageSquare} label="Total Conversations" value={messageStats.totalConversations} sub="Active chats" tint="purple" />
//         <StatCard icon={Mail} label="Unread Messages" value={messageStats.unreadMessages} sub="New messages" tint="green" />
//         <StatCard icon={Users2} label="Groups" value={messageStats.groups} sub="Active groups" tint="orange" />
//         <StatCard icon={Send} label="Sent Messages" value={messageStats.sentThisMonth} sub="This month" tint="blue" />
//       </div>

//       <Card className="grid grid-cols-1 md:grid-cols-[320px_1fr_260px] overflow-hidden" style={{ minHeight: 520 }}>
//         {/* Conversation list */}
//         <div className="border-r border-gray-100 flex flex-col">
//           <div className="p-4 border-b border-gray-100 flex gap-2">
//             <div className="relative flex-1">
//               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 placeholder="Search conversations..."
//                 className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
//               />
//             </div>
//             <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600">
//               <Filter size={15} />
//             </button>
//           </div>
//           <div className="flex gap-3 px-4 pt-3 text-xs text-gray-500 overflow-x-auto scrollbar-none">
//             {filterTabs.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setFilter(t)}
//                 className={`pb-2 border-b-2 whitespace-nowrap ${
//                   filter === t ? "border-brand-600 text-brand-600 font-medium" : "border-transparent"
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {filtered.map((c) => (
//               <button
//                 key={c.id}
//                 onClick={() => setActive(c)}
//                 className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
//                   active.id === c.id ? "bg-brand-50" : ""
//                 }`}
//               >
//                 <div className="relative shrink-0">
//                   <img
//                     src={c.isGroup ? undefined : `https://i.pravatar.cc/80?u=${c.id}`}
//                     className={`w-10 h-10 rounded-full object-cover ${c.isGroup ? "bg-brand-100" : ""}`}
//                   />
//                   {c.unread > 0 && (
//                     <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-600" />
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between">
//                     <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
//                     <span className="text-[11px] text-gray-400 shrink-0">{c.time}</span>
//                   </div>
//                   <p className="text-xs text-gray-500 truncate">{c.last}</p>
//                 </div>
//                 {c.unread > 0 && (
//                   <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center shrink-0">
//                     {c.unread}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat panel */}
//         <div className="flex flex-col">
//           <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
//             <div className="flex items-center gap-3">
//               <img src={`https://i.pravatar.cc/80?u=${active.id}`} className="w-9 h-9 rounded-full object-cover" />
//               <div>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {active.name}{" "}
//                   {active.role && (
//                     <span className="ml-1 text-[11px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
//                       {active.role}
//                     </span>
//                   )}
//                 </p>
//                 <p className="text-xs text-gray-400">{active.meta}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1 text-gray-400">
//               <button className="p-2 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Phone size={16} /></button>
//               <button className="p-2 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"><Video size={16} /></button>
//               <button className="p-2 hover:text-gray-600"><MoreVertical size={16} /></button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-5 space-y-4">
//             {active.messages?.length ? (
//               <>
//                 <p className="text-center text-xs text-gray-400">Today</p>
//                 {active.messages.map((m, i) => (
//                   <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
//                     <div
//                       className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
//                         m.from === "me"
//                           ? "bg-brand-600 text-white rounded-br-sm"
//                           : "bg-gray-100 text-gray-800 rounded-bl-sm"
//                       }`}
//                     >
//                       {m.text}
//                       <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-gray-400"}`}>
//                         {m.time}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </>
//             ) : (
//               <p className="text-sm text-gray-400 text-center mt-10">No messages yet. Say hello 👋</p>
//             )}
//           </div>

//           <div className="p-4 border-t border-gray-100 flex items-center gap-2">
//             <button className="p-2 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
//               <Paperclip size={18} />
//             </button>
//             <input
//               value={draft}
//               onChange={(e) => setDraft(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
//             />
//             <button
//               onClick={() => setDraft("")}
//               className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 shrink-0"
//             >
//               <Send size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Details panel */}
//         <div className="border-l border-gray-100 p-5 hidden md:block">
//           <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation Details</h3>
//           <div className="flex flex-col items-center text-center mb-4">
//             <img src={`https://i.pravatar.cc/100?u=${active.id}`} className="w-16 h-16 rounded-full object-cover mb-2" />
//             <p className="text-sm font-semibold text-gray-900">{active.name}</p>
//             <p className="text-xs text-gray-500">{active.meta}</p>
//           </div>
//           {active.studentId && (
//             <div className="mb-4">
//               <p className="text-xs font-semibold text-gray-500 mb-2">About</p>
//               <div className="space-y-1.5 text-xs text-gray-600">
//                 <p>Student ID: {active.studentId}</p>
//                 <p>Email: {active.email}</p>
//                 <p>Phone: {active.phone}</p>
//               </div>
//             </div>
//           )}
//           {active.files?.length > 0 && (
//             <div>
//               <p className="text-xs font-semibold text-gray-500 mb-2">
//                 Files Shared ({active.files.length})
//               </p>
//               <div className="space-y-2">
//                 {active.files.map((f, i) => (
//                   <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
//                     <FileText size={14} className="text-brand-500 shrink-0" />
//                     <div className="min-w-0">
//                       <p className="truncate">{f.name}</p>
//                       <p className="text-gray-400">{f.size}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import {
  Edit3,
  Search,
  Filter,
  Phone,
  Video,
  MoreVertical,
  Send,
  FileText,
  MessageSquare,
  Mail,
  Users2,
  Paperclip,
  X,
  Trash2,
  MailOpen,
  CheckCheck,
  ArrowLeft,
  SearchX,
} from "lucide-react";
import { PageHeader, PrimaryButton, StatCard, Card, Notice, StatButton, LoadingState, ErrorState, labelClass, inputClass, IconButton } from "../components/ui";
import { messagesApi, studentsApi, errorMessage } from "../api";
import { useResource } from "../hooks/useResource";

const FILTERS = ["All", "Unread", "Students", "Faculty", "Groups"];

const FACULTY_CONTACTS = [
  { id: "f1", name: "Dr. Kavitha R", role: "Faculty", meta: "Nursing Department" },
  { id: "f2", name: "Prof. Suresh N", role: "Faculty", meta: "Nursing Department" },
];

const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

/* ------------------------------------------------------------------
   Every conversation gets a message history: the seeded ones keep
   theirs, the rest are seeded from their last preview line so no chat
   opens empty. Replace with your API when the backend is ready:
     getConversations().then(setChats) / getMessages(chatId)
-------------------------------------------------------------------*/
/* ---------------- new message modal ---------------- */

function NewMessageModal({ existing, onClose, onCreate }) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // Student contacts are loaded from the API; faculty groups are static.
  const { data: students } = useResource((signal) => studentsApi.list(undefined, { signal }), []);

  const contacts = useMemo(() => {
    const studentContacts = students.map((s) => ({
      id: `s-${s.id}`,
      name: s.name,
      role: "Student",
      meta: `${s.course} (${s.batch})`,
    }));
    const q = query.trim().toLowerCase();
    return [...studentContacts, ...FACULTY_CONTACTS].filter(
      (c) => !q || c.name.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-modal ring-1 ring-black/5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">New message</h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className={labelClass}>To</label>
            {picked ? (
              <div className="flex items-center gap-3 border border-brand-200 bg-brand-50 rounded-xl px-3 py-2.5">
                <img src={`https://i.pravatar.cc/60?u=${picked.id}`} className="w-8 h-8 rounded-full" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{picked.name}</p>
                  <p className="text-xs text-gray-500 truncate">{picked.meta}</p>
                </div>
                <button onClick={() => setPicked(null)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search students or faculty..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                </div>
                <div className="mt-2 max-h-52 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setPicked(c)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left"
                    >
                      <img src={`https://i.pravatar.cc/60?u=${c.id}`} className="w-8 h-8 rounded-full" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500 truncate">{c.meta}</p>
                      </div>
                      {existing.some((x) => x.name === c.name) && (
                        <span className="text-[10px] text-gray-400">existing chat</span>
                      )}
                    </button>
                  ))}
                  {contacts.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">No contacts found.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <label className={labelClass}>Message</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
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
            onClick={() => { onCreate(picked, text.trim()); onClose(); }}
            disabled={!picked || !text.trim()}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm transition-colors disabled:opacity-40 text-white text-sm font-medium"
          >
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- chat header menu ---------------- */

function ChatMenu({ onMarkUnread, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-lg hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="More actions">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1.5 text-sm z-30 origin-top-right animate-scale-in">
          <button onClick={() => { setOpen(false); onMarkUnread(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <MailOpen size={14} /> Mark as unread
          </button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors">
            <Trash2 size={14} /> Delete conversation
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Messages() {
  // Conversations, their messages and files come from GET /api/conversations.
  const {
    data: chats,
    setData: setChats,
    loading,
    error,
    reload,
  } = useResource((signal) => messagesApi.list({ signal }), []);
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [sentThisSession, setSentThisSession] = useState(0);
  const [notice, setNotice] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const { data: serverStats } = useResource(
    (signal) => messagesApi.stats({ signal }),
    [],
    { initial: null }
  );

  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const active = chats.find((c) => c.id === activeId) || null;

  // Open the first conversation once the list has loaded.
  useEffect(() => {
    if (activeId === null && chats.length) setActiveId(chats[0].id);
  }, [chats, activeId]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  // Keep the newest message in view.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active?.messages?.length, activeId]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return chats.filter((c) => {
      const matchesSearch =
        !q || c.name.toLowerCase().includes(q) || (c.last || "").toLowerCase().includes(q);
      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && c.unread > 0) ||
        (filter === "Groups" && c.isGroup) ||
        (filter === "Students" && c.role === "Student") ||
        (filter === "Faculty" && (c.role === "Faculty" || c.name.toLowerCase().includes("faculty")));
      return matchesSearch && matchesFilter;
    });
  }, [chats, search, filter]);

  // Totals come from the API; sentThisSession keeps the tile live between
  // refreshes without another round trip after every message.
  const stats = {
    total: chats.length,
    unread: chats.reduce((sum, c) => sum + (c.unread || 0), 0),
    groups: chats.filter((c) => c.isGroup).length,
    sent: (serverStats?.sent ?? 0) + sentThisSession,
  };

  function openChat(id) {
    setActiveId(id);
    setMobileChatOpen(true);
    // Opening a chat clears its unread badge, here and on the server.
    const chat = chats.find((c) => c.id === id);
    setChats((list) => list.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    if (chat?.unread) messagesApi.update(id, { unread: 0 }).catch(() => {});
  }

  async function sendMessage() {
    const text = draft.trim();
    if (!text || !active) return;

    const chatId = active.id;
    const optimisticId = `pending-${Date.now()}`;
    const time = nowTime();

    // Show the bubble straight away, then reconcile with the saved row.
    setChats((list) =>
      list.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, { id: optimisticId, from: "me", text, time }],
              last: text,
              time: "Now",
              unread: 0,
            }
          : c
      )
    );
    setSentThisSession((n) => n + 1);
    setDraft("");

    try {
      const saved = await messagesApi.send(chatId, { text, from: "me" });
      setChats((list) =>
        list.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.map((m) => (m.id === optimisticId ? saved : m)) }
            : c
        )
      );
    } catch (err) {
      setChats((list) =>
        list.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.filter((m) => m.id !== optimisticId) }
            : c
        )
      );
      setSentThisSession((n) => Math.max(0, n - 1));
      setDraft(text);
      setNotice(errorMessage(err, "Couldn't send that message."));
    }
  }

  async function attachFile(file) {
    if (!file || !active) return;
    const sizeLabel =
      file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(0)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    try {
      // The file itself stays local; the API records what was shared.
      const saved = await messagesApi.attach(active.id, { name: file.name, size: sizeLabel });
      setChats((list) => list.map((c) => (c.id === saved.id ? saved : c)));
      setSentThisSession((n) => n + 1);
      setNotice(`"${file.name}" shared.`);
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't share that file."));
    }
  }

  async function createConversation(contact, text) {
    try {
      // The API appends to an existing thread with the same name, or starts one.
      const saved = await messagesApi.create({
        name: contact.name,
        role: contact.role,
        meta: contact.meta,
        isGroup: contact.role === "Group",
        text,
      });
      setChats((list) =>
        list.some((c) => c.id === saved.id)
          ? list.map((c) => (c.id === saved.id ? saved : c))
          : [saved, ...list]
      );
      setActiveId(saved.id);
      setSentThisSession((n) => n + 1);
      setMobileChatOpen(true);
      setNotice(`Message sent to ${contact.name}.`);
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't start that conversation."));
    }
  }

  async function deleteChat(chat) {
    if (!window.confirm(`Delete the conversation with ${chat.name}?`)) return;
    try {
      await messagesApi.remove(chat.id);
      setChats((list) => list.filter((c) => c.id !== chat.id));
      setActiveId((id) => (id === chat.id ? chats.find((c) => c.id !== chat.id)?.id ?? null : id));
      setNotice("Conversation deleted.");
    } catch (err) {
      setNotice(errorMessage(err, "Couldn't delete that conversation."));
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard > Messages"
        title="Messages"
        subtitle="Communicate with students and faculty"
        action={
          <PrimaryButton icon={Edit3} onClick={() => setComposing(true)}>
            New Message
          </PrimaryButton>
        }
      />

      <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        <StatCard icon={MessageSquare} label="Total Conversations" value={stats.total} sub="Active chats" tint="purple" />
        <StatButton onClick={() => setFilter("Unread")} active={filter === "Unread"}>
          <StatCard icon={Mail} label="Unread Messages" value={stats.unread} sub="New messages" tint="green" interactive active={filter === "Unread"} />
        </StatButton>
        <StatButton onClick={() => setFilter("Groups")} active={filter === "Groups"}>
          <StatCard icon={Users2} label="Groups" value={stats.groups} sub="Active groups" tint="orange" interactive active={filter === "Groups"} />
        </StatButton>
        <StatCard icon={Send} label="Sent Messages" value={stats.sent} sub="This month" tint="blue" />
      </div>

      <Notice message={notice} onClose={() => setNotice("")} />

      <Card className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr_260px] overflow-hidden" style={{ minHeight: 540 }}>
        {/* conversation list */}
        <div className={`border-r border-gray-100 flex-col ${mobileChatOpen ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-gray-100 flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                aria-label="Search conversations"
                className={`${inputClass} pl-9 pr-3 py-2`}
              />
            </div>
            <IconButton
              icon={Filter}
              label="Clear filters"
              onClick={() => { setSearch(""); setFilter("All"); }}
              className="border border-gray-200 bg-white shadow-sm w-auto h-auto p-2.5"
            />
          </div>

          <div className="flex gap-1.5 px-3 py-2.5 border-b border-gray-100 overflow-x-auto scrollbar-none">
            {FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                aria-pressed={filter === t}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === t
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <LoadingState rows={5} label="Loading conversations…" />}
            {!loading && error && <ErrorState description={error} onRetry={reload} />}
            {!loading && !error && visible.map((c) => (
              <button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`relative w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                  activeId === c.id ? "bg-brand-50/70 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-brand-600" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={`https://i.pravatar.cc/80?u=${c.id}`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {c.unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${c.unread > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}>
                      {c.name}
                    </p>
                    <span className="text-[11px] text-gray-400 shrink-0">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}

            {!loading && !error && visible.length === 0 && (
              <div className="p-8 text-center">
                <SearchX size={22} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No conversations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* chat panel */}
        <div className={`flex-col ${mobileChatOpen ? "flex" : "hidden md:flex"}`}>
          {!active ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare size={26} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Pick a conversation to start chatting.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 md:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <img src={`https://i.pravatar.cc/80?u=${active.id}`} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                      {active.name}
                      {active.role && (
                        <span className="text-[11px] bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 px-2 py-0.5 rounded-full font-medium">
                          {active.role}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{active.meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <button onClick={() => setNotice("Voice call starts here.")} className="p-2 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors">
                    <Phone size={16} />
                  </button>
                  <button onClick={() => setNotice("Video call starts here.")} className="p-2 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors">
                    <Video size={16} />
                  </button>
                  <ChatMenu
                    onMarkUnread={async () => {
                      setChats((list) => list.map((c) => (c.id === active.id ? { ...c, unread: 1 } : c)));
                      try {
                        await messagesApi.update(active.id, { unread: 1 });
                        setNotice("Marked as unread.");
                      } catch (err) {
                        setNotice(errorMessage(err, "Couldn't mark that as unread."));
                      }
                    }}
                    onDelete={() => deleteChat(active)}
                  />
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/40" style={{ maxHeight: 380 }}>
                {active.messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-10">No messages yet. Say hello 👋</p>
                ) : (
                  <>
                    <p className="text-center text-xs text-gray-400">Today</p>
                    {active.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line shadow-sm ${
                            m.from === "me"
                              ? "bg-brand-600 text-white rounded-br-sm"
                              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          {m.text}
                          <span
                            className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                              m.from === "me" ? "text-white/70" : "text-gray-400"
                            }`}
                          >
                            {m.time}
                            {m.from === "me" && <CheckCheck size={11} />}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  title="Attach a file"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => { attachFile(e.target.files?.[0]); e.target.value = ""; }}
                />
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type a message..."
                  aria-label="Message"
                  className={`${inputClass} flex-1`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 active:bg-brand-800 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* details panel */}
        <div className="border-l border-gray-100 p-5 hidden lg:block">
          {active ? (
            <>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation Details</h3>
              <div className="flex flex-col items-center text-center mb-4">
                <img src={`https://i.pravatar.cc/100?u=${active.id}`} alt="" className="w-16 h-16 rounded-full object-cover mb-2" />
                <p className="text-sm font-semibold text-gray-900">{active.name}</p>
                <p className="text-xs text-gray-500">{active.meta}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">About</p>
                <div className="space-y-1.5 text-xs text-gray-600">
                  {active.studentId && <p>Student ID: {active.studentId}</p>}
                  {active.email && <p>Email: {active.email}</p>}
                  {active.phone && <p>Phone: {active.phone}</p>}
                  <p>Messages: {active.messages.length}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Files Shared ({active.files.length})
                </p>
                {active.files.length === 0 ? (
                  <p className="text-xs text-gray-400">No files shared yet.</p>
                ) : (
                  <div className="space-y-2">
                    {active.files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
                        <FileText size={14} className="text-brand-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate">{f.name}</p>
                          <p className="text-gray-400">{f.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">No conversation selected.</p>
          )}
        </div>
      </Card>

      {composing && (
        <NewMessageModal
          existing={chats}
          onClose={() => setComposing(false)}
          onCreate={createConversation}
        />
      )}
    </div>
  );
}