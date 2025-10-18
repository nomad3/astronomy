'use client';

import { Card, CardContent } from '@mui/material';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { AdditiveBlending, Color } from 'three';

const planets = [
  { name: 'Sun', radius: 1.4, distance: 0, color: '#FDB813', emissive: '#FFEA00' },
  { name: 'Mercury', radius: 0.15, distance: 2, color: '#B2B2B2' },
  { name: 'Venus', radius: 0.25, distance: 3, color: '#E4C16F' },
  { name: 'Earth', radius: 0.26, distance: 4, color: '#3D8BFF' },
  { name: 'Mars', radius: 0.2, distance: 5, color: '#FF6B4A' },
  { name: 'Jupiter', radius: 0.7, distance: 7, color: '#E0AA6D' },
  { name: 'Saturn', radius: 0.6, distance: 9, color: '#EBD49A', rings: true },
  { name: 'Uranus', radius: 0.45, distance: 11, color: '#7DF9FF' },
  { name: 'Neptune', radius: 0.45, distance: 13, color: '#425CFF' },
];

function Planet({ radius, distance, color, emissive, rings }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = Math.sin(clock.getElapsedTime() * 0.1) * distance;
      ref.current.position.z = Math.cos(clock.getElapsedTime() * 0.1) * distance;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} emissive={emissive ? new Color(emissive) : new Color('#000')} emissiveIntensity={emissive ? 1 : 0} />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshStandardMaterial color="#B8A47E" side={2} />
        </mesh>
      )}
    </group>
  );
}

function GodRays() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        color="#FFEA00"
        transparent
        opacity={0.1}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function SolarSystemScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={100} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={50} />
      <GodRays />
      {planets.map((planet) => (
        <Planet key={planet.name} {...planet} />
      ))}
    </>
  );
}

export default function SolarSystem() {
  return (
    <Card sx={{ height: '80vh' }}>
      <CardContent sx={{ height: '100%', p: 0 }}>
        <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
          <Suspense fallback={null}>
            <SolarSystemScene />
          </Suspense>
        </Canvas>
      </CardContent>
    </Card>
  );
}
