import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import { Eye, EyeOff, MapPin, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import apiClient from '../services/apiClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin-dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (email && !email.includes('@')) newErrors.email = 'Please enter a valid email'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { accessToken, role } = response.data

      // Store token in session memory (standard for Sprint 1)
      window.sessionStorage.setItem('access_token', accessToken)
      localStorage.setItem('park_admin_role', role)

      // Redirect to intended page or dashboard
      navigate(from, { replace: true })
    } catch (err) {
      // Fallback for Sprint 1 Prototyping (if backend is not ready)
      if (import.meta.env.DEV) {
        if (email === 'admin@park.com' && password === 'password123') {
          window.sessionStorage.setItem('access_token', 'mock_token_admin')
          localStorage.setItem('park_admin_role', 'admin')
          navigate(from, { replace: true })
          return
        }
        if (email === 'guide@park.com' && password === 'demo123') {
          window.sessionStorage.setItem('access_token', 'mock_token_guide')
          localStorage.setItem('park_admin_role', 'guide')
          navigate('/dashboard', { replace: true })
          return
        }
      }
      
      setApiError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Dynamic background effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 p-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="bg-slate-900 text-white p-4 rounded-[20px] shadow-lg shadow-slate-900/10">
                <MapPin size={32} />
              </div>
            </div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              ParkAdmin
            </h1>
            <p className="text-slate-400 font-serif italic text-sm">
              Secure access to guide training command center
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs font-serif leading-relaxed italic">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5 px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Email</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors({ ...errors, email: '' })
                  }}
                  placeholder="admin@park.com"
                  className={`w-full pl-14 pr-6 py-4.5 bg-slate-50 border rounded-2xl font-serif text-sm transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 ${
                    errors.email ? 'border-red-200' : 'border-slate-100 focus:border-primary'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] pl-1 font-black uppercase tracking-widest">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5 px-1 pb-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Master Password</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors({ ...errors, password: '' })
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-14 pr-12 py-4.5 bg-slate-50 border rounded-2xl font-serif text-sm transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 ${
                    errors.password ? 'border-red-200' : 'border-slate-100 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] pl-1 font-black uppercase tracking-widest">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className={`inline-flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Engage Session
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="px-4 bg-white text-slate-400">Identity Nodes</span>
            </div>
          </div>

          {/* Demo Info */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-black uppercase text-slate-400">Node: Guide</p>
                <p className="text-[10px] font-black text-primary tracking-tighter">PSW: demo123</p>
              </div>
              <p className="text-[11px] text-slate-600 font-serif italic text-center">guide@park.com</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-black uppercase text-slate-400">Node: Admin</p>
                <p className="text-[10px] font-black text-primary tracking-tighter">PSW: password123</p>
              </div>
              <p className="text-[11px] text-slate-600 font-serif italic text-center">admin@park.com</p>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-slate-400 font-serif italic">
            Awaiting credentials? <a href="#" className="text-primary font-bold not-italic hover:underline">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  )
}

