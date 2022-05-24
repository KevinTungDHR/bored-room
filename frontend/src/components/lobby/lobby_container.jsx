import { connect } from 'react-redux';
import { createRoom, deleteRoom, fetchAllRooms } from '../../actions/room_actions';
import Lobby from './lobby';

const mapState = state => ({
    rooms: Object.values(state.entities.rooms)
});

const mapDispatch = (dispatch) => {
    return {
        fetchAllRooms: () => dispatch(fetchAllRooms()),
        createRoom: (roomName) => dispatch(createRoom(roomName)),
        deleteRoom: (roomCode) => dispatch(deleteRoom(roomCode))
    }
}

export default connect(mapState, mapDispatch)(Lobby);