import { useState } from 'react'
import Navbar from '../../../components/navbar/navbar'
import './setting.css'

const initialAdmins = [
  { id: 1, name: 'Admin User',   email: 'admin@sfc.com',        role: 'Super Admin', status: 'Active',   lastLogin: '2026-04-13' },
  { id: 2, name: 'Trainer One',  email: 'trainer1@sfc.com',     role: 'Trainer',     status: 'Active',   lastLogin: '2026-04-12' },
  { id: 3, name: 'Trainer Two',  email: 'trainer2@sfc.com',     role: 'Trainer',     status: 'Active',   lastLogin: '2026-04-10' },
  { id: 4, name: 'Backup Admin', email: 'backup@sfc.com',       role: 'Admin',       status: 'Inactive', lastLogin: '2026-03-01' },
]

const ROLES = ['Admin', 'Trainer', 'Super Admin']
const TABS = ['Admin Accounts', 'System Config', 'Notifications']

const systemConfig = [
  { label: 'Session Timeout',   value: '30 Minutes',  desc: 'Automatic logout after inactivity' },
  { label: 'Password Policy',   value: 'Strong',      desc: 'Minimum length and complexity required' },
  { label: 'Two-Factor Auth',   value: 'Enabled',     desc: 'Extra layer of security for all accounts' },
  { label: 'Platform Version',  value: 'v2.4.0',      desc: 'Current deployed application version' },
  { label: 'Data Backup',       value: 'Daily',       desc: 'Automated daily backup of all records' },
  { label: 'Maintenance Mode',  value: 'Off',         desc: 'Enable to show maintenance page to users' },
]

const notifConfig = [
  { label: 'New Registration',    desc: 'Notify admins when a new guide registration is submitted',  enabled: true  },
  { label: 'Quiz Submission',     desc: 'Notify admins when a guide submits a quiz for review',       enabled: true  },
  { label: 'IoT Critical Alert',  desc: 'Push notifications for critical sensor/device alerts',       enabled: true  },
  { label: 'Module Published',    desc: 'Notify all active guides when a new module is published',    enabled: false },
  { label: 'Certificate Expiry',  desc: 'Remind guides 30 days before their certification expires',   enabled: true  },
  { label: 'System Broadcast',    desc: 'Allow admins to send broadcast messages to all guides',      enabled: false },
]

export default function SettingPage() {
  const [activeTab, setActiveTab]     = useState('Admin Accounts')
  const [admins, setAdmins]           = useState(initialAdmins)
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]             = useState('')
  const [role, setRole]               = useState('Admin')
  const [notifs, setNotifs]           = useState(notifConfig)

  const handleCreate = () => {
    if (!fullName.trim() || !email.trim()) return
    const newAdmin = {
      id: Date.now(),
      name: fullName.trim(),
      email: email.trim(),
      role,
      status: 'Active',
      lastLogin: '—',
    }
    setAdmins(prev => [...prev, newAdmin])
    setFullName('')
    setEmail('')
    setRole('Admin')
  }

  const toggleNotif = (idx) => {
    setNotifs(prev => prev.map((n, i) => i === idx ? { ...n, enabled: !n.enabled } : n))
  }

  return (
    <div className="set-layout">
      <Navbar />

      <div className="set-main">
        {/* Topbar */}
        <header className="set-topbar">
          <h1 className="set-topbar-title">Settings</h1>
          <div className="set-topbar-right">
            <button className="set-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="set-avatar">AM</div>
          </div>
        </header>

        {/* Content */}
        <main className="set-content">

          {/* Tabs */}
          <div className="set-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`set-tab ${activeTab === tab ? 'set-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Admin Accounts ── */}
          {activeTab === 'Admin Accounts' && (
            <>
              {/* Table section */}
              <div className="set-table-section">
                <div className="set-table-header">
                  <h2 className="set-section-title">Admin Accounts</h2>
                  <button className="set-btn-add">+ Add Admin</button>
                </div>
                <div className="set-table-wrap">
                  <table className="set-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(admin => (
                        <tr key={admin.id}>
                          <td className="set-name">{admin.name}</td>
                          <td className="set-muted">{admin.email}</td>
                          <td className="set-role">{admin.role}</td>
                          <td>
                            <span className={`set-badge set-badge--${admin.status.toLowerCase()}`}>
                              {admin.status}
                            </span>
                          </td>
                          <td className="set-muted">{admin.lastLogin}</td>
                          <td>
                            <button className="set-btn-edit">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create form */}
              <div className="set-form-card">
                <h2 className="set-section-title">Create New Admin</h2>
                <div className="set-form-row">
                  <div className="set-form-field">
                    <label className="set-label">Full Name</label>
                    <input
                      className="set-input"
                      type="text"
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="set-form-field">
                    <label className="set-label">Email</label>
                    <input
                      className="set-input"
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="set-form-bottom">
                  <div className="set-form-field">
                    <label className="set-label">Role</label>
                    <select
                      className="set-select"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <button className="set-btn-create" onClick={handleCreate}>Create</button>
                </div>
              </div>
            </>
          )}

          {/* ── System Config ── */}
          {activeTab === 'System Config' && (
            <div className="set-config-section">
              <h2 className="set-section-title">System Configuration</h2>
              <div className="set-config-list">
                {systemConfig.map(item => (
                  <div key={item.label} className="set-config-item">
                    <div className="set-config-info">
                      <p className="set-config-label">{item.label}</p>
                      <p className="set-config-desc">{item.desc}</p>
                    </div>
                    <span className="set-config-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'Notifications' && (
            <div className="set-config-section">
              <h2 className="set-section-title">Notification Settings</h2>
              <div className="set-config-list">
                {notifs.map((item, idx) => (
                  <div key={item.label} className="set-config-item">
                    <div className="set-config-info">
                      <p className="set-config-label">{item.label}</p>
                      <p className="set-config-desc">{item.desc}</p>
                    </div>
                    <button
                      className={`set-toggle ${item.enabled ? 'set-toggle--on' : ''}`}
                      onClick={() => toggleNotif(idx)}
                      aria-label={`Toggle ${item.label}`}
                    >
                      <span className="set-toggle-thumb" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
