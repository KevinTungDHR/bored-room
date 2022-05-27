const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  handle: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  eloRating: {
    takingSix: {
      type: Number,
      required: true,
      default: 800
    },
    frequency: {
      type: Number,
      required: true,
      default: 800
    }
  },
  avatar: {
    type: String,
    required: false,
    default: "noimage"
  },
  bio: {
    type: String,
    required: false,
    default: ""
  },
  friends: {
    type: Object,
    required: false,
    default: {}
  }
  // friendList: {
  //   type: Object,
  //   required: false,
  //   default: {}
  // }
}, {
  timestamps: true
})

module.exports = User = mongoose.model('User', UserSchema);