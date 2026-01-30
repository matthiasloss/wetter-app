export default function Forecast({ data }) {
  if (!data || data.length === 0) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Heute';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen';
    }

    return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="mb-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-white/90 mb-3 px-1">
        {data.length}-Tage-Vorhersage
      </h3>
      <div className="glass rounded-2xl overflow-hidden">
        {data.map((day, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
          const rainChance = day.pop ? Math.round(day.pop * 100) : 0;

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 ${
                index !== data.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="w-20">
                <p className="text-white font-medium text-sm">{formatDate(day.dt_txt)}</p>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-center">
                <img src={iconUrl} alt={day.weather[0].description} className="w-10 h-10" />
                {rainChance > 0 && (
                  <div className="flex items-center gap-1 text-blue-300">
                    <span className="text-xs">💧</span>
                    <span className="text-xs font-medium">{rainChance}%</span>
                  </div>
                )}
              </div>

              <div className="text-right w-20">
                <p className="text-white font-semibold text-lg">{Math.round(day.main.temp)}°</p>
                <p className="text-white/50 text-xs capitalize truncate">{day.weather[0].description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
