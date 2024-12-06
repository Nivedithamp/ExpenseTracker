import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query

  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
  const rowsPerPage = 8; // Defines the number of rows to display per page

  // Fetch users from the backend and update state
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission for adding or updating a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) return; // Ensure both fields are filled

    try {
      if (editUserId) {
        // Update existing user
        await axios.put(`http://localhost:5002/api/users/${editUserId}`, {
          firstName,
          lastName,
        });
        toast.success('User updated successfully!');
      } else {
        // Add a new user
        await axios.post('http://localhost:5002/api/users', {
          firstName,
          lastName,
        });
        toast.success('User added successfully!');
      }

      // Reset form fields and refresh users
      setFirstName('');
      setLastName('');
      setEditUserId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('An error occurred while saving the user.');
    }
  };

  // Populate form fields for editing a user
  const handleEdit = (user) => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEditUserId(user._id);
  };

  // Delete a user and refresh the list
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5002/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.userCode}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Search bar */}
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by User Code, First Name, or Last Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* User form for adding or editing a user */}
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

      {/* User table displaying current users */}
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

      {/* Pagination controls */}
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
