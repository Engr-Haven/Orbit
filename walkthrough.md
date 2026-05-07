# Orbit Dashboard — Walkthrough, Principles & Code Audit

## What Was Built

**Orbit Dashboard** is a zero-backend React developer productivity dashboard with three self-contained widgets, living inside an existing Vite + React + Tailwind CSS v4 project.

```
frontend/src/
├── App.jsx                        ← Shell layout
└── components/
    ├── WeatherWidget.jsx           ← Live weather via wttr.in
    ├── GitHubActivity.jsx          ← GitHub public events API
    └── TaskManager.jsx             ← Local-first task CRUD
```

---

## APIs Used (all free, no key required)

| Widget | API | Endpoint |
|--------|-----|----------|
| Weather | [wttr.in](https://wttr.in) | `https://wttr.in/{city}?format=j1` |
| GitHub | [GitHub REST API v3](https://docs.github.com/en/rest) | `https://api.github.com/users/{username}/events/public` |
| Tasks | Browser `localStorage` | — |

---

## Design Principles Applied

### 1. Component Isolation
Each widget is a **fully self-contained component** — its own state, fetch logic, loading/error UI, and render. No prop-drilling, no shared state. This makes each piece independently testable and replaceable.

### 2. Lazy State Initialisation
`TaskManager` uses the lazy initialiser form of `useState`:
```jsx
const [tasks, setTasks] = useState(() => {
  try {
    const saved = localStorage.getItem("orbit-tasks");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
```
The `() =>` function form ensures `localStorage` is only read **once** at mount, not on every re-render. The `try/catch` guards against corrupted storage crashing the component tree.

### 3. Functional State Updaters
All `setTasks` calls use the `prev =>` updater pattern to avoid reading stale closure state under React's concurrent mode:
```jsx
setTasks(prev => [...prev, newTask]);
setTasks(prev => prev.map(...));
setTasks(prev => prev.filter(...));
```

### 4. Optimistic UX — Loading + Error States
Both API-powered widgets implement a three-state pattern:
- `loading` — disables buttons, shows text feedback
- `error` — shows a coloured error message below the input
- `data` — renders the content

### 5. Intentional `useEffect` Mount-Only Fetch
Both `WeatherWidget` and `GitHubActivity` use `useEffect(() => { … }, [])` to fetch on mount with their default values (`"Lagos"` / `"Engr-Haven"`). The `eslint-disable-next-line` comment documents that this is intentional, not an oversight.

### 6. Responsive-First Layout
`App.jsx` uses a three-column CSS Grid that gracefully degrades:
- `lg` (≥1024px): 3 columns side-by-side
- `md` (≥768px): 2 columns, task card spans full width
- Mobile: single column stack

### 7. Defensive API Error Handling
`GitHubActivity` distinguishes three HTTP failure modes:
```
404 → "User not found"
403 → "Rate limit exceeded. Try again in an hour."
other → "Failed to fetch activity"
```
The GitHub unauthenticated API allows 60 requests/hour per IP.

### 8. Collision-Safe IDs
Task IDs use `crypto.randomUUID()` — a browser-native CSPRNG UUID generator — instead of `Date.now()`, which could collide within the same millisecond.

---

## Code Audit — All Issues Found & Fixed

| # | Severity | File | Issue | Fix Applied |
|---|----------|------|-------|-------------|
| 1 | ⚠️ Warning | `WeatherWidget`, `GitHubActivity` | `useEffect` missing dep array comment | Added `eslint-disable-next-line` |
| 2 | 🔴 Bug | `WeatherWidget` | `wttr.in/{city}.png` returns a terminal chart, not an icon | Use `weatherIconUrl[0].value` from JSON |
| 3 | 🔴 Bug | `TaskManager` | `JSON.parse` on corrupted localStorage crashes app | Wrapped in `try/catch` |
| 4 | ⚠️ Warning | `TaskManager` | `setTasks([...tasks, …])` reads stale closure state | All updaters use `prev =>` functional form |
| 5 | ⚠️ Warning | `TaskManager` | `Date.now()` IDs can collide in rapid succession | Replaced with `crypto.randomUUID()` |
| 6 | 🟡 Minor | `GitHubActivity` | `p-3 sm:p-3` is a no-op redundant class | Removed `sm:p-3` |
| 7 | ⚠️ Warning | `WeatherWidget` | `<img>` had no `onError` fallback | Added `onError` to hide broken image |
| 8 | 🔴 Bug | `GitHubActivity` | GitHub 403 (rate limit) not handled | Added explicit 403 message |

---

## File Diffs

### WeatherWidget.jsx

```diff:WeatherWidget.jsx
import { useState } from "react";

const WeatherWidget = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeather(data.current_condition[0]);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">Weather Widget</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., London)"
          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50 font-medium"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="text-error mb-4">{error}</p>}
      {weather && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <img
              src={`https://wttr.in/${encodeURIComponent(city)}.png`}
              alt="Weather icon"
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
            <div>
              <p className="text-xl sm:text-2xl font-bold">{weather.temp_C}°C</p>
              <p className="text-sm sm:text-base text-gray-600">{weather.weatherDesc[0].value}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windspeedKmph} km/h</p>
            <p>Feels like: {weather.FeelsLikeC}°C</p>
            <p>Pressure: {weather.pressure} mb</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
===
import { useState, useEffect } from "react";

const WeatherWidget = () => {
  const [city, setCity] = useState("Lagos");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeather(data.current_condition[0]);
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: fetch once on mount with default city

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">
        Weather Widget
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., London)"
          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50 font-medium"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="text-error mb-4">{error}</p>}
      {weather && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <img
              src={weather.weatherIconUrl?.[0]?.value}
              alt="Weather icon"
              className="w-12 h-12 sm:w-16 sm:h-16"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <p className="text-xl sm:text-2xl font-bold">
                {weather.temp_C}°C
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {weather.weatherDesc[0].value}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windspeedKmph} km/h</p>
            <p>Feels like: {weather.FeelsLikeC}°C</p>
            <p>Pressure: {weather.pressure} mb</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
```

### GitHubActivity.jsx

```diff:GitHubActivity.jsx
import { useState } from "react";

const GitHubActivity = () => {
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchActivity = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`);
      if (!res.ok) throw new Error(res.status === 404 ? "User not found" : "Failed to fetch activity");
      const data = await res.json();
      setEvents(data.slice(0, 10));
    } catch (err) {
      setError(err.message || "Failed to fetch GitHub activity");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">GitHub Activity</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
        />
        <button
          onClick={fetchActivity}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>
      {error && <p className="text-error mb-4">{error}</p>}
      {events.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-text">{event.type.replace("Event", "")}</p>
                  <p className="text-sm text-gray-600">{event.repo.name}</p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(event.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500 text-sm">Enter a username to see their recent activity</p>
      )}
    </div>
  );
};

export default GitHubActivity;
===
import { useState, useEffect } from "react";

const GitHubActivity = () => {
  const [username, setUsername] = useState("Engr-Haven");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchActivity = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public`,
      );
      if (!res.ok)
        throw new Error(
          res.status === 404
            ? "User not found"
            : res.status === 403
              ? "Rate limit exceeded. Try again in an hour."
              : "Failed to fetch activity",
        );
      const data = await res.json();
      setEvents(data.slice(0, 10));
    } catch (err) {
      setError(err.message || "Failed to fetch GitHub activity");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: fetch once on mount with default username

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">
        GitHub Activity
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
          onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
        />
        <button
          onClick={fetchActivity}
          disabled={loading}
          className="px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50 font-medium"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>
      {error && <p className="text-error mb-4">{error}</p>}
      {events.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <div>
                  <p className="font-medium text-text text-sm sm:text-base">{event.type.replace("Event", "")}</p>
                  <p className="text-xs sm:text-sm text-gray-600 break-all">{event.repo.name}</p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(event.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500 text-sm">
          Enter a username to see their recent activity
        </p>
      )}
    </div>
  );
};

export default GitHubActivity;
```

### TaskManager.jsx

render_diffs(file:///c:/Users/DELL/Desktop\Orbit/frontend/src/components/TaskManager.jsx)

---

## How to Run

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The weather widget auto-loads Lagos and the GitHub widget auto-loads the Engr-Haven account. Both city and username are editable at runtime.
