import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

class Lobby extends React.Component {
    constructor(props){
        super(props)
        this.state = { roomName: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        this.setState({ roomName: e.target.value })
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.roomName !== ""){
            this.props.createRoom(this.state.roomName)
        }
    }

    componentDidMount(){
        this.props.fetchAllRooms()
    }

    render() {
        const { rooms } = this.props
        return (
            <div className='lobby-background'>
                <form onSubmit={this.handleSubmit}>
                    <div>Create a Room</div>
                    <input value={this.state.roomName} onChange={this.handleChange}/>
                    <input type="submit" value="Create" />
                </form>

                <ul>
                    {rooms.map(room => {
                        return <li>{room.name} <Link to={`/rooms/${room.code}`}><button>Join Room</button></Link></li>
                    })}
                </ul>
                <div className='lobby-game-1'>

                </div>
                
                <div className="lobby-game-2">
                    
                </div>
            </div>
        );
    }
}

export default Lobby;