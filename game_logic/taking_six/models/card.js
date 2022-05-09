const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TakingSixCardSchema = new Schema({
  value: {
    type: Number,
    required: true
  },
  bulls: {
    type: Number,
    required: true
  },
},  {
    timestamps: true
})

module.exports = TakingSixCard = mongoose.model("TakingSixCard", TakingSixCardSchema)