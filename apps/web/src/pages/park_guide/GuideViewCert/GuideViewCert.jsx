import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as certificationsApi from '../../../api/certifications.js'
import * as usersApi from '../../../api/users.js'


const GuideViewCert = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const { data: cert, isLoading, error } = useQuery({
		queryKey: ['certifications', id],
		queryFn: async () => {
			const res = await certificationsApi.getOne(id)
			return res.data.data
		},
		enabled: !!id,
	})

	const { data: me } = useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const res = await usersApi.getMe()
			return res.data.data
		},
	})

	const { data: allCertsData } = useQuery({
		queryKey: ['certifications', 'me'],
		queryFn: async () => {
			const res = await certificationsApi.getMine()
			return res.data.data
		},
	})

	const otherCerts = (allCertsData ?? []).filter(c => c.id !== id)
	const isExpired  = cert?.expiresAt && new Date(cert.expiresAt) <= new Date()
	const holderName = me ? `${me.firstName} ${me.lastName}` : '—'
	const moduleTitle = cert?.enrolment?.module?.title ?? '—'

	const handleDownload = async () => {
		try {
			const res = await certificationsApi.getDownloadUrl(id)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve certificate download link.')
		}
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
				<GuideNavbar />
				<main className="flex-1 p-8 box-border">
					<p className="text-center py-12 text-[#666666]">Loading certificate…</p>
				</main>
			</div>
		)
	}

	if (error || !cert) {
		return (
			<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
				<GuideNavbar />
				<main className="flex-1 p-8 box-border">
					<p className="text-center py-12 text-red-500">Certificate not found.</p>
				</main>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-8 box-border">
				<div className="grid grid-cols-[1.5fr_1fr] gap-8">

					<div>
						<h1 className="text-[1.75rem] text-[#333333] m-0 mb-6 font-bold">Certificate Detail</h1>

						<div className="bg-white p-8 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Certificate Number</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">{cert.certificateNumber ?? '—'}</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Holder Name</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">{holderName}</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Module</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">{moduleTitle}</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Organization</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">Sarawak Forestry Corporation</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Issue Date</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">{new Date(cert.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Expiry Date</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">
									{cert.expiresAt ? new Date(cert.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No expiry'}
								</div>
							</div>

							<div className="flex border-b border-[#f0f0f0] py-4 last:border-b-0">
								<div className="w-45 text-[0.9rem] text-[#666666] font-semibold shrink-0">Status</div>
								<div className="text-[0.95rem] text-[#333333] font-medium">
									<span className={`inline-block py-1 px-3 rounded-[20px] text-[0.8rem] font-bold uppercase ${isExpired ? 'bg-[#FFEBEE] text-[#D32F2F]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
										{isExpired ? 'Expired' : 'Active'}
									</span>
								</div>
							</div>

						</div>

						<div className="mt-6 flex gap-4">
							<button
								onClick={handleDownload}
								className="py-3 px-6 bg-[#FFEBEE] text-[#D32F2F] border-0 rounded-[8px] text-[0.95rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#FFCDD2]"
							>
								📄 Download PDF
							</button>
							<button
								onClick={() => navigate('/guide/certifications')}
								className="py-3 px-6 bg-white border border-[#E0E0E0] text-[#333333] rounded-[8px] text-[0.95rem] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#f5f5f5]"
							>
								← Back to Certifications
							</button>
						</div>
					</div>

					<div className="flex flex-col gap-8">

						<div className="bg-white rounded-[12px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
							<h4 className="mb-4 text-[#666666] m-0 text-[0.95rem] font-semibold">Certificate Preview</h4>
							<div className="border-2 border-[#C5A059] p-8 w-full h-75 bg-[radial-gradient(#fff_20%,#fcfcfc_20%)] [background-size:10px_10px] relative flex flex-col justify-center items-center text-[#333333] before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:right-[5px] before:bottom-[5px] before:border before:border-[#C5A059] before:pointer-events-none">
								<h3 className="m-0 mb-4 text-[#2E7D32] uppercase tracking-[2px] text-[1rem]">Certificate of Completion</h3>
								<div className="text-[3rem] my-4 text-[#C5A059]">🏆</div>
								<h2 className="m-0 mb-2 font-serif text-[1.3rem] text-[#333333] leading-[1.3]">{moduleTitle}</h2>
								<p className="m-0 text-[0.8rem] text-[#666666]">Awarded to {me?.firstName ?? ''}</p>
								<p className="m-0 text-[0.7rem] text-[#666666] mt-4">Sarawak Forestry Corporation</p>
							</div>
						</div>

						{otherCerts.length > 0 && (
							<div>
								<h3 className="text-[1.1rem] text-[#333333] m-0 mb-4 border-b-2 border-b-[#2E7D32] pb-2 inline-block">Other Certifications</h3>
								<ul className="list-none p-0 m-0 bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
									{otherCerts.map((c) => (
										<li
											key={c.id}
											onClick={() => navigate(`/guide/certifications/${c.id}`)}
											className="py-4 px-6 border-b border-[#f0f0f0] flex items-center justify-between cursor-pointer transition-[background] duration-200 last:border-b-0 hover:bg-[#f9f9f9]"
										>
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-[#FFF8E1] text-[#FBC02D] rounded-full flex items-center justify-center text-[1rem]">🎓</div>
												<span className="text-[0.9rem] font-medium text-[#333333]">{c.enrolment?.module?.title ?? '—'}</span>
											</div>
											<span className="text-[#ccc]">›</span>
										</li>
									))}
								</ul>
							</div>
						)}

					</div>

				</div>
			</main>
		</div>
	)
}

export default GuideViewCert
