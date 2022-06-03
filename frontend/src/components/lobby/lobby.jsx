import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from "framer-motion";
import { io } from 'socket.io-client';
import * as RoomAPIUtil from '../../util/rooms_util';
import bull_logo from '../../assets/images/bull_logo.png';
import { GiBull, GiSundial, GiPeaks } from 'react-icons/gi';
import RoomCard from './room_card';

const socket = io();
class Lobby extends React.Component {
    constructor(props){
        super(props)
        this.state = { roomName: "", search: "", game: "", errors: "", roomType: 0 };

        this.handleChange = this.handleChange.bind(this);
        this.handleGameChange = this.handleGameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.selectRoomType = this.selectRoomType.bind(this);
    }

    camelize = (str) => {
        return str.replace(/(?:^\w|\[A-Z\]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
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
        if(this.state.game === ""){
            this.setState({ errors: "Please select a game"})
            return;
        }

        if(this.state.roomName === ""){
            this.setState({ errors: "Room name can't be blank"})
            return;
        }

        RoomAPIUtil.createRoom({ ...this.state, creator: this.props.currentUser._id }, this.camelize(this.state.game))

        this.setState({ roomName: "", errors: "" });
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
        const prevSelection = document.getElementsByClassName("selected");
        if (prevSelection.length > 0) {
            prevSelection[0].classList.remove("selected");
        }
        if (!e.target.getAttribute("value") && (!e.target.getAttribute("d"))) {
            const gameTile = e.target.parentElement;
            this.setState({ game: gameTile.getAttribute("value"), teamGame: e.currentTarget.dataset.teamgame === 'true' })
            gameTile.classList.add("selected");
        } else if (e.currentTarget.classList[0] === "freq-game-logo") {
            const div = document.getElementsByClassName("freq-game-logo");
            this.setState({ game: "Frequency", teamGame: e.currentTarget.dataset.teamgame === 'true' })
            div[0].classList.add("selected");
        } else if (e.currentTarget.classList[0] === 'dont-stop-game-tile') {
            const div = document.getElementsByClassName("dont-stop-game-tile");
            div[0].classList.add("selected");
            this.setState({ game: e.target.getAttribute("value"), teamGame: e.currentTarget.dataset.teamgame === 'true' })
        }

        this.setState({errors: ""})
    }

    selectRoomType(e){
        e.preventDefault()
        this.setState({ roomType: e.currentTarget.value })
    }

    renderRooms(){
        const { rooms, currentUser } = this.props;

        let filteredRooms;
        if(this.state.roomType === 0){
            filteredRooms = rooms.filter(room => !room.gameStarted)
        } else if (this.state.roomType === 1){
            filteredRooms = rooms.filter(room => room.gameStarted && !room.gameOver)
        } else if (this.state.roomType === 2) {
            filteredRooms = rooms.filter(room => room.gameOver);
        } else {
            return
        }

        filteredRooms = filteredRooms.filter(room => room.name.toLowerCase().startsWith(this.state.search.toLowerCase()))

        if (filteredRooms.length === 0) {
            return <div>No rooms found</div>
        }

        return filteredRooms.slice().reverse().map((room, idx) => {
            return <RoomCard key={idx} room={room} handleRoomDelete={this.handleRoomDelete}/>
        })
    }

    render() {
        const { currentUser } = this.props;
        let count = 0;
        let sign = 2000;

        return (
            <div className='lobby-background'>
                <nav className='lobby-navbar'>
                    <ul className='lobby-navlist'>
                        <NavLink className='navlink-selected' to='/lobby'>Game Lobby</NavLink>
                        <NavLink to='/users'>Players</NavLink>
                        <NavLink to={`/profile/${currentUser._id}`}>View My Profile</NavLink>
                    </ul>
                </nav>
                {/* <h1 className='lobby-head'>Welcome to the <span id='logo'>Bored Room</span></h1>           */}
                    <form className='create-room' onSubmit={this.handleSubmit}>
                        <div className='flex'>
                            <h1>1. Choose a Game: </h1>
                            <div className='select-game-wrapper'>
                                <div className='six-game-logo' data-teamgame={false} value="Taking Six" onClick={this.handleGameChange} >
                                    <GiBull height="160px" width="160px" className='gi-bull-top-left' />
                                    <GiBull height="160px" width="160px" className='gi-bull-top-right' />
                                    <GiBull height="160px" width="160px" className='gi-bull-bot-left' />
                                    <GiBull height="160px" width="160px" className='gi-bull-bot-right' />
                                    <img className='tile-logo' src={bull_logo} height="160px" width="160px" />
                                    <h1 className='six-title-tile'>Taking Six</h1>
                                </div>

                                <div className='freq-game-logo' data-teamgame={true} value="Frequency" onClick={this.handleGameChange}>
                                    <h1 className='freq-title-tile'>Frequency</h1>
                                    <GiSundial size={150} color="turquoise" style={{
                                        position: "absolute",
                                        right: "15%"
                                    }}/>
                                </div>

                                <div className='dont-stop-game-tile' data-teamgame={false} value="Dont Stop" onClick={this.handleGameChange}>
                                    <GiPeaks className='dont-stop-icon' size={150} />
                                    <h1 className='dont-stop-tile-title'>Don't Stop</h1>
                                    <h1 className='game-tile-coming-soon'>Coming Soon</h1>
                                </div>
                            </div>
                        </div>
                        <div className='right-side-flex'>
                            <div className='create-room-input-container'>
                                <h1>2. Create a Room</h1>
                                <div>
                                    <input className='create-room-input' value={this.state.roomName} onChange={this.handleChange} placeholder="Enter a room name" />
                                    <input className='create-btn' type="submit" value="Create" />
                                </div>
                            </div>
                            {this.state.errors !== "" ? <div className='create-room-errors'>{this.state.errors}</div> : null}
                            <div className='search-rooms'>
                                <div className='flex'>
                                    <div className='search-title'>Search for a Room</div>
                                    <div>
                                        <input className='search-room-input' value={this.state.search} onChange={this.updateSearch} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                <nav className='room-status-navbar'>
                    <ul className='room-status-navlist'>
                        <li className='room-status-navlist-item' value={0} onClick={this.selectRoomType}>New Rooms</li>
                        <li className='room-status-navlist-item' value={1} onClick={this.selectRoomType}>Ongoing</li>
                        <li className='room-status-navlist-item' value={2} onClick={this.selectRoomType}>Finished</li>
                    </ul>
                </nav>
                <div className='new-lobby-rooms'>
                    <ul className='new-rooms-list'>
                     {this.renderRooms()}
                    </ul>
                </div>

                {/* <ul className='lobby-rooms'>
                    {rooms.slice().reverse().map((room, idx) => {
                        
                        if (room.name.toLowerCase().startsWith(this.state.search.toLowerCase())) {
                            count += 1;
                            if (count === 4) {
                                count = 0;
                                sign = sign * -1;
                            }

                            return <motion.li key={idx} className='room-container' animate={{ x: [sign, 0], scale: [0.1, 1] }} transition={{ ease: "easeOut", duration: 0.8 }}>
                            <h1>{room.name}</h1>
                            <h2>{room.game}</h2>
                            <div className='room-members'>
                                {this.renderUsers(room)}
                            </div>
                            <Link to={`/rooms/${room.code}`}><button className='join-btn'>Join Room</button></Link>
                            <button className='delete-btn' onClick={() => this.handleRoomDelete(room.code)}>Delete Room</button>
                        </motion.li>
                        }
                    })}
                </ul> */}
            </div>
        );
    }
}

export default Lobby;