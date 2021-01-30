import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Box, Plane } from 'drei'

import { TextureLoader } from 'three'

import './App.scss'
// import './styles.css'

function Loading() {
	return (
		<mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
			<sphereGeometry attach="geometry" args={[1, 16, 16]} />
			<meshStandardMaterial attach="material" color="white" transparent opacity={0.6} roughness={1} metalness={0} />
		</mesh>
	)
}

function MyPlane() {
	return (
		<group>
			<Plane receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} args={[1000, 1000]}>
				<meshStandardMaterial attach="material" color="white" />
			</Plane>
		</group>
	)
}

function Feets(props) {
	const { nodes } = useLoader(GLTFLoader, `models/${props.model}`, () => {})

	const textureRight = useLoader(TextureLoader, `${props.right}`)
	const textureLeft = useLoader(TextureLoader, `${props.left}`)
	const footRight = useRef(null)
	const footLeft = useRef(null)

	useFrame(({ clock, camera }) => {
		let angle = (clock.getElapsedTime() * 50) % 360
		angle = (Math.PI / 180.0) * angle
		const width = 20
		const radius = width / 2
		camera.position.x = -radius + (radius * Math.cos(angle) + radius)
		camera.position.z = -radius + (radius * Math.sin(angle) + radius)
		camera.lookAt(0, 0, 0)
	})
	useEffect(() => {
		if (nodes) {
			const feets = [footLeft.current, footRight.current]
			feets.forEach((foot, f) => {
				const { rotation, scale, position } = foot

				if (props.model.includes('huge')) {
					scale.x = scale.y = scale.z = 0.000335
				} else {
					scale.x = scale.y = scale.z = 0.5
				}
				const xVal = 1.2
				if (!f) {
					scale.x *= -1
					position.x = xVal
				} else {
					position.x = -xVal
				}
				rotation.y = -3.14
			})
		}
	}, [nodes, footRight])

	return (
		<group>
			<mesh ref={footRight} castShadow receiveShadow visible geometry={nodes.Default.geometry}>
				<meshStandardMaterial attach="material" needsUpdate={true} map={textureRight} color="white" roughness={5.3} metalness={0.3} />
			</mesh>
			<mesh ref={footLeft} castShadow receiveShadow visible geometry={nodes.Default.geometry}>
				<meshStandardMaterial attach="material" needsUpdate={true} map={textureLeft} color="white" roughness={5.3} metalness={0.3} />
			</mesh>
			<MyPlane />
		</group>
	)
}

const Camera = React.forwardRef((props, ref) => {
	const { setDefaultCamera } = useThree()
	useEffect(() => {
		void setDefaultCamera(ref.current)
	}, [])
	useFrame(() => ref.current.updateMatrixWorld())
	return <perspectiveCamera ref={ref} {...props} />
})

export default function App() {
	const camRef = useRef(null)

	const models = useRef([
		{
			faces: '110',
			fileSize: '1.5 MB',
			model: 'foot.glb'
		},
		{
			faces: '1,119,956',
			fileSize: '56 MB',
			model: 'huge.glb'
		}
	]).current
	// const models = useRef(['huge.glb']).current

	useEffect(() => {})

	const left = useRef(`textures/nasa-left-art2.jpg`).current
	const right = useRef(`textures/nasa-right-art2.jpg`).current

	return (
		<div className="container">
			{models &&
				models.length &&
				models.map((data, m) => {
					return (
						<div className="stuff" key={`model${m}`}>
							<h3>{`${data.faces} faces - ${data.fileSize} - No UV Mapping`}</h3>
							<Canvas shadowMap style={{ background: 'gray', width: 500, height: 500 }}>
								<Camera ref={camRef} />
								<Camera ref={camRef} position={[0, 4, 10]} />
								<directionalLight intensity={0.1} />
								{/* <fog attach="fog" args={['white', 0, 40]} /> */}
								<ambientLight intensity={0.1} />
								<directionalLight intensity={0.1} castShadow shadow-mapSize-height={512} shadow-mapSize-width={512} />
								<spotLight castShadow intensity={0.2} args={['white', 1, 100]} position={[-1, 1, 1]} />
								<pointLight castShadow intensity={0.2} args={['white', 1, 100]} position={[1, 1, 1]} />
								<Suspense fallback={<MyPlane />}>
									<Feets left={left} right={right} {...data} />
								</Suspense>
							</Canvas>
							<div className="maps">
								<div className="texture">
									<img src={left} />
									<p>LEFT FOOT TEXTURE</p>
								</div>
								<div className="texture">
									<img src={right} />
									<p>RIGHT FOOT TEXTURE</p>
								</div>
							</div>
						</div>
					)
				})}
		</div>
	)
}
