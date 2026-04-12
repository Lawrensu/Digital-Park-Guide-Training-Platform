import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { courses } from '../data/courses';

// Dashboard page showing welcome message, progress overview, and course cards
export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Filter in-progress courses
    setInProgressCourses(courses.filter(c => c.status !== 'not-started'));

    // Mock notifications
    setRecentNotifications([
      { id: 1, type: 'success', message: 'You completed "Flora Classification"!' },
      { id: 2, type: 'info', message: 'New course "Eco-Tourism Best Practices" is available' },
      { id: 3, type: 'info', message: 'Quiz available for "Biodiversity Hotspots"' },
    ]);
  }, []);

  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const totalProgress = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Guide'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Continue your learning journey with Park Guide Academy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">Overall Progress</h3>
              <span className="text-2xl">📈</span>
            </div>
            <div className="mb-4">
              <ProgressBar progress={totalProgress} showLabel={false} />
            </div>
            <p className="text-2xl font-serif font-bold text-green-700">{totalProgress}%</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">Courses Completed</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-2xl font-serif font-bold text-green-700">{completedCourses}/{courses.length}</p>
            <p className="text-gray-600 text-sm mt-2">Keep going! You're making great progress.</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-gray-900">Learning Time</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-2xl font-serif font-bold text-green-700">12.5 hrs</p>
            <p className="text-gray-600 text-sm mt-2">Total time invested in learning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-gray-900">Continue Learning</h2>
                <a href="/courses" className="btn-secondary text-sm">
                  View All
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressCourses.slice(0, 4).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-3">
              {recentNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl mt-0.5">{getNotificationIcon(notification.type)}</span>
                    <p className="text-sm font-medium">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Deadlines */}
            <div className="mt-8 card p-6">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">This Week</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">📝</span>
                  <span className="text-gray-700">Quiz: Biodiversity (Tomorrow)</span>
                </li>
                <li className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">📚</span>
                  <span className="text-gray-700">Complete Lesson 3 by Friday</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
