'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function RotatingMesh() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6;
    ref.current.rotation.x += delta * 0.2;
  });

  return (
    <mesh ref={ref} scale={1.4}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#000000"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ height: 420 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <RotatingMesh />

      <Environment preset="studio" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
