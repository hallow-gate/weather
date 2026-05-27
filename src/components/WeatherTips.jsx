// components/WeatherTips.js
import React from 'react';
import './WeatherTips.css';

const WeatherTips = ({ weather }) => {
  const temp = weather.current_weather.temperature;
  
  const getTips = () => {
    const tips = [];
    
    if (temp >= 30) {
      tips.push({
        message: 'Drink plenty of water to stay hydrated',
        type: 'hot'
      });
      tips.push({
        message: 'Avoid direct sun exposure between 10 AM and 4 PM',
        type: 'hot'
      });
    } else if (temp >= 25) {
      tips.push({
        message: 'Stay hydrated and take breaks in the shade',
        type: 'warm'
      });
    } else if (temp <= 15) {
      tips.push({
        message: 'Keep warm and wear layered clothing',
        type: 'cold'
      });
    } else if (temp <= 5) {
      tips.push({
        message: 'Extreme cold alert: Stay indoors if possible',
        type: 'cold'
      });
    }
    
    if (weather.current_weather.weathercode >= 51 && weather.current_weather.weathercode <= 65) {
      tips.push({
        message: 'Carry an umbrella, rain expected',
        type: 'rain'
      });
    }
    
    return tips;
  };

  const tips = getTips();

  if (tips.length === 0) return null;

  return (
    <div className="weather-tips">
      <h3 className="tips-title">Health & Safety Tips</h3>
      <div className="tips-list">
        {tips.map((tip, index) => (
          <div key={index} className={`tip-item tip-${tip.type}`}>
            <span className="tip-icon">
              {tip.type === 'hot' && <HotIcon />}
              {tip.type === 'warm' && <WarmIcon />}
              {tip.type === 'cold' && <ColdIcon />}
              {tip.type === 'rain' && <RainIcon />}
            </span>
            <p className="tip-message">{tip.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const HotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.24 2 7 4.24 7 7c0 3.53 5 11 5 11s5-7.47 5-11c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const WarmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5"/>
  </svg>
);

const ColdIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L8 6h3v5H6V8l-4 4 4 4v-3h5v5H8l4 4 4-4h-3v-5h5v3l4-4-4-4v3h-5V6h3l-4-4z"/>
  </svg>
);

const RainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.35 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"/>
  </svg>
);

export default WeatherTips;
