'use client'

import React from 'react'

export default function LaunchCalendar() {
  // Fetch launch data from your API
  const launches = [
    { name: 'Falcon 9 - Starlink', date: '2025-10-20' },
    { name: 'Atlas V - GOES-T', date: '2025-11-05' },
    { name: 'Artemis II', date: '2025-11-15' },
  ]

  return (
    <div>
      <h2>Launch Calendar</h2>
      <ul>
        {launches.map(launch => (
          <li key={launch.name}>
            {launch.name} - {launch.date}
          </li>
        ))}
      </ul>
    </div>
  )
}
