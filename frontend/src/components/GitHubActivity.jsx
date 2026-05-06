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
          res.status === 404 ? "User not found" : "Failed to fetch activity",
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
  }, []);

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
            <div key={event.id} className="p-3 sm:p-3 bg-gray-50 rounded-lg">
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
