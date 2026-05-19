import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as registrationsApi from '../../api/registrations.js'
import * as uploadsApi from '../../api/uploads.js'


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


function validate(form, cvFile) {
	const errors = {}

	if (!form.firstName.trim())
		errors.firstName = 'First name is required.'

	if (!form.lastName.trim())
		errors.lastName = 'Last name is required.'

	if (!form.email.trim())
		errors.email = 'Email address is required.'
	else if (!EMAIL_RE.test(form.email.trim()))
		errors.email = 'Please enter a valid email address.'

	if (!form.icPassportNumber.trim())
		errors.icPassportNumber = 'IC / Passport number is required.'

	if (!form.address.trim())
		errors.address = 'Address is required.'

	if (!form.reason.trim())
		errors.reason = 'Please tell us why you want to become a park guide.'

	if (!cvFile)
		errors.cvFile = 'Please attach your CV.'

	return errors
}


export default function Register() {
	const [submitted, setSubmitted] = useState(false)
	const [loading,   setLoading]   = useState(false)
	const [submitError, setSubmitError] = useState('')
	const [fieldErrors, setFieldErrors] = useState({})

	const [form, setForm] = useState({
		firstName:        '',
		lastName:         '',
		email:            '',
		icPassportNumber: '',
		address:          '',
		reason:           '',
	})
	const [cvFile, setCvFile] = useState(null)
	const [dragOver, setDragOver] = useState(false)

	const set = (field) => (e) => {
		setForm(f => ({ ...f, [field]: e.target.value }))
		if (fieldErrors[field]) setFieldErrors(fe => ({ ...fe, [field]: '' }))
	}

	const handleBlurEmail = () => {
		if (form.email.trim() && !EMAIL_RE.test(form.email.trim()))
			setFieldErrors(fe => ({ ...fe, email: 'Please enter a valid email address.' }))
		else
			setFieldErrors(fe => ({ ...fe, email: '' }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const errors = validate(form, cvFile)
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors)
			return
		}

		setFieldErrors({})
		setSubmitError('')
		setLoading(true)

		try {
			const ext = cvFile.name.split('.').pop()
			const presignRes = await uploadsApi.presign('cv', cvFile.type, ext)
			const { url, key } = presignRes.data.data
			await uploadsApi.uploadToS3(url, cvFile)

			await registrationsApi.submit({ ...form, cvS3Key: key })
			setSubmitted(true)
		} catch (err) {
			setSubmitError(err.response?.data?.error?.message ?? 'Submission failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	if (submitted) {
		return (
			<div className="flex min-h-screen bg-[#f0efe9] items-center justify-center px-4">
				<div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-md text-center">
					<div className="w-14 h-14 bg-[#1b3a2d] rounded-xl flex items-center justify-center mx-auto mb-6">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<h2 className="text-[22px] font-bold text-[#1b3a2d] mb-3">Application Submitted</h2>
					<p className="text-sm text-[#6b7280] leading-relaxed mb-6">
						Your application has been submitted. You will receive an email once it has been reviewed by an administrator.
					</p>
					<Link to="/" className="inline-block text-sm font-medium text-[#2d6a4f] hover:underline">
						← Back to login
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen font-['Segoe_UI',system-ui,sans-serif]">

			{/* ── LEFT PANEL ── */}
			<div className="hidden md:flex relative flex-[0_0_42%] bg-[#1b3a2d] flex-col justify-between py-10 px-12 overflow-hidden text-white">

				{/* Decorative circles */}
				<div className="absolute rounded-full pointer-events-none w-[380px] h-[380px] -top-[120px] -right-[60px] bg-[radial-gradient(circle_at_42%_40%,rgba(120,180,140,0.35)_0%,rgba(80,140,100,0.18)_40%,rgba(50,100,70,0.08)_65%,transparent_85%)]" />
				<div className="absolute rounded-full pointer-events-none w-[380px] h-[380px] -bottom-[120px] -left-[80px] bg-[radial-gradient(circle_at_55%_42%,rgba(120,180,140,0.30)_0%,rgba(80,140,100,0.14)_40%,rgba(50,100,70,0.06)_65%,transparent_85%)]" />
				<div className="absolute rounded-full pointer-events-none w-[260px] h-[260px] bottom-[60px] -right-[30px] bg-[radial-gradient(circle_at_40%_38%,rgba(120,180,140,0.28)_0%,rgba(80,140,100,0.12)_45%,rgba(50,100,70,0.05)_65%,transparent_85%)]" />

				<div className="relative z-[1] flex-1 flex flex-col justify-center gap-8">

					{/* Brand */}
					<div className="flex items-center gap-3">
						<img src="/forest-3d-fluency-32.png" alt="SFC-Logo" className="w-10 h-10 object-contain" />
						<div className="flex flex-col">
							<span className="text-[15px] font-semibold text-white leading-[1.2]">SFC Training</span>
							<span className="text-[12px] text-white/60">Park Guide Portal</span>
						</div>
					</div>

					{/* Hero */}
					<div>
						<h1 className="text-[32px] font-bold leading-[1.25] text-white tracking-[-0.5px] mb-3">
							Join the Next Generation of{' '}
							<span className="text-[#6fcf97]">Certified Park Guides.</span>
						</h1>
						<p className="text-[14px] leading-[1.65] text-white/65 max-w-[340px]">
							Apply to become a licensed SFC park guide. Complete structured
							e-learning modules, pass assessments, and earn a digital
							certification recognised across Sarawak's national parks.
						</p>
					</div>

					{/* Features */}
					<div className="flex flex-col gap-3">
						{[
							'Structured digital training modules',
							'IoT wildlife monitoring access',
							'Officially recognised digital certificate',
						].map((feat) => (
							<div key={feat} className="flex items-center gap-3 text-[13px] text-white/80">
								<span className="w-[22px] h-[22px] rounded-full bg-[#6fcf97]/20 flex items-center justify-center shrink-0 text-[#6fcf97]">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
								<span>{feat}</span>
							</div>
						))}
					</div>

					{/* Stats */}
					<div className="flex items-center gap-8 pt-2 border-t border-white/15">
						{[
							{ value: '48',  label: 'Active Guides' },
							{ value: '8',   label: 'Modules Live' },
							{ value: '156', label: 'Certs Issued' },
						].map((s, i, arr) => (
							<div key={s.label} className="flex items-center gap-8">
								<div className="flex flex-col gap-0.5">
									<span className="text-[26px] font-bold text-white leading-none">{s.value}</span>
									<span className="text-[12px] text-white/55">{s.label}</span>
								</div>
								{i < arr.length - 1 && <div className="w-px h-9 bg-white/20" />}
							</div>
						))}
					</div>

				</div>

				<div className="relative z-[1] text-[12px] text-white/40">
					Sarawak Forestry Corporation &middot; Authorised Personnel Only
				</div>
			</div>

			{/* ── RIGHT PANEL ── */}
			<div className="flex-1 bg-[#f0efe9] flex flex-col items-center justify-start py-10 px-8 gap-4 overflow-y-auto">
				<div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] w-full max-w-[560px] px-10 py-9">

					<div className="mb-7">
						<h2 className="text-[22px] font-bold text-[#1a1a1a] mb-1">Park Guide Registration</h2>
						<p className="text-[14px] text-[#6b7280]">Submit your application to become a certified SFC park guide.</p>
					</div>

					<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

						{/* ── Section 1: Personal Information ── */}
						<div className="flex flex-col gap-3">
							<h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-[0.6px]">
								<span className="w-5 h-5 rounded-full bg-[#1b3a2d] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
								Personal Information
							</h3>
							<div className="flex flex-col gap-4 pl-7">

								{/* First Name + Last Name */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="flex flex-col gap-1.5">
										<label className="text-[13px] font-medium text-[#1a1a1a]">First Name</label>
										<div className="relative flex items-center">
											<span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
												<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
												</svg>
											</span>
											<input
												type="text"
												value={form.firstName}
												onChange={set('firstName')}
												placeholder="Ahmad"
												className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.firstName ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
											/>
										</div>
										{fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
									</div>
									<div className="flex flex-col gap-1.5">
										<label className="text-[13px] font-medium text-[#1a1a1a]">Last Name</label>
										<div className="relative flex items-center">
											<span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
												<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
												</svg>
											</span>
											<input
												type="text"
												value={form.lastName}
												onChange={set('lastName')}
												placeholder="bin Ibrahim"
												className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.lastName ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
											/>
										</div>
										{fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
									</div>
								</div>

								{/* Email */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[13px] font-medium text-[#1a1a1a]">Email Address</label>
									<div className="relative flex items-center">
										<span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
											</svg>
										</span>
										<input
											type="email"
											value={form.email}
											onChange={set('email')}
											onBlur={handleBlurEmail}
											placeholder="ahmad@example.com"
											className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.email ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
										/>
									</div>
									{fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
								</div>

								{/* IC / Passport */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[13px] font-medium text-[#1a1a1a]">IC / Passport Number</label>
									<div className="relative flex items-center">
										<span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
											</svg>
										</span>
										<input
											type="text"
											value={form.icPassportNumber}
											onChange={set('icPassportNumber')}
											placeholder="900101-13-5678"
											className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.icPassportNumber ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
										/>
									</div>
									{fieldErrors.icPassportNumber && <p className="text-xs text-red-500">{fieldErrors.icPassportNumber}</p>}
								</div>

								{/* Address */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[13px] font-medium text-[#1a1a1a]">Address</label>
									<div className="relative">
										<span className="absolute left-3 top-[11px] text-[#9ca3af] flex items-center pointer-events-none">
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
											</svg>
										</span>
										<textarea
											rows={3}
											value={form.address}
											onChange={set('address')}
											placeholder="Enter your full address..."
											className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none resize-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.address ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
										/>
									</div>
									{fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
								</div>

							</div>
						</div>

						{/* ── Section 2: Application Details ── */}
						<div className="flex flex-col gap-3">
							<h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-[0.6px]">
								<span className="w-5 h-5 rounded-full bg-[#1b3a2d] text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
								Application Details
							</h3>
							<div className="flex flex-col gap-4 pl-7">

								{/* Reason */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[13px] font-medium text-[#1a1a1a]">Reason for Applying</label>
									<div className="relative">
										<span className="absolute left-3 top-[11px] text-[#9ca3af] flex items-center pointer-events-none">
											<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
											</svg>
										</span>
										<textarea
											rows={4}
											value={form.reason}
											onChange={set('reason')}
											placeholder="Describe why you want to become a certified SFC park guide..."
											className={`w-full py-2.5 pl-[34px] pr-3 border rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none resize-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9ca3af] ${fieldErrors.reason ? 'border-red-400' : 'border-[#e2e2dc] focus:border-[#2d6a4f] focus:shadow-[0_0_0_3px_rgba(45,106,79,0.08)]'}`}
										/>
									</div>
									{fieldErrors.reason && <p className="text-xs text-red-500">{fieldErrors.reason}</p>}
								</div>

								{/* CV Dropzone */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[13px] font-medium text-[#1a1a1a]">
										CV <span className="text-[12px] text-[#9ca3af] font-normal">(PDF only)</span>
									</label>
									<div
										className={`border-2 border-dashed rounded-[10px] transition-[border-color,background] duration-200 cursor-pointer ${
											cvFile
												? 'border-[#2d6a4f] bg-[rgba(45,106,79,0.04)]'
												: dragOver
													? 'border-[#2d6a4f] bg-[rgba(45,106,79,0.03)]'
													: fieldErrors.cvFile
														? 'border-red-300 bg-[#f9f9f7]'
														: 'border-[#e2e2dc] bg-[#f9f9f7] hover:border-[#2d6a4f] hover:bg-[rgba(45,106,79,0.03)]'
										}`}
										onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
										onDragLeave={() => setDragOver(false)}
										onDrop={(e) => {
											e.preventDefault()
											setDragOver(false)
											const file = e.dataTransfer.files[0]
											if (file && file.type === 'application/pdf') {
												setCvFile(file)
												if (fieldErrors.cvFile) setFieldErrors(fe => ({ ...fe, cvFile: '' }))
											}
										}}
									>
										<label htmlFor="cv-upload" className="flex flex-col items-center gap-1.5 py-6 px-4 cursor-pointer">
											{cvFile ? (
												<>
													<span className="text-[#2d6a4f] mb-1">
														<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
															<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 15 11 17 15 13" />
														</svg>
													</span>
													<span className="text-[13px] font-medium text-[#2d6a4f]">{cvFile.name}</span>
													<span className="text-[12px] text-[#9ca3af]">Click to change file</span>
												</>
											) : (
												<>
													<span className="text-[#9ca3af] mb-1">
														<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
															<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
														</svg>
													</span>
													<span className="text-[13px] text-[#6b7280]">
														<strong>Click to upload</strong> or drag and drop
													</span>
													<span className="text-[12px] text-[#9ca3af]">PDF format only</span>
												</>
											)}
										</label>
										<input
											id="cv-upload"
											type="file"
											accept=".pdf,application/pdf"
											onChange={(e) => {
												setCvFile(e.target.files[0] ?? null)
												if (fieldErrors.cvFile) setFieldErrors(fe => ({ ...fe, cvFile: '' }))
											}}
											className="hidden"
										/>
									</div>
									{fieldErrors.cvFile && <p className="text-xs text-red-500">{fieldErrors.cvFile}</p>}
								</div>

							</div>
						</div>

						{submitError && (
							<p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
								{submitError}
							</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="flex items-center justify-center gap-2 w-full py-[13px] bg-[#1b3a2d] text-white border-0 rounded-lg text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#2d6a4f] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Submitting…' : 'Submit Application'}
							{!loading && (
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							)}
						</button>

					</form>
				</div>

				<p className="text-[12.5px] text-[#6b7280] text-center">
					Already have an account?{' '}
					<Link to="/" className="text-[#2d6a4f] no-underline hover:underline">Sign in here</Link>
				</p>
			</div>

		</div>
	)
}
