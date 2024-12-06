const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userCode: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
}, { timestamps: true });

// Use mongoose.models to check if the model already exists
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
