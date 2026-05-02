import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import * as authApi from '../../api/auth.js'


export default function Activate() {
	const navigate         = useNavigate()
	const [searchParams]   = useSearchParams()
	const token            = searchParams.get('token')

	const [password,        setPassword]        = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPass,        setShowPass]        = useState(false)
	const [status,          setStatus]          = useState('idle')
	const [error,           setError]           = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (password.length < 8) {
			setError('Password must be at least 8 characters.')
			return
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setStatus('loading')
		try {
			await authApi.setPassword(token, password)
			setStatus('done')
			setTimeout(() => navigate('/'), 2000)
		} catch (err) {
			const msg = err.response?.data?.error?.message ?? 'Activation link is invalid or has expired.'
			setError(msg)
			setStatus('idle')
		}
	}

	if (!token) {
		return (
			<div className="min-h-screen bg-[#f0efe9] flex items-center justify-center p-6 [font-family:'Segoe_UI',system-ui,sans-serif]">
				<div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-10 w-full max-w-md text-center">
					<div className="text-4xl mb-4">⚠️</div>
					<h2 className="text-[20px] font-bold text-[#1a1a1a] mb-2">Invalid activation link</h2>
					<p className="text-[14px] text-[#6b7280] mb-6">
						This link is invalid or missing. If your link has expired, you can request a new one from the sign-in page.
					</p>
					<Link to="/" className="text-[14px] text-[#2d6a4f] no-underline hover:underline">
						← Back to sign in
					</Link>
				</div>
			</div>
		)
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
						<span className="text-[12px] text-[#6b7280]">Account Activation</span>
					</div>
				</div>

				{status === 'done' ? (
					<div className="text-center py-4">
						<div className="w-16 h-16 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
						<h2 className="text-[22px] font-bold text-[#1a1a1a] mb-2">Account activated!</h2>
						<p className="text-[14px] text-[#6b7280]">Your account is ready. Redirecting to sign in…</p>
					</div>
				) : (
					<>
						<div className="mb-7">
							<h2 className="text-[24px] font-bold text-[#1a1a1a] mb-1">Activate your account</h2>
							<p className="text-[14px] text-[#6b7280]">Set a password to complete your account setup.</p>
						</div>

						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-1.5">
								<label htmlFor="password" className="text-[13px] font-medium text-[#1a1a1a]">Password</label>
								<div className="relative flex items-center">
									<input
										id="password"
										type={showPass ? 'text' : 'password'}
										required
										value={password}
										onChange={e => setPassword(e.target.value)}
										autoComplete="new-password"
										className="w-full py-2.5 pr-10 pl-3.5 border border-[#e2e2dc] rounded-[8px] bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
										placeholder="Min. 8 characters"
									/>
									<button
										type="button"
										className="absolute right-2.5 bg-transparent border-0 cursor-pointer text-[#9ca3af] flex items-center p-1 hover:text-[#6b7280]"
										onClick={() => setShowPass(v => !v)}
									>
										{showPass ? '🙈' : '👁'}
									</button>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label htmlFor="confirm" className="text-[13px] font-medium text-[#1a1a1a]">Confirm password</label>
								<input
									id="confirm"
									type={showPass ? 'text' : 'password'}
									required
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									autoComplete="new-password"
									className="w-full py-2.5 px-3.5 border border-[#e2e2dc] rounded-[8px] bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
									placeholder="Repeat your password"
								/>
							</div>

							{error && (
								<div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
									<p className="m-0">{error}</p>
									{error.toLowerCase().includes('expired') && (
										<Link to="/" className="text-red-700 font-medium underline text-[12px]">
											Request a new activation link →
										</Link>
									)}
								</div>
							)}

							<button
								type="submit"
								disabled={status === 'loading'}
								className="w-full py-[13px] bg-[#1b3a2d] text-white border-0 rounded-[8px] text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#2d6a4f] disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{status === 'loading' ? 'Activating…' : 'Activate account'}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	)
}
