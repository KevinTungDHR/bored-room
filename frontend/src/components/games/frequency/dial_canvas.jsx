import React, { useEffect, useRef, useState } from 'react';

const DialCanvas = props => {
  const canvasRef = useRef(null);

  let { draw, setGuess, updateGuess, ...rest } = props;
  let [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    const canvas = canvasRef.current;
    const context= canvas.getContext("2d");

    draw(context)
  }, [draw])

  const startDrag = (e) => {
    setIsDragging(true)
  }

  const endDrag = (e) => {
    setIsDragging(false)
    updateGuess();
  }

  const handleMouseMove = (e) => {
    if(isDragging){
      const canvas = canvasRef.current;
      let rect = canvas.getBoundingClientRect()

      let point = { x: e.clientX - rect.left - 315, 
        y: e.clientY - rect.top - 350}

      setGuess(Math.floor(calculateDegrees(point)));
    }
  }
  const calculateDegrees = (point) => {
    const b = {x: 0, y: 0}
    const c = {x: -315, y: 0}
    let ab = Math.sqrt(Math.pow(b.x - point.x, 2) + Math.pow(b.y - point.y, 2)) 
    let bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2)) 
    let ac = Math.sqrt(Math.pow(c.x - point.x, 2) + Math.pow(c.y - point.y, 2)) 
    return Math.acos((bc*bc+ab*ab-ac*ac) / (2*bc*ab)) * (180 / Math.PI); 
  }

  return <canvas ref={canvasRef} {...rest} onMouseMove={handleMouseMove} onMouseDown={startDrag} onMouseUp={endDrag} onMouseLeave={endDrag}/>
}

export default DialCanvas;