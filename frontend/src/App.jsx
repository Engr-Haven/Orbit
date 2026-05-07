import { useState, useEffect } from "react";
import WeatherWidget from "./components/WeatherWidget";
import GitHubActivity from "./components/GitHubActivity";
import TaskManager from "./components/TaskManager";
import "./App.css";

function App() {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem("orbit-theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("orbit-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background dark:bg-gray-900 font-sans p-4 md:p-6 transition-colors duration-300">
        <header className="max-w-6xl mx-auto mb-6 md:mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Orbit Dashboard
            </h1>
            <p className="text-text dark:text-gray-400 mt-1 text-sm md:text-base">
              Track GitHub activity, manage tasks, and check the weather
            </p>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="mt-1 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors text-lg"
            aria-label="Toggle dark mode"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </header>
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <WeatherWidget />
          </section>
          <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <GitHubActivity />
          </section>
          <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-1 transition-colors">
            <TaskManager />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
