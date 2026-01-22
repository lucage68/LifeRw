import React from 'react'
import { CheckSquare, Plus, Trash2, CheckCircle, Clock, BarChart3 } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const Todo = () => {
  const [todos, setTodos] = React.useState([])
  const [newTodo, setNewTodo] = React.useState('')
  const { t } = useTranslation()

  // Load todos from localStorage
  React.useEffect(() => {
    const savedTodos = localStorage.getItem('liferw-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage
  const saveTodos = (updatedTodos) => {
    setTodos(updatedTodos)
    localStorage.setItem('liferw-todos', JSON.stringify(updatedTodos))
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      const updatedTodos = [todo, ...todos]
      saveTodos(updatedTodos)
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    saveTodos(updatedTodos)
  }

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    saveTodos(updatedTodos)
  }

  const clearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed)
    saveTodos(updatedTodos)
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const pendingCount = todos.filter(todo => !todo.completed).length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          {t.todoList}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.todoDesc}
        </p>
      </div>

      {/* Add Todo */}
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder={t.whatNeedsDone}
            className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim()}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={20} />
            {t.addTask}
          </button>
        </div>
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1">
              <BarChart3 size={16} />
              {t.total}: {todos.length}
            </span>
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle size={16} />
              {t.done}: {completedCount}
            </span>
            <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <Clock size={16} />
              {t.pending}: {pendingCount}
            </span>
          </div>
        </div>
      )}

      {/* Todos List */}
      <div className="space-y-3">
        {todos.map(todo => (
          <div
            key={todo.id}
            className={`flex items-center gap-4 p-4 border rounded-lg group transition-all ${
              todo.completed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {todo.completed && <CheckSquare size={14} />}
            </button>
            
            <span
              className={`flex-1 ${
                todo.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {todo.text}
            </span>
            
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="text-center p-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare size={32} className="text-green-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.noTasks}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">{t.addFirstTask}</p>
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

export default Todo