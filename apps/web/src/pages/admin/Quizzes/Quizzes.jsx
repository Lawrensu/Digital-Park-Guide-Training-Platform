import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


const STAT_BEFORE = {
	'quiz-stat--total':   'before:bg-[#1a3a2a]',
	'quiz-stat--pending': 'before:bg-[#b35c2a]',
	'quiz-stat--graded':  'before:bg-[#2d7d4e]',
}

const STAT_VALUE_COLOR = {
	'quiz-stat--total':   'text-[#1a3a2a]',
	'quiz-stat--pending': 'text-[#b35c2a]',
	'quiz-stat--graded':  'text-[#2d7d4e]',
}


export default function QuizPage() {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery]   = useState('')
	const [activeFilter, setActiveFilter] = useState('all')

	const { data, isLoading, error } = useQuery({
		queryKey: ['quiz-attempts'],
		queryFn: async () => {
			const res = await quizAttemptsApi.getAll()
			return res.data.data
		},
	})

	const attempts = data ?? []

	const counts = {
		all:            attempts.length,
		PENDING_REVIEW: attempts.filter(a => a.status === 'PENDING_REVIEW').length,
		GRADED:         attempts.filter(a => a.status === 'GRADED').length,
	}

	const filtered = attempts.filter(a => {
		const guideName   = `${a.guide?.firstName ?? ''} ${a.guide?.lastName ?? ''}`.toLowerCase()
		const moduleName  = (a.quiz?.module?.title ?? '').toLowerCase()
		const quizName    = (a.quiz?.title ?? '').toLowerCase()
		const query       = searchQuery.toLowerCase()
		const matchSearch = guideName.includes(query) || moduleName.includes(query) || quizName.includes(query)
		const matchFilter = activeFilter === 'all' || a.status === activeFilter
		return matchSearch && matchFilter
	})

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="font-outfit text-[20px] font-semibold text-[#1c1917]">Quiz Reviews</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center font-outfit text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">

					<section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{[
							{ key: 'all',            label: 'Total Submissions', colorClass: 'quiz-stat--total'   },
							{ key: 'PENDING_REVIEW', label: 'Pending Review',    colorClass: 'quiz-stat--pending' },
							{ key: 'GRADED',         label: 'Graded',            colorClass: 'quiz-stat--graded'  },
						].map(({ key, label, colorClass }) => (
							<button
								key={key}
								className={`bg-white border border-[#f0e9db] rounded-xl px-6 py-5 flex flex-col gap-2 cursor-pointer text-left transition-[box-shadow,border-color,transform] duration-200 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-[12px_0_0_12px] hover:shadow-[0_4px_16px_rgba(26,58,42,0.1)] hover:-translate-y-px ${STAT_BEFORE[colorClass]} ${activeFilter === key ? 'bg-[#f3faf6] border-[#2d7d4e] shadow-[0_4px_16px_rgba(26,58,42,0.12)]' : ''}`}
								onClick={() => setActiveFilter(key)}
							>
								<span className="font-outfit text-xs font-medium text-[#78716c] uppercase tracking-[0.5px]">{label}</span>
								<span className={`font-outfit text-[28px] font-semibold leading-none ${STAT_VALUE_COLOR[colorClass]}`}>{counts[key]}</span>
							</button>
						))}
					</section>

					<section className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-[#f5f5f4]">
							<div className="relative flex items-center flex-1 sm:flex-none">
								<svg className="absolute left-3 text-[#a8a29e] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
								</svg>
								<input
									type="text"
									className="py-2.25 pr-3.5 pl-9 w-full sm:w-75 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] transition-[border-color,background] duration-150 placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
									placeholder="Search guide, module or quiz…"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<span className="font-outfit text-xs font-medium text-[#a8a29e]">{filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
						</div>

						<div className="overflow-x-auto">
							{isLoading && <p className="text-center py-12 font-outfit text-sm text-[#a8a29e]">Loading quiz submissions…</p>}
							{error && <p className="text-center py-12 font-outfit text-sm text-red-500">Failed to load quiz submissions.</p>}
							{!isLoading && !error && (
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Guide</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Module</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Quiz</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Auto Score</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Status</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Submitted</th>
											<th className="bg-[#fafaf9] px-6 py-3.25 font-outfit text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filtered.length > 0 ? filtered.map((a, idx) => (
											<tr key={a.id} className={`hover:bg-[#fef7f0] ${idx === filtered.length - 1 ? '[&>td]:border-b-0' : ''}`}>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle">
													<p className="font-serif text-[15px] text-[#1a3a2a]">{a.guide?.firstName} {a.guide?.lastName}</p>
												</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle font-serif text-sm text-[#78716c]">{a.quiz?.module?.title ?? '—'}</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle font-serif text-sm text-[#78716c]">{a.quiz?.title ?? '—'}</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle">
													{a.totalScore != null ? (
														<span className={`font-outfit text-[13px] font-semibold py-0.75 px-2.5 rounded-md ${a.totalScore >= 70 ? 'bg-[#e8f5ee] text-[#266841]' : 'bg-[#fdf0e6] text-[#b35c2a]'}`}>
															{a.totalScore}%
														</span>
													) : (
														<span className="font-outfit text-[13px] text-[#a8a29e]">—</span>
													)}
												</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle">
													<span className={`inline-flex items-center py-1 px-3 rounded-full font-outfit text-xs font-medium ${a.status === 'PENDING_REVIEW' ? 'bg-[#fdf0e6] text-[#b35c2a]' : 'bg-[#e8f5ee] text-[#266841]'}`}>
														{a.status === 'PENDING_REVIEW' ? 'Pending Review' : 'Graded'}
													</span>
												</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle font-serif text-sm text-[#78716c]">{new Date(a.submittedAt).toLocaleDateString()}</td>
												<td className="px-6 py-4 border-b border-[#f5f5f4] align-middle">
													<button className="inline-flex items-center gap-1 font-outfit text-[13px] font-medium text-[#b35c2a] bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-200 hover:gap-2 hover:underline" onClick={() => navigate(`/quiz-reviews/${a.id}`)}>
														Grade <span aria-hidden>→</span>
													</button>
												</td>
											</tr>
										)) : (
											<tr>
												<td colSpan="7" className="text-center px-6 py-12 font-serif text-base text-[#a8a29e]">No quiz submissions found.</td>
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
