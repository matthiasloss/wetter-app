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
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const { loading, error, currentWeather, forecast, hourlyForecast, fetchWeather, fetchByGeolocation } = useWeather();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Load saved location on startup
  useEffect(() => {
    const savedCity = localStorage.getItem('weatherLastCity');
    if (savedCity) {
      fetchWeather(savedCity);
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

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors relative overflow-hidden">
      {/* Weather Animation Background */}
      {currentWeather && (
        <WeatherAnimation
          weatherId={currentWeather.weather[0].id}
          isDay={isDay}
        />
      )}

      <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Wetter App
        </h1>

        <SearchBar
          onSearch={handleSearch}
          onGeolocation={fetchByGeolocation}
          loading={loading}
        />

        <Favorites
          favorites={favorites}
          onSelect={handleSearch}
          onRemove={removeFavorite}
        />

        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">🌀</div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Lade Wetterdaten...</p>
          </div>
        )}

        {!loading && currentWeather && (
          <>
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
          </>
        )}

        {!currentWeather && !loading && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <p className="text-6xl mb-4">🌤️</p>
            <p>Gib eine Stadt ein oder nutze deinen Standort</p>
            <p className="text-sm mt-2">Klicke auf 📍 für automatische Standorterkennung</p>
          </div>
        )}

        <footer className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
          <p>Daten von OpenWeatherMap</p>
          <p className="mt-1 text-xs">Installiere die App: Browser-Menü → "Zum Startbildschirm"</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
