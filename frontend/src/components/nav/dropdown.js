import React from "react";
import { Link } from 'react-router-dom';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='profile-icon'>
                <div className="dropdown-content">
                    <ul>
                        <Link to="/profile">Profile</Link>
                        <li><button className='logout-btn' onClick={this.props.logout}>Logout</button></li>
                    </ul>
                </div>
            </div>
           
        )
    }
}

export default Dropdown;