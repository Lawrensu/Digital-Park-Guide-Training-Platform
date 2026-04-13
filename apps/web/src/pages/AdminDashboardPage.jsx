import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  UserPlus, 
  BookOpen, 
  ClipboardCheck, 
  Award, 
  Zap,
  ArrowUpRight,
  Plus,
  CheckCircle,
  Bell,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Activity
} from 'lucide-react'
import apiClient from '../services/apiClient'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    pendingRegistrations: '0',
    activeGuides: '0',
    publishedModules: '0',
    pendingQuizReviews: '0',
    certificationsIssued: '0',
    activeAlerts: '0'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err)
        // Fallback mock data for Sprint 1
        setStats({
          pendingRegistrations: '14',
          activeGuides: '1,284',
          publishedModules: '42',
          pendingQuizReviews: '18',
          certificationsIssued: '856',
          activeAlerts: '3'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Comprehensive Admin Stats
  const summaryStats = [
    { label: 'Pending Registrations', value: stats.pendingRegistrations, icon: UserPlus, trend: '+3', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Active Guides', value: stats.activeGuides, icon: Users, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Published Modules', value: stats.publishedModules, icon: BookOpen, trend: '+2', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Quiz Reviews', value: stats.pendingQuizReviews, icon: ClipboardCheck, trend: '-5', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Certifications Issued', value: stats.certificationsIssued, icon: Award, trend: '+42', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active IoT Alerts', value: stats.activeAlerts, icon: Zap, trend: 'High', color: 'text-red-600', bg: 'bg-red-50' },
  ]

  const recentActivity = [
    { user: 'Sarah Tan', action: 'completed Module 4: Flora ID', time: '12 mins ago', icon: CheckCircle, iconColor: 'text-green-500' },
    { user: 'Ahmad Rafiq', action: 'applied for Guide Certification', time: '45 mins ago', icon: UserPlus, iconColor: 'text-blue-500' },
    { user: 'IoT Sensor #04', action: 'detected unauthorized access', time: '1 hour ago', icon: Zap, iconColor: 'text-red-500' },
    { user: 'System', action: 'issued 12 monthly certificates', time: '2 hours ago', icon: Award, iconColor: 'text-emerald-500' },
  ]

  const recentNotifications = [
    { title: 'New Registration', body: '3 new applications from Taman Negara region.', time: '5m', type: 'info' },
    { title: 'Quiz Review Required', body: 'High-volume submissions for "Ecosystem Basics".', time: '20m', type: 'alert' },
    { title: 'Server Maintenance', body: 'Scheduled for tonight at 02:00 AM.', time: '4h', type: 'system' },
  ]

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              Command Center
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Real-time monitoring and administrative operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Clock size={14} /> Schedule Report
            </button>
            <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus size={14} /> Create Content
            </button>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {summaryStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md group">
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg transition-transform group-hover:scale-110`}>
                  <stat.icon size={20} />
                </div>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  stat.trend.includes('-') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Content Area (8/12) */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Analytics & Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-6">Administrative Shortcuts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate('/registrations')}
                    className="flex flex-col items-start p-4 bg-slate-50 hover:bg-orange-50 rounded-2xl border border-slate-100 transition-all group"
                  >
                    <UserPlus className="text-orange-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">Review Regs</span>
                  </button>
                  <button 
                    onClick={() => navigate('/modules')}
                    className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-100 transition-all group"
                  >
                    <BookOpen className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">Create Module</span>
                  </button>
                  <button 
                    onClick={() => navigate('/quiz-reviews')}
                    className="flex flex-col items-start p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-100 transition-all group"
                  >
                    <ClipboardCheck className="text-purple-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">Quiz Attempts</span>
                  </button>
                  <button 
                    onClick={() => navigate('/certificates-admin')}
                    className="flex flex-col items-start p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-100 transition-all group"
                  >
                    <Award className="text-emerald-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">Certifications</span>
                  </button>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-6">Course Performance</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase mb-2">
                       <span className="text-slate-900">Flora Identification</span>
                       <span className="text-primary">82%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase mb-2">
                       <span className="text-slate-900">Emergency Response</span>
                       <span className="text-blue-600">65%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="pt-2 text-center">
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary underline">Deep Analytics View</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Panel */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="text-slate-900 bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center">
                    <ActivityIcon size={20} />
                  </div>
                  <h2 className="font-heading font-black text-xl uppercase tracking-tight">Recent Activity</h2>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-1 group">
                  Audit Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`${act.iconColor} p-2 bg-white rounded-xl shadow-sm`}>
                        <act.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 leading-none mb-1">
                          {act.user} <span className="text-slate-400 font-serif italic text-[13px] font-normal tracking-normal">{act.action}</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.time}</div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Notifications Area (4/12) */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* IoT Alerts Summary Widget */}
            <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-red-400 mb-6">
                  <Zap size={20} className="animate-pulse" />
                  <span className="font-black text-[10px] uppercase tracking-[0.2em]">Active Alerts</span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-black uppercase text-white/50 mb-1">Location</p>
                    <p className="font-black text-sm">East Valley Sector B</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs font-black uppercase text-white/50 mb-1">Severity</p>
                    <p className="font-black text-sm text-red-500">Critical Breach</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all transform hover:-translate-y-1">
                  Open Monitor Room
                </button>
              </div>
            </div>

            {/* Notifications Sidebar */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400">Notifications</h3>
                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">3 New</span>
              </div>
              
              <div className="space-y-6">
                {recentNotifications.map((notif, i) => (
                  <div key={i} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1 before:w-1 before:h-8 before:rounded-full before:bg-slate-200 group hover:before:bg-primary transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[13px] font-black text-slate-900 leading-none">{notif.title}</h4>
                      <span className="text-[10px] font-black text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-serif leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors border-t border-slate-100 pt-6">
                View All Inbox
              </button>
            </div>

          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

function ActivityIcon({ size }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}


