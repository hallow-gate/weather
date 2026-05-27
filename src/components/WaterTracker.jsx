// src/components/WaterTracker.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplet, Plus, Minus, RotateCcw, Trophy, Flame, ThermometerSun, Sparkles } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0)
  const [baseGoal, setBaseGoal] = useState(8)
  const [weather, setWeather] = useState(null)
  const [streak, setStreak] = useState(0)
  const [lastCompletedDate, setLastCompletedDate] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('waterGlasses')
    const savedDate = localStorage.getItem('waterDate')
    const today = new Date().toDateString()
    const savedStreak = localStorage.getItem('waterStreak')
    const savedLastCompleted = localStorage.getItem('lastCompletedDate')
    
    if (savedDate === today && saved) {
      setGlasses(parseInt(saved))
    } else {
      setGlasses(0)
      localStorage.setItem('waterDate', today)
      localStorage.setItem('waterGlasses', '0')
    }
    
    if (savedStreak) setStreak(parseInt(savedStreak))
    if (savedLastCompleted) setLastCompletedDate(savedLastCompleted)
    
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    const savedLocation = JSON.parse(localStorage.getItem('userLocation'))
    if (savedLocation) {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${savedLocation.lat}&longitude=${savedLocation.lon}&current_weather=true`
        )
        const data = await response.json()
        setWeather(data.current_weather)
      } catch (err) {
        console.error('Weather fetch failed')
      }
    }
  }

  const getAdjustedGoal = () => {
    let adjusted = baseGoal
    if (weather?.temperature >= 35) adjusted += 3
    else if (weather?.temperature >= 30) adjusted += 2
    else if (weather?.temperature >= 25) adjusted += 1
    else if (weather?.temperature <= 5) adjusted -= 1
    return Math.max(adjusted, 4)
  }

  const adjustedGoal = getAdjustedGoal()
  const progress = Math.min((glasses / adjustedGoal) * 100, 100)
  const isGoalMet = glasses >= adjustedGoal

  useEffect(() => {
    if (isGoalMet && glasses > 0) {
      const today = new Date().toDateString()
      if (lastCompletedDate !== today) {
        const newStreak = streak + 1
        setStreak(newStreak)
        localStorage.setItem('waterStreak', newStreak.toString())
        localStorage.setItem('lastCompletedDate', today)
        setLastCompletedDate(today)
        
        // Celebratory vibration if supported
        if (navigator.vibrate) navigator.vibrate(200)
      }
    } else if (glasses < adjustedGoal && lastCompletedDate === new Date().toDateString()) {
      // Reset streak if goal not met by end of day (handled in reset logic)
    }
  }, [glasses, adjustedGoal, isGoalMet])

  const addGlass = () => {
    const newGlasses = glasses + 1
    setGlasses(newGlasses)
    localStorage.setItem('waterGlasses', newGlasses.toString())
    
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50)
  }

  const removeGlass = () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1
      setGlasses(newGlasses)
      localStorage.setItem('waterGlasses', newGlasses.toString())
      if (navigator.vibrate) navigator.vibrate(30)
    }
  }

  const resetToday = () => {
    setGlasses(0)
    localStorage.setItem('waterGlasses', '0')
    if (navigator.vibrate) navigator.vibrate(100)
  }

  const getHydrationTip = () => {
    const tips = [
      { emoji: '💧', text: 'Start your day with a glass of water' },
      { emoji: '🍋', text: 'Add lemon for flavor and vitamin C' },
      { emoji: '⏰', text: 'Set reminders every hour to drink' },
      { emoji: '🏃', text: 'Drink extra when exercising' },
      { emoji: '📱', text: 'Track consistently for better habits' }
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  const tip = getHydrationTip()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Streak */}
      <motion.div className="glass rounded-3xl p-6 text-center" whileHover={{ scale: 1.02 }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-full">
            <Trophy size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{streak} day streak</span>
          </div>
          <button onClick={resetToday} className="p-2 rounded-full hover:bg-white/10 transition">
            <RotateCcw size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div style={{ width: 140, height: 140 }}>
            <CircularProgressbar
              value={progress}
              text={`${Math.round(progress)}%`}
              styles={buildStyles({
                textSize: '24px',
                pathColor: `url(#grad)`,
                textColor: '#6366f1',
                trailColor: 'rgba(255,255,255,0.2)',
                pathTransitionDuration: 0.5,
              })}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="flex justify-center gap-8 mb-4">
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{glasses}</p>
            <p className="text-xs text-gray-500">Glasses</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">{adjustedGoal}</p>
            <p className="text-xs text-gray-500">Goal</p>
          </div>
        </div>

        {/* Weather Adjustment Notice */}
        {weather && weather.temperature >= 25 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl bg-orange-500/20">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm text-orange-600 dark:text-orange-400">
              +{weather.temperature >= 30 ? (weather.temperature >= 35 ? 3 : 2) : 1} glasses for hot weather!
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Glass Grid */}
      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Droplet size={20} className="text-blue-500" />
          Today's Glasses
        </h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {Array.from({ length: Math.min(adjustedGoal, 12) }).map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => i < glasses ? removeGlass() : addGlass()}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 ${
                i < glasses 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {i < glasses ? (
                <Droplet size={28} fill="white" />
              ) : (
                <Droplet size={28} />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addGlass}
            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={20} /> Add Glass
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={removeGlass}
            className="px-6 py-4 bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
          >
            <Minus size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Hydration Tip */}
      <motion.div className="glass rounded-3xl p-6" whileHover={{ scale: 1.02 }}>
        <div className="flex items-center gap-3">
          <div className="text-4xl">{tip.emoji}</div>
          <div>
            <p className="text-xs text-purple-500 font-semibold uppercase tracking-wider">Hydration Tip</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{tip.text}</p>
          </div>
        </div>
      </motion.div>

      {/* Goal Celebration */}
      <AnimatePresence>
        {isGoalMet && glasses === adjustedGoal && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-center">
              <div className="text-5xl mb-2">🎉</div>
              <p className="text-xl font-bold">Goal Achieved!</p>
              <p className="text-sm">Great job staying hydrated!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default WaterTracker
