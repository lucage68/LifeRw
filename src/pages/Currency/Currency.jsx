import React from 'react'
import { RefreshCw, ArrowLeftRight, Calculator, TrendingUp, Globe, Zap } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Currency = () => {
  const [amount, setAmount] = React.useState('1000')
  const [fromCurrency, setFromCurrency] = React.useState('RWF')
  const [toCurrency, setToCurrency] = React.useState('USD')
  const [convertedAmount, setConvertedAmount] = React.useState('')
  const [exchangeRate, setExchangeRate] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [lastConverted, setLastConverted] = React.useState('')
  const { t } = useTranslation()

  // Currencies with focus on Rwanda and major world currencies
  const currencies = [
    { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'FRw' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
    { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' }
  ]

  // Mock exchange rates
  const mockExchangeRates = {
    'RWF-USD': 0.00081,
    'RWF-EUR': 0.00074,
    'RWF-GBP': 0.00063,
    'RWF-KES': 0.12,
    'RWF-UGX': 3.2,
    'RWF-TZS': 2.1,
    'USD-RWF': 1235,
    'EUR-RWF': 1350,
    'GBP-RWF': 1580,
    'KES-RWF': 8.3,
    'UGX-RWF': 0.31,
    'TZS-RWF': 0.48
  }

  const fetchExchangeRate = async (from, to) => {
    setLoading(true)
    
    try {
      // Try free exchange rate API
      const response = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      
      if (response.ok) {
        const data = await response.json()
        const rate = data.rates[to]
        
        if (rate) {
          setExchangeRate(rate)
          return rate
        }
      }
      throw new Error('API rate limit exceeded')
    } catch (err) {
      // Use mock rates as fallback
      const mockRate = mockExchangeRates[`${from}-${to}`]
      if (mockRate) {
        setExchangeRate(mockRate)
        return mockRate
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setConvertedAmount('')
      return
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency)
    
    if (rate) {
      const result = (parseFloat(amount) * rate).toFixed(2)
      setConvertedAmount(result)
      setLastConverted(`${amount}${fromCurrency}-${toCurrency}`)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    // Don't auto-swap amounts to avoid confusion
  }

  // Enhanced auto-convert with proper dependencies
  React.useEffect(() => {
    const currentConversion = `${amount}${fromCurrency}-${toCurrency}`
    
    // Only convert if something actually changed and we have a valid amount
    if (currentConversion !== lastConverted && amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => {
        convertCurrency()
      }, 300) // Small delay to avoid too many API calls while typing
      
      return () => clearTimeout(timer)
    }
  }, [amount, fromCurrency, toCurrency])

  // Handle manual conversion for cases where auto-convert might not trigger
  const handleManualConvert = () => {
    convertCurrency()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.currencyConverter}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.currencyDesc}
        </p>
      </div>

      {/* Converter Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* Amount Input */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              {t.amount}
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.enterAmount}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white text-xl"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              {t.from}
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white text-lg"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              {t.to}
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white text-lg"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <button
            onClick={handleManualConvert}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t.converting}
              </>
            ) : (
              <>
                <Calculator size={20} />
                {t.convertCurrency}
              </>
            )}
          </button>

          <button
            onClick={swapCurrencies}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeftRight size={20} />
            {t.swapCurrencies}
          </button>
        </div>

        {/* Result Display */}
        {convertedAmount && !loading && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
              {parseFloat(amount).toLocaleString()} {fromCurrency}
            </div>
            <div className="text-2xl text-gray-600 dark:text-gray-400 mb-4">=</div>
            <div className="text-4xl font-bold text-green-800 dark:text-green-400">
              {parseFloat(convertedAmount).toLocaleString()} {toCurrency}
            </div>
            {exchangeRate && (
              <div className="text-green-600 dark:text-green-400 mt-4 text-lg flex items-center justify-center gap-2">
                <TrendingUp size={20} />
                {t.exchangeRate}: 1 {fromCurrency} = {exchangeRate} {toCurrency}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t.gettingRates}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!convertedAmount && !loading && amount && (
          <div className="mt-6 text-center p-4 text-gray-500 dark:text-gray-400">
            {t.enterAmountToConvert}
          </div>
        )}
      </div>

      {/* Quick Help */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <Zap size={16} />
        {t.autoConvertHelp}
      </div>
    </div>
  )
}

export default Currency