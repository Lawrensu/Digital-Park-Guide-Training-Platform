import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  LogOut,
  Trash2,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for toggles
  const [notifications, setNotifications] = useState({
    email: true,
    courses: true,
    certs: false
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Full-page Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
          alt="Park background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/20 via-transparent to-primary-dark/60"></div>
      </div>

      <Sidebar 
        activeItem="Settings" 
        onSignOut={() => navigate('/login')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 relative z-10">
        <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 mt-16 max-w-[1200px] mx-auto w-full">
          {/* 1. SETTINGS HEADER */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-heading font-black text-4xl text-white mb-2 drop-shadow-md flex items-center justify-center lg:justify-start gap-4">
              <SettingsIcon size={36} className="text-white" />
              Settings
            </h1>
            <p className="text-white/90 font-serif text-lg drop-shadow-sm">
              Manage your account preferences and security
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Account & Security (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* 2. ACCOUNT SETTINGS CARD */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 lg:p-10 shadow-2xl border border-white/50">
                <h3 className="font-heading font-black text-xl text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                   <User className="text-primary" size={24} />
                   Account Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="John Doe"
                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-black text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="john.doe@parkguide.gov"
                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-black text-gray-800"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg flex items-center gap-2">
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. SECURITY SETTINGS */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 lg:p-10 shadow-2xl border border-white/50">
                <h3 className="font-heading font-black text-xl text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                   <Shield className="text-primary" size={24} />
                   Security Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password"
                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="Confirm new password"
                        className="w-full p-4 bg-gray-50/50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. DANGER ZONE */}
              <div className="bg-red-50/90 backdrop-blur-md rounded-[40px] p-8 lg:p-10 shadow-2xl border border-red-100/50">
                <h3 className="font-heading font-black text-xl text-red-600 mb-4 flex items-center gap-3 uppercase tracking-tight">
                   Danger Zone
                </h3>
                <p className="text-red-500/80 font-serif mb-8 text-sm italic">
                  Critical actions for your account. Please proceed with caution.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">
                    <Trash2 size={18} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Notifications & Preferences (4/12) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* 3. NOTIFICATION SETTINGS */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border border-white/50">
                <h3 className="font-heading font-black text-lg text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                   <Bell className="text-primary" size={20} />
                   Notifications
                </h3>
                
                <div className="space-y-6">
                  {Object.entries({
                    email: 'Email Notifications',
                    courses: 'Course Updates',
                    certs: 'Certification Alerts'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <span className="font-black text-sm text-gray-700">{label}</span>
                      <button 
                        onClick={() => toggleNotification(key)}
                        className={`w-14 h-8 rounded-full relative transition-all duration-300 ${notifications[key] ? 'bg-primary shadow-inner shadow-primary-dark/20' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${notifications[key] ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. PREFERENCES */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border border-white/50">
                <h3 className="font-heading font-black text-lg text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                   <Globe className="text-primary" size={20} />
                   Preferences
                </h3>
                
                <div className="space-y-8">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Theme selection</span>
                    <div className="flex p-1 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-white shadow-md text-primary' : 'text-gray-400'}`}
                      >
                        <Sun size={16} />
                        Light
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white shadow-md text-primary' : 'text-gray-400'}`}
                      >
                        <Moon size={16} />
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Language</span>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-gray-50 rounded-2xl px-4 py-4 focus:outline-none font-black text-sm text-gray-800 cursor-pointer shadow-sm hover:border-primary/20 transition-all appearance-none"
                    >
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                      <option>German (DE)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center gap-3 text-green-600 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                    <CheckCircle2 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Settings sync active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
