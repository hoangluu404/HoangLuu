import React, { useState, useEffect, useRef } from 'react'
import { a, useSpring } from "react-spring"
import { useBox } from 'use-cannon'


const Cube = ({ position }, props) => {
  const [ active, setActive] = useState(0)
  const activeRef = useRef(active)
  activeRef.current = active

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

  // const { spring } = useSpring({
  //     spring: active,
  //     config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 }
  // })
  var rand = Math.floor(Math.random() * Math.floor(10))
  // console.log('ran', rand)
  const color = ["#94FF8E", "#DADADA", "#8EF6FF", "#A38EFF", "#e45858"]
  // const color = "#DADADA"
  // spring.to([0, 1], ["#DADADA", "#e45858"])


  const [ref, api] = useBox(() => ({ mass: 10, position: position, ...props }))
  
  return (

    <mesh ref={ref}
    onClick={()=>{
        if(!active)
            api.velocity.set(100*(Math.random()-0.5),100*Math.random(),100*(Math.random()-0.5))
        }} 
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
      <meshStandardMaterial roughness={0.5} attach="material" color={color[rand]}/>
    </mesh>
  )
}

export default Cube