"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";

// Node definitions
interface SystemNode {
  name: string;
  position: [number, number, number];
  color: string;
}

const SYSTEM_NODES: SystemNode[] = [
  { name: "AI", position: [1.4, 0.7, 0.7], color: "#22d3ee" },
  { name: "Full-Stack", position: [-1.5, 0.5, -0.7], color: "#38bdf8" },
  { name: "ERP", position: [0.9, -1.1, -0.9], color: "#0ea5e9" },
  { name: "Quant", position: [-1.1, -0.9, 1.1], color: "#06b6d4" },
  { name: "Dashboard", position: [0.0, 1.4, -0.5], color: "#22d3ee" },
];

interface SceneProps {
  isMobile: boolean;
}

function Scene({ isMobile }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shouldReduce = useReducedMotionSafe();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Determine motion speed (pause/simplify if reduced motion or mobile)
    const isPaused = shouldReduce;
    const speedMultiplier = isMobile ? 0.35 : 1.0;

    // 1. Core Floating / Pulsing animation
    if (coreRef.current && !isPaused) {
      coreRef.current.position.y = Math.sin(elapsed * 1.2) * 0.08 * speedMultiplier;
      coreRef.current.rotation.y = elapsed * 0.15 * speedMultiplier;
      coreRef.current.rotation.x = elapsed * 0.08 * speedMultiplier;
    }

    // 2. Ambient Node System Rotation
    if (groupRef.current) {
      if (!isPaused) {
        groupRef.current.rotation.y = elapsed * 0.08 * speedMultiplier;
      }
      
      // 3. Mouse position response (lerped tilt - disabled on mobile)
      if (!isPaused && !isMobile) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          state.pointer.y * 0.2,
          0.05
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          -state.pointer.x * 0.2,
          0.05
        );
      } else {
        // Reset tilt on mobile/reduced motion
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.05);
      }
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[0, 0, 0]} intensity={1.0} color="#0891b2" />

      {/* Main system nodes group */}
      <group ref={groupRef}>
        {/* Core Glass Sphere */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial
            roughness={0.15}
            transmission={0.9}
            thickness={1.5}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            color="#082f49"
            attenuationColor="#22d3ee"
            attenuationDistance={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Core inner grid mesh */}
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <sphereGeometry args={[0.88, 12, 12]} />
          <meshBasicMaterial
            color="#22d3ee"
            wireframe
            transparent
            opacity={0.05}
          />
        </mesh>

        {/* Orbit Rings Blueprint */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.305, 48]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[1.6, 1.605, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Nodes, Connection Lines, and Labels */}
        {SYSTEM_NODES.map((node, index) => {
          const start: [number, number, number] = [0, 0, 0];
          return (
            <group key={index}>
              {/* Connection line from core center to node */}
              <Line
                points={[start, node.position]}
                color="#22d3ee"
                lineWidth={0.5}
                transparent
                opacity={0.12}
              />

              {/* Node position group */}
              <group position={node.position}>
                {/* Outer Node Halo */}
                <mesh>
                  <sphereGeometry args={[0.07, 12, 12]} />
                  <meshBasicMaterial
                    color={node.color}
                    transparent
                    opacity={0.15}
                  />
                </mesh>

                {/* Inner Core Node */}
                <mesh>
                  <sphereGeometry args={[0.035, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>

                {/* HUD Monospace Labels */}
                <Html distanceFactor={5.5} center>
                  <div className="px-2 py-0.5 bg-black/85 border border-cyan-500/25 text-cyan-400 text-[8px] font-mono rounded backdrop-blur-sm whitespace-nowrap shadow-lg shadow-black/60 pointer-events-none select-none">
                    {node.name}
                  </div>
                </Html>
              </group>
            </group>
          );
        })}
      </group>
    </>
  );
}

export default function FloatingSystemCore() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[280px] relative overflow-hidden bg-black/10 border border-white/5 rounded-2xl backdrop-blur-sm select-none">
      {/* Blueprint Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* R3F Canvas Container */}
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
