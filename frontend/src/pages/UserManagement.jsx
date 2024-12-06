import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const rowsPerPage = 10; // Number of rows per page

  // Fetch users from the backend
  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5002/api/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission for adding or editing a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    if (editUserId) {
      await axios.put(`http://localhost:5002/api/users/${editUserId}`, {
        firstName,
        lastName,
      });
    } else {
      await axios.post('http://localhost:5002/api/users', {
        firstName,
        lastName,
      });
    }

    // Reset form and refetch users
    setFirstName('');
    setLastName('');
    setEditUserId(null);
    fetchUsers();
  };

  // Populate form with user details for editing
  const handleEdit = (user) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEditUserId(user._id);
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await axios.delete(`http://localhost:5002/api/users/${id}`);
      fetchUsers();
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <button type="submit">
          {editUserId ? 'Update User' : 'Add User'}
        </button>
        {editUserId && (
          <button
            type="button"
            onClick={() => {
              setEditUserId(null);
              setFirstName('');
              setLastName('');
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
          {currentUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.userCode}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.totalCost}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(u)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(u._id)}>
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

export default UserManagement;
