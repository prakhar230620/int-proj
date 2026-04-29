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
      <li>
        <Link to="/profile" className="nav-profile-link">
          <span className="nav-avatar">
            {user && user.name ? user.name[0].toUpperCase() : "?"}
          </span>
          {user && user.name}
        </Link>
      </li>
      {user && user.isAdmin && (
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      )}
      <li>
        <a onClick={onLogout} href="#!" className="nav-logout">
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
    <nav className="navbar">

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
