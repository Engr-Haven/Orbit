## Orbit is a developer dashboard — a single-page React application that aggregates personal productivity tools into one place. It's a frontend-only project (no backend), bootstrapped with Vite and styled with Tailwind CSS v4.2.4.


## Feature Details
# 1. Dashboard — Displays 4 stat cards (Total, Completed, Pending, High-Priority) derived from localStorage tasks, a completion-rate progress bar, a compact weather widget, and quick-link cards to other pages.
# 2. GitHub Activity — Takes a GitHub username (default: Engr-Haven), fetches their public events (up to 10) and top 6 starred repos. Tabs switch between activity feed and repo list. Language dots with color mapping.
# 3. Task Manager — Full CRUD with High/Medium/Low priority. Sorting by priority, completion checkboxes with animated checkmark, priority summary badges, delete on hover. Persisted to localStorage key orbit-tasks.
# 4. Weather Widget — Accepts a city name, fetches from wttr.in (format=j1). Displays temperature, humidity, wind, feels-like, pressure. Has a compact mode for embedding in the Dashboard.
# 5. Layout — Fixed sidebar with glass-morphism styling, dark/light theme toggle (persisted to localStorage key orbit-theme), mobile hamburger menu, <Outlet /> for nested routes.



## Notes
# - No automated tests are configured.
# - No backend or database — all persistent state is in localStorage (tasks, theme).
# - External APIs consumed: GitHub REST API (unauthenticated, rate-limited) and wttr.in (weather).
# - The src/assets/ and public/ directories are currently empty.
# - Default GitHub username is hardcoded to Engr-Haven; default weather city is Lagos.