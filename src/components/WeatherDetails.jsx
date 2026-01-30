export default function WeatherDetails({ data }) {
  if (!data) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      icon: '💨',
      label: 'Wind',
      value: `${Math.round(data.wind.speed * 3.6)} km/h`
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
      value: `${(data.visibility / 1000).toFixed(1)} km`
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
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Wetter-Details
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {details.map((detail, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{detail.icon}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {detail.label}
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
