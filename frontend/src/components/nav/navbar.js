import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../stylesheets/navbar/navbar.module.scss';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }

    // Selectively render links dependent on whether the user is logged in
    getLinks() {
        if (this.props.loggedIn) {

            // if logged in display
            return (
                <div>
                    <button onClick={this.logoutUser}>Logout</button>
                </div>
            );
        } else {
            return (
                <div>
                    <button className={styles.btn}><Link to={'/register'} className={styles.default}>Register</Link></button>
                    <button className={styles.btn}><Link to={'/login'} className={styles.default}>Login</Link></button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <div>
                    <h1 className={styles.title}>Bored Room</h1>
                </div>
                {this.getLinks()}
            </div>
        );
    }
}

export default NavBar;