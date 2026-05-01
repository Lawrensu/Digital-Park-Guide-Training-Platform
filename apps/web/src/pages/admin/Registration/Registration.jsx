import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as registrationsApi from '../../../api/registrations.js'


const STAT_CONFIG = [
	{ key: 'all',      label: 'Total',    colorClass: 'stat--total'    },
	{ key: 'PENDING',  label: 'Pending',  colorClass: 'stat--pending'  },
	{ key: 'APPROVED', label: 'Approved', colorClass: 'stat--approved' },
	{ key: 'REJECTED', label: 'Rejected', colorClass: 'stat--rejected' },
]

const STAT_BEFORE_CLASSES = {
	'stat--total':    'before:bg-[#1a3a2a]',
	'stat--pending':  'before:bg-[#b35c2a]',
	'stat--approved': 'before:bg-[#2d7d4e]',
	'stat--rejected': 'before:bg-[#a8a29e]',
}

const STAT_VALUE_COLORS = {
	'stat--total':    'text-[#1a3a2a]',
	'stat--pending':  'text-[#b35c2a]',
	'stat--approved': 'text-[#2d7d4e]',
	'stat--rejected': 'text-[#78716c]',
}

const STATUS_BADGE = {
	APPROVED: 'bg-[#e8f5ee] text-[#266841]',
	PENDING:  'bg-[#fdf0e6] text-[#b35c2a]',
	REJECTED: 'bg-[#f5f5f4] text-[#78716c]',
}

const STATUS_LABEL = { APPROVED: 'Approved', PENDING: 'Pending', REJECTED: 'Rejected' }


export default function RegistrationPage() {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery]   = useState('')
	const [activeFilter, setActiveFilter] = useState('all')

	const { data, isLoading, error } = useQuery({
		queryKey: ['registrations'],
		queryFn: async () => {
			const res = await registrationsApi.getAll()
			return res.data.data
		},
	})

	const registrations = data ?? []

	const counts = {
		all:      registrations.length,
		PENDING:  registrations.filter(r => r.status === 'PENDING').length,
		APPROVED: registrations.filter(r => r.status === 'APPROVED').length,
		REJECTED: registrations.filter(r => r.status === 'REJECTED').length,
	}

	const filtered = registrations.filter(r => {
		const name = `${r.firstName} ${r.lastName}`.toLowerCase()
		const q = searchQuery.toLowerCase()
		const matchSearch = name.includes(q) || r.icPassportNumber?.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
		const matchFilter = activeFilter === 'all' || r.status === activeFilter
		return matchSearch && matchFilter
	})

	return (
		<div className="flex min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Registrations</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white" aria-label="Admin">AM</div>
					</div>
				</header>

				<main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">

					<section className="grid grid-cols-4 gap-4">
						{STAT_CONFIG.map(({ key, label, colorClass }) => (
							<button
								key={key}
								className={`bg-white border border-[#f0e9db] rounded-xl px-6 py-5 flex flex-col gap-2 cursor-pointer text-left transition-[box-shadow,border-color,transform] duration-200 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-[12px_0_0_12px] hover:shadow-[0_4px_16px_rgba(26,58,42,0.1)] hover:-translate-y-px ${STAT_BEFORE_CLASSES[colorClass]} ${activeFilter === key ? 'bg-[#f3faf6] border-[#2d7d4e] shadow-[0_4px_16px_rgba(26,58,42,0.12)]' : ''}`}
								onClick={() => setActiveFilter(key)}
							>
								<span className="[font-family:var(--font-outfit)] text-xs font-medium text-[#78716c] uppercase tracking-[0.5px]">{label}</span>
								<span className={`[font-family:var(--font-outfit)] text-[28px] font-semibold leading-none ${STAT_VALUE_COLORS[colorClass]}`}>{counts[key]}</span>
							</button>
						))}
					</section>

					<section className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
						<div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f4]">
							<div className="relative flex items-center">
								<svg className="absolute left-3 text-[#a8a29e] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
								</svg>
								<input
									type="text"
									className="py-[9px] pr-3.5 pl-9 w-70 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] transition-[border-color,background] duration-150 placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
									placeholder="Search by name, IC or email…"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<span className="[font-family:var(--font-outfit)] text-xs font-medium text-[#a8a29e]">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
						</div>

						<div className="overflow-x-auto">
							{isLoading && (
								<p className="text-center py-12 [font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading registrations…</p>
							)}
							{error && (
								<p className="text-center py-12 [font-family:var(--font-outfit)] text-sm text-red-500">Failed to load registrations.</p>
							)}
							{!isLoading && !error && (
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Name</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Email</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">IC / Passport</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Submitted</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Status</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filtered.length > 0 ? filtered.map((r, idx) => (
											<tr key={r.id} className={`hover:bg-[#fef7f0] ${idx === filtered.length - 1 ? '[&>td]:border-b-0' : ''}`}>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle">
													<p className="[font-family:var(--font-serif)] text-[15px] font-normal text-[#1a3a2a]">{r.firstName} {r.lastName}</p>
												</td>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle [font-family:var(--font-serif)] text-sm text-[#78716c]">{r.email}</td>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle [font-family:var(--font-outfit)] text-[13px] text-[#44403c] tracking-[0.2px]">{r.icPassportNumber}</td>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle [font-family:var(--font-serif)] text-sm text-[#78716c]">{new Date(r.createdAt).toLocaleDateString()}</td>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle">
													<span className={`inline-flex items-center py-1 px-3 rounded-full [font-family:var(--font-outfit)] text-xs font-medium ${STATUS_BADGE[r.status] ?? ''}`}>
														{STATUS_LABEL[r.status] ?? r.status}
													</span>
												</td>
												<td className="px-6 py-4.5 border-b border-[#f5f5f4] align-middle">
													<button className="inline-flex items-center gap-1 [font-family:var(--font-outfit)] text-[13px] font-medium text-[#b35c2a] bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-200 hover:gap-2 hover:underline" onClick={() => navigate(`/registrations/${r.id}`)}>
														Review <span aria-hidden>→</span>
													</button>
												</td>
											</tr>
										)) : (
											<tr>
												<td colSpan="6" className="text-center px-6 py-12 [font-family:var(--font-serif)] text-base text-[#a8a29e]">No registrations found.</td>
											</tr>
										)}
									</tbody>
								</table>
							)}
						</div>
					</section>

				</main>
			</div>
		</div>
	)
}
