import React from 'react';
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

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    handleClick(e) {
        e.preventDefault()
        const user = Object.assign({}, this.props.user, { avatar: e.target.value});
        this.props.updateUser(user)
            .then(() => this.props.closeModal())
    }

    handleExit(e) {
        e.preventDefault()
        
        if (e.target.classList[0] === ("avatar-outer")) {
            this.props.closeModal();
        }
    }

    render() {
        
        return (
            <div className='avatar-outer' onClick={this.handleExit}>
                <div className="avatar-container">
                    <button onClick={this.handleClick} value="monkey" className='profile-avatar-modal' style={{ backgroundImage: "url(" + monkey + ")" }}></button>
                    <button onClick={this.handleClick} value="yoda" className='profile-avatar-modal' style={{ backgroundImage: "url(" + yoda + ")" }}></button>
                    <button onClick={this.handleClick} value="socrates" className='profile-avatar-modal' style={{ backgroundImage: "url(" + socrates + ")" }}></button>
                    <button onClick={this.handleClick} value="reindeer" className='profile-avatar-modal' style={{ backgroundImage: "url(" + reindeer + ")" }}></button>
                    <button onClick={this.handleClick} value="controller" className='profile-avatar-modal' style={{ backgroundImage: "url(" + controller + ")" }}></button>
                    <button onClick={this.handleClick} value="gameboy" className='profile-avatar-modal' style={{ backgroundImage: "url(" + gameboy + ")" }}></button>
                    <button onClick={this.handleClick} value="owl" className='profile-avatar-modal' style={{ backgroundImage: "url(" + owl + ")" }}></button>
                    <button onClick={this.handleClick} value="pirahna" className='profile-avatar-modal' style={{ backgroundImage: "url(" + pirahna + ")" }}></button>
                    <button onClick={this.handleClick} value="robot" className='profile-avatar-modal' style={{ backgroundImage: "url(" + robot + ")" }}></button>
                    <button onClick={this.handleClick} value="snowman" className='profile-avatar-modal' style={{ backgroundImage: "url(" + snowman + ")" }}></button>
                    <button onClick={this.handleClick} value="camera" className='profile-avatar-modal' style={{ backgroundImage: "url(" + camera + ")" }}></button>
                    <button onClick={this.handleClick} value="coffee" className='profile-avatar-modal' style={{ backgroundImage: "url(" + coffee + ")" }}></button>
                    <button onClick={this.handleClick} value="redRobot" className='profile-avatar-modal' style={{ backgroundImage: "url(" + redRobot + ")" }}></button>
                    <button onClick={this.handleClick} value="pumpkin" className='profile-avatar-modal' style={{ backgroundImage: "url(" + pumpkin + ")" }}></button>
                    <button onClick={this.handleClick} value="rocket" className='profile-avatar-modal' style={{ backgroundImage: "url(" + rocket + ")" }}></button>

                </div>
            </div>
        )
    }
}

export default Avatar;