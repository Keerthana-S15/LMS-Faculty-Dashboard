import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { FacultyProvider } from "./context/FacultyContext";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import LiveClasses from "./pages/LiveClasses";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import StudyMaterials from "./pages/StudyMaterials";
import Announcements from "./pages/Announcements";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <BrowserRouter>
      <FacultyProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/live-classes" element={<LiveClasses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Layout>
      </FacultyProvider>
    </BrowserRouter>
  );
}
