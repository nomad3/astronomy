'use client'

import React, { useEffect, useState } from 'react'

export default function ISSTrackerMap() {
  const [issPosition, setIssPosition] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    // Fetch ISS position data from an API
    const interval = setInterval(() => {
      fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then(res => res.json())
        .then(data => {
          setIssPosition({ lat: data.latitude, lng: data.longitude })
        })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <h2>ISS Live Location</h2>
      <p>Latitude: {issPosition.lat}</p>
      <p>Longitude: {issPosition.lng}</p>
      {/* Add a map component here to visualize the position */}
    </div>
  )
}
