// import { useState } from "react";
// import { Camera, Pencil, Calendar, GraduationCap, Award, Clock, BookOpen, Users, Video, FolderOpen } from "lucide-react";
// import { PageHeader, PrimaryButton, Card } from "../components/ui";
// import { faculty, courses } from "../data/mockData";

// const tabs = ["Overview", "Personal Information", "Academic Information", "Preferences", "Security"];

// const infoRow = (label, value) => (
//   <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
//     <span className="text-sm text-gray-500">{label}</span>
//     <span className="text-sm font-medium text-gray-900">{value}</span>
//   </div>
// );

// export default function Profile() {
//   const [tab, setTab] = useState(tabs[0]);

//   return (
//     <div>
//       <PageHeader
//         breadcrumb="Dashboard > My Profile"
//         title="My Profile"
//         subtitle="View and update your profile information"
//         action={<PrimaryButton icon={Pencil}>Edit Profile</PrimaryButton>}
//       />

//       <Card className="p-6 mb-6">
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="flex flex-col items-center shrink-0">
//             <img
//               src="https://i.pravatar.cc/160?img=47"
//               alt={faculty.name}
//               className="w-28 h-28 rounded-full object-cover"
//             />
//             <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium border border-brand-200 text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50">
//               <Camera size={13} /> Change Photo
//             </button>
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-bold text-gray-900">{faculty.name}</h2>
//               <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">
//                 {faculty.role}
//               </span>
//             </div>
//             <p className="text-sm text-gray-600 mt-1">{faculty.department}</p>
//             <p className="text-sm text-brand-600">{faculty.college}</p>
//             <div className="mt-3 space-y-1 text-sm text-gray-500">
//               <p>{faculty.email}</p>
//               <p>{faculty.phone}</p>
//               <p>{faculty.location}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-x-8 gap-y-4 shrink-0">
//             <div className="flex items-start gap-2">
//               <Calendar size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Employee ID</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.employeeId}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-2">
//               <Calendar size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Date of Joining</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.joinDate}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-2">
//               <GraduationCap size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Qualification</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.qualification}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-2">
//               <Award size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Designation</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.designation}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-2">
//               <Clock size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Experience</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.experience}</p>
//               </div>
//             </div>
//             <div className="flex items-start gap-2">
//               <Clock size={16} className="text-brand-500 mt-0.5" />
//               <div>
//                 <p className="text-xs text-gray-400">Teaching Since</p>
//                 <p className="text-sm font-medium text-gray-900">{faculty.teachingSince}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
//         {tabs.map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`pb-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
//               tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {tab === "Overview" && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           <Card className="lg:col-span-2 p-5">
//             <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
//             <p className="text-sm text-gray-600 leading-relaxed">{faculty.about}</p>

//             <div className="flex items-center justify-between mt-6 mb-3">
//               <h3 className="font-semibold text-gray-900">My Courses ({courses.slice(0, 3).length})</h3>
//               <a href="/courses" className="text-sm text-brand-600 font-medium hover:underline">View All</a>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               {courses.slice(0, 3).map((c) => (
//                 <div key={c.id} className="rounded-xl overflow-hidden border border-gray-100">
//                   <img src={c.image} alt={c.title} className="w-full h-20 object-cover" />
//                   <div className="p-2.5">
//                     <p className="text-xs font-medium text-gray-900 truncate">{c.title}</p>
//                     <p className="text-[11px] text-gray-400">{c.students} Students</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           <Card className="p-5">
//             <h3 className="font-semibold text-gray-900 mb-3">Quick Information</h3>
//             <div className="space-y-3">
//               {[
//                 { icon: BookOpen, label: "Total Courses", value: faculty.stats.totalCourses, tint: "bg-brand-100 text-brand-600" },
//                 { icon: Users, label: "Total Students", value: faculty.stats.totalStudents, tint: "bg-emerald-100 text-emerald-600" },
//                 { icon: Video, label: "Live Classes Conducted", value: faculty.stats.liveClassesConducted, tint: "bg-blue-100 text-blue-600" },
//                 { icon: FolderOpen, label: "Published Materials", value: faculty.stats.publishedMaterials, tint: "bg-amber-100 text-amber-600" },
//               ].map((s) => (
//                 <div key={s.label} className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.tint}`}>
//                       <s.icon size={16} />
//                     </div>
//                     <span className="text-sm text-gray-600">{s.label}</span>
//                   </div>
//                   <span className="text-sm font-semibold text-gray-900">{s.value}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       )}

//       {tab === "Personal Information" && (
//         <Card className="p-5 max-w-xl">
//           {infoRow("Full Name", faculty.name)}
//           {infoRow("Email", faculty.email)}
//           {infoRow("Phone", faculty.phone)}
//           {infoRow("Location", faculty.location)}
//           {infoRow("Department", faculty.department)}
//         </Card>
//       )}

//       {tab === "Academic Information" && (
//         <Card className="p-5 max-w-xl">
//           {infoRow("Qualification", faculty.qualification)}
//           {infoRow("Designation", faculty.designation)}
//           {infoRow("Experience", faculty.experience)}
//           {infoRow("Teaching Since", faculty.teachingSince)}
//           {infoRow("College", faculty.college)}
//         </Card>
//       )}

//       {tab === "Preferences" && (
//         <Card className="p-5 max-w-xl text-sm text-gray-500">
//           Notification and display preferences will appear here.
//         </Card>
//       )}

//       {tab === "Security" && (
//         <Card className="p-5 max-w-xl text-sm text-gray-500">
//           Password and account security settings will appear here.
//         </Card>
//       )}
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Pencil,
  Calendar,
  GraduationCap,
  Award,
  Clock,
  BookOpen,
  Users,
  Video,
  FolderOpen,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PageHeader, Card, Badge } from "../components/ui";
import { faculty as seedFaculty, courses } from "../data/mockData";

const TABS = ["Overview", "Personal Information", "Academic Information", "Preferences", "Security"];

const DEFAULT_PREFS = {
  emailOnSubmission: true,
  emailOnMessage: true,
  weeklyDigest: false,
  showPhoneToStudents: true,
  twoFactor: false,
};

/* ------------------------------------------------------------------
   Replace the seed with your API when the backend is ready:
     getProfile().then(setProfile)   /   PUT on save
-------------------------------------------------------------------*/

/* Defined at module level so typing never remounts the input. */
function Field({ name, labelText, type = "text", value, onChange, disabled, error, ...rest }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1.5">{labelText}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-500"
        {...rest}
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(() => ({ ...seedFaculty }));
  const [form, setForm] = useState(() => ({ ...seedFaculty }));
  const [photo, setPhoto] = useState("https://i.pravatar.cc/160?img=47");
  const [tab, setTab] = useState(TABS[0]);
  const [editing, setEditing] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState({});
  const photoRef = useRef(null);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(profile),
    [form, profile]
  );

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: "" }));
  };

  // Quick Information reads from the course list instead of fixed numbers.
  const activeCourses = courses.filter((c) => c.status === "Active");
  const quickInfo = [
    { icon: BookOpen, label: "Total Courses", value: activeCourses.length, tint: "bg-brand-100 text-brand-600" },
    {
      icon: Users,
      label: "Total Students",
      value: courses.reduce((sum, c) => sum + (Number(c.students) || 0), 0),
      tint: "bg-emerald-100 text-emerald-600",
    },
    { icon: Video, label: "Live Classes Conducted", value: profile.stats.liveClassesConducted, tint: "bg-blue-100 text-blue-600" },
    { icon: FolderOpen, label: "Published Materials", value: profile.stats.publishedMaterials, tint: "bg-amber-100 text-amber-600" },
  ];

  function handleSave() {
    const next = {};
    if (!form.name.trim()) next.name = "Name can't be empty.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setProfile(form);
    setEditing(false);
    setNotice("Profile updated.");
  }

  function handleDiscard() {
    setForm(profile);
    setErrors({});
    setEditing(false);
    setNotice("Changes discarded.");
  }

  function handlePhoto(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setNotice("Pick an image file.");
    setPhoto(URL.createObjectURL(file));
    setNotice("Profile photo updated.");
  }

  const field =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 disabled:bg-gray-50 disabled:text-gray-500";
  const label = "block text-sm text-gray-600 mb-1.5";

  const Toggle = ({ checked, onChange, title, description }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={`w-11 h-6 rounded-full p-0.5 shrink-0 transition-colors ${
          checked ? "bg-brand-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeader
        breadcrumb="Dashboard > My Profile"
        title="My Profile"
        subtitle="View and update your profile information"
        action={
          editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl"
              >
                <RotateCcw size={15} /> Discard
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
              >
                <Save size={15} /> Save changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setEditing(true); setTab("Personal Information"); }}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
            >
              <Pencil size={15} /> Edit Profile
            </button>
          )
        }
      />

      {notice && (
        <div className="mb-5 text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
          {notice}
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center shrink-0">
            <img src={photo} alt={profile.name} className="w-28 h-28 rounded-full object-cover" />
            <button
              onClick={() => photoRef.current?.click()}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium border border-brand-200 text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50"
            >
              <Camera size={13} /> Change Photo
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { handlePhoto(e.target.files?.[0]); e.target.value = ""; }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">
                {profile.role}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{profile.department}</p>
            <p className="text-sm text-brand-600">{profile.college}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>{profile.email}</p>
              <p>{profile.phone}</p>
              <p>{profile.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 shrink-0">
            {[
              { icon: Calendar, label: "Employee ID", value: profile.employeeId },
              { icon: Calendar, label: "Date of Joining", value: profile.joinDate },
              { icon: GraduationCap, label: "Qualification", value: profile.qualification },
              { icon: Award, label: "Designation", value: profile.designation },
              { icon: Clock, label: "Experience", value: profile.experience },
              { icon: Clock, label: "Teaching Since", value: profile.teachingSince },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <item.icon size={16} className="text-brand-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">About Me</h3>
              {editing && <span className="text-xs text-brand-600">Editing</span>}
            </div>
            {editing ? (
              <textarea
                rows={4}
                className={field}
                value={form.about}
                onChange={set("about")}
                placeholder="Tell students about your teaching and research."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{profile.about}</p>
            )}

            <div className="flex items-center justify-between mt-6 mb-3">
              <h3 className="font-semibold text-gray-900">My Courses ({activeCourses.length})</h3>
              <Link to="/courses" className="text-sm text-brand-600 font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeCourses.slice(0, 3).map((c) => (
                <Link key={c.id} to="/courses" className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-card">
                  <img src={c.image} alt={c.title} className="w-full h-20 object-cover" />
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-[11px] text-gray-400">{c.students} Students</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Information</h3>
            <div className="space-y-3">
              {quickInfo.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.tint}`}>
                      <s.icon size={16} />
                    </div>
                    <span className="text-sm text-gray-600">{s.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "Personal Information" && (
        <Card className="p-6 max-w-2xl">
          {!editing && (
            <p className="text-xs text-gray-400 mb-4">
              Press “Edit Profile” above to change these details.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              name="name"
              labelText="Full name"
              value={form.name}
              onChange={set("name")}
              disabled={!editing}
              error={errors.name}
            />
            <Field
              name="email"
              labelText="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              disabled={!editing}
              error={errors.email}
            />
            <Field
              name="phone"
              labelText="Phone"
              value={form.phone}
              onChange={set("phone")}
              disabled={!editing}
              error={errors.phone}
            />
            <Field
              name="location"
              labelText="Location"
              value={form.location}
              onChange={set("location")}
              disabled={!editing}
              error={errors.location}
            />
            <Field
              name="department"
              labelText="Department"
              value={form.department}
              onChange={set("department")}
              disabled={!editing}
              error={errors.department}
            />
            <Field
              name="employeeId"
              labelText="Employee ID"
              value={form.employeeId}
              onChange={set("employeeId")}
              disabled={true}
              error={errors.employeeId}
            />
          </div>
        </Card>
      )}

      {tab === "Academic Information" && (
        <Card className="p-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              name="qualification"
              labelText="Qualification"
              value={form.qualification}
              onChange={set("qualification")}
              disabled={!editing}
              error={errors.qualification}
            />
            <Field
              name="designation"
              labelText="Designation"
              value={form.designation}
              onChange={set("designation")}
              disabled={!editing}
              error={errors.designation}
            />
            <Field
              name="experience"
              labelText="Experience"
              value={form.experience}
              onChange={set("experience")}
              disabled={!editing}
              error={errors.experience}
            />
            <Field
              name="teachingSince"
              labelText="Teaching since"
              value={form.teachingSince}
              onChange={set("teachingSince")}
              disabled={!editing}
              error={errors.teachingSince}
            />
            <Field
              name="college"
              labelText="College"
              value={form.college}
              onChange={set("college")}
              disabled={!editing}
              error={errors.college}
            />
            <Field
              name="joinDate"
              labelText="Date of joining"
              value={form.joinDate}
              onChange={set("joinDate")}
              disabled={true}
              error={errors.joinDate}
            />
          </div>
          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-2">Courses currently assigned</p>
            <div className="flex flex-wrap gap-2">
              {activeCourses.map((c) => (
                <span key={c.id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                  {c.title}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {tab === "Preferences" && (
        <Card className="p-6 max-w-2xl">
          <h3 className="font-semibold text-gray-900 mb-1">Notifications</h3>
          <p className="text-xs text-gray-500 mb-3">Choose what lands in your inbox.</p>
          <Toggle
            checked={prefs.emailOnSubmission}
            onChange={() => setPrefs((p) => ({ ...p, emailOnSubmission: !p.emailOnSubmission }))}
            title="Assignment submissions"
            description="Email me when a student submits an assignment."
          />
          <Toggle
            checked={prefs.emailOnMessage}
            onChange={() => setPrefs((p) => ({ ...p, emailOnMessage: !p.emailOnMessage }))}
            title="New messages"
            description="Email me when a student or colleague messages me."
          />
          <Toggle
            checked={prefs.weeklyDigest}
            onChange={() => setPrefs((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
            title="Weekly digest"
            description="A Monday summary of attendance and pending reviews."
          />

          <h3 className="font-semibold text-gray-900 mt-6 mb-1">Privacy</h3>
          <Toggle
            checked={prefs.showPhoneToStudents}
            onChange={() => setPrefs((p) => ({ ...p, showPhoneToStudents: !p.showPhoneToStudents }))}
            title="Show my phone number to students"
            description="Students can see your number on your profile card."
          />

          <button
            onClick={() => setNotice("Preferences saved.")}
            className="mt-5 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
          >
            <Save size={15} /> Save preferences
          </button>
        </Card>
      )}

      {tab === "Security" && <SecurityTab prefs={prefs} setPrefs={setPrefs} onNotice={setNotice} />}
    </div>
  );
}

/* ---------------- security tab ---------------- */

function SecurityTab({ prefs, setPrefs, onNotice }) {
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => {
    const p = pwd.next;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [pwd.next]);

  const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["bg-gray-200", "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"][strength];

  function changePassword() {
    const next = {};
    if (!pwd.current) next.current = "Enter your current password.";
    if (pwd.next.length < 8) next.next = "Use at least 8 characters.";
    if (pwd.next !== pwd.confirm) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPwd({ current: "", next: "", confirm: "" });
    onNotice("Password changed.");
  }

  const field =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400";

  return (
    <Card className="p-6 max-w-2xl">
      <h3 className="font-semibold text-gray-900 mb-1">Change password</h3>
      <p className="text-xs text-gray-500 mb-4">Use at least 8 characters with a number and a capital letter.</p>

      <div className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">Current password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className={field}
              value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
            />
            <button
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={show ? "Hide passwords" : "Show passwords"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.current && <p className="text-xs text-rose-600 mt-1">{errors.current}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">New password</label>
          <input
            type={show ? "text" : "password"}
            className={field}
            value={pwd.next}
            onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
          />
          {pwd.next && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${strengthColor}`} style={{ width: `${(strength / 4) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-500">{strengthLabel}</span>
            </div>
          )}
          {errors.next && <p className="text-xs text-rose-600 mt-1">{errors.next}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1.5">Confirm new password</label>
          <input
            type={show ? "text" : "password"}
            className={field}
            value={pwd.confirm}
            onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
          />
          {errors.confirm && <p className="text-xs text-rose-600 mt-1">{errors.confirm}</p>}
        </div>

        <button
          onClick={changePassword}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          <ShieldCheck size={15} /> Update password
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Two-factor authentication</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Ask for a code from your phone whenever you sign in on a new device.
            </p>
          </div>
          <button
            onClick={() => {
              setPrefs((p) => ({ ...p, twoFactor: !p.twoFactor }));
              onNotice(prefs.twoFactor ? "Two-factor turned off." : "Two-factor turned on.");
            }}
            role="switch"
            aria-checked={prefs.twoFactor}
            className={`w-11 h-6 rounded-full p-0.5 shrink-0 transition-colors ${
              prefs.twoFactor ? "bg-brand-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                prefs.twoFactor ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-800 mb-2">Active sessions</p>
          <div className="space-y-2">
            {[
              { device: "Windows · Edge", place: "Chennai, India", current: true },
              { device: "Android · Chrome", place: "Chennai, India", current: false },
            ].map((s) => (
              <div key={s.device} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm text-gray-800">{s.device}</p>
                  <p className="text-xs text-gray-400">{s.place}</p>
                </div>
                {s.current ? (
                  <Badge status="Active" />
                ) : (
                  <button
                    onClick={() => onNotice("Signed out of that device.")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 size={13} /> Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}