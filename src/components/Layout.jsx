import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ErrorBoundary from "./ErrorBoundary";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Start each page at the top, like a normal multi-page app would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* Keyed on the route: remounts per page (clearing any caught error)
              and gives each page a short fade-in. */}
          <ErrorBoundary key={pathname}>
            <div className="animate-fade-up">{children}</div>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
