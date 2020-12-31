import * as THREE from 'three'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber'
import { useTransition, a, useSpring } from 'react-spring'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, draco } from 'drei'
import { useBox, usePlane, Physics, useParticle,useTrimesh } from 'use-cannon'
import { Vector3 } from 'three'

function moveFieldByKey(key){
  const keys = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyD: 'moveRight',
    KeyA: 'moveLeft',
    Space: 'jump'
  }
  return keys[key]
}
const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false

  })

  useEffect(()=>{
    const handleKeyDown = (e) => {
      setMovement(m=>({
        ...m,
        [moveFieldByKey(e.code)]:true
      }))
    }
    const handleKeyUp = (e) => {
      setMovement(m=>({
        ...m,
        [moveFieldByKey(e.code)]:false
      }))
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  },[])

  return movement
}

const Spaceship = ({position }) => {
  const {camera} = useThree()
  const { nodes, materials } = useLoader(GLTFLoader, '/3D/aircrafts/aircrafts-draco.gltf', draco())
  const [isFly,setFly] = useState(false)
  const [ref, api] = useBox(() => ({mass: 100, rotation:[3*Math.PI/2,angle,0] }))
  const [angle,setAngle] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [moveZ, setMoveZ] = useState(0)
  const [x, setX] = useState(0)
  const [z, setZ] = useState(0)
  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    jump
  } = usePlayerControls()
  console.log(materials.scene)

  useFrame(()=>{
    // camera
    camera.position.set(15+ref.current.position.x,5,15+ref.current.position.z)
    camera.lookAt(ref.current.position.x,0+ref.current.position.y,ref.current.position.z)
    console.log('x=',ref.current.position.x)
    console.log('z=',ref.current.position.z)
    const direction = new Vector3()

    setAngle(angle+0.025*(Number(moveLeft)-Number(moveRight)))
    if(angle<-360 || angle>360)
      setAngle(0)
    console.log('angle =',angle,'deg')

    // set Forward direction in Polar Coordinates
    setMoveX(10*Math.cos(angle))
    setMoveZ(10*Math.sin(angle))

    // set Directional Vectors
    const frontVector = new Vector3(moveZ*(-Number(moveForward)),ref.current.position.y < 0? 1.5*Number(jump)-5*Number(moveBackward)+Number(moveForward):0,moveX*(-Number(moveForward)))
    const sideVector = new Vector3(0,0,0) // currently not in use

    // combine vectors
    direction.subVectors(frontVector,sideVector).normalize().multiplyScalar(10)
    api.velocity.set(direction.x,direction.y,direction.z)
    // if(ref.current.position.y >0)
    //   ref.current.position.y=0

    // rotate object
    api.rotation.set(
      Math.PI/2,
      Math.PI  +0.1*(Number(moveLeft)-Number(moveRight)),
      angle)


  })

  return (
    <>

    <group   position={isFly?position:[0,-5,0]} scale={[0.1, 0.1, 0.1]}
      ref={ref}
      >
      <group >
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_03_Default_0.geometry} material-color='#252525' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_02_Default_0.geometry} material-color='orange' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_Material25_0.geometry} material-color='white' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_Material26_0.geometry} material-color='red' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_01_Default_0.geometry} material-color='#add8e6' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_08_Default_0.geometry} material-color='grey' />
      </group>
    </group>
    </>
  )
}

export default Spaceship