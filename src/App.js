import * as THREE from 'three'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
import { useTransition, a, useSpring } from 'react-spring'
import { useBox, usePlane, Physics, useParticle } from 'use-cannon'
import Spaceship from './spaceship.js'
import Cube from './cube.js'
import H from './H.js'


const Ground = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return(
    <mesh ref={ref}  rotation={[-Math.PI/2,0,0]} position={[0, -10,0]} receiveShadow >
      <planeBufferGeometry attach='geometry' args={[500,500]} />
      <meshPhysicalMaterial attach='material' color='#272727' />
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
  var wall = []
  for(var i=0; i<15;i++){
    for(var j=0; j<3; j++){
      for(var k=0; k<3; k++){
        wall.push([j,i,k])
      }
    }
  }
  const [close, setClose] = useState(false)

  return (
    <>
      <div className="bg" />
      <div
      style={{ 
        display:'flex',
        flexFlow: 'nowrap',
        justifyContent:'center',
        alignItems:'center',
        position:'fixed',
        left:'0',
        top:'10%', 
        width:'auto',
        fontSize: '2EM',
        zIndex:1,
        // backgroundColor:'#FFF',
        height:'auto',
        width:'100%',
        textAlign:'center',
        color: '#e45858'
        }} >
        HOANGLUU:404
      </div>

      <Canvas shadowMap camera={{ position: [15, 15, 15] }}>
        <ambientLight intensity={0.5} />

        <pointLight intensity={1} position={[-10, -25, -10]} />

        <spotLight
          castShadow
          intensity={2}
          angle={0.2}
          penumbra={1}
          position={[25, 25, 25]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        
        


        
        {/* <fog attach="fog" args={['#008000', 20, 30]} /> */}
        <Physics gravity={[0,-100,0]} >
          <Suspense fallback={null}>
            <Spaceship position={[0,0,0]} />

              {
                wall.map(pos=>(
                  <Cube position={pos}/>
                ))
              }





            <Ground/>
          </Suspense>
        </Physics>
      </Canvas>
      <div className="layer" />
      <Loading />
      <a href="https://github.com/hoangluu404" className="top-left" children="+ Github" />
      <a href="mailto:hoangluu404@gmail.com" className="top-right" children="+ Contact Me" />
      <a href="/HL_Res021121.pdf" className="bottom-left" children="+ Resume" />
      <a href="https://www.youtube.com/watch?v=vdYlHgyqKqY&list=PLqVobqU4h_9CQRUC-GT4DRXWzChzVZfbw" className="bottom-right" children="+ Project Demo" />
      
      
      <div style={{ 
            display:close?'none':'block',
            justifyContent:'center',
            alignItems:'center',
            position:'fixed',
            left:'0',
            bottom:'90px', 
            width:'100%',
            zIndex:1,
            height:'auto',
            width:'100%',
            textAlign:'center',
            color: '#ADADAD',
            }}
            onClick={()=>setClose(true)}
            >
        {(window.innerHeight>400&&window.innerWidth>400)?<>      
        <div style={{marginBottom:'-5px'}}
           className="control"> 
          <img src={'/wasd/w.png'} style={{ height: '50px', width: '50px'}} />
        </div>
        <div> 
          <img src={'/wasd/a.png'} style={{ height: '50px', width: '50px'}} />
          <img src={'/wasd/s.png'} style={{ height: '50px', width: '50px'}} />
          <img src={'/wasd/d.png'} style={{ height: '50px', width: '50px'}} />
        </div>
        <div>Click on Cube for Cube Explosion</div>
        </>:<>
              <div>Tap to find the Spaceship</div>
              <div>Press and hold to explore</div>
              <div>Tap this to close</div>
              
            </>}
      </div>
    </>
  )
}
