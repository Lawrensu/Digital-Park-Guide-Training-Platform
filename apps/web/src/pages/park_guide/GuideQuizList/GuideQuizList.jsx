import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'
import * as certificationsApi from '../../../api/certifications.js'


const STAT_BORDER = {
	total:   'border-t-[#607D8B]',
	graded:  'border-t-[#2E7D32]',
	pending: 'border-t-[#E65100]',
}

const STATUS_BADGE = {
	GRADED:         'bg-[#E8F5E9] text-[#2E7D32]',
	PENDING_REVIEW: 'bg-[#FFF3E0] text-[#E65100]',
}


const GuideQuizList = () => {
	const navigate = useNavigate()

	const { data: attemptsData, isLoading, error } = useQuery({
		queryKey: ['quiz-attempts', 'me'],
		queryFn: async () => {
			const res = await quizAttemptsApi.getAll()
			return res.data.data
		},
	})

	const { data: certsData } = useQuery({
		queryKey: ['certifications', 'me'],
		queryFn: async () => {
			const res = await certificationsApi.getMine()
			return res.data.data
		},
	})

	const attempts = attemptsData ?? []
	const certs    = certsData    ?? []

	const graded  = attempts.filter(a => a.status === 'GRADED')
	const pending = attempts.filter(a => a.status === 'PENDING_REVIEW')

	const certByAttemptId = certs.reduce((map, cert) => {
		if (cert.quizAttemptId) map[cert.quizAttemptId] = cert
		return map
	}, {})

	const stats = [
		{ id: 1, label: 'Total Attempts',  value: attempts.length, icon: '📝', class: 'total'   },
		{ id: 2, label: 'Graded',          value: graded.length,   icon: '✅', class: 'graded'  },
		{ id: 3, label: 'Pending Review',  value: pending.length,  icon: '⏳', class: 'pending' },
	]

	const renderAction = (attempt) => {
		if (attempt.status === 'GRADED') {
			const cert = certByAttemptId[attempt.id]
			if (cert) {
				return (
					<button
						className="py-2 px-4 rounded-[6px] text-[0.85rem] font-semibold cursor-pointer border border-[#E0E0E0] bg-transparent text-[#333333] transition-all duration-200 hover:border-[#666666] hover:bg-[#f5f5f5]"
						onClick={() => navigate(`/guide/certifications/${cert.id}`)}
					>
						View Certificate
					</button>
				)
			}
			return (
				<button
					className="py-2 px-4 rounded-[6px] text-[0.85rem] font-semibold cursor-pointer border border-[#E0E0E0] bg-transparent text-[#333333] transition-all duration-200 hover:border-[#666666] hover:bg-[#f5f5f5]"
					onClick={() => navigate('/guide/certifications')}
				>
					View Certificates
				</button>
			)
		}
		return (
			<button
				disabled
				className="py-2 px-4 rounded-[6px] text-[0.85rem] font-semibold border border-[#E0E0E0] bg-transparent text-[#333333] cursor-not-allowed opacity-60"
			>
				Awaiting Grade
			</button>
		)
	}

	const getStatusLabel = (attempt) => {
		if (attempt.status === 'GRADED') {
			if (attempt.totalScore != null) return `${attempt.totalScore}% — Graded`
			return 'Graded'
		}
		return 'Pending Review'
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-4 sm:p-6 lg:p-8 box-border">
				<h1 className="text-[1.75rem] text-[#333333] m-0 mb-6 font-bold">My Quiz Attempts</h1>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
					{stats.map((stat) => (
						<div key={stat.id} className={`bg-white p-6 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-center gap-4 border-t-4 ${STAT_BORDER[stat.class]}`}>
							<div className="w-12 h-12 rounded-full flex items-center justify-center text-[1.5rem] bg-[#f5f5f5]">{stat.icon}</div>
							<div>
								<h3 className="m-0 text-[1.5rem] font-bold text-[#333333]">{stat.value}</h3>
								<p className="m-0 text-[0.9rem] text-[#666666]">{stat.label}</p>
							</div>
						</div>
					))}
				</div>

				{isLoading && <p className="text-center py-8 text-[#666666]">Loading attempts…</p>}
				{error && <p className="text-center py-8 text-red-500">Failed to load quiz attempts.</p>}

				{!isLoading && !error && (
					<>
						{attempts.length === 0 && (
							<p className="text-center py-12 text-[#666666]">No quiz attempts yet. Start a module to take a quiz.</p>
						)}

						{/* Mobile cards */}
						{attempts.length > 0 && (
							<div className="flex flex-col gap-3 sm:hidden">
								{attempts.map((attempt) => (
									<div key={attempt.id} className="bg-white rounded-[10px] p-4 border border-[#E0E0E0] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-3">
										<div className="flex items-start justify-between gap-2">
											<div>
												<p className="font-semibold text-[0.95rem] text-[#333333] m-0 leading-[1.3]">{attempt.quiz?.title ?? '—'}</p>
												<p className="text-[0.78rem] text-[#888888] mt-0.5 m-0">{new Date(attempt.submittedAt).toLocaleDateString()}</p>
											</div>
											<span className={`inline-flex items-center py-1 px-2.5 rounded-[20px] text-[0.75rem] font-semibold whitespace-nowrap shrink-0 ${STATUS_BADGE[attempt.status] ?? 'bg-[#F5F5F5] text-[#666]'}`}>
												{getStatusLabel(attempt)}
											</span>
										</div>
										<p className="text-[0.82rem] text-[#666666] m-0">{attempt.quiz?.module?.title ?? '—'}</p>
										<div>{renderAction(attempt)}</div>
									</div>
								))}
							</div>
						)}

						{/* Desktop table */}
						{attempts.length > 0 && (
							<div className="hidden sm:block bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
								<table className="w-full border-collapse text-left">
									<thead>
										<tr>
											<th style={{ width: '35%' }} className="py-5 px-6 text-[0.85rem] uppercase tracking-[0.5px] text-[#666666] bg-[#FAFAFA] border-b border-[#E0E0E0] font-bold">Quiz</th>
											<th style={{ width: '30%' }} className="py-5 px-6 text-[0.85rem] uppercase tracking-[0.5px] text-[#666666] bg-[#FAFAFA] border-b border-[#E0E0E0] font-bold">Module</th>
											<th style={{ width: '20%' }} className="py-5 px-6 text-[0.85rem] uppercase tracking-[0.5px] text-[#666666] bg-[#FAFAFA] border-b border-[#E0E0E0] font-bold">Status</th>
											<th style={{ width: '15%', textAlign: 'right' }} className="py-5 px-6 text-[0.85rem] uppercase tracking-[0.5px] text-[#666666] bg-[#FAFAFA] border-b border-[#E0E0E0] font-bold">Action</th>
										</tr>
									</thead>
									<tbody>
										{attempts.map((attempt, idx) => (
											<tr key={attempt.id} className={`hover:bg-[#F9F9F9] ${idx === attempts.length - 1 ? '[&>td]:border-b-0' : ''}`}>
												<td className="py-5 px-6 border-b border-[#f0f0f0] align-middle">
													<span className="font-semibold text-[1rem] text-[#333333] block">{attempt.quiz?.title ?? '—'}</span>
													<span className="text-[0.8rem] text-[#888888] mt-1 block">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
												</td>
												<td className="py-5 px-6 border-b border-[#f0f0f0] align-middle">
													<span className="text-[0.85rem] text-[#666666]">{attempt.quiz?.module?.title ?? '—'}</span>
												</td>
												<td className="py-5 px-6 border-b border-[#f0f0f0] align-middle">
													<span className={`inline-flex items-center py-1 px-3 rounded-[20px] text-[0.8rem] font-semibold ${STATUS_BADGE[attempt.status] ?? 'bg-[#F5F5F5] text-[#666]'}`}>
														{getStatusLabel(attempt)}
													</span>
												</td>
												<td className="py-5 px-6 border-b border-[#f0f0f0] align-middle text-right">
													{renderAction(attempt)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	)
}

export default GuideQuizList
