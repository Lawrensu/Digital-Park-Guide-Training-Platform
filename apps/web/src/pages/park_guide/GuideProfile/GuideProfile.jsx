import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../../rbac/AuthProvider'
import GuideNavbar from '../../../components/GuideNavbar/GuideNavbar'
import * as usersApi from '../../../api/users.js'
import * as enrolmentsApi from '../../../api/enrolments.js'
import * as certificationsApi from '../../../api/certifications.js'
import * as quizAttemptsApi from '../../../api/quizAttempts.js'


const GuideProfile = () => {
	const { logout } = useAuth()
	const navigate = useNavigate()

	const { data: me } = useQuery({
		queryKey: ['users', 'me'],
		queryFn: async () => {
			const res = await usersApi.getMe()
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

	const { data: certsData } = useQuery({
		queryKey: ['certifications', 'me'],
		queryFn: async () => {
			const res = await certificationsApi.getMine()
			return res.data.data
		},
	})

	const { data: attemptsData } = useQuery({
		queryKey: ['quiz-attempts', 'me'],
		queryFn: async () => {
			const res = await quizAttemptsApi.getAll()
			return res.data.data
		},
	})

	const enrolments = enrolmentsData ?? []
	const certs      = certsData      ?? []
	const attempts   = attemptsData   ?? []
	const completed  = enrolments.filter(e => e.completedAt)

	const initials = me ? `${me.firstName?.[0] ?? ''}${me.lastName?.[0] ?? ''}`.toUpperCase() : '?'

	const handleDownload = async (certId) => {
		try {
			const res = await certificationsApi.getDownloadUrl(certId)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve certificate download link.')
		}
	}

	return (
		<div className="flex min-h-screen bg-[#F4F7F6] [font-family:'Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
			<GuideNavbar />

			<main className="flex-1 p-8 box-border flex flex-col">

				<div className="bg-white rounded-[12px] p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-8 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-20 before:bg-[#2E7D32] before:z-0">
					<div className="w-25 h-25 bg-white text-[#2E7D32] rounded-full flex items-center justify-center text-[2.5rem] font-bold mx-auto mb-4 relative z-[1] border-4 border-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
						{initials}
					</div>
					<h1 className="text-[1.5rem] font-bold text-[#333333] m-0 mb-2 relative z-[1]">
						{me ? `${me.firstName} ${me.lastName}` : '—'}
					</h1>
					<div className="inline-block bg-[#E8F5E9] text-[#2E7D32] py-1 px-4 rounded-[20px] text-[0.9rem] font-semibold relative z-[1]">
						Park Guide · {me?.status ?? ''}
					</div>
				</div>

				<div className="grid grid-cols-4 gap-6 mb-8">
					{[
						{ label: 'Enrolled Modules', value: enrolments.length },
						{ label: 'Completed',         value: completed.length  },
						{ label: 'Certificates',      value: certs.length      },
						{ label: 'Quizzes',           value: attempts.length   },
					].map((stat, i) => (
						<div key={i} className="bg-white p-6 rounded-[12px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-t-4 border-t-[#2E7D32]">
							<h3 className="text-[2rem] font-bold text-[#2E7D32] m-0">{stat.value}</h3>
							<p className="text-[0.9rem] text-[#666666] m-0 mt-2">{stat.label}</p>
						</div>
					))}
				</div>

				<div className="grid grid-cols-2 gap-8 mb-8">

					<div className="bg-white p-6 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
						<h2 className="text-[1.1rem] font-bold text-[#333333] m-0 mb-6 pb-3 border-b border-[#f0f0f0]">Personal Information</h2>
						{[
							['Name',     me ? `${me.firstName} ${me.lastName}` : '—'],
							['Username', me?.username ? `@${me.username}` : '—'],
							['Email',    me?.email ?? '—'],
						].map(([label, value]) => (
							<div key={label} className="flex justify-between mb-4 text-[0.95rem]">
								<span className="text-[#666666] font-medium">{label}</span>
								<span className="text-[#333333] font-semibold text-right">{value}</span>
							</div>
						))}
					</div>

					<div className="bg-white p-6 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
						<h2 className="text-[1.1rem] font-bold text-[#333333] m-0 mb-6 pb-3 border-b border-[#f0f0f0]">My Certifications</h2>
						{certs.length > 0 ? certs.map(cert => (
							<div key={cert.id} className="flex items-center justify-between py-4 border-b border-[#f9f9f9] last:border-b-0">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-[#FFF8E1] text-[#FBC02D] rounded-[8px] flex items-center justify-center text-[1.25rem]">🎓</div>
									<span className="text-[0.95rem] font-semibold text-[#333333]">{cert.enrolment?.module?.title ?? '—'}</span>
								</div>
								<div className="flex gap-2">
									<button
										className="py-[0.35rem] px-3 text-[0.8rem] rounded-[4px] cursor-pointer font-semibold bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2]"
										onClick={() => handleDownload(cert.id)}
									>
										PDF
									</button>
									<button
										className="py-[0.35rem] px-3 text-[0.8rem] rounded-[4px] cursor-pointer font-semibold bg-[#F5F5F5] text-[#666666] border-none"
										onClick={() => navigate(`/guide/certifications/${cert.id}`)}
									>
										View
									</button>
								</div>
							</div>
						)) : (
							<p className="text-[0.9rem] text-[#666666]">No certifications yet.</p>
						)}
					</div>

				</div>

				<div className="flex justify-end gap-4 mt-auto">
					<button
						className="py-3 px-8 rounded-[8px] text-[1rem] font-semibold cursor-pointer border-0 transition-all duration-200 bg-[#D32F2F] text-white hover:bg-[#B71C1C]"
						onClick={() => logout()}
					>
						Log Out
					</button>
				</div>

			</main>
		</div>
	)
}

export default GuideProfile
