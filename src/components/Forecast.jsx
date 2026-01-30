export default function Forecast({ data }) {
  if (!data || data.length === 0) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">5-Tage-Vorhersage</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((day, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formatDate(day.dt_txt)}</p>
              <img src={iconUrl} alt={day.weather[0].description} className="w-16 h-16 mx-auto" />
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{Math.round(day.main.temp)}°C</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{day.weather[0].description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
