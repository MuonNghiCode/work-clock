import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

const Background3D = () => {
  return (
    <Canvas className="absolute inset-0 z-0">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[2, 100, 100]} scale={4} position={[0, 0, -5]}>
        <MeshDistortMaterial
          color={"#FF914D"}
          attach="material"
          distort={0.4}
          speed={1.5}
        />
      </Sphere>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default Background3D;
