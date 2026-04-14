import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './badge.css'

// --- Icons ---
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

// Badge Icons
const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
)

const LeafIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22s5.5-5.5 12-5.5 8 8 8 8-5.5-5.5-12-5.5-8-8-8-8Z"></path>
    <path d="M12 2C7 2 3 7 3 12s4 10 9 10c5 0 9-5 9-10S17 2 12 2Z"></path>
    <line x1="12" y1="2" x2="12" y2="22"></line>
  </svg>
)

const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

export default function BadgePage() {
  const navigate = useNavigate()

  const stats = {
    earned: 6,
    remaining: 6,
    complete: 50
  }

  const earnedBadges = [
    { 
      id: 1, 
      title: 'Forest Safety Certified', 
      date: 'Oct 12, 2023', 
      module: 'MOD-001',
      icon: <ShieldIcon />,
      color: '#2E7D32'
    },
    { 
      id: 2, 
      title: 'Eco Warrior', 
      date: 'Sep 28, 2023', 
      module: 'MOD-003',
      icon: <LeafIcon />,
      color: '#059669'
    },
    { 
      id: 3, 
      title: 'First Aider', 
      date: 'Sep 15, 2023', 
      module: 'MOD-002',
      icon: <StarIcon />,
      color: '#d97706'
    },
    { 
      id: 4, 
      title: 'Biodiversity Expert', 
      date: 'Aug 20, 2023', 
      module: 'MOD-004',
      icon: <LeafIcon />,
      color: '#0284c7'
    },
    { 
      id: 5, 
      title: 'Quiz Master', 
      date: 'Aug 10, 2023', 
      module: 'Quiz System',
      icon: <StarIcon />,
      color: '#7c3aed'
    },
    { 
      id: 6, 
      title: 'Early Bird', 
      date: 'Aug 01, 2023', 
      module: 'General',
      icon: <ShieldIcon />,
      color: '#ea580c'
    },
  ]

  const lockedBadges = [
    { 
      id: 7, 
      title: 'Master Guide', 
      req: 'Complete all Level 2 Modules',
      icon: <ShieldIcon />,
    },
    { 
      id: 8, 
      title: 'Legend', 
      req: 'Achieve 100% on all quizzes',
      icon: <StarIcon />,
    },
    { 
      id: 9, 
      title: 'Speed Demon', 
      req: 'Finish a module in under 1 day',
      icon: <LeafIcon />,
    },
    { 
      id: 10, 
      title: 'Social Butterfly', 
      req: 'Refer 5 friends',
      icon: <StarIcon />,
    },
    { 
      id: 11, 
      title: 'Night Owl', 
      req: 'Complete training after 10 PM',
      icon: <ShieldIcon />,
    },
    { 
      id: 12, 
      title: 'Perfect Score', 
      req: 'Score 100% on Final Assessment',
      icon: <StarIcon />,
    },
    { 
      id: 13, 
      title: 'Conservationist', 
      req: 'Complete 3 Field Projects',
      icon: <LeafIcon />,
    },
    { 
      id: 14, 
      title: 'Veteran', 
      req: 'Active member for 1 year',
      icon: <ShieldIcon />,
    },
  ]

  return (
    <div className="bdg-page-container">
      <GuideNavbar />

      <div className="bdg-main-wrapper">
        
        {/* Topbar */}
        <header className="bdg-topbar">
          <h1 className="bdg-title">Profile</h1>

          <div className="bdg-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="bdg-user-actions">
            <button className="bdg-icon-btn">
              <BellIcon />
              <span className="bdg-notification-dot"></span>
            </button>
            <div className="bdg-avatar">NF</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bdg-content-area">
          
          <div className="bdg-header-row">
            <h2 className="bdg-heading">My Badges</h2>
          </div>

          {/* Stats Row */}
          <div className="bdg-stats-container">
            <div className="bdg-stat-card bdg-earned-stat">
              <div className="bdg-stat-value">{stats.earned}</div>
              <div className="bdg-stat-label">Badges Earned</div>
            </div>
            <div className="bdg-stat-card bdg-remaining-stat">
              <div className="bdg-stat-value">{stats.remaining}</div>
              <div className="bdg-stat-label">Remaining</div>
            </div>
            <div className="bdg-stat-card bdg-complete-stat">
              <div className="bdg-stat-value">{stats.complete}%</div>
              <div className="bdg-stat-label">Collection Complete</div>
              <div className="bdg-progress-bg">
                <div className="bdg-progress-fill" style={{ width: `${stats.complete}%` }}></div>
              </div>
            </div>
          </div>

          {/* Earned Badges Section */}
          <div className="bdg-section">
            <h3 className="bdg-section-title">Earned Badges</h3>
            <div className="bdg-grid">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="bdg-card bdg-card-earned">
                  <div className="bdg-icon-wrapper" style={{ color: badge.color }}>
                    {badge.icon}
                  </div>
                  <h4 className="bdg-card-title">{badge.title}</h4>
                  <div className="bdg-card-meta">
                    <span className="bdg-meta-item">📅 {badge.date}</span>
                    <span className="bdg-meta-item">📚 {badge.module}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Badges Section */}
          <div className="bdg-section">
            <h3 className="bdg-section-title">Locked Badges</h3>
            <div className="bdg-grid">
              {lockedBadges.map(badge => (
                <div key={badge.id} className="bdg-card bdg-card-locked">
                  <div className="bdg-lock-overlay">
                    <LockIcon />
                  </div>
                  <div className="bdg-icon-wrapper bdg-icon-locked">
                    {badge.icon}
                  </div>
                  <h4 className="bdg-card-title">{badge.title}</h4>
                  <p className="bdg-lock-reason">{badge.req}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}