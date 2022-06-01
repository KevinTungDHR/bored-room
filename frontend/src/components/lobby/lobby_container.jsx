import { connect } from 'react-redux';
import { removeRoom, fetchAllRooms, receiveRoom } from '../../actions/room_actions';
import Lobby from './lobby';

const mapState = state => ({
    currentUser: state.session.user,
    rooms: Object.values(state.entities.rooms)
});

const mapDispatch = (dispatch) => {
    return {
        fetchAllRooms: () => dispatch(fetchAllRooms()),
        receiveRoom: (room) => dispatch(receiveRoom(room)),
        removeRoom: (roomCode) => dispatch(removeRoom(roomCode))
    }
}

export default connect(mapState, mapDispatch)(Lobby);