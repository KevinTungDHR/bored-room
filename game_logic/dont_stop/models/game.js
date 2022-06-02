const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DontStopGameSchema = new Schema({
  code: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  teamGame: {
    type: Boolean,
    required: true,
  },
  currentPlayer: {
    type: String,
    required: true,
  },
  turnCounter: {
    type: Number,
    required: true,
  },
  board: {
    2: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    3: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    4: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    5: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    6: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    7: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    8: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    9: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    10: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    11: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed },
    12: { max: Number, start: Number, completed: Boolean, color: String, players: Schema.Types.Mixed }
  },
  routes: Schema.Types.Mixed,
  turnOrder: [String],
  dice: [Number],
  pairs: [[]],
  players: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    bot: Boolean,
    color: String
  }],
  currentRun: Schema.Types.Mixed,
  demoGame: Boolean,
  gameOver: Boolean,
  currentState: Number,
  winner: String
},  {
    timestamps: true
})

module.exports = DontStopGame = mongoose.model("DontStopGame", DontStopGameSchema);