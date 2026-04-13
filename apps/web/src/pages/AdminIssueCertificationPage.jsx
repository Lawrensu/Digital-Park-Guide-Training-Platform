import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Award, 
  CheckCircle, 
  ChevronLeft, 
  Download, 
  Printer, 
  User, 
  FileCheck, 
  AlertCircle,
  Calendar,
  ShieldCheck,
  Eye,
  Send
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminIssueCertificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isIssuing, setIsIssuing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock candidate data
  const candidate = {
    id: id || 'G-2489',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@naturalist.com',
    joinDate: 'Jan 15, 2026',
    specialization: 'Forest Ecology',
    completedModules: [
      { id: 1, title: 'Introduction to Park Ecosystems', score: 98, date: 'Feb 02, 2026' },
      { id: 2, title: 'Visitor Safety & First Aid', score: 100, date: 'Feb 12, 2026' },
      { id: 3, title: 'Flora and Fauna Identification', score: 95, date: 'Mar 05, 2026' },
      { id: 4, title: 'Interpretive Guiding Techniques', score: 92, date: 'Mar 28, 2026' },
    ],
    quizzes: [
      { module: 'Ecosystems Foundation', score: 98, passingScore: 80, status: 'Passed' },
      { module: 'Safety & Emergency', score: 100, passingScore: 90, status: 'Passed' },
      { module: 'Biological Diversity', score: 95, passingScore: 80, status: 'Passed' },
      { module: 'Communication Skills', score: 92, passingScore: 85, status: 'Passed' },
    ],
    overallProgress: 100,
    eligibilityStatus: 'Eligible',
    certificationLevel: 'Certified Park Guide (Level I)'
  };

  const handleIssue = () => {
    setIsIssuing(true);
    // Simulate API call
    setTimeout(() => {
      setIsIssuing(false);
      setShowConfirmModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1500);
  };

  return (
    <AdminLayout userRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/certificates-admin')}
              className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issue Certification</h1>
              <p className="text-gray-500">Review candidate credentials and issue official park credentials.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" /> Preview PDF
            </button>
            <button 
              onClick={() => setShowConfirmModal(true)}
              disabled={candidate.eligibilityStatus !== 'Eligible'}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Award className="w-4 h-4" /> Issue Certificate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Summary & Checklist */}
          <div className="lg:col-span-1 space-y-6">
            {/* Candidate Summary */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-emerald-100 p-8 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <User className="w-4 h-4" />
                </div>
                Candidate Summary
              </h2>
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[32px] bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-4xl border-4 border-white shadow-xl shadow-emerald-900/5 rotate-3 hover:rotate-0 transition-transform duration-300">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-emerald-50">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{candidate.name}</h3>
                  <p className="text-slate-500 font-medium">{candidate.email}</p>
                </div>

                <div className="px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    Digital ID: {candidate.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full pt-8 border-t border-slate-100">
                  <div className="text-center space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Joined Agency</p>
                    <p className="text-sm font-black text-slate-900">{candidate.joinDate}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Specialization</p>
                    <p className="text-sm font-black text-slate-900">{candidate.specialization}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Validation */}
            <div className={`rounded-2xl border p-6 shadow-sm ${
              candidate.eligibilityStatus === 'Eligible' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${
                  candidate.eligibilityStatus === 'Eligible' ? 'text-emerald-600' : 'text-amber-600'
                }`} /> Eligibility Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modules Completed</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quizzes Passed</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Background Check</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="pt-3 border-t border-dashed border-gray-300 flex items-center justify-between font-bold">
                  <span className="text-gray-900 uppercase text-xs tracking-widest">Final Status</span>
                  <span className={`px-2 py-1 rounded text-xs tracking-normal ${
                    candidate.eligibilityStatus === 'Eligible' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-600 text-white'
                  }`}>
                    {candidate.eligibilityStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Performance & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Summary */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-emerald-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" /> Performance Transcript
              </h2>
              <div className="overflow-hidden border border-gray-100 rounded-xl">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Target</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Result</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {candidate.quizzes.map((quiz, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">{quiz.module}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`font-bold ${quiz.score >= 90 ? 'text-emerald-700' : 'text-gray-700'}`}>
                            {quiz.score}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-400">{quiz.passingScore}%</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                            {quiz.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 p-8 shadow-inner overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-24 h-24 border-4 border-stone-200/50 rounded-full flex items-center justify-center -rotate-12 opacity-50">
                  <ShieldCheck className="w-12 h-12 text-stone-300" />
                </div>
              </div>

              <div className="bg-white border-[12px] border-emerald-950/20 shadow-2xl p-12 text-center relative max-w-2xl mx-auto font-serif">
                {/* Certificate Background Elements (SVG decorative) */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-emerald-800/20"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-emerald-800/20"></div>
                
                <Award className="w-16 h-16 text-emerald-800 mx-auto mb-6 opacity-80" />
                <h3 className="text-gray-500 uppercase tracking-[0.2em] text-sm mb-4">Official Certificate of Achievement</h3>
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-stone-100 pb-4">Professional Park Guide</h1>
                
                <p className="text-gray-600 italic mb-2">This certifies that</p>
                <h2 className="text-4xl font-bold text-emerald-900 mb-8 font-sans">{candidate.name}</h2>
                
                <div className="max-w-md mx-auto">
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Has successfully completed all required modules, assessments, and field protocols for the 
                    <span className="font-bold"> {candidate.certificationLevel} </span>
                    qualification within the Digital Park Guide Training Platform.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-12 border-t border-stone-200">
                  <div className="text-center">
                    <div className="h-0.5 w-full bg-stone-300 mb-2"></div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Director of Training</p>
                  </div>
                  <div className="text-center">
                    <div className="h-0.5 w-full bg-stone-300 mb-2"></div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Date of Issuance</p>
                  </div>
                </div>
                
                <div className="mt-8 text-[10px] text-gray-300 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  ID: CERT-{candidate.id}-2026-A
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <span className="text-xs text-stone-400 flex items-center gap-1 italic">
                  <AlertCircle className="w-3 h-3" /> Digital-signed encrypted credential
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Issue Credential?</h2>
            <p className="text-gray-500 text-center mb-8">
              You are about to issue a professional certification to <span className="font-bold text-gray-900">{candidate.name}</span>. 
              This will be recorded permanently in the park registry and sent to the candidate via email.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={isIssuing}
              >
                Cancel
              </button>
              <button 
                onClick={handleIssue}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                disabled={isIssuing}
              >
                {isIssuing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>Confirm & Issue</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-[60] bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold">Certification Issued!</p>
            <p className="text-xs text-emerald-200">The guide has been notified and the registry updated.</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminIssueCertificationPage;
