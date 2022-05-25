import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function getCoordinates(event, referenceElement) {
    
    const position = {
        x: event.pageX,
        y: event.pageY
    }

    const offset = {
        left: referenceElement.offsetLeft,
        top: referenceElement.offsetTop,
        width: referenceElement.clientWidth,
        height: referenceElement.clientHeight
    };

    let reference = referenceElement.offsetParent;

    while (reference) {
        debugger
        offset.left += reference.offsetLeft;
        offset.top += reference.offsetTop;
        reference = reference.offsetParent;
    }

    return {
        x: position.x,
        y: position.y - offset.top,
        width: offset.width,
        height: offset.height,
        centerX: (position.x - offset.left - offset.width / 2) / (offset.width),
        centerY: (position.y - offset.top - offset.height / 2) / (offset.height)
    }
}

const css = {
    box: {
        backgroundColor: "linen",
        width: "249px",
        height: "249px",
        position: "relative",
        left: "50%"
    },
    dial: {
        position: "absolute",
        width: "10px",
        height: "200px",
        left: "50%",
        backgroundColor: "red",
        borderTopLeftRadius: "99%",
        borderTopRightRadius: "99%"
    }
}

const Dial = () => {
    const [mousePosition, setMousePosition] = useState({});
    const boxRef = useRef();

    const handleMouseMove = e => {
        setMousePosition(getCoordinates(e, boxRef.current));
    }

    return (
        <motion.div
            ref={boxRef}
            style={{ ...css.box, perspective: 600 }}
            onMouseMove={e => handleMouseMove(e)}
            animate={{
                // rotateX: mousePosition.centerX,
                // rotateY: mousePosition.centerY
            }}
        >
            <motion.div
                style={css.dial}
                animate={{ 
                    rotate: mousePosition.x,
                    // rotate: mousePosition.y
                 }}
            />
        </motion.div>
            
    )
};

export default Dial;



{/* <div className='semi-circle-parent'>
    <div className='semi-circle'>
        <motion.div
            className='dial'
            onMouseMove={ }
        />
    </div> */}