const User = require('../models/User');
const Expense = require('../models/Expense');
const Counter = require('../models/Counter');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and Last Name required" });
    }

    // Generate a unique userCode
    const counter = await Counter.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true } // Create if doesn't exist
    );
    const userCode = `USR${String(counter.sequence_value).padStart(4, '0')}`;

    // Create the user
    const user = await User.create({ firstName, lastName, userCode });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all users along with their total expenses
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean(); // Fetch all users
    const userIds = users.map(u => u._id); // Extract user IDs

    // Calculate total expenses per user
    const expenses = await Expense.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", totalCost: { $sum: "$cost" } } }
    ]);

    // Map user IDs to their total costs
    const expenseMap = {};
    expenses.forEach(e => {
      expenseMap[e._id.toString()] = e.totalCost;
    });

    // Combine users with their total costs
    const usersWithCost = users.map(user => ({
      ...user,
      totalCost: expenseMap[user._id.toString()] || 0
    }));

    return res.status(200).json(usersWithCost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and Last Name required" });
    }

    // Update user details
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true } // Return updated document
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a user and their related expenses
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all expenses related to the user
    await Expense.deleteMany({ userId: id });

    return res.status(200).json({ message: "User and related expenses deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
