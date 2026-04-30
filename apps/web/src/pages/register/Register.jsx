import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-md text-center">
                    {/* SFC logo slot */}
                    <div className="w-14 h-14 bg-[#1a3a2a] rounded-xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl">🌿</span>
                    </div>
                    <h2 className="[font-family:var(--font-outfit)] text-[22px] font-semibold text-[#1a3a2a] mb-3">
                        Application Submitted
                    </h2>
                    <p className="[font-family:var(--font-serif)] text-sm text-[#78716c] leading-relaxed mb-6">
                        Your application has been submitted. You will receive an email once it has been reviewed by an administrator.
                    </p>
                    <Link
                        to="/"
                        className="inline-block [font-family:var(--font-outfit)] text-sm font-medium text-[#2d7d4e] hover:underline"
                    >
                        ← Back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4 py-10">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    {/* SFC logo slot */}
                    <div className="w-10 h-10 bg-[#1a3a2a] rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-lg">🌿</span>
                    </div>
                    <div>
                        <p className="[font-family:var(--font-outfit)] text-[15px] font-semibold text-[#1a3a2a] leading-tight">
                            SFC Training
                        </p>
                        <p className="[font-family:var(--font-outfit)] text-xs text-[#78716c]">
                            Park Guide Registration
                        </p>
                    </div>
                </div>

                <h1 className="[font-family:var(--font-outfit)] text-[24px] font-semibold text-[#1c1917] mb-1">
                    Apply to become a Park Guide
                </h1>
                <p className="[font-family:var(--font-serif)] text-sm text-[#78716c] mb-8">
                    Fill in your details below. An admin will review your application and contact you via email.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                                First Name
                            </label>
                            <input
                                type="text"
                                required
                                className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                                Last Name
                            </label>
                            <input
                                type="text"
                                required
                                className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                            IC / Passport Number
                        </label>
                        <input
                            type="text"
                            required
                            className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                            Address
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors resize-y"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                            Reason for Applying
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell us why you want to become a Sarawak park guide…"
                            className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-serif)] text-sm text-[#1c1917] outline-none focus:border-[#1a3a2a] focus:bg-white transition-colors resize-y placeholder:text-[#a8a29e]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="[font-family:var(--font-outfit)] text-[13px] font-medium text-[#1c1917]">
                            CV / Resume <span className="text-[#78716c] font-normal">(PDF)</span>
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            required
                            className="py-[10px] px-3 border border-[#e7e5e4] rounded-lg bg-[#fafaf9] [font-family:var(--font-outfit)] text-sm text-[#44403c] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#e8f5ee] file:text-[#266841] file:text-xs file:font-medium file:cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 py-[13px] bg-[#1a3a2a] text-white [font-family:var(--font-outfit)] text-[15px] font-semibold rounded-lg cursor-pointer transition-colors hover:bg-[#1f4d35]"
                    >
                        Submit Application
                    </button>

                    <p className="text-center [font-family:var(--font-outfit)] text-[12.5px] text-[#78716c]">
                        Already have an account?{' '}
                        <Link to="/" className="text-[#2d7d4e] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
