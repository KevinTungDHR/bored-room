import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { io } from 'socket.io-client';
import * as RoomAPIUtil from '../../util/rooms_util';
import bull_logo from '../../assets/images/bull_logo.png';
import { GiBull } from 'react-icons/gi';
import { GiSundial } from 'react-icons/gi';

const socket = io();
class Lobby extends React.Component {
    constructor(props){
        super(props)
        this.state = { roomName: "", search: "", game: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleGameChange = this.handleGameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }

    handleChange(e){
        let newState = this.state;
        newState.roomName = e.target.value;
        this.setState({ ...newState })
    }

    updateSearch(e) {
        let newState = this.state;
        newState.search = e.target.value;
        this.setState({ ...newState })
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.roomName !== "" && this.state.game !== ""){
            RoomAPIUtil.createRoom(this.state.roomName, this.state.game)
        }

        this.setState({ roomName: ""});
    }

    handleRoomDelete(roomCode) {
        RoomAPIUtil.deleteRoom(roomCode)
    }

    componentDidMount(){
        socket.emit("join_lobby");
        socket.on("room_created", (room) => this.props.receiveRoom(room));
        socket.on("room_deleted", (roomCode) => this.props.removeRoom(roomCode));
        socket.on("room_updated", (room) => this.props.receiveRoom(room));
        this.props.fetchAllRooms()
    }

    componentWillUnmount(){
        socket.emit("leave_lobby");
        socket.removeAllListeners();
    }

    handleGameChange(e){
        const prevSelection = document.getElementsByClassName("selected")
        if (prevSelection.length > 0) {
            prevSelection[0].classList.remove("selected");
        }
            
        if (!e.target.getAttribute("value")) {
            const gameTile = e.target.parentElement;
            this.setState({ game: gameTile.getAttribute("value")})
            gameTile.classList.add("selected");
        } else {
            e.target.classList.add("selected");
            this.setState({ game: e.target.getAttribute("value")})
        }
    }

    render() {
        const { rooms } = this.props;
        let count = 0;
        let sign = 2000;

        return (
            <div className='lobby-background'>
                {/* <div className='select-game-wrapper'>
                    <div className='six-game-logo' value="Taking Six" onClick={this.handleGameChange} >
                        <img className='tile-logo' src={bull_logo} height="160px" width="160px" />
                        <h1 className='six-title-tile'>Taking Six</h1>
                    </div>

                    <div className='freq-game-logo' value="Frequency" onClick={this.handleGameChange}>
                        <h1 className='freq-title-tile'>Frequency</h1>
                    </div>

                </div> */}
                
                <div className='search-container'>
                    <form className='create-room' onSubmit={this.handleSubmit}>
                        <div className='flex'>
                            <div className='select-game-wrapper'>
                                <h1>1. Choose a Game: </h1>
                                <div className='six-game-logo' value="Taking Six" onClick={this.handleGameChange} >
                                    <img className='tile-logo' src={bull_logo} height="160px" width="160px" />
                                    <h1 className='six-title-tile'>Taking Six</h1>
                                </div>

                                <div className='freq-game-logo' value="Frequency" onClick={this.handleGameChange}>
                                    <h1 className='freq-title-tile'>Frequency</h1>
                                    <GiSundial height="160px" width="160px" />
                                </div>

                            </div>
                            <h1>2. Create a Room</h1>
                            <div>
                                <input className='create-room-input' value={this.state.roomName} onChange={this.handleChange} placeholder="Enter a room name" />
                                <input className='create-btn' type="submit" value="Create" />
                            </div>
                        </div>
                    </form>

                    <form className='search-rooms'>
                        <div className='flex'>
                            <div className='search-title'>Search for a Room</div>
                            <div>
                                <input className='search-room-input' value={this.state.search} onChange={this.updateSearch} />
                                {/* <input className='create-btn' type="submit" value="Search" /> */}
                            </div>
                        </div>
                    </form>
                </div>

                <ul className='lobby-rooms'>
                    {rooms.slice().reverse().map((room, idx) => {
                        
                        if (room.name.toLowerCase().startsWith(this.state.search.toLowerCase())) {
                            count += 1;
                            if (count === 4) {
                                count = 0;
                                sign = sign * -1;
                            }

                            return <motion.li key={idx} className='room-container' animate={{ x: [sign, 0], scale: [0.1, 1] }} transition={{ ease: "easeOut", duration: 0.8 }}>
                            <h1>{room.name}</h1>
                            <div>
                                <ul>
                                    {room.seatedUsers.map((user, i) => {
                                        if (user.handle) {
                                            return (
                                                <li key={i}>{user.handle + " " + user.eloRating}</li>
                                            )
                                        }
                                        
                                    })}
                                </ul>
                            </div>
                            <Link to={`/rooms/${room.code}`}><button className='join-btn'>Join Room</button></Link>
                            <button className='delete-btn' onClick={() => this.handleRoomDelete(room.code)}>Delete Room</button>
                        </motion.li>
                        }
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