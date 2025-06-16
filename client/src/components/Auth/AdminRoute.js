"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return <div>Loading...</div>

  return isAuthenticated && user && user.isAdmin ? children : <Navigate to="/" />
}

export default AdminRoute