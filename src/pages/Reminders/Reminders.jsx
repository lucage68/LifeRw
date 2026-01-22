import React from 'react'
import { Bell, Plus, Trash2, CheckCircle, Clock, AlertTriangle, Calendar, RotateCcw } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Reminders = () => {
  const [reminders, setReminders] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [date, setDate] = React.useState('')
  const [time, setTime] = React.useState('')
  const [repeat, setRepeat] = React.useState('none')
  const [notificationPermission, setNotificationPermission] = React.useState('default')
  const { t } = useTranslation()

  // Request notification permission
  React.useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission)
        })
      }
    }

    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('liferw-reminders')
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }

    // Check for due reminders every minute
    const interval = setInterval(checkDueReminders, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkDueReminders = () => {
    const now = new Date()
    reminders.forEach(reminder => {
      if (!reminder.completed && !reminder.notified) {
        const reminderTime = new Date(reminder.datetime)
        const timeDiff = reminderTime - now
        
        // Notify if reminder is due (within next minute)
        if (timeDiff > 0 && timeDiff <= 60000) {
          showNotification(reminder)
          // Mark as notified
          const updatedReminders = reminders.map(r =>
            r.id === reminder.id ? { ...r, notified: true } : r
          )
          setReminders(updatedReminders)
          localStorage.setItem('liferw-reminders', JSON.stringify(updatedReminders))
        }
      }
    })
  }

  const showNotification = (reminder) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ LifeRw Reminder', {
        body: reminder.title,
        icon: '/src/assets/logo.png',
        tag: reminder.id
      })
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission)
        if (permission === 'granted') {
          new Notification('🔔 Notifications Enabled', {
            body: t.notificationsEnabled,
            icon: '/src/assets/logo.png'
          })
        }
      })
    }
  }

  // Save reminders to localStorage
  const saveReminders = (updatedReminders) => {
    setReminders(updatedReminders)
    localStorage.setItem('liferw-reminders', JSON.stringify(updatedReminders))
  }

  const addReminder = () => {
    if (!title.trim() || !date || !time) return

    const reminderDateTime = new Date(`${date}T${time}`)
    
    const reminder = {
      id: Date.now(),
      title: title.trim(),
      datetime: reminderDateTime.toISOString(),
      repeat: repeat,
      completed: false,
      notified: false,
      createdAt: new Date().toISOString()
    }

    const updatedReminders = [reminder, ...reminders]
    saveReminders(updatedReminders)
    
    // Clear form
    setTitle('')
    setDate('')
    setTime('')
    setRepeat('none')
  }

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id)
    saveReminders(updatedReminders)
  }

  const toggleReminder = (id) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    )
    saveReminders(updatedReminders)
  }

  const clearCompleted = () => {
    const updatedReminders = reminders.filter(reminder => !reminder.completed)
    saveReminders(updatedReminders)
  }

  const getReminderStatus = (reminder) => {
    const now = new Date()
    const reminderDate = new Date(reminder.datetime)
    
    if (reminder.completed) return 'completed'
    if (reminderDate < now) return 'overdue'
    if ((reminderDate - now) < 3600000) return 'soon' // Less than 1 hour
    return 'upcoming'
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      overdue: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400', 
      soon: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
      upcoming: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
    }
    return colors[status]
  }

  const getStatusIcon = (status) => {
    const icons = {
      completed: <CheckCircle size={16} />,
      overdue: <AlertTriangle size={16} />,
      soon: <Clock size={16} />,
      upcoming: <Calendar size={16} />
    }
    return icons[status]
  }

  const getStatusText = (status) => {
    const texts = {
      completed: t.completed,
      overdue: t.overdue,
      soon: t.dueSoon,
      upcoming: t.upcoming
    }
    return texts[status]
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeUntil = (dateString) => {
    const now = new Date()
    const reminderDate = new Date(dateString)
    const diff = reminderDate - now
    
    if (diff < 0) return t.pastDue
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${t.in} ${days}d ${hours}h`
    if (hours > 0) return `${t.in} ${hours}h ${minutes}m`
    return `${t.in} ${minutes}m`
  }

  const upcomingReminders = reminders.filter(r => !r.completed).slice(0, 3)
  const completedCount = reminders.filter(r => r.completed).length
  const overdueCount = reminders.filter(r => getReminderStatus(r) === 'overdue').length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.reminders}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.remindersDesc}
        </p>
      </div>

      {/* Notification Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Bell size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-blue-800 dark:text-blue-400">{t.browserNotifications}</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">
                {notificationPermission === 'granted' 
                  ? '✅ ' + t.enabled
                  : notificationPermission === 'denied'
                  ? '❌ ' + t.blocked
                  : '⚠️ ' + t.notEnabled
                }
              </div>
            </div>
          </div>
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
            >
              <Bell size={16} />
              {t.enable}
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {reminders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">{reminders.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">{t.total}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-400">{upcomingReminders.length}</div>
            <div className="text-sm text-orange-600 dark:text-orange-300">{t.upcoming}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800 dark:text-green-400">{completedCount}</div>
            <div className="text-sm text-green-600 dark:text-green-300">{t.completed}</div>
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
          <Plus size={24} />
          {t.addNewReminder}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.title}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.whatToRemember}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.repeat}</label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="none">{t.noRepeat}</option>
              <option value="daily">{t.daily}</option>
              <option value="weekly">{t.weekly}</option>
              <option value="monthly">{t.monthly}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.date}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.time}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={addReminder}
          disabled={!title.trim() || !date || !time}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
        >
          <Bell size={20} />
          {t.setReminder}
        </button>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-4 flex items-center gap-2">
            <Clock size={24} />
            {t.comingUpSoon}
          </h2>
          <div className="space-y-3">
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      reminder.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                    }`}
                  >
                    {reminder.completed && <CheckCircle size={12} />}
                  </button>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{reminder.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(reminder.datetime)} • {getTimeUntil(reminder.datetime)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Reminders */}
      <div className="space-y-3">
        {reminders.map(reminder => {
          const status = getReminderStatus(reminder)
          return (
            <div
              key={reminder.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                reminder.completed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {reminder.completed && <CheckCircle size={12} />}
                </button>
                
                <div className="flex-1">
                  <div className={`font-semibold ${
                    reminder.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {reminder.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(reminder.datetime)}
                    {repeat !== 'none' && ` • ${t.repeats} ${reminder.repeat}`}
                    {reminder.notified && ' 🔔 ' + t.notified}
                  </div>
                </div>

                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {getStatusText(status)}
                </div>
              </div>

              <button
                onClick={() => deleteReminder(reminder.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-4 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {reminders.length === 0 && (
        <div className="text-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} className="text-blue-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.noReminders}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">{t.addFirstReminder}</p>
        </div>
      )}

      {/* Clear Completed Button */}
      {completedCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={clearCompleted}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Trash2 size={18} />
            {t.clearCompleted} ({completedCount})
          </button>
        </div>
      )}
    </div>
  )
}

export default Reminders