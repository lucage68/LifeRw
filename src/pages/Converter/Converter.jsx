import React from 'react'
import { Ruler, Scale, Thermometer, Square, ArrowLeftRight, Zap } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Converter = () => {
  const [value, setValue] = React.useState('1')
  const [fromUnit, setFromUnit] = React.useState('meters')
  const [toUnit, setToUnit] = React.useState('feet')
  const [result, setResult] = React.useState('')
  const { t } = useTranslation()

  const unitCategories = {
    length: {
      meters: 1,
      feet: 3.28084,
      inches: 39.3701,
      centimeters: 100,
      kilometers: 0.001,
      miles: 0.000621371,
      yards: 1.09361
    },
    weight: {
      kilograms: 1,
      pounds: 2.20462,
      ounces: 35.274,
      grams: 1000,
      stones: 0.157473
    },
    temperature: {
      celsius: 'celsius',
      fahrenheit: 'fahrenheit', 
      kelvin: 'kelvin'
    },
    area: {
      'square meters': 1,
      'square feet': 10.7639,
      'square kilometers': 0.000001,
      hectares: 0.0001,
      acres: 0.000247105
    }
  }

  const [category, setCategory] = React.useState('length')

  const convertTemperature = (value, fromUnit, toUnit) => {
    let celsiusValue
    
    // Convert everything to Celsius first
    switch (fromUnit) {
      case 'celsius':
        celsiusValue = parseFloat(value)
        break
      case 'fahrenheit':
        celsiusValue = (parseFloat(value) - 32) * 5/9
        break
      case 'kelvin':
        celsiusValue = parseFloat(value) - 273.15
        break
      default:
        celsiusValue = parseFloat(value)
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
      case 'celsius':
        return celsiusValue
      case 'fahrenheit':
        return (celsiusValue * 9/5) + 32
      case 'kelvin':
        return celsiusValue + 273.15
      default:
        return celsiusValue
    }
  }

  const convertUnits = () => {
    if (!value || isNaN(value)) {
      setResult('')
      return
    }

    const numValue = parseFloat(value)
    
    if (category === 'temperature') {
      // Temperature conversion
      const converted = convertTemperature(numValue, fromUnit, toUnit)
      setResult(converted.toFixed(2))
    } else {
      // Standard conversion
      const fromFactor = unitCategories[category][fromUnit]
      const toFactor = unitCategories[category][toUnit]
      const converted = (numValue / fromFactor) * toFactor
      setResult(converted.toFixed(6))
    }
  }

  // Reset units when category changes
  React.useEffect(() => {
    const units = Object.keys(unitCategories[category])
    setFromUnit(units[0])
    setToUnit(units[1] || units[0])
    setValue('1')
  }, [category])

  // Auto-convert when inputs change
  React.useEffect(() => {
    convertUnits()
  }, [value, fromUnit, toUnit, category])

  const getCategoryIcon = (cat) => {
    const icons = {
      length: <Ruler size={24} className="text-blue-500" />,
      weight: <Scale size={24} className="text-green-500" />,
      temperature: <Thermometer size={24} className="text-red-500" />,
      area: <Square size={24} className="text-purple-500" />
    }
    return icons[cat]
  }

  const getCategoryName = (cat) => {
    const names = {
      length: t.length,
      weight: t.weight,
      temperature: t.temperature,
      area: t.area
    }
    return names[cat] || cat
  }

  const temperatureReferences = [
    { label: t.waterFreezes, celsius: '0°C', fahrenheit: '32°F' },
    { label: t.waterBoils, celsius: '100°C', fahrenheit: '212°F' },
    { label: t.roomTemp, celsius: '20°C', fahrenheit: '68°F' },
    { label: t.bodyTemp, celsius: '37°C', fahrenheit: '98.6°F' }
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.unitConverter}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.unitConverterDesc}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-3 font-semibold">
            {t.category}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(unitCategories).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-4 border rounded-xl transition-all duration-200 ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {getCategoryIcon(cat)}
                  <div className="text-sm font-medium capitalize">
                    {getCategoryName(cat)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* From */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              {t.from}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white text-xl mb-3"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {Object.keys(unitCategories[category]).map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              {t.to}
            </label>
            <div className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-xl mb-3 min-h-[64px] flex items-center justify-end font-mono">
              {result || '0'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {Object.keys(unitCategories[category]).map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setFromUnit(toUnit)
              setToUnit(fromUnit)
              setValue(result || value)
            }}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeftRight size={20} />
            {t.swapUnits}
          </button>
        </div>

        {/* Conversion Result */}
        {result && value && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-center">
            <div className="text-lg font-semibold text-green-800 dark:text-green-400">
              {value} {fromUnit} = {result} {toUnit}
            </div>
          </div>
        )}

        {/* Temperature Examples */}
        {category === 'temperature' && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
              <Thermometer size={20} />
              {t.commonReferences}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {temperatureReferences.map((ref, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="text-gray-600 dark:text-gray-400">{ref.label}:</span>
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {ref.celsius} = {ref.fahrenheit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Help */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
        <Zap size={16} />
        {t.autoConvert}
      </div>
    </div>
  )
}

export default Converter