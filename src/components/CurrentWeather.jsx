export default function CurrentWeather({ data, onAddFavorite, isFavorite }) {
  if (!data) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  const temp = Math.round(data.main.temp);

  // Determine background gradient based on weather and time
  const isDay = Date.now() / 1000 > data.sys.sunrise && Date.now() / 1000 < data.sys.sunset;
  const weatherId = data.weather[0].id;

  let gradientClass = isDay ? 'from-sky-400 via-blue-500 to-blue-600' : 'from-indigo-900 via-purple-900 to-slate-900';

  if (weatherId >= 200 && weatherId < 300) {
    gradientClass = 'from-slate-700 via-purple-900 to-slate-900'; // Thunder
  } else if (weatherId >= 300 && weatherId < 600) {
    gradientClass = 'from-slate-500 via-blue-600 to-slate-700'; // Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    gradientClass = 'from-slate-200 via-blue-200 to-slate-300'; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    gradientClass = 'from-amber-200 via-gray-400 to-slate-500'; // Atmosphere
  } else if (weatherId >= 801) {
    gradientClass = isDay ? 'from-gray-400 via-slate-500 to-gray-600' : 'from-slate-700 via-slate-800 to-slate-900'; // Clouds
  }

  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-3xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden animate-fade-in`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{data.name}</h2>
            <p className="text-white/70 font-medium">{data.sys.country}</p>
          </div>
          <button
            onClick={onAddFavorite}
            className={`text-3xl transition-all duration-300 hover:scale-125 btn-press ${isFavorite ? 'text-yellow-300 drop-shadow-lg' : 'text-white/40 hover:text-white/70'}`}
            title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <img
            src={iconUrl}
            alt={data.weather[0].description}
            className="w-32 h-32 animate-float drop-shadow-2xl"
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-8xl font-extralight tracking-tighter">{temp}°</p>
          <p className="text-xl capitalize mt-2 text-white/90 font-medium">{data.weather[0].description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Gefühlt</p>
            <p className="text-2xl font-semibold mt-1">{Math.round(data.main.feels_like)}°</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Feuchte</p>
            <p className="text-2xl font-semibold mt-1">{data.main.humidity}%</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Wind</p>
            <p className="text-2xl font-semibold mt-1">{Math.round(data.wind.speed * 3.6)}<span className="text-sm">km/h</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
