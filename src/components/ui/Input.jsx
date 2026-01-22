import React from 'react'

const Input = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        {...props}
      />
    </div>
  )
}

export default Input