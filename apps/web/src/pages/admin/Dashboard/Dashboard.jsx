import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import { useAuth } from '../../../rbac/AuthProvider'
import * as registrationsApi from '../../../api/registrations.js'
import * as usersApi from '../../../api/users.js'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'
import * as certificationsApi from '../../../api/certifications.js'
import * as modulesApi from '../../../api/modules.js'
import * as notificationsApi from '../../../api/notifications.js'
import { connectSocket, disconnectSocket } from '../../../api/socket.js'


const STAT_ACCENT_CLASSES = {
  blue:   'border-t-[#2b6cb0]',
  green:  'border-t-[#2d7d4e]',
  orange: 'border-t-[#d4920a]',
  copper: 'border-t-[#c96d38]',
}

const NOTIF_ICON = {
  REGISTRATION_SUBMITTED: { icon: '📋', color: '#2b6cb0' },
  QUIZ_ATTEMPT_SUBMITTED: { icon: '⚠️', color: '#d4920a' },
  MODULE_PUBLISHED:       { icon: '📚', color: '#38945e' },
  CERTIFICATION_ISSUED:   { icon: '🏆', color: '#38945e' },
  CUSTOM:                 { icon: '📣', color: '#c53030' },
}


export default function Dashboard() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const { user }     = useAuth()
  const [toast, setToast] = useState(null)

  const displayName = user?.email?.split('@')[0] ?? 'admin'
  const initials    = displayName.slice(0, 2).toUpperCase()

  useEffect(() => {
    const socket = connectSocket()

    socket.on('iot:alert', (alert) => {
      setToast(`🚨 New IoT alert: ${alert.detectionType} (${Math.round(alert.confidence * 100)}% confidence)`)
      queryClient.invalidateQueries({ queryKey: ['iot-alerts'] })
      queryClient.invalidateQueries({ queryKey: ['iot-alerts', 'pending-count'] })
    })

    return () => {
      socket.off('iot:alert')
      disconnectSocket()
    }
  }, [queryClient])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const { data: regData } = useQuery({
    queryKey: ['registrations', 'count'],
    queryFn: async () => {
      const res = await registrationsApi.getAll({ limit: 1 })
      return res.data.pagination?.total ?? 0
    },
  })

  const { data: guidesData } = useQuery({
    queryKey: ['users', 'guides', 'count'],
    queryFn: async () => {
      const res = await usersApi.getAll({ role: 'GUIDE', status: 'ACTIVE', limit: 1 })
      return res.data.pagination?.total ?? 0
    },
  })

  const { data: pendingData } = useQuery({
    queryKey: ['quiz-attempts', 'pending', 'count'],
    queryFn: async () => {
      const res = await quizAttemptsApi.getAll({ status: 'PENDING_REVIEW', limit: 1 })
      return res.data.pagination?.total ?? 0
    },
  })

  const { data: certsData } = useQuery({
    queryKey: ['certifications', 'count'],
    queryFn: async () => {
      const res = await certificationsApi.getAll({ limit: 1 })
      return res.data.pagination?.total ?? 0
    },
  })

  const { data: modulesData } = useQuery({
    queryKey: ['modules', 'published', 'count'],
    queryFn: async () => {
      const res = await modulesApi.getAll({ status: 'PUBLISHED', limit: 1 })
      return res.data.pagination?.total ?? 0
    },
  })

  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: async () => {
      const res = await notificationsApi.getMine({ limit: 4 })
      return res.data.data
    },
  })

  const totalReg      = regData     ?? '—'
  const activeGuides  = guidesData  ?? '—'
  const pendingReview = pendingData ?? '—'
  const certsIssued   = certsData   ?? '—'
  const modulesLive   = modulesData ?? '—'
  const recentNotifs  = notifData   ?? []

  const STATS = [
    { icon: '📋', value: String(totalReg),      label: 'Total Registrations', accent: 'blue'   },
    { icon: '👤', value: String(activeGuides),  label: 'Active Guides',        accent: 'green'  },
    { icon: '✏️', value: String(pendingReview), label: 'Pending Reviews',      accent: 'orange' },
    { icon: '🏆', value: String(certsIssued),   label: 'Certs Issued',         accent: 'copper' },
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
      <Navbar />

      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1a3a2a] text-white font-outfit text-[13.5px] font-medium py-3 px-5 rounded-xl shadow-lg flex items-center gap-3 max-w-sm animate-[fadeIn_0.2s_ease]">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white bg-transparent border-0 cursor-pointer text-lg leading-none ml-1">×</button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#e7e5e4] flex items-center justify-between px-4 sm:px-8 shrink-0">
          <h1 className="font-outfit text-[22px] font-semibold text-[#1c1917]">Dashboard</h1>
          <div className="flex items-center gap-2.5">
            <button
              className="w-9 h-9 flex items-center justify-center bg-[#f5f5f4] border-none rounded-lg cursor-pointer text-[15px] transition-colors duration-150 hover:bg-[#e7e5e4]"
              onClick={() => navigate('/notifications')}
            >
              🔔
            </button>
            <div className="w-9 h-9 bg-[#2d7d4e] rounded-full flex items-center justify-center font-outfit text-xs font-semibold text-white cursor-pointer shrink-0">{initials}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto py-5 px-4 sm:py-7 sm:px-8 flex flex-col gap-4.5">

          <section className="bg-[linear-gradient(130deg,#1f4d35_0%,#1a3a2a_100%)] rounded-xl py-6 px-5 sm:py-7 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between relative overflow-hidden gap-4 sm:gap-6">
            <div className="absolute rounded-full pointer-events-none w-80 h-80 -top-35 right-70 bg-[radial-gradient(circle,rgba(56,148,94,0.22)_0%,transparent_65%)]" />
            <div className="absolute rounded-full pointer-events-none w-55 h-55 -bottom-22.5 right-20 bg-[radial-gradient(circle,rgba(56,148,94,0.16)_0%,transparent_65%)]" />
            <div className="relative z-1">
              <h2 className="font-outfit text-[22px] font-semibold text-white mb-1.5">Welcome back! 👋</h2>
              <p className="font-serif text-sm text-white/70">Here's what's happening with SFC training today.</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5 shrink-0 relative z-1">
              <span className="py-2 px-3.5 rounded-[20px] font-outfit text-xs font-medium bg-[rgba(56,148,94,0.22)] text-[#a7f3c0] border border-[rgba(56,148,94,0.28)]">● {activeGuides} Active Guides</span>
              <span className="py-2 px-3.5 rounded-[20px] font-outfit text-xs font-medium bg-[rgba(201,109,56,0.22)] text-[#fcd9b6] border border-[rgba(201,109,56,0.28)]">● {modulesLive} Modules Live</span>
              <span className="py-2 px-3.5 rounded-[20px] font-outfit text-xs font-medium bg-[rgba(43,108,176,0.22)] text-[#bee3f8] border border-[rgba(43,108,176,0.28)]">● {certsIssued} Certs Issued</span>
            </div>
          </section>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className={`bg-white rounded-[10px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-t-4 border-t-transparent flex gap-3.5 items-start ${STAT_ACCENT_CLASSES[s.accent]}`}>
                <div className="w-11 h-11 rounded-[10px] bg-[#f5f5f4] flex items-center justify-center text-[20px] shrink-0">{s.icon}</div>
                <div className="flex-1">
                  <span className="font-outfit text-[28px] font-semibold text-[#1c1917] leading-none block mb-1">{s.value}</span>
                  <p className="font-outfit text-[12.5px] text-[#78716c] m-0">{s.label}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-[10px] py-5 px-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit text-[15px] font-semibold text-[#1c1917] mb-0.5">Recent Activity</h3>
                <button
                  onClick={() => navigate('/notifications')}
                  className="font-outfit text-[12.5px] font-medium text-[#2d7d4e] bg-transparent border-0 cursor-pointer hover:underline"
                >
                  View all →
                </button>
              </div>
              {recentNotifs.length > 0 ? (
                <ul className="list-none flex flex-col m-0 p-0">
                  {recentNotifs.map((notif) => {
                    const meta = NOTIF_ICON[notif.type] ?? NOTIF_ICON.CUSTOM
                    return (
                      <li key={notif.id} className="flex items-center gap-3 py-2.75 border-b border-[#f5f5f4] last:border-b-0 last:pb-0">
                        <div className="w-0.75 h-8.5 rounded-xs shrink-0" style={{ backgroundColor: meta.color }} />
                        <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-[14px] shrink-0" style={{ backgroundColor: `${meta.color}18` }}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-outfit text-[13px] text-[#44403c] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis m-0">{notif.title}</p>
                          <p className="font-outfit text-[11px] text-[#a8a29e] mt-0.5 m-0">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="font-outfit text-[13px] text-[#a8a29e] py-4 text-center">No recent activity.</p>
              )}
            </div>

            <div className="bg-white rounded-[10px] py-5 px-5.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-4">
                <h3 className="font-outfit text-[15px] font-semibold text-[#1c1917] mb-0.5">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📋', label: 'Registrations', path: '/registrations' },
                  { icon: '📚', label: 'New Module',    path: '/modules/new'   },
                  { icon: '🏆', label: 'Certifications',path: '/certifications'},
                  { icon: '📡', label: 'IoT Alerts',    path: '/iot-alerts'    },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center gap-2 py-5 px-2.5 bg-[#fdfbf7] border border-[#e7e5e4] rounded-[10px] cursor-pointer transition-[background-color,border-color] duration-150 hover:bg-[#f3faf6] hover:border-[#e8f5ee]"
                  >
                    <div className="w-11 h-11 bg-[#e8f5ee] rounded-[10px] flex items-center justify-center text-[20px]">{action.icon}</div>
                    <span className="font-outfit text-[13px] font-medium text-[#44403c]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <footer className="text-center font-outfit text-[11.5px] text-[#a8a29e] pt-1 pb-2">
            © 2026 SFC — Sarawak Forestry Corporation
          </footer>

        </main>
      </div>
    </div>
  )
}
