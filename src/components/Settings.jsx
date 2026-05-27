// src/components/Settings.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Sun, Trash2, Database, Share2, HelpCircle, Mail, Shield } from 'lucide-react'

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [reminderInterval, setReminderInterval] = useState(60)

  useEffect(() => {
    const saved = localStorage.getItem('settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setNotifications(settings.notifications ?? true)
      setReminderInterval(settings.reminderInterval ?? 60)
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      reminderInterval
    }))
  }

  const clearAllData = () => {
    if (confirm('Are you sure? This will delete all your hydration history.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Bell size={20} className="text-purple-500" />
          Notifications
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Enable Reminders</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => {
                setNotifications(e.target.checked)
                saveSettings()
              }}
              className="toggle toggle-primary"
            />
          </label>
          {notifications && (
            <div>
              <label className="text-gray-700 dark:text-gray-300 text-sm">Reminder Interval (minutes)</label>
              <select
                value={reminderInterval}
                onChange={(e) => {
                  setReminderInterval(parseInt(e.target.value))
                  saveSettings()
                }}
                className="mt-2 w-full p-3 rounded-xl bg-white/10 border border-white/20 text-gray-800 dark:text-white"
              >
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
                <option value={120}>Every 2 hours</option>
                <option value={180}>Every 3 hours</option>
              </select>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Database size={20} className="text-purple-500" />
          Data Management
        </h3>
        <button
          onClick={clearAllData}
          className="w-full p-3 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/30 transition"
        >
          <Trash2 size={18} /> Clear All Data
        </button>
      </motion.div>

      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle size={20} className="text-purple-500" />
          About
        </h3>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-between">
            <span>Version</span>
            <span className="font-semibold">2.0.0</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Made with</span>
            <span className="font-semibold">❤️ for health</span>
          </p>
          <p className="text-sm text-center mt-4">
            Smart hydration tracking powered by weather data
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Settings
