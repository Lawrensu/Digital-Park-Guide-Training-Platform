import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNavbar from '../components/TopNavbar'
import CourseCard from '../components/CourseCard'
import Button from '../components/Button'
import { coursesData } from '../data/courses'
import { Search, Filter } from 'lucide-react'

export default function CourseListPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('latest')

  const categories = ['All', 'Biodiversity', 'Safety', 'Eco-tourism']

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let result = coursesData

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory)
    }

    // Search by title or description
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        course =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortBy === 'progress') {
      result = [...result].sort((a, b) => b.progress - a.progress)
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [searchQuery, selectedCategory, sortBy])

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
        activeItem="Courses" 
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
              All Courses
            </h1>
            <p className="text-white/90 font-serif text-lg drop-shadow-sm">
              Explore {coursesData.length} training modules to enhance your park guide skills
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Course Grid (8/12) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Search Bar & Filters Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/50 space-y-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search courses by title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-100 rounded-[20px] focus:border-primary focus:outline-none font-serif transition shadow-inner focus:shadow-primary/5"
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="bg-green-100/50 p-2.5 rounded-xl border border-green-100 mr-1 shadow-sm">
                    <Filter size={20} className="text-primary-dark" />
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md transform hover:-translate-y-0.5 ${
                        selectedCategory === category 
                          ? 'bg-primary text-white scale-105 shadow-primary/20' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Grid */}
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="transform transition duration-300 hover:-translate-y-2">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/10 backdrop-blur-md rounded-[40px] border-2 border-dashed border-white/30 shadow-2xl">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                     <Search size={32} className="text-white" />
                  </div>
                  <p className="text-white text-2xl font-black mb-6">No courses found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="bg-white text-primary-dark px-10 py-4 rounded-2xl font-black hover:bg-green-50 transition-all shadow-xl"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar Stats (4/12) */}
            <div className="xl:col-span-4 space-y-8">
              
              {/* Filter Stats Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/50">
                <h3 className="font-heading font-black text-xl text-gray-900 mb-6 uppercase tracking-tight">Active Filters</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</span>
                    <span className="text-sm font-black text-primary-dark">{selectedCategory}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Sort results by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-white border-2 border-gray-50 rounded-2xl px-4 py-3.5 focus:outline-none font-black text-sm text-gray-800 cursor-pointer shadow-sm hover:border-primary/20 transition-all"
                    >
                      <option value="latest">Latest Addition</option>
                      <option value="title">Alphabetical (A-Z)</option>
                      <option value="progress">Learning Progress</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-center px-1">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Results</span>
                    <span className="bg-primary-dark text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      {filteredCourses.length} Modules
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Tip Card */}
              <div className="bg-primary-dark text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-2">Pro Tip 🌲</h4>
                  <p className="text-white/80 font-serif text-sm italic leading-relaxed">
                    Complete the "Biodiversity" track first to unlock advanced conservation badges.
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
