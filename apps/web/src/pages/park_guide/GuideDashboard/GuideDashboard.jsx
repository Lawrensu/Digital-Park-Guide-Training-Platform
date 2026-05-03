import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import { useAuth } from '../../../rbac/AuthProvider'
import * as usersApi from '../../../api/users.js'
import * as enrolmentsApi from '../../../api/enrolments.js'
import * as certificationsApi from '../../../api/certifications.js'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


const STAT_CARD_BORDER = {
	teal:   'border-t-[#0d9488]',
	blue:   'border-t-[#3b82f6]',
	orange: 'border-t-[#f97316]',
	yellow: 'border-t-[#d97706]',
}

const STAT_BADGE_CLASS = {
	teal:   'bg-[#ccfbf1] text-[#0d9488]',
	blue:   'bg-[#dbeafe] text-[#3b82f6]',
	orange: 'bg-[#ffedd5] text-[#f97316]',
	yellow: 'bg-[#fef3c7] text-[#d97706]',
}

const MODULE_COLORS = ['green', 'blue', 'orange']

const MODULE_CARD_BORDER = {
	green:  'border-l-[#2d7d4e]',
	blue:   'border-l-[#3b82f6]',
	orange: 'border-l-[#f97316]',
}

const STATUS_BADGE_CLASS = {
	green:  'bg-[#ecfdf5] text-[#059669]',
	blue:   'bg-[#eff6ff] text-[#3b82f6]',
	orange: 'bg-[#fff7ed] text-[#f97316]',
}

const MODULE_BAR_CLASS = {
	green:  'h-full bg-[#2d7d4e] rounded-[3px]',
	blue:   'h-full bg-[#3b82f6] rounded-[3px]',
	orange: 'h-full bg-[#f97316] rounded-[3px]',
}

const MODULE_PROGRESS_TEXT_CLASS = {
	green:  'font-outfit text-[0.78rem] font-semibold text-[#2d7d4e]',
	blue:   'font-outfit text-[0.78rem] font-semibold text-[#3b82f6]',
	orange: 'font-outfit text-[0.78rem] font-semibold text-[#f97316]',
}

const DUE_BOX_COLORS = ['bg-[#ef4444]', 'bg-[#f97316]', 'bg-[#3b82f6]']


export default function GuideDashboardPage() {
	const navigate = useNavigate()
	const { user: authUser } = useAuth()

	const { data: me } = useQuery({
		queryKey: ['users', authUser?.id],
		queryFn: async () => {
			const res = await usersApi.getOne(authUser.id)
			return res.data.data
		},
		enabled: !!authUser?.id,
	})

	const { data: enrolmentsData } = useQuery({
		queryKey: ['enrolments', 'me'],
		queryFn: async () => {
			const res = await enrolmentsApi.getMyEnrolments()
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

	const { data: attemptsData } = useQuery({
		queryKey: ['quiz-attempts', 'me'],
		queryFn: async () => {
			const res = await quizAttemptsApi.getAll()
			return res.data.data
		},
	})

	const enrolments = enrolmentsData ?? []
	const certs      = certsData      ?? []
	const attempts   = attemptsData   ?? []

	const completed   = enrolments.filter(e => e.completedAt)
	const inProgress  = enrolments.filter(e => !e.completedAt)
	const graded      = attempts.filter(a => a.status === 'GRADED')
	const pendingGrade = attempts.filter(a => a.status === 'PENDING_REVIEW')

	const overallPct = enrolments.length > 0
		? Math.round(enrolments.reduce((sum, e) => sum + (e.progressPct ?? 0), 0) / enrolments.length)
		: 0

	const modulesInProgress = inProgress.slice(0, 3)

	const upcoming = enrolments
		.filter(e => !e.completedAt && e.dueAt)
		.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt))
		.slice(0, 3)

	const recentCerts = certs.slice(0, 2)

	const stats = [
		{ value: String(enrolments.length), label: 'Modules Enrolled',  sub: `${inProgress.length} in progress`,   color: 'teal'   },
		{ value: String(graded.length),     label: 'Quizzes Graded',    sub: `${pendingGrade.length} pending`,      color: 'blue'   },
		{ value: String(certs.length),      label: 'Certs Earned',      sub: `${completed.length} completed`,       color: 'orange' },
		{ value: String(completed.length),  label: 'Modules Completed', sub: `of ${enrolments.length} enrolled`,    color: 'yellow' },
	]

	const handleCertDownload = async (certId) => {
		try {
			const res = await certificationsApi.getDownloadUrl(certId)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve certificate download link.')
		}
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#f5f5f4]">
			<GuideNavbar />

			<div className="flex flex-col flex-1 overflow-hidden">
				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col gap-7">

					<header>
						<h1 className="font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] text-[1.75rem] font-bold text-[#333333]">Dashboard</h1>
					</header>

					<div className="relative bg-[#1a3a2a] rounded-xl py-8 px-5 sm:px-10 overflow-hidden">
						<div className="absolute -right-15 -top-15 w-70 h-70 rounded-full bg-white/4 pointer-events-none"></div>
						<div className="relative z-1 mb-5">
							<h2 className="font-outfit text-[1.6rem] font-bold text-white mb-[0.35rem]">
								Welcome back, {me?.username ?? authUser?.email?.split('@')[0] ?? '…'}! 🌿
							</h2>
							<p className="font-outfit text-[0.9rem] text-white/65">
								Keep up the great work. You're {overallPct}% through your training program.
							</p>
						</div>
						<div className="relative z-1 flex items-center gap-3.5">
							<div className="flex-1 h-2 bg-white/18 rounded-sm overflow-hidden">
								<div className="h-full bg-[#2d7d4e] rounded-sm" style={{ width: `${overallPct}%` }}></div>
							</div>
							<span className="font-outfit text-[0.8rem] font-medium text-white/80 whitespace-nowrap">{overallPct}% Overall Progress</span>
						</div>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
						{stats.map((stat, i) => (
							<div key={i} className={`bg-white border border-[#e7e5e4] border-t-[3px] rounded-[10px] py-5 px-6 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${STAT_CARD_BORDER[stat.color]}`}>
								<div className={`w-13 h-13 rounded-full flex items-center justify-center font-outfit text-[1.15rem] font-bold shrink-0 ${STAT_BADGE_CLASS[stat.color]}`}>
									{stat.value}
								</div>
								<div className="flex flex-col gap-0.75">
									<span className="font-outfit text-[0.9rem] font-semibold text-[#1c1917]">{stat.label}</span>
									<span className="font-outfit text-[0.78rem] text-[#78716c]">{stat.sub}</span>
								</div>
							</div>
						))}
					</div>

					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-outfit text-[1.05rem] font-semibold text-[#1c1917]">Modules In Progress</h3>
							<button
								onClick={() => navigate('/guide/modules')}
								className="font-outfit text-[0.82rem] font-medium text-[#2d7d4e] bg-transparent border-0 cursor-pointer hover:text-[#1a3a2a] hover:underline"
							>
								View all →
							</button>
						</div>

						{modulesInProgress.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
								{modulesInProgress.map((enrolment, i) => {
									const color   = MODULE_COLORS[i % MODULE_COLORS.length]
									const pct     = enrolment.progressPct ?? 0
									const status  = pct >= 75 ? 'On Track' : pct > 0 ? 'In Progress' : 'Just Started'
									const dueText = enrolment.dueAt
										? `Due ${new Date(enrolment.dueAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
										: 'No due date'
									return (
										<div key={enrolment.id} className={`bg-white border border-[#e7e5e4] border-l-4 rounded-[10px] p-5 flex flex-col gap-[0.65rem] shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${MODULE_CARD_BORDER[color]}`}>
											<div className="flex items-center justify-between">
												<span className={`font-outfit text-[0.7rem] font-semibold py-0.75 px-2.25 rounded-xl ${STATUS_BADGE_CLASS[color]}`}>{status}</span>
											</div>
											<h4 className="font-outfit text-[0.92rem] font-semibold text-[#1c1917] leading-[1.4]">{enrolment.module?.title ?? '—'}</h4>
											<div className="h-1.5 bg-[#e7e5e4] rounded-[3px] overflow-hidden">
												<div className={MODULE_BAR_CLASS[color]} style={{ width: `${pct}%` }}></div>
											</div>
											<p className={MODULE_PROGRESS_TEXT_CLASS[color]}>{pct}% complete</p>
											<div className="flex items-center justify-between">
												<span className="font-outfit text-[0.78rem] text-[#78716c]">{dueText}</span>
											</div>
											<button
												onClick={() => navigate(`/guide/modules/${enrolment.moduleId}`)}
												className="w-full py-[0.55rem] bg-[#1f4d35] text-white border-0 rounded-md font-outfit text-[0.85rem] font-medium cursor-pointer transition-colors duration-150 mt-1 hover:bg-[#1a3a2a]"
											>
												Continue →
											</button>
										</div>
									)
								})}
							</div>
						) : (
							<p className="font-outfit text-[0.9rem] text-[#78716c] py-4">
								No modules in progress.{' '}
								<button
									onClick={() => navigate('/guide/modules')}
									className="text-[#2d7d4e] bg-transparent border-0 cursor-pointer font-medium hover:underline"
								>
									Browse modules →
								</button>
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

						<div className="bg-white border border-[#e7e5e4] rounded-[10px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-outfit text-[1.05rem] font-semibold text-[#1c1917]">Upcoming Due Dates</h3>
							</div>
							{upcoming.length > 0 ? (
								<div className="flex flex-col gap-3">
									{upcoming.map((enrolment, i) => {
										const dueDate = new Date(enrolment.dueAt)
										const isUrgent = (dueDate - new Date()) < 3 * 24 * 60 * 60 * 1000
										return (
											<div key={enrolment.id} className="flex items-center gap-4 py-3 border-b border-[#f5f5f4] last:border-b-0">
												<div className={`flex flex-col items-center justify-center w-11.5 min-w-11.5 h-13 rounded-lg text-white ${DUE_BOX_COLORS[i % DUE_BOX_COLORS.length]}`}>
													<span className="font-outfit text-[1.1rem] font-bold leading-[1.1]">{dueDate.getDate()}</span>
													<span className="font-outfit text-[0.65rem] font-medium uppercase tracking-[0.05em]">
														{dueDate.toLocaleString('en', { month: 'short' })}
													</span>
												</div>
												<div className="flex-1 flex flex-col gap-0.5">
													<p className="font-outfit text-[0.88rem] font-semibold text-[#1c1917]">{enrolment.module?.title ?? '—'}</p>
													<p className="font-outfit text-[0.78rem] text-[#78716c]">{enrolment.progressPct ?? 0}% complete</p>
													{isUrgent && (
														<span className="inline-flex items-center gap-0.75 font-outfit text-[0.7rem] font-semibold text-[#b45309] bg-[#fef3c7] py-0.5 px-1.75 rounded-sm mt-0.75 w-fit">
															⚠️ Urgent
														</span>
													)}
												</div>
												<button
													onClick={() => navigate(`/guide/modules/${enrolment.moduleId}`)}
													className={`border-0 rounded-md py-[0.45rem] px-[0.85rem] font-outfit text-[0.82rem] font-semibold cursor-pointer whitespace-nowrap transition-opacity duration-150 hover:opacity-85 ${isUrgent ? 'bg-[#ef4444] text-white' : 'bg-[#1f4d35] text-white'}`}
												>
													Continue →
												</button>
											</div>
										)
									})}
								</div>
							) : (
								<p className="font-outfit text-[0.88rem] text-[#78716c]">No upcoming due dates set.</p>
							)}
						</div>

						<div className="bg-white border border-[#e7e5e4] rounded-[10px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-outfit text-[1.05rem] font-semibold text-[#1c1917]">My Certificates</h3>
								<button
									onClick={() => navigate('/guide/certifications')}
									className="font-outfit text-[0.82rem] font-medium text-[#2d7d4e] bg-transparent border-0 cursor-pointer hover:text-[#1a3a2a] hover:underline"
								>
									View all →
								</button>
							</div>
							{recentCerts.length > 0 ? (
								<div className="flex flex-col gap-4">
									{recentCerts.map((cert) => {
										const isExpired = cert.expiresAt && new Date(cert.expiresAt) <= new Date()
										return (
											<div key={cert.id} className="flex items-start gap-4 p-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-lg">
												<div className="w-10 h-10 min-w-10 bg-[#fef3c7] rounded-lg flex items-center justify-center text-[1.1rem]">🏆</div>
												<div className="flex-1 flex flex-col gap-0.5">
													<p className="font-outfit text-[0.88rem] font-semibold text-[#1c1917]">{cert.enrolment?.module?.title ?? '—'}</p>
													<p className="font-outfit text-[0.75rem] text-[#78716c]">
														Issued: {new Date(cert.issuedAt).toLocaleDateString()}
														{cert.expiresAt ? ` · Expires: ${new Date(cert.expiresAt).toLocaleDateString()}` : ''}
													</p>
													<span className={`inline-flex items-center gap-0.75 font-outfit text-[0.7rem] font-semibold py-0.5 px-2 rounded-xl mt-1 w-fit border ${isExpired ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]' : 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'}`}>
														{isExpired ? '⏳ Expired' : '✓ Active'}
													</span>
												</div>
												<button
													onClick={() => handleCertDownload(cert.id)}
													className="bg-[#1f4d35] text-white border-0 rounded-md py-[0.45rem] px-3 font-outfit text-[0.78rem] font-semibold cursor-pointer whitespace-nowrap transition-colors duration-150 self-center hover:bg-[#1a3a2a]"
												>
													📄 PDF
												</button>
											</div>
										)
									})}
								</div>
							) : (
								<p className="font-outfit text-[0.88rem] text-[#78716c]">No certificates yet. Complete a module to earn one.</p>
							)}
						</div>

					</div>
				</main>
			</div>
		</div>
	)
}
