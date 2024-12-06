const Expense = require('../models/Expense');
const User = require('../models/User');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { userId, category, description, cost } = req.body;

    // Validate required fields
    if (!userId || !category || !description || cost == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    // Create the expense
    const expense = await Expense.create({ userId, category, description, cost });
    return res.status(201).json(expense);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Fetch all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({})
      .populate('userId', 'firstName lastName userCode') // Fetch user details
      .lean();

    // Format the response to include user details
    const formatted = expenses.map(e => ({
      ...e,
      userName: e.userId 
        ? `${e.userId.userCode} - ${e.userId.firstName} ${e.userId.lastName}` 
        : "Unknown"
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, category, description, cost } = req.body;

    // Validate required fields
    if (!userId || !category || !description || cost == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update the expense
    const expense = await Expense.findByIdAndUpdate(
      id,
      { userId, category, description, cost },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    return res.status(200).json(expense);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the expense
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    return res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get total cost grouped by category
exports.getTotalCostByCategory = async (req, res) => {
  try {
    // Group expenses by category and calculate total cost
    const totals = await Expense.aggregate([
      { $group: { _id: "$category", totalCost: { $sum: "$cost" } } }
    ]);
    return res.status(200).json(totals);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};