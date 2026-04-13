import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Award, 
  BookOpen, 
  BarChart2, 
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Mail,
  MoreHorizontal,
  Eye
} from 'lucide-react'

export default function GuidesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [regionFilter, setRegionFilter] = useState('All')

  // Mock Guides Data
  const [guides] = useState([
    { id: 'G-101', name: 'Ahmad Rizal', region: 'Taman Negara', certification: 'Master Guide', activeModules: 4, progress: 85, status: 'Active', email: 'ahmad.r@parkguide.my' },
    { id: 'G-102', name: 'Siti Aminah', region: 'Kinabulu Park', certification: 'Senior Guide', activeModules: 3, progress: 62, status: 'Active', email: 'siti.a@parkguide.my' },
    { id: 'G-103', name: 'Kevin Wong', region: 'Endau-Rompin', certification: 'Junior Guide', activeModules: 5, progress: 24, status: 'Probation', email: 'kevin.w@parkguide.my' },
    { id: 'G-104', name: 'Sarah Jenkins', region: 'Taman Negara', certification: 'Lead Instructor', activeModules: 2, progress: 100, status: 'Active', email: 's.jenkins@parkguide.my' },
    { id: 'G-105', name: 'Mohd Farhan', region: 'Bako National Park', certification: 'Trainee', activeModules: 6, progress: 12, status: 'Active', email: 'farhan.m@parkguide.my' },
    { id: 'G-106', name: 'Lim Wei Han', region: 'Kinabulu Park', certification: 'Senior Guide', activeModules: 1, progress: 95, status: 'Inactive', email: 'weihan.l@parkguide.my' },
  ])

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         guide.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || guide.status === statusFilter
    const matchesRegion = regionFilter === 'All' || guide.region === regionFilter
    return matchesSearch && matchesStatus && matchesRegion
  })

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              Park Guide Directory
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Manage certifications and monitor training progress of all registered guides
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                Export Data
             </button>
             <button className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                Send Announcement
             </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block"></div>
            
            <div className="flex items-center gap-6 hidden lg:flex">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-slate-900"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Probation</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Region:</span>
                <select 
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-slate-900"
                >
                  <option>All</option>
                  <option>Taman Negara</option>
                  <option>Kinabulu Park</option>
                  <option>Endau-Rompin</option>
                  <option>Bako National Park</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Table */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">
                  <th className="px-8 py-6">Guide Name</th>
                  <th className="px-6 py-6">Region & Contact</th>
                  <th className="px-6 py-6">Certification</th>
                  <th className="px-6 py-6">Training Progress</th>
                  <th className="px-6 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredGuides.map((guide) => (
                  <tr key={guide.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{guide.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">ID: {guide.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs mb-1">
                        <MapPin size={12} className="text-slate-300" /> {guide.region}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-serif italic">
                        <Mail size={12} /> {guide.email}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-amber-500" />
                        {guide.certification}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{guide.activeModules} Active Modules</span>
                         <span className="text-[10px] font-black text-slate-900">{guide.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            guide.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                          }`}
                          style={{ width: `${guide.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        guide.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : guide.status === 'Probation'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        {guide.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => navigate(`/guide/${guide.id}`)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                       >
                          <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Placeholder */}
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Showing {filteredGuides.length} of {guides.length} registered guides
            </p>
            <div className="flex items-center gap-2">
               <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 cursor-not-allowed">Prev</button>
               <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all">Next</button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredGuides.length === 0 && (
          <div className="p-20 text-center bg-white rounded-[40px] border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Guides Found</h3>
            <p className="text-slate-400 font-serif italic">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </AdminLayout>
    </AdminProtected>
  )
}
