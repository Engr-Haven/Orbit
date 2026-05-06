import WeatherWidget from "./components/WeatherWidget";
import GitHubActivity from "./components/GitHubActivity";
import TaskManager from "./components/TaskManager";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans p-6">
      <header className="max-w-6xl mx-auto mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Orbit Dashboard</h1>
        <p className="text-text mt-1 text-sm md:text-base">Track GitHub activity, manage tasks, and check the weather</p>
      </header>
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <WeatherWidget />
        </section>
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <GitHubActivity />
        </section>
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
          <TaskManager />
        </section>
      </main>
    </div>
  );
}

export default App;
