const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userCode: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
