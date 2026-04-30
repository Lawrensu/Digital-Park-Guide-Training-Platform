import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as badgesApi from '../../../api/badges.js'


function ShieldIcon({ size = 40 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
		</svg>
	)
}

function StarIcon({ size = 40 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
		</svg>
	)
}

function LockIcon({ size = 40 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
		</svg>
	)
}

const BADGE_COLORS = ['#2d7d4e', '#059669', '#d97706', '#0284c7', '#7c3aed', '#ea580c', '#dc2626', '#0891b2']


export default function BadgePage() {
	const { data: earnedData, isLoading } = useQuery({
		queryKey: ['badges', 'mine'],
		queryFn: async () => {
			const res = await badgesApi.getMyBadges()
			return res.data.data
		},
	})

	const earned = earnedData ?? []

	return (
		<div className="flex min-h-screen bg-[#f3f4f6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<div className="flex flex-col flex-1 overflow-hidden">
				<main className="flex-1 p-8 overflow-y-auto">
					<header>
						<h1 className="text-[1.75rem] text-[#333333] m-0 mb-8 font-bold">My Badges</h1>
					</header>

					<div className="grid grid-cols-3 gap-6 mb-10">
						<div className="bg-white p-6 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e5e7eb] flex flex-col justify-center items-center border-t-4 border-t-[#10b981]">
							<div className="text-[2.5rem] font-bold text-[#111827] leading-none mb-2">{earned.length}</div>
							<div className="text-[0.9rem] text-[#6b7280] font-medium uppercase tracking-[0.05em]">Badges Earned</div>
						</div>
						<div className="bg-white p-6 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-[#e5e7eb] flex flex-col justify-center items-center border-t-4 border-t-[#2E7D32]">
							<div className="text-[2.5rem] font-bold text-[#111827] leading-none mb-2">{earned.length > 0 ? Math.round((earned.length / (earned.length + 4)) * 100) : 0}%</div>
							<div className="text-[0.9rem] text-[#6b7280] font-medium uppercase tracking-[0.05em]">Collection Complete</div>
						</div>
					</div>

					{isLoading && <p className="text-center py-8 text-[#666666]">Loading badges…</p>}

					{!isLoading && earned.length > 0 && (
						<div className="mb-12">
							<h3 className="text-[1.1rem] text-[#374151] font-semibold mb-6 border-b-2 border-[#e5e7eb] pb-2 inline-block">Earned Badges</h3>
							<div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
								{earned.map((userBadge, i) => {
									const badge = userBadge.badge ?? userBadge
									const color = BADGE_COLORS[i % BADGE_COLORS.length]
									return (
										<div key={userBadge.id} className="bg-white border border-[#e5e7eb] rounded-[8px] p-6 text-center transition-[transform,box-shadow] duration-200 flex flex-col items-center shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
											<div className="mb-4" style={{ color }}>
												<StarIcon />
											</div>
											<h4 className="m-0 mb-3 text-[1rem] font-semibold text-[#111827]">{badge.name}</h4>
											{badge.description && (
												<p className="m-0 text-[0.8rem] text-[#6b7280] leading-[1.4] mb-3">{badge.description}</p>
											)}
											<div className="flex flex-col gap-1 mt-auto w-full">
												<span className="text-[0.75rem] text-[#6b7280] bg-[#f3f4f6] py-1 px-2 rounded-[4px]">
													📅 {new Date(userBadge.awardedAt ?? userBadge.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					)}

					{!isLoading && earned.length === 0 && (
						<div className="text-center py-16 text-[#666666]">
							<ShieldIcon size={48} />
							<p className="mt-4 text-[1rem]">No badges earned yet. Complete modules and quizzes to earn badges!</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}
