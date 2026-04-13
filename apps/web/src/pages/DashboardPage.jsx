import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { BookOpen, Clock, TrendingUp, AlertCircle, ChevronRight, Award } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      {/* Sidebar - Fixed Left */}
      <Sidebar 
        activeItem="Dashboard" 
        onSignOut={() => navigate('/login')} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area - Scrollable Right */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 relative z-10">
        <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 mt-16 max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: Main Content (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* 1. HERO SECTION */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl rounded-[32px] py-12 px-10 relative overflow-hidden group" noPadding>
                {/* Decorative background pattern/overlay */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl z-0 transition-all duration-700 group-hover:bg-primary/30"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 leading-tight drop-shadow-md">
                      Welcome back, Colin!
                    </h1>
                    <p className="text-white/90 text-lg font-normal leading-relaxed drop-shadow-sm">
                      Ready for your next adventure? You have <span className="font-bold text-green-300 underline decoration-green-400 underline-offset-4">2 pending courses</span> to complete your Senior Park Guide Certification.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button 
                      onClick={() => navigate('/courses')}
                      className="bg-white text-primary-dark px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-white/20 transform hover:-translate-y-1"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              </Card>

              {/* 2. TRAINING PROGRESS CARD */}
              <Card className="rounded-[32px] bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
                <div className="flex items-center gap-2 mb-6 text-gray-800">
                  <div className="text-green-600">
                    <TrendingUp size={24} />
                  </div>
                  <h2 className="font-heading font-bold text-xl uppercase tracking-tight">Training Progress</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50/50 backdrop-blur-sm rounded-2xl p-6 border border-green-100 flex flex-col gap-1 transition-all hover:bg-green-100/50">
                    <span className="text-[11px] font-black text-green-600 mb-1 uppercase tracking-widest leading-none">Completed Modules</span>
                    <span className="text-4xl font-black text-primary-dark">12</span>
                  </div>
                  
                  <div className="bg-orange-50/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 flex flex-col gap-1 transition-all hover:bg-orange-100/50">
                    <span className="text-[11px] font-black text-orange-600 mb-1 uppercase tracking-widest leading-none">In Progress</span>
                    <span className="text-4xl font-black text-orange-700">2</span>
                  </div>
                  
                  <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 flex flex-col gap-1 transition-all hover:bg-gray-100/50">
                    <span className="text-[11px] font-black text-gray-400 mb-1 uppercase tracking-widest leading-none">Total Hours</span>
                    <span className="text-4xl font-black text-gray-800">48.5</span>
                  </div>
                </div>
              </Card>

              {/* 3. CONTINUE LEARNING SECTION */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="font-heading font-bold text-2xl text-white drop-shadow-md">Continue Learning</h2>
                  <button 
                    onClick={() => navigate('/courses')}
                    className="text-green-300 font-bold text-sm hover:text-white flex items-center gap-1 group transition-colors"
                  >
                    View all <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Module 1 */}
                  <Card noPadding className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-[32px] overflow-hidden flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl">
                    <div className="h-48 overflow-hidden relative bg-green-50">
                      <img 
                        src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop" 
                        alt="Forest"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x400?text=Forest+Biodiversity';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Module 1</div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="font-heading font-black text-xl text-gray-900 leading-tight">Forest Biodiversity Basics</h3>
                      <p className="text-gray-500 text-base line-clamp-2 font-serif">Deep dive into the delicate ecosystems found in temperate rainforests and conservation strategies.</p>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-widest text-gray-400">
                          <span>Progress</span>
                          <span className="text-primary-dark">60%</span>
                        </div>
                        <ProgressBar progress={60} />
                      </div>
                    </div>
                  </Card>

                  {/* Module 2 */}
                  <Card noPadding className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-[32px] overflow-hidden flex flex-col h-full group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl">
                    <div className="h-48 overflow-hidden relative bg-green-50">
                      <img 
                        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=800&auto=format&fit=crop" 
                        alt="Eco-Tourism"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/800x400?text=Eco-Tourism';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Module 2</div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="font-heading font-black text-xl text-gray-900 leading-tight">Eco-Tourism Management</h3>
                      <p className="text-gray-500 text-base line-clamp-2 font-serif">Learning how to balance visitor experience with habitat protection and sustainable development.</p>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-widest text-gray-400">
                          <span>Progress</span>
                          <span className="text-primary-dark">15%</span>
                        </div>
                        <ProgressBar progress={15} />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column: Stacked Cards (4/12) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* A. CERTIFICATION CARD */}
              <Card className="rounded-[32px] bg-white/90 backdrop-blur-sm border border-white/50 shadow-xl flex flex-col items-center p-10">
                <div className="bg-green-100/50 p-6 rounded-3xl mb-6 shadow-inner">
                  <Award size={40} className="text-primary-dark" />
                </div>
                <h2 className="font-heading font-black text-2xl text-gray-900 mb-2">Senior Guide Cert</h2>
                <p className="text-gray-500 text-sm text-center mb-8 max-w-[240px] font-serif leading-relaxed italic">Complete 2 more modules to unlock your official certification.</p>
                
                {/* Circular Progress Overlay */}
                <div className="relative w-36 h-36 mb-10 group">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-lg">
                    <circle cx="72" cy="72" r="64" stroke="#F1F8F1" strokeWidth="12" fill="transparent" />
                    <circle cx="72" cy="72" r="64" stroke="#2E7D32" strokeWidth="12" fill="transparent" strokeDasharray="402" strokeDashoffset={402 - (402 * 85 / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform">
                    <span className="text-3xl font-black text-gray-800">85%</span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Ready</span>
                  </div>
                </div>
                
                <button className="w-full bg-primary-dark text-white font-black py-4 px-6 rounded-2xl text-sm hover:bg-primary transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1">
                  View Enrollment Details
                </button>
              </Card>

              {/* B. RECENT ANNOUNCEMENTS CARD */}
              <Card className="rounded-[32px] bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading font-black text-xl text-gray-900 uppercase tracking-tight">Announcements</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 flex gap-4 border border-orange-100 group cursor-pointer hover:bg-orange-50/50 transition-all transform hover:-translate-x-1">
                    <div className="bg-orange-100 p-2.5 rounded-xl h-fit text-orange-600 shadow-sm">
                      <AlertCircle size={22} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-sm leading-tight">New Protocol Update</h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">2 hours ago</p>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 flex gap-4 border border-blue-100 group cursor-pointer hover:bg-blue-50/50 transition-all transform hover:-translate-x-1">
                    <div className="bg-blue-100 p-2.5 rounded-xl h-fit text-blue-600 shadow-sm">
                      <BookOpen size={22} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-sm leading-tight">Safety Guidelines Vol 3</h4>
                      <p className="text-[11px] font-bold text-blue-600 mt-1 uppercase tracking-widest">Yesterday</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

