import React, { useState, useEffect, useRef } from 'react'
import { useSpring } from '@react-spring/core'
import { a } from "@react-spring/three"
import { useBox } from 'use-cannon'
import {useThree} from 'react-three-fiber'

function useKey(key, cb){
    const callbackRef = useRef(cb)
    useEffect(()=>{
      callbackRef.current = cb
    })
  
    useEffect(()=>{
      function handle(event){
        if(event.code === key){
          callbackRef.current(event)
        }
      }
      document.addEventListener('keypress', handle)
      return () => {
        document.removeEventListener('keypress', handle)
      }
    }, [key])
  }

export const Player = ({ position }, props) => {

  const { camera } = useThree();

    

  const [ active, setActive] = useState(0)
  const activeRef = useRef(active)
  activeRef.current = active
  
  const mesh = useRef(null)

  useEffect(() => {
      let timeout
      const toggleActive = () => {
      timeout = setTimeout(() => {
          setActive(Number(!activeRef.current))
          toggleActive()
      }, Math.random() * 2000 + 1000)
      }
      toggleActive()
      return () => {
      clearTimeout(timeout)
      }
  }, [])

  const { spring } = useSpring({
      spring: active,
      config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
  })

  const scale = spring.to([0, 1], [1, 2])
  const rotation = spring.to([0, 1], [0, Math.PI])
  const color = spring.to([0, 1], ["#DADADA", "#e45858"])
  const jump = spring.to([0,1],[0,10])

  const [ref, api] = useBox(() => ({ mass: 10, position: position, rotation:[Math.random()*10-5,Math.random()*10-5,Math.random()*10-5], ...props }))
  

  return (

    <a.mesh ref={ref}
   
        onAfterRender={
          useKey('KeyD', ()=>{
            api.velocity.set(10,0,0)
          }),
          useKey('KeyA', ()=>{
            api.velocity.set(-10,0,0)
          }),
          useKey('KeyW', ()=>{
            api.velocity.set(0,0,-10)
          }),
          useKey('KeyS', ()=>{
            api.velocity.set(0,0,10)
          }),
          useKey('Space', ()=>{
            api.velocity.set(20*(Math.random()-0.5),20*Math.random(),20*(Math.random()-0.5))
          })

          
        
          
      }
        onClick={()=>{
            // api.velocity.set(0,5,0)
            if(!active)
                api.velocity.set(20*(Math.random()-0.5),0,20*(Math.random()-0.5))

            }} 
      rotation={[0,rotation,0]}
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
      <a.meshStandardMaterial roughness={0.5} attach="material" color={color}/>
    </a.mesh>
  )
}