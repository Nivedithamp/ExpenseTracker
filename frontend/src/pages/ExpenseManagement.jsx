import { useEffect, useState } from 'react';
import axios from 'axios';
import './ExpenseManagement.css';

const categories = ['Meals', 'Travel', 'Software'];

function ExpenseManagement() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);

  const [userId, setUserId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const rowsPerPage = 10; // Number of rows per page

  const fetchExpenses = async () => {
    const res = await axios.get('http://localhost:5002/api/expenses');
    setExpenses(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5002/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !category || !description || cost === '') return;

    if (editExpenseId) {
      await axios.put(`http://localhost:5002/api/expenses/${editExpenseId}`, {
        userId,
        category,
        description,
        cost: Number(cost),
      });
    } else {
      await axios.post('http://localhost:5002/api/expenses', {
        userId,
        category,
        description,
        cost: Number(cost),
      });
    }

    setUserId('');
    setCategory('');
    setDescription('');
    setCost('');
    setEditExpenseId(null);
    fetchExpenses();
    fetchUsers(); // Refresh user totals
  };

  const handleEdit = (exp) => {
    console.log('Expense being edited:', exp); // Debug log
    setUserId(exp.userId); // Set userId for the dropdown
    setCategory(exp.category);
    setDescription(exp.description);
    setCost(exp.cost);
    setEditExpenseId(exp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await axios.delete(`http://localhost:5002/api/expenses/${id}`);
      fetchExpenses();
      fetchUsers();
    }
  };

  // Pagination Logic
  const indexOfLastExpense = currentPage * rowsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - rowsPerPage;
  const currentExpenses = expenses.slice(indexOfFirstExpense, indexOfLastExpense);

  const totalPages = Math.ceil(expenses.length / rowsPerPage);

  return (
    <div className="expense-management">
      <h2>Expense Management</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.userCode} - {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn">
          {editExpenseId ? 'Update Expense' : 'Add Expense'}
        </button>
        {editExpenseId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditExpenseId(null);
              setUserId('');
              setCategory('');
              setDescription('');
              setCost('');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="expense-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Category</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.userName}</td>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td>{exp.cost}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(exp)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(exp._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < totalPages ? prev + 1 : totalPages
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ExpenseManagement;
