import React from 'react'
import { useTranslation } from './hooks/useTranslation';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home/Home'
import Weather from './pages/Weather/Weather'
import Translate from './pages/Translate/Translate'
import Currency from './pages/Currency/Currency'
import Calculator from './pages/Calculator/Calculator'
import Notes from './pages/Notes/Notes'
import Todo from './pages/Todo/Todo'
import Converter from './pages/Converter/Converter'
import Reminders from './pages/Reminders/Reminders'
import Settings from './pages/Settings/Settings'
import { 
  Home as HomeIcon, 
  Cloud, 
  Languages, 
  DollarSign, 
  Calculator as CalcIcon,
  Ruler,
  FileText,
  CheckSquare,
  Clock,
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
<header className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 
                   h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 
                   transition-colors">
  <div className="flex items-center">
    <button 
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
    >
      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
    {/* Larger logo version */}
    <div className="flex items-center gap-3">
      <img 
        src="/logo.png" 
        alt="LifeRw Logo" 
        className="h-8 w-8 object-contain"
      />
      <h1 className="text-xl font-bold text-black dark:text-white">LifeRw</h1>
    </div>
  </div>
  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
    <span className="text-gray-600 dark:text-gray-200 text-sm">U</span>
  </div>
</header>
      
      <div className="flex pt-16">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 
          min-h-screen transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <HomeIcon size={20} />
              {t.home}
            </Link>
            <Link 
              to="/weather" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Cloud size={20} />
              {t.weather}
            </Link>
            <Link 
              to="/translate" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Languages size={20} />
              {t.translate}
            </Link>
            <Link 
              to="/currency" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <DollarSign size={20} />
              {t.currency}
            </Link>
            <Link 
              to="/calculator" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <CalcIcon size={20} />
              {t.calculator}
            </Link>
            <Link 
              to="/converter" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Ruler size={20} />
              {t.converter}
            </Link>
            <Link 
              to="/notes" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FileText size={20} />
              {t.notes}
            </Link>
            <Link 
              to="/todo" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <CheckSquare size={20} />
              {t.todo}
            </Link>
            <Link 
              to="/reminders" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Clock size={20} />
              {t.reminders}
            </Link>
            <Link 
              to="/settings" 
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 py-3 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <SettingsIcon size={20} />
              {t.settings}
            </Link>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 lg:ml-0 text-black dark:text-white transition-colors">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/weather" element={<Layout><Weather /></Layout>} />
        <Route path="/translate" element={<Layout><Translate /></Layout>} />
        <Route path="/currency" element={<Layout><Currency /></Layout>} />
        <Route path="/calculator" element={<Layout><Calculator /></Layout>} />
        <Route path="/converter" element={<Layout><Converter /></Layout>} />
        <Route path="/notes" element={<Layout><Notes /></Layout>} />
        <Route path="/todo" element={<Layout><Todo /></Layout>} />
        <Route path="/reminders" element={<Layout><Reminders /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App