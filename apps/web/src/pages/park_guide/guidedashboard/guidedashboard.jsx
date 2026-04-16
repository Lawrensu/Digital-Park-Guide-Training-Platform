import { useState } from 'react'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidedashboard.css'

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const stats = [
  { value: '5',   label: 'Modules Enrolled',   sub: '2 in progress', color: 'teal'   },
  { value: '8',   label: 'Quizzes Completed',  sub: '2 pending',     color: 'blue'   },
  { value: '2',   label: 'Certs Earned',        sub: '1 in review',   color: 'orange' },
  { value: '34h', label: 'Training Hours',      sub: 'this month',    color: 'yellow' },
]

const modules = [
  { id: 'MOD-001', title: 'Forest Safety & Hazard Awareness',    status: 'On Track',    color: 'green',  progress: 85, lessons: '10/11', due: 'Due 18 Apr 2026' },
  { id: 'MOD-002', title: 'Wildlife Identification & Behaviour', status: 'In Progress', color: 'blue',   progress: 52, lessons: '5/10',  due: 'Due 25 Apr 2026' },
  { id: 'MOD-003', title: 'Trail Navigation & GPS Usage',        status: 'Just Started',color: 'orange', progress: 20, lessons: '2/9',   due: 'Due 10 May 2026' },
]

const assessments = [
  { day: '15', month: 'Apr', title: 'Forest Safety — Final Quiz',          sub: 'MOD-001 · Quiz',       urgent: true,  color: 'red'    },
  { day: '19', month: 'Apr', title: 'Wildlife ID — Mid Assessment',        sub: 'MOD-002 · Assessment', urgent: false, color: 'orange' },
  { day: '28', month: 'Apr', title: 'Trail Navigation — Practical Test',   sub: 'MOD-003 · Practical',  urgent: false, color: 'blue'   },
]

const certificates = [
  { name: 'Eco-Tourism Fundamentals',  dates: 'Issued: Jan 2026 · Expires: Jan 2028', certId: 'CERT-0041' },
  { name: 'Basic Wilderness First Aid', dates: 'Issued: Mar 2026 · Expires: Mar 2028', certId: 'CERT-0067' },
]

export default function GuideDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="pgd-page">
      <GuideNavbar />

      <div className="pgd-main">

        {/* ── Content ── */}
        <main className="pgd-content">

          <header className="pgd-topbar">
            <h1 className="pgd-topbar-title">Dashboard</h1>
          </header>

          {/* Welcome Banner */}
          <div className="pgd-welcome-banner">
            <div className="pgd-welcome-text">
              <h2 className="pgd-welcome-heading">Welcome back, Nurul! 🌿</h2>
              <p className="pgd-welcome-sub">Keep up the great work. You're 68% through your training program.</p>
            </div>
            <div className="pgd-welcome-progress-row">
              <div className="pgd-welcome-bar-bg">
                <div className="pgd-welcome-bar-fill" style={{ width: '68%' }}></div>
              </div>
              <span className="pgd-welcome-progress-label">68% Overall Progress</span>
            </div>
            <div className="pgd-welcome-decor"></div>
          </div>

          {/* Stats */}
          <div className="pgd-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={`pgd-stat-card pgd-stat-card--${stat.color}`}>
                <div className={`pgd-stat-badge pgd-stat-badge--${stat.color}`}>
                  {stat.value}
                </div>
                <div className="pgd-stat-info">
                  <span className="pgd-stat-label">{stat.label}</span>
                  <span className="pgd-stat-sub">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modules In Progress */}
          <div className="pgd-section">
            <div className="pgd-section-header">
              <h3 className="pgd-section-title">Modules In Progress</h3>
              <a href="#" className="pgd-view-all">View all →</a>
            </div>
            <div className="pgd-modules-grid">
              {modules.map((mod, i) => (
                <div key={i} className={`pgd-module-card pgd-module-card--${mod.color}`}>
                  <div className="pgd-module-card-header">
                    <span className="pgd-module-id">{mod.id}</span>
                    <span className={`pgd-status-badge pgd-status-badge--${mod.color}`}>{mod.status}</span>
                  </div>
                  <h4 className="pgd-module-title">{mod.title}</h4>
                  <div className="pgd-module-bar-bg">
                    <div
                      className={`pgd-module-bar-fill pgd-module-bar-fill--${mod.color}`}
                      style={{ width: `${mod.progress}%` }}
                    ></div>
                  </div>
                  <p className={`pgd-module-progress-text pgd-module-progress-text--${mod.color}`}>
                    {mod.progress}% complete
                  </p>
                  <div className="pgd-module-footer">
                    <span className="pgd-module-lessons">{mod.lessons} lessons</span>
                    <span className="pgd-module-due">{mod.due}</span>
                  </div>
                  <button className="pgd-continue-btn">Continue →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Two Columns */}
          <div className="pgd-bottom-grid">

            {/* Upcoming Assessments */}
            <div className="pgd-card">
              <div className="pgd-section-header">
                <h3 className="pgd-section-title">Upcoming Assessments</h3>
              </div>
              <p className="pgd-assessments-due">2 due this week</p>
              <div className="pgd-assessments-list">
                {assessments.map((a, i) => (
                  <div key={i} className="pgd-assessment-item">
                    <div className={`pgd-date-box pgd-date-box--${a.color}`}>
                      <span className="pgd-date-day">{a.day}</span>
                      <span className="pgd-date-month">{a.month}</span>
                    </div>
                    <div className="pgd-assessment-info">
                      <p className="pgd-assessment-title">{a.title}</p>
                      <p className="pgd-assessment-sub">{a.sub}</p>
                      {a.urgent && <span className="pgd-urgent-badge">⚠️ Urgent</span>}
                    </div>
                    <button className={`pgd-start-btn ${a.urgent ? 'pgd-start-btn--urgent' : 'pgd-start-btn--default'}`}>
                      Start →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* My Certificates */}
            <div className="pgd-card">
              <div className="pgd-section-header">
                <h3 className="pgd-section-title">My Certificates</h3>
                <a href="#" className="pgd-view-all">View all →</a>
              </div>
              <div className="pgd-certs-list">
                {certificates.map((cert, i) => (
                  <div key={i} className="pgd-cert-item">
                    <div className="pgd-cert-icon">🏆</div>
                    <div className="pgd-cert-info">
                      <p className="pgd-cert-name">{cert.name}</p>
                      <p className="pgd-cert-dates">{cert.dates}</p>
                      <p className="pgd-cert-id">{cert.certId}</p>
                      <span className="pgd-cert-active-badge">✓ Active</span>
                    </div>
                    <button className="pgd-pdf-btn">📄 PDF</button>
                  </div>
                ))}
              </div>
              <div className="pgd-cert-notice">
                ⏳ Trail Navigation Cert is under review — results expected 30 Apr 2026
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
