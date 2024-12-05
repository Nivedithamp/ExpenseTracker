import { useEffect, useState } from 'react'
import axios from 'axios'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [editUserId, setEditUserId] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5002/api/users')
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName) return

    if (editUserId) {
      await axios.put(`http://localhost:5002/api/users/${editUserId}`, { firstName, lastName })
    } else {
      await axios.post('http://localhost:5002/api/users', { firstName, lastName })
    }

    setFirstName('')
    setLastName('')
    setEditUserId(null)
    fetchUsers()
  }

  const handleEdit = (user) => {
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
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
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

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Total Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.totalCost}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
