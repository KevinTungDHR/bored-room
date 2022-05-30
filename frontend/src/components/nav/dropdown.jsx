import React from "react";
import { Link } from 'react-router-dom';

const Dropdown = ({user, logout}) => {
    return (
        <div className="dropdown-content">
            <ul>
                <Link to="/lobby">Game Lobby</Link>
                <Link to={`/profile/${user._id}`}>Profile</Link>
                <li id="logout-border"><button className='logout-btn' onClick={logout}>Logout</button></li>
                <li>{user.handle}</li>
            </ul>
        </div>
    )
}

export default Dropdown;