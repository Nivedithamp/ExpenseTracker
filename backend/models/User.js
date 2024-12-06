const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userCode: {
      type: String,
      unique: true, // to ensures each userCode is unique
    },
    firstName: {
      type: String,
      required: true, 
    },
    lastName: {
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
