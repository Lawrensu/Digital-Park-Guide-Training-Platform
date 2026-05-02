import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as usersApi from '../../../api/users.js'


const STATUS_BADGE = {
	ACTIVE:    'bg-[#e8f5ee] text-[#266841]',
	INACTIVE:  'bg-[#f5f5f4] text-[#78716c]',
	SUSPENDED: 'bg-[#fdf0e6] text-[#b35c2a]',
}

function BookIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
		</svg>
	)
}

function CheckIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polyline points="20 6 9 17 4 12"/>
		</svg>
	)
}

function CertIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
		</svg>
	)
}

function QuizIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
			<polyline points="14 2 14 8 20 8"/>
			<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
		</svg>
	)
}

function BadgeIcon() {
	return (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
		</svg>
	)
}


export default function GuideDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()

	const { data: guide, isLoading: loadingGuide, error: guideError } = useQuery({
		queryKey: ['users', id],
		queryFn: async () => {
			const res = await usersApi.getOne(id)
			return res.data.data
		},
	})

	const { data: enrolmentsData } = useQuery({
		queryKey: ['users', id, 'enrolments'],
		queryFn: async () => {
			const res = await usersApi.getEnrolments(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: attemptsData } = useQuery({
		queryKey: ['users', id, 'quiz-attempts'],
		queryFn: async () => {
			const res = await usersApi.getQuizAttempts(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: certsData } = useQuery({
		queryKey: ['users', id, 'certifications'],
		queryFn: async () => {
			const res = await usersApi.getCertifications(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: badgesData } = useQuery({
		queryKey: ['users', id, 'badges'],
		queryFn: async () => {
			const res = await usersApi.getBadges(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const enrolments = enrolmentsData ?? []
	const attempts   = attemptsData   ?? []
	const certs      = certsData      ?? []
	const badges     = badgesData     ?? []

	const completedCount = enrolments.filter(e => e.completedAt).length

	if (loadingGuide) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading…</p>
				</div>
			</div>
		)
	}

	if (guideError || !guide) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-red-500">Failed to load guide.</p>
				</div>
			</div>
		)
	}

	const initials = `${guide.firstName?.[0] ?? ''}${guide.lastName?.[0] ?? ''}`.toUpperCase()

	const stats = [
		{ label: 'Modules Enrolled', value: enrolments.length, icon: <BookIcon /> },
		{ label: 'Completed',        value: completedCount,    icon: <CheckIcon /> },
		{ label: 'Certifications',   value: certs.length,      icon: <CertIcon /> },
		{ label: 'Quiz Attempts',    value: attempts.length,   icon: <QuizIcon /> },
		{ label: 'Badges',           value: badges.length,     icon: <BadgeIcon /> },
	]

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Guides</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

					<div className="flex items-center gap-4 mb-8">
						<button onClick={() => navigate('/guides')} className="[font-family:var(--font-outfit)] text-sm text-[#78716c] hover:text-[#1a3a2a] transition-colors">
							← Back
						</button>
					</div>

					<div className="bg-white border border-[#f0e9db] rounded-xl p-8 flex items-center gap-6 mb-6 border-l-[5px] border-l-[#2d7d4e]">
						<div className="w-20 h-20 bg-[#2d7d4e] text-white rounded-full flex items-center justify-center text-[28px] font-bold [font-family:var(--font-outfit)] shrink-0">
							{initials}
						</div>
						<div className="flex flex-col gap-2">
							<h2 className="[font-family:var(--font-outfit)] m-0 text-2xl font-semibold text-[#1c1917]">{guide.firstName} {guide.lastName}</h2>
							<div className="flex items-center gap-3">
								<span className={`inline-flex items-center py-1 px-3 rounded-full [font-family:var(--font-outfit)] text-xs font-medium ${STATUS_BADGE[guide.status] ?? ''}`}>{guide.status}</span>
								<span className="[font-family:var(--font-outfit)] text-sm text-[#78716c]">{guide.email}</span>
								{guide.username && <span className="[font-family:var(--font-outfit)] text-sm text-[#44403c]">@{guide.username}</span>}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
						{stats.map((stat, i) => (
							<div key={i} className="bg-white border border-[#e7e5e4] rounded-xl px-5 py-4 flex items-center gap-4">
								<div className="w-10 h-10 bg-[#f3faf6] text-[#2d7d4e] rounded-lg flex items-center justify-center shrink-0">{stat.icon}</div>
								<div className="flex flex-col">
									<span className="[font-family:var(--font-outfit)] text-2xl font-bold text-[#1c1917] leading-none">{stat.value}</span>
									<span className="[font-family:var(--font-outfit)] text-xs text-[#78716c] mt-1">{stat.label}</span>
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

						<div className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
							<div className="flex justify-between items-center px-6 py-4 border-b border-[#f5f5f4]">
								<h3 className="[font-family:var(--font-outfit)] m-0 text-base font-semibold text-[#1c1917]">Enrolments</h3>
							</div>
							<div className="p-4 flex flex-col gap-3">
								{enrolments.length > 0 ? enrolments.map(enrolment => (
									<div key={enrolment.id} className="flex justify-between items-center p-4 border border-[#f5f5f4] rounded-lg">
										<div className="flex-1">
											<h4 className="[font-family:var(--font-outfit)] m-0 mb-2 text-[15px] text-[#1a3a2a] font-medium">{enrolment.module?.title ?? '—'}</h4>
											<div className="flex items-center gap-2.5">
												<div className="flex-1 h-1.5 bg-[#e7e5e4] rounded-[3px] overflow-hidden max-w-50">
													<div className="h-full bg-[#2d7d4e] rounded-[3px]" style={{ width: `${enrolment.progressPct ?? 0}%` }} />
												</div>
												<span className="[font-family:var(--font-outfit)] text-xs text-[#78716c] font-medium min-w-[35px] text-right">{enrolment.progressPct ?? 0}%</span>
											</div>
										</div>
										{enrolment.completedAt && (
											<span className="ml-4 inline-flex items-center py-1 px-3 rounded-full [font-family:var(--font-outfit)] text-xs font-medium bg-[#e8f5ee] text-[#266841]">Completed</span>
										)}
									</div>
								)) : (
									<p className="[font-family:var(--font-serif)] text-sm text-[#a8a29e] py-4 text-center">No enrolments yet.</p>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-6">

							<div className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
								<div className="px-6 py-4 border-b border-[#f5f5f4]">
									<h3 className="[font-family:var(--font-outfit)] m-0 text-base font-semibold text-[#1c1917]">Certifications</h3>
								</div>
								<div className="p-2">
									{certs.length > 0 ? certs.map(cert => (
										<div key={cert.id} className="flex items-start gap-3 p-3 border-b border-[#f5f5f4] last:border-b-0">
											<div className="w-8 h-8 bg-[#f3faf6] text-[#2d7d4e] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
												<CertIcon />
											</div>
											<div className="flex flex-col gap-1 w-full">
												<span className="[font-family:var(--font-outfit)] text-sm text-[#1a3a2a] font-medium">{cert.enrolment?.module?.title ?? '—'}</span>
												<span className="[font-family:var(--font-outfit)] text-xs text-[#a8a29e]">{new Date(cert.issuedAt).toLocaleDateString()}</span>
											</div>
										</div>
									)) : (
										<p className="[font-family:var(--font-serif)] text-sm text-[#a8a29e] py-4 text-center px-3">No certifications yet.</p>
									)}
								</div>
							</div>

							<div className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
								<div className="px-6 py-4 border-b border-[#f5f5f4]">
									<h3 className="[font-family:var(--font-outfit)] m-0 text-base font-semibold text-[#1c1917]">Quiz Attempts</h3>
								</div>
								<div className="p-2">
									{attempts.length > 0 ? attempts.slice(0, 5).map(attempt => (
										<div key={attempt.id} className="flex items-start gap-3 p-3 border-b border-[#f5f5f4] last:border-b-0">
											<div className="w-8 h-8 bg-[#f3faf6] text-[#2d7d4e] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
												<QuizIcon />
											</div>
											<div className="flex flex-col gap-1 w-full">
												<span className="[font-family:var(--font-outfit)] text-sm text-[#1a3a2a] font-medium">{attempt.quiz?.title ?? '—'}</span>
												<div className="flex justify-between items-center">
													{attempt.totalScore != null && (
														<span className={`[font-family:var(--font-outfit)] text-xs font-bold py-0.5 px-1.5 rounded-[4px] ${attempt.totalScore >= 70 ? 'bg-[#e8f5ee] text-[#266841]' : 'bg-[#fdf0e6] text-[#b35c2a]'}`}>
															{attempt.totalScore}%
														</span>
													)}
													<span className="[font-family:var(--font-outfit)] text-xs text-[#a8a29e]">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
												</div>
											</div>
										</div>
									)) : (
										<p className="[font-family:var(--font-serif)] text-sm text-[#a8a29e] py-4 text-center px-3">No quiz attempts yet.</p>
									)}
								</div>
							</div>

						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
