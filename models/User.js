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
  experience: {
    type: Number,
    required: true,
    default: 0
  },
  avatar: {
    type: String,
    required: false,
    default: "noimage"
  }
}, {
  timestamps: true
})

module.exports = User = mongoose.model('User', UserSchema);