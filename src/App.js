import './App.css';
import * as THREE from 'three'

import { Vector3, TextureLoader, RepeatWrapping } from 'three'
import React, { useState, useRef, Component, useEffect } from 'react'
import { Canvas, useLoader, applyProps } from 'react-three-fiber'
import { OrbitControls, Sky } from 'drei'
import { useBox, usePlane, Physics } from 'use-cannon'
import { useSpring } from '@react-spring/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SphereBot from './assets/sphere_bot/scene.gltf'
import { Player } from './Player'
import dirt from './assets/dirt.jpg'
import {Camera} from './Camera'
import { a } from "@react-spring/three"

function useKey(key, cb){
  const callbackRef = useRef(cb)
  useEffect(()=>{
    callbackRef.current = cb
  })

  useEffect(()=>{
    function handle(event){
      if(event.code ===key){
        callbackRef.current(event)
      }
    }
    document.addEventListener('keypress', handle)
    return () => document.removeEventListener('keypress', handle)
  }, [key])
}

function Bot() {
  const gltf = useLoader(GLTFLoader, SphereBot)
  return <primitive object={gltf.scene} position={[0, 5, 0]} />
}

function Box(props) {
  const [ref, api] = useBox(() => ({ mass: 1, position: props.position }));
  return (
    <mesh
      onClick={() => {
        api.velocity.set(0, 2, 0);
      }}
      ref={ref}
      position={[0, 2, 0]}
    >
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color={props.color} />
    </mesh>
  );
}

function App() {

  // ground texture
  const texture = new TextureLoader().load(dirt);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(240, 240);


  // ground
  function Ground(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
      <mesh ref={ref}>
        <planeBufferGeometry attach="geometry" args={[200, 200]} />
        <meshStandardMaterial  attach="material" color="#e48080" />
      </mesh>
    )
  }
  
  const [camX, setCamX] = useState(15)
  const [camY, setCamY] = useState(5)
  const [camZ, setCamZ] = useState(25)

  var camera, scene, renderer
  var mouse = new THREE.Vector2()
  var raycaster = new THREE.Raycaster()
  var vertex = new THREE.Vector3()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.x = 15
  camera.position.y = 5
  camera.position.z = 15

  document.addEventListener(
    'click', event => {
      mouse.x = event.clientX / window.innerWidth * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 - 1
      raycaster.setFromCamera(mouse, camera)
      camera.position.x = mouse.x
      camera.position.y = mouse.y

    },
    false
  )


  return (
    <>
      <Canvas shadowMap sRGB gl={{ alpha: false }}
        
        onCreated={({ gl, scene }) => {
          scene.background = new THREE.Color('lightblue');
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}>
          <OrbitControls/>
        <Sky sunPosition={new Vector3(100, 10, 100)}/>
        <ambientLight intensity={0.3}/>
        <pointLight 
          castShadow
          intensity={0.8}
          position={[100, 100, 100]}
        />
        <Camera position={[camX,camY,camZ]} />
   
        
        <Physics gravity={[0,-30,0]} >
          <Ground />
          <Box position={[0,10,0]} color='brown' />
          <Player id='player1' position={[0, 10, 0]} />
        </Physics>
      </Canvas>

    </>
  );
}

export default App;

