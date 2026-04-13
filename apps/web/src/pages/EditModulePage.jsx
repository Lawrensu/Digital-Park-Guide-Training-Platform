import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  Tag, 
  Type, 
  CheckCircle,
  AlertCircle,
  X,
  History,
  Info
} from 'lucide-react'

export default function EditModulePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [toasts, setToasts] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Real Mock Data lookup based on ID
  const allModules = [
    { id: 'MOD-001', title: 'Flora of Taman Negara', category: 'Botany', publishStatus: 'Published', difficulty: 'Beginner', lastUpdated: '2026-04-10', duration: '120', description: 'A comprehensive guide to the unique botanical landscape of Malaysia\'s premier national park. This module covers over 50 species of rare tropical plants, their medicinal uses, and conservation strategies.', coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000' },
    { id: 'MOD-002', title: 'Emergency First Aid', category: 'Safety', publishStatus: 'Published', difficulty: 'Advanced', lastUpdated: '2026-04-08', duration: '90', description: 'Essential life-saving skills for park guides. Learn how to handle emergencies, apply first aid in remote areas, and coordinate rescue operations.', coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1000' },
    { id: 'MOD-003', title: 'Malaysian Wildlife Tracking', category: 'Zoology', publishStatus: 'Draft', difficulty: 'Intermediate', lastUpdated: '2026-04-11', duration: '150', description: 'Master the art of tracking Malaysian wildlife. Identify footprints, droppings, and feeding signs of tigers, elephants, and other mammals.', coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000' },
    { id: 'MOD-004', title: 'Sustainable Tourism Intro', category: 'Ethics', publishStatus: 'Published', difficulty: 'Beginner', lastUpdated: '2026-04-01', duration: '60', description: 'Learn the principles of sustainable tourism and how to minimize environmental impact while providing an exceptional experience for visitors.', coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' },
    { id: 'MOD-005', title: 'Advanced Navigation Skills', category: 'Field Skills', publishStatus: 'Draft', difficulty: 'Expert', lastUpdated: '2026-04-12', duration: '180', description: 'Advanced techniques for navigating in dense jungle terrain using compass, map, and celestial markers.', coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000' },
  ]

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    duration: '',
    publishStatus: '',
    coverImage: null
  })

  // Load correct module data based on URL ID
  useEffect(() => {
    const moduleToEdit = allModules.find(m => m.id === id)
    if (moduleToEdit) {
      setFormData({
        title: moduleToEdit.title,
        description: moduleToEdit.description,
        category: moduleToEdit.category,
        difficulty: moduleToEdit.difficulty,
        duration: moduleToEdit.duration,
        publishStatus: moduleToEdit.publishStatus,
        coverImage: moduleToEdit.coverImage
      })
    }
  }, [id])

  const [errors, setErrors] = useState({})

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isChanged) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isChanged])

  const showToast = (message, type = 'success') => {
    const toastId = Date.now()
    setToasts([...toasts, { id: toastId, message, type }])
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== toastId))
    }, 3000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setIsChanged(true)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.duration) newErrors.duration = 'Duration is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      showToast('Please fix the errors before saving.', 'error')
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsChanged(false)
      showToast('Module updated successfully!')
      // Optionally navigate back after a delay
      // setTimeout(() => navigate('/modules'), 1500)
    }, 1000)
  }

  const handleDelete = () => {
    // API logic to delete
    showToast(`Module "${formData.title}" deleted.`, 'error')
    setShowDeleteModal(false)
    setTimeout(() => navigate('/modules'), 1000)
  }

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Header with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (isChanged && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return
                navigate('/modules')
              }}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none">
                  Edit Module
                </h1>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  ID: {id || 'MOD-001'}
                </span>
              </div>
              <p className="text-slate-500 font-serif text-sm italic">
                Modifying existing content: {formData.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isChanged && (
              <span className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 mr-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-pulse">
                <Info size={12} /> Unsaved Changes
              </span>
            )}
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting || !isChanged}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
                isChanged 
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Type size={20} className="text-primary" /> Module Content
              </h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Module Title</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 transition-all ${
                      errors.title ? 'ring-2 ring-red-100 placeholder-red-400' : 'focus:ring-primary/10'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
                  <textarea 
                    rows="5"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 transition-all ${
                      errors.description ? 'ring-2 ring-red-100 placeholder-red-400' : 'focus:ring-primary/10'
                    }`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.description}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cover Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group overflow-hidden rounded-[24px] border border-slate-200 aspect-video">
                      {formData.coverImage ? (
                        <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <ImageIcon size={32} className="text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-black text-white uppercase tracking-widest">Current Image</span>
                      </div>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="cover-upload" 
                        hidden 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleChange('coverImage', reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="cover-upload"
                        className="border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-6 text-center hover:border-primary/40 hover:bg-slate-50 transition-all cursor-pointer group h-full"
                      >
                        <ImageIcon size={24} className="text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Replace Image</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Tag size={20} className="text-primary" /> Configuration
              </h2>
              
              <div className="space-y-6">
                {/* Publish Status */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Draft', 'Published'].map(status => (
                      <button 
                        key={status}
                        type="button"
                        onClick={() => handleChange('publishStatus', status)}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.publishStatus === status 
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <select 
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-primary/10"
                    >
                      <option>Botany</option>
                      <option>Zoology</option>
                      <option>Safety</option>
                      <option>Ethics</option>
                      <option>Field Skills</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Difficulty Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                      <button 
                        key={level}
                        type="button"
                        onClick={() => handleChange('difficulty', level)}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.difficulty === level 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Revision Info */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl">
              <h3 className="text-white/40 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <History size={14} /> Audit Log
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Created By</p>
                    <p className="text-xs font-bold text-white">Trainer Sarah Lee</p>
                    <p className="text-[10px] font-serif italic text-white/40 mt-1">2026-03-15 · 09:42 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Last Update</p>
                    <p className="text-xs font-bold text-white">System Admin</p>
                    <p className="text-[10px] font-serif italic text-white/40 mt-1">2026-04-10 · 11:20 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[32px] mb-6 flex items-center justify-center mx-auto">
                <Trash2 size={40} />
              </div>
              <h4 className="text-xl font-black text-center text-slate-900 mb-2 leading-tight">Delete This Module?</h4>
              <p className="text-slate-500 font-serif italic text-center text-sm mb-8 leading-relaxed">
                You are about to permanently remove <span className="font-bold">"{formData.title}"</span>. This will delete all lessons and quiz data associated with it.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all"
                >
                  Yes, Delete Permanently
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                >
                  Cancel & Keep Module
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification Container */}
        <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-3">
          {toasts.map(t => (
            <div 
              key={t.id}
              className={`flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
                t.type === 'error' ? 'border-red-100 text-red-600' : 'border-emerald-100 text-emerald-600'
              }`}
            >
              {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span className="text-sm font-bold">{t.message}</span>
              <button onClick={() => setToasts(curr => curr.filter(item => item.id !== t.id))} className="ml-2 hover:bg-slate-100 p-1 rounded-lg">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}

function ProtectedAdmin({ children }) {
  // Simple check helper since AdminProtected exists but we want to ensure full context
  return <AdminProtected>{children}</AdminProtected>
}
