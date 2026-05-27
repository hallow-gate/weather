// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudSun, Droplets, BarChart3, Settings, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import WeatherDashboard from './components/WeatherDashboard'
import WaterTracker from './components/WaterTracker'
import Analytics from './components/Analytics'
import SettingsPage from './components/Settings'  // Renamed import
import { useTheme } from './hooks/useTheme'

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    })
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstall(false)
    setDeferredPrompt(null)
  }

  const tabs = [
    { path: '/', icon: CloudSun, label: 'Weather', color: 'from-blue-500 to-cyan-500' },
    { path: '/water', icon: Droplets, label: 'Hydrate', color: 'from-sky-500 to-blue-600' },
    { path: '/analytics', icon: BarChart3, label: 'Stats', color: 'from-purple-500 to-pink-500' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' },
  ]

  return (
    <div className="min-h-screen transition-all duration-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
            : 'bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100'
        }`} />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Install Button */}
      <AnimatePresence>
        {showInstall && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            onClick={handleInstall}
            className="fixed bottom-24 right-4 z-50 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold"
          >
            📱 Install App
          </motion.button>
        )}
      </AnimatePresence>

      {/* Theme Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full glass text-gray-700 dark:text-white shadow-lg"
      >
        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
      </motion.button>

      {/* Main Content */}
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-6 pb-28">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<WeatherDashboard key="weather" />} />
            <Route path="/water" element={<WaterTracker key="water" />} />
            <Route path="/analytics" element={<Analytics key="analytics" />} />
            <Route path="/settings" element={<SettingsPage key="settings" />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="glass rounded-2xl p-2 flex justify-around items-center shadow-2xl">
          {tabs.map((tab, idx) => {
            const isActive = (idx === 0 && window.location.pathname === '/') || 
                           (tab.path !== '/' && window.location.pathname === tab.path)
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) => `
                  relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300
                  ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} shadow-lg`}
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <tab.icon size={22} className="relative z-10" />
                    <span className="text-xs font-medium relative z-10">{tab.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default App
