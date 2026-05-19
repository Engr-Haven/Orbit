import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GitFork, Star, GitCommit, ExternalLink } from "lucide-react";

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

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const GitHubActivity = () => {
  const [username, setUsername] = useState("Engr-Haven");
  const [events, setEvents] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("activity");

  const inputRef = useRef(null);

  const fetchActivity = useCallback(async () => {
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
      inputRef.current?.focus();
    } catch (err) {
      setError(err.message || "Failed to fetch GitHub activity");
      setEvents([]);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const hasFetchedOnMount = useRef(false);

  useEffect(() => {
    if (hasFetchedOnMount.current) return;
    hasFetchedOnMount.current = true;
    if (username) fetchActivity();
  }, [fetchActivity]);

  const hasData = events.length > 0 || repos.length > 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
          <GitFork size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">GitHub Activity</h2>
          <p className="text-sm text-muted-foreground">
            Track events and repositories
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 text-foreground">
          <Input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onFocus={() => setError("")}
            placeholder="Enter GitHub username"
            onKeyDown={(e) => e.key === "Enter" && fetchActivity()}
            ref={inputRef}
          />
        </div>
        <Button onClick={fetchActivity} disabled={loading} variant="gradient">
          {loading ? "Loading..." : "Fetch"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {hasData && (
        <div className="flex gap-1 mb-4 border-b border-border">
          {["activity", "repos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all duration-300 relative ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "repos" ? "Top Repos" : "Activity"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {activeTab === "activity" && events.length > 0 && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {events.map((event) => (
            <div
              key={event.id}
              className="group p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <GitCommit size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {event.type.replace("Event", "")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.repo.name}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 sm:mt-1">
                  {formatDate(event.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "repos" && repos.length > 0 && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                      {repo.name}
                    </p>
                    <ExternalLink
                      size={12}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {repo.description}
                    </p>
                  )}
                  {repo.language && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: LANG_COLORS[repo.language] || "#888",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {repo.language}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Star size={12} />
                  {repo.stargazers_count}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && !error && !hasData && (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
            <GitFork size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Enter a username to see their recent activity
          </p>
        </div>
      )}
    </div>
  );
};

export default GitHubActivity;
