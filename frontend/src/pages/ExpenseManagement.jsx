import { useEffect, useState } from 'react'
import axios from 'axios'

const categories = ["Meals", "Travel", "Software"]

function ExpenseManagement() {
  const [expenses, setExpenses] = useState([])
  const [users, setUsers] = useState([])
  const [editExpenseId, setEditExpenseId] = useState(null)

  const [userId, setUserId] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')

  const fetchExpenses = async () => {
    const res = await axios.get('http://localhost:5002/api/expenses')
    setExpenses(res.data)
  }

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5002/api/users')
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
    fetchExpenses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userId || !category || !description || cost === '') return

    if (editExpenseId) {
      await axios.put(`http://localhost:5002/api/expenses/${editExpenseId}`, {
        userId, category, description, cost: Number(cost)
      })
    } else {
      await axios.post('http://localhost:5002/api/expenses', {
        userId, category, description, cost: Number(cost)
      })
    }

    setUserId('')
    setCategory('')
    setDescription('')
    setCost('')
    setEditExpenseId(null)
    fetchExpenses()
    fetchUsers() // Refresh user totals
  }

  const handleEdit = (exp) => {
    setUserId(exp.userId)
    setCategory(exp.category)
    setDescription(exp.description)
    setCost(exp.cost)
    setEditExpenseId(exp._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await axios.delete(`http://localhost:5002/api/expenses/${id}`)
      fetchExpenses()
      fetchUsers()
    }
  }

  return (
    <div>
      <h2>Expense Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <select value={userId} onChange={e => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
          ))}
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={e => setCost(e.target.value)}
          required
        />
        <button type="submit">{editExpenseId ? 'Update Expense' : 'Add Expense'}</button>
        {editExpenseId && (
          <button
            type="button"
            onClick={() => {
              setEditExpenseId(null)
              setUserId('')
              setCategory('')
              setDescription('')
              setCost('')
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
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
          {expenses.map(exp => (
            <tr key={exp._id}>
              <td>{exp.userName}</td>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td>{exp.cost}</td>
              <td>
                <button onClick={() => handleEdit(exp)}>Edit</button>
                <button onClick={() => handleDelete(exp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseManagement
