import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../rbac/AuthProvider'
import * as authApi from '../../api/auth.js'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail]               = useState('')
    const [password, setPassword]         = useState('')
    const [error, setError]               = useState('')
    const [showResend, setShowResend]     = useState(false)
    const [resendEmail, setResendEmail]   = useState('')
    const [resendStatus, setResendStatus] = useState('idle')

    const { login, loading } = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        const result = await login(email, password)
        if (!result.success) {
            setError(result.message)
        }
    }

    const handleResendActivation = async (e) => {
        e.preventDefault()
        setResendStatus('loading')
        try {
            await authApi.resendActivation(resendEmail)
            setResendStatus('sent')
        } catch {
            setResendStatus('error')
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen font-['Segoe_UI',system-ui,sans-serif]">

            {/* ── LEFT PANEL — hidden on mobile, visible md+ ── */}
            <div className="hidden md:flex relative flex:[0_0_48%] bg-[#1b3a2d] flex-col justify-between py-10 px-12 overflow-hidden text-white">

                {/* Decorative circles */}
                <div className="absolute rounded-full pointer-events-none w-95 h-95 -top-30 -right-15 bg-[radial-gradient(circle_at_42%_40%,rgba(120,180,140,0.35)_0%,rgba(80,140,100,0.18)_40%,rgba(50,100,70,0.08)_65%,transparent_85%)]" />
                <div className="absolute rounded-full pointer-events-none w-95 h-95 -bottom-30 -left-20 bg-[radial-gradient(circle_at_55%_42%,rgba(120,180,140,0.30)_0%,rgba(80,140,100,0.14)_40%,rgba(50,100,70,0.06)_65%,transparent_85%)]" />
                <div className="absolute rounded-full pointer-events-none w-65 h-65 bottom-15 -right-7.5 bg-[radial-gradient(circle_at_40%_38%,rgba(120,180,140,0.28)_0%,rgba(80,140,100,0.12)_45%,rgba(50,100,70,0.05)_65%,transparent_85%)]" />

                <div className="relative z-1 flex-1 flex flex-col justify-center gap-7">

                    <div className="flex items-center gap-3">
                        <img src="/forest-3d-fluency-32.png" alt="SFC-Logo" className="w-8 h-8 object-contain" />
                        <div className="flex flex-col">
                            <span className="font-outfit text-[15px] font-semibold text-white leading-[1.2]">SFC</span>
                            <span className="text-[12px] text-white/60">Digital Park Guide Platform</span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-[36px] font-bold leading-[1.2] text-white tracking-[-0.5px]">
                            Empowering Park Guides Through{' '}
                            <span className="text-[#6fcf97]">Digital Training.</span>
                        </h1>
                        <p className="mt-4 text-[14px] leading-[1.65] text-white/65 max-w-95">
                            Training modules, IoT activity monitoring, digital certifications. Purpose-built for Sarawak park guides.
                        </p>
                    </div>

                </div>

                <div className="relative z-1 text-[12px] text-white/40">
                    Sarawak Forestry Corporation &middot; Restricted Access
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 bg-[#f0efe9] flex flex-col items-center justify-center py-8 px-4 gap-5 md:py-12 md:px-8">
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] pt-8 px-6 pb-6 w-full max-w-105 md:pt-10 md:px-10 md:pb-7">

                    <div className="mb-7">
                        <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-1">Welcome back</h2>
                        <p className="text-[14px] text-[#6b7280]">Sign in to your account</p>
                    </div>

                    <form className="flex flex-col gap-4.5" onSubmit={handleLogin}>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-[13px] font-medium text-[#1a1a1a]">
                                Email
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    className="w-full py-2.5 pr-10 pl-9 border border-[#e2e2dc] rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-[13px] font-medium text-[#1a1a1a]">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="w-full py-2.5 pr-10 pl-9 border border-[#e2e2dc] rounded-lg bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2.5 bg-transparent border-0 cursor-pointer text-[#9ca3af] flex items-center p-1 hover:text-[#6b7280]"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full py-3.25 bg-[#1b3a2d] text-white border-0 rounded-lg text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#2d6a4f] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                            {!loading && (
                                <span className="flex items-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                </span>
                            )}
                        </button>

                        <div className="flex justify-center">
                            <Link to="/forgot-password" className="text-[13px] text-[#2d6a4f] no-underline hover:underline">
                                Forgot your password?
                            </Link>
                        </div>

                        <p className="text-[12px] text-[#9ca3af] leading-[1.6] text-center">
                            This platform is restricted to authorised SFC staff and park guides.
                            For access requests, contact your system administrator.
                        </p>

                    </form>

                    <p className="mt-6 text-[11.5px] text-[#9ca3af] text-center">
                        SFC Training Platform &middot; &copy; 2026 Sarawak Forestry Corporation
                    </p>
                </div>

                <p className="text-[12.5px] text-[#6b7280] text-center leading-[1.7]">
                    New park guide?{' '}
                    <Link to="/register" className="text-[#2d6a4f] no-underline hover:underline">
                        Apply for an account
                    </Link>
                    <br />
                    Need help? Contact{' '}
                    <a href="mailto:itsupport@sfctraining.my" className="text-[#2d6a4f] no-underline hover:underline">
                        itsupport@sfctraining.my
                    </a>
                </p>

                {!showResend ? (
                    <button
                        type="button"
                        onClick={() => setShowResend(true)}
                        className="text-[12px] text-[#9ca3af] bg-transparent border-0 cursor-pointer hover:text-[#6b7280] underline"
                    >
                        Haven't received your activation email?
                    </button>
                ) : (
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-5 w-full max-w-105">
                        {resendStatus === 'sent' ? (
                            <p className="text-[13px] text-[#2d6a4f] text-center">
                                ✅ If that email has a pending account, a new activation link has been sent.
                            </p>
                        ) : (
                            <form onSubmit={handleResendActivation} className="flex flex-col gap-3">
                                <p className="text-[13px] text-[#6b7280] text-center m-0">Resend activation link</p>
                                <input
                                    type="email"
                                    required
                                    value={resendEmail}
                                    onChange={e => setResendEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full py-2 px-3 border border-[#e2e2dc] rounded-lg bg-[#f9f9f7] text-[13px] outline-none focus:border-[#2d6a4f]"
                                />
                                {resendStatus === 'error' && (
                                    <p className="text-[12px] text-red-500 m-0">Something went wrong. Try again.</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={resendStatus === 'loading'}
                                    className="w-full py-2 bg-[#1b3a2d] text-white border-0 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-[#2d6a4f] disabled:opacity-60"
                                >
                                    {resendStatus === 'loading' ? 'Sending…' : 'Resend link'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Login
