export default function CurrentWeather({ data, onAddFavorite, isFavorite }) {
  if (!data) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold">{data.name}</h2>
          <p className="text-blue-100">{data.sys.country}</p>
        </div>
        <button
          onClick={onAddFavorite}
          className={`text-3xl transition-transform hover:scale-110 ${isFavorite ? 'text-yellow-300' : 'text-white/50'}`}
          title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={iconUrl} alt={data.weather[0].description} className="w-24 h-24" />
          <div>
            <p className="text-6xl font-light">{Math.round(data.main.temp)}°C</p>
            <p className="text-xl capitalize">{data.weather[0].description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="text-center">
          <p className="text-blue-100 text-sm">Gefühlt</p>
          <p className="text-xl font-semibold">{Math.round(data.main.feels_like)}°C</p>
        </div>
        <div className="text-center">
          <p className="text-blue-100 text-sm">Luftfeuchtigkeit</p>
          <p className="text-xl font-semibold">{data.main.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-blue-100 text-sm">Wind</p>
          <p className="text-xl font-semibold">{Math.round(data.wind.speed * 3.6)} km/h</p>
        </div>
      </div>
    </div>
  );
}
