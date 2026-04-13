import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronDown,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  Plus,
  ArrowUpRight,
  Download,
  Mail
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const AdminCertificationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Eligible');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Mock data for certifications/eligibility
  const [eligibleGuides] = useState([
    {
      id: "CERT-901",
      name: "Cherylynn Ng",
      type: "Master Guide (Elite)",
      progress: "100%",
      quizStatus: "Completed (Avg 94%)",
      status: "Eligible",
      date: "Oct 24, 2023",
      region: "Taman Negara"
    },
    {
      id: "CERT-902",
      name: "Haidir Ali",
      type: "Senior Guide (Tropical)",
      progress: "100%",
      quizStatus: "Completed (Avg 88%)",
      status: "Eligible",
      date: "Oct 23, 2023",
      region: "Kinabalu Park"
    },
    {
      id: "CERT-903",
      name: "Sarah Wilkinson",
      type: "First Aid Instructor",
      progress: "90%",
      quizStatus: "Pending Assessment",
      status: "In Progress",
      date: "Oct 22, 2023",
      region: "Gunung Mulu"
    },
    {
      id: "CERT-904",
      name: "Marcus Tan",
      type: "Cultural Specialist",
      progress: "100%",
      quizStatus: "Completed (Avg 72%)",
      status: "Issued",
      date: "Oct 15, 2023",
      region: "Bako National Park"
    },
    {
      id: "CERT-905",
      name: "Lim Wei Teck",
      type: "Wetlands Specialist",
      progress: "100%",
      quizStatus: "Completed (Avg 96%)",
      status: "Pending Approval",
      date: "Oct 24, 2023",
      region: "Kuching"
    }
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Eligible':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'In Progress':
        return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Issued':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      case 'Eligible':
        return <Award className="w-3.5 h-3.5 mr-1.5" />;
      case 'In Progress':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'Pending Approval':
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

  const handleIssue = (name) => {
    setToastMsg(`Successfully issued certification for ${name}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredGuides = eligibleGuides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          guide.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || guide.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminProtected>
      <AdminLayout>
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Certifications</h1>
              <p className="text-slate-500 text-sm font-medium">Verify eligibility and issue professional guide certifications.</p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all hover:border-slate-300">
                <Download className="w-4 h-4" />
                Export Ledger
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all">
                <Plus className="w-4 h-4" />
                Bulk Issue
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Eligible Guides</p>
                <h3 className="text-3xl font-black text-slate-900">{eligibleGuides.filter(g => g.status === 'Eligible').length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Approval</p>
                <h3 className="text-3xl font-black text-slate-900">{eligibleGuides.filter(g => g.status === 'Pending Approval').length}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Issued This Month</p>
                <h3 className="text-3xl font-black text-slate-900">24</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Active Filtering */}
          <div className="bg-white p-4 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full text-slate-900 font-medium">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text"
                placeholder="Search guide name or certificate type..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-[20px] text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="bg-slate-50 border-transparent border-slate-200 rounded-[20px] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Eligible">Eligible</option>
                <option value="Issued">Issued</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="In Progress">In Progress</option>
              </select>

              <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table Ledger */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Guide Profile</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Certification Target</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion Status</th>
                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Eligibility Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verification actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuides.map((guide) => (
                    <tr key={guide.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform shadow-inner">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 leading-none mb-1.5">{guide.name}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              {guide.region}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{guide.type}</span>
                          <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Digital Auth ID: {guide.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${guide.progress === '100%' ? 'bg-emerald-500' : 'bg-primary'}`} 
                                style={{ width: guide.progress }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{guide.progress}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <FileText className="w-3 h-3" />
                            {guide.quizStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center ${getStatusStyle(guide.status)} shadow-sm`}>
                            {getStatusIcon(guide.status)}
                            {guide.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {guide.status === 'Eligible' ? (
                            <button 
                              onClick={() => navigate(`/issue-certificate/${guide.id}`)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-lg shadow-primary/20"
                            >
                              Issue Now
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                              Review Audits
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-colors border border-transparent">
                            <Mail className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Eligible for Issuance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ledger Verified</span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Page 1 of 4 • Updated {new Date().toLocaleTimeString()}
              </p>
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
                  <p className="text-xs font-black uppercase tracking-widest mb-0.5">Operation Success</p>
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

export default AdminCertificationsPage;