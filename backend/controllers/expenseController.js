const Expense = require('../models/Expense');
const User = require('../models/User');

exports.createExpense = async (req, res) => {
  try {
    const { userId, category, description, cost } = req.body;
    if (!userId || !category || !description || cost == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    const expense = await Expense.create({ userId, category, description, cost });
    return res.status(201).json(expense);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).populate('userId', 'firstName lastName').lean();
    const formatted = expenses.map(e => ({
      ...e,
      userName: e.userId ? `${e.userId.firstName} ${e.userId.lastName}` : "Unknown"
    }));
    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, category, description, cost } = req.body;
    if (!userId || !category || !description || cost == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.findByIdAndUpdate(id, { userId, category, description, cost }, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    return res.status(200).json(expense);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    return res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getTotalCostByCategory = async (req, res) => {
  try {
    const totals = await Expense.aggregate([
      { $group: { _id: "$category", totalCost: { $sum: "$cost" } } }
    ]);
    return res.status(200).json(totals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
