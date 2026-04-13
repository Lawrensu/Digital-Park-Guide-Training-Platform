import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Inbox, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  Trash2,
  Check,
  Shield,
  User,
  Radio
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const mockNotifications = [
  {
    id: 1,
    type: 'alert',
    title: 'IoT Bridge Disconnection',
    message: 'Bridge #04 (Sector B) has lost connectivity. Backup protocols initiated.',
    time: '2 mins ago',
    unread: true,
    category: 'System',
    priority: 'high'
  },
  {
    id: 2,
    type: 'guide',
    title: 'New Guide Registration',
    message: 'Sarah Jenkins has completed the Forest Safety initial certification.',
    time: '45 mins ago',
    unread: true,
    category: 'Personnel',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'system',
    title: 'Server Maintenance',
    message: 'Scheduled maintenance complete. All services are currently operational.',
    time: '3 hours ago',
    unread: false,
    category: 'System',
    priority: 'low'
  },
  {
    id: 4,
    type: 'alert',
    title: 'High Temperature Warning',
    message: 'Sensor #102 reporting anomalous heat in storage unit 4. Investigation recommended.',
    time: '1 day ago',
    unread: false,
    category: 'Safety',
    priority: 'high'
  }
];

const AdminNotificationsPage = () => {
  const [selectedNotifId, setSelectedNotifId] = useState(mockNotifications[0].id);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = mockNotifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    if (filter === 'alerts') return n.type === 'alert';
    if (filter === 'system') return n.type === 'system';
    return true;
  });

  const selectedNotif = mockNotifications.find(n => n.id === selectedNotifId);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              Broadcast Center
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Centralized monitoring for system alerts and personnel updates
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {['all', 'unread', 'alerts', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-4">
          {/* List Sidebar */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 overflow-hidden">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Recent Inbox
                </h3>
                <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Mark all read</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {filteredNotifications.map((notif) => (
                  <button 
                    key={notif.id}
                    onClick={() => setSelectedNotifId(notif.id)}
                    className={`w-full text-left p-4 rounded-[24px] border transition-all duration-300 flex items-start gap-4 ${
                      selectedNotifId === notif.id 
                        ? 'bg-white border-primary shadow-xl shadow-primary/5 translate-x-1' 
                        : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'alert' ? 'bg-red-50 text-red-500' : 
                      notif.type === 'guide' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {notif.type === 'alert' ? <Radio size={18} /> : 
                       notif.type === 'guide' ? <User size={18} /> : <Shield size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`text-sm font-black truncate ${notif.unread ? 'text-slate-900' : 'text-slate-500'}`}>
                          {notif.title}
                        </h4>
                        {notif.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-slate-400 font-serif italic line-clamp-1 mb-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{notif.category}</span>
                        <span className="text-[10px] font-serif italic text-slate-300">{notif.time}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="hidden xl:flex xl:col-span-7 flex-col">
            {selectedNotif ? (
              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm h-full flex flex-col p-10 relative overflow-hidden">
                {/* Decorative pulse background for high priority */}
                {selectedNotif.priority === 'high' && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                )}
                
                <div className="flex items-center gap-3 mb-8">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                    selectedNotif.priority === 'high' ? 'bg-red-50 border-red-100 text-red-500' : 
                    selectedNotif.priority === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-500' : 'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    {selectedNotif.priority} Priority
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    {selectedNotif.category}
                  </div>
                </div>

                <h2 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-tight mb-6">
                  {selectedNotif.title}
                </h2>

                <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-50">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 italic">Timestamped Action</div>
                    <div className="text-sm font-black text-slate-900">{selectedNotif.time} (Logged System Event)</div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-slate-600 font-serif leading-relaxed text-lg italic bg-slate-50/50 p-8 rounded-[32px] border border-slate-50 border-dashed">
                    "{selectedNotif.message}"
                  </p>
                </div>

                <div className="mt-8 flex gap-3 pt-8 border-t border-slate-50">
                  <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                    Resolve Indicator
                  </button>
                  <button className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[40px] border border-slate-200 border-dashed h-full flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-6">
                  <Inbox size={40} />
                </div>
                <h3 className="font-heading font-black text-xl text-slate-400 mb-2">No Selection</h3>
                <p className="text-slate-300 font-serif text-sm italic">Select a notification from the sidebar to view full diagnostic details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotificationsPage;
