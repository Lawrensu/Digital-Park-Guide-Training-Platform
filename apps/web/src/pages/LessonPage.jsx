import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import { coursesData, lessonsData } from '../data/courses'
import { ChevronLeft, ChevronRight, CheckCircle, Play } from 'lucide-react'

export default function LessonPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([true, true, false])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const course = coursesData.find(c => c.id === parseInt(courseId))
  const lessons = lessonsData[courseId] || []
  const currentLesson = lessons[currentLessonIndex]

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar 
          activeItem="Courses" 
          onSignOut={() => navigate('/login')}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
          <TopNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />
          <div className="max-w-7xl mx-auto px-4 py-12 text-center mt-16">
            <p className="text-gray-600">Course not found</p>
            <Button onClick={() => navigate('/courses')} className="mt-4">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleMarkComplete = () => {
    const newCompleted = [...completedLessons]
    newCompleted[currentLessonIndex] = true
    setCompletedLessons(newCompleted)
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  const progressPercentage = Math.round((completedLessons.filter(Boolean).length / lessons.length) * 100)

  return (
    <div className="min-h-screen flex relative">
      {/* Full-page Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
          alt="Park background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark/50 backdrop-blur-[4px]"></div>
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
          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-green-300 hover:text-white font-black mb-8 transition-colors drop-shadow-md group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Player */}
              <div className="bg-black/80 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10 aspect-video relative group">
                <video
                  src={currentLesson.video}
                  controls
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Lesson Info */}
              <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-10 shadow-xl border border-white/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="max-w-2xl">
                    <p className="text-primary font-black text-xs uppercase tracking-widest mb-3">
                      Lesson {currentLessonIndex + 1} of {lessons.length}
                    </p>
                    <h1 className="font-heading font-black text-3xl text-gray-900 mb-4 leading-tight">
                      {currentLesson.title}
                    </h1>
                    <p className="text-gray-600 font-serif text-lg leading-relaxed italic">
                      {currentLesson.description}
                    </p>
                  </div>
                  <div className="shrink-0 bg-green-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-green-100">
                    <Clock size={16} className="text-primary-dark" />
                    <span className="text-primary-dark text-sm font-black whitespace-nowrap">
                      {currentLesson.duration}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {!completedLessons[currentLessonIndex] ? (
                    <button 
                      onClick={handleMarkComplete}
                      className="flex-1 bg-primary text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1"
                    >
                      <CheckCircle size={22} />
                      Mark as Complete
                    </button>
                  ) : (
                    <div className="flex-1 bg-green-50 text-primary-dark font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 border-2 border-primary/20">
                      <CheckCircle size={22} />
                      Lesson Completed
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/quiz/${course.id}`)}
                    className="flex-1 bg-white border-2 border-gray-100 text-gray-800 font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-md transform hover:-translate-y-1"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-6">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black py-5 px-8 rounded-[24px] flex items-center justify-center gap-3 transition-all hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  Previous Lesson
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black py-5 px-8 rounded-[24px] flex items-center justify-center gap-3 transition-all hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  Next Lesson
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Sidebar - Lessons List */}
            <div className="space-y-8">
              <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-8 shadow-2xl border border-white/50 h-fit sticky top-24">
                <h3 className="font-heading font-black text-xl text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <BookOpen size={24} className="text-primary" />
                  Course Content
                </h3>
                
                <div className="mb-8 p-6 bg-green-50/50 rounded-2xl border border-green-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Progress</span>
                    <span className="text-sm font-black text-primary-dark">{progressPercentage}%</span>
                  </div>
                  <ProgressBar progress={progressPercentage} />
                </div>

                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 transform border-2 ${
                        currentLessonIndex === index
                          ? 'bg-primary/10 border-primary shadow-md scale-[1.02]'
                          : 'bg-white border-transparent hover:border-gray-100 hover:shadow-sm'
                      }`}
                    >
                      <div className={`shrink-0 mt-1 p-1.5 rounded-lg ${
                        completedLessons[index] ? 'bg-green-100 text-primary-dark' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {completedLessons[index] ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-sm leading-tight ${
                          currentLessonIndex === index ? 'text-primary' : 'text-gray-700'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{lesson.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
