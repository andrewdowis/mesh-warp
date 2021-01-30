import React, { useRef, useLoader } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { Box, Plane } from 'drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Test2() {
	const boxRef = useRef()

	useFrame(() => {
		boxRef.current.rotation.y += 0.004
		boxRef.current.rotation.x += 0.004
		boxRef.current.rotation.z += 0.004
	})
	// Set receiveShadow on any mesh that should be in shadow,
	// and castShadow on any mesh that should create a shadow.
	return (
		<group>
			<Box castShadow receiveShadow ref={boxRef} position={[0, 0.5, 0]}>
				<meshStandardMaterial attach="material" color="white" />
			</Box>
			<Plane receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} args={[1000, 1000]}>
				<meshStandardMaterial attach="material" color="white" />
			</Plane>
		</group>
	)
}
