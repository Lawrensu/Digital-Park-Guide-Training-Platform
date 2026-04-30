import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as certificationsApi from '../../../api/certifications.js'


export default function CertificationPage() {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')

	const { data, isLoading, error } = useQuery({
		queryKey: ['certifications'],
		queryFn: async () => {
			const res = await certificationsApi.getAll()
			return res.data.data
		},
	})

	const certs = data ?? []

	const filtered = certs.filter(c => {
		const q         = searchQuery.toLowerCase()
		const guideName = `${c.guide?.firstName ?? ''} ${c.guide?.lastName ?? ''}`.toLowerCase()
		const module    = (c.enrolment?.module?.title ?? '').toLowerCase()
		const certNum   = (c.certificateNumber ?? '').toLowerCase()
		return guideName.includes(q) || module.includes(q) || certNum.includes(q)
	})

	const handleDownload = async (certId) => {
		try {
			const res = await certificationsApi.getDownloadUrl(certId)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve certificate download link.')
		}
	}

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

				<main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">

					<section className="bg-white border border-[#e7e5e4] rounded-xl overflow-hidden">
						<div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f4]">
							<div className="relative flex items-center">
								<svg className="absolute left-3 text-[#a8a29e] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
								</svg>
								<input
									type="text"
									className="py-[9px] pr-[14px] pl-9 w-[300px] border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] transition-[border-color,background] duration-150 placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1a3a2a] focus:bg-white"
									placeholder="Search guide, module or cert ID…"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<span className="[font-family:var(--font-outfit)] text-xs font-medium text-[#a8a29e]">{filtered.length} certificate{filtered.length !== 1 ? 's' : ''}</span>
						</div>

						<div className="overflow-x-auto">
							{isLoading && <p className="text-center py-12 [font-family:var(--font-outfit)] text-sm text-[#a8a29e]">Loading certifications…</p>}
							{error && <p className="text-center py-12 [font-family:var(--font-outfit)] text-sm text-red-500">Failed to load certifications.</p>}
							{!isLoading && !error && (
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Guide</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Module</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Issued</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Expires</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Cert ID</th>
											<th className="bg-[#fafaf9] px-6 py-[13px] [font-family:var(--font-outfit)] text-xs font-semibold text-[#78716c] text-left tracking-[0.3px] uppercase whitespace-nowrap border-b border-[#f5f5f4]">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filtered.length > 0 ? filtered.map((c, idx) => (
											<tr key={c.id} className={`hover:bg-[#fef7f0] ${idx === filtered.length - 1 ? '[&>td]:border-b-0' : ''}`}>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle">
													<p className="[font-family:var(--font-serif)] text-[15px] text-[#1a3a2a]">{c.guide?.firstName} {c.guide?.lastName}</p>
												</td>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle [font-family:var(--font-serif)] text-sm text-[#78716c]">{c.enrolment?.module?.title ?? '—'}</td>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle [font-family:var(--font-serif)] text-sm text-[#78716c]">{new Date(c.issuedAt).toLocaleDateString()}</td>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle [font-family:var(--font-serif)] text-sm text-[#78716c]">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle">
													<span className="[font-family:var(--font-outfit)] text-xs font-medium text-[#44403c] tracking-[0.3px]">{c.certificateNumber}</span>
												</td>
												<td className="px-6 py-[18px] border-b border-[#f5f5f4] align-middle">
													<div className="flex items-center gap-3">
														<button
															className="inline-flex items-center py-[5px] px-[14px] border border-[#e7e5e4] rounded-[6px] bg-[#fafaf9] [font-family:var(--font-outfit)] text-xs font-medium text-[#44403c] cursor-pointer transition-all duration-150 hover:bg-[#f0e9db] hover:border-[#d6d3d1]"
															onClick={() => handleDownload(c.id)}
														>
															PDF
														</button>
														<button
															className="inline-flex items-center gap-1 [font-family:var(--font-outfit)] text-[13px] font-medium text-[#b35c2a] bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-200 hover:gap-2 hover:underline"
															onClick={() => navigate(`/certifications/${c.id}`)}
														>
															View <span aria-hidden>→</span>
														</button>
													</div>
												</td>
											</tr>
										)) : (
											<tr>
												<td colSpan="6" className="text-center px-6 py-12 [font-family:var(--font-serif)] text-base text-[#a8a29e]">No certifications found.</td>
											</tr>
										)}
									</tbody>
								</table>
							)}
						</div>
					</section>

				</main>
			</div>
		</div>
	)
}
