import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';

const TopNavbar = ({ onOpenSidebar }) => {
  return (
    <header className="h-16 lg:h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 left-0 lg:left-64 z-40">
      <div className="flex items-center lg:hidden">
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-900 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-gray-900">ParkGuide</span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center max-w-lg">
        <div className="relative w-full group">
          <label htmlFor="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors cursor-pointer">
            <Search size={18} />
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search for courses, lessons..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 group-hover:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-xl relative transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-transparent group-hover:ring-green-50 transition-all shadow-sm"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block"></div>
        
        <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="flex flex-col text-right mr-1 hidden sm:flex">
            <span className="text-xs font-semibold text-gray-900 group-hover:text-primary transition-colors">John Doe</span>
            <span className="text-[10px] text-gray-400 font-medium">Senior Guide</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-primary group-hover:text-primary transition-all overflow-hidden bg-[url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80')] bg-cover">
            {/* If no image, fallback to: <User size={18} /> */}
          </div>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
