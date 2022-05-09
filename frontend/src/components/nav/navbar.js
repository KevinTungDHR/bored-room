import React from 'react';
import { Link } from 'react-router-dom';

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
                <div className='nav-logout-div'>
                    <button className='logout-btn' onClick={this.logoutUser}>Logout</button>
                    <div className='profile-icon'></div>
                    
                </div>
            );
        } else {
            return (
                <div>
                    <button className="nav-btn"><Link to={'/register'} className="nav-default">Register</Link></button>
                    <button className="nav-btn"><Link to={'/login'} className="nav-default">Login</Link></button>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="nav-container">
                <div>
                    <Link to="/" className="nav-title"> Bored Room</Link>
                </div>
                {this.getLinks()}
            </div>
        );
    }
}

export default NavBar;