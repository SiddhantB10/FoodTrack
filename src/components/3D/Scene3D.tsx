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
  const wheel1Ref = useRef<THREE.Mesh>(null)
  const wheel2Ref = useRef<THREE.Mesh>(null)
  const pizzaRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    if (bikeRef.current) {
      // Floating animation
      bikeRef.current.position.y = Math.sin(time * 1.5) * 0.3
      // Gentle swaying
      bikeRef.current.rotation.z = Math.sin(time * 0.8) * 0.05
      bikeRef.current.rotation.y = Math.sin(time * 0.5) * 0.15
    }

    // Spinning wheels
    if (wheel1Ref.current) wheel1Ref.current.rotation.x = time * 3
    if (wheel2Ref.current) wheel2Ref.current.rotation.x = time * 3

    // Bouncing pizza box
    if (pizzaRef.current) {
      pizzaRef.current.rotation.y = time * 2
      pizzaRef.current.position.y = Math.sin(time * 3) * 0.1
    }
  })

  return (
    <group ref={bikeRef}>
      {/* Bike Frame - Modern Scooter Style */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2, 0.3, 0.6]} />
        <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Handlebars */}
      <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#374151" metalness={0.8} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.3, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.5]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Front Wheel - Spinning */}
      <mesh ref={wheel1Ref} position={[0.9, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.35, 0.12, 20, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Back Wheel - Spinning */}
      <mesh ref={wheel2Ref} position={[-0.9, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.35, 0.12, 20, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Delivery Box - Large and Prominent */}
      <group position={[-0.6, 0.7, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 1, 1]} />
          <meshStandardMaterial color="#fb923c" metalness={0.4} roughness={0.5} />
        </mesh>
        
        {/* FoodTrack Logo on Box */}
        <mesh position={[0, 0, 0.51]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Steam/Heat Effect */}
        <mesh ref={pizzaRef} position={[0, 0.7, 0]}>
          <coneGeometry args={[0.3, 0.5, 8]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.6}
            emissive="#f59e0b"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Headlight Glow */}
      <pointLight position={[1.2, 0, 0]} intensity={2} color="#fbbf24" distance={3} />
      
      {/* Speed Lines Effect */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-1.5 - i * 0.3, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <planeGeometry args={[0.4, 0.08]} />
          <meshStandardMaterial 
            color="#f97316" 
            transparent 
            opacity={0.3 - i * 0.05}
            emissive="#f97316"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
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
