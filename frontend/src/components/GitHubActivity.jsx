import { useState, useEffect } from "react";

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Ruby: "#701516",
};

const GitHubActivity = () => {
  const [username, setUsername] = useState("Engr-Haven");
  const [events, setEvents] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("activity");

  const fetchActivity = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [eventsRes, reposRes] = await Promise.all([
        fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/events/public`,
        ),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=stars&per_page=6`,
        ),
      ]);
      if (!eventsRes.ok)
        throw new Error(
          eventsRes.status === 404
            ? "User not found"
            : eventsRes.status === 403
              ? "Rate limit exceeded. Try again in an hour."
              : "Failed to fetch activity",
        );
      const eventsData = await eventsRes.json();
      setEvents(eventsData.slice(0, 10));
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        setRepos(reposData);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch GitHub activity");
      setEvents([]);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/set-state-in-effect
  }, []); // intentional: fetch once on mount with default username

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasData = events.length > 0 || repos.length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">
        🐙 GitHub Activity
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
        />
        <button
          onClick={fetchActivity}
          disabled={loading}
          className="px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>
      {error && <p className="text-error mb-3 text-sm">{error}</p>}

      {hasData && (
        <div className="flex gap-1 mb-3 border-b border-gray-200 dark:border-gray-600">
          {["activity", "repos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab === "repos" ? "Top Repos" : "Activity"}
            </button>
          ))}
        </div>
      )}

      {activeTab === "activity" && events.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <p className="font-medium text-text dark:text-gray-100 text-sm sm:text-base">
                    {event.type.replace("Event", "")}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
                    {event.repo.name}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500 shrink-0">
                  {formatDate(event.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "repos" && repos.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary text-sm truncate">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  ⭐ {repo.stargazers_count}
                </span>
              </div>
              {repo.language && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: LANG_COLORS[repo.language] || "#888",
                    }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {repo.language}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Enter a username to see their recent activity
        </p>
      )}
    </div>
  );
};

export default GitHubActivity;
