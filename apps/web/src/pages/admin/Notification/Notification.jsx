import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as notificationsApi from '../../../api/notifications.js'


const TYPE_META = {
	REGISTRATION_SUBMITTED: { bg: '#e8f5ee', color: '#266841', label: 'Registration' },
	QUIZ_ATTEMPT_SUBMITTED: { bg: '#fdf0e6', color: '#b35c2a', label: 'Quiz'         },
	MODULE_PUBLISHED:       { bg: '#f0e9db', color: '#6b5c4a', label: 'Module'       },
	CUSTOM:                 { bg: '#e8f5ee', color: '#1a3a2a', label: 'Broadcast'    },
}

const TYPE_ROUTE = {
	REGISTRATION_SUBMITTED: '/registrations',
	QUIZ_ATTEMPT_SUBMITTED: '/quiz-reviews',
	MODULE_PUBLISHED:       '/modules',
}

function getTypeMeta(type) {
	return TYPE_META[type] ?? TYPE_META.CUSTOM
}

function TypeIcon({ type }) {
	const meta = getTypeMeta(type)

	const icons = {
		REGISTRATION_SUBMITTED: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
			</svg>
		),
		QUIZ_ATTEMPT_SUBMITTED: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
			</svg>
		),
		MODULE_PUBLISHED: (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
			</svg>
		),
	}

	const icon = icons[type] ?? (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
		</svg>
	)

	return (
		<div className="w-9.5 h-9.5 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: meta.bg, color: meta.color }}>
			{icon}
		</div>
	)
}


export default function NotificationPage() {
	const navigate      = useNavigate()
	const queryClient   = useQueryClient()
	const [targetRole, setTargetRole] = useState('GUIDE')
	const [title, setTitle]           = useState('')
	const [message, setMessage]       = useState('')
	const [selectedNotif, setSelectedNotif] = useState(null)
	const [isModalOpen, setIsModalOpen]     = useState(false)
	const [sendError, setSendError]         = useState('')

	const { data, isLoading, error } = useQuery({
		queryKey: ['notifications'],
		queryFn: async () => {
			const res = await notificationsApi.getMine()
			return res.data.data
		},
	})

	const notifications = data ?? []
	const unreadCount   = notifications.filter(n => !n.isRead).length

	const markReadMutation = useMutation({
		mutationFn: (id) => notificationsApi.markRead(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
	})

	const markAllReadMutation = useMutation({
		mutationFn: () => notificationsApi.markAllRead(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
	})

	const sendMutation = useMutation({
		mutationFn: (payload) => notificationsApi.sendCustom(payload),
		onSuccess: () => {
			setTitle('')
			setMessage('')
			setSendError('')
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
		},
		onError: () => setSendError('Failed to send. Please try again.'),
	})

	const handleSend = () => {
		if (!message.trim()) return
		setSendError('')
		sendMutation.mutate({ title: title.trim() || 'Announcement', body: message.trim(), targetRole })
	}

	const handleClick = (notif) => {
		if (!notif.isRead) markReadMutation.mutate(notif.id)
		const route = TYPE_ROUTE[notif.type]
		if (route) {
			navigate(route)
		} else {
			setSelectedNotif(notif)
			setIsModalOpen(true)
		}
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Notifications</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">

					<div className="bg-white border border-[#e7e5e4] rounded-xl p-6 flex flex-col gap-5">
						<h2 className="[font-family:var(--font-outfit)] text-[18px] font-semibold text-[#1a3a2a]">Send Custom Notification</h2>
						<div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 items-start">
							<div className="flex flex-col gap-1.5">
								<label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#44403c]">Recipient</label>
								<select
									className="py-2.5 px-3.5 min-w-50 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] cursor-pointer transition-[border-color] duration-150 focus:outline-none focus:border-[#1a3a2a]"
									value={targetRole}
									onChange={e => setTargetRole(e.target.value)}
								>
									<option value="GUIDE">All Active Guides</option>
									<option value="ADMIN">All Admins</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#44403c]">Title</label>
								<input
									type="text"
									className="w-full py-2.5 px-3.5 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] transition-[border-color] duration-150 placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
									placeholder="Notification title…"
									value={title}
									onChange={e => setTitle(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#44403c]">Message</label>
							<textarea
								className="w-full py-3 px-3.5 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] resize-y transition-[border-color] duration-150 placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
								rows="3"
								placeholder="Type your notification message here…"
								value={message}
								onChange={e => setMessage(e.target.value)}
							/>
						</div>
						{sendError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500">{sendError}</p>}
						<div className="flex justify-end">
							<button
								className="bg-[#b35c2a] text-white [font-family:var(--font-outfit)] text-sm font-medium py-2.5 px-6 rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-[#9c4f24] disabled:opacity-50"
								onClick={handleSend}
								disabled={sendMutation.isPending || !message.trim()}
							>
								{sendMutation.isPending ? 'Sending…' : 'Send Notification'}
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<h2 className="[font-family:var(--font-outfit)] text-[18px] font-semibold text-[#1a3a2a]">Inbox</h2>
								{unreadCount > 0 && (
									<span className="py-[3px] px-2.5 rounded-full bg-[#fdf0e6] text-[#b35c2a] [font-family:var(--font-outfit)] text-xs font-medium">{unreadCount} unread</span>
								)}
							</div>
							{unreadCount > 0 && (
								<button
									className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#78716c] bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 hover:text-[#1a3a2a] hover:underline disabled:opacity-50"
									onClick={() => markAllReadMutation.mutate()}
									disabled={markAllReadMutation.isPending}
								>
									Mark all as read
								</button>
							)}
						</div>

						{isLoading && <p className="text-center py-8 [font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading notifications…</p>}
						{error && <p className="text-center py-8 [font-family:var(--font-outfit)] text-sm text-red-500">Failed to load notifications.</p>}

						{!isLoading && !error && (
							<div className="flex flex-col gap-2">
								{notifications.length > 0 ? notifications.map(notif => (
									<div
										key={notif.id}
										className={`bg-white border border-[#e7e5e4] rounded-xl py-4 px-5 flex items-start gap-3.5 cursor-pointer transition-[box-shadow,border-color] duration-200 hover:shadow-[0_2px_12px_rgba(26,58,42,0.08)] hover:border-[#d6d3d1] ${!notif.isRead ? 'border-l-[3px] border-l-[#b35c2a] bg-[#fef7f0]' : ''}`}
										onClick={() => handleClick(notif)}
									>
										<TypeIcon type={notif.type} />
										<div className="flex-1 flex flex-col gap-1">
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<span className="[font-family:var(--font-outfit)] text-sm font-semibold text-[#1a3a2a]">{notif.title}</span>
													{!notif.isRead && <span className="w-2 h-2 rounded-full bg-[#b35c2a] shrink-0" aria-hidden />}
												</div>
												<span className="[font-family:var(--font-outfit)] text-xs text-[#a8a29e] whitespace-nowrap shrink-0">{new Date(notif.createdAt).toLocaleString()}</span>
											</div>
											<p className="[font-family:var(--font-serif)] text-sm text-[#78716c] leading-[1.5]">{notif.body}</p>
										</div>
									</div>
								)) : (
									<div className="text-center py-12 [font-family:var(--font-serif)] text-base text-[#a8a29e]">No notifications yet.</div>
								)}
							</div>
						)}
					</div>

				</main>
			</div>

			{isModalOpen && selectedNotif && (
				<div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
					<div className="bg-white rounded-2xl w-[90%] max-w-120 shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
						<div className="flex items-center justify-between px-6 py-5 border-b border-[#f5f5f4]">
							<h3 className="[font-family:var(--font-outfit)] text-[18px] font-semibold text-[#1a3a2a]">Notification Details</h3>
							<button className="w-8 h-8 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" onClick={() => setIsModalOpen(false)} aria-label="Close">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>
						</div>
						<div className="p-6 flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<p className="[font-family:var(--font-outfit)] text-xs font-medium text-[#a8a29e] uppercase tracking-[0.5px]">Title</p>
								<p className="[font-family:var(--font-serif)] text-[15px] text-[#1a3a2a] leading-[1.5]">{selectedNotif.title}</p>
							</div>
							<div className="flex flex-col gap-1">
								<p className="[font-family:var(--font-outfit)] text-xs font-medium text-[#a8a29e] uppercase tracking-[0.5px]">Message</p>
								<p className="[font-family:var(--font-serif)] text-[15px] text-[#1a3a2a] leading-[1.5]">{selectedNotif.body}</p>
							</div>
						</div>
						<div className="px-6 py-4 border-t border-[#f5f5f4] flex justify-end">
							<button className="bg-[#b35c2a] text-white [font-family:var(--font-outfit)] text-sm font-medium py-2.5 px-6 rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-[#9c4f24]" onClick={() => setIsModalOpen(false)}>Close</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
