'use client'

import React from 'react'

export default function MissionStatus() {
  // Fetch mission data from your API
  const missions = [
    { name: 'Artemis I', status: 'Completed' },
    { name: 'Crew-9', status: 'Upcoming' },
    { name: 'Starlink Group 6-21', status: 'In Progress' },
  ]

  return (
    <div>
      <h2>Mission Status</h2>
      <ul>
        {missions.map(mission => (
          <li key={mission.name}>
            {mission.name}: {mission.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
