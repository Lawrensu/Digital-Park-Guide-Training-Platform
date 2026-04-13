import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ChevronDown,
  ArrowUpDown,
  Mail,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'

export default function RegistrationsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [toasts, setToasts] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await apiClient.get('/registrations')
        // Normalize status to capitalized for the UI
        const data = response.data.map(reg => ({
          ...reg,
          status: reg.status.charAt(0).toUpperCase() + reg.status.slice(1)
        }))
        setRegistrations(data)
      } catch (err) {
        console.error('Failed to fetch registrations', err)
        // Fallback mock data for Sprint 1
        setRegistrations([
          { id: 'REG-101', name: 'Zulhelmi Ishak', email: 'zul.ishak@email.com', date: '2026-04-10', status: 'Pending', region: 'Taman Negara', avatar: 'ZI' },
          { id: 'REG-102', name: 'Mei Ling Tan', email: 'ml.tan@email.com', date: '2026-04-09', status: 'Approved', region: 'Kinabalu Park', avatar: 'MT' },
          { id: 'REG-103', name: 'Arjun Varma', email: 'arjun.v@email.com', date: '2026-04-08', status: 'Pending', region: 'Bako National Park', avatar: 'AV' },
          { id: 'REG-104', name: 'Siti Aminah', email: 'siti.a@email.com', date: '2026-04-07', status: 'Rejected', region: 'Endau-Rompin', avatar: 'SA' },
          { id: 'REG-105', name: 'David Choong', email: 'd.choong@email.com', date: '2026-04-06', status: 'Pending', region: 'Gunung Mulu', avatar: 'DC' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type }])
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 3000)
  }

  const handleAction = async (id, action) => {
    try {
      await apiClient.patch(`/registrations/${id}`, { status: action === 'approve' ? 'approved' : 'rejected' })
      setRegistrations(prev => prev.map(reg => 
        reg.id === id ? { ...reg, status: action === 'approve' ? 'Approved' : 'Rejected' } : reg
      ))
      showToast(`Registration ${id} ${action === 'approve' ? 'approved' : 'rejected'} successfully.`, 'success')
    } catch (err) {
      console.error('Action failed', err)
      // Local update fallback for demo
      setRegistrations(prev => prev.map(reg => 
        reg.id === id ? { ...reg, status: action === 'approve' ? 'Approved' : 'Rejected' } : reg
      ))
      showToast(`Registration ${id} ${action === 'approve' ? 'approved' : 'rejected'} (demo mode).`, action === 'approve' ? 'success' : 'error')
    }
  }

  const filteredRegistrations = registrations
    .filter(reg => {
      const nameMatch = reg.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const emailMatch = reg.email?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSearch = nameMatch || emailMatch
      const matchesStatus = statusFilter === 'All' || reg.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      return sortBy === 'newest' 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    })

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-orange-50 text-orange-600 border-orange-100'
    }
  }

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              Guide Registrations
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Manage and review applications for new park guides
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-serif focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Filter size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Node:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-black uppercase tracking-tighter bg-transparent border-none focus:ring-0 cursor-pointer text-slate-900 p-0"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <ArrowUpDown size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temporal:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-black uppercase tracking-tighter bg-transparent border-none focus:ring-0 cursor-pointer text-slate-900 p-0"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {isLoading ? 'Syncing...' : `Detected ${filteredRegistrations.length} Signals`}
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Applicant</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Submission Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployment Region</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                       <div className="flex flex-col items-center gap-4">
                         <Loader2 className="animate-spin text-primary" size={32} />
                         <p className="text-slate-400 font-serif italic text-sm">Querying database nodes...</p>
                       </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Search size={24} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-serif italic">No signals matching filter parameters.</p>
                    </td>
                  </tr>
                ) : filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-100 shadow-sm">
                          {reg.avatar || reg.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-none mb-1.5">{reg.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 font-serif text-[11px] italic">
                            <Mail size={10} /> {reg.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                        <Calendar size={13} className="text-slate-300" />
                        {new Date(reg.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                        <MapPin size={13} className="text-slate-300" />
                        {reg.region}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${getStatusStyle(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button 
                          onClick={() => navigate(`/registration/${reg.id}`)}
                          className="p-2.5 text-slate-400 hover:text-primary hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm"
                          title="View Signal"
                        >
                          <Eye size={16} />
                        </button>
                        {reg.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(reg.id, 'approve')}
                              className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all shadow-sm"
                              title="Engage Integration"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button 
                              onClick={() => handleAction(reg.id, 'reject')}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm"
                              title="Terminate Request"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button className="p-2.5 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toast Portal */}
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right fade-in duration-500
                ${toast.type === 'success' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-red-600 border-red-500 text-white'}
              `}
            >
              {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <XCircle size={18} />}
              <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}
