import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../rbac/AuthProvider';
import './login.css'
 
function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, loading } = useAuth() 
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Use the RBAC login logic instead of direct navigate
    const result = await login(username, password)

    if (!result.success) {
      // Show an error if credentials don't match our hardcoded ones
      alert(result.message)
    }
  }
  
  return (
    <div className="login-layout">
      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        <div className="left-content">
          <div className="brand">
            <div className="brand-logo">SFC</div>
            <div className="brand-text">
              <span className="brand-name">SFC Training</span>
              <span className="brand-sub">Admin Dashboard</span>
            </div>
          </div>
 
          <div className="hero-text">
            <h1>
              Empowering Park Guides Through{' '}
              <span className="accent">Digital Training.</span>
            </h1>
            <p className="hero-desc">
              Structured e-learning, IoT wildlife monitoring, and digital
              certification management — purpose-built for Sarawak park guides.
            </p>
          </div>
 
          <div className="stats">
            <div className="stat">
              <span className="stat-value">48</span>
              <span className="stat-label">Active Guides</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">8</span>
              <span className="stat-label">Modules Live</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">156</span>
              <span className="stat-label">Certs Issued</span>
            </div>
          </div>
        </div>
 
        <div className="left-footer">
          Sarawak Forestry Corporation &middot; Restricted Access
        </div>
 
        {/* Decorative circles */}
        <div className="deco-circle deco-circle--1" />
        <div className="deco-circle deco-circle--2" />
        <div className="deco-circle deco-circle--3" />
      </div>
 
      {/* ── RIGHT PANEL ── */}
      <div className="right-panel">
        <div className="form-card">
          <div className="form-header">
            <h2>Welcome back</h2>
          </div>
 
          <form className="login-form" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
 
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
 
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me for 7 days</span>
            </label>
 
            <button type="submit" className="btn-signin">
              Sign In
              <span className="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </button>
 
            <p className="restriction-note">
              This platform is restricted to authorised SFC administrators and
              trainers. For access requests, contact your system administrator.
            </p>
 
            <div className="divider" />
 
            <button type="button" className="btn-sso" onClick={() => window.location.href = '/register'}>
              Register to become a park guide
            </button>
          </form>
 
          <p className="card-footer">
            &copy; 2026 Sarawak Forestry Corporation
          </p>
        </div>
 
        <p className="help-text">
          Need help? Contact:{' '}
          <a href="mailto:itsupport@sfctraining.my">itsupport@sfctraining.my</a>
          <br />
          Available Mon–Fri, 8am–5pm MYT
        </p>
      </div>
    </div>
  )
}
 
export default Login;