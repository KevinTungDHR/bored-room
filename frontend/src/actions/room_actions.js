import * as RoomUtil from '../util/rooms_util';

export const RECEIVE_ROOMS = 'RECEIVE_ROOMS';
export const RECEIVE_ROOM = 'RECEIVE_ROOM';
export const RECEIVE_ROOM_ERRORS = 'RECEIVE_ROOM_ERRORS'

const receiveRooms = (rooms) => {
  return {
    type: RECEIVE_ROOMS,
    rooms
  }
};

const receiveRoom = (room) => {
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

export const fetchAllRooms = () => dispatch => {
  return RoomUtil.fetchAllRooms()
      .then(rooms => dispatch(receiveRooms(rooms)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const createRoom = (roomName) => dispatch => {
  return RoomUtil.createRoom(roomName)
      .then(room => dispatch(receiveRoom(room)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const fetchRoom = (roomCode) => dispatch => {
  return RoomUtil.createRoom(roomCode)
      .then(room => dispatch(receiveRoom(room)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const joinRoom = (roomCode) => dispatch => {
  return RoomUtil.joinRoom(roomCode)
      .then(room => dispatch(receiveRoom(room)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}

export const leaveRoom = (roomCode) => dispatch => {
  return RoomUtil.leaveRoom(roomCode)
      .then(room => dispatch(receiveRoom(room)))
      .catch(errors => dispatch(receiveRoomErrors(errors)))
}