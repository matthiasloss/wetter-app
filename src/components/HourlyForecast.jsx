export default function HourlyForecast({ data }) {
  if (!data || data.length === 0) return null;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();

    // Check if it's the current hour
    if (Math.abs(date - now) < 1.5 * 60 * 60 * 1000) {
      return 'Jetzt';
    }

    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mb-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-white/90 mb-3 px-1">
        Nächste 24 Stunden
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {data.map((hour, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
          const rainChance = hour.pop ? Math.round(hour.pop * 100) : 0;
          const isNow = formatTime(hour.dt_txt) === 'Jetzt';

          return (
            <div
              key={index}
              className={`flex-shrink-0 glass rounded-2xl p-3 text-center min-w-[80px] ${
                isNow ? 'ring-2 ring-white/30' : ''
              }`}
            >
              <p className={`text-xs mb-1 ${isNow ? 'text-white font-semibold' : 'text-white/60'}`}>
                {formatTime(hour.dt_txt)}
              </p>
              <img src={iconUrl} alt={hour.weather[0].description} className="w-10 h-10 mx-auto" />
              <p className="text-lg font-semibold text-white">
                {Math.round(hour.main.temp)}°
              </p>
              {rainChance > 0 && (
                <p className="text-xs text-blue-300 mt-1">
                  💧 {rainChance}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
