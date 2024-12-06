const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Meals', 'Travel', 'Software'], required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true }
}, { timestamps: true });

// Prevent OverwriteModelError by checking if the model already exists
module.exports = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
