import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Layers, 
  Trash2, 
  MoreVertical,
  BookOpen,
  Tag,
  Clock,
  BarChart,
  CheckCircle,
  FileText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'

export default function ModulesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [toasts, setToasts] = useState([])

  // Mock Modules Data
  const [modules, setModules] = useState([
    { id: 'MOD-001', title: 'Flora of Taman Negara', category: 'Botany', status: 'Published', difficulty: 'Beginner', lastUpdated: '2026-04-10', lessons: 8, enrollment: 142, coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000' },
    { id: 'MOD-002', title: 'Emergency First Aid', category: 'Safety', status: 'Published', difficulty: 'Advanced', lastUpdated: '2026-04-08', lessons: 12, enrollment: 89, coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1000' },
    { id: 'MOD-003', title: 'Malaysian Wildlife Tracking', category: 'Zoology', status: 'Draft', difficulty: 'Intermediate', lastUpdated: '2026-04-11', lessons: 5, enrollment: 0, coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000' },
    { id: 'MOD-004', title: 'Sustainable Tourism Intro', category: 'Ethics', status: 'Published', difficulty: 'Beginner', lastUpdated: '2026-04-01', lessons: 4, enrollment: 210, coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' },
    { id: 'MOD-005', title: 'Advanced Navigation Skills', category: 'Field Skills', status: 'Draft', difficulty: 'Expert', lastUpdated: '2026-04-12', lessons: 15, enrollment: 0, coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000' },
  ])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type }])
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 3000)
  }

  const handleDelete = (mod) => {
    setSelectedModule(mod)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setModules(prev => prev.filter(m => m.id !== selectedModule.id))
    showToast(`Module "${selectedModule.title}" deleted successfully.`, 'error')
    setShowDeleteModal(false)
    setSelectedModule(null)
  }

  const filteredModules = modules.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         mod.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || mod.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              Module Management
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Create and manage educational content for park guide training
            </p>
          </div>
          <button 
            onClick={() => navigate('/module/new')}
            className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={16} /> Create New Module
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-slate-900"
              >
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {filteredModules.length} Modules Total
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div key={mod.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={mod.coverImage} 
                  alt={mod.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                
                {/* Status Badge overlay on image */}
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    mod.status === 'Published' 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-white/90 text-slate-500 border-slate-200'
                  }`}>
                    {mod.status}
                  </span>
                </div>

                {/* Quick Actions overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => navigate(`/module/edit/${mod.id}`)}
                    className="p-2 bg-white/90 text-slate-600 hover:text-primary rounded-lg transition-all shadow-sm"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(mod)}
                    className="p-2 bg-white/90 text-slate-600 hover:text-red-500 rounded-lg transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1">
                <div className="mb-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{mod.category}</p>
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{mod.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Layers size={14} />
                      <span className="text-xs font-bold text-slate-600">{mod.lessons} Lessons</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400">
                      <BarChart size={14} />
                      <span className="text-xs font-bold text-slate-600">{mod.difficulty}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} /> Updated {new Date(mod.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-emerald-500" /> {mod.enrollment} Enrolled
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button 
                  onClick={() => navigate(`/module/content/${mod.id}`)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={14} /> Manage Content
                </button>
                <button className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-primary transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="p-20 text-center bg-white rounded-[40px] border border-slate-200 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Modules Found</h3>
            <p className="text-slate-400 font-serif italic mb-8">Try adjusting your filters or create a new training module.</p>
            <button 
              onClick={() => navigate('/module/new')}
              className="px-8 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all"
            >
              Start New Module
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl mb-6 flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h4 className="text-xl font-black text-center text-slate-900 mb-2">Delete Module?</h4>
              <p className="text-slate-500 font-serif italic text-center text-sm mb-8">
                Confirming will permanently remove <span className="font-bold">"{selectedModule?.title}"</span> and all associated lessons. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-3">
          {toasts.map(t => (
            <div 
              key={t.id}
              className={`flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border animate-in slide-in-from-bottom duration-300 ${
                t.type === 'error' ? 'border-red-100 text-red-600' : 'border-emerald-100 text-emerald-600'
              }`}
            >
              {t.type === 'error' ? <Trash2 size={18} /> : <CheckCircle size={18} />}
              <span className="text-sm font-bold">{t.message}</span>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}
