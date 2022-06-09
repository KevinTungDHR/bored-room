import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './dropdown';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import reindeer from '../../assets/images/reindeer.png';
import controller from '../../assets/images/controller.png';
import gameboy from '../../assets/images/gameboy.png';
import owl from '../../assets/images/owl.png';
import pirahna from '../../assets/images/pirahna.png';
import robot from '../../assets/images/robot.png';
import snowman from '../../assets/images/snowman.png';
import camera from '../../assets/images/camera.png';
import coffee from '../../assets/images/coffee.png';
import redRobot from '../../assets/images/redRobot.png';
import pumpkin from '../../assets/images/pumpkin.png';
import rocket from '../../assets/images/rocket.png';
import user_prof from '../../assets/images/user_prof.png';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    componentDidMount() {
        if(this.props.loggedIn){
            this.props.fetchCurrentUser();
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
                'socrates': socrates,
                'reindeer': reindeer,
                'controller': controller,
                'gameboy': gameboy,
                'owl': owl,
                'pirahna': pirahna,
                'robot': robot,
                'snowman': snowman,
                'camera': camera,
                'coffee': coffee,
                'redRobot': redRobot,
                'pumpkin': pumpkin,
                'rocket': rocket
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