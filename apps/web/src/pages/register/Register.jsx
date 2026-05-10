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
			<div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
				<div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-md text-center">
					<div className="w-14 h-14 bg-[#1a3a2a] rounded-xl flex items-center justify-center mx-auto mb-6">
						<span className="text-2xl">🌿</span>
					</div>
					<h2 className="font-outfit text-[22px] font-semibold text-[#1a3a2a] mb-3">
						Application Submitted
					</h2>
					<p className="font-serif text-sm text-[#78716c] leading-relaxed mb-6">
						Your application has been submitted. You will receive an email once it has been reviewed by an administrator.
					</p>
					<Link
						to="/"
						className="inline-block font-outfit text-sm font-medium text-[#2d7d4e] hover:underline"
					>
						← Back to login
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4 py-10">
			<div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-10 w-full max-w-lg">
				<div className="flex items-center gap-3 mb-8">
					<img src="/forest-3d-fluency-32.png" alt="Forest branding" className="w-8 h-8 object-contain" />
					<div>
						<p className="font-outfit text-[15px] font-semibold text-[#1a3a2a] leading-tight">Forest Branding</p>
						<p className="font-outfit text-xs text-[#78716c]">Park Guide Registration</p>
					</div>
				</div>

				<h1 className="font-outfit text-[24px] font-semibold text-[#1c1917] mb-1">
					Apply to become a Park Guide
				</h1>
				<p className="font-serif text-sm text-[#78716c] mb-8">
					Fill in your details below. An admin will review your application and contact you via email.
				</p>

				<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label className="font-outfit text-[13px] font-medium text-[#1c1917]">First Name</label>
							<input
								type="text"
								value={form.firstName}
								onChange={set('firstName')}
								className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors ${fieldErrors.firstName ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
							/>
							{fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
						</div>
						<div className="flex flex-col gap-1.5">
							<label className="font-outfit text-[13px] font-medium text-[#1c1917]">Last Name</label>
							<input
								type="text"
								value={form.lastName}
								onChange={set('lastName')}
								className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors ${fieldErrors.lastName ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
							/>
							{fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-outfit text-[13px] font-medium text-[#1c1917]">Email Address</label>
						<input
							type="email"
							value={form.email}
							onChange={set('email')}
							onBlur={handleBlurEmail}
							className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors ${fieldErrors.email ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
						/>
						{fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-outfit text-[13px] font-medium text-[#1c1917]">IC / Passport Number</label>
						<input
							type="text"
							value={form.icPassportNumber}
							onChange={set('icPassportNumber')}
							className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors ${fieldErrors.icPassportNumber ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
						/>
						{fieldErrors.icPassportNumber && <p className="text-xs text-red-500">{fieldErrors.icPassportNumber}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-outfit text-[13px] font-medium text-[#1c1917]">Address</label>
						<textarea
							rows={3}
							value={form.address}
							onChange={set('address')}
							className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors resize-y ${fieldErrors.address ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
						/>
						{fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-outfit text-[13px] font-medium text-[#1c1917]">Reason for Applying</label>
						<textarea
							rows={4}
							value={form.reason}
							onChange={set('reason')}
							placeholder="Tell us why you want to become a Sarawak park guide…"
							className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-serif text-sm text-[#1c1917] outline-none focus:bg-white transition-colors resize-y placeholder:text-[#a8a29e] ${fieldErrors.reason ? 'border-red-400 focus:border-red-400' : 'border-[#e7e5e4] focus:border-[#1a3a2a]'}`}
						/>
						{fieldErrors.reason && <p className="text-xs text-red-500">{fieldErrors.reason}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-outfit text-[13px] font-medium text-[#1c1917]">
							CV / Resume <span className="text-[#78716c] font-normal">(PDF)</span>
						</label>
						<input
							type="file" accept=".pdf"
							onChange={e => {
								setCvFile(e.target.files[0] ?? null)
								if (fieldErrors.cvFile) setFieldErrors(fe => ({ ...fe, cvFile: '' }))
							}}
							className={`py-2.5 px-3 border rounded-lg bg-[#fafaf9] font-outfit text-sm text-[#44403c] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#e8f5ee] file:text-[#266841] file:text-xs file:font-medium file:cursor-pointer ${fieldErrors.cvFile ? 'border-red-400' : 'border-[#e7e5e4]'}`}
						/>
						{fieldErrors.cvFile && <p className="text-xs text-red-500">{fieldErrors.cvFile}</p>}
					</div>

					{submitError && <p className="text-sm text-red-500">{submitError}</p>}

					<button
						type="submit"
						disabled={loading}
						className="mt-2 py-3.25 bg-[#1a3a2a] text-white font-outfit text-[15px] font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#1f4d35] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Submitting…' : 'Submit Application'}
					</button>

					<p className="text-center font-outfit text-[12.5px] text-[#78716c]">
						Already have an account?{' '}
						<Link to="/" className="text-[#2d7d4e] hover:underline">Sign in</Link>
					</p>
				</form>
			</div>
		</div>
	)
}
