import React from "react";
import { motion, useAnimation } from "framer-motion";

export const ProfileMotion = () => {

    const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    }
    function template({ rotate, x }) {
        return `rotate(${rotate}) translateX(${x})`
    }

    return (
        <motion.div className="motion-one"
            transformTemplate={template}
            transition={{duration: 2}}
            animate={{ rotate: 360 }}
            style={{ rotate: 0, x: "calc(20vh - 100px)" }}
        />
    )

    // return (
    //     <div>
    //         <div className="target">Container</div>
            
    //         <div className="contain">
    //             {[1, 2, 3, 4, 5].map((block, i) => {
    //                 return (
    //                     // <motion.div className="motion-one" animate={{
    //                     //     y: 100, x: -100
    //                     // }} transition={{ delay: i + 1, duration: 0.2 }} whileHover={{ scale: 3 }} />
    //                     <motion.div className="motion-one" 
    //                         animate={{  }} 
    //                     />
    //                 )
    //             })}
    //         </div>
    //     </div>
    // )

        
}
