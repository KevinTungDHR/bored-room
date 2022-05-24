import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './dropdown';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    componentDidMount() {
        this.props.fetchUser();
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }

    // Selectively render links dependent on whether the user is logged in
    getLinks() {
        if (this.props.loggedIn && this.props.user) {
            // if logged in display
            return (
                <Dropdown logout={this.props.logout} user={this.props.user}/>
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
        const inRoom = this.props.history.location.pathname.includes('rooms');
        return (
            <div className="nav-container">
                <div className="left-nav-container">
                    <div className='logo'></div>
                    <Link to="/" className="nav-title"> Bored Room</Link>
                </div>
                <div className='nav-links'>
                    {this.getLinks()}
                </div>
            </div>
        );
    }
}

export default NavBar;