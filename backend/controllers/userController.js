const User = require('../models/User');
const Expense = require('../models/Expense');
const Counter = require('../models/Counter');

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and Last Name required" });
    }

    // Generate a new sequence number for userCode
    const counter = await Counter.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const userCode = `USR${String(counter.sequence_value).padStart(4, '0')}`;

    const user = await User.create({ firstName, lastName, userCode });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}).lean();

    // Extract all user IDs
    const userIds = users.map(u => u._id);

    // Aggregate expenses to find total cost per user
    const expenses = await Expense.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", totalCost: { $sum: "$cost" } } }
    ]);

    // Map user IDs to total cost
    const expenseMap = {};
    expenses.forEach(e => {
      expenseMap[e._id.toString()] = e.totalCost;
    });

    // Add total cost field to each user
    const usersWithCost = users.map(user => ({
      ...user,
      totalCost: expenseMap[user._id.toString()] || 0
    }));

    return res.status(200).json(usersWithCost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and Last Name required" });
    }

    // Only update firstName and lastName, do not change userCode
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all expenses related to this user
    await Expense.deleteMany({ userId: id });

    return res.status(200).json({ message: "User and related expenses deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
