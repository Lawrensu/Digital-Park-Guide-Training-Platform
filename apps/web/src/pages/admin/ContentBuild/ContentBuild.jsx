import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as modulesApi from '../../../api/modules.js'
import * as contentItemsApi from '../../../api/contentItems.js'
import * as quizzesApi from '../../../api/quizzes.js'
import * as uploadsApi from '../../../api/uploads.js'


const TYPE_BADGE = {
	TEXT:        'bg-[#2196F3]',
	IMAGE:       'bg-[#4CAF50]',
	VIDEO:       'bg-[#F44336]',
	INFOGRAPHIC: 'bg-[#FF9800]',
	QUIZ:        'bg-[#9C27B0]',
	DOCUMENT:    'bg-[#607D8B]',
}

const CONTENT_TYPES = ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'QUIZ']

const QUESTION_TYPES = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER']


function AddItemModal({ moduleId, onClose, onSaved }) {
	const [step,       setStep]       = useState('pick')
	const [type,       setType]       = useState(null)
	const [title,      setTitle]      = useState('')
	const [body,       setBody]       = useState('')
	const [mediaFile,  setMediaFile]  = useState(null)
	const [uploading,  setUploading]  = useState(false)
	const [error,      setError]      = useState('')

	const [quiz,         setQuiz]         = useState({ title: '', timeLimitMinutes: '', passScorePct: '' })
	const [questions,    setQuestions]    = useState([])
	const [quizSaving,   setQuizSaving]   = useState(false)

	const handlePickType = (t) => { setType(t); setStep('fill') }

	const uploadMedia = async (folder) => {
		if (!mediaFile) return null
		const presignRes = await uploadsApi.presign(mediaFile.name, mediaFile.type, folder)
		const { uploadUrl, key } = presignRes.data.data
		await uploadsApi.uploadToS3(uploadUrl, mediaFile)
		return key
	}

	const handleSaveItem = async () => {
		if (!title.trim()) { setError('Title is required.'); return }
		setError('')
		setUploading(true)
		try {
			let payload = { type, title: title.trim() }
			if (type === 'TEXT' || type === 'DOCUMENT') {
				payload.body = body
			} else if (type === 'IMAGE' || type === 'VIDEO') {
				const key = await uploadMedia(type.toLowerCase())
				if (key) payload.mediaS3Key = key
			}
			await modulesApi.addContent(moduleId, payload)
			onSaved()
		} catch (err) {
			setError(err.response?.data?.error?.message ?? 'Failed to save.')
		} finally {
			setUploading(false)
		}
	}

	const handleSaveQuiz = async () => {
		if (!quiz.title.trim()) { setError('Quiz title is required.'); return }
		setError('')
		setQuizSaving(true)
		try {
			const quizRes = await quizzesApi.create({
				moduleId,
				title:            quiz.title.trim(),
				timeLimitMinutes: quiz.timeLimitMinutes ? Number(quiz.timeLimitMinutes) : null,
				passScorePct:     quiz.passScorePct     ? Number(quiz.passScorePct)     : null,
			})
			const quizId = quizRes.data.data.id

			for (const q of questions) {
				await quizzesApi.addQuestion(quizId, {
					text:    q.text,
					type:    q.type,
					points:  q.points ? Number(q.points) : null,
					options: (q.type === 'MCQ') ? q.options.filter(o => o.trim()) : undefined,
					correctAnswer: (q.type === 'MCQ' || q.type === 'TRUE_FALSE') ? q.correctAnswer : undefined,
				})
			}

			await modulesApi.addContent(moduleId, {
				type: 'QUIZ',
				title: quiz.title.trim(),
				quizId,
			})
			onSaved()
		} catch (err) {
			setError(err.response?.data?.error?.message ?? 'Failed to save quiz.')
		} finally {
			setQuizSaving(false)
		}
	}

	const addQuestion = () => setQuestions(prev => [...prev, { text: '', type: 'MCQ', points: '', options: ['', '', '', ''], correctAnswer: '' }])
	const removeQuestion = (i) => setQuestions(prev => prev.filter((_, idx) => idx !== i))
	const updateQuestion = (i, field, val) => setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q))
	const updateOption = (qi, oi, val) => setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q))

	return (
		<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
					<h2 className="text-[1rem] font-semibold text-[#111827]">
						{step === 'pick' ? 'Add Content Item' : `Add ${type}`}
					</h2>
					<button onClick={onClose} className="text-[#6b7280] text-xl leading-none bg-transparent border-0 cursor-pointer hover:text-[#111827]">×</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{step === 'pick' && (
						<div className="grid grid-cols-3 gap-3">
							{CONTENT_TYPES.map(t => (
								<button
									key={t}
									onClick={() => handlePickType(t)}
									className="flex flex-col items-center gap-2 py-5 px-3 border border-[#d1d5db] rounded-lg cursor-pointer transition-all duration-150 hover:border-[#2E7D32] hover:bg-[#f0fdf4] bg-white"
								>
									<span className={`text-[0.65rem] font-bold py-[3px] px-2 rounded text-white ${TYPE_BADGE[t]}`}>{t}</span>
									<span className="text-[0.82rem] text-[#374151] font-medium">{t.charAt(0) + t.slice(1).toLowerCase()}</span>
								</button>
							))}
						</div>
					)}

					{step === 'fill' && type !== 'QUIZ' && (
						<div className="flex flex-col gap-4">
							<div>
								<label className="block text-sm font-medium text-[#374151] mb-1">Title <span className="text-red-500">*</span></label>
								<input
									value={title}
									onChange={e => setTitle(e.target.value)}
									className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32]"
									placeholder="Content item title"
								/>
							</div>
							{(type === 'TEXT' || type === 'DOCUMENT') && (
								<div>
									<label className="block text-sm font-medium text-[#374151] mb-1">Body</label>
									<textarea
										value={body}
										onChange={e => setBody(e.target.value)}
										rows={8}
										className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32] resize-y"
										placeholder="Write content here…"
									/>
								</div>
							)}
							{(type === 'IMAGE' || type === 'VIDEO') && (
								<div>
									<label className="block text-sm font-medium text-[#374151] mb-1">
										{type === 'IMAGE' ? 'Image file (PNG/JPG/WebP)' : 'Video file'}
									</label>
									<input
										type="file"
										accept={type === 'IMAGE' ? 'image/*' : 'video/*'}
										onChange={e => setMediaFile(e.target.files[0] ?? null)}
										className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm"
									/>
								</div>
							)}
						</div>
					)}

					{step === 'fill' && type === 'QUIZ' && (
						<div className="flex flex-col gap-5">
							<div className="grid grid-cols-3 gap-3">
								<div className="col-span-3">
									<label className="block text-sm font-medium text-[#374151] mb-1">Quiz Title <span className="text-red-500">*</span></label>
									<input
										value={quiz.title}
										onChange={e => setQuiz(q => ({ ...q, title: e.target.value }))}
										className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32]"
										placeholder="e.g. Module Assessment"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-[#374151] mb-1">Time Limit (min)</label>
									<input
										type="number" min="1"
										value={quiz.timeLimitMinutes}
										onChange={e => setQuiz(q => ({ ...q, timeLimitMinutes: e.target.value }))}
										className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32]"
										placeholder="Optional"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-[#374151] mb-1">Pass Score (%)</label>
									<input
										type="number" min="0" max="100"
										value={quiz.passScorePct}
										onChange={e => setQuiz(q => ({ ...q, passScorePct: e.target.value }))}
										className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32]"
										placeholder="Optional"
									/>
								</div>
							</div>

							<div className="border-t border-[#e5e7eb] pt-4">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-semibold text-[#111827]">Questions ({questions.length})</span>
									<button
										onClick={addQuestion}
										className="text-sm text-[#2E7D32] font-medium bg-transparent border-0 cursor-pointer hover:underline"
									>
										+ Add Question
									</button>
								</div>

								{questions.map((q, qi) => (
									<div key={qi} className="border border-[#e5e7eb] rounded-lg p-4 mb-3">
										<div className="flex items-start justify-between gap-3 mb-3">
											<span className="text-xs font-semibold text-[#6b7280] mt-1">Q{qi + 1}</span>
											<textarea
												value={q.text}
												onChange={e => updateQuestion(qi, 'text', e.target.value)}
												rows={2}
												className="flex-1 border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32] resize-y"
												placeholder="Question text"
											/>
											<button onClick={() => removeQuestion(qi)} className="text-[#dc2626] text-lg leading-none bg-transparent border-0 cursor-pointer">×</button>
										</div>
										<div className="flex gap-3 mb-3">
											<div className="flex-1">
												<label className="block text-xs font-medium text-[#6b7280] mb-1">Type</label>
												<select
													value={q.type}
													onChange={e => updateQuestion(qi, 'type', e.target.value)}
													className="w-full border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
												>
													{QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
												</select>
											</div>
											<div className="w-24">
												<label className="block text-xs font-medium text-[#6b7280] mb-1">Points</label>
												<input
													type="number" min="0"
													value={q.points}
													onChange={e => updateQuestion(qi, 'points', e.target.value)}
													className="w-full border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
													placeholder="e.g. 10"
												/>
											</div>
										</div>
										{q.type === 'MCQ' && (
											<div className="flex flex-col gap-1.5">
												<label className="text-xs font-medium text-[#6b7280]">Options (mark correct with ✓)</label>
												{q.options.map((opt, oi) => (
													<div key={oi} className="flex items-center gap-2">
														<input
															type="radio"
															name={`correct-${qi}`}
															checked={q.correctAnswer === opt && opt.trim() !== ''}
															onChange={() => updateQuestion(qi, 'correctAnswer', opt)}
															className="accent-[#2E7D32]"
														/>
														<input
															value={opt}
															onChange={e => updateOption(qi, oi, e.target.value)}
															className="flex-1 border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
															placeholder={`Option ${oi + 1}`}
														/>
													</div>
												))}
											</div>
										)}
										{q.type === 'TRUE_FALSE' && (
											<div className="flex gap-4">
												{['True', 'False'].map(opt => (
													<label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
														<input
															type="radio"
															name={`correct-${qi}`}
															checked={q.correctAnswer === opt}
															onChange={() => updateQuestion(qi, 'correctAnswer', opt)}
															className="accent-[#2E7D32]"
														/>
														{opt}
													</label>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{error && <p className="mt-3 text-sm text-red-500">{error}</p>}
				</div>

				<div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-end gap-3">
					{step === 'fill' && (
						<button
							onClick={() => { setStep('pick'); setType(null); setError('') }}
							className="px-4 py-2 border border-[#d1d5db] rounded-lg text-sm bg-white hover:bg-[#f9fafb] cursor-pointer"
						>
							← Back
						</button>
					)}
					<button
						onClick={onClose}
						className="px-4 py-2 border border-[#d1d5db] rounded-lg text-sm bg-white hover:bg-[#f9fafb] cursor-pointer"
					>
						Cancel
					</button>
					{step === 'fill' && (
						<button
							onClick={type === 'QUIZ' ? handleSaveQuiz : handleSaveItem}
							disabled={uploading || quizSaving}
							className="px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{(uploading || quizSaving) ? 'Saving…' : 'Save'}
						</button>
					)}
				</div>
			</div>
		</div>
	)
}


function EditItemModal({ item, onClose, onSaved }) {
	const [title, setTitle] = useState(item.title ?? '')
	const [body,  setBody]  = useState(item.body  ?? '')
	const [error, setError] = useState('')

	const saveMutation = useMutation({
		mutationFn: () => contentItemsApi.update(item.id, {
			title: title.trim(),
			body:  (item.type === 'TEXT' || item.type === 'DOCUMENT') ? body : undefined,
		}),
		onSuccess: () => onSaved(),
		onError:   (err) => setError(err.response?.data?.error?.message ?? 'Failed to update.'),
	})

	return (
		<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
					<h2 className="text-[1rem] font-semibold text-[#111827]">Edit Item</h2>
					<button onClick={onClose} className="text-[#6b7280] text-xl leading-none bg-transparent border-0 cursor-pointer hover:text-[#111827]">×</button>
				</div>
				<div className="p-6 flex flex-col gap-4">
					<div>
						<label className="block text-sm font-medium text-[#374151] mb-1">Title</label>
						<input
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32]"
						/>
					</div>
					{(item.type === 'TEXT' || item.type === 'DOCUMENT') && (
						<div>
							<label className="block text-sm font-medium text-[#374151] mb-1">Body</label>
							<textarea
								value={body}
								onChange={e => setBody(e.target.value)}
								rows={8}
								className="w-full border border-[#d1d5db] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2E7D32] resize-y"
							/>
						</div>
					)}
					{error && <p className="text-sm text-red-500">{error}</p>}
				</div>
				<div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-end gap-3">
					<button onClick={onClose} className="px-4 py-2 border border-[#d1d5db] rounded-lg text-sm bg-white hover:bg-[#f9fafb] cursor-pointer">Cancel</button>
					<button
						onClick={() => saveMutation.mutate()}
						disabled={saveMutation.isPending}
						className="px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#1B5E20] disabled:opacity-50"
					>
						{saveMutation.isPending ? 'Saving…' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	)
}


function EditQuizModal({ item, onClose, onSaved }) {
	const [error, setError] = useState('')

	const { data: quiz, isLoading } = useQuery({
		queryKey: ['quizzes', item.quizId],
		queryFn: async () => {
			const res = await quizzesApi.getOne(item.quizId)
			return res.data.data
		},
		enabled: !!item.quizId,
	})

	const [newQ, setNewQ] = useState({ text: '', type: 'MCQ', points: '', options: ['', '', '', ''], correctAnswer: '' })
	const [adding, setAdding] = useState(false)

	const queryClient = useQueryClient()

	const invalidate = () => queryClient.invalidateQueries({ queryKey: ['quizzes', item.quizId] })

	const deleteQMutation = useMutation({
		mutationFn: (questionId) => quizzesApi.removeQuestion(item.quizId, questionId),
		onSuccess: invalidate,
		onError: (err) => setError(err.response?.data?.error?.message ?? 'Failed to delete question.'),
	})

	const addQMutation = useMutation({
		mutationFn: () => quizzesApi.addQuestion(item.quizId, {
			text:          newQ.text,
			type:          newQ.type,
			points:        newQ.points ? Number(newQ.points) : null,
			options:       newQ.type === 'MCQ' ? newQ.options.filter(o => o.trim()) : undefined,
			correctAnswer: (newQ.type === 'MCQ' || newQ.type === 'TRUE_FALSE') ? newQ.correctAnswer : undefined,
		}),
		onSuccess: () => {
			invalidate()
			setNewQ({ text: '', type: 'MCQ', points: '', options: ['', '', '', ''], correctAnswer: '' })
			setAdding(false)
		},
		onError: (err) => setError(err.response?.data?.error?.message ?? 'Failed to add question.'),
	})

	const updateOption = (oi, val) => setNewQ(q => ({ ...q, options: q.options.map((o, j) => j === oi ? val : o) }))

	const questions = quiz?.questions ?? []

	return (
		<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
					<h2 className="text-[1rem] font-semibold text-[#111827]">Edit Quiz: {item.title}</h2>
					<button onClick={onClose} className="text-[#6b7280] text-xl leading-none bg-transparent border-0 cursor-pointer hover:text-[#111827]">×</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{isLoading && <p className="text-sm text-[#6b7280] text-center py-4">Loading questions…</p>}

					{!isLoading && questions.length === 0 && (
						<p className="text-sm text-[#6b7280] text-center py-4">No questions yet. Add one below.</p>
					)}

					{questions.map((q, qi) => (
						<div key={q.id} className="border border-[#e5e7eb] rounded-lg p-4 mb-3 flex justify-between items-start gap-3">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-xs font-bold text-[#6b7280]">Q{qi + 1}</span>
									<span className="text-[0.7rem] bg-[#e5e7eb] text-[#374151] px-2 py-0.5 rounded font-semibold">{q.type}</span>
									{q.points != null && <span className="text-[0.7rem] text-[#6b7280]">{q.points} pts</span>}
								</div>
								<p className="text-sm text-[#1f2937] leading-[1.5] m-0">{q.text}</p>
								{q.options?.length > 0 && (
									<ul className="mt-2 flex flex-col gap-1 list-none p-0 m-0">
										{q.options.map((opt, oi) => (
											<li key={oi} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-[#ecfdf5] text-[#065f46] font-semibold' : 'text-[#6b7280]'}`}>
												{opt === q.correctAnswer ? '✓ ' : ''}{ opt}
											</li>
										))}
									</ul>
								)}
							</div>
							<button
								onClick={() => deleteQMutation.mutate(q.id)}
								disabled={deleteQMutation.isPending}
								className="text-[#dc2626] text-lg leading-none bg-transparent border-0 cursor-pointer disabled:opacity-40 shrink-0"
								title="Delete question"
							>
								🗑️
							</button>
						</div>
					))}

					{adding && (
						<div className="border border-[#d1d5db] rounded-lg p-4 mt-2">
							<p className="text-xs font-semibold text-[#374151] mb-3">New Question</p>
							<textarea
								value={newQ.text}
								onChange={e => setNewQ(q => ({ ...q, text: e.target.value }))}
								rows={2}
								className="w-full border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32] resize-y mb-3"
								placeholder="Question text"
							/>
							<div className="flex gap-3 mb-3">
								<div className="flex-1">
									<label className="block text-xs font-medium text-[#6b7280] mb-1">Type</label>
									<select
										value={newQ.type}
										onChange={e => setNewQ(q => ({ ...q, type: e.target.value, correctAnswer: '' }))}
										className="w-full border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
									>
										{QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
									</select>
								</div>
								<div className="w-24">
									<label className="block text-xs font-medium text-[#6b7280] mb-1">Points</label>
									<input
										type="number" min="0"
										value={newQ.points}
										onChange={e => setNewQ(q => ({ ...q, points: e.target.value }))}
										className="w-full border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
										placeholder="e.g. 10"
									/>
								</div>
							</div>
							{newQ.type === 'MCQ' && (
								<div className="flex flex-col gap-1.5 mb-3">
									<label className="text-xs font-medium text-[#6b7280]">Options (select correct)</label>
									{newQ.options.map((opt, oi) => (
										<div key={oi} className="flex items-center gap-2">
											<input
												type="radio"
												name="new-correct"
												checked={newQ.correctAnswer === opt && opt.trim() !== ''}
												onChange={() => setNewQ(q => ({ ...q, correctAnswer: opt }))}
												className="accent-[#2E7D32]"
											/>
											<input
												value={opt}
												onChange={e => updateOption(oi, e.target.value)}
												className="flex-1 border border-[#d1d5db] rounded px-2 py-1 text-sm outline-none focus:border-[#2E7D32]"
												placeholder={`Option ${oi + 1}`}
											/>
										</div>
									))}
								</div>
							)}
							{newQ.type === 'TRUE_FALSE' && (
								<div className="flex gap-4 mb-3">
									{['True', 'False'].map(opt => (
										<label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
											<input type="radio" name="new-correct" checked={newQ.correctAnswer === opt} onChange={() => setNewQ(q => ({ ...q, correctAnswer: opt }))} className="accent-[#2E7D32]" />
											{opt}
										</label>
									))}
								</div>
							)}
							<div className="flex gap-2">
								<button
									onClick={() => addQMutation.mutate()}
									disabled={addQMutation.isPending || !newQ.text.trim()}
									className="px-4 py-1.5 bg-[#2E7D32] text-white rounded text-sm font-semibold cursor-pointer hover:bg-[#1B5E20] disabled:opacity-50"
								>
									{addQMutation.isPending ? 'Saving…' : 'Save Question'}
								</button>
								<button onClick={() => setAdding(false)} className="px-4 py-1.5 border border-[#d1d5db] rounded text-sm bg-white cursor-pointer hover:bg-[#f9fafb]">Cancel</button>
							</div>
						</div>
					)}

					{!adding && (
						<button
							onClick={() => setAdding(true)}
							className="mt-3 text-sm text-[#2E7D32] font-medium bg-transparent border-0 cursor-pointer hover:underline"
						>
							+ Add Question
						</button>
					)}

					{error && <p className="mt-3 text-sm text-red-500">{error}</p>}
				</div>

				<div className="px-6 py-4 border-t border-[#e5e7eb] flex justify-end">
					<button
						onClick={() => { onSaved(); onClose() }}
						className="px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#1B5E20]"
					>
						Done
					</button>
				</div>
			</div>
		</div>
	)
}


export default function ContentBuilderPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const [showAddModal,  setShowAddModal]  = useState(false)
	const [editItem,      setEditItem]      = useState(null)
	const [deleteConfirm, setDeleteConfirm] = useState(null)
	const [reordering,    setReordering]    = useState(false)
	const [orderedIds,    setOrderedIds]    = useState(null)

	const { data: module } = useQuery({
		queryKey: ['modules', id],
		queryFn: async () => {
			const res = await modulesApi.getOne(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: contentData, isLoading } = useQuery({
		queryKey: ['modules', id, 'content'],
		queryFn: async () => {
			const res = await modulesApi.getContent(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const items = orderedIds
		? (orderedIds.map(oid => (contentData ?? []).find(it => it.id === oid)).filter(Boolean))
		: (contentData ?? [])

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ['modules', id, 'content'] })
		setOrderedIds(null)
	}

	const deleteMutation = useMutation({
		mutationFn: (itemId) => contentItemsApi.remove(itemId),
		onSuccess: () => { invalidate(); setDeleteConfirm(null) },
	})

	const reorderMutation = useMutation({
		mutationFn: (ids) => modulesApi.reorderContent(id, ids),
		onSuccess: () => { invalidate(); setReordering(false) },
	})

	const moveItem = (index, dir) => {
		const base = orderedIds ?? items.map(it => it.id)
		const next = [...base]
		const swap = index + dir
		if (swap < 0 || swap >= next.length) return
		;[next[index], next[swap]] = [next[swap], next[index]]
		setOrderedIds(next)
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#f3f4f6]">
			<Navbar />

			<div className="flex flex-col flex-1 overflow-hidden">

				<header className="flex items-center justify-between px-4 sm:px-8 h-16 bg-white border-b border-[#e5e7eb]">
					<h1 className="text-xl font-semibold text-[#111827] m-0">Content Builder</h1>
				</header>

				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

					<div className="flex justify-between items-center mb-6">
						<button
							className="bg-transparent border-none text-[#4b5563] text-[0.9rem] cursor-pointer p-0 hover:text-[#111827] hover:underline"
							onClick={() => navigate('/modules')}
						>
							← Back to Modules
						</button>
						{module && (
							<span className="text-[0.85rem] text-[#6b7280]">
								{module.title} — {items.length} item{items.length !== 1 ? 's' : ''}
							</span>
						)}
					</div>

					<div className="flex gap-6 items-start">

						<div className="flex-1">
							<div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e5e7eb] overflow-hidden">
								<div className="flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6] bg-[#f9fafb]">
									<h3 className="m-0 text-[0.95rem] text-[#374151] font-semibold">Module Content</h3>
									{reordering ? (
										<div className="flex gap-2">
											<button
												onClick={() => reorderMutation.mutate(orderedIds ?? items.map(it => it.id))}
												disabled={reorderMutation.isPending || !orderedIds}
												className="text-[0.82rem] font-semibold text-white bg-[#2E7D32] border-0 rounded px-3 py-1 cursor-pointer hover:bg-[#1B5E20] disabled:opacity-50"
											>
												{reorderMutation.isPending ? 'Saving…' : 'Save Order'}
											</button>
											<button
												onClick={() => { setReordering(false); setOrderedIds(null) }}
												className="text-[0.82rem] text-[#6b7280] bg-transparent border border-[#d1d5db] rounded px-3 py-1 cursor-pointer hover:bg-[#f3f4f6]"
											>
												Cancel
											</button>
										</div>
									) : (
										<button
											onClick={() => setReordering(true)}
											className="bg-transparent border-none text-[#2563eb] text-[0.85rem] cursor-pointer font-medium hover:underline"
										>
											Reorder
										</button>
									)}
								</div>

								{isLoading && (
									<p className="text-center py-10 text-[#6b7280] text-sm">Loading content…</p>
								)}

								{!isLoading && items.length === 0 && (
									<p className="text-center py-10 text-[#6b7280] text-sm">No content yet. Add your first item →</p>
								)}

								<div className="flex flex-col">
									{items.map((item, index) => (
										<div key={item.id} className="group flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6] transition-colors duration-150 last:border-b-0 hover:bg-[#fafafa]">
											<div className="flex items-start gap-3">
												{reordering && (
													<div className="flex flex-col gap-0.5 mr-1">
														<button onClick={() => moveItem(index, -1)} className="text-[#9ca3af] text-xs bg-transparent border-0 cursor-pointer hover:text-[#374151] leading-none">▲</button>
														<button onClick={() => moveItem(index, 1)}  className="text-[#9ca3af] text-xs bg-transparent border-0 cursor-pointer hover:text-[#374151] leading-none">▼</button>
													</div>
												)}
												<span className="text-[#9ca3af] text-[0.9rem] mt-0.5 min-w-5">{index + 1}.</span>
												<div className="flex flex-col gap-1.5">
													<h4 className="m-0 text-[0.95rem] text-[#111827] font-medium leading-[1.4]">{item.title}</h4>
													<span className={`inline-block text-[0.7rem] font-bold py-[3px] px-2 rounded w-fit text-white tracking-[0.3px] uppercase ${TYPE_BADGE[item.type] ?? 'bg-[#607D8B]'}`}>
														{item.type}
													</span>
												</div>
											</div>

											{!reordering && (
												<div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
													<button
														onClick={() => setEditItem(item)}
														className="border-none bg-transparent p-1.5 rounded cursor-pointer transition-colors duration-200 hover:bg-[#eff6ff] hover:text-[#2563eb] text-[#374151]"
														title="Edit"
													>
														✏️
													</button>
													<button
														onClick={() => setDeleteConfirm(item)}
														className="border-none bg-transparent p-1.5 rounded cursor-pointer transition-colors duration-200 hover:bg-[#fef2f2] hover:text-[#dc2626] text-[#374151]"
														title="Delete"
													>
														🗑️
													</button>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="w-70 shrink-0 sticky top-0">
							<div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e5e7eb] border-l-[5px] border-l-[#2E7D32] p-6">
								<h3 className="mt-0 mb-2 text-[1rem] text-[#111827] font-semibold">Add Content</h3>
								<p className="mt-0 mb-5 text-[0.85rem] text-[#6b7280] leading-[1.5]">
									Select a content type to add to this module.
								</p>
								<button
									onClick={() => setShowAddModal(true)}
									className="w-full py-3 px-4 bg-[#2E7D32] text-white border-0 rounded-lg text-[0.9rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#1B5E20]"
								>
									+ Add Item
								</button>
							</div>
						</div>

					</div>
				</main>
			</div>

			{showAddModal && (
				<AddItemModal
					moduleId={id}
					onClose={() => setShowAddModal(false)}
					onSaved={() => { setShowAddModal(false); invalidate() }}
				/>
			)}

			{editItem && editItem.type === 'QUIZ' && editItem.quizId && (
				<EditQuizModal
					item={editItem}
					onClose={() => setEditItem(null)}
					onSaved={() => { setEditItem(null); invalidate() }}
				/>
			)}

			{editItem && editItem.type !== 'QUIZ' && (
				<EditItemModal
					item={editItem}
					onClose={() => setEditItem(null)}
					onSaved={() => { setEditItem(null); invalidate() }}
				/>
			)}

			{deleteConfirm && (
				<div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
						<h3 className="text-[1rem] font-semibold text-[#111827] mb-2">Delete Item?</h3>
						<p className="text-sm text-[#6b7280] mb-5">
							<strong>{deleteConfirm.title}</strong> will be permanently removed from this module.
						</p>
						{deleteMutation.isError && (
							<p className="text-sm text-red-500 mb-3">{deleteMutation.error?.response?.data?.error?.message ?? 'Failed to delete.'}</p>
						)}
						<div className="flex justify-end gap-3">
							<button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-[#d1d5db] rounded-lg text-sm bg-white hover:bg-[#f9fafb] cursor-pointer">Cancel</button>
							<button
								onClick={() => deleteMutation.mutate(deleteConfirm.id)}
								disabled={deleteMutation.isPending}
								className="px-5 py-2 bg-[#dc2626] text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#b91c1c] disabled:opacity-50"
							>
								{deleteMutation.isPending ? 'Deleting…' : 'Delete'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
