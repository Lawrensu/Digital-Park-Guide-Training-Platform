import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as iotAlertsApi from '../../../api/iotAlerts.js'


const SEVERITY_STYLE = {
	CRITICAL: { border: '#c53030', bg: '#fee2e2', text: '#c53030' },
	WARNING:  { border: '#d4920a', bg: '#fef3c7', text: '#92400e' },
	INFO:     { border: '#2b6cb0', bg: '#dbeafe', text: '#2b6cb0' },
}

const SEVERITY_LABEL = { CRITICAL: 'Critical', WARNING: 'Warning', INFO: 'Info' }

const TABS = ['All', 'CRITICAL', 'WARNING', 'INFO']
const TAB_LABELS = { All: 'All', CRITICAL: 'Critical', WARNING: 'Warning', INFO: 'Info' }


export default function IoTAlert() {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState('All')

	const { data, isLoading, error } = useQuery({
		queryKey: ['iot-alerts'],
		queryFn: async () => {
			const res = await iotAlertsApi.getAll()
			return res.data.data
		},
	})

	const alerts = data ?? []

	const filtered = activeTab === 'All' ? alerts : alerts.filter(a => a.severity === activeTab)

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="font-outfit text-[20px] font-semibold text-[#1c1917]">IoT Alerts</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center font-outfit text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto">

					<h2 className="font-outfit text-2xl font-semibold text-[#1c1917] m-0">Wildlife Monitoring Alerts</h2>

					<div className="flex gap-2">
						{TABS.map(tab => (
							<button
								key={tab}
								className={`py-1.5 px-4 rounded-full font-outfit text-[13px] font-medium border cursor-pointer transition-all duration-150 ${activeTab === tab ? 'bg-[#1f4d35] border-[#1f4d35] text-white' : 'bg-white border-[#d6d3d1] text-[#44403c] hover:border-[#1a3a2a] hover:text-[#1a3a2a]'}`}
								onClick={() => setActiveTab(tab)}
							>
								{TAB_LABELS[tab]}
							</button>
						))}
					</div>

					{isLoading && <p className="text-center py-12 font-outfit text-sm text-[#a8a29e]">Loading alerts…</p>}
					{error && <p className="text-center py-12 font-outfit text-sm text-red-500">Failed to load alerts.</p>}

					{!isLoading && !error && (
						<div className="flex flex-col gap-3">
							{filtered.length > 0 ? filtered.map(alert => {
								const style = SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.INFO
								return (
									<div key={alert.id} className="bg-white border border-[#e5e7eb] border-l-4 rounded-xl py-4 px-5 flex flex-col gap-1.5 transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]" style={{ borderLeftColor: style.border }}>
										<div className="flex items-start justify-between gap-3">
											<h3 className="font-outfit text-[16px] font-semibold text-[#1c1917] leading-[1.3]">{alert.alertType}</h3>
											<div className="flex items-center gap-3 shrink-0">
												<span
													className="inline-flex items-center py-1 px-3 rounded-full font-outfit text-xs font-medium whitespace-nowrap"
													style={{ backgroundColor: style.bg, color: style.text }}
												>
													{SEVERITY_LABEL[alert.severity] ?? alert.severity}
												</span>
												<span className="font-outfit text-xs text-[#a8a29e] whitespace-nowrap">{new Date(alert.triggeredAt).toLocaleString()}</span>
											</div>
										</div>
										<p className="font-outfit text-[13px] font-medium text-[#78716c]">{alert.device?.station?.name ?? alert.device?.serialNumber ?? '—'}</p>
										<div className="flex items-end justify-between gap-3 mt-0.5">
											<p className="font-serif text-[13px] text-[#44403c] leading-[1.5]">{alert.payload ?? ''}</p>
											<button
												className="shrink-0 font-outfit text-sm font-medium text-[#2d7d4e] bg-transparent border-none cursor-pointer p-0 transition-colors duration-150 hover:text-[#1a3a2a] hover:underline"
												onClick={() => navigate(`/iot-alerts/${alert.id}`)}
											>
												View
											</button>
										</div>
									</div>
								)
							}) : (
								<div className="text-center px-6 py-12 font-serif text-base text-[#a8a29e]">No alerts found for this filter.</div>
							)}
						</div>
					)}

				</main>
			</div>
		</div>
	)
}
