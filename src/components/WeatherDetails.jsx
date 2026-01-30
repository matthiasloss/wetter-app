export default function WeatherDetails({ data }) {
  if (!data) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate daylight hours
  const daylightSeconds = data.sys.sunset - data.sys.sunrise;
  const daylightHours = Math.floor(daylightSeconds / 3600);
  const daylightMinutes = Math.floor((daylightSeconds % 3600) / 60);

  // Wind direction
  const getWindDirection = (deg) => {
    const directions = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const details = [
    {
      icon: '🌅',
      label: 'Sonnenaufgang',
      value: formatTime(data.sys.sunrise)
    },
    {
      icon: '🌇',
      label: 'Sonnenuntergang',
      value: formatTime(data.sys.sunset)
    },
    {
      icon: '☀️',
      label: 'Tageslänge',
      value: `${daylightHours}h ${daylightMinutes}min`
    },
    {
      icon: '💨',
      label: 'Wind',
      value: `${Math.round(data.wind.speed * 3.6)} km/h ${getWindDirection(data.wind.deg || 0)}`
    },
    {
      icon: '🌬️',
      label: 'Böen',
      value: data.wind.gust ? `${Math.round(data.wind.gust * 3.6)} km/h` : '–'
    },
    {
      icon: '💧',
      label: 'Luftfeuchtigkeit',
      value: `${data.main.humidity}%`
    },
    {
      icon: '🌡️',
      label: 'Luftdruck',
      value: `${data.main.pressure} hPa`
    },
    {
      icon: '👁️',
      label: 'Sichtweite',
      value: data.visibility >= 10000 ? '> 10 km' : `${(data.visibility / 1000).toFixed(1)} km`
    },
    {
      icon: '🌡️',
      label: 'Min / Max',
      value: `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°`
    },
    {
      icon: '☁️',
      label: 'Bewölkung',
      value: `${data.clouds.all}%`
    },
    {
      icon: '🌊',
      label: 'Meereshöhe',
      value: data.main.sea_level ? `${data.main.sea_level} hPa` : '–'
    },
    {
      icon: '⛰️',
      label: 'Bodendruck',
      value: data.main.grnd_level ? `${data.main.grnd_level} hPa` : '–'
    }
  ];

  return (
    <div className="mb-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-white/90 mb-3 px-1">
        Details
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {details.map((detail, index) => (
          <div
            key={index}
            className="glass rounded-2xl p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{detail.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/50 truncate">
                  {detail.label}
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  {detail.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
