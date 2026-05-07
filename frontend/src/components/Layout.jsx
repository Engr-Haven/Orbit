import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, GitFork, CheckSquare, Cloud, Sun, Moon, Menu, X } from "lucide-react";

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
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/github", icon: GitFork, label: "GitHub" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/weather", icon: Cloud, label: "Weather" },
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300">
        {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Orbit</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Developer Dashboard</p>
          </div>

          <nav className="px-3 space-y-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-3">
            <button
              onClick={() => setDark((d) => !d)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              {dark ? "Light Mode" : "Dark Mode"}
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
