import { useState } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'DEIN_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function useWeather() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentRes = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=de`
      );

      if (!currentRes.ok) throw new Error('Fehler beim Laden der Wetterdaten');

      const currentData = await currentRes.json();
      setCurrentWeather(currentData);

      // Fetch forecast (5 days, 3-hour intervals = 40 entries)
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=de`
      );

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();

        // Hourly: next 24 hours (8 x 3h = 24h)
        const hourly = forecastData.list.slice(0, 8);
        setHourlyForecast(hourly);

        // Daily: get one entry per day at 12:00 (or closest)
        const dailyMap = new Map();
        forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);

          // Prefer 12:00 entries, but store any if none exists
          if (!dailyMap.has(date) || hour === 12) {
            dailyMap.set(date, item);
          }
        });

        // Convert to array and take up to 7 days
        const dailyForecast = Array.from(dailyMap.values()).slice(0, 7);
        setForecast(dailyForecast);
      }
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
      setHourlyForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const currentRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=de`
      );

      if (!currentRes.ok) {
        if (currentRes.status === 404) throw new Error('Stadt nicht gefunden');
        if (currentRes.status === 401) throw new Error('Ungültiger API-Key');
        throw new Error('Fehler beim Laden der Wetterdaten');
      }

      const currentData = await currentRes.json();
      setCurrentWeather(currentData);

      // Fetch forecast
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=de`
      );

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();

        const hourly = forecastData.list.slice(0, 8);
        setHourlyForecast(hourly);

        const dailyMap = new Map();
        forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);

          if (!dailyMap.has(date) || hour === 12) {
            dailyMap.set(date, item);
          }
        });

        const dailyForecast = Array.from(dailyMap.values()).slice(0, 7);
        setForecast(dailyForecast);
      }
    } catch (err) {
      setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
      setHourlyForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByGeolocation = async () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchByCoords(position.coords.latitude, position.coords.longitude);
        },
        async (err) => {
          // If browser geolocation fails, try IP-based location
          console.log('Browser geolocation failed, trying IP-based...');
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.latitude && ipData.longitude) {
                fetchByCoords(ipData.latitude, ipData.longitude);
                return;
              }
            }
          } catch (ipErr) {
            console.error('IP geolocation also failed');
          }

          setLoading(false);
          switch (err.code) {
            case 1:
              setError('Standortzugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.');
              break;
            case 2:
              setError('Standort nicht verfügbar. Versuche es später erneut.');
              break;
            case 3:
              setError('Zeitüberschreitung bei Standortabfrage.');
              break;
            default:
              setError('Standort konnte nicht ermittelt werden.');
          }
        },
        {
          enableHighAccuracy: true,  // GPS statt IP
          timeout: 10000,
          maximumAge: 60000  // Cache für 1 Minute
        }
      );
    } else {
      // No browser geolocation, use IP-based
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
            fetchByCoords(ipData.latitude, ipData.longitude);
            return;
          }
        }
        throw new Error('IP location failed');
      } catch (err) {
        setLoading(false);
        setError('Standort konnte nicht ermittelt werden.');
      }
    }
  };

  return {
    loading,
    error,
    currentWeather,
    forecast,
    hourlyForecast,
    fetchWeather,
    fetchByGeolocation
  };
}
