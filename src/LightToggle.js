import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "./firebaseConfig";
import { Lightbulb, Power } from 'lucide-react';

const lightIds = ["light1", "light2", "light3", "light4", "light5"];
const roomNames = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office"];
const lightColors = [
  { 
    bg: "from-blue-400 to-blue-600", 
    glow: "shadow-blue-500/50",
    text: "blue",
    brightness: "bg-gradient-to-r from-blue-400 to-blue-600"
  },
  { 
    bg: "from-purple-400 to-purple-600", 
    glow: "shadow-purple-500/50",
    text: "purple",
    brightness: "bg-gradient-to-r from-purple-400 to-purple-600"
  },
  { 
    bg: "from-green-400 to-green-600", 
    glow: "shadow-green-500/50",
    text: "green",
    brightness: "bg-gradient-to-r from-green-400 to-green-600"
  },
  { 
    bg: "from-orange-400 to-orange-600", 
    glow: "shadow-orange-500/50",
    text: "orange",
    brightness: "bg-gradient-to-r from-orange-400 to-orange-600"
  },
  { 
    bg: "from-pink-400 to-pink-600", 
    glow: "shadow-pink-500/50",
    text: "pink",
    brightness: "bg-gradient-to-r from-pink-400 to-pink-600"
  }
];

function LightToggle({ isDarkMode, onLightsChange }) {
  const [lights, setLights] = useState({});
  const [brightnessLevels, setBrightnessLevels] = useState({});

  useEffect(() => {
    lightIds.forEach((id) => {
      const lightRef = ref(db, `devices/${id}`);
      onValue(lightRef, (snapshot) => {
        setLights((prev) => ({
          ...prev,
          [id]: snapshot.val()
        }));
      });
    });

    // Initialize random brightness levels
    const initialBrightness = {};
    lightIds.forEach(id => {
      initialBrightness[id] = Math.floor(Math.random() * 40 + 60);
    });
    setBrightnessLevels(initialBrightness);
  }, []);

  // Update parent component with lights count
  useEffect(() => {
    const lightsOn = Object.values(lights).filter(state => state === "on").length;
    onLightsChange(lightsOn);
  }, [lights, onLightsChange]);

  const toggleLight = (id) => {
    const currentState = lights[id];
    const newState = currentState === "on" ? "off" : "on";
    const lightRef = ref(db, `devices/${id}`);
    set(lightRef, newState);

    // Update brightness when turning on
    if (newState === "on") {
      setBrightnessLevels(prev => ({
        ...prev,
        [id]: Math.floor(Math.random() * 40 + 60)
      }));
    }
  };

  const toggleAllLights = () => {
    const lightsOn = Object.values(lights).filter(state => state === "on").length;
    const totalLights = lightIds.length;
    const newState = lightsOn === totalLights ? "off" : "on";
    
    lightIds.forEach(id => {
      const lightRef = ref(db, `devices/${id}`);
      set(lightRef, newState);
      
      if (newState === "on") {
        setBrightnessLevels(prev => ({
          ...prev,
          [id]: Math.floor(Math.random() * 40 + 60)
        }));
      }
    });
  };

  const totalLightsOn = Object.values(lights).filter(state => state === "on").length;
  const allLightsOn = totalLightsOn === lightIds.length;

  return (
    <div className="space-y-8">
      {/* Master Control */}
      <div className="w-full">
        <button
          onClick={toggleAllLights}
          className={`w-full p-6 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-102 active:scale-98 ${
            allLightsOn
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25'
              : 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/25'
          } shadow-2xl`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Power className="h-6 w-6" />
            <span>
              {allLightsOn ? "All Lights ON" : "Turn All Lights ON"}
            </span>
          </div>
        </button>
      </div>

      {/* Light Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lightIds.map((id, index) => {
          const isOn = lights[id] === "on";
          const roomName = roomNames[index];
          const colorScheme = lightColors[index];
          const brightness = brightnessLevels[id] || 75;

          return (
            <div
              key={id}
              className={`relative p-6 rounded-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                isDarkMode ? 'bg-gray-800/50 backdrop-blur-lg' : 'bg-white/80 backdrop-blur-lg'
              } shadow-xl border ${
                isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
              } ${
                isOn ? `${colorScheme.glow} shadow-2xl` : ''
              }`}
            >
              {/* Glow Effect */}
              {isOn && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${colorScheme.bg} opacity-10 rounded-3xl transition-opacity duration-300`}
                />
              )}

              <div className="relative z-10">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isOn 
                          ? `bg-gradient-to-r ${colorScheme.bg} transform scale-110` 
                          : isDarkMode 
                            ? 'bg-gray-700' 
                            : 'bg-gray-200'
                      }`}
                    >
                      <Lightbulb className={`h-5 w-5 ${
                        isOn ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {roomName}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Smart Light
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    isOn 
                      ? 'bg-green-100 text-green-800 shadow-green-200' 
                      : 'bg-red-100 text-red-800 shadow-red-200'
                  }`}>
                    {isOn ? "ON" : "OFF"}
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => toggleLight(id)}
                  className={`w-full h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-102 active:scale-98 mb-4 ${
                    isOn 
                      ? `bg-gradient-to-r ${colorScheme.bg} shadow-lg` 
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOn ? 'bg-white shadow-lg transform rotate-360 scale-110' : isDarkMode ? 'bg-gray-600' : 'bg-white'
                    }`}
                    style={{
                      animation: isOn ? 'spin 0.3s ease-in-out' : 'none'
                    }}
                  >
                    <Power className={`h-6 w-6 ${
                      isOn ? 'text-gray-800' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                </button>

                {/* Brightness Slider (Animated when ON) */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOn ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Brightness
                    </span>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {brightness}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-full rounded-full ${colorScheme.brightness} transition-all duration-500`}
                      style={{ width: `${brightness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default LightToggle;