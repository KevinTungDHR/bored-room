const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FrequencyCardSchema = new Schema({
  left: {
    type: String,
    required: true
  },
  right: {
    type: String,
    required: true
  },
},  {
    timestamps: true
});

module.exports = FrequencyCard = mongoose.model("FrequencyCard", FrequencyCardSchema);