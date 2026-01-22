import React from 'react'
import { Search, MapPin, Cloud, CloudRain, Sun, CloudSnow, Wind, Eye, Droplets, Gauge, Thermometer, Sunrise, Sunset, Navigation } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Weather = () => {
  const [weatherData, setWeatherData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [city, setCity] = React.useState('Kigali')
  const [searchInput, setSearchInput] = React.useState('')
  const [searchHistory, setSearchHistory] = React.useState([])
  const [unit, setUnit] = React.useState('metric')
  const { t } = useTranslation()

  // Load search history from localStorage on component mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
    fetchWeather('Kigali')
  }, [])

  const fetchWeather = async (cityName = 'Kigali') => {
    setLoading(true)
    setError('')
    
    try {
      const API_KEY = 'faad2d3955f7c14229b60e077cd0beb1'
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error(t.cityNotFoundTry)
      }
      
      const data = await response.json()
      setWeatherData(data)
      setCity(cityName)
      
      // Add to search history
      addToSearchHistory(cityName, data)
      
      setSearchInput('')
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const addToSearchHistory = (cityName, weatherData) => {
    const newSearch = {
      city: cityName,
      country: weatherData.sys.country,
      timestamp: new Date().toISOString(),
      temperature: Math.round(weatherData.main.temp),
      weather: weatherData.weather[0].main
    }
    
    setSearchHistory(prev => {
      // Remove if already exists (to avoid duplicates)
      const filtered = prev.filter(item => 
        !(item.city === newSearch.city && item.country === newSearch.country)
      )
      
      // Add to beginning and limit to 10 items
      const updatedHistory = [newSearch, ...filtered].slice(0, 10)
      
      // Save to localStorage
      localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory))
      
      return updatedHistory
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim())
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('weatherSearchHistory')
  }

  const removeFromHistory = (cityToRemove, countryToRemove) => {
    setSearchHistory(prev => {
      const updatedHistory = prev.filter(item => 
        !(item.city === cityToRemove && item.country === countryToRemove)
      )
      localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory))
      return updatedHistory
    })
  }

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const getLocalTime = (timezoneOffset) => {
    const localDate = new Date()
    const utc = localDate.getTime() + (localDate.getTimezoneOffset() * 60000)
    const cityDate = new Date(utc + (timezoneOffset * 1000))
    
    return cityDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ` GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset/3600}`
  }

  const getCountryFlag = (countryCode) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
  }

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInMinutes = Math.floor((now - past) / (1000 * 60))
    
    if (diffInMinutes < 1) return t.justNow
    if (diffInMinutes < 60) return `${diffInMinutes}${t.minutesAgo}`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}${t.hoursAgo}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}${t.daysAgo}`
  }

  const getWeatherEmoji = (weather) => {
    const emojiMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    }
    return emojiMap[weather] || '🌤️'
  }

  const getLucideWeatherIcon = (weatherMain) => {
    const iconProps = { size: 24, className: "text-white" }
    
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <Sun {...iconProps} />
      case 'clouds':
        return <Cloud {...iconProps} />
      case 'rain':
      case 'drizzle':
        return <CloudRain {...iconProps} />
      case 'thunderstorm':
        return <CloudRain {...iconProps} />
      case 'snow':
        return <CloudSnow {...iconProps} />
      case 'mist':
      case 'fog':
      case 'haze':
        return <Cloud {...iconProps} />
      default:
        return <Cloud {...iconProps} />
    }
  }

  const getTemperature = (temp) => {
    return unit === 'metric' ? `${Math.round(temp)}°C` : `${Math.round(temp)}°F`
  }

  const getWindSpeed = (speed) => {
    return unit === 'metric' ? `${speed} m/s` : `${(speed * 2.237).toFixed(1)} mph`
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.weather}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.weatherForecast}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={20} />
            {loading ? t.searching : t.search}
          </button>
        </form>

        {/* Unit Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t.units}:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setUnit('metric')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                unit === 'metric' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                unit === 'imperial' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-gray-700 dark:text-gray-300 font-medium">
                {t.searchHistory}:
              </label>
              <button
                onClick={clearHistory}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                {t.clearAll}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <div
                  key={`${item.city}-${item.country}-${index}`}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 group hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <button
                    onClick={() => fetchWeather(item.city)}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="text-lg">{getWeatherEmoji(item.weather)}</span>
                    <span>{item.city}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({item.temperature}°{unit === 'metric' ? 'C' : 'F'})
                    </span>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.city, item.country)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title={t.removeFromHistory}
                  >
                    ×
                  </button>
                  <span className="text-xs text-gray-400 dark:text-gray-500" title={new Date(item.timestamp).toLocaleString()}>
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t.loading} {searchInput || city}...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            {t.cityNotFound}
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
            💡 <strong>{t.searchTips}:</strong><br/>
            • {t.searchTip1}<br/>
            • {t.searchTip2}<br/>
            • {t.searchTip3}
          </p>
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-6">
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img 
                  src={getCountryFlag(weatherData.sys.country)} 
                  alt={weatherData.sys.country}
                  className="w-8 h-6 rounded mr-3 border border-white/30"
                />
                <div>
                  <h2 className="text-2xl font-bold">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-blue-100 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-100 text-sm">{t.localTime}</div>
                <div className="font-semibold text-lg">
                  {getLocalTime(weatherData.timezone)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="w-24 h-24 bg-blue-400/20 rounded-full flex items-center justify-center mr-4">
                  {getLucideWeatherIcon(weatherData.weather[0].main)}
                </div>
                <div className="ml-4">
                  <div className="text-6xl font-bold">
                    {getTemperature(weatherData.main.temp)}
                  </div>
                  <div className="text-blue-100">
                    {t.feelsLike} {getTemperature(weatherData.main.feels_like)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-100 mb-1">
                    <Droplets size={16} />
                    <span className="text-sm">{t.humidity}</span>
                  </div>
                  <div className="font-semibold text-xl">{weatherData.main.humidity}%</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-100 mb-1">
                    <Wind size={16} />
                    <span className="text-sm">{t.wind}</span>
                  </div>
                  <div className="font-semibold text-xl">{getWindSpeed(weatherData.wind.speed)}</div>
                  <div className="text-blue-100 text-sm">
                    {getWindDirection(weatherData.wind.deg)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-100 mb-1">
                    <Gauge size={16} />
                    <span className="text-sm">{t.pressure}</span>
                  </div>
                  <div className="font-semibold text-xl">{weatherData.main.pressure} hPa</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-100 mb-1">
                    <Eye size={16} />
                    <span className="text-sm">{t.visibility}</span>
                  </div>
                  <div className="font-semibold text-xl">
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Weather Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Cloud size={24} className="text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.cloudiness}</div>
              <div className="font-semibold text-black dark:text-white text-lg">
                {weatherData.clouds.all}%
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Sunrise size={24} className="text-orange-500" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.sunrise}</div>
              <div className="font-semibold text-black dark:text-white text-lg">
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Sunset size={24} className="text-purple-500" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.sunset}</div>
              <div className="font-semibold text-black dark:text-white text-lg">
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Thermometer size={24} className="text-red-500" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.minMaxTemp}</div>
              <div className="font-semibold text-black dark:text-white text-lg">
                {getTemperature(weatherData.main.temp_min)} / {getTemperature(weatherData.main.temp_max)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather