import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as notificationsApi from '../../../api/notifications.js'


const ICON_CLASSES = {
	CERTIFICATION_ISSUED:   'bg-[#E3F2FD] text-[#1976D2]',
	QUIZ_ATTEMPT_SUBMITTED: 'bg-[#FFF3E0] text-[#F57C00]',
	MODULE_PUBLISHED:       'bg-[#E8F5E9] text-[#2E7D32]',
	CUSTOM:                 'bg-[#E8F5E9] text-[#2E7D32]',
}

function getIcon(type) {
	const icons = {
		CERTIFICATION_ISSUED:   '🎓',
		QUIZ_ATTEMPT_SUBMITTED: '📝',
		MODULE_PUBLISHED:       '🌿',
		CUSTOM:                 '📣',
	}
	return icons[type] ?? '🔔'
}


const GuideNotification = () => {
	const queryClient = useQueryClient()
	const [activeTab, setActiveTab] = useState('unread')

	const { data, isLoading, error } = useQuery({
		queryKey: ['notifications', 'mine'],
		queryFn: async () => {
			const res = await notificationsApi.getMine()
			return res.data.data
		},
	})

	const notifications = data ?? []
	const unreadCount   = notifications.filter(n => !n.isRead).length

	const markReadMutation = useMutation({
		mutationFn: (id) => notificationsApi.markRead(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'mine'] }),
	})

	const filtered = notifications.filter(n => {
		if (activeTab === 'all')    return true
		if (activeTab === 'unread') return !n.isRead
		if (activeTab === 'modules') return n.type === 'MODULE_PUBLISHED'
		return true
	})

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-4 sm:p-6 lg:p-8 box-border">
				<header className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-[1.75rem] text-[#333333] m-0 font-bold">Notifications</h1>
					</div>
					{unreadCount > 0 && (
						<span className="text-[0.9rem] font-semibold text-[#666666] bg-[#E8F5E9] py-1 px-3 rounded-[20px] border border-[#C8E6C9]">
							{unreadCount} unread
						</span>
					)}
				</header>

				<div className="flex gap-6 border-b border-[#E0E0E0] mb-6">
					{[
						{ key: 'all',     label: 'All' },
						{ key: 'unread',  label: `Unread (${unreadCount})` },
						{ key: 'modules', label: 'Modules' },
					].map(tab => (
						<button
							key={tab.key}
							className={`pb-3 text-[1rem] text-[#666666] cursor-pointer relative transition-colors duration-200 bg-transparent border-0 font-medium hover:text-[#2E7D32] ${activeTab === tab.key ? "text-[#2E7D32] font-bold after:content-[''] after:absolute after:-bottom-px after:left-0 after:w-full after:h-[3px] after:bg-[#2E7D32] after:rounded-t-[3px]" : ''}`}
							onClick={() => setActiveTab(tab.key)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{isLoading && <p className="text-center py-8 text-[#666666]">Loading notifications…</p>}
				{error && <p className="text-center py-8 text-red-500">Failed to load notifications.</p>}

				{!isLoading && !error && (
					<div className="flex flex-col gap-4">
						{filtered.length > 0 ? filtered.map(notif => (
							<div
								key={notif.id}
								className={`flex items-start bg-white p-5 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-[transform,box-shadow] duration-200 relative cursor-pointer border border-transparent hover:-translate-y-[2px] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] ${!notif.isRead ? 'bg-[#F1F8E9] border-l-4 border-l-[#2E7D32]' : ''}`}
								onClick={() => { if (!notif.isRead) markReadMutation.mutate(notif.id) }}
							>
								<div className={`w-12 h-12 rounded-full flex items-center justify-center text-[1.5rem] mr-4 shrink-0 ${ICON_CLASSES[notif.type] ?? ICON_CLASSES.CUSTOM}`}>
									{getIcon(notif.type)}
								</div>
								<div className="flex-1">
									<span className="text-[1rem] font-bold text-[#333333] mb-1 block">{notif.title}</span>
									<p className="text-[0.9rem] text-[#666666] leading-[1.4]">{notif.body}</p>
									<div className="text-[0.8rem] text-[#888] mt-2 flex items-center gap-2">
										<span>🕒</span> {new Date(notif.createdAt).toLocaleString()}
									</div>
								</div>
								{!notif.isRead && <div className="w-2.5 h-2.5 bg-[#2E7D32] rounded-full absolute top-5 right-5" />}
							</div>
						)) : (
							<p className="text-center mt-8 text-[#666666]">No notifications found.</p>
						)}
					</div>
				)}
			</main>
		</div>
	)
}

export default GuideNotification
