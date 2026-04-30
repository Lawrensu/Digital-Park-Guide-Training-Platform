import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../rbac/AuthProvider'

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe]     = useState(false)
    const [username, setUsername]         = useState('')
    const [password, setPassword]         = useState('')
    const [error, setError]               = useState('')

    const { login, loading } = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        const result = await login(username, password)
        if (!result.success) {
            setError(result.message)
        }
    }

    return (
        <div className="flex min-h-screen [font-family:'Segoe_UI',system-ui,sans-serif]">

            {/* ── LEFT PANEL ── */}
            <div className="relative [flex:0_0_48%] bg-[#1b3a2d] flex flex-col justify-between py-[40px] px-[48px] overflow-hidden text-white">

                {/* Decorative circles */}
                <div className="absolute rounded-full pointer-events-none w-[380px] h-[380px] -top-[120px] -right-[60px] bg-[radial-gradient(circle_at_42%_40%,rgba(120,180,140,0.35)_0%,rgba(80,140,100,0.18)_40%,rgba(50,100,70,0.08)_65%,transparent_85%)]" />
                <div className="absolute rounded-full pointer-events-none w-[380px] h-[380px] -bottom-[120px] -left-[80px] bg-[radial-gradient(circle_at_55%_42%,rgba(120,180,140,0.30)_0%,rgba(80,140,100,0.14)_40%,rgba(50,100,70,0.06)_65%,transparent_85%)]" />
                <div className="absolute rounded-full pointer-events-none w-[260px] h-[260px] bottom-[60px] -right-[30px] bg-[radial-gradient(circle_at_40%_38%,rgba(120,180,140,0.28)_0%,rgba(80,140,100,0.12)_45%,rgba(50,100,70,0.05)_65%,transparent_85%)]" />

                <div className="relative z-[1] flex-1 flex flex-col justify-center gap-7">

                    {/* SFC logo slot: replace the logo div with <img src={sfcLogo} alt="SFC" /> once available */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2d6a4f] rounded-[8px] flex items-center justify-center font-bold text-[13px] tracking-[0.5px] text-white">
                            SFC
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-semibold text-white leading-[1.2]">SFC Training</span>
                            <span className="text-[12px] text-white/60">Digital Park Guide Platform</span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-[36px] font-bold leading-[1.2] text-white tracking-[-0.5px]">
                            Empowering Park Guides Through{' '}
                            <span className="text-[#6fcf97]">Digital Training.</span>
                        </h1>
                        <p className="mt-4 text-[14px] leading-[1.65] text-white/65 max-w-[380px]">
                            Structured e-learning, IoT wildlife monitoring, and digital
                            certification management — purpose-built for Sarawak park guides.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[28px] font-bold text-white leading-none">48</span>
                            <span className="text-[12px] text-white/55">Active Guides</span>
                        </div>
                        <div className="w-px h-9 bg-white/20" />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[28px] font-bold text-white leading-none">8</span>
                            <span className="text-[12px] text-white/55">Modules Live</span>
                        </div>
                        <div className="w-px h-9 bg-white/20" />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[28px] font-bold text-white leading-none">156</span>
                            <span className="text-[12px] text-white/55">Certs Issued</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-[1] text-[12px] text-white/40">
                    Sarawak Forestry Corporation &middot; Restricted Access
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 bg-[#f0efe9] flex flex-col items-center justify-center py-[48px] px-8 gap-5">
                <div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] pt-[40px] px-[40px] pb-7 w-full max-w-[420px]">

                    <div className="mb-7">
                        <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-1">Welcome back</h2>
                        <p className="text-[14px] text-[#6b7280]">Sign in to your account</p>
                    </div>

                    <form className="flex flex-col gap-[18px]" onSubmit={handleLogin}>

                        <div className="flex flex-col gap-[6px]">
                            <label htmlFor="username" className="text-[13px] font-medium text-[#1a1a1a]">
                                Username
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[#9ca3af] flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    className="w-full py-[10px] pr-[40px] pl-[36px] border border-[#e2e2dc] rounded-[8px] bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-[6px]">
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
                                    className="w-full py-[10px] pr-[40px] pl-[36px] border border-[#e2e2dc] rounded-[8px] bg-[#f9f9f7] text-[14px] text-[#1a1a1a] outline-none transition-[border-color] duration-200 focus:border-[#2d6a4f]"
                                />
                                <button
                                    type="button"
                                    className="absolute right-[10px] bg-transparent border-0 cursor-pointer text-[#9ca3af] flex items-center p-1 hover:text-[#6b7280]"
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

                        <label className="flex items-center gap-2 text-[13px] text-[#6b7280] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-[15px] h-[15px] accent-[#1b3a2d] cursor-pointer"
                            />
                            <span>Remember me for 7 days</span>
                        </label>

                        {error && (
                            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full py-[13px] bg-[#1b3a2d] text-white border-0 rounded-[8px] text-[15px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#2d6a4f] disabled:opacity-60 disabled:cursor-not-allowed"
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

                        <p className="text-[12px] text-[#9ca3af] leading-[1.6] text-center">
                            This platform is restricted to authorised SFC staff and park guides.
                            For access requests, contact your system administrator.
                        </p>

                        <div className="h-px bg-[#e2e2dc]" />

                        <button type="button" className="w-full py-[11px] bg-transparent border border-[#e2e2dc] rounded-[8px] text-[14px] text-[#1a1a1a] cursor-pointer transition-[border-color,background] duration-200 hover:border-[#2d6a4f] hover:bg-[rgba(45,106,79,0.04)]">
                            Sign in with SSO (Sarawak Gov Portal)
                        </button>
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
            </div>
        </div>
    )
}

export default Login
