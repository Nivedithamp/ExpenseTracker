const mongoose = require('mongoose');

// Schema definition 
const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true, 
    },
    category: {
      type: String,
      enum: ['Meals', 'Travel', 'Software'], // Allowed categories
      required: true, 
    },
    description: {
      type: String,
      required: true, 
    },
    cost: {
      type: Number,
      required: true, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
