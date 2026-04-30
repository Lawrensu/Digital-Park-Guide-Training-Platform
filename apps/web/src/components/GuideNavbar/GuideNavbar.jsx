import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../rbac/AuthProvider'
import * as notificationsApi from '../../api/notifications.js'

const ProfileIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const BASE_NAV = [
    { icon: '⊞',            label: 'My Dashboard',  to: '/guide/home'           },
    { icon: '📚',            label: 'My Modules',    to: '/guide/modules'        },
    { icon: '✏️',            label: 'Quizzes',       to: '/guide/quizzes'        },
    { icon: '🏆',            label: 'Certificates',  to: '/guide/certifications' },
    { icon: '🎖️',            label: 'Badges',        to: '/guide/badges'         },
    { icon: '🔔',            label: 'Notifications', to: '/guide/notifications'  },
    { icon: <ProfileIcon />, label: 'Profile',       to: '/guide/profile'        },
]

export default function GuideNavbar() {
    const { logout, user } = useAuth()

    const { data: notifData } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            const res = await notificationsApi.getMine({ limit: 1 })
            return res.data.pagination?.total ?? 0
        },
        staleTime: 60_000,
    })

    const unreadCount = notifData ?? 0

    const NAV_ITEMS = BASE_NAV.map(item =>
        item.to === '/guide/notifications'
            ? { ...item, badge: unreadCount > 0 ? unreadCount : null }
            : { ...item, badge: null }
    )

    const displayName = user?.email?.split('@')[0] ?? 'Guide'
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
                        SFC Park Guide
                    </p>
                    <p className="[font-family:var(--font-outfit)] text-[11px] text-white/50 leading-[1.4]">
                        Park Guide Portal
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
                        <span className="text-[15px] w-5 text-center shrink-0 flex items-center justify-center">
                            {icon}
                        </span>
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
                        Park Guide
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
