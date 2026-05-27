// components/WeatherDisplay.js
import React from 'react';
import './WeatherDisplay.css';

const WeatherDisplay = ({ weather, timeOfDay }) => {
  const current = weather.current_weather;
  const daily = weather.daily;

  const getWeatherIcon = (code) => {
    const icons = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return icons[code] || 'Unknown';
  };

  const getTimeDisplay = () => {
    switch(timeOfDay) {
      case 'dawn': return 'Dawn';
      case 'dusk': return 'Dusk';
      case 'day': return 'Day';
      case 'night': return 'Night';
      default: return '';
    }
  };

  return (
    <div className="weather-display">
      <div className="time-indicator">
        <span className="time-badge">{getTimeDisplay()}</span>
      </div>
      
      <div className="temperature-display">
        <span className="temperature">{Math.round(current.temperature)}</span>
        <span className="degree">°C</span>
      </div>
      
      <div className="weather-description">
        {getWeatherIcon(current.weathercode)}
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{current.windspeed} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Direction</span>
          <span className="detail-value">{current.winddirection}°</span>
        </div>
      </div>

      <div className="sun-times">
        <div className="sun-item">
          <span className="sun-label">Sunrise</span>
          <span className="sun-value">
            {new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="sun-item">
          <span className="sun-label">Sunset</span>
          <span className="sun-value">
            {new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="temp-range">
        <span className="temp-high">H: {Math.round(daily.temperature_2m_max[0])}°</span>
        <span className="temp-low">L: {Math.round(daily.temperature_2m_min[0])}°</span>
      </div>
    </div>
  );
};

export default WeatherDisplay;
