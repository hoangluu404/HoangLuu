import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame, useThree } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, draco } from 'drei'
import { useBox, usePlane, useSphere, Physics, useParticle,useTrimesh,useConvexPolyhedron } from 'use-cannon'

import * as THREE from 'three'





const H = ({position}) => {





  const { nodes, materials } = useLoader(GLTFLoader, '/3D/arrowship.gltf', draco())
  const geo = useMemo(() => new THREE.Geometry().fromBufferGeometry(nodes.Cube.geometry), [nodes])
  const [ref, api] = useBox(() => ({ args:[1,1,1],  mass: 100}))
  


  return (
    <>
    
    <group   position={position} scale={[0.1, 0.1, 0.1]}
      ref={ref}
      >
      <group >
        <mesh castShadow receiveShadow rotation={[0,0,0]} geometry={nodes.Cube.geometry} material-color='#252525' />

      </group>
    </group>
    </>
  )
}

export default H