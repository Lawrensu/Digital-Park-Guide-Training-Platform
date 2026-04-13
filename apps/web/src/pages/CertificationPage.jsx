import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopNavbar from '../components/TopNavbar'
import CertificateCard from '../components/CertificateCard'
import Button from '../components/Button'
import { certificationsData } from '../data/courses'
import { useNavigate } from 'react-router-dom'
import { Award, ArrowRight, Star, Globe, Smartphone } from 'lucide-react'

export default function CertificationPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const activeCertificates = certificationsData.filter(c => c.status === 'active')

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
        activeItem="Certifications" 
        onSignOut={() => navigate('/login')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 relative z-10">
        <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 mt-16 max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading font-black text-4xl text-white mb-2 drop-shadow-md">
              Your Certifications
            </h1>
            <p className="text-white/90 font-serif text-lg drop-shadow-sm">
              View and manage your earned certificates and credentials
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Stats Grid - Horizontal like Dashboard Training Progress */}
              <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/50">
                <div className="flex items-center gap-2 mb-8 text-gray-800">
                  <div className="text-green-600">
                    <Award size={24} />
                  </div>
                  <h2 className="font-heading font-black text-xl uppercase tracking-tight">Credentials Summary</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50/50 backdrop-blur-sm rounded-2xl p-6 border border-green-100 flex flex-col gap-1 transition-all hover:bg-green-100/50">
                    <span className="text-[11px] font-black text-green-600 mb-1 uppercase tracking-widest leading-none text-center">Total Certificates</span>
                    <span className="text-4xl font-black text-primary-dark text-center">{certificationsData.length}</span>
                  </div>
                  
                  <div className="bg-orange-50/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 flex flex-col gap-1 transition-all hover:bg-orange-100/50">
                    <span className="text-[11px] font-black text-orange-600 mb-1 uppercase tracking-widest leading-none text-center">Active</span>
                    <span className="text-4xl font-black text-orange-700 text-center">{activeCertificates.length}</span>
                  </div>
                  
                  <div className="bg-blue-50/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 flex flex-col gap-1 transition-all hover:bg-blue-100/50">
                    <span className="text-[11px] font-black text-blue-600 mb-1 uppercase tracking-widest leading-none text-center">Credential Points</span>
                    <span className="text-4xl font-black text-gray-800 text-center">{certificationsData.length * 50}</span>
                  </div>
                </div>
              </div>

              {/* Active Certificates Grid */}
              <div className="space-y-6">
                <h2 className="font-heading font-black text-2xl text-white drop-shadow-md px-2">
                  Active Certificates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeCertificates.map((cert) => (
                    <div key={cert.id} className="transform transition duration-300 hover:-translate-y-2">
                      <CertificateCard certification={cert} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero-style "Earn More" Section */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[40px] text-white p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl transition-all duration-700 group-hover:bg-primary/30 z-0"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h3 className="font-heading font-black text-3xl mb-4 leading-tight drop-shadow-md">
                      Advance Your Career
                    </h3>
                    <p className="text-white/80 font-serif text-lg leading-relaxed italic drop-shadow-sm">
                      Complete more modules to unlock professional guide tiers and global recognition.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/courses')}
                    className="shrink-0 inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-dark hover:bg-green-50 transition-all font-black shadow-xl rounded-2xl transform hover:-translate-y-1"
                  >
                    Browse Courses <ArrowRight size={22} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Benefits & Details (4/12) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Recognition Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/50 text-center">
                <div className="bg-green-100/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                  <Star size={32} />
                </div>
                <h4 className="font-heading font-black text-xl text-gray-900 mb-2 uppercase tracking-tight">Verified Skills</h4>
                <p className="text-gray-500 font-serif text-sm italic leading-relaxed">
                  Every certification is blockchain-verified and recognized by international tourism boards.
                </p>
              </div>

              {/* Benefits Cards - Dynamic List style */}
              <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 shadow-xl border border-white/50">
                <h3 className="font-heading font-black text-lg text-gray-900 mb-6 uppercase tracking-tight">Certification Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                      <Globe size={20} />
                    </div>
                    <span className="font-black text-xs text-gray-700 uppercase tracking-widest">Global Validity</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                    <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                      <Award size={20} />
                    </div>
                    <span className="font-black text-xs text-gray-700 uppercase tracking-widest">Career Priority</span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                      <Smartphone size={20} />
                    </div>
                    <span className="font-black text-xs text-gray-700 uppercase tracking-widest">Digital Access</span>
                  </div>
                </div>
              </div>

              {/* Pro Tip - Small Impact Card */}
              <div className="bg-primary-dark text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                <div className="relative z-10 text-center">
                  <h4 className="font-black text-lg mb-2">Expert Guide Status 🎖️</h4>
                  <p className="text-white/80 font-serif text-sm italic leading-relaxed">
                    Earn 3 more certifications to reach "Expert Guide" rank and unlock premium park access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
