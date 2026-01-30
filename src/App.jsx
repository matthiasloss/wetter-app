import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import WeatherMap from './components/WeatherMap';
import WeatherAnimation from './components/WeatherAnimation';
import WeatherDescription from './components/WeatherDescription';

function App() {
  const { loading, error, currentWeather, forecast, hourlyForecast, fetchWeather, fetchByGeolocation } = useWeather();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Load saved location or auto-detect on startup
  useEffect(() => {
    const savedCity = localStorage.getItem('weatherLastCity');
    if (savedCity) {
      fetchWeather(savedCity);
    } else {
      // Auto-detect location on first visit
      fetchByGeolocation();
    }
  }, []);

  // Save current city when weather loads
  useEffect(() => {
    if (currentWeather?.name) {
      localStorage.setItem('weatherLastCity', currentWeather.name);
    }
  }, [currentWeather]);

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (city) => {
    fetchWeather(city);
  };

  const toggleFavorite = () => {
    if (!currentWeather) return;
    const city = currentWeather.name;

    if (favorites.includes(city)) {
      setFavorites(favorites.filter(f => f !== city));
    } else {
      setFavorites([...favorites, city]);
    }
  };

  const removeFavorite = (city) => {
    setFavorites(favorites.filter(f => f !== city));
  };

  const isFavorite = currentWeather && favorites.includes(currentWeather.name);
  const isDay = currentWeather
    ? Date.now() / 1000 > currentWeather.sys.sunrise && Date.now() / 1000 < currentWeather.sys.sunset
    : true;

  // Dynamic background based on weather
  const getBackgroundClass = () => {
    if (!currentWeather) return 'from-sky-400 via-blue-500 to-blue-700';

    const weatherId = currentWeather.weather[0].id;

    if (weatherId >= 200 && weatherId < 300) {
      return 'from-slate-800 via-purple-900 to-slate-900'; // Thunder
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'from-slate-600 via-blue-700 to-slate-800'; // Rain
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'from-slate-300 via-blue-300 to-slate-400'; // Snow
    } else if (weatherId >= 700 && weatherId < 800) {
      return 'from-amber-300 via-gray-500 to-slate-600'; // Atmosphere
    } else if (weatherId >= 801) {
      return isDay ? 'from-gray-500 via-slate-600 to-gray-700' : 'from-slate-800 via-slate-900 to-black'; // Clouds
    }

    return isDay ? 'from-sky-400 via-blue-500 to-blue-700' : 'from-indigo-900 via-purple-900 to-slate-900';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBackgroundClass()} transition-all duration-1000 relative overflow-hidden`}>
      {/* Weather Animation Background */}
      {currentWeather && (
        <WeatherAnimation
          weatherId={currentWeather.weather[0].id}
          isDay={isDay}
        />
      )}

      <div className="max-w-lg mx-auto px-5 py-8 relative z-10 safe-area-top safe-area-bottom">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Wetter
          </h1>
        </header>

        <SearchBar
          onSearch={handleSearch}
          onGeolocation={fetchByGeolocation}
          loading={loading}
        />

        {favorites.length > 0 && (
          <Favorites
            favorites={favorites}
            onSelect={handleSearch}
            onRemove={removeFavorite}
          />
        )}

        {error && (
          <div className="glass-dark text-white/90 px-5 py-4 rounded-2xl mb-6 animate-fade-in">
            <p className="flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block text-6xl animate-pulse-slow">☁️</div>
            <p className="text-white/70 mt-6 font-medium">Lade Wetterdaten...</p>
          </div>
        )}

        {!loading && currentWeather && (
          <div className="space-y-4">
            <CurrentWeather
              data={currentWeather}
              onAddFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />

            <WeatherDescription data={currentWeather} forecast={forecast} />

            <WeatherDetails data={currentWeather} />

            <HourlyForecast data={hourlyForecast} />

            <Forecast data={forecast} />

            <WeatherMap
              lat={currentWeather.coord.lat}
              lon={currentWeather.coord.lon}
              cityName={currentWeather.name}
              temp={currentWeather.main.temp}
              description={currentWeather.weather[0].description}
            />
          </div>
        )}

        {!currentWeather && !loading && !error && (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-8xl mb-6 animate-float">🌤️</p>
            <p className="text-white/80 text-lg font-medium">Lade Wetterdaten...</p>
            <p className="text-white/50 text-sm mt-2">Standort wird ermittelt</p>
          </div>
        )}

        <footer className="text-center text-white/40 text-xs mt-10 pb-4">
          <p>Daten von OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
