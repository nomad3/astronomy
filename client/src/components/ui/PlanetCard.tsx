'use client'

import React from 'react'

interface PlanetCardProps {
  name: string;
  description: string;
}

export default function PlanetCard({ name, description }: PlanetCardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  )
}
