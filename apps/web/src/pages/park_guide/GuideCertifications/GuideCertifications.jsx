import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as certificationsApi from '../../../api/certifications.js'


const GuideCertifications = () => {
	const navigate = useNavigate()

	const { data, isLoading, error } = useQuery({
		queryKey: ['certifications', 'me'],
		queryFn: async () => {
			const res = await certificationsApi.getMine()
			return res.data.data
		},
	})

	const certs = data ?? []

	const now     = new Date()
	const active  = certs.filter(c => !c.expiryDate || new Date(c.expiryDate) > now)
	const expired = certs.filter(c => c.expiryDate && new Date(c.expiryDate) <= now)

	const handleDownload = async (certId) => {
		try {
			const res = await certificationsApi.getDownloadUrl(certId)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve certificate download link.')
		}
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-[#F4F7F6] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-4 sm:p-6 lg:p-8 box-border">
				<header>
					<h1 className="text-[1.75rem] text-[#333333] m-0 mb-8 font-bold">My Certificates</h1>
				</header>

				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-10">
					{[
						{ label: 'Total Earned', value: certs.length,   icon: '🏆' },
						{ label: 'Active',       value: active.length,  icon: '✅' },
						{ label: 'Expired',      value: expired.length, icon: '⏳' },
					].map((stat, i) => (
						<div key={i} className="bg-white p-6 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] flex items-center gap-4 border border-transparent transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#E0E0E0]">
							<div className="w-12 h-12 rounded-[10px] bg-[#F4F7F6] flex items-center justify-center text-[1.5rem]">{stat.icon}</div>
							<div>
								<h3 className="m-0 text-[1.5rem] font-bold text-[#333333]">{stat.value}</h3>
								<p className="m-0 text-[0.875rem] text-[#666666]">{stat.label}</p>
							</div>
						</div>
					))}
				</div>

				<div className="text-[1.1rem] font-semibold text-[#333333] mb-4 flex items-center gap-2">
					<span>🎓</span> Certifications
				</div>

				{isLoading && (
					<p className="text-center py-8 text-[#666666]">Loading certifications…</p>
				)}

				{error && (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-4xl mb-4">😕</p>
						<p className="text-[#333333] font-semibold text-lg mb-1">Something went wrong</p>
						<p className="text-[#666666] text-sm">Could not load your certifications. Please try refreshing the page.</p>
					</div>
				)}

				{!isLoading && !error && certs.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-[#E0E0E0]">
						<p className="text-5xl mb-4">🌿</p>
						<p className="text-[#333333] font-semibold text-lg mb-1">No certificates yet</p>
						<p className="text-[#666666] text-sm mb-6">Complete a training module and pass the quiz to earn your first one.</p>
						<button
							onClick={() => navigate('/guide/modules')}
							className="py-2.5 px-6 bg-[#2E7D32] text-white text-sm font-semibold rounded-lg border-0 cursor-pointer hover:bg-[#1B5E20] transition-colors"
						>
							Browse Modules
						</button>
					</div>
				)}

				{!isLoading && !error && certs.length > 0 && (
					<div className="flex flex-col gap-4">
						{certs.map(cert => {
							const isExpired = cert.expiryDate && new Date(cert.expiryDate) <= new Date()
							return (
								<div key={cert.id} className="bg-white p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E0E0E0]">
									<div className="flex items-center gap-4 sm:gap-6">
										<div className="w-14 h-14 bg-[#FFF8E1] text-[#FBC02D] rounded-full flex items-center justify-center text-[1.75rem]">🎓</div>
										<div>
											<h4 className="m-0 mb-1 text-[1.1rem] text-[#333333]">{cert.module?.title ?? '—'}</h4>
											<span className="text-[0.85rem] text-[#666666]">
												Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '—'}
											</span>
											<div>
												{isExpired ? (
													<span className="inline-block py-1 px-3 rounded-[20px] text-[0.75rem] font-semibold uppercase mt-2 bg-[#FFEBEE] text-[#D32F2F]">Expired</span>
												) : (
													<span className="inline-block py-1 px-3 rounded-[20px] text-[0.75rem] font-semibold uppercase mt-2 bg-[#E8F5E9] text-[#2E7D32]">Active</span>
												)}
											</div>
										</div>
									</div>
									<div className="flex gap-3">
										<button
											className="py-2 px-4 rounded-md text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 border-0 flex items-center gap-2 bg-[#FFEBEE] text-[#D32F2F] hover:bg-[#FFCDD2]"
											onClick={() => handleDownload(cert.id)}
										>
											📄 PDF
										</button>
										<button
											className="py-2 px-4 rounded-md text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 border-0 flex items-center gap-2 bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
											onClick={() => navigate(`/guide/certifications/${cert.id}`)}
										>
											View
										</button>
									</div>
								</div>
							)
						})}
					</div>
				)}

				{!isLoading && !error && certs.length > 0 && (
					<div className="mt-8 text-[0.85rem] text-[#666666] bg-[#E8F5E9] p-4 rounded-lg border-l-4 border-l-[#2E7D32] leading-normal">
						<strong>Note:</strong> You can download the PDF version of any certificate at any time.
					</div>
				)}
			</main>
		</div>
	)
}

export default GuideCertifications
