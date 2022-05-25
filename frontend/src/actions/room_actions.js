import * as RoomUtil from '../util/rooms_util';

export const RECEIVE_ROOMS = 'RECEIVE_ROOMS';
export const RECEIVE_ROOM = 'RECEIVE_ROOM';
export const RECEIVE_ROOM_ERRORS = 'RECEIVE_ROOM_ERRORS'
export const REMOVE_ROOM = 'REMOVE_ROOM';

const receiveRooms = (rooms) => {
  return {
    type: RECEIVE_ROOMS,
    rooms
  }
};

export const receiveRoom = (room) => {
  return {
    type: RECEIVE_ROOM,
    room
  }
};

const receiveRoomErrors = (errors) => {
  return {
    type: RECEIVE_ROOM_ERRORS,
    errors
  }
};

export const removeRoom = (roomCode) => {
  return {
    type: REMOVE_ROOM,
    roomCode
  }
}

export const fetchAllRooms = () => dispatch => {
  return RoomUtil.fetchAllRooms()
      .then(res => dispatch(receiveRooms(res.data)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const createRoom = (roomName, gameName) => dispatch => {
  return RoomUtil.createRoom(roomName, gameName)
      .then(res => dispatch(receiveRoom(res.data)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const fetchRoom = (roomCode) => dispatch => {
  return RoomUtil.fetchRoom(roomCode)
      .then(res => dispatch(receiveRoom(res.data)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const joinRoom = (roomCode) => dispatch => {
  return RoomUtil.joinRoom(roomCode)
      .then(res => dispatch(receiveRoom(res.data)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const leaveRoom = (roomCode) => dispatch => {
  return RoomUtil.leaveRoom(roomCode)
      .then(res => dispatch(receiveRoom(res.data)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const deleteRoom = (roomCode) => dispatch => {
  return RoomUtil.deleteRoom(roomCode)
      .then(() => dispatch(removeRoom(roomCode)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}