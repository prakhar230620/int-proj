"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Admin.css"

const AdminPanel = () => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    profilePicture: "",
    isAdmin: false
  })

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    } else if (user && !user.isAdmin) {
      navigate("/")
    }
  }, [isAuthenticated, user, navigate])

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await axios.get("/api/users")
        setUsers(res.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch users")
        setLoading(false)
      }
    }

    if (isAuthenticated && user && user.isAdmin) {
      fetchUsers()
    }
  }, [isAuthenticated, user])

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      isAdmin: user.isAdmin || false
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      const res = await axios.put(`/api/users/${selectedUser._id}`, formData)
      
      // Update users list with updated user
      setUsers(users.map(u => u._id === selectedUser._id ? res.data : u))
      
      // Reset selected user
      setSelectedUser(null)
      
      // Show success message
      alert("User profile updated successfully!")
    } catch (err) {
      setError("Failed to update user profile")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      await axios.delete(`/api/users/${userId}`)
      
      // Remove user from list
      setUsers(users.filter(u => u._id !== userId))
      
      // Reset selected user if it was deleted
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null)
      }
      
      // Show success message
      alert("User deleted successfully!")
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <h2>Users</h2>
          <div className="users-list">
            {users.map(user => (
              <div 
                key={user._id} 
                className={`user-item ${selectedUser && selectedUser._id === user._id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-item-name">{user.name}</div>
                <div className="user-item-email">{user.email}</div>
                {user.isAdmin && <span className="admin-badge">Admin</span>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="admin-content">
          {selectedUser ? (
            <div className="user-profile-edit">
              <h2>Edit User Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input 
                    type="text" 
                    name="profilePicture" 
                    value={formData.profilePicture} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isAdmin" 
                      checked={formData.isAdmin} 
                      onChange={handleInputChange} 
                    />
                    Admin Privileges
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleDeleteUser(selectedUser._id)}
                  >
                    Delete User
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="admin-welcome">
              <h2>Welcome to Admin Panel</h2>
              <p>Select a user from the list to manage their profile.</p>
              <div className="admin-stats">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-card">
                  <h3>Admin Users</h3>
                  <div className="stat-value">{users.filter(u => u.isAdmin).length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel