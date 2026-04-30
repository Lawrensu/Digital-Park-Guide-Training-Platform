import { useState } from 'react'
import './navbar.css'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../rbac/AuthProvider'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard',      to: '/dashboard',      badge: null },
  { icon: '📋', label: 'Registrations', to: '/registrations',  badge: 3    },
  { icon: '📚', label: 'Modules',       to: '/modules',        badge: null },
  { icon: '👤', label: 'Guides',        to: '/guides',         badge: null },
  { icon: '✏️', label: 'Quizzes',       to: '/quizzes',        badge: 5    },
  { icon: '🏆', label: 'Certifications',to: '/certifications', badge: null },
  { icon: '📡', label: 'IoT Alerts',    to: '/iot-alerts',     badge: 2    },
  { icon: '🔔', label: 'Notifications', to: '/notifications',  badge: null },
  { icon: '⚙️', label: 'Settings',      to: '/settings',       badge: null },
]

export default function Navbar() {
  const { logout } = useAuth()

  return (
    <aside className="navbar">
      {/* ── Brand ── */}
      <div className="navbar-brand">
        <div className="navbar-brand-icon">🌿</div>
        <div>
          <p className="navbar-brand-name">SFC Admin</p>
          <p className="navbar-brand-sub">Management Portal</p>
        </div>
      </div>

      <div className="navbar-divider" />

      {/* ── Navigation ── */}
      <nav className="navbar-nav">
        {NAV_ITEMS.map(({ icon, label, to, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['navbar-nav-item', isActive ? 'navbar-nav-item--active' : ''].join(' ').trim()
            }
          >
            <span className="navbar-nav-icon">{icon}</span>
            <span className="navbar-nav-label">{label}</span>
            {badge !== null && (
              <span className="navbar-nav-badge">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-spacer" />
      <div className="navbar-divider" />

      {/* ── User Profile ── */}
      <div className="navbar-user">
        <div className="navbar-user-avatar">AM</div>
        <div>
          <p className="navbar-user-name">Ahmad Malik</p>
          <p className="navbar-user-role">Super Admin</p>
        </div>
      </div>

      <button className="navbar-logout-btn" onClick={logout}>
        🚪 Logout
      </button>
    </aside>
  )
}
