const mongoose = require('mongoose');

// Schema to track sequence numbers for generating unique IDs
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 } // Current sequence value
});

module.exports = mongoose.model('Counter', counterSchema);