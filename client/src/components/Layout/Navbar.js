"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"
import "./Navbar.css"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext)
  const { darkMode, toggleTheme } = useContext(ThemeContext)

  const onLogout = () => {
    logout()
  }

  const authLinks = (
    <>
      <li>Hello, {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </a>
      </li>
    </>
  )

  const guestLinks = (
    <>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </>
  )

  return (
    <nav className="navbar glass-panel" style={{ borderRadius: "0 0 16px 16px", borderTop: "none" }}>
      <h1>
        <Link to="/">
          <i className="fas fa-sticky-note"></i> NotesKeeper
        </Link>
      </h1>
      <ul>
        {isAuthenticated ? authLinks : guestLinks}
        <li>
          <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
