import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

class MainPage extends React.Component {
    render() {
        return (
            <div className="main-background">
                <div className="main-card">
                    <motion.div 
                        className='main-welcome'
                        animate={{ rotate: 360, scale: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }}
                        transition={{ duration: 0.5 }}>
                            <div>
                                <h1>Welcome to</h1>
                                <span>Bored Room</span>
                                <p>Play your favorite board games with friends and family!</p>
                            </div>
                    </motion.div>
                </div>

            </div>
        );
    }
}

export default MainPage;