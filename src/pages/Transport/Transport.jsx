import React from 'react'

const Transport = () => {
  const [selectedRoute, setSelectedRoute] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')

  // Rwanda bus routes data
  const busRoutes = [
    {
      id: 'route-1',
      name: 'Route 1: Downtown - Kicukiro',
      number: '1',
      from: 'Downtown Kigali',
      to: 'Kicukiro',
      stops: ['City Center', 'Nyabugogo', 'Kacyiru', 'Kicukiro Center', 'Gikondo', 'Nyarutarama'],
      frequency: 'Every 15 minutes',
      operatingHours: '6:00 AM - 10:00 PM',
      fare: 'FRw 300',
      duration: '25-35 minutes',
      features: ['Express Service', 'Air Conditioned', 'Digital Payment']
    },
    {
      id: 'route-2', 
      name: 'Route 2: City Center - Gikondo',
      number: '2',
      from: 'City Center',
      to: 'Gikondo',
      stops: ['City Center', 'Kimironko', 'Remera', 'Gikondo Market', 'Kicukiro'],
      frequency: 'Every 20 minutes',
      operatingHours: '5:30 AM - 9:30 PM',
      fare: 'FRw 250',
      duration: '20-30 minutes',
      features: ['Regular Service', 'Student Discount']
    },
    {
      id: 'route-3',
      name: 'Route 3: Nyabugogo - Kimironko',
      number: '3',
      from: 'Nyabugogo',
      to: 'Kimironko',
      stops: ['Nyabugogo Terminal', 'City Center', 'Kacyiru', 'Kimironko Market', 'Gacuriro'],
      frequency: 'Every 15 minutes',
      operatingHours: '5:00 AM - 10:30 PM',
      fare: 'FRw 300',
      duration: '30-40 minutes',
      features: ['Express Service', 'WiFi Available', 'Digital Payment']
    },
    {
      id: 'route-4',
      name: 'Route 4: Remera - Kacyiru',
      number: '4',
      from: 'Remera',
      to: 'Kacyiru',
      stops: ['Remera Market', 'Giporoso', 'Kicukiro', 'City Center', 'Kacyiru'],
      frequency: 'Every 25 minutes',
      operatingHours: '6:00 AM - 9:00 PM',
      fare: 'FRw 200',
      duration: '15-25 minutes',
      features: ['Local Service', 'Frequent Stops']
    },
    {
      id: 'route-5',
      name: 'Route 5: Airport - City Center',
      number: '5',
      from: 'Kigali International Airport',
      to: 'City Center',
      stops: ['Airport', 'Kanombe', 'Kicukiro', 'City Center'],
      frequency: 'Every 30 minutes',
      operatingHours: '5:00 AM - 11:00 PM',
      fare: 'FRw 500',
      duration: '20-30 minutes',
      features: ['Airport Express', 'Luggage Space', 'Tourist Friendly']
    },
    {
      id: 'route-6',
      name: 'Route 6: Nyamirambo - City Center',
      number: '6',
      from: 'Nyamirambo',
      to: 'City Center',
      stops: ['Nyamirambo Center', 'Gitega', 'City Center', 'Nyabugogo'],
      frequency: 'Every 20 minutes',
      operatingHours: '5:30 AM - 10:00 PM',
      fare: 'FRw 250',
      duration: '15-20 minutes',
      features: ['Cultural Route', 'Local Markets Access']
    }
  ]

  // Popular destinations
  const popularDestinations = [
    { name: 'Kigali International Airport', emoji: '✈️', routes: ['5'] },
    { name: 'Nyabugogo Bus Terminal', emoji: '🚌', routes: ['1', '3', '6'] },
    { name: 'Kimironko Market', emoji: '🛒', routes: ['2', '3'] },
    { name: 'Kacyiru Business District', emoji: '🏢', routes: ['1', '3', '4'] },
    { name: 'Kicukiro Center', emoji: '🏬', routes: ['1', '2', '4', '5'] },
    { name: 'Remera', emoji: '🏘️', routes: ['2', '4'] }
  ]

  const selectedRouteData = busRoutes.find(route => route.id === selectedRoute)

  const filteredRoutes = busRoutes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.stops.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-2">Rwanda Transport Guide</h1>
      <p className="text-gray-600 mb-8">Bus routes and transport information for Kigali</p>

      {/* Search Bar */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search routes or stops (e.g., 'Kicukiro', 'City Center', 'Airport')"
            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">🚩 Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDestinations.map((destination, index) => (
            <button
              key={index}
              onClick={() => setSearchTerm(destination.name)}
              className="p-4 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{destination.emoji}</span>
                <div>
                  <div className="font-semibold text-blue-800">{destination.name}</div>
                  <div className="text-sm text-blue-600">Routes: {destination.routes.join(', ')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black mb-4">🚌 Available Bus Routes</h2>
          
          {filteredRoutes.map(route => (
            <div
              key={route.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedRoute === route.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
              onClick={() => setSelectedRoute(route.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedRoute === route.id ? 'bg-white text-black' : 'bg-gray-200 text-black'
                    }`}>
                      {route.number}
                    </div>
                    <h3 className={`font-semibold ${
                      selectedRoute === route.id ? 'text-white' : 'text-black'
                    }`}>
                      {route.name}
                    </h3>
                  </div>
                  
                  <div className={`text-sm ${
                    selectedRoute === route.id ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    <div>📍 {route.from} → {route.to}</div>
                    <div>⏰ {route.operatingHours} • {route.frequency}</div>
                    <div>💰 Fare: {route.fare} • 🕒 {route.duration}</div>
                  </div>
                </div>
                
                <div className={`text-2xl ${
                  selectedRoute === route.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {selectedRoute === route.id ? '✓' : '→'}
                </div>
              </div>
            </div>
          ))}

          {filteredRoutes.length === 0 && (
            <div className="text-center p-8 border border-gray-300 rounded-lg bg-gray-50">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-600">No routes found matching your search</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for a different location</p>
            </div>
          )}
        </div>

        {/* Route Details */}
        <div className="lg:sticky lg:top-6">
          {selectedRouteData ? (
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {selectedRouteData.number}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{selectedRouteData.name}</h2>
                  <p className="text-gray-600">{selectedRouteData.from} → {selectedRouteData.to}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Operating Hours</div>
                  <div className="font-semibold">{selectedRouteData.operatingHours}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Frequency</div>
                  <div className="font-semibold">{selectedRouteData.frequency}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Fare</div>
                  <div className="font-semibold">{selectedRouteData.fare}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{selectedRouteData.duration}</div>
                </div>
              </div>

              {/* Bus Stops */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-3">🚏 Bus Stops</h3>
                <div className="space-y-2">
                  {selectedRouteData.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {selectedRouteData.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-black mb-3">⭐ Route Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRouteData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🚌</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Bus Route</h3>
              <p className="text-gray-600">Choose a route from the list to see detailed information</p>
            </div>
          )}
        </div>
      </div>

      {/* Transport Tips */}
      <div className="bg-green-50 border border-green-300 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">💡 Transport Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-green-700">Have exact change ready for faster boarding</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-green-700">Arrive 5-10 minutes before scheduled departure</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-green-700">Check route numbers before boarding</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-green-700">Keep valuables secure during travel</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transport