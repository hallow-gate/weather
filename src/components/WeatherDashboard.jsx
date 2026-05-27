import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, RefreshCw, Wind, Droplet, Sunrise, Sunset, Thermometer, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

const WeatherDashboard = () => {
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [placeName, setPlaceName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    getLocationAndWeather()
  }, [])

  const getLocationAndWeather = async () => {
    setLoading(true)
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        }
        setLocation(coords)
        localStorage.setItem('userLocation', JSON.stringify(coords))
        await fetchWeatherData(coords.lat, coords.lon)
        await reverseGeocode(coords.lat, coords.lon)
        setLoading(false)
      },
      async (err) => {
        const saved = JSON.parse(localStorage.getItem('userLocation'))
        if (saved) {
          setLocation(saved)
          await fetchWeatherData(saved.lat, saved.lon)
          await reverseGeocode(saved.lat, saved.lon)
          setLoading(false)
        } else {
          setError('Unable to get location')
          setLoading(false)
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      )
      setWeather(response.data)
      
      const dailyData = response.data.daily
      const forecastDays = []
      for (let i = 0; i < 5; i++) {
        forecastDays.push({
          day: format(new Date(dailyData.time[i]), 'EEE'),
          high: Math.round(dailyData.temperature_2m_max[i]),
          low: Math.round(dailyData.temperature_2m_min[i]),
          code: dailyData.weathercode[i]
        })
      }
      setForecast(forecastDays)
    } catch (err) {
      console.error('Weather fetch error:', err)
    }
  }

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      )
      const address = response.data.address
      let name = address.city || address.town || address.village || address.suburb || 'Current Location'
      setPlaceName(name)
    } catch (err) {
      setPlaceName('Current Location')
    }
  }

  const getWeatherEmoji = (code) => {
    const weatherMap = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
      45: '🌫️', 48: '🌫️', 51: '🌦️', 61: '🌧️',
      63: '🌧️', 65: '⛈️', 71: '❄️', 73: '❄️',
      75: '❄️', 95: '⛈️'
    }
    return weatherMap[code] || '🌡️'
  }

  const getWeatherDescription = (code) => {
    const descMap = {
      0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
      45: 'Foggy', 48: 'Fog', 51: 'Drizzle', 61: 'Rain',
      63: 'Moderate Rain', 65: 'Heavy Rain', 71: 'Snow', 95: 'Thunderstorm'
    }
    return descMap[code] || 'Unknown'
  }

  const getTempColor = (temp) => {
    if (temp >= 30) return 'text-orange-500'
    if (temp >= 25) return 'text-yellow-500'
    if (temp >= 18) return 'text-green-500'
    if (temp >= 10) return 'text-blue-400'
    return 'text-cyan-300'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">🌤️</span>
          </div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Getting your weather...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
        <button onClick={getLocationAndWeather} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg">
          Try Again 🔄
        </button>
      </div>
    )
  }

  const currentTemp = weather?.current_weather?.temperature
  const tempColor = getTempColor(currentTemp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="glass rounded-3xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
          <MapPin size={18} />
          <span className="text-sm">{placeName}</span>
        </div>
        <div className={`text-7xl font-bold ${tempColor} my-4`}>
          {Math.round(currentTemp)}<span className="text-3xl">°C</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-3xl mb-3">
          <span>{getWeatherEmoji(weather?.current_weather?.weathercode)}</span>
          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
            {getWeatherDescription(weather?.current_weather?.weathercode)}
          </span>
        </div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center">
            <Wind size={20} className="mx-auto text-blue-500 mb-1" />
            <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(weather?.current_weather?.windspeed)} km/h</p>
          </div>
        </div>
      </div>

      {weather?.daily && (
        <div className="glass rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sunrise size={24} className="text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Sunrise</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {format(new Date(weather.daily.sunrise[0]), 'h:mm a')}
              </p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sunset size={24} className="text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Sunset</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {format(new Date(weather.daily.sunset[0]), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Thermometer size={20} className="text-purple-500" />
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {forecast.map((day, idx) => (
            <div key={idx} className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{day.day}</p>
              <div className="text-2xl my-2">{getWeatherEmoji(day.code)}</div>
              <p className={`text-sm font-semibold ${getTempColor(day.high)}`}>{day.high}°</p>
              <p className="text-xs text-gray-500">{day.low}°</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherDashboard
