import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Search,
} from "lucide-react";

const WeatherWidget = ({ compact }) => {
  const [city, setCity] = useState("Lagos");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityUI, setCityUI] = useState(city);

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
      setCityUI(city);
      setCity("");
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeather();
  }, []);

  return (
    <div>
      {!compact && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cloud size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Weather</h2>
            <p className="text-sm text-muted-foreground">
              Check current conditions
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 text-foreground">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city (e.g., Lagos)"
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
        </div>
        <Button
          onClick={fetchWeather}
          disabled={loading}
          variant="gradient"
          size={compact ? "sm" : "default"}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              <Search size={14} className="mr-1" /> Search
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      {weather && (
        <div className="space-y-4">
          <div
            className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-200/50 dark:border-sky-800/50 ${compact ? "p-3" : "p-5"}`}
          >
            <div className="relative">
              <img
                src={weather.weatherIconUrl?.[0]?.value}
                alt="Weather icon"
                className={`${compact ? "w-10 h-10" : "w-14 h-14"} drop-shadow-lg`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {!weather.weatherIconUrl?.[0]?.value && (
                <div
                  className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg`}
                >
                  <Cloud size={compact ? 20 : 28} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {cityUI}
              </p>
              <p
                className={`font-bold text-foreground ${compact ? "text-2xl" : "text-3xl"}`}
              >
                {weather.temp_C}°C
              </p>
              <p className="text-sm text-muted-foreground">
                {weather.weatherDesc?.[0]?.value || "Clear"}
              </p>
            </div>
          </div>
          <div
            className={`grid ${compact ? "grid-cols-2 gap-2" : "grid-cols-2 gap-3"}`}
          >
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Droplets size={14} className="text-sky-500 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Humidity
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {weather.humidity}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Wind size={14} className="text-cyan-500 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Wind
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {weather.windspeedKmph} km/h
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Thermometer size={14} className="text-orange-500 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Feels Like
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {weather.FeelsLikeC}°C
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
              <Gauge size={14} className="text-purple-500 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Pressure
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {weather.pressure} mb
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
