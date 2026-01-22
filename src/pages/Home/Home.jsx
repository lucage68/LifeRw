// src/pages/Home/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Cloud,
  Languages,
  DollarSign,
  Calculator,
  Ruler,
  FileText,
  CheckSquare,
  Clock,
  Settings,
  Plus,
  Sun,
  Moon
} from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Home = () => {
  const { t } = useTranslation()

  // If t is the translations object (not a function), use it directly
  const tools = [
    {
      name: t.weather, // Use dot notation instead of function call
      description: t.weatherDesc,
      path: '/weather',
      icon: <Cloud size={24} />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      iconColor: 'text-white'
    },
    {
      name: t.translate,
      description: t.translateDesc,
      path: '/translate', 
      icon: <Languages size={24} />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
      iconColor: 'text-white'
    },
    {
      name: t.currency,
      description: t.currencyDesc,
      path: '/currency',
      icon: <DollarSign size={24} />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      iconColor: 'text-white'
    },
    {
      name: t.calculator,
      description: t.calculatorDesc,
      path: '/calculator',
      icon: <Calculator size={24} />,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      iconColor: 'text-white'
    },
    {
      name: t.converter,
      description: t.converterDesc,
      path: '/converter',
      icon: <Ruler size={24} />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
      iconColor: 'text-white'
    },
    {
      name: t.notes,
      description: t.notesDesc,
      path: '/notes',
      icon: <FileText size={24} />,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-gradient-to-r from-indigo-500 to-blue-500',
      iconColor: 'text-white'
    },
    {
      name: t.todo,
      description: t.todoDesc,
      path: '/todo',
      icon: <CheckSquare size={24} />,
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-gradient-to-r from-teal-500 to-green-500',
      iconColor: 'text-white'
    },
    {
      name: t.reminders,
      description: t.remindersDesc,
      path: '/reminders', 
      icon: <Clock size={24} />,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-red-500 to-pink-500',
      iconColor: 'text-white'
    },
    {
      name: t.settings,
      description: t.settingsDesc,
      path: '/settings',
      icon: <Settings size={24} />,
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gradient-to-r from-gray-500 to-gray-700',
      iconColor: 'text-white'
    }
  ]

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t.goodMorning
    if (hour < 18) return t.goodAfternoon
    return t.goodEvening
  }

  // Get greeting icon based on time
  const getGreetingIcon = () => {
    const hour = new Date().getHours()
    if (hour < 12) return <Sun size={32} className="text-yellow-500" />
    if (hour < 18) return <Sun size={32} className="text-orange-500" />
    return <Moon size={32} className="text-blue-400" />
  }

  // Get some stats from localStorage
  const getStats = () => {
    const notes = JSON.parse(localStorage.getItem('liferw-notes') || '[]')
    const todos = JSON.parse(localStorage.getItem('liferw-todos') || '[]')
    const reminders = JSON.parse(localStorage.getItem('liferw-reminders') || '[]')
    
    return {
      notesCount: notes.length,
      todosCount: todos.length,
      completedTodos: todos.filter(todo => todo.completed).length,
      upcomingReminders: reminders.filter(r => !r.completed && new Date(r.datetime) > new Date()).length
    }
  }

  const stats = getStats()

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          {getGreetingIcon()}
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              {getGreeting()}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t.welcome}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="text-2xl font-bold">{stats.notesCount}</div>
          <div className="text-blue-100">{t.notesCount}</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="text-2xl font-bold">{stats.todosCount}</div>
          <div className="text-green-100">{t.tasksCount}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="text-2xl font-bold">{stats.completedTodos}</div>
          <div className="text-purple-100">{t.completed}</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="text-2xl font-bold">{stats.upcomingReminders}</div>
          <div className="text-orange-100">{t.remindersCount}</div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          {t.yourTools}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="block bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={tool.iconColor}>
                  {tool.icon}
                </div>
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/notes"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all text-center group"
          >
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText size={32} className="text-blue-500" />
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{t.newNote}</div>
          </Link>
          <Link
            to="/todo"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all text-center group"
          >
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-green-500" />
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{t.addTask}</div>
          </Link>
          <Link
            to="/reminders"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all text-center group"
          >
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clock size={32} className="text-red-500" />
            </div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{t.setReminder}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home