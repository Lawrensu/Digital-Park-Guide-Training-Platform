import { NavLink } from 'react-router-dom'
import './guidenavbar.css'
import { useAuth } from '../../rbac/AuthProvider'

const ProfileIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NAV_ITEMS = [
  { icon: '⊞',           label: 'My Dashboard',  to: '/guidedashboard',     badge: null, iconClass: null        },
  { icon: '📚',           label: 'My Modules',    to: '/guidemodule',        badge: null, iconClass: null        },
  { icon: '✏️',           label: 'Quizzes',       to: '/guidequizlist',          badge: 2,    iconClass: null        },
  { icon: '🏆',           label: 'Certificates',  to: '/guidecertifications',  badge: null, iconClass: null        },
  { icon: '🎖️',           label: 'Badges',        to: '/badge',         badge: null, iconClass: null        },
  { icon: '🔔',           label: 'Notifications', to: '/guidenotification',  badge: 1,    iconClass: null        },
  { icon: <ProfileIcon />, label: 'Profile',       to: '/guideprofile',       badge: null, iconClass: 'gnav-nav-icon--blue' },
]

export default function GuideNavbar() {
  const { logout } = useAuth()

  return (
    <aside className="gnav">
      <div className="gnav-brand">
        <div className="gnav-brand-icon">🌿</div>
        <div>
          <p className="gnav-brand-name">SFC Park Guide</p>
          <p className="gnav-brand-sub">Park Guide Portal</p>
        </div>
      </div>

      <div className="gnav-divider" />

      <nav className="gnav-nav">
        {NAV_ITEMS.map(({ icon, label, to, badge, iconClass }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['gnav-nav-item', isActive ? 'gnav-nav-item--active' : ''].join(' ').trim()
            }
          >
            <span className={['gnav-nav-icon', iconClass].filter(Boolean).join(' ')}>
              {icon}
            </span>
            <span className="gnav-nav-label">{label}</span>
            {badge !== null && (
              <span className="gnav-nav-badge">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="gnav-spacer" />
      <div className="gnav-divider" />

      <div className="gnav-user">
        <div className="gnav-user-avatar">NF</div>
        <div>
          <p className="gnav-user-name">Nurul Farhana</p>
          <p className="gnav-user-role">Park Guide</p>
        </div>
      </div>

      <button className="gnav-logout-btn" onClick={logout}>
        🚪 Logout
      </button>
    </aside>
  )
}
