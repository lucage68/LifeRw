import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-300 h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">LR</span>
        </div>
        <span className="ml-3 text-xl font-semibold text-black">LifeRw</span>
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm">U</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar