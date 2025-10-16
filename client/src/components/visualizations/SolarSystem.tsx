'use client'

import { Card, CardContent } from '@mui/material'
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

const planets = [
  {
    name: 'Sun',
    radius: 1.4,
    distance: 0,
    color: '#FDB813',
    emissive: '#FFEA00',
  },
  {
    name: 'Mercury',
    radius: 0.15,
    distance: 2,
    color: '#B2B2B2',
  },
  {
    name: 'Venus',
    radius: 0.25,
    distance: 3,
    color: '#E4C16F',
  },
  {
    name: 'Earth',
    radius: 0.26,
    distance: 4,
    color: '#3D8BFF',
  },
  {
    name: 'Mars',
    radius: 0.2,
    distance: 5,
    color: '#FF6B4A',
  },
  {
    name: 'Jupiter',
    radius: 0.7,
    distance: 7,
    color: '#E0AA6D',
  },
  {
    name: 'Saturn',
    radius: 0.6,
    distance: 9,
    color: '#EBD49A',
    rings: true,
  },
  {
    name: 'Uranus',
    radius: 0.45,
    distance: 11,
    color: '#7DF9FF',
  },
  {
    name: 'Neptune',
    radius: 0.45,
    distance: 13,
    color: '#425CFF',
  },
]

function Planet({ radius, distance, color, emissive, rings }: typeof planets[number]) {
  return (
    <group position={[distance, 0, 0]}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} emissive={emissive ?? '#000'} emissiveIntensity={0.4} />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshStandardMaterial color="#B8A47E" side={2} />
        </mesh>
      )}
    </group>
  )
}

function SolarSystemScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 0]} intensity={2.5} distance={50} />
      <Stars radius={80} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={30} />
      {planets.map((planet) => (
        <Planet key={planet.name} {...planet} />
      ))}
    </>
  )
}

export default function SolarSystem() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', padding: 0 }}>
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }} style={{ height: '80vh' }}>
          <Suspense fallback={null}>
            <SolarSystemScene />
          </Suspense>
        </Canvas>
      </CardContent>
    </Card>
  )
}
