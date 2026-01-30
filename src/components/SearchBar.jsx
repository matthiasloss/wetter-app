import { useState } from 'react';

export default function SearchBar({ onSearch, onGeolocation, loading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={onGeolocation}
        disabled={loading}
        className="p-4 glass rounded-2xl text-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press"
        title="Aktuellen Standort verwenden"
      >
        📍
      </button>
      <div className="flex-1 relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Stadt eingeben..."
          className="w-full px-5 py-4 rounded-2xl glass text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press"
      >
        {loading ? '...' : '🔍'}
      </button>
    </form>
  );
}
