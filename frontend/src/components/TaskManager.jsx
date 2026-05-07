import { useState, useEffect } from "react";

const PRIORITIES = [
  {
    value: "high",
    label: "High",
    dot: "🔴",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    border: "border-l-4 border-red-400",
  },
  {
    value: "medium",
    label: "Medium",
    dot: "🟡",
    badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    border: "border-l-4 border-yellow-400",
  },
  {
    value: "low",
    label: "Low",
    dot: "🟢",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    border: "border-l-4 border-green-400",
  },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

const getPriority = (value) =>
  PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1];

const TaskManager = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("orbit-tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    localStorage.setItem("orbit-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newTask.trim(),
        completed: false,
        priority,
      },
    ]);
    setNewTask("");
    setPriority("medium");
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority ?? "medium"];
    const pb = PRIORITY_ORDER[b.priority ?? "medium"];
    return pa - pb;
  });

  const counts = PRIORITIES.reduce((acc, p) => {
    acc[p.value] = tasks.filter(
      (t) => (t.priority ?? "medium") === p.value && !t.completed,
    ).length;
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">
        ✅ Task Manager
      </h2>

      {/* Priority summary badges */}
      {tasks.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {PRIORITIES.map((p) =>
            counts[p.value] > 0 ? (
              <span
                key={p.value}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.badge}`}
              >
                {p.dot} {counts[p.value]} {p.label}
              </span>
            ) : null,
          )}
        </div>
      )}

      <form onSubmit={addTask} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full px-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
        />
        <div className="flex gap-2">
          {/* Priority selector */}
          <div className="flex gap-1 flex-1">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  priority === p.value
                    ? `${p.badge} border-current`
                    : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                {p.dot} {p.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-primary text-white rounded-md hover:bg-button-hover font-medium text-sm transition-colors shrink-0"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {sortedTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No tasks yet. Add one above!
          </p>
        ) : (
          sortedTasks.map((task) => {
            const p = getPriority(task.priority);
            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg gap-2 ${p.border} transition-colors`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="h-5 w-5 text-primary rounded focus:ring-primary shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-sm sm:text-base block truncate ${
                        task.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-text dark:text-gray-100"
                      }`}
                    >
                      {task.text}
                    </span>
                    <span
                      className={`text-xs font-medium ${p.badge} px-1.5 py-0.5 rounded mt-0.5 inline-block`}
                    >
                      {p.dot} {p.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-error hover:text-red-700 text-sm shrink-0 transition-colors"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskManager;
