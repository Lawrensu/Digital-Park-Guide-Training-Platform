import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import { useAuth } from '../../../rbac/AuthProvider'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


export default function QuizGradingPage() {
	const { attemptId } = useParams()
	const navigate      = useNavigate()
	const { user }      = useAuth()

	const [scores, setScores]           = useState({})
	const [submitError, setSubmitError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [failToast, setFailToast]     = useState(false)

	const displayName = user?.email?.split('@')[0] ?? 'admin'
	const initials    = displayName.slice(0, 2).toUpperCase()

	const { data: attempt, isLoading, error } = useQuery({
		queryKey: ['quiz-attempts', attemptId],
		queryFn: async () => {
			const res = await quizAttemptsApi.getOne(attemptId)
			return res.data.data
		},
	})

	useEffect(() => {
		if (!attempt?.answers) return
		const initial = {}
		attempt.answers.forEach(a => { initial[a.questionId] = a.awardedScore ?? 0 })
		setScores(initial)
	}, [attempt])

	const handleSubmitGrades = async () => {
		setSubmitError('')
		setIsSubmitting(true)
		try {
			await quizAttemptsApi.grade(attemptId, scores)
			if (isPass) {
				navigate(`/certifications/issue/${attemptId}`)
			} else {
				setFailToast(true)
				setTimeout(() => {
					setFailToast(false)
					navigate('/quiz-reviews')
				}, 3000)
			}
		} catch {
			setSubmitError('Failed to submit grades. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading…</p>
				</div>
			</div>
		)
	}

	if (error || !attempt) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="[font-family:var(--font-outfit)] text-sm text-red-500">Failed to load quiz attempt.</p>
				</div>
			</div>
		)
	}

	const answers     = attempt.answers ?? []
	const totalScore  = Object.values(scores).reduce((sum, v) => sum + (Number(v) || 0), 0)
	const maxTotal    = answers.reduce((sum, a) => sum + (a.question?.points ?? 0), 0)
	const passMark    = attempt.quiz?.passMark ?? Math.round(maxTotal * 0.7)
	const isPass      = totalScore >= passMark

	const guideName   = `${attempt.guide?.firstName ?? ''} ${attempt.guide?.lastName ?? ''}`

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />

			{failToast && (
				<div className="fixed top-5 right-5 z-50 bg-[#b91c1c] text-white [font-family:var(--font-outfit)] text-[13.5px] font-medium py-3 px-5 rounded-xl shadow-lg max-w-sm">
					Guide did not meet the pass mark. Redirecting to quiz reviews…
				</div>
			)}

			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e7e5e4] shrink-0">
					<h1 className="[font-family:var(--font-outfit)] text-[20px] font-semibold text-[#1c1917]">Quiz Reviews</h1>
					<div className="flex items-center gap-3">
						<button className="w-9 h-9 rounded-lg bg-[#f5f5f4] border-none flex items-center justify-center text-[#78716c] cursor-pointer transition-colors duration-150 hover:bg-[#e7e5e4]" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
							</svg>
						</button>
						<div className="w-9 h-9 rounded-full bg-[#2d7d4e] flex items-center justify-center [font-family:var(--font-outfit)] text-xs font-semibold text-white">{initials}</div>
					</div>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

					<div className="flex items-center gap-4 mb-8">
						<button onClick={() => navigate('/quiz-reviews')} className="[font-family:var(--font-outfit)] text-sm text-[#78716c] hover:text-[#1a3a2a] transition-colors">
							← Back
						</button>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8 items-start">

						<div className="flex flex-col gap-6">

							<div className="flex justify-between items-start gap-8">
								<div>
									<h2 className="[font-family:var(--font-outfit)] m-0 mb-2 text-2xl font-semibold text-[#1a3a2a]">Grading: {attempt.quiz?.title ?? '—'}</h2>
									<div className="flex items-center gap-4">
										<span className="[font-family:var(--font-outfit)] bg-[#e8f5ee] text-[#266841] py-0.5 px-2 rounded text-xs font-semibold">Attempt #{attempt.attemptNumber ?? 1}</span>
										<span className="[font-family:var(--font-outfit)] text-[#78716c] text-[13px]">Submitted {new Date(attempt.submittedAt).toLocaleDateString()}</span>
									</div>
								</div>

								<div className={`bg-white border border-[#e7e5e4] rounded-xl p-6 min-w-55 text-center border-l-[5px] ${isPass ? 'border-l-[#2d7d4e]' : 'border-l-[#d32f2f]'}`}>
									<div className="flex justify-between items-center mb-2">
										<span className="[font-family:var(--font-outfit)] text-xs text-[#78716c] font-semibold uppercase">Total Score</span>
										<span className={`[font-family:var(--font-outfit)] text-[11px] py-0.5 px-2 rounded-full font-bold ${isPass ? 'bg-[#e8f5ee] text-[#266841]' : 'bg-[#ffebee] text-[#d32f2f]'}`}>
											{isPass ? 'PASS' : 'FAIL'}
										</span>
									</div>
									<div className="[font-family:var(--font-outfit)] text-[40px] font-bold text-[#1c1917] leading-none mb-1">
										{totalScore} <span className="text-2xl text-[#a8a29e] font-normal">/ {maxTotal}</span>
									</div>
									<div className="[font-family:var(--font-outfit)] text-[13px] text-[#78716c]">Pass Mark: {passMark}</div>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								{answers.length > 0 ? answers.map((answer, index) => (
									<div key={answer.questionId} className="bg-white border border-[#e7e5e4] rounded-xl p-6">
										<div className="flex justify-between mb-4 pb-2 border-b border-[#f5f5f4]">
											<span className="[font-family:var(--font-outfit)] font-semibold text-[#1c1917]">Question {index + 1}</span>
											<span className="[font-family:var(--font-outfit)] bg-[#f5f5f4] text-[#44403c] py-0.5 px-2 rounded text-xs font-medium">{answer.question?.type ?? '—'}</span>
										</div>

										<h4 className="[font-family:var(--font-serif)] m-0 mb-4 text-base text-[#1a3a2a] leading-[1.5]">{answer.question?.text ?? '—'}</h4>

										<div className="bg-[#fafaf9] border border-[#f0e9db] p-4 rounded-lg mb-5">
											<label className="[font-family:var(--font-outfit)] block text-xs font-semibold text-[#78716c] mb-2 uppercase tracking-[0.3px]">Guide Answer:</label>
											<p className="[font-family:var(--font-serif)] m-0 text-[15px] text-[#1a3a2a] leading-[1.6]">{Array.isArray(answer.value) ? answer.value.join(', ') : (answer.value ?? '—')}</p>
										</div>

										<div className="flex items-center justify-end gap-3">
											<label className="[font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] uppercase">Points:</label>
											<input
												type="number"
												className="w-20 py-1.5 px-2 border border-[#d6d3d1] rounded text-base font-semibold text-center text-[#1c1917] focus:outline-none focus:border-[#1a3a2a]"
												value={scores[answer.questionId] ?? 0}
												onChange={e => setScores(prev => ({ ...prev, [answer.questionId]: parseInt(e.target.value) || 0 }))}
												min="0"
												max={answer.question?.points ?? 100}
											/>
											<span className="[font-family:var(--font-outfit)] text-sm text-[#78716c]">/ {answer.question?.points ?? '?'} pts</span>
										</div>
									</div>
								)) : (
									<p className="[font-family:var(--font-serif)] text-sm text-[#a8a29e] text-center py-8">No answers to grade.</p>
								)}
							</div>

							{submitError && <p className="[font-family:var(--font-outfit)] text-xs text-red-500">{submitError}</p>}

							<div className="flex justify-end gap-3">
								<button
									onClick={handleSubmitGrades}
									disabled={isSubmitting || answers.length === 0}
									className="py-2.5 px-8 bg-[#1a3a2a] text-white border-none rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#132d20] disabled:opacity-50"
								>
									{isSubmitting ? 'Submitting…' : 'Submit Grades'}
								</button>
								<button
									onClick={() => navigate('/quiz-reviews')}
									className="py-2.5 px-6 bg-transparent text-[#44403c] border border-[#d6d3d1] rounded-lg [font-family:var(--font-outfit)] font-medium text-sm cursor-pointer transition-colors duration-200 hover:bg-[#f5f5f4]"
								>
									Cancel
								</button>
							</div>
						</div>

						<div className="sticky top-8">
							<div className="bg-white border border-[#e7e5e4] rounded-xl p-6">
								<h3 className="[font-family:var(--font-outfit)] mt-0 mb-5 text-base font-semibold text-[#1c1917] border-b border-[#f5f5f4] pb-3">Attempt Summary</h3>

								{[
									['Guide',     guideName],
									['Module',    attempt.quiz?.module?.title ?? '—'],
									['Quiz',      attempt.quiz?.title ?? '—'],
									['Submitted', new Date(attempt.submittedAt).toLocaleDateString()],
								].map(([label, value]) => (
									<div key={label} className="flex justify-between mb-4">
										<span className="[font-family:var(--font-outfit)] text-sm text-[#78716c] font-medium">{label}</span>
										<span className="[font-family:var(--font-outfit)] text-sm text-[#1c1917] font-semibold text-right max-w-35">{value}</span>
									</div>
								))}

								<div className="h-px bg-[#f5f5f4] my-4" />

								<p className="[font-family:var(--font-outfit)] text-xs text-[#78716c] leading-[1.5] m-0">
									Review each answer carefully before submitting. Grades will be saved and the guide will be notified.
								</p>
							</div>
						</div>

					</div>
				</main>
			</div>
		</div>
	)
}
