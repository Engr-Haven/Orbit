import TaskManager from "../components/TaskManager";

const TasksPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Organize and prioritize your work
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <TaskManager />
      </div>
    </div>
  );
};

export default TasksPage;
