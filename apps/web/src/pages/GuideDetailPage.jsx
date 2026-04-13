import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  MessageSquare,
  FileText,
  User,
  Settings,
  ShieldCheck,
  TrendingUp,
  History,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const GuideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  // Mock data - In a real app, this would fetch from an API based on 'id'
  useEffect(() => {
    const mockGuides = [
      {
        id: 'G-101',
        name: 'Cherylynn Ng',
        email: 'cherylynn.ng@nationalparks.gov.my',
        phone: '+60 12-349 8877',
        region: 'Taman Negara',
        department: 'Tropical Forest Ecology',
        certification: 'Senior Guide',
        status: 'Active',
        joinedDate: '2023-05-15',
        progress: 85,
        modulesCompleted: 12,
        totalModules: 14,
        avgQuizScore: 92,
        lastActive: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
        stats: {
          quizzesTaken: 24,
          certificationsEarned: 3,
          trainingHours: 156
        },
        performance: [
          { subject: 'Flora Identification', score: 98 },
          { subject: 'First Aid & Rescue', score: 100 },
          { subject: 'Cultural Heritage', score: 88 },
          { subject: 'Wildlife Monitoring', score: 92 },
          { subject: 'Navigation Basics', score: 85 }
        ],
        activityLog: [
          { id: 1, type: 'quiz', item: 'Module 12: Tropical Canopy Ecology', date: '2024-04-10', result: '95%' },
          { id: 2, type: 'module', item: 'Completed: Night Safari Protocols', date: '2024-04-08', result: 'Completed' },
          { id: 3, type: 'cert', item: 'Renewed: Advanced Wilderness First Aid', date: '2024-03-25', result: 'Success' },
          { id: 4, type: 'login', item: 'Mobile Application Login', date: '2024-04-12', result: 'Normal' }
        ]
      }
    ];

    const foundGuide = mockGuides.find(g => g.id === id) || mockGuides[0];
    setGuide(foundGuide);
  }, [id]);

  if (!guide) return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Loading guide profile...</div>;

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-8 max-w-7xl mx-auto">
          
          {/* Breadcrumb & Navigation */}
          <button 
            onClick={() => navigate('/guides')}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Guides Directory
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm mb-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
              <div className="relative">
                <img 
                  src={guide.image} 
                  alt={guide.name}
                  className="w-32 h-32 rounded-[24px] object-cover border-4 border-slate-50 shadow-inner"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-2 border-white shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{guide.name}</h1>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 translate-y-[-2px]">
                    <Award className="w-3 h-3" />
                    {guide.certification}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border translate-y-[-2px] ${
                    guide.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {guide.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 mt-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{guide.region}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-serif italic text-slate-500">{guide.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{guide.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Joined {guide.joinedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                  <Mail className="w-4 h-4" />
                  Contact Guide
                </button>
                <button className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900">
                  <Settings className="w-4 h-4" />
                  Privileges
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Metrics & Progress */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Performance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Training Progress</p>
                  <div className="flex items-end justify-between relative">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">{guide.progress}%</h3>
                    <div className="flex items-center text-primary text-[10px] font-black uppercase mb-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +4%
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${guide.progress}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Avg. Quiz Score</p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{guide.avgQuizScore}%</h3>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">Mastery</span>
                    <span className="text-[9px] font-medium text-slate-400 italic font-serif">vs 78% average</span>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Modules Finished</p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{guide.modulesCompleted}/{guide.totalModules}</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-4">2 modules in progress</p>
                </div>
              </div>

              {/* Subject Mastery Radar (Simplified) */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Subject Mastery Analysis
                  </h3>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full Analytics</button>
                </div>
                
                <div className="space-y-6">
                  {guide.performance.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">{item.subject}</span>
                        <span className="text-sm font-black text-slate-900">{item.score}%</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 delay-${idx * 100} ${item.score >= 90 ? 'bg-primary' : 'bg-slate-400'}`} 
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                    <History className="w-5 h-5 text-primary" />
                    Training Activity Log
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Frequency: 5m</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {guide.activityLog.map((log) => (
                    <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center gap-6 group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        log.type === 'quiz' ? 'bg-purple-50 text-purple-600' :
                        log.type === 'cert' ? 'bg-amber-50 text-amber-600' :
                        log.type === 'module' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.type === 'quiz' ? <FileText className="w-6 h-6" /> : 
                         log.type === 'cert' ? <Award className="w-6 h-6" /> :
                         log.type === 'module' ? <BookOpen className="w-6 h-6" /> :
                         <User className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 mb-0.5">{log.item}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.date} • {log.type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          log.result === 'Success' || log.result.includes('%') 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' 
                          : 'bg-slate-900 text-white border-slate-900'
                        }`}>
                          {log.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-slate-50 text-center">
                  <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">Generate Complete Audit Trail</button>
                </div>
              </div>
            </div>

            {/* Right Column: Decisions & Context */}
            <div className="space-y-8">
              
              {/* Decision Panel */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Management Decisions
                </h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 transition-all text-left shadow-sm hover:shadow-md group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">Review Submissions</p>
                        <p className="text-[10px] text-slate-400 font-serif italic">3 pending attempts</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-200 transition-all text-left shadow-sm hover:shadow-md group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">Issue Certification</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase">Eligible for Master</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-200 transition-all text-left shadow-sm hover:shadow-md group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-900">Flag Profiling</p>
                        <p className="text-[10px] text-slate-400 font-serif italic">Audit required</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
                  </button>
                </div>
              </div>

              {/* Internal Supervisor Notes */}
              <div className="bg-[#1E293B] rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <h3 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3 relative z-10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Supervisor Intel
                </h3>
                <textarea 
                  className="w-full h-40 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all relative z-10"
                  placeholder="Record confidential training feedback or performance bottlenecks..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                ></textarea>
                <div className="flex items-center justify-between mt-6 relative z-10">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3  h-3" />
                    Last edit: 14:02 PM
                  </span>
                  <button className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Save Note</button>
                </div>
              </div>

              {/* Certification Milestones */}
              <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Upcoming Career Milestone
                </h3>
                <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Master Guide Elite</span>
                      <span className="text-[10px] font-black text-primary">75% Complete</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Final module: Rainforest Canopy Navigation
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default GuideDetailPage;
