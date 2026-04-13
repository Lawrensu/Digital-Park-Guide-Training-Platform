import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  Globe,
  Settings,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const mockAdmins = [
  { id: 1, name: 'Nur Azwan', email: 'nur.azwan@parkadmin.com', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago', image: 'https://i.pravatar.cc/150?u=azwan' },
  { id: 2, name: 'Elena Rodriguez', email: 'elena.rodriguez@parkadmin.com', role: 'Admin', status: 'Active', lastActive: '4 hours ago', image: 'https://i.pravatar.cc/150?u=elena' },
  { id: 3, name: 'Marcus Chen', email: 'marcus.chen@parkadmin.com', role: 'Security Admin', status: 'Offline', lastActive: '1 day ago', image: 'https://i.pravatar.cc/150?u=marcus' },
];

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'management', label: 'Admin Management', icon: Shield },
    { id: 'notifications', label: 'Notification Settings', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Lock },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="font-heading font-black text-3xl text-slate-900 tracking-tight leading-none mb-2">
              System Settings
            </h1>
            <p className="text-slate-500 font-serif text-sm italic">
              Manage your administrative profile and platform permissions
            </p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* My Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img src="https://i.pravatar.cc/150?u=azwan" alt="Profile" className="w-full h-full rounded-[40px] border-4 border-slate-50 shadow-inner object-cover" />
                    <button className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-4 border-white hover:bg-primary-dark transition-all">
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-1">Nur Azwan</h3>
                  <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4">Super Admin</p>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 border border-slate-100">
                    <Globe size={14} />
                    <span className="text-[11px] font-black uppercase tracking-widest">GMT +8 Kuala Lumpur</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                    <UserCheck size={16} className="text-primary" /> Personnel Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <input type="text" defaultValue="Nur Azwan" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <input type="email" defaultValue="nur.azwan@parkadmin.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Management Tab */}
          {activeTab === 'management' && (
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight leading-none mb-2">Team Directory</h3>
                  <p className="text-slate-400 font-serif text-xs italic">System administrators with platform-wide permissions</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Plus size={14} /> Add New Admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 italic">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest w-1/3">Administrator</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">System Role</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={admin.image} alt={admin.name} className="w-10 h-10 rounded-xl" />
                            <div>
                              <div className="text-sm font-black text-slate-900 mb-0.5">{admin.name}</div>
                              <div className="text-xs text-slate-500 font-serif">{admin.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            admin.role === 'Super Admin' ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${admin.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{admin.status}</span>
                            <span className="text-[10px] text-slate-400 font-serif italic mb-0.5 ml-1">({admin.lastActive})</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm">
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => setShowDeleteModal(admin)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <Bell size={16} className="text-primary" /> Delivery Preferences
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Security Alerts', desc: 'Login attempts from new devices or locations', icon: ShieldCheck },
                  { label: 'Admin Activity', desc: 'When other administrators perform critical platform changes', icon: ActivityIcon },
                  { label: 'System Health', desc: 'Updates on IoT bridge connectivity and server status', icon: AlertCircle },
                ].map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <pref.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">{pref.label}</h4>
                        <p className="text-xs text-slate-400 font-serif italic">{pref.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                  <Lock size={16} className="text-primary" /> Credential Rotation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                  Update Authentication
                </button>
              </div>

              <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest text-red-500 mb-2 flex items-center gap-2">
                   Danger Zone
                </h3>
                <p className="text-xs text-red-600/70 font-serif italic mb-6">Irreversible actions regarding your administrative access</p>
                <button className="px-8 py-4 bg-white text-red-600 border border-red-200 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-red-600 hover:text-white transition-all">
                  Deactivate My Admin Access
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative">
            <h2 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Onboard New Admin</h2>
            <p className="text-slate-400 font-serif text-sm italic mb-8">Specify permissions and send an invitation link</p>
            
            <div className="space-y-6 mb-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role Allocation</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-serif focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none">
                  <option>Administrator</option>
                  <option>Security Admin</option>
                  <option>Editor</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h2 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tight">Revoke Access?</h2>
            <p className="text-slate-500 font-serif text-sm italic mb-8 leading-relaxed">
              You are about to remove <span className="font-bold text-slate-900 not-italic">{showDeleteModal.name}</span>. This will immediately terminate their administrative sessions.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Keep Active
              </button>
              <button className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                Kill Access
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

function ActivityIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default AdminSettingsPage;
