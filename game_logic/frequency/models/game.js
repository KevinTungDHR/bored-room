const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FrequencyGameSchema = new Schema({
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
  deck: [{
    left: String,
    right: String
  }],
  currentCard: {
    left: String,
    right: String
  },
  discard: [{left: String, right: String}],
  activeTeam: String,
  redTeam: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    activePlayer: Boolean,
    isPsychic: Boolean,
    endingElo: Number
  }],
  blueTeam: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    activePlayer: Boolean,
    isPsychic: Boolean,
  }],
  redPsychic: Number,
  bluePsychic: Number,
  redPoints: Number,
  bluePoints: Number,
  redGainedPts: Number,
  blueGainedPts: Number,
  guess: Number,
  clue: String,
  dial: Number,
  leftOrRight: String,
  dialRevealed: Boolean,
  demoGame: Boolean,
  demoTurnCounter: Number,
  gameOver: Boolean,
  currentState: Number,
  winner: String
},  {
    timestamps: true
})

module.exports = FrequencyGame = mongoose.model("FrequencyGame", FrequencyGameSchema);