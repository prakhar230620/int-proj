"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [twoFactorData, setTwoFactorData] = useState({
    requires2FA: false,
    tempToken: "",
    token: ""
  })
  
  const { email, password } = formData
  const { login, verify2FA, isAuthenticated, error } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      if (email === "toolminesai@gmail.com" && password === "pb82.207") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    }
  }, [isAuthenticated, navigate, email, password])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const onTwoFactorChange = (e) => {
    setTwoFactorData({ ...twoFactorData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (twoFactorData.requires2FA) {
      const result = await verify2FA(twoFactorData.tempToken, twoFactorData.token)
      if (result === true && email === "toolminesai@gmail.com") {
         navigate("/admin")
      }
      return;
    }
    
    const result = await login({ email, password })
    
    if (result && result.requiresTwoFactor) {
      setTwoFactorData({ ...twoFactorData, requires2FA: true, tempToken: result.tempToken })
      return;
    }
    
    if (result === "admin") {
      navigate("/admin")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{twoFactorData.requires2FA ? "Two-Factor Authentication" : "Login to Your Account"}</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          {!twoFactorData.requires2FA ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" value={email} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={password} onChange={onChange} required minLength="6" />
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="token">Enter 2FA Code</label>
                <input type="text" name="token" value={twoFactorData.token} onChange={onTwoFactorChange} required maxLength="6" />
              </div>
              <button type="submit" className="btn btn-primary">
                Verify
              </button>
              <button type="button" className="btn btn-light" onClick={() => setTwoFactorData({requires2FA: false, tempToken: "", token: ""})} style={{marginTop: "10px"}}>
                Cancel
              </button>
            </>
          )}
        </form>
        {!twoFactorData.requires2FA && (
          <p className="auth-switch">
            Don't have an account? <a href="/register">Register</a>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
