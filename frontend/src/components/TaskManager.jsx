import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, Trash2, CheckCheck, ListTodo } from "lucide-react";

const PRIORITIES = [
  {
    value: "high",
    label: "High",
    color: "error",
    gradient: "from-rose-500 to-red-500",
    border: "border-l-[3px] border-red-400",
  },
  {
    value: "medium",
    label: "Medium",
    color: "warning",
    gradient: "from-amber-500 to-orange-500",
    border: "border-l-[3px] border-amber-400",
  },
  {
    value: "low",
    label: "Low",
    color: "success",
    gradient: "from-emerald-500 to-green-500",
    border: "border-l-[3px] border-emerald-400",
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

  const totalActive = tasks.filter((t) => !t.completed).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <ListTodo size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Task Manager</h2>
          <p className="text-sm text-muted-foreground">Organize and prioritize your work</p>
        </div>
        {totalActive > 0 && (
          <Badge variant="info" className="ml-auto">{totalActive} active</Badge>
        )}
      </div>

      {/* Priority summary badges */}
      {tasks.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {PRIORITIES.map((p) =>
            counts[p.value] > 0 ? (
              <Badge key={p.value} variant={p.color}>
                {counts[p.value]} {p.label}
              </Badge>
            ) : null,
          )}
        </div>
      )}

      <form onSubmit={addTask} className="space-y-3 mb-6 p-4 rounded-xl bg-muted/30 border border-border/50">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <div className="flex gap-2">
          <div className="flex gap-1 flex-1">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                  priority === p.value
                    ? `bg-gradient-to-r ${p.gradient} text-white border-transparent shadow-md`
                    : "border-border text-muted-foreground hover:border-foreground/30 bg-card"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button type="submit" variant="gradient" size="sm" className="shrink-0">
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>
      </form>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <CheckCheck size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const p = getPriority(task.priority);
            return (
              <div
                key={task.id}
                className={`group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${p.border} ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="peer h-5 w-5 rounded-lg border-2 border-muted-foreground/30 bg-card checked:bg-gradient-to-br checked:from-emerald-500 checked:to-green-500 checked:border-transparent focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer appearance-none transition-all duration-200"
                  />
                  {task.completed && (
                    <CheckCheck size={14} className="absolute top-0.5 left-0.5 text-white pointer-events-none" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium transition-all duration-300 ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${p.gradient}`} />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {p.label} Priority
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-8 h-8 rounded-lg bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Trash2 size={14} className="text-red-500" />
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
