const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FrequencyGameSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
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
    isPsychic: Boolean
  }],
  blueTeam: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    activePlayer: Boolean,
    isPsychic: Boolean
  }],
  redPsychic: Number,
  bluePsychic: Number,
  redPoints: Number,
  bluePoints: Number,
  guess: Number,
  clue: String,
  dial: Number,
  leftOrRight: String,
  dialRevealed: Boolean,
  demoGame: Boolean,
  demoTurnCounter: Number,
  gameOver: Boolean,
  currentState: Number,
},  {
    timestamps: true
})

module.exports = FrequencyGame = mongoose.model("FrequencyGame", FrequencyGameSchema);