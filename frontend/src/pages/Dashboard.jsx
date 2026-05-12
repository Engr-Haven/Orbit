import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import WeatherWidget from "../components/WeatherWidget";

const Dashboard = () => {
  const [tasks] = useState(() => {
    try {
      const saved = localStorage.getItem("orbit-tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityPending = tasks.filter(
    (t) => (t.priority ?? "medium") === "high" && !t.completed,
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: TrendingUp,
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/20",
      delay: "0s",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-500",
      shadow: "shadow-emerald-500/20",
      delay: "0.1s",
    },
    {
      title: "Pending",
      value: totalTasks - completedTasks,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
      delay: "0.2s",
    },
    {
      title: "High Priority",
      value: highPriorityPending,
      icon: AlertCircle,
      gradient: "from-rose-500 to-red-500",
      shadow: "shadow-rose-500/20",
      delay: "0.3s",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              Overview
            </div>
          </div>
          <p className="text-muted-foreground">
            Track your productivity at a glance
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
          <Sparkles size={14} className="text-primary" />
          <span>Welcome back!</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, gradient, shadow, delay }) => (
          <Card
            key={title}
            variant="elevated"
            className="group cursor-default"
            style={{ animationDelay: delay }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                  </p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    {value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Rate */}
      {totalTasks > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-primary" />
                <CardTitle>Completion Rate</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-500" />
                <span className="text-sm font-semibold text-foreground">
                  {completionRate}%
                </span>
              </div>
            </div>
            <CardDescription>
              {completedTasks} of {totalTasks} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={completionRate}
              variant={completionRate >= 80 ? "success" : completionRate >= 50 ? "gradient" : "warning"}
              className="h-3"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-md shadow-sky-500/20">
                <span className="text-white text-sm">&#9729;</span>
              </div>
              <CardTitle>Weather</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <WeatherWidget compact />
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
                <Zap size={16} className="text-white" />
              </div>
              <CardTitle>Quick Links</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { to: "/github", label: "GitHub Activity", desc: "View recent commits and repos" },
              { to: "/tasks", label: "Task Manager", desc: "Organize your workflow" },
              { to: "/weather", label: "Weather Details", desc: "Check forecasts" },
            ].map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
