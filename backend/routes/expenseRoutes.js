// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense, getTotalCostByCategory } = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/totals', getTotalCostByCategory);

module.exports = router;
