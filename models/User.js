const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  handle: {
    type: String,
    required: true,
    index: true, 
    unique:true
  },
  email: {
    type: String,
    required: true,
    index: true, 
    unique:true
  },
  password: {
    type: String,
    required: true,
    select: false
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
  acceptedFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  requestedFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  pendingFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  rejectedFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true
})

module.exports = User = mongoose.model('User', UserSchema);