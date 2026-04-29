import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"
import "./Profile.css"

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext)

  const { darkMode, toggleTheme } = useContext(ThemeContext)

  const [activeTab, setActiveTab] = useState("info")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Info form
  const [infoForm, setInfoForm] = useState({ name: "", email: "", bio: "" })
  // Password form
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Populate info form from user
  useEffect(() => {
    if (user) {
      setInfoForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setError("")
    setTimeout(() => setSuccess(""), 3500)
  }

  const showError = (msg) => {
    setError(msg)
    setSuccess("")
  }

  // Handle info update
  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await updateProfile({
      name: infoForm.name,
      email: infoForm.email,
      bio: infoForm.bio,
    })
    setLoading(false)
    if (result.success) showSuccess("Profile updated successfully!")
    else showError(result.msg || "Update failed.")
  }

  // Handle password update
  const handlePwSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return showError("New passwords do not match.")
    }
    setLoading(true)
    const result = await updateProfile({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    })
    setLoading(false)
    if (result.success) {
      showSuccess("Password changed successfully!")
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } else {
      showError(result.msg || "Password update failed.")
    }
  }

  // Avatar initials
  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <div className="profile-page">
      {/* Header Card */}
      <div className="profile-header glass-panel">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-meta">
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          {user?.isAdmin && <span className="profile-badge">Admin</span>}
        </div>
        <div className="profile-stats">
          <div className="stat-pill">
            <span className="stat-icon">🌗</span>
            <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs glass-panel">
        <button
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => { setActiveTab("info"); setError(""); setSuccess("") }}
        >
          <span>👤</span> Personal Info
        </button>
        <button
          className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => { setActiveTab("password"); setError(""); setSuccess("") }}
        >
          <span>🔒</span> Password
        </button>
        <button
          className={`tab-btn ${activeTab === "appearance" ? "active" : ""}`}
          onClick={() => { setActiveTab("appearance"); setError(""); setSuccess("") }}
        >
          <span>🎨</span> Appearance
        </button>
      </div>

      {/* Content */}
      <div className="profile-content glass-panel">
        {/* Alerts */}
        {success && <div className="alert alert-success">✅ {success}</div>}
        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        {/* Personal Info Tab */}
        {activeTab === "info" && (
          <form onSubmit={handleInfoSubmit} className="profile-form">
            <h3 className="form-section-title">Personal Information</h3>
            <p className="form-section-desc">Update your name, email and bio.</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prof-name">Full Name</label>
                <input
                  id="prof-name"
                  type="text"
                  placeholder="Your full name"
                  value={infoForm.name}
                  onChange={(e) =>
                    setInfoForm({ ...infoForm, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="prof-email">Email Address</label>
                <input
                  id="prof-email"
                  type="email"
                  placeholder="your@email.com"
                  value={infoForm.email}
                  onChange={(e) =>
                    setInfoForm({ ...infoForm, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prof-bio">Bio</label>
              <textarea
                id="prof-bio"
                rows={4}
                placeholder="Tell us a little about yourself..."
                value={infoForm.bio}
                onChange={(e) =>
                  setInfoForm({ ...infoForm, bio: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePwSubmit} className="profile-form">
            <h3 className="form-section-title">Change Password</h3>
            <p className="form-section-desc">
              Choose a strong password with at least 6 characters.
            </p>

            <div className="form-group">
              <label htmlFor="curr-pw">Current Password</label>
              <input
                id="curr-pw"
                type="password"
                placeholder="Enter your current password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-pw">New Password</label>
                <input
                  id="new-pw"
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={pwForm.newPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, newPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-pw">Confirm New Password</label>
                <input
                  id="confirm-pw"
                  type="password"
                  placeholder="Confirm new password"
                  value={pwForm.confirmPassword}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password strength indicator */}
            {pwForm.newPassword && (
              <div className="pw-strength">
                <span className="pw-strength-label">Strength:</span>
                <div className="pw-strength-bar">
                  <div
                    className={`pw-strength-fill ${
                      pwForm.newPassword.length < 6
                        ? "weak"
                        : pwForm.newPassword.length < 10
                        ? "medium"
                        : "strong"
                    }`}
                    style={{
                      width:
                        pwForm.newPassword.length < 6
                          ? "30%"
                          : pwForm.newPassword.length < 10
                          ? "65%"
                          : "100%",
                    }}
                  />
                </div>
                <span className="pw-strength-text">
                  {pwForm.newPassword.length < 6
                    ? "Weak"
                    : pwForm.newPassword.length < 10
                    ? "Medium"
                    : "Strong"}
                </span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="profile-form">
            <h3 className="form-section-title">Appearance</h3>
            <p className="form-section-desc">
              Customize how NotesKeeper looks for you.
            </p>

            <div className="appearance-grid">
              {/* Theme Toggle */}
              <div className="appearance-card" onClick={toggleTheme}>
                <div className={`theme-preview ${!darkMode ? "selected" : ""}`}>
                  <div className="preview-light">
                    <div className="preview-bar light"></div>
                    <div className="preview-card light"></div>
                    <div className="preview-card light short"></div>
                  </div>
                </div>
                <div className="appearance-card-label">
                  <span className="theme-radio">{!darkMode ? "🔘" : "⚪"}</span>
                  <span>Light Mode</span>
                </div>
              </div>

              <div className="appearance-card" onClick={toggleTheme}>
                <div className={`theme-preview ${darkMode ? "selected" : ""}`}>
                  <div className="preview-dark">
                    <div className="preview-bar dark"></div>
                    <div className="preview-card dark"></div>
                    <div className="preview-card dark short"></div>
                  </div>
                </div>
                <div className="appearance-card-label">
                  <span className="theme-radio">{darkMode ? "🔘" : "⚪"}</span>
                  <span>Dark Mode</span>
                </div>
              </div>
            </div>

            <div className="current-theme-badge">
              Currently using:{" "}
              <strong>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
