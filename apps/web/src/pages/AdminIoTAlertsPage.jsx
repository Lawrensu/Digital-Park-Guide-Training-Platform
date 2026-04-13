import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Activity, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Thermometer,
  Wind,
  CheckCircle2,
  BellRing,
  MoreVertical,
  Radio,
  Eye
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const AdminIoTAlertsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const alerts = [
    {
      id: "IOT-101",
      type: "High Temperature",
      severity: "Critical",
      location: "North Ridge Trail - Sector 4",
      time: "2 mins ago",
      status: "Active",
      icon: Thermometer,
      description: "Ambient sensor T-04 reporting 42°C (108°F). High fire risk detected."
    },
    {
      id: "IOT-102",
      type: "SOS Signal",
      severity: "Emergency",
      location: "Eagle Peak Lookout",
      time: "15 mins ago",
      status: "Active",
      icon: ShieldAlert,
      description: "Guide G-2489 triggered panic button. Manual assist requested."
    },
    {
      id: "IOT-103",
      type: "Air Quality Drop",
      severity: "Warning",
      location: "Central Valley - Camp B",
      time: "45 mins ago",
      status: "Active",
      icon: Wind,
      description: "PM2.5 levels exceeding safety threshold of 50µg/m³."
    },
    {
      id: "IOT-104",
      type: "Water Level",
      severity: "Normal",
      location: "River Crossing Delta",
      time: "2 hours ago",
      status: "Resolved",
      icon: Activity,
      description: "Flood sensor reported 15cm rise, has now returned to seasonal baseline."
    },
    {
      id: "IOT-105",
      type: "System Heartbeat",
      severity: "Critical",
      location: "West Gate Access Point",
      time: "5 hours ago",
      status: "Active",
      icon: Zap,
      description: "Gateway router offline. Loss of connectivity for 12 local sensors."
    }
  ];

  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'emergency': return 'bg-red-500 text-white shadow-red-200';
      case 'critical': return 'bg-orange-500 text-white shadow-orange-200';
      case 'warning': return 'bg-amber-400 text-white shadow-amber-100';
      default: return 'bg-emerald-500 text-white shadow-emerald-100';
    }
  };

  const getStatusStyle = (status) => {
    return status === 'Active' 
      ? 'bg-rose-50 text-rose-600 border-rose-100' 
      : 'bg-slate-50 text-slate-500 border-slate-200';
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <AdminProtected>
      <AdminLayout userRole="admin">
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
          
          {/* Header & Status Cards */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <Radio className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">IoT Alert Center</h1>
              </div>
              <p className="text-slate-500 text-sm font-medium">Real-time environmental monitoring and telemetry feeds.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white px-6 py-4 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Alerts</p>
                  <p className="text-xl font-black text-slate-900">12</p>
                </div>
              </div>
              <div className="bg-white px-6 py-4 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sensor Uptime</p>
                  <p className="text-xl font-black text-slate-900">99.8%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtering Engine */}
          <div className="bg-white p-5 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Monitor specific location or sensor type..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[24px] text-sm focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                <select 
                  className="bg-slate-50 px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none border-none hover:bg-slate-100 transition-colors"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="All">All Severity</option>
                  <option value="Emergency" className="text-red-600">Emergency</option>
                  <option value="Critical" className="text-orange-600">Critical</option>
                  <option value="Warning" className="text-amber-600">Warning</option>
                  <option value="Normal" className="text-emerald-600">Normal</option>
                </select>

                <select 
                  className="bg-slate-50 px-6 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none border-none hover:bg-slate-100 transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Alert Feed */}
          <div className="grid grid-cols-1 gap-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="group bg-white p-2 rounded-[32px] border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center gap-6"
                >
                  {/* Severity Indicator */}
                  <div className={`w-2 md:w-3 md:self-stretch rounded-full ${getSeverityStyle(alert.severity)} shrink-0 mx-2 md:mx-0`}></div>
                  
                  {/* Alert Icon & Type */}
                  <div className="flex items-center gap-6 flex-1 px-4 py-4 md:py-0">
                    <div className="w-16 h-16 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                      <alert.icon className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{alert.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 font-black text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Actions */}
                  <div className="md:w-1/3 px-8 text-sm text-slate-500 font-medium italic hidden lg:block">
                    "{alert.description.substring(0, 80)}..."
                  </div>

                  <div className="flex items-center gap-3 px-6 pb-6 md:pb-0">
                    <button 
                      onClick={() => navigate(`/iot-alert/${alert.id}`)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Log
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 py-20 rounded-[40px] text-center space-y-4 border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight">No alerts match search</p>
                  <p className="text-slate-400 text-sm font-medium">Try adjusting your filters or search criteria.</p>
                </div>
                <button 
                  onClick={() => {setSearchTerm(''); setStatusFilter('All'); setSeverityFilter('All');}}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Infrastructure Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-rose-900/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="space-y-1 relative">
                 <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Critical Infrastructure</p>
                 <h2 className="text-2xl font-black uppercase leading-none">Gateway Monitor</h2>
               </div>
               <div className="flex items-center justify-between relative">
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                     <span className="text-[11px] font-black uppercase tracking-widest">Aura-Mesh Network: Online</span>
                   </div>
                   <div className="flex items-center gap-3 opacity-50">
                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                     <span className="text-[11px] font-black uppercase tracking-widest">LoRa Backup: standby</span>
                   </div>
                 </div>
                 <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                   Manage Devices
                 </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">System Resolution Ratio</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Avg resolve time: 14m 22s</p>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 w-[88%] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>
              </div>
            </div>
          </div>

        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default AdminIoTAlertsPage;
