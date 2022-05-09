import React from "react";
import { Link } from 'react-router-dom';

class ProfDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dropdown">
                <img src={window.user_prof} className='prof-icon' />
                <div className="dropdown-content">
                    <Link to='/' className='logout-link' onClick={this.props.handleLogout}>
                        Logout
                    </Link>
                </div>
            </div>
        )
    }
}

export default ProfDropdown;