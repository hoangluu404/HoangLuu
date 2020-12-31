// import './App.css';
// import * as THREE from 'three'

// import { Vector3, TextureLoader, RepeatWrapping } from 'three'
// import React, { useState, useRef, Component, useEffect } from 'react'
// import { Canvas, useLoader, applyProps } from 'react-three-fiber'
// import { OrbitControls, Sky } from 'drei'
// import { useBox, usePlane, Physics } from 'use-cannon'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import FBXLoader from 'three-fbx-loader'
// import SphereBot from './assets/sphere_bot/scene.gltf'
// import { Player } from './Player'
// import dirt from './assets/dirt.jpg'
// import {Camera} from './Camera'

// // listen to key press
// function useKey(key, cb){
//   const callbackRef = useRef(cb)
//   useEffect(()=>{
//     callbackRef.current = cb
//   })

//   useEffect(()=>{
//     function handle(event){
//       if(event.code ===key){
//         callbackRef.current(event)
//       }
//     }
//     document.addEventListener('keypress', handle)
//     return () => document.removeEventListener('keypress', handle)
//   }, [key])
// }


// function Box(props) {
//   const [ref, api] = useBox(() => ({ mass: 1, position: props.position }));
//   return (
//     <mesh
//       onClick={() => {
//         api.velocity.set(0, 2, 0);
//       }}
//       ref={ref}
//       position={[0, 2, 0]}
//     >
//       <boxBufferGeometry attach="geometry" />
//       <meshLambertMaterial attach="material" color={props.color} />
//     </mesh>
//   );
// }

// function App() {

//   // ground texture
//   const texture = new TextureLoader().load(dirt);
//   texture.wrapS = RepeatWrapping;
//   texture.wrapT = RepeatWrapping;
//   texture.repeat.set(240, 240);


//   // ground
//   function Ground(props) {
//     const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
//     return (
//       <mesh ref={ref}>
//         <planeBufferGeometry attach="geometry" args={[200, 200]} />
//         <meshStandardMaterial  attach="material" color="#292929"  />
//       </mesh>
//     )
//   }
  
//   const [camX, setCamX] = useState(15)
//   const [camY, setCamY] = useState(5)
//   const [camZ, setCamZ] = useState(25)

//   var camera, scene, renderer
//   var mouse = new THREE.Vector2()
//   var raycaster = new THREE.Raycaster()
//   var vertex = new THREE.Vector3()

//   camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   )
//   camera.position.x = 15
//   camera.position.y = 5
//   camera.position.z = 15

//   document.addEventListener(
//     'click', event => {
//       mouse.x = event.clientX / window.innerWidth * 2 - 1
//       mouse.y = -(event.clientY / window.innerHeight) * 2 - 1
//       raycaster.setFromCamera(mouse, camera)
//       camera.position.x = mouse.x
//       camera.position.y = mouse.y

//     },
//     false
//   )

//   const Bot = () => {
//     const [model, setModel] = useState()
//     useEffect(()=>{
//       new GLTFLoader().load('/sphere_bot/scene.gltf', setModel)
//     })

//     return model ? <primitive object={model.scene} /> : null 
    
//   }


//   return (
//     <>
//       <Canvas shadowMap sRGB gl={{ alpha: false }}
        
//         onCreated={({ gl, scene }) => {
//           scene.background = new THREE.Color('lightblue');
//           gl.shadowMap.enabled = true;
//           gl.shadowMap.type = THREE.PCFSoftShadowMap;

//         }}>
//           <OrbitControls/>
//         <Sky sunPosition={new Vector3(100, 10, 100)}/>
//         <ambientLight intensity={0.3}/>
//         <pointLight 
//           castShadow
//           intensity={0.8}
//           position={[100, 100, 100]}
//         />
//         <pointLight 
//           castShadow
//           intensity={0.5}
//           position={[100, 10, 100]}
//         />
//         <Camera position={[camX,camY,camZ]} />
   
        
//         <Physics gravity={[0,-30,0]} >
//           <Ground />
          
//           <Box position={[0,10,0]} color='brown' />
//           <Player id='player1' position={[0, 10, 0]} />
//           <Bot></Bot>
//         </Physics>
//       </Canvas>

//     </>
//   );
// }

import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {Canvas, extend, useFrame, useThree, useLoader} from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import './App.css'
import {draco} from 'drei'
extend({OrbitControls})

function Model({ url }) {
  const { nodes, materials } = useLoader(GLTFLoader, url, draco())
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={[7, 7, 7]}>
      <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
        <mesh castShadow receiveShadow geometry={nodes.planet001.geometry} material={materials.scene} />
        <mesh castShadow receiveShadow geometry={nodes.planet002.geometry} material={materials.scene} />
      </group>
    </group>
  )
}

const Helicopter = () => {
  const [model, setModel] = useState(0)
  useEffect(()=>{
    new GLTFLoader().load('../mic/scene.gltf', (e)=>setModel(e))
  })
  console.log(model)
  return model?
    <primitive object={model.scene} position={[0,0,0]} />:null
  
}

const Controls = () => {
  const orbitRef = useRef()
  const {camera, gl} = useThree()
  useFrame(()=>{
    orbitRef.current.update()
  })
  return(
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI/3}
      minPolarAngle={Math.PI/3}
      args={[camera,gl.domElement]}
      ref={orbitRef} />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI/2,0,0]} position={[0, -0.5,0]} receiveShadow >
    <planeBufferGeometry attach='geometry' args={[100,100]} />
    <meshPhysicalMaterial attach='material' color='white' />
  </mesh>
)

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
    scale: active?[1.5,1.5,1.5]:[1,1,1],
    color: !hovered ? 'grey' : 'hotpink'
  })


  return(
    <a.mesh onPointerOver={()=>setHovered(true)}
      onPointerOut={()=>setHovered(false)} 
      onClick={()=>setActive(!active)}
      scale={props.scale}
      castShadow
      >

      <boxBufferGeometry attach='geometry' args={[1,1,1]} />
      <a.meshPhysicalMaterial attach='material' color={props.color} />
    </a.mesh>
  )
}

function App() {
  return(

    <Canvas camera={{position:[0,0,5]}} 
    onCreated={({gl})=>{
      gl.shadowMap.enabled = true
      gl.shadowMap.type = THREE.PCFSoftShadowMap
    }}>

      {/* fog args{ [color, starts, ends] } */}
      <fog attach='fog' args={['white', 10, 20]} />
      <ambientLight />

      <spotLight position={[0,5,10]} penumbra={1} castShadow intensity={2} />
      <Plane />
      <Controls/>
      <Box />
      <Helicopter />
    </Canvas>

  )
}


export default App;

