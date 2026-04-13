import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut,
  User,
  X,
  Bell,
  Radio
} from 'lucide-react';

const Sidebar = ({ activeItem, onSignOut, isOpen, onClose, userRole = 'guide' }) => {
  const location = useLocation();
  
  const guideItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Certifications', icon: Award, path: '/certificates' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const adminItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
    { name: 'Registrations', icon: User, path: '/registrations' },
    { name: 'Curriculum', icon: BookOpen, path: '/modules' },
    { name: 'Guides', icon: Award, path: '/guides' },
    { name: 'Quiz Reviews', icon: BookOpen, path: '/quiz-reviews' },
    { name: 'Certifications', icon: Award, path: '/certificates-admin' },
    { name: 'IoT Alerts', icon: Radio, path: '/iot-alerts' },
    { name: 'Notifications', icon: Bell, path: '/notifications-admin' },
    { name: 'Settings', icon: Settings, path: '/settings-admin' },
  ];

  const menuItems = userRole === 'admin' ? adminItems : guideItems;

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link to={userRole === 'admin' ? "/admin-dashboard" : "/dashboard"} className="flex items-center gap-2">
            <div className={`w-8 h-8 ${userRole === 'admin' ? 'bg-slate-900' : 'bg-primary'} rounded-lg flex items-center justify-center text-white shrink-0`}>
              {userRole === 'admin' ? <Settings size={20} /> : <BookOpen size={20} />}
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
              {userRole === 'admin' ? 'ParkAdmin' : 'ParkGuide'}
            </span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name || location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-sm uppercase tracking-widest ${
                  isActive
                    ? 'bg-primary/10 text-primary scale-105 shadow-sm'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-primary' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar (Fixed) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Slide-in) */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-[60] lg:hidden transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
