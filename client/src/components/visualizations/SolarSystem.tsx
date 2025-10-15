'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'

export default function SolarSystem() {
  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
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
    </div>
  )
}
