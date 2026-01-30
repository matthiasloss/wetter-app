export default function HourlyForecast({ data }) {
  if (!data || data.length === 0) return null;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Stunden-Vorhersage
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.map((hour, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
          return (
            <div
              key={index}
              className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md min-w-[100px]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {formatTime(hour.dt_txt)}
              </p>
              <img src={iconUrl} alt={hour.weather[0].description} className="w-12 h-12 mx-auto" />
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {Math.round(hour.main.temp)}°C
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {hour.main.humidity}% 💧
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
