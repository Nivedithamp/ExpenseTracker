import { useEffect, useState } from 'react'
import axios from 'axios'
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([])
  const [editUserId, setEditUserId] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const fetchUsers = async () => {
    // Fetch all users from the backend
    const res = await axios.get('http://localhost:5002/api/users')
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName) return

    // If editing a user, update them; otherwise, create a new user
    if (editUserId) {
      await axios.put(`http://localhost:5002/api/users/${editUserId}`, { firstName, lastName })
    } else {
      await axios.post('http://localhost:5002/api/users', { firstName, lastName })
    }

    // Reset form and refetch users
    setFirstName('')
    setLastName('')
    setEditUserId(null)
    fetchUsers()
  }

  const handleEdit = (user) => {
    // Populate form with user details for editing
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEditUserId(user._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5002/api/users/${id}`)
      fetchUsers()
    }
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <button type="submit">{editUserId ? 'Update User' : 'Add User'}</button>
        {editUserId && (
          <button
            type="button"
            onClick={() => {
              setEditUserId(null)
              setFirstName('')
              setLastName('')
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="user-table">
        <thead>
          <tr>
            <th>User Code</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {users.map(u => (
        <tr key={u._id}>
            <td>{u.userCode}</td>
            <td>{u.firstName}</td>
            <td>{u.lastName}</td>
            <td>{u.totalCost}</td>
            <td>
            <button className="edit" onClick={() => handleEdit(u)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(u._id)}>Delete</button>
         </td>
        </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
