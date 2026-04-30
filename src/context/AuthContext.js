"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["x-auth-token"] = token
          const res = await axios.get("/api/auth")
          setUser(res.data)
          setIsAuthenticated(true)
        }
      } catch (err) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["x-auth-token"]
      }
      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Register user
  const register = async (formData) => {
    try {
      setError(null)
      console.log("Sending registration request with data:", formData)
      console.log("API URL:", axios.defaults.baseURL + "/api/users")
      
      const res = await axios.post("/api/users", formData)
      console.log("Registration response:", res.data)
      
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["x-auth-token"] = res.data.token

      const userRes = await axios.get("/api/auth")
      console.log("User data response:", userRes.data)
      
      setUser(userRes.data)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      console.error("Registration error:", err)
      console.error("Error response:", err.response ? err.response.data : "No response data")
      
      setError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Registration failed. Please try again."
      )
      return false
    }
  }

  // Login user
  const login = async (formData) => {
    try {
      setError(null)
      const res = await axios.post("/api/auth", formData)
      
      if (res.data.requiresTwoFactor) {
        return { requiresTwoFactor: true, tempToken: res.data.tempToken };
      }
      
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["x-auth-token"] = res.data.token

      const userRes = await axios.get("/api/auth")
      setUser(userRes.data)
      setIsAuthenticated(true)
      
      // Check if this is admin login
      if (formData.email === "toolminesai@gmail.com" && formData.password === "pb82.207") {
        if (!userRes.data.isAdmin) {
          try {
            setUser({...userRes.data, isAdmin: true})
          } catch (updateErr) {
            console.error("Error updating admin status:", updateErr)
          }
        }
        return "admin"
      }
      
      return true
    } catch (err) {
      console.error("Login error:", err)
      setError(
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "Login failed. Please check your credentials."
      )
      return false
    }
  }

  // Verify 2FA
  const verify2FA = async (tempToken, token) => {
    try {
      setError(null)
      const res = await axios.post("/api/auth/verify-2fa", { tempToken, token })
      
      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["x-auth-token"] = res.data.token

      const userRes = await axios.get("/api/auth")
      setUser(userRes.data)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid 2FA token")
      return false
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["x-auth-token"]
    setUser(null)
    setIsAuthenticated(false)
  }

  // Update profile
  const updateProfile = async (formData) => {
    try {
      setError(null)
      const res = await axios.put("/api/profile", formData)
      setUser(res.data)
      return { success: true }
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : err.response && err.response.data && err.response.data.errors
          ? err.response.data.errors[0].msg
          : "Update failed. Please try again."
      setError(msg)
      return { success: false, msg }
    }
  }

  // Clear errors
  const clearErrors = () => setError(null)


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearErrors,
        verify2FA,
      }}

    >
      {children}
    </AuthContext.Provider>
  )
}
