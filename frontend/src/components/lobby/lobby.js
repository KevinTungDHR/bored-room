import React from 'react';
import { Link } from 'react-router-dom';

class Lobby extends React.Component {
    constructor(props){
        super(props)
        this.state = { roomName: "", search: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
    }

    handleChange(e){
        this.setState({ roomName: e.target.value })
    }

    updateSearch(e) {
        this.setState({ search: e.target.value })
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.roomName !== ""){
            this.props.createRoom(this.state.roomName)
        }

        this.setState({ roomName: "" });
    }

    componentDidMount(){
        this.props.fetchAllRooms()
    }

    render() {
        const { rooms } = this.props;
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
                        return <li key={idx} className='room-container'>
                            <h1>{room.name}</h1>
                            <div>
                                <ul>
                                    {room.seatedUsers.map((user, i) => {
                                        return (
                                            <li key={i}>{user.handle + " " + user.eloRating}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <Link to={`/rooms/${room.code}`}><button className='join-btn'>Join Room</button></Link>
                        </li>
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