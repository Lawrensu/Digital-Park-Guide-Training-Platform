import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as modulesApi from '../../../api/modules.js'


const TABS = ['All', 'DRAFT', 'PUBLISHED', 'ARCHIVED']

const STAT_BEFORE_CLASSES = {
	'mod-stat--total':     'before:bg-[#1a3a2a]',
	'mod-stat--published': 'before:bg-[#2d7d4e]',
	'mod-stat--draft':     'before:bg-[#b35c2a]',
	'mod-stat--archived':  'before:bg-[#a8a29e]',
}

const STAT_VALUE_COLORS = {
	'mod-stat--total':     'text-[#1a3a2a]',
	'mod-stat--published': 'text-[#2d7d4e]',
	'mod-stat--draft':     'text-[#b35c2a]',
	'mod-stat--archived':  'text-[#78716c]',
}

const BADGE_CLASSES = {
	PUBLISHED: 'bg-[#e8f5ee] text-[#266841]',
	DRAFT:     'bg-[#fdf0e6] text-[#b35c2a]',
	ARCHIVED:  'bg-[#f5f5f4] text-[#78716c]',
}


export default function ModulesPage() {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState('All')

	const { data, isLoading, error } = useQuery({
		queryKey: ['modules'],
		queryFn: async () => {
			const res = await modulesApi.getAll()
			return res.data.data
		},
	})

	const modules = data ?? []

	const counts = {
		All:       modules.length,
		PUBLISHED: modules.filter(m => m.status === 'PUBLISHED').length,
		DRAFT:     modules.filter(m => m.status === 'DRAFT').length,
		ARCHIVED:  modules.filter(m => m.status === 'ARCHIVED').length,
	}

	const filtered = activeTab === 'All' ? modules : modules.filter(m => m.status === activeTab)

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Modules</h1>
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

					<section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{[
							{ key: 'All',       label: 'Total Modules', colorClass: 'mod-stat--total'     },
							{ key: 'PUBLISHED', label: 'Published',     colorClass: 'mod-stat--published' },
							{ key: 'DRAFT',     label: 'Draft',         colorClass: 'mod-stat--draft'     },
							{ key: 'ARCHIVED',  label: 'Archived',      colorClass: 'mod-stat--archived'  },
						].map(({ key, label, colorClass }) => (
							<button
								key={key}
								className={`bg-white border border-[#f0e9db] rounded-xl px-6 py-5 flex flex-col gap-2 cursor-pointer text-left transition-[box-shadow,border-color,transform] duration-200 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-[12px_0_0_12px] hover:shadow-[0_4px_16px_rgba(26,58,42,0.1)] hover:-translate-y-px ${STAT_BEFORE_CLASSES[colorClass]} ${activeTab === key ? 'bg-[#f3faf6] border-[#2d7d4e] shadow-[0_4px_16px_rgba(26,58,42,0.12)]' : ''}`}
								onClick={() => setActiveTab(key)}
							>
								<span className="[font-family:var(--font-outfit)] text-xs font-medium text-[#78716c] uppercase tracking-[0.5px]">{label}</span>
								<span className={`[font-family:var(--font-outfit)] text-[28px] font-semibold leading-none ${STAT_VALUE_COLORS[colorClass]}`}>{counts[key]}</span>
							</button>
						))}
					</section>

					<div className="flex items-center justify-between flex-wrap gap-3">
						<h2 className="[font-family:var(--font-outfit)] text-2xl font-semibold text-[#1a3a2a]">Training Modules</h2>
						<button className="bg-[#1f4d35] text-white [font-family:var(--font-outfit)] text-sm font-medium py-2.5 px-5 rounded-lg border-none cursor-pointer transition-colors duration-200 hover:bg-[#1a3a2a]" onClick={() => navigate('/modules/new')}>
							+ New Module
						</button>
					</div>

					<div className="flex gap-2">
						{TABS.map(tab => (
							<button
								key={tab}
								className={`py-[7px] px-4.5 rounded-full [font-family:var(--font-outfit)] text-[13px] font-medium border border-[#d6d3d1] bg-white text-[#44403c] cursor-pointer transition-all duration-150 hover:border-[#1a3a2a] hover:text-[#1a3a2a] ${activeTab === tab ? 'bg-[#1f4d35] border-[#1f4d35] text-white' : ''}`}
								onClick={() => setActiveTab(tab)}
							>
								{tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
							</button>
						))}
					</div>

					{isLoading && <p className="text-center py-16 [font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading modules…</p>}
					{error && <p className="text-center py-16 [font-family:var(--font-outfit)] text-sm text-red-500">Failed to load modules.</p>}

					{!isLoading && !error && (
						filtered.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{filtered.map(m => (
									<div key={m.id} className="bg-white border border-[#e7e5e4] rounded-xl p-5 flex flex-col gap-3 transition-[box-shadow,transform] duration-200 hover:shadow-[0_4px_16px_rgba(26,58,42,0.1)] hover:-translate-y-0.5">
										<div className="flex items-center justify-end">
											<span className={`inline-flex items-center py-[3px] px-2.5 rounded-full [font-family:var(--font-outfit)] text-[11px] font-medium ${BADGE_CLASSES[m.status] ?? ''}`}>{m.status}</span>
										</div>
										<h3 className="[font-family:var(--font-serif)] text-base font-normal text-[#1a3a2a] leading-[1.5] flex-1">{m.title}</h3>
										<div className="flex gap-2 mt-auto pt-3 border-t border-[#f5f5f4]">
											<button
												className="flex-1 py-[7px] px-0 border border-[#1a3a2a] rounded-[6px] bg-transparent [font-family:var(--font-outfit)] text-xs font-medium text-[#1a3a2a] cursor-pointer transition-all duration-150 hover:bg-[#1a3a2a] hover:text-white"
												onClick={() => navigate(`/modules/${m.id}/edit`)}
											>
												Edit
											</button>
											<button
												className="flex-1 py-[7px] px-0 border border-[#e7e5e4] rounded-[6px] bg-[#f3faf6] [font-family:var(--font-outfit)] text-xs font-medium text-[#1a3a2a] cursor-pointer transition-colors duration-150 hover:bg-[#e8f5ee]"
												onClick={() => navigate(`/modules/${m.id}/content`)}
											>
												Content
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center px-6 py-16 [font-family:var(--font-serif)] text-base text-[#a8a29e]">No modules found.</div>
						)
					)}

				</main>
			</div>
		</div>
	)
}
