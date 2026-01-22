import React from 'react'

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-300 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card