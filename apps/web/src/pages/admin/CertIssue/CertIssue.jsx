import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'
import * as certificationsApi from '../../../api/certifications.js'


const formatDate = (dateString) => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}


export default function CertIssuePage() {
	const { attemptId } = useParams()
	const navigate = useNavigate()

	const [expiresAt, setExpiresAt] = useState('')
	const [issueError, setIssueError] = useState('')

	const { data: attempt, isLoading, error } = useQuery({
		queryKey: ['quiz-attempts', attemptId],
		queryFn: async () => {
			const res = await quizAttemptsApi.getOne(attemptId)
			return res.data.data
		},
	})

	const issueMutation = useMutation({
		mutationFn: () => certificationsApi.issue({
			attemptId,
			expiresAt: expiresAt || undefined,
		}),
		onSuccess: () => navigate('/certifications'),
		onError: () => setIssueError('Failed to issue certificate. Please try again.'),
	})

	if (isLoading) {
		return (
			<div className="flex min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading…</p>
				</div>
			</div>
		)
	}

	if (error || !attempt) {
		return (
			<div className="flex min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-red-500">Failed to load quiz attempt.</p>
				</div>
			</div>
		)
	}

	const guideName  = `${attempt.guide?.firstName ?? ''} ${attempt.guide?.lastName ?? ''}`
	const courseName = attempt.quiz?.module?.title ?? '—'
	const score      = attempt.totalScore

	return (
		<div className="flex min-h-screen bg-[#fdfbf7]">
			<Navbar />

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Certifications</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white">AM</div>
					</div>
				</header>

				<main className="flex-1 p-8 overflow-y-auto">

					<div className="flex items-center gap-4 mb-8">
						<button
							onClick={() => navigate('/certifications')}
							className="[font-family:var(--font-outfit)] text-sm text-[#78716c] hover:text-[#1a3a2a] transition-colors"
						>
							← Back
						</button>
						<h2 className="[font-family:var(--font-outfit)] font-semibold text-[28px] text-[#1a3a2a] m-0">Issue Certificate</h2>
					</div>

					<div className="flex gap-8 items-start max-w-5xl">

						<div className="flex-1 space-y-6">

							<div className="flex items-start gap-3 bg-[#e8f5ee] border border-[#a7d9b8] text-[#1a3a2a] p-4 rounded-xl">
								<div className="bg-[#2d7d4e] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">✓</div>
								<div>
									<span className="[font-family:var(--font-outfit)] font-semibold text-sm">Quiz passed ({score}%)</span>
									<span className="[font-family:var(--font-outfit)] text-sm text-[#266841]"> — set expiry date (optional) and issue the certificate.</span>
								</div>
							</div>

							<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
								<h3 className="[font-family:var(--font-outfit)] font-medium text-[20px] text-[#1a3a2a] mb-6 border-b border-[#f0e9db] pb-3">Certificate Details</h3>

								<div className="grid grid-cols-2 gap-6 mb-6">
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Guide</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a] font-medium">{guideName}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Module</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{courseName}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Quiz</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{attempt.quiz?.title ?? '—'}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Score</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{score}%</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Submitted</label>
										<p className="[font-family:var(--font-serif)] text-base text-[#1a3a2a]">{new Date(attempt.submittedAt).toLocaleDateString()}</p>
									</div>
									<div className="flex flex-col gap-1">
										<label className="[font-family:var(--font-outfit)] font-medium text-sm text-gray-500">Expiry Date (optional)</label>
										<input
											type="date"
											className="py-[9px] px-[14px] border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] transition-[border-color] duration-150 focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
											value={expiresAt}
											onChange={e => setExpiresAt(e.target.value)}
										/>
									</div>
								</div>

								{issueError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500 mb-4">{issueError}</p>}

								<div className="flex gap-3">
									<button
										onClick={() => issueMutation.mutate()}
										disabled={issueMutation.isPending}
										className="py-[10px] px-6 bg-[#1a3a2a] text-white border-none rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#132d20] disabled:opacity-50"
									>
										{issueMutation.isPending ? 'Issuing…' : 'Issue Certificate'}
									</button>
									<button
										onClick={() => navigate('/certifications')}
										className="py-[10px] px-6 bg-transparent text-[#44403c] border border-[#d6d3d1] rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#f5f5f4]"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>

						<div className="w-[420px] shrink-0 sticky top-8">
							<p className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#78716c] text-center mb-3 uppercase tracking-[0.5px]">Preview</p>
							<div className="bg-white w-full aspect-[210/297] shadow-[0_10px_25px_rgba(0,0,0,0.15)] p-4 relative overflow-hidden">
								<div className="w-full h-full border-[5px] border-double border-[#2d7d4e] p-6 flex flex-col justify-between text-center">
									<div>
										<div className="w-14 h-14 bg-[#2d7d4e] text-white rounded-full mx-auto flex items-center justify-center font-bold text-sm mb-3">SFC</div>
										<h2 className="font-serif text-2xl text-[#2d7d4e] m-0 uppercase tracking-wider border-b-2 border-[#e5e7eb] pb-2 inline-block">Certificate of Completion</h2>
									</div>
									<div className="flex-1 flex flex-col justify-center gap-2 py-4">
										<p className="font-serif text-sm text-[#78716c] m-0">This is to certify that</p>
										<h1 className="font-serif text-xl text-[#1c1917] my-1 font-bold italic">{guideName}</h1>
										<p className="font-serif text-sm text-[#78716c] m-0">has successfully completed</p>
										<h3 className="font-serif text-base text-[#2d7d4e] my-1 font-bold">{courseName}</h3>
										<p className="font-serif text-sm text-[#78716c] m-0">conducted by</p>
										<p className="font-serif text-sm text-[#44403c] font-semibold">Sarawak Forestry Corporation</p>
									</div>
									<div className="mt-4 flex justify-between items-end pt-3 border-t border-[#e5e7eb] text-xs text-[#6b7280]">
										<span>{formatDate(new Date().toISOString().slice(0, 10))}</span>
										<span className="text-[#111827] font-semibold">SFC Training</span>
										{expiresAt ? <span>Until {formatDate(expiresAt)}</span> : <span>No Expiry</span>}
									</div>
								</div>
							</div>
						</div>

					</div>
				</main>
			</div>
		</div>
	)
}
