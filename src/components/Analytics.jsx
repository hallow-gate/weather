// src/components/Analytics.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Calendar, TrendingUp, Award, Coffee, Battery, Activity } from 'lucide-react'

const Analytics = () => {
  const [weeklyData, setWeeklyData] = useState([])
  const [totalGlasses, setTotalGlasses] = useState(0)
  const [bestDay, setBestDay] = useState(null)
  const [average, setAverage] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const history = []
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let total = 0
    let max = 0
    let maxDay = ''

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      const saved = localStorage.getItem(`waterHistory_${dateStr}`)
      const glasses = saved ? parseInt(saved) : Math.floor(Math.random() * 8) // Demo data
      
      history.push({
        day: days[6 - i],
        glasses: glasses,
        date: dateStr
      })
      total += glasses
      if (glasses > max) {
        max = glasses
        maxDay = days[6 - i]
      }
    }
    
    setWeeklyData(history)
    setTotalGlasses(total)
    setBestDay({ day: maxDay, glasses: max })
    setAverage(Math.round(total / 7))
  }

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e']

  const pieData = weeklyData.map(d => ({ name: d.day, value: d.glasses }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div className="glass rounded-2xl p-4 text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl mb-1">🥤</div>
          <p className="text-2xl font-bold text-purple-600">{totalGlasses}</p>
          <p className="text-xs text-gray-500">Total Glasses</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-4 text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl mb-1">📊</div>
          <p className="text-2xl font-bold text-blue-600">{average}</p>
          <p className="text-xs text-gray-500">Daily Avg</p>
        </motion.div>
        <motion.div className="glass rounded-2xl p-4 text-center" whileHover={{ scale: 1.05 }}>
          <div className="text-2xl mb-1">🏆</div>
          <p className="text-xl font-bold text-yellow-600 truncate">{bestDay?.day || '-'}</p>
          <p className="text-xs text-gray-500">Best Day</p>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BarChart size={20} className="text-purple-500" />
          Weekly Hydration
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="glasses" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <PieChart size={20} className="text-purple-500" />
          Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Insights */}
      <motion.div className="glass rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-purple-500" />
          Health Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span className="flex items-center gap-2"><Coffee size={18} /> Hydration Score</span>
            <span className="font-bold text-purple-500">{Math.round((totalGlasses / (average * 7)) * 100)}%</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span className="flex items-center gap-2"><Battery size={18} /> Energy Impact</span>
            <span className="font-bold text-green-500">+{Math.round(average * 12)} cal/day</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span className="flex items-center gap-2"><TrendingUp size={18} /> Consistency</span>
            <span className="font-bold text-blue-500">{Math.round((weeklyData.filter(d => d.glasses >= 6).length / 7) * 100)}%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Analytics
