import React from "react";
import { Link } from 'react-router-dom';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { handle } = this.props.user;
        return (
                <div className="dropdown-content">
                    <ul>
                        <Link to="/lobby">Game Lobby</Link>
                        <Link to="/profile">Profile</Link>
                        <li id="logout-border"><button className='logout-btn' onClick={this.props.logout}>Logout</button></li>
                        <li>{handle}</li>
                    </ul>
                </div>
            // </div>
           
        )
    }
}

export default Dropdown;