const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TakingSixGameSchema = new Schema({
  code: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  teamGame: {
    type: Boolean,
    required: true,
  },
  deck: [{
    value: Number,
    bulls: Number,
  }],
  players: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    bot: {
      type: Boolean,
      required: true
    },
    activePlayer: {
      type: Boolean,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    hand: [{
      value: Number,
      bulls: Number,
    }],
    pile: [{
      value: Number,
      bulls: Number,
    }],
    chosenCard: {
      value: Number,
      bulls: Number,
    },
    endingElo: Number
  }],
  playedCards: [[]],
  rows: [[{
    value: Number,
    bulls: Number,
  }]],
  currentState: Number
},  {
    timestamps: true
});

module.exports = TakingSixGame = mongoose.model("TakingSixGame", TakingSixGameSchema);