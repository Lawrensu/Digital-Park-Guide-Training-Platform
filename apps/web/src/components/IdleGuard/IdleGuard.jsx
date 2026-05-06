import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../rbac/AuthProvider'


const IDLE_MS      = 14 * 60 * 1000   // show warning after 14 min of inactivity
const COUNTDOWN_S  = 60               // seconds to respond before auto-logout

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']


export default function IdleGuard({ children }) {
	const { logout } = useAuth()

	const [showWarning, setShowWarning] = useState(false)
	const [countdown,   setCountdown]   = useState(COUNTDOWN_S)

	const idleTimerRef      = useRef(null)
	const countdownRef      = useRef(null)
	const showWarningRef    = useRef(false)
	const logoutRef         = useRef(logout)

	useEffect(() => { logoutRef.current = logout }, [logout])

	const clearTimers = () => {
		if (idleTimerRef.current)   clearTimeout(idleTimerRef.current)
		if (countdownRef.current)   clearInterval(countdownRef.current)
	}

	const startCountdown = () => {
		setCountdown(COUNTDOWN_S)
		clearInterval(countdownRef.current)
		countdownRef.current = setInterval(() => {
			setCountdown(prev => {
				if (prev <= 1) {
					clearInterval(countdownRef.current)
					logoutRef.current()
					return 0
				}
				return prev - 1
			})
		}, 1000)
	}

	const startIdleTimer = () => {
		clearTimeout(idleTimerRef.current)
		idleTimerRef.current = setTimeout(() => {
			showWarningRef.current = true
			setShowWarning(true)
			startCountdown()
		}, IDLE_MS)
	}

	const handleActivity = () => {
		if (!showWarningRef.current) startIdleTimer()
	}

	useEffect(() => {
		startIdleTimer()
		ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }))
		return () => {
			clearTimers()
			ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, handleActivity))
		}
	}, [])   // only on mount; refs keep callbacks current

	const stayLoggedIn = () => {
		clearTimers()
		showWarningRef.current = false
		setShowWarning(false)
		setCountdown(COUNTDOWN_S)
		startIdleTimer()
	}

	const handleLogout = () => {
		clearTimers()
		logoutRef.current()
	}

	const progressPct = (countdown / COUNTDOWN_S) * 100

	return (
		<>
			{children}

			{showWarning && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[fadeInScale_0.2s_ease-out]">

						<div className="bg-[#1a3a2a] px-6 py-6 text-center">
							<p className="text-[2.5rem] leading-none mb-3">🕐</p>
							<h2 className="text-white text-[1.25rem] font-semibold m-0">Are you still there?</h2>
						</div>

						<div className="px-6 py-6 flex flex-col items-center gap-4 text-center">
							<p className="text-[#44403c] text-sm leading-relaxed m-0">
								You've been inactive for a while. For your security, you'll be automatically logged out in:
							</p>

							<div className="relative w-24 h-24 flex items-center justify-center">
								<svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
									<circle cx="48" cy="48" r="42" fill="none" stroke="#e7e5e4" strokeWidth="6" />
									<circle
										cx="48" cy="48" r="42"
										fill="none"
										stroke={countdown <= 10 ? '#dc2626' : '#2d7d4e'}
										strokeWidth="6"
										strokeDasharray={`${2 * Math.PI * 42}`}
										strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPct / 100)}`}
										strokeLinecap="round"
										className="transition-all duration-1000"
									/>
								</svg>
								<span className={`text-3xl font-bold tabular-nums ${countdown <= 10 ? 'text-[#dc2626]' : 'text-[#1a3a2a]'}`}>
									{countdown}
								</span>
							</div>

							<p className="text-[#a8a29e] text-xs m-0">seconds until logout</p>
						</div>

						<div className="px-6 pb-6 flex flex-col gap-2">
							<button
								onClick={stayLoggedIn}
								className="w-full py-3 bg-[#1a3a2a] text-white rounded-lg text-sm font-semibold border-0 cursor-pointer hover:bg-[#2d7d4e] transition-colors duration-200"
							>
								Yes, keep me logged in
							</button>
							<button
								onClick={handleLogout}
								className="w-full py-2.5 bg-transparent text-[#78716c] rounded-lg text-sm border border-[#e7e5e4] cursor-pointer hover:bg-[#f5f5f4] transition-colors duration-200"
							>
								Log out now
							</button>
						</div>

					</div>
				</div>
			)}
		</>
	)
}
