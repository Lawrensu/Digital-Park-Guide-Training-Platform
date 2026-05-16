import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Award, 
  Zap, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

/**
 * AdminLayout - The master shell for all Admin pages.
 * Includes fixed Sidebar, responsive Topbar, and Toast container.
 */
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
    { label: 'Analytics', icon: LayoutDashboard, path: '/analytics' },
    { label: 'Registrations', icon: UserPlus, path: '/registrations' },
    { label: 'Modules', icon: BookOpen, path: '/modules' },
    { label: 'Guides', icon: Users, path: '/guides' },
    { label: 'Quiz Reviews', icon: ClipboardCheck, path: '/quiz-reviews' },
    { label: 'Certifications', icon: Award, path: '/certificates-admin' },
    { label: 'IoT Alerts', icon: Zap, path: '/iot-alerts' },
    { label: 'Notifications', icon: Bell, path: '/notifications-admin' },
    { label: 'Settings / Admins', icon: Settings, path: '/settings-admin' },
  ];

  const handleSignOut = () => {
    // In a real app, clear tokens here
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* --- FIXED SIDEBAR (Desktop) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading font-black text-xl tracking-tighter leading-none">ParkAdmin</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Command Center</span>
            </div>
            <button className="lg:hidden ml-auto" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white'} />
                  <span className="font-bold text-sm">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8">
          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 -ml-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search records, modules, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm font-medium"
            />
          </div>

          {/* Utility / Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">Nur Azwan</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Senior Trainer</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* TOAST CONTAINER (Placeholder for real notification library integration) */}
      <div id="admin-toast-portal" className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3"></div>
    </div>
  );
}
