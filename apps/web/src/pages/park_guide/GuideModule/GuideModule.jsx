import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as modulesApi from '../../../api/modules.js'
import * as enrolmentsApi from '../../../api/enrolments.js'


const BADGE_CLASS = {
	track:         'bg-[#E8F5E9] text-[#2E7D32]',
	progress:      'bg-[#E3F2FD] text-[#1565C0]',
	completed:     'bg-[#E8F5E9] text-[#2E7D32]',
	'not-started': 'bg-[#F5F5F5] text-[#666]',
}


const GuideModule = () => {
	const navigate = useNavigate()

	const { data: modulesData, isLoading } = useQuery({
		queryKey: ['modules', { status: 'PUBLISHED' }],
		queryFn: async () => {
			const res = await modulesApi.getAll({ status: 'PUBLISHED' })
			return res.data.data
		},
	})

	const { data: enrolmentsData } = useQuery({
		queryKey: ['enrolments', 'me'],
		queryFn: async () => {
			const res = await enrolmentsApi.getMyEnrolments()
			return res.data.data
		},
	})

	const modules    = modulesData    ?? []
	const enrolments = enrolmentsData ?? []

	const enrolledCount    = enrolments.length
	const completedCount   = enrolments.filter(e => e.completedAt).length
	const inProgressCount  = enrolments.filter(e => !e.completedAt).length
	const notEnrolledCount = Math.max(0, modules.length - enrolledCount)

	const getModuleState = (mod) => {
		const enrolment = enrolments.find(e => e.moduleId === mod.id)
		if (!enrolment) return { status: 'Not Enrolled', statusClass: 'not-started', actionType: 'enrol', progress: 0, dueAt: null }
		if (enrolment.completedAt) return { status: 'Completed', statusClass: 'completed', actionType: 'view', progress: 100, dueAt: enrolment.dueAt }
		const pct = enrolment.progressPct ?? 0
		if (pct >= 70) return { status: 'On Track', statusClass: 'track', actionType: 'continue', progress: pct, dueAt: enrolment.dueAt }
		return { status: 'In Progress', statusClass: 'progress', actionType: 'continue', progress: pct, dueAt: enrolment.dueAt }
	}

	const renderButton = (type, moduleId) => {
		switch (type) {
			case 'continue':
				return (
					<button
						className="py-2 px-5 rounded-[6px] text-[0.9rem] font-semibold cursor-pointer border-0 transition-[background] duration-200 bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
						onClick={() => navigate(`/guide/modules/${moduleId}`)}
					>
						Continue
					</button>
				)
			case 'view':
				return (
					<button
						className="py-2 px-5 rounded-[6px] text-[0.9rem] font-semibold cursor-pointer border border-[#2E7D32] bg-transparent text-[#2E7D32] transition-[background] duration-200 hover:bg-[#E8F5E9]"
						onClick={() => navigate(`/guide/modules/${moduleId}`)}
					>
						View
					</button>
				)
			case 'enrol':
				return (
					<button
						className="py-2 px-5 rounded-[6px] text-[0.9rem] font-semibold cursor-pointer border border-[#E0E0E0] bg-white text-[#333333] transition-[background] duration-200 hover:bg-[#f0f0f0]"
						onClick={() => navigate(`/guide/modules/${moduleId}`)}
					>
						Enrol
					</button>
				)
			default:
				return null
		}
	}

	const stats = [
		{ label: 'Enrolled',     count: enrolledCount    },
		{ label: 'Completed',    count: completedCount   },
		{ label: 'In Progress',  count: inProgressCount  },
		{ label: 'Not Enrolled', count: notEnrolledCount },
	]

	return (
		<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-8 box-border">
				<h1 className="text-[1.75rem] text-[#333333] m-0 mb-6 font-bold">My Modules</h1>

				<div className="grid grid-cols-4 gap-6 mb-10">
					{stats.map((stat, index) => (
						<div key={index} className="bg-white p-6 rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex flex-col justify-center items-center text-center border-t-4 border-t-[#2E7D32]">
							<div className="text-[2rem] font-bold text-[#2E7D32] mb-1">{stat.count}</div>
							<div className="text-[0.9rem] text-[#666666] font-medium">{stat.label}</div>
						</div>
					))}
				</div>

				{isLoading && <p className="text-center py-8 text-[#666666]">Loading modules…</p>}

				{!isLoading && (
					<div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
						{modules.length > 0 ? modules.map((mod) => {
							const { status, statusClass, actionType, progress, dueAt } = getModuleState(mod)
							const itemCount = mod._count?.contentItems ?? mod.contentItems?.length ?? 0
							return (
								<div key={mod.id} className="bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E0E0E0] flex flex-col transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-[1.1rem] font-bold text-[#333333] m-0 leading-[1.4]">{mod.title}</h3>
										<span className={`text-[0.75rem] font-bold py-1 px-[0.6rem] rounded-[4px] uppercase whitespace-nowrap ml-2 ${BADGE_CLASS[statusClass]}`}>{status}</span>
									</div>

									{progress > 0 && (
										<div className="mb-4">
											<div className="flex justify-between text-[0.8rem] text-[#666666] mb-[0.35rem]">
												<span>Progress</span>
												<span>{progress}%</span>
											</div>
											<div className="w-full h-[6px] bg-[#E0E0E0] rounded-[3px] overflow-hidden">
												<div className="h-full bg-[#2E7D32] rounded-[3px]" style={{ width: `${progress}%` }}></div>
											</div>
										</div>
									)}

									<div className="flex gap-4 text-[0.85rem] text-[#666666] mb-6">
										{dueAt && (
											<div className="flex items-center gap-[0.3rem]">
												<span>📅</span> Due: {new Date(dueAt).toLocaleDateString()}
											</div>
										)}
										{itemCount > 0 && (
											<div className="flex items-center gap-[0.3rem]">
												<span>📚</span> {itemCount} items
											</div>
										)}
									</div>

									<div className="mt-auto flex justify-end">
										{renderButton(actionType, mod.id)}
									</div>
								</div>
							)
						}) : (
							<p className="text-[#666666] col-span-full text-center py-8">No published modules available.</p>
						)}
					</div>
				)}
			</main>
		</div>
	)
}

export default GuideModule
