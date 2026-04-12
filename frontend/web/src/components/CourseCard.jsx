import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import Button from './Button';

// Reusable course card component
export default function CourseCard({ course }) {
  const getStatusBadge = (status) => {
    const badges = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'not-started': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges['not-started'];
  };

  const getStatusText = (status) => {
    return status === 'in-progress' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Not Started';
  };

  return (
    <div className="card overflow-hidden hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(course.status)}`}>
            {getStatusText(course.status)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-green-700">
            {course.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
          <span>📚 {course.lessons} Lessons</span>
          <span>⏱️ 4-6 hours</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar progress={course.progress} showLabel={false} size="sm" />
        </div>

        {/* Action Button */}
        <Link
          to={`/lesson?course=${course.id}`}
          className="block w-full"
        >
          <Button
            variant={course.progress === 0 ? 'primary' : 'secondary'}
            className="w-full text-center"
          >
            {course.progress === 0 ? 'Start Course' : 'Continue Course'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
