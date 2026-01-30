export default function Favorites({ favorites, onSelect, onRemove }) {
  if (favorites.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Favoriten</h3>
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <div
            key={city}
            className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => onSelect(city)}
              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              {city}
            </button>
            <button
              onClick={() => onRemove(city)}
              className="px-3 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors border-l border-gray-200 dark:border-gray-700"
              title="Entfernen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
