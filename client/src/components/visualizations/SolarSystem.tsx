'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Card, CardContent, Typography } from '@mui/material'

export default function SolarSystem() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', padding: 0 }}>
        <Canvas style={{ height: '80vh' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Stars />
          <OrbitControls />
          {/* Add planets and other celestial bodies here */}
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="yellow" />
          </mesh>
        </Canvas>
      </CardContent>
    </Card>
  )
}
