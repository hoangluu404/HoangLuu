import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, draco } from 'drei'
import { useBox, usePlane, useSphere, Physics, useParticle,useTrimesh,useConvexPolyhedron } from 'use-cannon'
import { Vector3 } from 'three'

import { a, useSpring } from 'react-spring'


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



const Spaceship = ({position}) => {

  const [mobile, setMobile] = useState(0)
  const [active, setActive] = useState(false)
  const activeRef = useRef(active)
  const [pressed, setPressed] = useState(false)


  const handleDown = () => {
    setPressed(true)
    setMobile(false)
  }
  
  const handleUp = () => {
    setMobile( (Math.floor(Math.random() * Math.floor(2)))==1?1:-1 )
  }

  activeRef.current = active
//   const { spring } = useSpring({
//     spring: active,
//     config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
// })
  const color = "#e45858"
  // spring.to([0, 1], ["#FFF", "#e45858"])

  useEffect(() => {
    let timeout
    const toggleActive = () => {
      timeout = setTimeout(() => {
          setActive(Number(!activeRef.current))
          toggleActive()
      }, Math.random() * 2000)
    }
    toggleActive()
    return () => {
    clearTimeout(timeout)
    }
  }, [])

  const {camera} = useThree()
  const { nodes, materials } = useLoader(GLTFLoader, '/3D/aircrafts-draco.gltf', draco())
  // const [geo] = useMemo(() => new THREE.Geometry().fromBufferGeometry(nodes.Box002_Material25_0.geometry), [nodes])
  const [ref, api] = useSphere(() => ({    mass: 100, rotation:[3*Math.PI/2,angle,0] }))
  const [angle,setAngle] = useState(0)
  const [moveX, setMoveX] = useState(0)
  const [moveZ, setMoveZ] = useState(0)
  const {
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    jump
  } = usePlayerControls()

  useFrame(()=>{
    // camera
    camera.position.set(15+ref.current.position.x,10,ref.current.position.z)
    camera.lookAt(ref.current.position.x,ref.current.position.y,ref.current.position.z)

    const direction = new Vector3()

    setAngle(angle+0.025*(Number(moveLeft)-Number(moveRight)-Number(mobile)))
    if(angle<-360 || angle>360)
      setAngle(0)

    // set Forward direction in Polar Coordinates
    setMoveX(10*Math.cos(angle))
    setMoveZ(10*Math.sin(angle))

    // set Directional Vectors
    const frontVector = new Vector3(
      // x
      moveZ*(-Number(moveForward)-Number(moveRight)-Number(moveLeft)-Number(pressed)),
      
      // y
      ref.current.position.y < 7? 
        -5*Number(moveBackward)
        +2*Number(moveForward)
        +0.001*Number(pressed)
        :0.001*Number(moveForward),

      //z
      moveX*(-Number(moveForward)-Number(moveRight)-Number(moveLeft)-Number(pressed)))
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
    
    <group  onPointerDown={()=>handleDown()} onPointerOut={()=>handleUp()} position={position} scale={[0.1, 0.1, 0.1]}
      ref={ref}
      >
      <group >
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_03_Default_0.geometry} material-color='#252525' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_02_Default_0.geometry} material-color={color} />
        <mesh castShadow receiveShadow  rotation={[0,0,0]} geometry={nodes.Box002_Material25_0.geometry} material-color='white' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_Material26_0.geometry} material-color={color} />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_01_Default_0.geometry} material-color='#add8e6' />
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Box002_08_Default_0.geometry} material-color='grey' />
      </group>
    </group>


    </>
  )
}

export default Spaceship