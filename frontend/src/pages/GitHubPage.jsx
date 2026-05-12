import GitHubActivity from "../components/GitHubActivity";

const GitHubPage = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">GitHub Activity</h1>
        <p className="text-muted-foreground mt-1">
          Track recent events and top repositories
        </p>
      </div>
      <div className="card-3d p-4 md:p-6">
        <GitHubActivity />
      </div>
    </div>
  );
};

export default GitHubPage;
