import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { courses } from '../data/courses';
import { Link } from 'react-router-dom';

// Lesson page with video player, lesson details, and navigation
export default function LessonPage() {
  const [searchParams] = useSearchParams();
  const courseId = parseInt(searchParams.get('course')) || 1;
  const [lessonId, setLessonId] = useState(0);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setCurrentLesson(foundCourse.lessons_data[lessonId]);
    }
  }, [courseId, lessonId]);

  if (!course || !currentLesson) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleNextLesson = () => {
    if (lessonId < course.lessons_data.length - 1) {
      setLessonId(lessonId + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (lessonId > 0) {
      setLessonId(lessonId - 1);
    }
  };

  const handleCompleteLesson = () => {
    // Mark lesson as completed
    alert(`Lesson "${currentLesson.title}" completed!`);
    if (lessonId < course.lessons_data.length - 1) {
      handleNextLesson();
    }
  };

  const progress = Math.round(((lessonId + 1) / course.lessons_data.length) * 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm">
          <Link to="/courses" className="text-green-700 hover:text-green-800">
            Courses
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{course.title}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{currentLesson.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">Course Progress</h3>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <ProgressBar progress={progress} showLabel={false} />
            </div>

            {/* Video Player */}
            <div className="card mb-8 overflow-hidden">
              <div className="bg-black flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                <video
                  src={currentLesson.video}
                  controls
                  className="w-full h-full"
                  style={{ maxHeight: '500px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Lesson Title */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                {currentLesson.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {currentLesson.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Lesson {lessonId + 1} of {course.lessons_data.length}
                </span>
                {currentLesson.completed && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>

            {/* Infographic */}
            <div className="card mb-8 overflow-hidden">
              <img
                src={currentLesson.infographic}
                alt="Lesson infographic"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Key Takeaways */}
            <div className="card p-6 mb-8">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                📌 Key Takeaways
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 text-lg mt-0.5">→</span>
                  <span className="text-gray-700">Master the core concepts discussed in this lesson</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 text-lg mt-0.5">→</span>
                  <span className="text-gray-700">Apply the learning in practical park scenarios</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 text-lg mt-0.5">→</span>
                  <span className="text-gray-700">Use this knowledge in your guided tours</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="card p-6 mb-8 bg-blue-50">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                📚 Additional Resources
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    📄 Download Lesson PDF
                  </a>
                </p>
                <p className="text-gray-700">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    🔗 Related Articles
                  </a>
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                disabled={lessonId === 0}
                onClick={handlePreviousLesson}
                className="flex-1"
              >
                ← Previous Lesson
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteLesson}
                className="flex-1"
              >
                ✓ Complete & Continue
              </Button>
            </div>
          </div>

          {/* Sidebar - Lesson Navigation */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">
                Course Lessons
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.lessons_data.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setLessonId(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      lessonId === idx
                        ? 'bg-green-100 border-l-4 border-green-700'
                        : 'hover:bg-gray-100 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg mt-0.5">
                        {lesson.completed ? '✓' : idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lesson.completed ? 'Completed' : 'In Progress'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Course Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-serif font-bold text-gray-900 mb-3">About This Course</h4>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Category:</span> {course.category}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Total Lessons:</span> {course.lessons_data.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
