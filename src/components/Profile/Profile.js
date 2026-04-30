import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
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

  // 2FA state
  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: null,
    secret: null,
    token: "",
    setupMode: false
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

  // Handle 2FA setup
  const setup2FA = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTwoFactorData({ ...twoFactorData, qrCode: data.qrCode, secret: data.secret, setupMode: true });
      } else {
        showError(data.msg || "Failed to setup 2FA");
      }
    } catch (err) {
      showError("Failed to setup 2FA");
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA enable
  const enable2FA = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/enable-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({ token: twoFactorData.token })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess("2FA enabled successfully!");
        setTwoFactorData({ qrCode: null, secret: null, token: "", setupMode: false });
        user.isTwoFactorEnabled = true;
      } else {
        showError(data.msg || "Invalid token");
      }
    } catch (err) {
      showError("Failed to enable 2FA");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="profile-back-nav">
          <Link to="/" className="btn btn-light back-btn">
            <span>⬅️</span> Back to Notes
          </Link>
        </div>
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
        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => { setActiveTab("security"); setError(""); setSuccess("") }}
        >
          <span>🛡️</span> Security
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

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="profile-form">
            <h3 className="form-section-title">Two-Factor Authentication (2FA)</h3>
            <p className="form-section-desc">
              Enhance the security of your account by enabling 2FA.
            </p>

            {user?.isTwoFactorEnabled ? (
              <div className="alert alert-success">
                ✅ Two-Factor Authentication is currently enabled.
              </div>
            ) : !twoFactorData.setupMode ? (
              <div>
                <p>2FA adds an extra layer of security to your account. To log in, you'll need to provide your password and an authenticator code.</p>
                <button className="btn btn-primary" onClick={setup2FA} disabled={loading}>
                  {loading ? "Setting up..." : "Setup 2FA"}
                </button>
              </div>
            ) : (
              <form onSubmit={enable2FA}>
                <div style={{ background: "#fff", padding: "10px", display: "inline-block", borderRadius: "10px", marginBottom: "15px" }}>
                  <img src={twoFactorData.qrCode} alt="2FA QR Code" />
                </div>
                <p>Scan this QR code with an authenticator app (like Google Authenticator or Authy).</p>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input 
                    type="text" 
                    value={twoFactorData.token} 
                    onChange={(e) => setTwoFactorData({ ...twoFactorData, token: e.target.value })}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Verifying..." : "Enable 2FA"}
                  </button>
                  <button type="button" className="btn btn-light" onClick={() => setTwoFactorData({ qrCode: null, secret: null, token: "", setupMode: false })}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
