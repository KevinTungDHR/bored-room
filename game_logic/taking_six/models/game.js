const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TakingSixGameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  deck: [{
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'cards'
    },
    value: {
      type: Number,
      required: true
    },
    bulls: {
      type: Number,
      required: true
    },
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
      cardId: {
        type: Schema.Types.ObjectId,
        ref: 'cards'
      },
      value: {
        type: Number,
        required: true
      },
      bulls: {
        type: Number,
        required: true
      },
    }],
    pile: [{
      cardId: {
        type: Schema.Types.ObjectId,
        ref: 'cards'
      },
      value: {
        type: Number,
        required: true
      },
      bulls: {
        type: Number,
        required: true
      },
    }]
  }],
},  {
    timestamps: true
})

module.exports = TakingSixGame = mongoose.model("TakingSixGame", TakingSixGameSchema)