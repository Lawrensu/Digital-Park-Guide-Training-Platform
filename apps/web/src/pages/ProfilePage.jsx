import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Edit3,
  Camera
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user data
  const userData = {
    name: 'Colin Anak Jame Nglai',
    role: 'Senior Park Guide',
    email: 'john.doe@parkguide.gov',
    phone: '+1 (555) 123-4567',
    location: 'Everglades National Park, FL',
    bio: 'Dedicated wildlife conservationist and senior guide with over 8 years of experience in tropical ecosystem management and visitor education.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    stats: [
      { label: 'Completed Courses', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Certifications', value: '4', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
      { label: 'Learning Hours', value: '48h', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    ],
    completedCourses: [
      { id: 1, title: 'Biodiversity Essentials', date: 'Oct 12, 2023', category: 'General' },
      { id: 2, title: 'Wildlife Safety Protocols', date: 'Nov 05, 2023', category: 'Safety' },
      { id: 3, title: 'Eco-Tourism Best Practices', date: 'Jan 15, 2024', category: 'Tourism' },
      { id: 4, title: 'Emergency First Aid', date: 'Feb 20, 2024', category: 'Safety' },
    ]
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
        activeItem="Profile" 
        onSignOut={() => navigate('/login')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 relative z-10">
        <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 mt-16 max-w-[1400px] mx-auto w-full">
          {/* Header Area */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-heading font-black text-4xl text-white mb-2 drop-shadow-md">
              Your Profile
            </h1>
            <p className="text-white/90 font-serif text-lg drop-shadow-sm">
              Manage your personal information and track your professional growth
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* 1. PROFILE HEADER CARD (glassmorphism style) */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                  <div className="relative group shrink-0">
                    <img 
                      src={userData.avatar} 
                      alt={userData.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <h2 className="font-heading font-black text-3xl text-gray-900 leading-tight">{userData.name}</h2>
                      <span className="inline-block mt-1 px-4 py-1 bg-primary/10 text-primary-dark text-sm font-black rounded-full uppercase tracking-wider">
                        {userData.role}
                      </span>
                    </div>
                    <p className="text-gray-600 font-serif leading-relaxed text-lg italic max-w-2xl">
                      "{userData.bio}"
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. PERSONAL INFORMATION SECTION */}
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-10 shadow-2xl border border-white/50">
                <h3 className="font-heading font-black text-xl text-gray-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                   <User className="text-primary" size={24} />
                   Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-2 border-transparent rounded-2xl">
                      <User size={20} className="text-gray-400" />
                      <span className="font-black text-gray-800">{userData.name}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-2 border-transparent rounded-2xl">
                      <Mail size={20} className="text-gray-400" />
                      <span className="font-black text-gray-800">{userData.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-2 border-transparent rounded-2xl">
                      <Phone size={20} className="text-gray-400" />
                      <span className="font-black text-gray-800">{userData.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Base Location</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border-2 border-transparent rounded-2xl">
                      <MapPin size={20} className="text-gray-400" />
                      <span className="font-black text-gray-800">{userData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. TRAINING SUMMARY SECTION (stat cards like dashboard) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {userData.stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 shadow-xl border border-white/50 flex flex-col items-center text-center transform transition hover:-translate-y-1">
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl mb-4 shadow-inner`}>
                      <stat.icon size={28} />
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. COMPLETED COURSES LIST (Right column) */}
            <div className="xl:col-span-4 space-y-8">
              <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border border-white/50 h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading font-black text-xl text-gray-900 uppercase tracking-tight">Recent Progress</h3>
                  <span className="bg-primary-dark text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                </div>
                
                <div className="space-y-6">
                  {userData.completedCourses.map((course) => (
                    <div key={course.id} className="group relative p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{course.category}</div>
                          <h4 className="font-black text-gray-900 leading-tight group-hover:text-primary transition-colors">{course.title}</h4>
                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 font-serif italic">
                            <Clock size={12} />
                            Completed: {course.date}
                          </div>
                        </div>
                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                          <CheckCircle2 size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <button 
                    onClick={() => navigate('/certificates')}
                    className="w-full bg-primary-dark text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-2 group"
                  >
                    All Certificates
                    <Award size={18} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
