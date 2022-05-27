import React from "react";
import { Link } from 'react-router-dom';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import user_prof from '../../assets/images/user_prof.png';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const avatars = {
        //     'noimage': user_prof,
        //     'yoda': yoda,
        //     'monkey': monkey,
        //     'socrates': socrates
        // }

        const { avatar, handle } = this.props.user;
        return (
            // <div className='profile-icon' style={{ backgroundImage: "url(" + avatars[avatar] + ")" }}>
                <div className="dropdown-content">
                    <ul>
                        <Link to="/lobby">Game Lobby</Link>
                        <Link to="/profile">Profile</Link>
                        <li><button className='logout-btn' onClick={this.props.logout}>Logout</button></li>
                        <li>{handle}</li>
                    </ul>
                </div>
            // </div>
           
        )
    }
}

export default Dropdown;