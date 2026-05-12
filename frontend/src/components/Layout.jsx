import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  GitFork,
  CheckSquare,
  Cloud,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const Layout = () => {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("orbit-theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", desc: "Overview" },
    {
      path: "/github",
      icon: GitFork,
      label: "GitHub",
      desc: "Repos & Activity",
    },
    {
      path: "/tasks",
      icon: CheckSquare,
      label: "Tasks",
      desc: "Task Management",
    },
    { path: "/weather", icon: Cloud, label: "Weather", desc: "Forecast" },
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 transition-colors duration-300">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={20} />}
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 glass dark:glass-dark z-40 transition-all duration-300 lg:translate-x-0 shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5 dark:opacity-10" />
            <div className="relative p-6 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="text-primary">Orbit</span>
                  </h1>
                  <p className="text-[11px] text-muted-foreground">
                    Developer Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 mt-4 space-y-1">
            <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-4">
              Menu
            </p>
            {navItems.map(({ path, icon: Icon, label, desc }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "gradient-primary text-white shadow-lg shadow-purple-500/25"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon size={18} className="shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate">{label}</p>
                        <p className="text-[10px] opacity-60 truncate hidden group-hover:block">
                          {desc}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 shadow-glow" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-3" />
            <button
              onClick={() => setDark((d) => !d)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </div>
              <span>{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:ml-64 min-h-screen p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
