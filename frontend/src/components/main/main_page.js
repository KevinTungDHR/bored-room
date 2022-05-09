import React from 'react';
import { motion } from "framer-motion";
import styles from '../../stylesheets/main/main.module.scss';

class MainPage extends React.Component {
    render() {
        return (
            <div className={styles.background}>
                <h1>This is the Homepage</h1>

                <motion.div 
                    className={styles.welcome}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                />

                <footer>
                    Copyright &copy; KevPeteSean
                </footer>
            </div>
        );
    }
}

export default MainPage;