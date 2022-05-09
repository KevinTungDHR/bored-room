import React from 'react';
import { motion } from "framer-motion";
import styles from '../../stylesheets/main/main.module.scss';

class MainPage extends React.Component {
    render() {
        return (
            <div className={styles.background}>
                <div>
                    <motion.div 
                        className={styles.welcome}
                        animate={{ rotate: 360, scale: [0, 0.2, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5] }}
                        transition={{ duration: 1 }}
                    >Welcome to Bored Room!</motion.div>
                </div>

            </div>
        );
    }
}

export default MainPage;