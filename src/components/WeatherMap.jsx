import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function WeatherMap({ lat, lon, cityName, temp, description }) {
  if (!lat || !lon) return null;

  const position = [lat, lon];

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Wetterkarte
      </h3>
      <div className="rounded-xl overflow-hidden shadow-lg h-[300px]">
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            attribution='Weather data &copy; OpenWeatherMap'
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            opacity={0.5}
          />
          <Marker position={position}>
            <Popup>
              <strong>{cityName}</strong><br />
              {Math.round(temp)}°C - {description}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Temperatur-Overlay aktiv
      </p>
    </div>
  );
}
