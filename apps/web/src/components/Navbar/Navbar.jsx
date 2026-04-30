import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../rbac/AuthProvider'
import * as registrationsApi from '../../api/registrations.js'
import * as quizAttemptsApi from '../../api/quizAttempts.js'
import * as iotAlertsApi from '../../api/iotAlerts.js'

const BASE_NAV = [
    { icon: '⊞', label: 'Dashboard',      to: '/dashboard'       },
    { icon: '📋', label: 'Registrations', to: '/registrations'   },
    { icon: '📚', label: 'Modules',       to: '/modules'         },
    { icon: '👤', label: 'Guides',        to: '/guides'          },
    { icon: '✏️', label: 'Quiz Reviews',  to: '/quiz-reviews'    },
    { icon: '🏆', label: 'Certifications',to: '/certifications'  },
    { icon: '📡', label: 'IoT Alerts',    to: '/iot-alerts'      },
    { icon: '🔔', label: 'Notifications', to: '/notifications'   },
    { icon: '⚙️', label: 'Settings',      to: '/settings/admins' },
]

export default function Navbar() {
    const { logout, user } = useAuth()

    const { data: pendingRegs } = useQuery({
        queryKey: ['registrations', 'pending-count'],
        queryFn: async () => {
            const res = await registrationsApi.getAll({ status: 'PENDING', limit: 1 })
            return res.data.pagination?.total ?? 0
        },
        staleTime: 60_000,
    })

    const { data: pendingQuizzes } = useQuery({
        queryKey: ['quiz-attempts', 'pending-count'],
        queryFn: async () => {
            const res = await quizAttemptsApi.getAll({ status: 'PENDING_REVIEW', limit: 1 })
            return res.data.pagination?.total ?? 0
        },
        staleTime: 60_000,
    })

    const { data: openAlerts } = useQuery({
        queryKey: ['iot-alerts', 'pending-count'],
        queryFn: async () => {
            const res = await iotAlertsApi.getAll({ status: 'PENDING', limit: 1 })
            return res.data.pagination?.total ?? 0
        },
        staleTime: 60_000,
    })

    const BADGE_MAP = {
        '/registrations': pendingRegs  ?? 0,
        '/quiz-reviews':  pendingQuizzes ?? 0,
        '/iot-alerts':    openAlerts   ?? 0,
    }

    const NAV_ITEMS = BASE_NAV.map(item => ({
        ...item,
        badge: BADGE_MAP[item.to] > 0 ? BADGE_MAP[item.to] : null,
    }))

    const displayName = user?.email?.split('@')[0] ?? 'Admin'
    const initials    = displayName.slice(0, 2).toUpperCase()

    return (
        <aside className="w-[220px] h-screen bg-[#1a3a2a] flex flex-col px-[14px] py-6 shrink-0 sticky top-0 overflow-y-auto">

            {/* SFC logo slot: replace the inner div with <img src={sfcLogo} alt="SFC" className="w-9 h-9 object-contain" /> once the asset is available */}
            <div className="flex items-center gap-[10px] px-[6px] pb-5">
                <div className="w-9 h-9 bg-[#266841] rounded-lg flex items-center justify-center text-lg shrink-0">
                    🌿
                </div>
                <div>
                    <p className="[font-family:var(--font-outfit)] text-[15px] font-semibold text-white leading-[1.3]">
                        SFC Admin
                    </p>
                    <p className="[font-family:var(--font-outfit)] text-[11px] text-white/50 leading-[1.4]">
                        Management Portal
                    </p>
                </div>
            </div>

            <div className="h-px bg-white/10 mx-[6px] my-1" />

            <nav className="flex flex-col gap-0.5 py-[14px]">
                {NAV_ITEMS.map(({ icon, label, to, badge }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-[10px] px-3 py-[10px] rounded-lg [font-family:var(--font-outfit)] text-[13.5px] font-medium no-underline relative transition-[background-color,color] duration-150 hover:bg-white/[0.07] ${
                                isActive
                                    ? 'bg-[#1f4d35] text-white font-semibold before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[22px] before:bg-[#38945e] before:rounded-[0_3px_3px_0]'
                                    : 'text-white/60 hover:text-white/90'
                            }`
                        }
                    >
                        <span className="text-[15px] w-5 text-center shrink-0">{icon}</span>
                        <span className="flex-1">{label}</span>
                        {badge !== null && (
                            <span className="min-w-[18px] h-[18px] px-[5px] bg-[#c96d38] text-white [font-family:var(--font-outfit)] text-[11px] font-semibold rounded-[9px] flex items-center justify-center">
                                {badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="flex-1" />
            <div className="h-px bg-white/10 mx-[6px] my-1" />

            <div className="flex items-center gap-[10px] pt-4 px-[6px] pb-1">
                <div className="w-9 h-9 bg-[#2d7d4e] rounded-full flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white shrink-0">
                    {initials}
                </div>
                <div>
                    <p className="[font-family:var(--font-outfit)] text-[13px] font-semibold text-white leading-[1.3]">
                        {displayName}
                    </p>
                    <p className="[font-family:var(--font-outfit)] text-[11px] text-white/50">
                        Admin
                    </p>
                </div>
            </div>

            <button
                className="w-full mt-3 p-[10px] bg-white/[0.08] border border-white/[0.15] rounded-lg text-white/75 [font-family:var(--font-outfit)] text-[13px] cursor-pointer transition-[background,color] duration-200 hover:bg-red-500/25 hover:text-white hover:border-red-500/50"
                onClick={logout}
            >
                🚪 Logout
            </button>
        </aside>
    )
}
