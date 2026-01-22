// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CloudSun, 
  Languages, 
  DollarSign, 
  Calculator, 
  Ruler, 
  FileText, 
  CheckSquare, 
  Clock, 
  Cog as SettingsIcon 
} from 'lucide-react';
import translations from '../translations';
import { useLanguage } from '../hooks/useLanguage';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { language } = useLanguage();

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  // Navigation items with Lucide icons
  const navItems = [
    {
      path: '/',
      name: t('home'),
      icon: <Home size={24} className="text-blue-500" />
    },
    {
      path: '/weather',
      name: t('weather'),
      icon: <CloudSun size={24} className="text-cyan-500" />
    },
    {
      path: '/translate',
      name: t('translate'),
      icon: <Languages size={24} className="text-green-500" />
    },
    {
      path: '/currency',
      name: t('currency'),
      icon: <DollarSign size={24} className="text-emerald-500" />
    },
    {
      path: '/calculator',
      name: t('calculator'),
      icon: <Calculator size={24} className="text-orange-500" />
    },
    {
      path: '/converter',
      name: t('converter'),
      icon: <Ruler size={24} className="text-pink-500" />
    },
    {
      path: '/notes',
      name: t('notes'),
      icon: <FileText size={24} className="text-indigo-500" />
    },
    {
      path: '/todo',
      name: t('todo'),
      icon: <CheckSquare size={24} className="text-yellow-500" />
    },
    {
      path: '/reminders',
      name: t('reminders'),
      icon: <Clock size={24} className="text-red-500" />
    },
    {
      path: '/settings',
      name: t('settings'),
      icon: <SettingsIcon size={24} className="text-gray-500" />
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                LifeRw
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('superApp')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Current Language Indicator */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {language === 'en' && 'English'}
            {language === 'fr' && 'Français'}
            {language === 'rw' && 'Kinyarwanda'}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;