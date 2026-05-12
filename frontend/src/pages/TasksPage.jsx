import TaskManager from "../components/TaskManager";

const TasksPage = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
        <p className="text-muted-foreground mt-1">
          Organize and prioritize your work
        </p>
      </div>
      <div className="card-3d p-4 md:p-6">
        <TaskManager />
      </div>
    </div>
  );
};

export default TasksPage;
