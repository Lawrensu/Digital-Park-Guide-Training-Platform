import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  Calendar,
  FileText,
  User,
  GraduationCap
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const QuizReviewsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for quiz attempts
  const attempts = [
    {
      id: "ATT-732",
      guideName: "Cherylynn Ng",
      module: "Tropical Forest Ecology",
      date: "Oct 24, 2023",
      score: "92%",
      status: "Pending",
      grade: "A",
      type: "Final Exam"
    },
    {
      id: "ATT-731",
      guideName: "Haidir Ali",
      module: "Endangered Wildlife Monitoring",
      date: "Oct 23, 2023",
      score: "85%",
      status: "Reviewed",
      grade: "B+",
      type: "Practical Audit"
    },
    {
      id: "ATT-730",
      guideName: "Sarah Wilkinson",
      module: "Emergency First Aid & Rescue",
      date: "Oct 22, 2023",
      score: "100%",
      status: "Reviewed",
      grade: "A+",
      type: "Simulation"
    },
    {
      id: "ATT-729",
      guideName: "Marcus Tan",
      module: "Cultural Heritage of Borneo",
      date: "Oct 22, 2023",
      score: "68%",
      status: "Needs Retake",
      grade: "D",
      type: "Oral Exam"
    },
    {
      id: "ATT-728",
      guideName: "Lim Wei Teck",
      module: "Advanced Navigation Systems",
      date: "Oct 21, 2023",
      score: "88%",
      status: "Pending",
      grade: "B",
      type: "Final Exam"
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Reviewed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Needs Retake':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reviewed':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      case 'Pending':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'Needs Retake':
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.guideName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          attempt.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attempt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Quiz Reviews</h1>
              <p className="text-slate-500 text-sm font-medium">Evaluate guide knowledge assessments and certification exams.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {attempts.filter(a => a.status === 'Pending').length} Pending Audits
                </span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search by guide name or module..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-[20px] text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="bg-slate-50 border-transparent rounded-[20px] px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Needs Retake">Needs Retake</option>
              </select>

              <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Guide Profile</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assessment Module</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date & Type</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Score/Grade</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform shadow-inner">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 leading-none mb-1.5">{attempt.guideName}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              ID: {attempt.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-serif italic text-slate-600 text-sm">
                        {attempt.module}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-300 text-[10px]" />
                            {attempt.date}
                          </div>
                          <div className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md w-fit inline-block">
                            {attempt.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-lg font-black text-slate-900 leading-none">{attempt.score}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Grade {attempt.grade}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center ${getStatusStyle(attempt.status)} shadow-sm`}>
                            {getStatusIcon(attempt.status)}
                            {attempt.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/quiz-review/${attempt.id}`)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                          >
                            View Scripts
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Showing {filteredAttempts.length} of {attempts.length} Audit Entries
              </p>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Next Page</button>
              </div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default QuizReviewsPage;