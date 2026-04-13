import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Trash2,
  Navigation,
  Send,
  MessageSquare,
  Cpu,
  Zap,
  History,
  Info,
  ArrowUpRight
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import AdminProtected from '../components/AdminProtected';

const AdminIoTAlertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  // Mock Alert Detail Data
  const alertDetail = {
    id: id || "IOT-102",
    type: "SOS Signal",
    severity: "Emergency",
    location: "Eagle Peak Lookout",
    coordinates: "41.40338, 2.17403",
    timestamp: "April 12, 2026 - 14:22:45",
    device: {
      id: "G-DEV-2489",
      type: "Guide Mesh-Transceiver",
      model: "Aura-X1 Park Edition",
      firmware: "v4.2.1-stable",
      battery: "68%",
      signalStrength: "-92 dBm (Poor)"
    },
    owner: {
      name: "Cherylynn Ng",
      title: "Master Guide (Elite)",
      id: "GUIDE-901"
    },
    incidentDescription: "Manual SOS trigger detected. Sequence: 3 short pulses, 3 long pulses. Device state: Stationary. Heart rate telemetry spiking (112 BPM). Possible visitor injury or trail obstruction.",
    history: [
      { time: "14:22:45", event: "Emergency SOS triggered by Guide-901", status: "Critical" },
      { time: "14:23:10", event: "Gateway NW-Sector-4 acknowledged signal", status: "System" },
      { time: "14:25:00", event: "Admin reviewed incident details", status: "Active" },
    ],
    notes: [
      { author: "Zack (Ops)", text: "Rescue team dispatched to Sector 4. Estimated ETA: 12 minutes.", time: "14:26:15" }
    ]
  };

  const handleResolve = () => {
    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      navigate('/iot-alerts');
    }, 1500);
  };

  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'emergency': return 'bg-red-500 text-white shadow-xl shadow-red-200';
      case 'critical': return 'bg-orange-500 text-white shadow-xl shadow-orange-200';
      case 'warning': return 'bg-amber-400 text-white shadow-xl shadow-amber-100';
      default: return 'bg-emerald-500 text-white shadow-xl shadow-emerald-100';
    }
  };

  return (
    <AdminProtected>
      <AdminLayout userRole="admin">
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
          
          {/* Header & Main Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => navigate('/iot-alerts')}
                className="w-12 h-12 bg-white border border-slate-200 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Incident Report {alertDetail.id}</h1>
                  <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${getSeverityStyle(alertDetail.severity)}`}>
                    {alertDetail.severity}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {alertDetail.timestamp}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <ArrowUpRight className="w-4 h-4" />
                Escalate Level
              </button>
              <button 
                onClick={handleResolve}
                disabled={isResolving}
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {isResolving ? 'Processing...' : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Summary & Map */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Context Summary */}
              <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      Alert Description
                    </h2>
                    <p className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                      {alertDetail.type} - {alertDetail.location}
                    </p>
                    <p className="text-slate-600 font-medium leading-relaxed italic text-lg">
                      "{alertDetail.incidentDescription}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      Geospatial Data
                    </h2>
                    <div className="bg-slate-950 h-40 rounded-[32px] overflow-hidden relative border-4 border-white shadow-2xl">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
                       {/* Mock Map View */}
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="relative">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-full animate-ping"></div>
                            <MapPin className="w-6 h-6 text-rose-500 absolute top-3 left-3" />
                         </div>
                       </div>
                       <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                         Coord: {alertDetail.coordinates}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Timeline */}
              <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                    <History className="w-4 h-4" />
                  </div>
                  System Audit Log
                </h2>
                <div className="space-y-8">
                  {alertDetail.history.map((item, idx) => (
                    <div key={idx} className="flex gap-6 relative">
                      {idx !== alertDetail.history.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-slate-100"></div>
                      )}
                      <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 z-10 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 flex items-center justify-between pb-4 border-b border-dashed border-slate-100">
                         <div>
                           <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.event}</p>
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.time}</p>
                         </div>
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                           item.status === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                         }`}>
                           {item.status}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Device & Internal Communications */}
            <div className="space-y-6">
              
              {/* Source Information */}
              <div className="bg-slate-900 p-8 rounded-[48px] text-white space-y-8 shadow-2xl">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <Cpu className="w-4 h-4" />
                   </div>
                   Hardware Telemetry
                 </h2>
                 
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                       <Radio className="w-6 h-6 text-rose-400" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Device Source</p>
                       <p className="text-sm font-black uppercase">{alertDetail.device.type}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-1">Battery</p>
                        <div className="flex items-center gap-2">
                           <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 w-[68%]"></div>
                           </div>
                           <span className="text-xs font-black">{alertDetail.device.battery}</span>
                        </div>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 mb-1">Signal strength</p>
                        <p className="text-xs font-black text-rose-400">Poor</p>
                     </div>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-black text-xs border border-white/10">
                         {alertDetail.owner.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Registered User</p>
                         <p className="text-sm font-black">{alertDetail.owner.name}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                     <MessageSquare className="w-4 h-4" />
                   </div>
                   Internal Notes
                 </h2>
                 
                 <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {alertDetail.notes.map((n, idx) => (
                     <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 flex justify-between">
                          <span>{n.author}</span>
                          <span>{n.time}</span>
                        </p>
                        <p className="text-sm font-medium text-slate-700 italic">"{n.text}"</p>
                     </div>
                   ))}
                 </div>

                 <div className="relative pt-4">
                   <textarea 
                     placeholder="Add tactical update..."
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-slate-900/5 min-h-[100px] outline-none"
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                   />
                   <button className="absolute bottom-4 right-4 p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all">
                     <Send className="w-4 h-4" />
                   </button>
                 </div>

                 <button className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-rose-200 hover:text-rose-500 transition-all flex items-center justify-center gap-2">
                   <Radio className="w-4 h-4" />
                   Broadcast to nearby guides
                 </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default AdminIoTAlertDetailPage;
