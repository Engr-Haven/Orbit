import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import GitHubPage from "./pages/GitHubPage";
import TasksPage from "./pages/TasksPage";
import WeatherPage from "./pages/WeatherPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="github" element={<GitHubPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="weather" element={<WeatherPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
