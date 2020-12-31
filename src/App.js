import * as THREE from 'three'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber'
import { useTransition, a, useSpring } from 'react-spring'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, draco } from 'drei'
import { useBox, usePlane, Physics, useParticle } from 'use-cannon'
import { Vector3 } from 'three'
import Spaceship from './spaceship.js'

const Ground = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return(
    <mesh ref={ref}  rotation={[-Math.PI/2,0,0]} position={[0, -10,0]} receiveShadow >
      <planeBufferGeometry attach='geometry' args={[500,500]} />
      <meshPhysicalMaterial attach='material' color='#171717' />
    </mesh>
)}


function Loading() {
  const [finished, set] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => set(true)
    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
      setWidth((itemsLoaded / itemsTotal) * 200)
  }, [])

  const props = useTransition(finished, null, {
    from: { opacity: 1, width: 0 },
    leave: { opacity: 0 },
    update: { width },
  })

  return props.map(
    ({ item: finished, key, props: { opacity, width } }) =>
      !finished && (
        <a.div className="loading" key={key} style={{ opacity }}>
          <div className="loading-bar-container">
            <a.div className="loading-bar" style={{ width }} />
          </div>
        </a.div>
      ),
  )
}

export default function App() {
  const [rotY, setRotY] = useState(0)

  return (
    <>
      <div className="bg" />
      <h1>
        HOANG:LUU
      </h1>
      <h2>
        404
      </h2>

      <Canvas shadowMap camera={{ position: [15, 15, 15] }}>
        <ambientLight intensity={0.75} />

        <pointLight intensity={1} position={[-10, -25, -10]} />

        <spotLight
          castShadow
          intensity={2.25}
          angle={0.2}
          penumbra={1}
          position={[25, 25, 25]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}

        />


        
        {/* <fog attach="fog" args={['#cc7b32', 20, 40]} /> */}
        {/* <fog attach="fog" args={['#000', 10, 20]} /> */}
        <Physics gravity={[0,-100,0]} >
          <Suspense fallback={null}>
            <Spaceship position={[0,0,0]} />
            <Ground position={[0,-5,0]} />
          </Suspense>
        </Physics>
        {/* <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        /> */}
      </Canvas>
      <div className="layer" />
      <Loading />
      <a href="https://github.com/hoangluu404" className="top-left" children="Github" />
      <a href="https://www.linkedin.com/in/hoangluu0/" className="top-right" children="LinkedIn" />
      {/* <a href="https://github.com/drcmda/react-three-fiber" className="bottom-left" children="+ react-three-fiber" /> */}
    </>
  )
}
