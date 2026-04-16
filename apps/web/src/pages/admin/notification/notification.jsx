import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './notification.css'

const initialNotifications = [
  { id: 1, type: 'registration', title: 'New registration submitted',   desc: 'Ahmad bin Yusof has submitted a registration form.',             time: '10 min ago', read: false },
  { id: 2, type: 'quiz',         title: 'Quiz attempt ready for review', desc: 'Siti Nurhaliza scored 85% on Rainforest Biodiversity Quiz.',     time: '1 hr ago',   read: false },
  { id: 3, type: 'module',       title: 'Module content updated',        desc: 'Wildlife Conservation module has been updated by Admin.',        time: '3 hr ago',   read: true  },
  { id: 4, type: 'registration', title: 'New registration submitted',   desc: 'Lee Wei Ming has submitted a registration form.',                time: '5 hr ago',   read: true  },
  { id: 5, type: 'custom',       title: 'Custom Notification Sent',     desc: 'Maintenance scheduled for tonight at 10 PM.',                    time: '1 day ago',  read: true, recipient: 'All Active Guides' },
]

const TYPE_META = {
  registration: { bg: '#e8f5ee', color: '#266841', label: 'Registration' },
  quiz:         { bg: '#fdf0e6', color: '#b35c2a', label: 'Quiz'         },
  module:       { bg: '#f0e9db', color: '#6b5c4a', label: 'Module'       },
  custom:       { bg: '#e8f5ee', color: '#1a3a2a', label: 'Broadcast'    },
}

function TypeIcon({ type }) {
  const meta = TYPE_META[type] || TYPE_META.custom
  const icons = {
    registration: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    quiz: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    module: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
    custom: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
      </svg>
    ),
  }
  return (
    <div className="notif-icon" style={{ backgroundColor: meta.bg, color: meta.color }}>
      {icons[type] || icons.custom}
    </div>
  )
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [recipient, setRecipient]         = useState('All Active Guides (48)')
  const [message, setMessage]             = useState('')
  const [isModalOpen, setIsModalOpen]     = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleSend = () => {
    if (!message.trim()) return
    const newNotif = {
      id: Date.now(), type: 'custom', title: 'Custom Notification Sent',
      desc: message, time: 'Just now', read: false, recipient,
    }
    setNotifications(prev => [newNotif, ...prev])
    setMessage('')
  }

  const handleClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
    if (notif.type === 'custom') {
      setSelectedNotif(notif); setIsModalOpen(true)
    } else {
      if (notif.type === 'registration') navigate('/registrations')
      if (notif.type === 'quiz')         navigate('/quizzes')
      if (notif.type === 'module')       navigate('/modules')
    }
  }

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <div className="notif-layout">
      <Navbar />

      <div className="notif-main">
        {/* ── Topbar ── */}
        <header className="notif-topbar">
          <h1 className="notif-topbar-title">Notifications</h1>
          <div className="notif-topbar-right">
            <button className="notif-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="notif-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="notif-content">

          {/* Send card */}
          <div className="notif-send-card">
            <h2 className="notif-send-title">Send Custom Notification</h2>
            <div className="notif-send-fields">
              <div className="notif-field">
                <label className="notif-label">Recipient</label>
                <select
                  className="notif-select"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                >
                  <option>All Active Guides (48)</option>
                  <option>All Admins</option>
                  <option>Specific User</option>
                </select>
              </div>
              <div className="notif-field notif-field--grow">
                <label className="notif-label">Message</label>
                <textarea
                  className="notif-textarea"
                  rows="3"
                  placeholder="Type your notification message here…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>
            <div className="notif-send-footer">
              <button className="notif-btn-send" onClick={handleSend}>
                Send Notification
              </button>
            </div>
          </div>

          {/* Inbox */}
          <div className="notif-inbox-section">
            <div className="notif-inbox-header">
              <div className="notif-inbox-title-row">
                <h2 className="notif-inbox-title">Inbox</h2>
                {unreadCount > 0 && (
                  <span className="notif-unread-chip">{unreadCount} unread</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button className="notif-mark-all" onClick={markAllRead}>
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.read ? 'notif-item--unread' : ''}`}
                  onClick={() => handleClick(notif)}
                >
                  <TypeIcon type={notif.type} />
                  <div className="notif-item-body">
                    <div className="notif-item-top">
                      <div className="notif-item-left">
                        <span className="notif-item-title">{notif.title}</span>
                        {!notif.read && <span className="notif-dot" aria-hidden />}
                      </div>
                      <span className="notif-item-time">{notif.time}</span>
                    </div>
                    <p className="notif-item-desc">{notif.desc}</p>
                    {notif.type === 'custom' && notif.recipient && (
                      <p className="notif-item-recipient">Sent to: {notif.recipient}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* Modal */}
      {isModalOpen && selectedNotif && (
        <div className="notif-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="notif-modal" onClick={e => e.stopPropagation()}>
            <div className="notif-modal-header">
              <h3 className="notif-modal-title">Notification Details</h3>
              <button className="notif-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="notif-modal-body">
              <div className="notif-modal-field">
                <p className="notif-modal-field-label">Recipient</p>
                <p className="notif-modal-field-value">{selectedNotif.recipient}</p>
              </div>
              <div className="notif-modal-field">
                <p className="notif-modal-field-label">Message</p>
                <p className="notif-modal-field-value">{selectedNotif.desc}</p>
              </div>
            </div>
            <div className="notif-modal-footer">
              <button className="notif-btn-send" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
