import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { CheckCircle, Clock, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
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
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityPending = tasks.filter(
    (t) => (t.priority ?? "medium") === "high" && !t.completed
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Pending",
      value: totalTasks - completedTasks,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: "High Priority",
      value: highPriorityPending,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your productivity at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon, color, bg }) => (
          <Card key={title} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                  <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
                  <Icon size={24} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Rate */}
      {totalTasks > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={completionRate} className="flex-1" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {completionRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherWidget compact />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/github"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">GitHub Activity</span>
              <ArrowRight size={16} className="text-gray-500" />
            </Link>
            <Link
              to="/tasks"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">Task Manager</span>
              <ArrowRight size={16} className="text-gray-500" />
            </Link>
            <Link
              to="/weather"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">Weather Details</span>
              <ArrowRight size={16} className="text-gray-500" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
