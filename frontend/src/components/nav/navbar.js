import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.scss';

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
                    <Link to={'/register'} className={styles.btn}>Register</Link>
                    <Link to={'/login'} className={styles.btn}>Login</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <h1>Bored Room</h1>
                {this.getLinks()}
            </div>
        );
    }
}

export default NavBar;