import { useState } from 'react'
import './dashboard.css'
import Navbar from '../../../components/navbar/navbar'

/* ── Static data (replace with API calls later) ── */
const STATS = [
  { icon: '📋', value: '124', change: '+12%', changeType: 'up',   label: 'Total Registrations', accent: 'blue'   },
  { icon: '👤', value: '48',  change: '+4',   changeType: 'up',   label: 'Active Guides',        accent: 'green'  },
  { icon: '✏️', value: '8',   change: '-2',   changeType: 'down', label: 'Pending Reviews',      accent: 'orange' },
  { icon: '🏆', value: '156', change: '+18%', changeType: 'up',   label: 'Certs Issued',         accent: 'copper' },
]

const CHART_DATA = [
  { month: 'Nov', value: 18 },
  { month: 'Dec', value: 24 },
  { month: 'Jan', value: 31 },
  { month: 'Feb', value: 22 },
  { month: 'Mar', value: 38 },
  { month: 'Apr', value: 29 },
]

const CERT_RATES = [
  { module: 'Forest Safety',   rate: 87, color: '#38945e' },
  { module: 'Wildlife ID',     rate: 72, color: '#2b6cb0' },
  { module: 'Trail Navigation',rate: 91, color: '#c96d38' },
  { module: 'First Aid',       rate: 65, color: '#d4920a' },
  { module: 'Eco Principles',  rate: 78, color: '#266841' },
]

const ACTIVITY = [
  {
    icon: '📋',
    text: 'Nurul Ain registered for Forest Safety module',
    time: '2 min ago',
    color: '#2b6cb0',
  },
  {
    icon: '🏆',
    text: 'Ahmad Razif passed Wildlife ID certification',
    time: '18 min ago',
    color: '#38945e',
  },
  {
    icon: '⚠️',
    text: 'Quiz review flagged for Siti Hajar',
    time: '1 hr ago',
    color: '#d4920a',
  },
  {
    icon: '📡',
    text: 'New IoT alert: Sensor A3 offline',
    time: '2 hr ago',
    color: '#c53030',
  },
]

const QUICK_ACTIONS = [
  { icon: '👤', label: 'Add Guide'   },
  { icon: '📚', label: 'New Module'  },
  { icon: '🏆', label: 'Issue Cert'  },
  { icon: '📡', label: 'View Alerts' },
]

const Y_AXIS    = [40, 30, 20, 10, 0]
const BAR_MAX   = 40
const BAR_PX    = 130 // pixel height of the bars area

export default function Dashboard() {
  return (
    <div className="db-layout">
      <Navbar />

      <div className="db-main">
        {/* ── Top Bar ── */}
        <header className="db-topbar">
          <h1 className="db-topbar-title">Dashboard</h1>
          <div className="db-topbar-right">
            <div className="db-search">
              <span className="db-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                className="db-search-input"
              />
            </div>
            <button className="db-icon-btn" aria-label="Notifications">🔔</button>
            <div className="db-avatar" aria-label="Ahmad Malik">AM</div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <main className="db-content">

          {/* Welcome Banner */}
          <section className="db-welcome">
            <div className="db-welcome-deco db-welcome-deco--1" />
            <div className="db-welcome-deco db-welcome-deco--2" />
            <div className="db-welcome-text">
              <h2 className="db-welcome-title">Welcome back, Ahmad! 👋</h2>
              <p className="db-welcome-sub">
                Here's what's happening with SFC training today.
              </p>
            </div>
            <div className="db-welcome-chips">
              <span className="db-chip db-chip--green">● 48 Active Guides</span>
              <span className="db-chip db-chip--orange">● 8 Modules Live</span>
              <span className="db-chip db-chip--blue">● 156 Certs Issued</span>
            </div>
          </section>

          {/* Stats Row */}
          <section className="db-stats">
            {STATS.map((s) => (
              <div key={s.label} className={`db-stat db-stat--${s.accent}`}>
                <div className="db-stat-icon">{s.icon}</div>
                <div className="db-stat-body">
                  <div className="db-stat-top">
                    <span className="db-stat-value">{s.value}</span>
                    <span className={`db-stat-change db-stat-change--${s.changeType}`}>
                      {s.change}
                    </span>
                  </div>
                  <p className="db-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Charts Row */}
          <section className="db-charts">
            {/* Monthly Registrations Bar Chart */}
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">Monthly Registrations</h3>
                <p className="db-card-sub">Last 6 months</p>
              </div>
              <div className="db-barchart">
                {/* Y-axis */}
                <div className="db-barchart-yaxis">
                  {Y_AXIS.map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
                {/* Bars area */}
                <div className="db-barchart-area">
                  <div className="db-barchart-bars" style={{ height: BAR_PX }}>
                    {CHART_DATA.map((d) => (
                      <div key={d.month} className="db-barchart-col">
                        <span className="db-barchart-val">{d.value}</span>
                        <div
                          className="db-barchart-bar"
                          style={{
                            height: Math.round((d.value / BAR_MAX) * BAR_PX),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* X-axis */}
                  <div className="db-barchart-xaxis">
                    {CHART_DATA.map((d) => (
                      <span key={d.month} className="db-barchart-xlabel">
                        {d.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Rate by Module */}
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">Certification Rate by Module</h3>
                <p className="db-card-sub">Pass rate this quarter</p>
              </div>
              <div className="db-certrates">
                {CERT_RATES.map((item) => (
                  <div key={item.module} className="db-certrate-row">
                    <div className="db-certrate-meta">
                      <span className="db-certrate-module">{item.module}</span>
                      <span
                        className="db-certrate-pct"
                        style={{ color: item.color }}
                      >
                        {item.rate}%
                      </span>
                    </div>
                    <div className="db-certrate-track">
                      <div
                        className="db-certrate-fill"
                        style={{
                          width: `${item.rate}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Row */}
          <section className="db-bottom">
            {/* Recent Activity */}
            <div className="db-card">
              <div className="db-card-header db-card-header--row">
                <h3 className="db-card-title">Recent Activity</h3>
                <a href="#" className="db-card-link">View all →</a>
              </div>
              <ul className="db-activity">
                {ACTIVITY.map((item, i) => (
                  <li key={i} className="db-activity-item">
                    <div
                      className="db-activity-border"
                      style={{ backgroundColor: item.color }}
                    />
                    <div
                      className="db-activity-icon"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      {item.icon}
                    </div>
                    <div className="db-activity-body">
                      <p className="db-activity-text">{item.text}</p>
                      <p className="db-activity-time">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">Quick Actions</h3>
              </div>
              <div className="db-quickactions">
                {QUICK_ACTIONS.map((action) => (
                  <button key={action.label} className="db-quickaction-btn">
                    <div className="db-quickaction-icon">{action.icon}</div>
                    <span className="db-quickaction-label">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="db-footer">
            © 2026 SFC — Sabah Forestry Corporation
          </footer>

        </main>
      </div>
    </div>
  )
}
