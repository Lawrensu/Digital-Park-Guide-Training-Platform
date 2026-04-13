import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminProtected from '../components/AdminProtected'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  Shield,
  Briefcase
} from 'lucide-react'

export default function RegistrationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // State for status, modals, and toasts
  const [status, setStatus] = useState('Pending')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'approve', 'reject', 'info'
  const [toast, setToast] = useState(null)
  const [internalNote, setInternalNote] = useState('')

  // Mock Applicant Data
  const applicant = {
    id: id || 'REG-101',
    name: 'Zulhelmi Ishak',
    email: 'zul.ishak@email.com',
    phone: '+60 12-345 6789',
    address: 'No. 12, Jalan Sultan Ismail, 50250 Kuala Lumpur',
    region: 'Taman Negara (Pahang)',
    appliedDate: 'April 10, 2026',
    experience: '5 years as a freelance nature guide in East Coast Malaysia.',
    education: 'Bachelor in Forestry Science, UPM',
    documents: [
      { name: 'Identification_Card.pdf', size: '1.2 MB', type: 'ID' },
      { name: 'Experience_Certificate.pdf', size: '2.4 MB', type: 'Cert' },
      { name: 'University_Transcript.pdf', size: '3.1 MB', type: 'Edu' },
      { name: 'First_Aid_Certification.pdf', size: '1.8 MB', type: 'Safety' },
    ],
    timeline: [
      { event: 'Application Submitted', date: 'Apr 10, 2026, 09:15 AM', status: 'completed' },
      { event: 'Email Verification', date: 'Apr 10, 2026, 09:20 AM', status: 'completed' },
      { event: 'Document Verification', date: 'Apr 11, 2026, 02:30 PM', status: 'pending' },
    ]
  }

  const handleAction = (type) => {
    setModalType(type)
    setShowConfirmModal(true)
  }

  const confirmAction = () => {
    let message = ''
    if (modalType === 'approve') {
      setStatus('Approved')
      message = 'Registration approved successfully. Credentials sent to guide.'
    } else if (modalType === 'reject') {
      setStatus('Rejected')
      message = 'Registration rejected. Feedback sent to applicant.'
    } else {
      message = 'Information request sent to applicant.'
    }

    setToast({ message, type: modalType === 'reject' ? 'error' : 'success' })
    setShowConfirmModal(false)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AdminProtected>
      <AdminLayout>
        {/* Top Navigation */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/registrations')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4"
          >
            <ArrowLeft size={14} /> Back to Registrations
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 border-2 border-slate-200">
                ZI
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{applicant.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Shield size={12} /> ID: {applicant.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAction('info')}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
              >
                <AlertCircle size={14} /> Request Info
              </button>
              <button 
                onClick={() => handleAction('reject')}
                className="px-5 py-2.5 bg-white border border-red-100 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all shadow-sm flex items-center gap-2"
              >
                <XCircle size={14} /> Reject
              </button>
              <button 
                onClick={() => handleAction('approve')}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <CheckCircle size={14} /> Approve Guide
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Information (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Applicant Profile Card */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <User size={16} /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-slate-400 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Email Address</p>
                      <p className="text-sm font-bold text-slate-900">{applicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-slate-400 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Phone Number</p>
                      <p className="text-sm font-bold text-slate-900">{applicant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Target Region</p>
                      <p className="text-sm font-bold text-slate-900">{applicant.region}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="text-slate-400 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Occupation / Education</p>
                      <p className="text-sm font-bold text-slate-900">{applicant.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="text-slate-400 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Application Date</p>
                      <p className="text-sm font-bold text-slate-900">{applicant.appliedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-3">Professional Experience</p>
                 <p className="text-sm text-slate-600 font-serif leading-relaxed italic">
                   "{applicant.experience}"
                 </p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <FileText size={16} /> Verification Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicant.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-primary/10 transition-colors">
                        <FileText size={20} className="text-slate-400 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.size} • {doc.type}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <Clock size={16} /> Case Timeline
              </h3>
              <div className="space-y-8 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100">
                {applicant.timeline.map((item, i) => (
                  <div key={i} className="relative pl-10">
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
                      item.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}>
                      {item.status === 'completed' ? <CheckCircle size={12} className="text-white" /> : <Clock size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{item.event}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Internal (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Internal Notes */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <MessageSquare size={16} /> Reviewer Notes
              </h3>
              <textarea 
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add internal comments specifically for other trainers..."
                className="w-full min-h-[150px] p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-serif text-sm italic mb-4"
              />
              <button 
                disabled={!internalNote}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg disabled:opacity-30 disabled:hover:bg-slate-900"
              >
                Save Note
              </button>
            </div>

            {/* Quick Summary Widget */}
            <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl">
              <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-4">Review Progress</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '66%' }}></div>
                </div>
                <span className="text-xs font-black">2/3 Tasks</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle size={14} className="text-emerald-400" /> Identity verified
                </li>
                <li className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle size={14} className="text-emerald-400" /> Education check passed
                </li>
                <li className="flex items-center gap-2 text-xs text-white/60 font-black text-white">
                  <Clock size={14} className="text-orange-400" /> Site interview pending
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}></div>
            <div className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className={`w-16 h-16 rounded-3xl mb-6 flex items-center justify-center mx-auto ${
                 modalType === 'approve' ? 'bg-emerald-50 text-emerald-600' : 
                 modalType === 'reject' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {modalType === 'approve' ? <CheckCircle size={32} /> : 
                 modalType === 'reject' ? <XCircle size={32} /> : <AlertCircle size={32} />}
              </div>
              <h4 className="text-2xl font-black text-center text-slate-900 tracking-tight mb-2">
                {modalType === 'approve' ? 'Approve Registration?' : 
                 modalType === 'reject' ? 'Reject Registration?' : 'Request Information?'}
              </h4>
              <p className="text-slate-500 font-serif italic text-center text-sm mb-8 leading-relaxed">
                {modalType === 'approve' ? 'This will grant the user guide access to the system. An automated email with their login credentials will be sent immediately.' : 
                 modalType === 'reject' ? 'This will permanently decline the application. You should provide specific feedback so the applicant can correct issues before re-applying.' : 
                 'Send a notification to the applicant asking for missing documentation or clarifications.'}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmAction}
                  className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-1 ${
                    modalType === 'approve' ? 'bg-primary hover:bg-primary-dark shadow-primary/20' : 
                    modalType === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-slate-900 shadow-slate-900/20'
                  }`}
                >
                  Confirm Action
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-[110] flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
            {toast.type === 'success' ? <CheckCircle size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-red-500" />}
            <span className="text-sm font-bold text-slate-900">{toast.message}</span>
          </div>
        )}
      </AdminLayout>
    </AdminProtected>
  )
}
