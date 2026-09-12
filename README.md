# G Care Council LMS — Faculty Portal (Frontend)

React + Vite + Tailwind CSS frontend for the Faculty Portal, built from the provided LMS_DESIGN.pdf.

## Pages included
- Dashboard
- My Courses
- Live Classes
- Assignments
- Quizzes
- Students
- Attendance
- Study Materials
- Announcements
- Messages
- Profile
- Logout

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Build for production
```bash
npm run build
```
Output goes to `dist/`.

## Notes
- All page data currently comes from `src/data/mockData.js` — replace with real API calls when the backend (Node/Express + MySQL) is ready.
- Routing: `react-router-dom`. Icons: `lucide-react`. Styling: Tailwind CSS with a custom `brand`/`sidebar` color palette matching the design.
- Fully responsive: sidebar collapses to a slide-in drawer on mobile/tablet.
