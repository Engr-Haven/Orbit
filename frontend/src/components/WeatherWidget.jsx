import { useState, useEffect } from "react";

const WeatherWidget = () => {
  const [city, setCity] = useState("Lagos");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      );
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      setWeather(data.current_condition[0]);
      // setCity("");
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: fetch once on mount with default city

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary mb-4">
        🌤️ Weather Widget
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., Lagos)"
          className="flex-1 px-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-button-hover disabled:opacity-50 font-medium transition-colors cursor-pointer"
        >
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div>
      {error && <p className="text-error mb-4 text-sm">{error}</p>}
      {weather && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <img
              src={weather.weatherIconUrl?.[0]?.value}
              alt="Weather icon"
              className="w-12 h-12 sm:w-16 sm:h-16"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <p className="text-xs xs:text-base text-gray-600 dark:text-gray-400">
                {city}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {weather.temp_C}°C
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {weather.weatherDesc[0].value}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>💨 Wind: {weather.windspeedKmph} km/h</p>
            <p>🌡️ Feels like: {weather.FeelsLikeC}°C</p>
            <p>📊 Pressure: {weather.pressure} mb</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
