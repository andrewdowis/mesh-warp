import { useEffect, useState, useRef } from 'react'
// import * as THREE from 'three'

// import sockModel from './assets/models/Mannequin_Scan_millimeters.obj'
// import glb from './assets/models/sock2.gltf'
// import { GLTFLoader } from 'three/examples/js/loaders/GLTFLoader'

function Test(props) {
	const stageRef = useRef('tits')
	// const [rendered, setRender] = useState(false)

	useEffect(() => {
		if (stageRef) {
			// const scene = new THREE.Scene()
			// var renderer = new THREE.WebGLRenderer({
			// 	antialias: true
			// })
			// stageRef.current.appendChild(renderer.domElement)
			// renderer.setClearColor('black')
			// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
			// var light = new THREE.PointLight(0xffffff, 0.3)
			// // A dim viewpoint light, so there is always at least some illumination.
			// camera.position.z = 35
			// camera.position.y = 15
			// camera.lookAt(new THREE.Vector3(0, 0, 0))
			// camera.add(light) // viewpoint light moves with camera
			// scene.add(camera)
			// renderer.shadowMap.enabled = true // This is required for this renderer to
			// // do shadow computations.  Note that
			// // renderer.setSize(width,height) must also be
			// // called for the rendering with shadows to work.
			// renderer.setSize(window.innerWidth, window.innerHeight)
			// /* The base on which the objects rest. */
			// const base = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), new THREE.MeshPhongMaterial({ color: 'white' }))
			// base.rotation.x = -Math.PI / 2 // Rotate so it's parallel to xz-plane.
			// base.position.y = -3 // The "floor" is lowered 3 units.
			// base.receiveShadow = true // This allows shadows to be rendered onto the base.
			// scene.add(base)
			// /* Due to a bug(?) in three.js, shadows are rendered onto the back (non-illuminated) side
			//  of the base.  So, instead of making the base material two-sided, I hide the back with
			//  another plane that does not receive shadows. */
			// var baseBack = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), new THREE.MeshPhongMaterial({ color: 'white' }))
			// baseBack.rotation.x = Math.PI / 2
			// baseBack.position.y = -3.01
			// scene.add(baseBack)
			// /* Create the three objects that cast shadows. */
			// const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 20), new THREE.MeshPhongMaterial({ color: 0x00aa99 }))
			// sphere.position.set(6, 0, 3)
			// sphere.castShadow = true // This allows the sphere to cast a shadow.
			// scene.add(sphere)
			// const bar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 16, 1), new THREE.MeshPhongMaterial({ color: 0xbb9900 }))
			// bar.rotation.z = Math.PI / 2
			// bar.position.set(-5, -1, 1)
			// bar.castShadow = true // This allows the bar to cast a shadow.
			// scene.add(bar)
			// const cyl = new THREE.Mesh(new THREE.CylinderGeometry(1, 2, 7, 5, 1), new THREE.MeshPhongMaterial({ color: 0xcc77ee }))
			// cyl.position.set(1, 0.5, -5)
			// cyl.castShadow = true // This allows the cylinder to cast a shadow.
			// cyl.receiveShadow = true // Shadows can also be cast onto cyl.
			// scene.add(cyl)
			// /* Create a directional light that casts shadows. Also make a small sphere that
			//  will be in the same position as the light.  Put the light and the sphere into
			//  another object that is used to animate the light/sphere position. */
			// var light1 = new THREE.DirectionalLight(0xffffff, 0.7)
			// light1.castShadow = true // allows the light to cast shadows
			// light1.shadow.camera.near = 1 // Note: It is VITAL to set the shadow camera properties!
			// light1.shadow.camera.far = 30
			// light1.shadow.camera.left = -20
			// light1.shadow.camera.bottom = -20
			// light1.shadow.camera.right = 20
			// light1.shadow.camera.top = 20
			// light1.shadow.mapSize.width = 1024
			// light1.shadow.mapSize.height = 1024
			// light1.position.set(10, 10, 0)
			// const firstLight = new THREE.Object3D()
			// firstLight.add(light1)
			// scene.add(firstLight)
			// /* Now create a spotlight that casts its own set of shadows. */
			// var light2 = new THREE.SpotLight(0xffffff, 0.7)
			// light2.castShadow = true
			// light2.shadow.camera.near = 10
			// light2.shadow.camera.far = 50
			// light2.shadow.camera.fov = 45
			// light2.shadow.mapSize.Width = 1024
			// light2.shadow.mapSize.height = 1024
			// light2.position.set(-15, 2, 10)
			// const secondLight = new THREE.Object3D()
			// secondLight.add(light2)
			// scene.add(secondLight)
			// const helper1 = new THREE.DirectionalLightHelper(light1, 1)
			// scene.add(helper1)
			// const helper2 = new THREE.DirectionalLightHelper(light2, 1)
			// scene.add(helper2)
			// const loader = new GLTFLoader(THREE)
			// console.log(loader)
			// // console.error('start load')
			// // loader.load(
			// // 	// resource URL
			// // 	glb,
			// // 	// called when the resource is loaded
			// // 	function(gltf) {
			// // 		console.log('Load complete')
			// // 		scene.add(gltf.scene)
			// // 		// gltf.animations // Array<THREE.AnimationClip>
			// // 		// gltf.scene // THREE.Group
			// // 		// gltf.scenes // Array<THREE.Group>
			// // 		// gltf.cameras // Array<THREE.Camera>
			// // 		// gltf.asset // Object
			// // 		renderer.render(scene, camera)
			// // 	},
			// // 	// called while loading is progressing
			// // 	function(xhr) {
			// // 		console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
			// // 	},
			// // 	// called when loading has errors
			// // 	function(error) {
			// // 		console.log('An error happened')
			// // 	}
			// // )
			// // const object = objLoader.parse(glb)
			// // scene.add(object)
			// // console.warn('OBJ')
			// // console.log(sockModel)
			// // console.log(object)
			// // renderer.render(scene, camera)
		} // end createWorld();
	})

	return <div ref={stageRef} />
}

export default Test
