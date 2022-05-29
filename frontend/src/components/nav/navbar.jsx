import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './dropdown';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    componentDidMount() {
        if(this.props.loggedIn){
            this.props.fetchUser(this.props.user._id);
        }
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }

    // Selectively render links dependent on whether the user is logged in
    getLinks() {
        if (this.props.loggedIn && this.props.user) {
            // if logged in display
            const { avatar } = this.props.user;
            const avatars = {
                'noimage': user_prof,
                'yoda': yoda,
                'monkey': monkey,
                'socrates': socrates
            };

            return (
                <div className='right-nav'>
                    <Link to={'/about'} className='about-link'>About the Developer Team</Link>
                    <div className='profile-icon' style={{ backgroundImage: "url(" + avatars[avatar] + ")" }}>
                        <Dropdown logout={this.props.logout} user={this.props.user}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Link to={'/about'} className='about-link'>About the Developer Team</Link>
                    <Link to={'/register'} className="nav-default"><button className="nav-btn">Register</button></Link>
                    <Link to={'/login'} className="nav-default"><button className="nav-btn">Login</button></Link>
                </div>
            );
        }
    }

    render() {
        const inRoom = this.props.history.location.pathname.includes('rooms');
        return (
            <div className="nav-container">
                <div className="left-nav-container">
                    <Link to="/" className='logo'></Link>
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