// components/WaterTracker.js
import React, { useState, useEffect } from 'react';
import './WaterTracker.css';

const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const [goal] = useState(8);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const savedGlasses = localStorage.getItem('waterGlasses');
    const savedDate = localStorage.getItem('waterDate');
    const today = new Date().toDateString();
    
    if (savedDate === today && savedGlasses) {
      setGlasses(parseInt(savedGlasses));
    } else {
      setGlasses(0);
      localStorage.setItem('waterDate', today);
      localStorage.setItem('waterGlasses', '0');
    }

    fetchWeatherForGoal();
  }, []);

  const fetchWeatherForGoal = async () => {
    const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
    if (savedLocation) {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error('Failed to fetch weather for water goal');
      }
    }
  };

  const addGlass = () => {
    const newGlasses = glasses + 1;
    setGlasses(newGlasses);
    localStorage.setItem('waterGlasses', newGlasses.toString());
  };

  const removeGlass = () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1;
      setGlasses(newGlasses);
      localStorage.setItem('waterGlasses', newGlasses.toString());
    }
  };

  const resetGlasses = () => {
    setGlasses(0);
    localStorage.setItem('waterGlasses', '0');
  };

  const getAdjustedGoal = () => {
    if (weather && weather.temperature >= 30) return goal + 2;
    if (weather && weather.temperature >= 25) return goal + 1;
    return goal;
  };

  const adjustedGoal = getAdjustedGoal();
  const progress = Math.min((glasses / adjustedGoal) * 100, 100);

  const renderGlasses = () => {
    const glassElements = [];
    for (let i = 0; i < adjustedGoal; i++) {
      glassElements.push(
        <div 
          key={i} 
          className={`glass-icon ${i < glasses ? 'filled' : ''}`}
          onClick={i < glasses ? removeGlass : addGlass}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill={i < glasses ? '#87CEEB' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M8 2h8l1 18H7L8 2z"/>
            <path d="M7 10h10"/>
          </svg>
        </div>
      );
    }
    return glassElements;
  };

  return (
    <div className="water-tracker glass-card">
      <div className="tracker-header">
        <h2 className="tracker-title">Daily Water Goal</h2>
        <button onClick={resetGlasses} className="reset-button">Reset</button>
      </div>

      <div className="tracker-stats">
        <div className="stat">
          <span className="stat-number">{glasses}</span>
          <span className="stat-label">Glasses</span>
        </div>
        <div className="stat">
          <span className="stat-number">{adjustedGoal}</span>
          <span className="stat-label">Goal</span>
        </div>
        <div className="stat">
          <span className="stat-number">{Math.round(progress)}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {weather && weather.temperature >= 30 && (
        <div className="hot-weather-notice">
          High temperature detected: Goal increased by 2 glasses
        </div>
      )}
      {weather && weather.temperature >= 25 && weather.temperature < 30 && (
        <div className="warm-weather-notice">
          Warm weather: Goal increased by 1 glass
        </div>
      )}

      <div className="glasses-grid">
        {renderGlasses()}
      </div>

      <div className="add-buttons">
        <button onClick={addGlass} className="add-button glass-card">
          + Add Glass
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
