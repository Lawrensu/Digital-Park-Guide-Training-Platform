import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './registration.css'

const initialRegistrations = [
  { id: 1,  name: 'Ahmad bin Yusof',              email: 'ahmad.yusof@example.com',    date: '10 Mar 2024', status: 'Pending',  ic: '900101-01-1234' },
  { id: 2,  name: 'Siti Nurhaliza binti Tarudin', email: 'siti.nurhaliza@example.com', date: '09 Mar 2024', status: 'Approved', ic: '920215-14-5678' },
  { id: 3,  name: 'Lee Wei Ming',                 email: 'lee.weiming@example.com',    date: '09 Mar 2024', status: 'Approved', ic: '880512-08-9012' },
  { id: 4,  name: 'Priya a/p Subramaniam',        email: 'priya.subra@example.com',    date: '08 Mar 2024', status: 'Rejected', ic: '950620-03-3456' },
  { id: 5,  name: 'Muhammad Haziq bin Razlan',    email: 'haziq.razlan@example.com',   date: '08 Mar 2024', status: 'Pending',  ic: '990811-11-7890' },
  { id: 6,  name: 'Tan Mei Ling',                 email: 'tan.meiling@example.com',    date: '07 Mar 2024', status: 'Approved', ic: '910303-05-2345' },
  { id: 7,  name: 'Nur Afiqah binti Kamal',       email: 'afiqah.kamal@example.com',   date: '07 Mar 2024', status: 'Approved', ic: '970418-02-6789' },
  { id: 8,  name: 'Rajesh a/l Muthu',             email: 'rajesh.muthu@example.com',   date: '06 Mar 2024', status: 'Pending',  ic: '890909-09-0123' },
  { id: 9,  name: 'Chong Kit Yee',                email: 'kit.yee@example.com',        date: '05 Mar 2024', status: 'Approved', ic: '930121-06-4567' },
  { id: 10, name: 'Sarah binti Abdullah',         email: 'sarah.abdullah@example.com', date: '05 Mar 2024', status: 'Rejected', ic: '960505-12-8901' },
  { id: 11, name: 'Kumar a/l Shanmugam',          email: 'kumar.shan@example.com',     date: '04 Mar 2024', status: 'Approved', ic: '941231-07-2345' },
  { id: 12, name: 'Natasha binti Razak',          email: 'natasha.razak@example.com',  date: '03 Mar 2024', status: 'Pending',  ic: '981010-10-6789' },
]

const STAT_CONFIG = [
  { key: 'all',      label: 'Total',    colorClass: 'stat--total'    },
  { key: 'Pending',  label: 'Pending',  colorClass: 'stat--pending'  },
  { key: 'Approved', label: 'Approved', colorClass: 'stat--approved' },
  { key: 'Rejected', label: 'Rejected', colorClass: 'stat--rejected' },
]

export default function RegistrationPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const counts = {
    all:      initialRegistrations.length,
    Pending:  initialRegistrations.filter(r => r.status === 'Pending').length,
    Approved: initialRegistrations.filter(r => r.status === 'Approved').length,
    Rejected: initialRegistrations.filter(r => r.status === 'Rejected').length,
  }

  const filtered = initialRegistrations.filter(r => {
    const q = searchQuery.toLowerCase()
    const matchSearch = r.name.toLowerCase().includes(q) || r.ic.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    const matchFilter = activeFilter === 'all' || r.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <div className="reg-layout">
      <Navbar />

      <div className="reg-main">
        {/* ── Topbar ── */}
        <header className="reg-topbar">
          <h1 className="reg-topbar-title">Registrations</h1>
          <div className="reg-topbar-right">
            <button className="reg-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="reg-avatar" aria-label="Admin">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="reg-content">

          {/* Stats */}
          <section className="reg-stats">
            {STAT_CONFIG.map(({ key, label, colorClass }) => (
              <button
                key={key}
                className={`reg-stat ${colorClass} ${activeFilter === key ? 'reg-stat--active' : ''}`}
                onClick={() => setActiveFilter(key)}
              >
                <span className="reg-stat-label">{label}</span>
                <span className="reg-stat-value">{counts[key]}</span>
              </button>
            ))}
          </section>

          {/* Table section */}
          <section className="reg-table-section">
            {/* Search row */}
            <div className="reg-search-row">
              <div className="reg-search-wrap">
                <svg className="reg-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="reg-search-input"
                  placeholder="Search by name, IC or email…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="reg-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="reg-table-wrap">
              <table className="reg-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>IC Number</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <p className="reg-name">{r.name}</p>
                      </td>
                      <td className="reg-muted">{r.email}</td>
                      <td className="reg-mono">{r.ic}</td>
                      <td className="reg-muted">{r.date}</td>
                      <td>
                        <span className={`reg-badge reg-badge--${r.status.toLowerCase()}`}>{r.status}</span>
                      </td>
                      <td>
                        <button className="reg-btn-review" onClick={() => navigate(`/registration/${r.id}`)}>
                          Review <span aria-hidden>→</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="reg-empty">No registrations found.</td>
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
