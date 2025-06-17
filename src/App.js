import LightToggle from './LightToggle';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Sun, 
  Moon, 
  Zap, 
  Wifi, 
  Thermometer, 
  Droplets 
} from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalLightsOn, setTotalLightsOn] = useState(0);
  const [weather] = useState({ temp: 24, humidity: 65, condition: "sunny" });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Create floating particles
  const createParticles = () => {
    return [...Array(15)].map((_, i) => (
      <div
        key={i}
        className={`absolute w-2 h-2 rounded-full ${
          isDarkMode ? 'bg-blue-400/20' : 'bg-blue-500/10'
        } animate-pulse`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${10 + i * 2}s`
        }}
      />
    ));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {createParticles()}
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-2xl ${
              isDarkMode ? 'bg-blue-600/20 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
            } shadow-lg hover:scale-105 transition-transform duration-300`}>
              <Home className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Smart Home
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentTime.toLocaleTimeString()} • {totalLightsOn} lights active
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Weather Widget */}
            <div className={`px-4 py-2 rounded-xl ${
              isDarkMode ? 'bg-gray-800/50 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
            } shadow-lg flex items-center space-x-2 hover:scale-102 transition-transform duration-300`}>
              {weather.condition === "sunny" ? (
                <Sun className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-orange-500'}`} />
              ) : (
                <Moon className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              )}
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {weather.temp}°C
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-800/50 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
              } shadow-lg hover:scale-105 transition-transform duration-300`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Zap, label: "Energy", value: "2.4 kW", color: "text-yellow-500" },
            { icon: Wifi, label: "Connection", value: "Online", color: "text-green-500" },
            { icon: Thermometer, label: "Temperature", value: `${weather.temp}°C`, color: "text-blue-500" },
            { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, color: "text-cyan-500" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
              } shadow-lg border ${
                isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
              } hover:scale-102 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Light Controls Component */}
        <LightToggle 
          isDarkMode={isDarkMode} 
          onLightsChange={setTotalLightsOn}
        />
      </div>
    </div>
  );
}

export default App;