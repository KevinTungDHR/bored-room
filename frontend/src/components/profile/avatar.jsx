import React from 'react';
import yoda from '../../assets/images/yoda.png';
import monkey from '../../assets/images/coolMonkey.png';
import socrates from '../../assets/images/socrates.png';
import { receiveErrors } from '../../actions/session_actions';

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault()
        const user = Object.assign({}, this.props.user, { avatar: e.target.value});
        this.props.updateUser(user)
            .then(() => this.props.closeModal())
    }

    render() {
        
        return (
            <div className='avatar-outer' >
                <div className="avatar-container">
                    <button onClick={this.handleClick} value="monkey" className='profile-avatar-modal' style={{ backgroundImage: "url(" + monkey + ")" }}></button>
                    <button onClick={this.handleClick} value="yoda" className='profile-avatar-modal' style={{ backgroundImage: "url(" + yoda + ")" }}></button>
                    <button onClick={this.handleClick} value="socrates" className='profile-avatar-modal' style={{ backgroundImage: "url(" + socrates + ")" }}></button>
                </div>
            </div>
        )
    }
}

export default Avatar;