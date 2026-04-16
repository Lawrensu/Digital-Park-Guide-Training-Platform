import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './guide.css'

const initialGuides = [
  { id: 1, name: 'Siti Nurhaliza binti Tarudin', email: 'siti.nurhaliza@example.com', status: 'Active',    enrolments: 12, certs: 3 },
  { id: 2, name: 'Lee Wei Ming',                 email: 'lee.weiming@example.com',    status: 'Active',    enrolments: 8,  certs: 2 },
  { id: 3, name: 'Priya a/p Subramaniam',        email: 'priya.subra@example.com',    status: 'Suspended', enrolments: 5,  certs: 1 },
  { id: 4, name: 'Ahmad bin Yusof',              email: 'ahmad.yusof@example.com',    status: 'Active',    enrolments: 15, certs: 4 },
  { id: 5, name: 'Tan Mei Ling',                 email: 'tan.meiling@example.com',    status: 'Inactive',  enrolments: 0,  certs: 1 },
  { id: 6, name: 'Muhammad Haziq bin Razlan',    email: 'haziq.razlan@example.com',   status: 'Active',    enrolments: 9,  certs: 2 },
  { id: 7, name: 'Nur Afiqah binti Kamal',       email: 'afiqah.kamal@example.com',   status: 'Active',    enrolments: 11, certs: 3 },
  { id: 8, name: 'Rajesh a/l Muthu',             email: 'rajesh.muthu@example.com',   status: 'Active',    enrolments: 6,  certs: 2 },
]

const STAT_CONFIG = [
  { key: 'all',       label: 'Total Guides', colorClass: 'guide-stat--total'     },
  { key: 'Active',    label: 'Active',       colorClass: 'guide-stat--active'    },
  { key: 'Inactive',  label: 'Inactive',     colorClass: 'guide-stat--inactive'  },
  { key: 'Suspended', label: 'Suspended',    colorClass: 'guide-stat--suspended' },
]

export default function GuidePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const counts = {
    all:       initialGuides.length,
    Active:    initialGuides.filter(g => g.status === 'Active').length,
    Inactive:  initialGuides.filter(g => g.status === 'Inactive').length,
    Suspended: initialGuides.filter(g => g.status === 'Suspended').length,
  }

  const filtered = initialGuides.filter(g => {
    const q = searchQuery.toLowerCase()
    const matchSearch = g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
    const matchFilter = activeFilter === 'all' || g.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <div className="guide-layout">
      <Navbar />

      <div className="guide-main">
        {/* ── Topbar ── */}
        <header className="guide-topbar">
          <h1 className="guide-topbar-title">Guides</h1>
          <div className="guide-topbar-right">
            <button className="guide-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="guide-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="guide-content">

          {/* Stats */}
          <section className="guide-stats">
            {STAT_CONFIG.map(({ key, label, colorClass }) => (
              <button
                key={key}
                className={`guide-stat ${colorClass} ${activeFilter === key ? 'guide-stat--active' : ''}`}
                onClick={() => setActiveFilter(key)}
              >
                <span className="guide-stat-label">{label}</span>
                <span className="guide-stat-value">{counts[key]}</span>
              </button>
            ))}
          </section>

          {/* Table section */}
          <section className="guide-table-section">
            {/* Search row */}
            <div className="guide-search-row">
              <div className="guide-search-wrap">
                <svg className="guide-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="guide-search-input"
                  placeholder="Search guides…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="guide-result-count">{filtered.length} guide{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Enrolments</th>
                    <th>Certifications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(g => (
                    <tr key={g.id}>
                      <td><p className="guide-name">{g.name}</p></td>
                      <td className="guide-muted">{g.email}</td>
                      <td>
                        <span className={`guide-badge guide-badge--${g.status.toLowerCase()}`}>{g.status}</span>
                      </td>
                      <td className="guide-count">{g.enrolments}</td>
                      <td className="guide-count">{g.certs}</td>
                      <td>
                        <button className="guide-btn-view" onClick={() => navigate(`/guides/${g.id}`)}>
                          View <span aria-hidden>→</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="guide-empty">No guides found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
