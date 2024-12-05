const User = require('../models/User');
const Expense = require('../models/Expense');
const Counter = require('../models/Counter');

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and Last Name required" });
    }

    // Generate new sequence number
    const counter = await Counter.findOneAndUpdate(
      { _id: 'userId' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    const userCode = `USR${String(counter.sequence_value).padStart(4, '0')}`; // e.g. USR0001

    const user = await User.create({ firstName, lastName, userCode });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    const userIds = users.map(u => u._id);
    const expenses = await Expense.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", totalCost: { $sum: "$cost" } } }
    ]);

    const expenseMap = {};
    expenses.forEach(e => {
      expenseMap[e._id.toString()] = e.totalCost;
    });

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
    const user = await User.findByIdAndUpdate(id, { firstName, lastName }, { new: true });
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
    await Expense.deleteMany({ userId: id });
    return res.status(200).json({ message: "User and related expenses deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
