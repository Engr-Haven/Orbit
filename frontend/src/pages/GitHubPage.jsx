import GitHubActivity from "../components/GitHubActivity";

const GitHubPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">GitHub Activity</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track recent events and top repositories
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <GitHubActivity />
      </div>
    </div>
  );
};

export default GitHubPage;
