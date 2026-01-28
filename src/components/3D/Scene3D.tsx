'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#f97316"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function DeliveryBike() {
  const bikeRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (bikeRef.current) {
      bikeRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2
      bikeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={bikeRef}>
      {/* Bike Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-0.5, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 100]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.5, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 100]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Delivery Box */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#fb923c" />
      </mesh>
    </group>
  )
}

export function Hero3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f97316" />
        <DeliveryBike />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

export function FloatingOrb() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ef4444" />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  )
}
