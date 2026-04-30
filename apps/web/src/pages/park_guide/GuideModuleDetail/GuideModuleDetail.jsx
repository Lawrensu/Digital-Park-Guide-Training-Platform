import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as modulesApi from '../../../api/modules.js'
import * as enrolmentsApi from '../../../api/enrolments.js'


const ITEM_TYPE_ICON = {
	VIDEO:       '🎥',
	TEXT:        '📖',
	DOCUMENT:    '📄',
	INFOGRAPHIC: '🖼️',
	QUIZ:        '❓',
}


const GuideModuleDetail = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { data: module, isLoading: moduleLoading } = useQuery({
		queryKey: ['modules', id],
		queryFn: async () => {
			const res = await modulesApi.getOne(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: contentItems, isLoading: contentLoading } = useQuery({
		queryKey: ['modules', id, 'content'],
		queryFn: async () => {
			const res = await modulesApi.getContent(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: enrolment } = useQuery({
		queryKey: ['enrolments', 'me', id],
		queryFn: async () => {
			try {
				const res = await enrolmentsApi.getMyEnrolmentForModule(id)
				return res.data.data
			} catch (err) {
				if (err.response?.status === 404) return null
				throw err
			}
		},
		enabled: !!id,
	})

	const enrolMutation = useMutation({
		mutationFn: () => enrolmentsApi.enrol(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['enrolments', 'me'] })
			queryClient.invalidateQueries({ queryKey: ['enrolments', 'me', id] })
		},
	})

	const items       = contentItems ?? []
	const progress    = enrolment?.progressPct ?? 0
	const totalItems  = items.length
	const doneItems   = Math.round((progress / 100) * totalItems)
	const isEnrolled  = !!enrolment

	const handleItemClick = (item) => {
		if (!isEnrolled) return
		if (item.type === 'QUIZ' && item.quizId) {
			navigate(`/guide/quiz/${item.quizId}`)
		} else {
			navigate(`/guide/modules/${id}/content/${item.id}`)
		}
	}

	const isLoading = moduleLoading || contentLoading

	if (isLoading) {
		return (
			<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
				<GuideNavbar />
				<main className="flex-1 p-8 box-border">
					<p className="text-center py-12 text-[#666666]">Loading module…</p>
				</main>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-8 box-border">

				<div className="mb-8 flex items-center justify-between">
					<h1 className="text-[2rem] font-bold text-[#333333] m-0">{module?.title ?? '—'}</h1>
					{!isEnrolled && (
						<button
							onClick={() => enrolMutation.mutate()}
							disabled={enrolMutation.isPending}
							className="py-2 px-6 bg-[#2E7D32] text-white border-0 rounded-[8px] text-[0.95rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#1B5E20] disabled:opacity-50"
						>
							{enrolMutation.isPending ? 'Enrolling…' : 'Enrol in Module'}
						</button>
					)}
				</div>

				{enrolMutation.isError && (
					<p className="text-red-500 text-[0.9rem] mb-4">
						{enrolMutation.error?.response?.data?.error?.message ?? 'Failed to enrol.'}
					</p>
				)}

				{isEnrolled && (
					<div className="bg-white py-6 px-8 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-8">
						<div className="flex justify-between items-center mb-4">
							<div className="text-[1.1rem] font-semibold text-[#333333]">Your Progress</div>
							<div className="text-[0.95rem] text-[#666666]">{doneItems} of {totalItems} items completed</div>
						</div>
						<div className="w-full h-3 bg-[#E0E0E0] rounded-[6px] overflow-hidden mb-3">
							<div className="h-full bg-[#2E7D32] rounded-[6px]" style={{ width: `${progress}%` }}></div>
						</div>
						<div className="text-[0.9rem] text-[#666666]">{progress}% complete</div>
					</div>
				)}

				<div className="grid grid-cols-[2fr_1fr] gap-8 items-start">

					<div className="flex flex-col gap-4">
						{!isEnrolled && (
							<div className="bg-[#FFF3E0] border-l-4 border-l-[#FFB74D] p-5 rounded-[4px] text-[#E65100] text-[0.9rem] leading-[1.5] flex gap-3 items-start mb-2">
								<div className="text-[1.25rem] shrink-0">🔒</div>
								<div>
									<strong>Enrol to access content.</strong> Click the Enrol button above to start this module.
								</div>
							</div>
						)}

						{items.map((item, index) => {
							const isDone   = isEnrolled && index < doneItems
							const isActive = isEnrolled && index === doneItems
							const isLocked = !isEnrolled

							return (
								<div
									key={item.id}
									onClick={() => handleItemClick(item)}
									className={`bg-white p-5 rounded-[8px] flex items-center gap-4 border border-[#E0E0E0] transition-all duration-200
										${isActive ? 'border-2 border-[#2E7D32] bg-[#F9FBF9]' : ''}
										${isDone ? 'opacity-70' : ''}
										${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#2E7D32] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'}
									`}
								>
									<div className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[1.25rem] shrink-0 ${isDone ? 'bg-[#E0E0E0] text-[#757575]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
										{ITEM_TYPE_ICON[item.type] ?? '📄'}
									</div>

									<div className="flex-1">
										<h4 className="text-[1rem] font-semibold text-[#333333] m-0 mb-1">{item.title}</h4>
										<div className="text-[0.8rem] text-[#666666]">{item.type}</div>
									</div>

									{isDone && <div className="text-[#2E7D32] text-[1.25rem]">✓</div>}
									{isLocked && <div className="text-[1.25rem]" style={{ color: '#ccc' }}>🔒</div>}
								</div>
							)
						})}
					</div>

					<div>

						<div className="bg-white p-6 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-6">
							<h3 className="text-[1.1rem] font-bold text-[#333333] m-0 mb-6 pb-3 border-b border-[#f0f0f0]">Module Info</h3>

							{module?.difficulty && (
								<div className="flex justify-between mb-4 text-[0.95rem]">
									<span className="text-[#666666]">Difficulty</span>
									<span className="font-semibold text-[#333333] text-right">{module.difficulty}</span>
								</div>
							)}

							{module?.station?.name && (
								<div className="flex justify-between mb-4 text-[0.95rem]">
									<span className="text-[#666666]">Station</span>
									<span className="font-semibold text-[#333333] text-right">{module.station.name}</span>
								</div>
							)}

							{module?.passScore != null && (
								<div className="flex justify-between mb-4 text-[0.95rem]">
									<span className="text-[#666666]">Pass Score</span>
									<span className="font-semibold text-[#333333] text-right">{module.passScore}%</span>
								</div>
							)}

							<div className="flex justify-between mb-4 text-[0.95rem]">
								<span className="text-[#666666]">Content Items</span>
								<span className="font-semibold text-[#333333] text-right">{totalItems}</span>
							</div>

							<div className="flex justify-between mb-4 text-[0.95rem]">
								<span className="text-[#666666]">Status</span>
								<span className={`font-semibold text-right ${isEnrolled ? 'text-[#2E7D32]' : 'text-[#666666]'}`}>
									{isEnrolled ? (enrolment.completedAt ? 'Completed' : 'Enrolled') : 'Not Enrolled'}
								</span>
							</div>
						</div>

						{isEnrolled && totalItems > 0 && (
							<div className="bg-[#FFF3E0] border-l-4 border-l-[#FFB74D] p-5 rounded-[4px] text-[#E65100] text-[0.9rem] leading-[1.5] flex gap-3 items-start">
								<div className="text-[1.25rem] shrink-0">⚠️</div>
								<div>
									<strong>Attention:</strong> You must complete all module content before attempting the Final Quiz.
								</div>
							</div>
						)}

					</div>

				</div>
			</main>
		</div>
	)
}

export default GuideModuleDetail
