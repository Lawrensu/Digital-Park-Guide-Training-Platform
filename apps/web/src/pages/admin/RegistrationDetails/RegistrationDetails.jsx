import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../../../components/Navbar/Navbar'
import * as registrationsApi from '../../../api/registrations.js'


const STATUS_BADGE = {
	APPROVED: 'bg-[#e8f5ee] text-[#266841]',
	PENDING:  'bg-[#fff3e0] text-[#b35c2a]',
	REJECTED: 'bg-[#f5f5f4] text-[#78716c]',
}

const STATUS_LABEL = { APPROVED: 'Approved', PENDING: 'Pending', REJECTED: 'Rejected' }


export default function RegistrationDetails() {
	const { id } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [remarks, setRemarks] = useState('')

	const { data: reg, isLoading, error } = useQuery({
		queryKey: ['registrations', id],
		queryFn: async () => {
			const res = await registrationsApi.getOne(id)
			return res.data.data
		},
	})

	const approveMutation = useMutation({
		mutationFn: () => registrationsApi.approve(id, { startDate: new Date().toISOString().slice(0, 10), remarks }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['registrations'] })
			navigate('/registrations')
		},
	})

	const rejectMutation = useMutation({
		mutationFn: () => registrationsApi.reject(id, { remarks }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['registrations'] })
			navigate('/registrations')
		},
	})

	const handleViewCv = async () => {
		try {
			const res = await registrationsApi.getCvUrl(id)
			window.open(res.data.data.url, '_blank')
		} catch {
			alert('Could not retrieve CV download link.')
		}
	}

	if (isLoading) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="font-outfit text-sm text-[#a8a29e]">Loading…</p>
				</div>
			</div>
		)
	}

	if (error || !reg) {
		return (
			<div className="flex flex-col lg:flex-row min-h-screen bg-[#fdfbf7]">
				<Navbar />
				<div className="flex-1 flex items-center justify-center">
					<p className="font-outfit text-sm text-red-500">Failed to load registration.</p>
				</div>
			</div>
		)
	}

	const isPending = reg.status === 'PENDING'
	const actionPending = approveMutation.isPending || rejectMutation.isPending

	return (
		<div className="bg-[#fdfbf7] min-h-screen flex flex-col lg:flex-row">
			<Navbar />

			<div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
				<div className="flex justify-between items-center flex-wrap gap-3 mb-8">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate('/registrations')}
							className="font-outfit text-sm text-[#78716c] hover:text-[#1a3a2a] transition-colors"
						>
							← Back
						</button>
						<h1 className="font-outfit font-semibold text-[28px] text-[#1a3a2a]">Registration Details</h1>
					</div>
					<span className={`py-1.5 px-4 rounded-[20px] font-outfit font-semibold text-sm uppercase tracking-[0.5px] ${STATUS_BADGE[reg.status] ?? ''}`}>
						{STATUS_LABEL[reg.status] ?? reg.status}
					</span>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

					<div className="lg:col-span-2 space-y-6">

						<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
							<h3 className="font-outfit font-medium text-[20px] text-[#1a3a2a] mb-6 border-b border-[#f0e9db] pb-3">Personal Information</h3>
							<div className="grid grid-cols-2 gap-6">
								<div className="flex flex-col gap-1">
									<label className="font-outfit font-medium text-sm text-gray-500">Full Name</label>
									<p className="font-serif text-base text-[#1a3a2a] font-medium">{reg.firstName} {reg.lastName}</p>
								</div>
								<div className="flex flex-col gap-1">
									<label className="font-outfit font-medium text-sm text-gray-500">IC / Passport</label>
									<p className="font-serif text-base text-[#1a3a2a]">{reg.icPassportNumber}</p>
								</div>
								<div className="flex flex-col gap-1">
									<label className="font-outfit font-medium text-sm text-gray-500">Email Address</label>
									<p className="font-serif text-base text-[#1a3a2a]">{reg.email}</p>
								</div>
								<div className="flex flex-col gap-1">
									<label className="font-outfit font-medium text-sm text-gray-500">Submitted</label>
									<p className="font-serif text-base text-[#1a3a2a]">{new Date(reg.createdAt).toLocaleDateString()}</p>
								</div>
								<div className="flex flex-col gap-1 col-span-2">
									<label className="font-outfit font-medium text-sm text-gray-500">Address</label>
									<p className="font-serif text-base text-[#1a3a2a] whitespace-pre-line">{reg.address}</p>
								</div>
								<div className="flex flex-col gap-1 col-span-2">
									<label className="font-outfit font-medium text-sm text-gray-500">Reason for Applying</label>
									<p className="font-serif text-base text-[#1a3a2a]">{reg.reason}</p>
								</div>
							</div>
						</div>

						{reg.cvS3Key && (
							<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
								<h3 className="font-outfit font-medium text-[20px] text-[#1a3a2a] mb-4 border-b border-[#f0e9db] pb-3">Uploaded CV</h3>
								<div className="flex items-center gap-4 bg-[#f9f5ed] p-4 rounded-lg border border-[#f0e9db]">
									<div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg">
										<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M14 2V8H20" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
									<div className="flex-1">
										<p className="font-serif text-base text-[#1a3a2a] font-medium">CV Document</p>
										<p className="font-serif text-sm text-gray-500">Click View to open the pre-signed URL</p>
									</div>
									<button
										onClick={handleViewCv}
										className="font-outfit font-medium text-sm text-[#b35c2a] border border-[#b35c2a] rounded-lg px-4 py-2 bg-transparent cursor-pointer hover:bg-[#fdfbf7] transition-colors"
									>
										View
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="space-y-6">

						<div className="bg-white border border-[#f0e9db] rounded-xl p-6">
							<h3 className="font-outfit font-medium text-[20px] text-[#1a3a2a] mb-4">Decision</h3>
							<div className="mb-4">
								<label className="font-outfit font-medium text-sm text-gray-600 block mb-2">Remarks (optional)</label>
								<textarea
									className="w-full bg-[#f9f5ed] border border-[#f0e9db] rounded-lg px-4 py-3 font-serif resize-y transition-[border-color] duration-200 focus:outline-none focus:border-[#1a3a2a] focus:bg-white text-base"
									rows="4"
									placeholder="Enter decision remarks…"
									value={remarks}
									onChange={e => setRemarks(e.target.value)}
									disabled={!isPending || actionPending}
								/>
							</div>
							<div className="flex flex-col gap-3">
								{isPending ? (
									<>
										<button
											onClick={() => approveMutation.mutate()}
											disabled={actionPending}
											className="bg-[#1a3a2a] text-white border-none cursor-pointer transition-colors duration-200 hover:bg-[#132d20] disabled:opacity-50 font-outfit font-medium text-sm px-6 py-3 rounded-lg w-full"
										>
											{approveMutation.isPending ? 'Approving…' : 'Approve Application'}
										</button>
										<button
											onClick={() => rejectMutation.mutate()}
											disabled={actionPending}
											className="bg-transparent border border-[#d32f2f] text-[#d32f2f] cursor-pointer transition-colors duration-200 hover:bg-[#ffebee] disabled:opacity-50 font-outfit font-medium text-sm px-6 py-3 rounded-lg w-full"
										>
											{rejectMutation.isPending ? 'Rejecting…' : 'Reject Application'}
										</button>
									</>
								) : (
									<p className="font-outfit text-sm text-[#78716c] text-center py-2">
										This application has already been {STATUS_LABEL[reg.status]?.toLowerCase()}.
									</p>
								)}
								{(approveMutation.error || rejectMutation.error) && (
									<p className="font-outfit text-xs text-red-500 text-center">
										Action failed. Please try again.
									</p>
								)}
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	)
}
