import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as quizzesApi from '../../../api/quizzes.js'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


const TimerIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<circle cx="12" cy="12" r="10"></circle>
		<polyline points="12 6 12 12 16 14"></polyline>
	</svg>
)

const CheckCircleIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
		<polyline points="22 4 12 14.01 9 11.01"></polyline>
	</svg>
)


export default function GuideQuizPage() {
	const { quizId } = useParams()
	const navigate   = useNavigate()

	const { data: quiz, isLoading, error } = useQuery({
		queryKey: ['quizzes', quizId],
		queryFn: async () => {
			const res = await quizzesApi.getOne(quizId)
			return res.data.data
		},
		enabled: !!quizId,
	})

	const questions = quiz?.questions ?? []

	const totalSeconds = quiz?.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : 0
	const [timeLeft, setTimeLeft] = useState(totalSeconds)

	useEffect(() => {
		if (quiz?.timeLimitMinutes) setTimeLeft(quiz.timeLimitMinutes * 60)
	}, [quiz?.timeLimitMinutes])

	useEffect(() => {
		if (timeLeft <= 0) return
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) { clearInterval(timer); return 0 }
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(timer)
	}, [timeLeft > 0])

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${s < 10 ? '0' : ''}${s}`
	}

	const [answers, setAnswers] = useState({})

	const answeredCount = Object.values(answers).filter(v => v !== '' && v !== null && v !== undefined).length

	const setAnswer = (questionId, value) => {
		setAnswers(prev => ({ ...prev, [questionId]: value }))
	}

	const submitMutation = useMutation({
		mutationFn: () => {
			const responses = questions.map(q => {
				const answer = answers[q.id]
				if (q.type === 'MCQ' || q.type === 'TRUE_FALSE') {
					return { questionId: q.id, selectedOptionId: answer?.id ?? null, textResponse: null }
				}
				return { questionId: q.id, selectedOptionId: null, textResponse: String(answer ?? '') }
			})
			return quizAttemptsApi.submit({ quizId, responses })
		},
		onSuccess: (res) => {
			const attemptId = res.data.data?.id
			navigate(`/guide/quiz/${quizId}/result`, { state: { attemptId } })
		},
	})

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#f3f4f6] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
				<GuideNavbar />
				<main className="flex-1 p-8"><p className="text-center py-12 text-[#666666]">Loading quiz…</p></main>
			</div>
		)
	}

	if (error || !quiz) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#f3f4f6] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
				<GuideNavbar />
				<main className="flex-1 p-8"><p className="text-center py-12 text-red-500">Quiz not found.</p></main>
			</div>
		)
	}


	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#f3f4f6] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<div className="flex flex-col flex-1 overflow-hidden">
				<main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
					<header>
						<h1 className="text-[1.75rem] text-[#333333] font-bold">Quiz</h1>
					</header>

					<div className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e5e7eb] border-l-[5px] border-l-[#2E7D32] flex justify-between items-start flex-wrap gap-6">
						<div className="flex-1">
							<div className="text-[0.85rem] text-[#6b7280] mb-2">{quiz.module?.title ?? '—'}</div>
							<h2 className="m-0 mb-2 text-[1.75rem] text-[#111827] font-bold">{quiz.title}</h2>
							{quiz.module?.title && (
								<div className="inline-block bg-[#ecfdf5] text-[#059669] py-1 px-3 rounded-sm text-[0.85rem] font-semibold">{quiz.module.title}</div>
							)}
						</div>

						<div className="flex gap-6">
							{quiz.timeLimitMinutes && (
								<div className="flex flex-row items-center justify-center gap-2 py-3 px-6 bg-[#fef2f2] rounded-lg min-w-25 border border-[#fee2e2]">
									<TimerIcon />
									<span className={`font-mono text-[1.5rem] font-bold ${timeLeft < 60 ? 'text-[#dc2626]' : 'text-[#374151]'}`}>{formatTime(timeLeft)}</span>
								</div>
							)}
							<div className="flex flex-col items-center justify-center py-3 px-6 bg-[#f9fafb] rounded-lg min-w-25 border border-[#e5e7eb]">
								<span className="text-[0.75rem] text-[#6b7280] uppercase tracking-[0.05em] mb-1">Progress</span>
								<span className="text-[1.25rem] font-bold text-[#111827]">{answeredCount} / {questions.length}</span>
							</div>
						</div>
					</div>

					{submitMutation.isError && (
						<p className="text-red-500 text-[0.9rem] bg-[#fef2f2] py-3 px-4 rounded-md">
							{submitMutation.error?.response?.data?.error?.message ?? 'Failed to submit quiz. Please try again.'}
						</p>
					)}

					<div className="flex flex-col gap-6">
						{questions.map((q, index) => {
							const answer    = answers[q.id]
							const answered  = answer !== undefined && answer !== '' && answer !== null
							const options   = q.options ?? []

							return (
								<div
									key={q.id}
									className={`bg-white rounded-lg p-8 border border-[#e5e7eb] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[border-color] duration-200 ${answered ? 'border-l-[5px] border-l-[#10b981]' : ''}`}
								>
									<div className="flex justify-between items-center mb-4 pb-3 border-b border-[#f3f4f6]">
										<div className="text-[0.9rem] font-bold text-[#6b7280]">Question {index + 1}</div>
										<div className="flex items-center gap-3">
											<div className="text-[0.75rem] bg-[#e5e7eb] text-[#374151] py-0.5 px-2 rounded-sm font-semibold">{q.type}</div>
											{q.points != null && <div className="text-[0.75rem] text-[#6b7280]">{q.points} pts</div>}
											{answered && <CheckCircleIcon />}
										</div>
									</div>

									<h4 className="m-0 mb-6 text-[1.1rem] text-[#1f2937] leading-[1.6]">{q.text}</h4>

									<div className="mt-4">
										{(q.type === 'MCQ' || q.type === 'TRUE_FALSE') && (
											<div className={q.type === 'TRUE_FALSE' ? 'flex gap-4' : 'grid grid-cols-1 gap-2.5'}>
												{options.map((opt, i) => (
													<label
														key={i}
														className={`flex items-center gap-3 py-3 px-4 border border-[#d1d5db] rounded-md cursor-pointer transition-all duration-200
															${q.type === 'TRUE_FALSE' ? 'flex-1 justify-center font-semibold text-[#4b5563]' : ''}
															${answer?.id === opt.id
																? (q.type === 'TRUE_FALSE' ? 'bg-[#2E7D32] border-[#2E7D32] text-white' : 'bg-[#ecfdf5] border-[#10b981] text-[#064e3b] font-medium')
																: 'hover:bg-[#f9fafb] hover:border-[#9ca3af]'}
														`}
													>
														<input
															type="radio"
															name={`q-${q.id}`}
															checked={answer?.id === opt.id}
															onChange={() => setAnswer(q.id, opt)}
															className="accent-[#2E7D32] w-4.5 h-4.5"
														/>
														<span>{opt.text}</span>
													</label>
												))}
											</div>
										)}

										{(q.type === 'SHORT_ANSWER' || q.type === 'LONG_ANSWER') && (
											<textarea
												className="w-full p-3 border border-[#d1d5db] rounded-md text-[1rem] font-[inherit] resize-y focus:outline-none focus:border-[#2E7D32] focus:shadow-[0_0_0_2px_rgba(46,125,50,0.1)]"
												rows={q.type === 'LONG_ANSWER' ? 6 : 3}
												placeholder="Type your answer here..."
												value={answers[q.id] ?? ''}
												onChange={(e) => setAnswer(q.id, e.target.value)}
											/>
										)}
									</div>
								</div>
							)
						})}
					</div>

					<div className="bg-white py-6 px-8 rounded-lg shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border border-[#e5e7eb] flex justify-between items-center mt-auto">
						<div className="flex items-center gap-4 text-[#6b7280] text-[0.9rem]">
							<span>Total Questions: {questions.length}</span>
							<span className="text-[#d1d5db]">|</span>
							<span>Answered: {answeredCount}</span>
						</div>
						<button
							onClick={() => submitMutation.mutate()}
							disabled={submitMutation.isPending}
							className="py-3 px-8 bg-[#2E7D32] text-white border-0 rounded-md font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitMutation.isPending ? 'Submitting…' : 'Submit Quiz'}
						</button>
					</div>

				</main>
			</div>
		</div>
	)
}
