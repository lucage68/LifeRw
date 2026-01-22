import React, { useState } from 'react'
import { CalculatorIcon, Delete, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Calculator = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const { t } = useTranslation()

  const handleNumberClick = (number) => {
    if (waitingForNewValue) {
      setDisplay(String(number))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(number) : display + number)
    }
  }

  const handleOperationClick = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      case '%':
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const handlePercentage = () => {
    const currentValue = parseFloat(display)
    setDisplay(String(currentValue / 100))
  }

  const handleDelete = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0')
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  const formatDisplay = (value) => {
    // Format large numbers with commas and handle decimal places
    const [integer, decimal] = value.split('.')
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.calculator}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.calculatorDesc}
        </p>
      </div>

      {/* Calculator */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
        {/* Display */}
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl mb-6 text-right">
          <div className="text-4xl font-mono text-black dark:text-white font-light tracking-tight min-h-[60px] flex items-center justify-end">
            {formatDisplay(display)}
          </div>
          {operation && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {previousValue} {operation}
            </div>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button
            onClick={handleClear}
            className="col-span-2 bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Delete size={20} />
            {t.clear}
          </button>
          <button
            onClick={handleDelete}
            className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white p-4 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors flex items-center justify-center"
          >
            <Delete size={20} />
          </button>
          <button
            onClick={handlePercentage}
            className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Percent size={20} />
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleNumberClick(7)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            7
          </button>
          <button
            onClick={() => handleNumberClick(8)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            8
          </button>
          <button
            onClick={() => handleNumberClick(9)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            9
          </button>
          <button
            onClick={() => handleOperationClick('/')}
            className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Divide size={20} />
          </button>

          {/* Row 3 */}
          <button
            onClick={() => handleNumberClick(4)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            4
          </button>
          <button
            onClick={() => handleNumberClick(5)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            5
          </button>
          <button
            onClick={() => handleNumberClick(6)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            6
          </button>
          <button
            onClick={() => handleOperationClick('*')}
            className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <X size={20} />
          </button>

          {/* Row 4 */}
          <button
            onClick={() => handleNumberClick(1)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            1
          </button>
          <button
            onClick={() => handleNumberClick(2)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            2
          </button>
          <button
            onClick={() => handleNumberClick(3)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            3
          </button>
          <button
            onClick={() => handleOperationClick('-')}
            className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Minus size={20} />
          </button>

          {/* Row 5 */}
          <button
            onClick={() => handleNumberClick(0)}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium col-span-2"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-medium"
          >
            .
          </button>
          <button
            onClick={() => handleOperationClick('+')}
            className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Plus size={20} />
          </button>

          {/* Row 6 - Equals */}
          <button
            onClick={handleEquals}
            className="col-span-4 bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2 text-xl"
          >
            <Equal size={24} />
            {t.equals}
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        <p>{t.calculatorTip}</p>
      </div>
    </div>
  )
}

export default Calculator