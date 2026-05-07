import WeatherWidget from "../components/WeatherWidget";

const WeatherPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Weather</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Check current weather conditions
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default WeatherPage;
