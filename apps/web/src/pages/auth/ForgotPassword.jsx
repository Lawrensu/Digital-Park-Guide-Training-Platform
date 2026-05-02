import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../../api/auth.js'


export default function ForgotPassword() {
	const [email,     setEmail]     = useState('')
	const [status,    setStatus]    = useState('idle')
	const [error,     setError]     = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setStatus('loading')
		try {
			await authApi.forgotPassword(email)
			setStatus('sent')
		} catch (err) {
			const msg = err.response?.data?.error?.message ?? 'Something went wrong. Please try again.'
			setError(msg)
			setStatus('idle')
		}
	}

	return (
		<div className="min-h-screen bg-[#f0efe9] flex items-center justify-center p-6 [font-family:'Segoe_UI',system-ui,sans-serif]">
			<div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:pt-10 sm:px-10 sm:pb-8 w-full max-w-md">

				<div className="flex items-center gap-3 mb-8">
					<div className="w-10 h-10 bg-[#2d6a4f] rounded-[8px] flex items-center justify-center font-bold text-[13px] tracking-[0.5px] text-white">
						SFC
					</div>
					<div className="flex flex-col">
						<span className="text-[15px] font-semibold text-[#1a1a1a] leading-[1.2]">SFC Training</span>
						<span className="text-[12px] text-[#6b7280]">Password Reset</span>
					</div>
				</div>

				{status === 'sent' ? (
					<div className="text-center py-4">
						<div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📧</div>
						<h2 className="text-[22px] font-bold text-[#1a1a1a] mb-2">Check your email</h2>
						<p className="text-[14px] text-[#6b7280] leading-[1.6] mb-6">
							If an account exists for <strong>{email}</strong>, a password reset link has been sent. It expires in 24 hours.
						</p>
						<Link
							to="/"
							className="text-[14px] text-[#2d6a4f] no-underline hover:underline"
						>
							← Back to sign in
						</Link>
					</div>
				) : (
					<>
						<div className="mb-7">
							<h2 className="text-[24px] font-bold text-[#1a1a1a] mb-1">Forgot your password?</h2>
							<p className="text-[14px] text-[#6b7280]">Enter your email and we'll send you a reset link.</p>
						</div>

						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-1.5">
								<label htmlFor="email" className="text-[13px] font-medium text-[#1a1a1a]">Email address</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={e => setEmail(e.target.value)}
									autoComplete="email"
									className="w-full py-2.5 px-3.5 border border-[#e2e2dc] rounded-[8px] bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
									placeholder="you@example.com"
								/>
							</div>

							{error && (
								<p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">{error}</p>
							)}

							<button
								type="submit"
								disabled={status === 'loading'}
								className="w-full py-[13px] bg-[#1b3a2d] text-white border-0 rounded-[8px] text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#2d6a4f] disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{status === 'loading' ? 'Sending…' : 'Send reset link'}
							</button>

							<div className="text-center">
								<Link to="/" className="text-[13px] text-[#6b7280] no-underline hover:text-[#2d6a4f]">
									← Back to sign in
								</Link>
							</div>
						</form>
					</>
				)}
			</div>
		</div>
	)
}
