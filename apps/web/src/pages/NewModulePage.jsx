import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Image as ImageIcon, 
  Clock, 
  BarChart, 
  Tag, 
  Type, 
  AlignLeft,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'

export default function NewModulePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    duration: '',
    publishStatus: 'Draft',
    coverImage: null
  })

  const [errors, setErrors] = useState({})

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts([...toasts, { id, message, type }])
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id))
    }, 3000)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.duration) newErrors.duration = 'Estimated duration is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status) => {
    if (!validate()) {
      showToast('Please fix the errors before saving.', 'error')
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      showToast(status === 'Published' ? 'Module published successfully!' : 'Draft saved successfully!')
      setTimeout(() => navigate('/modules'), 1500)
    }, 1000)
  }

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/modules')}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-1">
                Create New Module
              </h1>
              <p className="text-slate-500 font-serif text-sm italic">
                Design a new training experience for park guides
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSubmit('Draft')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Save size={16} /> Save Draft
            </button>
            <button 
              onClick={() => handleSubmit('Published')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Send size={16} /> {isSubmitting ? 'Publishing...' : 'Publish Module'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Type size={20} className="text-primary" /> General Information
              </h2>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Module Title</label>
                  <input 
                    type="text"
                    placeholder="e.g. Flora of Taman Negara"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                    placeholder="Describe what students will learn in this module..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 transition-all ${
                      errors.description ? 'ring-2 ring-red-100 placeholder-red-400' : 'focus:ring-primary/10'
                    }`}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.description}</p>}
                </div>

                {/* Cover Image Placeholder */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cover Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center hover:border-primary/40 hover:bg-slate-50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400 font-serif italic mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Tag size={20} className="text-primary" /> Module Settings
              </h2>
              
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      <option>Botany</option>
                      <option>Zoology</option>
                      <option>Safety</option>
                      <option>Ethics</option>
                      <option>Field Skills</option>
                    </select>
                  </div>
                  {errors.category && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{errors.category}</p>}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Difficulty Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                      <button 
                        key={level}
                        type="button"
                        onClick={() => setFormData({...formData, difficulty: level})}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.difficulty === level 
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
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
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Est. Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number"
                      placeholder="e.g. 45"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  {errors.duration && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{errors.duration}</p>}
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-primary/5 rounded-[32px] p-6 border border-primary/10">
              <h3 className="text-primary font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> Trainer Note
              </h3>
              <p className="text-slate-600 text-xs font-serif italic mb-0">
                You are currently setting up the shell. After saving, you will be directed to the "Manage Content" screen to add lessons, quizzes, and multimedia assets.
              </p>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-3">
          {toasts.map(t => (
            <div 
              key={t.id}
              className={`flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border animate-in slide-in-from-bottom duration-300 ${
                t.type === 'error' ? 'border-red-100 text-red-600' : 'border-emerald-100 text-emerald-600'
              }`}
            >
              {t.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              <span className="text-sm font-bold">{t.message}</span>
              <button 
                onClick={() => setToasts(current => current.filter(item => item.id !== t.id))}
                className="ml-2 p-1 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminProtected>
  )
}
