import { useState } from 'react'
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

const SidebarContent = ({ navItems, displayName, initials, logout, onClose }) => (
    <>
        <div className="flex items-center justify-between px-1.5 pb-5">
            <div className="flex items-center gap-2.5">
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
            {onClose && (
                <button
                    onClick={onClose}
                    className="lg:hidden text-white/60 hover:text-white bg-transparent border-0 cursor-pointer text-xl leading-none p-1"
                    aria-label="Close menu"
                >
                    ✕
                </button>
            )}
        </div>

        <div className="h-px bg-white/10 mx-1.5 my-1" />

        <nav className="flex flex-col gap-0.5 py-3.5">
            {navItems.map(({ icon, label, to, badge }) => (
                <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg [font-family:var(--font-outfit)] text-[13.5px] font-medium no-underline relative transition-[background-color,color] duration-150 hover:bg-white/[0.07] ${
                            isActive
                                ? 'bg-[#1f4d35] text-white font-semibold before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5.5 before:bg-[#38945e] before:rounded-[0_3px_3px_0]'
                                : 'text-white/60 hover:text-white/90'
                        }`
                    }
                >
                    <span className="text-[15px] w-5 text-center shrink-0">{icon}</span>
                    <span className="flex-1">{label}</span>
                    {badge !== null && (
                        <span className="min-w-4.5 h-4.5 px-[5px] bg-[#c96d38] text-white [font-family:var(--font-outfit)] text-[11px] font-semibold rounded-[9px] flex items-center justify-center">
                            {badge}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>

        <div className="flex-1" />
        <div className="h-px bg-white/10 mx-1.5 my-1" />

        <div className="flex items-center gap-2.5 pt-4 px-1.5 pb-1">
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
            className="w-full mt-3 p-2.5 bg-white/[0.08] border border-white/[0.15] rounded-lg text-white/75 [font-family:var(--font-outfit)] text-[13px] cursor-pointer transition-[background,color] duration-200 hover:bg-red-500/25 hover:text-white hover:border-red-500/50"
            onClick={logout}
        >
            🚪 Logout
        </button>
    </>
)


export default function Navbar() {
    const { logout, user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

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
        '/registrations': pendingRegs    ?? 0,
        '/quiz-reviews':  pendingQuizzes ?? 0,
        '/iot-alerts':    openAlerts     ?? 0,
    }

    const navItems = BASE_NAV.map(item => ({
        ...item,
        badge: BADGE_MAP[item.to] > 0 ? BADGE_MAP[item.to] : null,
    }))

    const displayName = user?.email?.split('@')[0] ?? 'Admin'
    const initials    = displayName.slice(0, 2).toUpperCase()

    const totalBadges = (pendingRegs ?? 0) + (pendingQuizzes ?? 0) + (openAlerts ?? 0)

    const sharedProps = { navItems, displayName, initials, logout }

    return (
        <>
            {/*
                Mobile spacer: reserves 56px at the top of the flex-col layout on mobile
                so page content is not hidden behind the fixed top bar.
                Hidden on desktop (lg+) where the sidebar takes its place in flex-row.
            */}
            <div className="h-14 w-full shrink-0 lg:hidden" />

            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#1a3a2a] z-30 flex items-center px-4 gap-3 shadow-md">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.15] text-white cursor-pointer hover:bg-white/[0.14] transition-colors relative"
                    aria-label="Open menu"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6"  x2="21" y2="6"  />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                    {totalBadges > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-[4px] bg-[#c96d38] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {totalBadges}
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#266841] rounded-md flex items-center justify-center text-sm">🌿</div>
                    <span className="[font-family:var(--font-outfit)] text-[14px] font-semibold text-white">SFC Admin</span>
                </div>
                <div className="ml-auto w-8 h-8 bg-[#2d7d4e] rounded-full flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white shrink-0">
                    {initials}
                </div>
            </header>

            {/* ── Mobile drawer overlay ── */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 flex"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <aside
                        className="relative w-64 h-full bg-[#1a3a2a] flex flex-col px-3.5 py-6 overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <SidebarContent {...sharedProps} onClose={() => setIsOpen(false)} />
                    </aside>
                </div>
            )}

            {/* ── Desktop sidebar ── */}
            <aside className="hidden lg:flex flex-col w-55 h-screen bg-[#1a3a2a] px-3.5 py-6 shrink-0 sticky top-0 overflow-y-auto">
                <SidebarContent {...sharedProps} onClose={null} />
            </aside>
        </>
    )
}
