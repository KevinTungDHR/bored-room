const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  teamGame: {
    type: Boolean,
    required: true
  },
  code: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  game: {
    type: String,
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  seatedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  redTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  blueTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  gameStarted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});


// Need to add a game Name as well once game collection is created.
// Need to add a ref to Game collection once created.

module.exports = Room = mongoose.model('Room', RoomSchema);