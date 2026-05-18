import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as analyticsApi from '../../../api/analytics.js'
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'

const PARTICIPATION_COLORS = ['#2d7d4e', '#d4920a']
const OUTCOMES_COLORS = ['#38945e', '#c53030', '#f59e0b']

const KPICard = ({ label, value }) => (
	<div className="bg-white rounded-lg border border-[#e7e5e4] p-6 shadow-sm hover:shadow-md transition-shadow">
		<p className="text-sm text-gray-600 font-outfit mb-2">{label}</p>
		<p className="text-3xl font-outfit font-bold text-[#1a3a2a]">{value ?? '—'}</p>
	</div>
)

const LoadingState = () => (
	<div className="flex items-center justify-center py-16">
		<p className="text-gray-500 font-outfit">Loading analytics...</p>
	</div>
)

const ErrorState = ({ error }) => (
	<div className="flex items-center justify-center py-16">
		<div className="text-center">
			<p className="text-red-600 font-outfit mb-2">Error loading analytics</p>
			<p className="text-sm text-gray-500">{error?.message || 'Please try again later'}</p>
		</div>
	</div>
)

const EmptyState = () => (
	<div className="flex items-center justify-center py-16">
		<p className="text-gray-500 font-outfit">No data available yet</p>
	</div>
)

export default function Analytics() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['admin-training-analytics'],
		queryFn: async () => {
			const res = await analyticsApi.getAdminTrainingAnalytics()
			return res.data?.data || res.data
		},
		staleTime: 5 * 60 * 1000,
	})

	if (isLoading) return <LoadingState />
	if (error) return <ErrorState error={error} />

	const summary = data?.summary || {}
	const participation = data?.participation || []
	const outcomes = data?.outcomes || []
	const modulePassRates = data?.modulePassRates || []
	const guideProgress = data?.guideProgress || []

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
			<Navbar />
			<div className="flex-1 flex flex-col min-w-0">
				<div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
					<div className="max-w-7xl mx-auto">
						<div className="mb-8">
							<h1 className="text-3xl sm:text-4xl font-outfit font-bold text-[#1a3a2a] mb-2">
								Training Analytics
							</h1>
							<p className="text-gray-600 font-outfit">
								Monitor guide participation, training outcomes, and module performance
							</p>
						</div>

						{data ? (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
									<KPICard label="Total Enrolled Guides" value={summary.totalEnrolledGuides} />
									<KPICard label="Active Guides" value={summary.activeGuides} />
									<KPICard label="Inactive Guides" value={summary.inactiveGuides} />
									<KPICard
										label="Certification Completion Rate"
										value={`${summary.certificationCompletionRate ?? 0}%`}
									/>
								</div>

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
									{participation.length > 0 && (
										<div className="bg-white rounded-lg border border-[#e7e5e4] p-6 shadow-sm">
											<h2 className="text-lg font-outfit font-semibold text-[#1a3a2a] mb-4">
												Participation Overview
											</h2>
											<ResponsiveContainer width="100%" height={300}>
												<PieChart>
													<Pie
														data={participation}
														cx="50%"
														cy="50%"
														labelLine={false}
														label={({ name, value }) => `${name}: ${value}`}
														outerRadius={80}
														dataKey="value"
													>
														{participation.map((entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={PARTICIPATION_COLORS[index % PARTICIPATION_COLORS.length]}
															/>
														))}
													</Pie>
													<Tooltip />
													<Legend />
												</PieChart>
											</ResponsiveContainer>
										</div>
									)}

									{outcomes.length > 0 && (
										<div className="bg-white rounded-lg border border-[#e7e5e4] p-6 shadow-sm">
											<h2 className="text-lg font-outfit font-semibold text-[#1a3a2a] mb-4">
												Training Outcomes
											</h2>
											<ResponsiveContainer width="100%" height={300}>
												<PieChart>
													<Pie
														data={outcomes}
														cx="50%"
														cy="50%"
														labelLine={false}
														label={({ name, value }) => `${name}: ${value}`}
														outerRadius={80}
														dataKey="value"
													>
														{outcomes.map((entry, index) => (
															<Cell
																key={`cell-${index}`}
																fill={OUTCOMES_COLORS[index % OUTCOMES_COLORS.length]}
															/>
														))}
													</Pie>
													<Tooltip />
													<Legend />
												</PieChart>
											</ResponsiveContainer>
										</div>
									)}
								</div>

								{modulePassRates.length > 0 && (
									<div className="bg-white rounded-lg border border-[#e7e5e4] p-6 shadow-sm mb-8">
										<h2 className="text-lg font-outfit font-semibold text-[#1a3a2a] mb-4">
											Module Pass Rate Analysis
										</h2>
										<ResponsiveContainer width="100%" height={400}>
											<BarChart data={modulePassRates}>
												<CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
												<XAxis
													dataKey="moduleTitle"
													angle={-45}
													textAnchor="end"
													height={100}
													tick={{ fontSize: 12 }}
												/>
												<YAxis label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }} />
												<Tooltip
													cursor={{ fill: 'rgba(45, 125, 78, 0.1)' }}
													formatter={(value) => `${value}%`}
												/>
												<Bar dataKey="passRate" fill="#2d7d4e" radius={[8, 8, 0, 0]} />
											</BarChart>
										</ResponsiveContainer>
									</div>
								)}

								{guideProgress.length > 0 && (
									<div className="bg-white rounded-lg border border-[#e7e5e4] p-6 shadow-sm">
										<h2 className="text-lg font-outfit font-semibold text-[#1a3a2a] mb-4">
											Guide Progress Monitoring
										</h2>
										<div className="overflow-x-auto">
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b border-[#e7e5e4]">
														<th className="text-left py-3 px-4 font-outfit font-semibold text-[#1a3a2a]">
															Guide
														</th>
														<th className="text-center py-3 px-4 font-outfit font-semibold text-[#1a3a2a]">
															Assigned
														</th>
														<th className="text-center py-3 px-4 font-outfit font-semibold text-[#1a3a2a]">
															Completed
														</th>
														<th className="text-center py-3 px-4 font-outfit font-semibold text-[#1a3a2a]">
															Status
														</th>
													</tr>
												</thead>
												<tbody>
													{guideProgress.map((guide) => {
														const statusColor =
															guide.status === 'Completed'
																? 'text-[#38945e]'
																: guide.status === 'At Risk'
																	? 'text-[#c53030]'
																	: 'text-[#f59e0b]'

														return (
															<tr key={guide.guideId} className="border-b border-[#e7e5e4] hover:bg-[#fdfbf7]">
																<td className="py-3 px-4 font-outfit text-[#1a3a2a]">
																	{guide.guideName}
																</td>
																<td className="py-3 px-4 text-center text-gray-600">
																	{guide.modulesAssigned}
																</td>
																<td className="py-3 px-4 text-center text-gray-600">
																	{guide.modulesCompleted}/{guide.modulesAssigned}
																</td>
																<td className={`py-3 px-4 text-center font-outfit font-semibold ${statusColor}`}>
																	{guide.status}
																</td>
															</tr>
														)
													})}
												</tbody>
											</table>
										</div>
									</div>
								)}
							</>
						) : (
							<EmptyState />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
