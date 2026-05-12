import WeatherWidget from "../components/WeatherWidget";

const WeatherPage = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Weather</h1>
        <p className="text-muted-foreground mt-1">
          Check current weather conditions
        </p>
      </div>
      <div className="card-3d p-4 md:p-6">
        <WeatherWidget />
      </div>
    </div>
  );
};

export default WeatherPage;
