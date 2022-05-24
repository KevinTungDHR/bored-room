import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

class Lobby extends React.Component {
    constructor(props){
        super(props)
        this.state = { roomName: "", search: "", game: "Taking Six" };

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
            this.props.createRoom(this.state.roomName, this.state.game)
        }

        this.setState({ roomName: "", game: "" });
    }

    componentDidMount(){
        this.props.fetchAllRooms()
    }

    handleGameChange(e){
        this.setState({ game: e.target.value})       
    }

    render() {
        const { rooms, deleteRoom } = this.props;
        let count = 0;
        let sign = 2000;
        return (
            <div className='lobby-background'>
                <div className='search-container'>
                    <form className='create-room' onSubmit={this.handleSubmit}>
                        <div className='flex'>
                            <div>Create a Room</div>
                            <div>
                                <input className='create-room-input' value={this.state.roomName} onChange={this.handleChange} />
                                <input className='create-btn' type="submit" value="Create" />
                            </div>
                        </div>
                        <select value={this.state.game} onChange={this.handleGameChange}>
                            <option value="Taking Six">Taking Six</option>
                            <option value="Frequency">Frequency</option>
                        </select>
                    </form>

                    <form className='search-rooms'>
                        <div className='flex'>
                            <div>Search for a Room</div>
                            <div>
                                <input className='create-room-input' value={this.state.search} onChange={this.updateSearch} />
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
                            <button className='delete-btn' onClick={() => deleteRoom(room.code)}>Delete Room</button>
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