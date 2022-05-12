const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TakingSixGameSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
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
    }
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