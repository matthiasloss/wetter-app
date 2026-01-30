import { useEffect, useState } from 'react';

const animations = {
  rain: {
    particles: 50,
    className: 'rain-drop',
    emoji: null
  },
  snow: {
    particles: 40,
    className: 'snow-flake',
    emoji: '❄️'
  },
  clouds: {
    particles: 5,
    className: 'cloud',
    emoji: '☁️'
  },
  clear: {
    particles: 1,
    className: 'sun',
    emoji: '☀️'
  },
  thunderstorm: {
    particles: 50,
    className: 'rain-drop',
    emoji: null
  }
};

function getWeatherType(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
  if (weatherId >= 300 && weatherId < 600) return 'rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 801) return 'clouds';
  return 'clear';
}

export default function WeatherAnimation({ weatherId, isDay }) {
  const [particles, setParticles] = useState([]);
  const weatherType = getWeatherType(weatherId);
  const config = animations[weatherType];

  useEffect(() => {
    const newParticles = Array.from({ length: config.particles }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2,
      size: 0.5 + Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, [weatherId, config.particles]);

  return (
    <>
      <style>{`
        .weather-animation {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .rain-drop {
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(transparent, rgba(174, 194, 224, 0.8));
          animation: rain-fall linear infinite;
        }

        @keyframes rain-fall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.3; }
        }

        .snow-flake {
          position: absolute;
          animation: snow-fall linear infinite;
          font-size: 1rem;
        }

        @keyframes snow-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.5; }
        }

        .cloud {
          position: absolute;
          font-size: 3rem;
          animation: cloud-float ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes cloud-float {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-10px); }
        }

        .sun {
          position: absolute;
          font-size: 4rem;
          animation: sun-pulse ease-in-out infinite;
          top: 10%;
          right: 10%;
        }

        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.2); }
        }

        .lightning {
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          animation: lightning-flash 4s infinite;
        }

        @keyframes lightning-flash {
          0%, 89%, 91%, 93%, 100% { opacity: 0; }
          90%, 92% { opacity: 0.3; }
        }
      `}</style>

      <div className="weather-animation">
        {weatherType === 'thunderstorm' && <div className="lightning" />}

        {particles.map((p) => (
          <div
            key={p.id}
            className={config.className}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `scale(${p.size})`
            }}
          >
            {config.emoji}
          </div>
        ))}
      </div>
    </>
  );
}
