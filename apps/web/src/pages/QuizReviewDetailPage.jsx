import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  User, 
  BookOpen, 
  Clock, 
  Calendar,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Save,
  Send
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const QuizReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [attempt, setAttempt] = useState(null);

  // Mock detailed attempt data
  useEffect(() => {
    const mockData = {
      id: id || "ATT-732",
      guide: {
        name: "Cherylynn Ng",
        id: "G-101",
        avatar: "",
        level: "Senior Guide"
      },
      module: {
        title: "Tropical Forest Ecology",
        id: "MOD-302",
        category: "Ecology"
      },
      stats: {
        date: "Oct 24, 2023",
        timeSpent: "24m 12s",
        score: 92,
        passingScore: 80,
        status: "Pending Review",
        questionsCount: 15,
        correctCount: 13,
        type: "Final Certification"
      },
      questions: [
        {
          id: 1,
          question: "Which of these epiphytes is most commonly found in the Malaysian dipterocarp canopy?",
          options: ["Staghorn Fern", "Pitcher Plant", "Strangler Fig", "Birds Nest Fern"],
          submittedAnswer: "Birds Nest Fern",
          correctAnswer: "Birds Nest Fern",
          pointValue: 10,
          isCorrect: true,
          explanation: "Asplenium nidus is a flagship epiphyte of low-to-mid elevation dipterocarp forests."
        },
        {
          id: 2,
          question: "Explain the symbiotic relationship between Rafflesia and Tetrastigma vines.",
          submittedAnswer: "The Rafflesia acts as a parasite on the Tetrastigma vine, drawing all its nutrients from the vine's tissue since the flower has no leaves or roots of its own.",
          correctAnswer: "Obligate endoparasite relationship.",
          pointValue: 20,
          isCorrect: true,
          type: "Short Answer",
          explanation: "The guide accurately identified the parasitic nature and nutrient source."
        },
        {
          id: 3,
          question: "What is the primary indicator of primary forest over secondary forest in a tropical ecosystem?",
          options: ["High density of lianas", "Presence of emergent dipterocarp trees", "Abundance of bamboo species", "High ground-level moss coverage"],
          submittedAnswer: "High density of lianas",
          correctAnswer: "Presence of emergent dipterocarp trees",
          pointValue: 10,
          isCorrect: false,
          explanation: "Emergent dipterocarps are the classic indicator of primary forest. High liana density is often an indicator of past disturbance (secondary forest)."
        }
      ]
    };
    setAttempt(mockData);
  }, [id]);

  const handleAction = (type) => {
    let msg = "";
    if (type === 'approve') msg = "Assessment successfully marked as REVIEWED.";
    if (type === 'retake') msg = "Retake request sent to guide.";
    
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!attempt) return null;

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header & Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/quiz-reviews')}
                className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to All Reviews
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    {attempt.id} Evaluation
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-[10px] uppercase tracking-widest">
                      {attempt.stats.status}
                    </span>
                  </h1>
                  <p className="text-slate-500 font-medium">Certification audit for {attempt.module.title}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAction('retake')}
                className="flex items-center gap-2 px-6 py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Request Retake
              </button>
              <button 
                onClick={() => handleAction('approve')}
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalize Review
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Attempt Details & Questions */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Score</p>
                  <p className="text-2xl font-black text-slate-900">{attempt.stats.score}%</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Passing: {attempt.stats.passingScore}%</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Accuracy</p>
                  <p className="text-2xl font-black text-slate-900">{attempt.stats.correctCount}/{attempt.stats.questionsCount}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Questions</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                  <p className="text-2xl font-black text-slate-900">{attempt.stats.timeSpent}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Recorded</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Attempts</p>
                  <p className="text-2xl font-black text-slate-900">#01</p>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">First Try</p>
                </div>
              </div>

              {/* Question Script */}
              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Response Breakdown
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Filter: All</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 px-2">
                  {attempt.questions.map((q, idx) => (
                    <div key={q.id} className={`p-8 transition-colors ${q.isCorrect ? 'hover:bg-emerald-50/30' : 'bg-rose-50/20 hover:bg-rose-50/40'}`}>
                      <div className="flex gap-6">
                        <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xs ${
                          q.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-4">
                          <h4 className="text-md font-bold text-slate-900 leading-tight">{q.question}</h4>
                          
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Analysis</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={`p-4 rounded-2xl border ${
                                q.isCorrect ? 'bg-white border-slate-200' : 'bg-white border-rose-200'
                              }`}>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                                  Submitted {q.isCorrect ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-rose-500" />}
                                </p>
                                <p className={`text-sm font-medium ${!q.isCorrect && 'line-through text-slate-400'}`}>{q.submittedAnswer}</p>
                              </div>
                              
                              {!q.isCorrect && (
                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2">Correct Answer</p>
                                  <p className="text-sm font-bold text-emerald-700">{q.correctAnswer}</p>
                                </div>
                              )}
                            </div>

                            {q.explanation && (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                                  <AlertCircle className="w-3 h-3" />
                                  Educator's Insight
                                </p>
                                <p className="text-xs text-slate-600 font-serif italic">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${q.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {q.isCorrect ? `+${q.pointValue}` : '0'} / {q.pointValue} PTS
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="space-y-8">
              
              {/* Guide Profile Card */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto overflow-hidden">
                    <User className="w-12 h-12" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl text-white shadow-lg border-2 border-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900">{attempt.guide.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">{attempt.guide.level}</p>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Attempt Date</p>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {attempt.stats.date}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Evaluator</p>
                    <p className="text-xs font-bold text-slate-700">Digital Auditor</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/guide/${attempt.guide.id}`)}
                  className="w-full mt-8 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 group"
                >
                  View Full Portfolio
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Evaluator Feedback Box */}
              <div className="bg-[#1E293B] rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                
                <h3 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3 relative z-10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Educator Feedback
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <textarea 
                    className="w-full h-44 p-5 rounded-3xl bg-white/5 border border-white/10 text-xs font-medium placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all"
                    placeholder="Provide specific feedback on guide performance, identifying knowledge gaps or areas for merit..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                      <Send className="w-4 h-4" />
                      Send to Guide
                    </button>
                    <button className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-slate-500 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Auto-saved: 12:45
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Internal Use Only</span>
                </div>
              </div>

              {/* Module Context */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  Module Context
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="text-slate-400">Difficulty</span>
                    <span className="text-rose-500 uppercase tracking-widest text-[9px]">Expert</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="text-slate-400">Category</span>
                    <span>{attempt.module.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 border-t border-slate-50 pt-3 mt-3">
                    <span className="text-slate-400">Total Weight</span>
                    <span>15% of Cert</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-8 right-8 animate-in slide-in-from-right duration-300 z-50">
              <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/10">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-0.5">Evaluation Recorded</p>
                  <p className="text-[10px] text-slate-400 font-medium">{toastMsg}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default QuizReviewDetailPage;