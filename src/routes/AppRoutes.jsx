import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Home from '../pages/Home/Home'
import Weather from '../pages/Weather/Weather'
import Translate from '../pages/Translate/Translate'
import Currency from '../pages/Currency/Currency'
import Transport from '../pages/Transport/Transport'
import Calculator from '../pages/Calculator/Calculator'
import Converter from '../pages/Converter/Converter'
import Notes from '../pages/Notes/Notes'
import Todo from '../pages/Todo/Todo'
import Reminders from '../pages/Reminders/Reminders'
import Settings from '../pages/Settings/Settings'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="weather" element={<Weather />} />
        <Route path="translate" element={<Translate />} />
        <Route path="currency" element={<Currency />} />
        <Route path="transport" element={<Transport />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="converter" element={<Converter />} />
        <Route path="notes" element={<Notes />} />
        <Route path="todo" element={<Todo />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes