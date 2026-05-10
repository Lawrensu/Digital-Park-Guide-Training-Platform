import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


export default function GuideQuizResult() {
	const { quizId }   = useParams()
	const navigate     = useNavigate()
	const location     = useLocation()
	const attemptId    = location.state?.attemptId

	const { data: attempt, isLoading, error } = useQuery({
		queryKey: ['quiz-attempts', attemptId ?? `quiz-${quizId}-latest`],
		queryFn: async () => {
			if (attemptId) {
				const res = await quizAttemptsApi.getOne(attemptId)
				return res.data.data
			}
			const res = await quizAttemptsApi.getAll()
			const all = res.data.data ?? []
			const forThisQuiz = all.filter(a => a.quizId === quizId || a.quiz?.id === quizId)
			return forThisQuiz[forThisQuiz.length - 1] ?? null
		},
		enabled: !!(attemptId || quizId),
	})

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
					<div className="max-w-xl mx-auto">
						<p className="text-center py-12 text-[#5a7a6a] font-outfit">Loading result…</p>
					</div>
				</main>
			</div>
		)
	}

	if (error || !attempt) {
		return (
			<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
				<GuideNavbar />
				<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
					<div className="max-w-xl mx-auto bg-white rounded-xl border border-[#d4e4da] p-6 sm:p-10 text-center mt-8">
						<div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-5">
							<span className="text-4xl">✅</span>
						</div>
						<h1 className="font-outfit text-2xl font-bold text-[#1a3a2a] mb-2">Quiz Submitted</h1>
						<p className="font-outfit text-sm text-[#5a7a6a] mb-8">
							Your answers have been submitted and are pending review. Check back later for your grade.
						</p>
						<div className="flex flex-col gap-3">
							<button
								onClick={() => navigate('/guide/modules')}
								className="w-full py-3 bg-[#266841] text-white font-outfit text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors"
							>
								Back to Modules
							</button>
							<button
								onClick={() => navigate('/guide/home')}
								className="w-full py-3 border border-[#d4e4da] text-[#5a7a6a] font-outfit text-sm rounded-lg hover:bg-[#f0f4f1] transition-colors"
							>
								Go to Dashboard
							</button>
						</div>
					</div>
				</main>
			</div>
		)
	}

	const isPendingReview   = attempt.status === 'PENDING_REVIEW'
	const isGraded          = attempt.status === 'GRADED'
	const questionAttempts  = attempt.questionAttempts ?? []
	const totalScore        = attempt.totalScore ?? 0
	const maxTotal          = questionAttempts.reduce((sum, qa) => sum + (qa.question?.maxScore ?? 0), 0)
	const passMark          = Math.round(maxTotal * ((attempt.quiz?.passScorePct ?? 70) / 100))
	const isPassed          = maxTotal > 0 ? totalScore >= passMark : null

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-[#f0f4f1] overflow-hidden">
			<GuideNavbar />

			<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
				<div className="max-w-2xl mx-auto flex flex-col gap-6">

					<button
						onClick={() => navigate('/guide/modules')}
						className="flex items-center gap-2 text-[#5a7a6a] font-outfit text-sm hover:text-[#1a3a2a] transition-colors bg-transparent border-0 cursor-pointer self-start"
					>
						← Back to Modules
					</button>

					<div className="bg-white rounded-xl border border-[#d4e4da] p-5 sm:p-8 text-center">
						<div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isPendingReview ? 'bg-[#FFF3E0]' : isPassed ? 'bg-[#e8f5ee]' : 'bg-[#ffebee]'}`}>
							<span className="text-4xl">
								{isPendingReview ? '⏳' : isPassed ? '🏆' : '📝'}
							</span>
						</div>

						<h1 className="font-outfit text-2xl font-bold text-[#1a3a2a] mb-1">
							{attempt.quiz?.title ?? 'Quiz'}
						</h1>
						<p className="font-outfit text-sm text-[#5a7a6a] mb-5">
							{attempt.quiz?.module?.title ?? '—'}
						</p>

						{isPendingReview && (
							<div className="inline-flex items-center gap-2 bg-[#FFF3E0] text-[#E65100] py-2 px-4 rounded-full font-outfit text-sm font-semibold mb-4">
								⏳ Awaiting Review
							</div>
						)}

						{isGraded && (
							<div className="flex justify-center gap-8 mb-6">
								<div className="text-center">
									<div className="font-outfit text-4xl font-bold text-[#1a3a2a]">
										{totalScore}
										<span className="text-xl text-[#78716c] font-normal"> / {passMark} pass</span>
									</div>
									<div className="font-outfit text-sm text-[#78716c] mt-1">Your Score</div>
								</div>
								{isPassed != null && (
									<div className="text-center">
										<div className={`inline-flex items-center gap-2 py-2 px-4 rounded-full font-outfit text-sm font-bold ${isPassed ? 'bg-[#e8f5ee] text-[#266841]' : 'bg-[#ffebee] text-[#d32f2f]'}`}>
											{isPassed ? '✓ PASS' : '✗ FAIL'}
										</div>
									</div>
								)}
							</div>
						)}

						<div className="flex flex-col gap-2.5 mt-2">
							{isGraded && isPassed && (
								<button
									onClick={() => navigate('/guide/certifications')}
									className="w-full py-3 bg-[#266841] text-white font-outfit text-sm font-medium rounded-lg hover:bg-[#1f5435] transition-colors"
								>
									View My Certificates
								</button>
							)}
							<button
								onClick={() => navigate('/guide/quizzes')}
								className="w-full py-3 border border-[#d4e4da] text-[#5a7a6a] font-outfit text-sm rounded-lg hover:bg-[#f0f4f1] transition-colors"
							>
								All My Attempts
							</button>
							<button
								onClick={() => navigate('/guide/home')}
								className="w-full py-3 border border-[#d4e4da] text-[#5a7a6a] font-outfit text-sm rounded-lg hover:bg-[#f0f4f1] transition-colors"
							>
								Go to Dashboard
							</button>
						</div>
					</div>

					{isGraded && questionAttempts.length > 0 && (
						<div className="flex flex-col gap-3">
							<h2 className="font-outfit text-base font-semibold text-[#1a3a2a] m-0">Answer Review</h2>
							{questionAttempts.map((qa, i) => (
								<div key={qa.id} className="bg-white rounded-xl border border-[#d4e4da] p-5">
									<div className="flex justify-between items-start mb-3">
										<span className="font-outfit text-xs font-semibold text-[#78716c] uppercase">Q{i + 1}</span>
										{qa.scoreAwarded != null && (
											<span className="font-outfit text-xs bg-[#e8f5ee] text-[#266841] py-0.5 px-2 rounded-full font-semibold">
												{qa.scoreAwarded} / {qa.question?.maxScore ?? '?'} pts
											</span>
										)}
									</div>
									<p className="font-outfit text-sm font-medium text-[#1a3a2a] mb-2 m-0">
										{qa.question?.text ?? '—'}
									</p>
									<div className="bg-[#f5f5f4] rounded-lg p-3">
										<p className="font-outfit text-xs text-[#78716c] mb-1 m-0 uppercase font-semibold">Your answer</p>
										<p className="font-outfit text-sm text-[#44403c] m-0">
											{qa.textResponse ?? qa.selectedOption?.text ?? '—'}
										</p>
									</div>
								</div>
							))}
						</div>
					)}

				</div>
			</main>
		</div>
	)
}
