export default function WeatherDescription({ data, forecast }) {
  if (!data) return null;

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = Math.round(data.wind.speed * 3.6); // m/s to km/h
  const weatherId = data.weather[0].id;
  const description = data.weather[0].description;
  const cityName = data.name;

  // Time of day
  const now = Date.now() / 1000;
  const isDay = now > data.sys.sunrise && now < data.sys.sunset;
  const timeOfDay = isDay ? 'Tagsüber' : 'Nachts';

  // Temperature description
  let tempDesc = '';
  if (temp < 0) {
    tempDesc = 'eisig kalt';
  } else if (temp < 5) {
    tempDesc = 'sehr kalt';
  } else if (temp < 10) {
    tempDesc = 'kalt';
  } else if (temp < 15) {
    tempDesc = 'kühl';
  } else if (temp < 20) {
    tempDesc = 'mild';
  } else if (temp < 25) {
    tempDesc = 'angenehm warm';
  } else if (temp < 30) {
    tempDesc = 'warm';
  } else {
    tempDesc = 'heiß';
  }

  // Feels like difference
  let feelsLikeText = '';
  const feelsDiff = feelsLike - temp;
  if (Math.abs(feelsDiff) >= 3) {
    feelsLikeText = feelsDiff > 0
      ? `, fühlt sich aber wärmer an (${feelsLike}°)`
      : `, fühlt sich aber kälter an (${feelsLike}°)`;
  }

  // Weather condition text
  let conditionText = '';
  if (weatherId >= 200 && weatherId < 300) {
    conditionText = 'Es gibt Gewitter. Bleib besser drinnen!';
  } else if (weatherId >= 300 && weatherId < 400) {
    conditionText = 'Leichter Nieselregen fällt. Ein Regenschirm wäre praktisch.';
  } else if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 500) {
      conditionText = 'Es regnet leicht.';
    } else if (weatherId <= 502) {
      conditionText = 'Es regnet. Nimm einen Regenschirm mit!';
    } else {
      conditionText = 'Es regnet stark. Am besten drinnen bleiben.';
    }
  } else if (weatherId >= 600 && weatherId < 700) {
    conditionText = 'Es schneit! Zieh dich warm an.';
  } else if (weatherId >= 700 && weatherId < 800) {
    conditionText = 'Die Sicht ist eingeschränkt durch Nebel oder Dunst.';
  } else if (weatherId === 800) {
    conditionText = isDay
      ? 'Klarer Himmel und Sonnenschein. Perfektes Wetter!'
      : 'Klarer Himmel mit Sternen.';
  } else if (weatherId === 801) {
    conditionText = 'Nur wenige Wolken am Himmel.';
  } else if (weatherId <= 803) {
    conditionText = 'Der Himmel ist teilweise bewölkt.';
  } else {
    conditionText = 'Der Himmel ist stark bewölkt.';
  }

  // Wind description
  let windText = '';
  if (windSpeed < 5) {
    windText = 'Es ist windstill.';
  } else if (windSpeed < 20) {
    windText = 'Ein leichter Wind weht.';
  } else if (windSpeed < 40) {
    windText = 'Es ist windig heute.';
  } else {
    windText = 'Achtung: Starker Wind!';
  }

  // Humidity advice
  let humidityText = '';
  if (humidity > 80) {
    humidityText = 'Die Luftfeuchtigkeit ist sehr hoch.';
  } else if (humidity < 30) {
    humidityText = 'Die Luft ist sehr trocken.';
  }

  // Clothing recommendation
  let clothingTip = '';
  if (temp < 5) {
    clothingTip = '🧥 Winterjacke empfohlen';
  } else if (temp < 15) {
    clothingTip = '🧥 Jacke empfohlen';
  } else if (temp < 20) {
    clothingTip = '👕 Leichte Jacke oder Pullover';
  } else {
    clothingTip = '👕 T-Shirt Wetter';
  }

  if (weatherId >= 500 && weatherId < 600) {
    clothingTip += ' + ☔ Regenschirm';
  }

  // Tomorrow's forecast summary
  let tomorrowText = '';
  if (forecast && forecast.length > 0) {
    const tomorrow = forecast[0];
    const tomorrowTemp = Math.round(tomorrow.main.temp);
    const tomorrowDesc = tomorrow.weather[0].description;
    tomorrowText = `Morgen wird es ${tomorrowDesc} bei ${tomorrowTemp}°C.`;
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        📝 Wetterbericht für {cityName}
      </h3>

      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>
          <strong>{timeOfDay}</strong> ist es {tempDesc} mit <strong>{temp}°C</strong>{feelsLikeText}.
        </p>

        <p>{conditionText}</p>

        <p>{windText} {humidityText}</p>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-white">{clothingTip}</p>
        </div>

        {tomorrowText && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm">
              <strong>Ausblick:</strong> {tomorrowText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
