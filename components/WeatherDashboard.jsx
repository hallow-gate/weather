// components/WeatherDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationDisplay from './LocationDisplay';
import WeatherDisplay from './WeatherDisplay';
import WeatherTips from './WeatherTips';

const WeatherDashboard = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day');

  useEffect(() => {
    getLocationAndWeather();
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        
        const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (!savedLocation || 
            Math.abs(savedLocation.lat - newCoords.lat) > 0.01 || 
            Math.abs(savedLocation.lon - newCoords.lon) > 0.01) {
          localStorage.setItem('userLocation', JSON.stringify(newCoords));
          fetchWeatherData(newCoords.lat, newCoords.lon);
          reverseGeocode(newCoords.lat, newCoords.lon);
        }
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getLocationAndWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setLocation(coords);
        localStorage.setItem('userLocation', JSON.stringify(coords));
        fetchWeatherData(coords.lat, coords.lon);
        reverseGeocode(coords.lat, coords.lon);
      },
      (error) => {
        const savedLocation = JSON.parse(localStorage.getItem('userLocation'));
        if (savedLocation) {
          setLocation(savedLocation);
          fetchWeatherData(savedLocation.lat, savedLocation.lon);
          reverseGeocode(savedLocation.lat, savedLocation.lon);
        } else {
          setError('Unable to retrieve your location. Please enable location services.');
          setLoading(false);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      setWeather(response.data);
      
      const sunrise = new Date(response.data.daily.sunrise[0]);
      const sunset = new Date(response.data.daily.sunset[0]);
      const now = new Date();
      
      const dawnStart = new Date(sunrise.getTime() - 30 * 60000);
      const dawnEnd = new Date(sunrise.getTime() + 30 * 60000);
      const duskStart = new Date(sunset.getTime() - 30 * 60000);
      const duskEnd = new Date(sunset.getTime() + 30 * 60000);
      
      if (now >= dawnStart && now <= dawnEnd) {
        setTimeOfDay('dawn');
        document.body.className = 'dawn';
      } else if (now >= duskStart && now <= duskEnd) {
        setTimeOfDay('dusk');
        document.body.className = 'dusk';
      } else if (now > sunrise && now < sunset) {
        setTimeOfDay('day');
        document.body.className = 'day';
      } else {
        setTimeOfDay('night');
        document.body.className = 'night';
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      
      const address = response.data.address;
      let placeName = '';
      
      if (address.barangay) {
        placeName = address.barangay;
      } else if (address.village) {
        placeName = address.village;
      } else if (address.suburb) {
        placeName = address.suburb;
      } else if (address.town) {
        placeName = address.town;
      } else if (address.municipality) {
        placeName = address.municipality;
      } else if (address.city) {
        placeName = address.city;
      }
      
      if (address.city && placeName !== address.city) {
        placeName += `, ${address.city}`;
      }
      
      setPlaceName(placeName || 'Location found');
    } catch (err) {
      console.error('Geocoding error:', err);
      setPlaceName('Location detected');
    }
  };

  if (loading) {
    return (
      <div className="weather-dashboard glass-card">
        <div className="loading-spinner"></div>
        <p>Detecting your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-dashboard glass-card">
        <p className="error-message">{error}</p>
        <button onClick={getLocationAndWeather} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="weather-dashboard glass-card">
      <LocationDisplay placeName={placeName} location={location} />
      {weather && <WeatherDisplay weather={weather} timeOfDay={timeOfDay} />}
      {weather && <WeatherTips weather={weather} />}
    </div>
  );
};

export default WeatherDashboard;
