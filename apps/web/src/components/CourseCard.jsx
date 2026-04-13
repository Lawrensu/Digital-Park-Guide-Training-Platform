import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import Button from './Button'

export default function CourseCard({ course, onStart }) {
  const isCompleted = course.progress === 100

  return (
    <div className="bg-white rounded-3xl shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1">
          <span className="text-sm font-semibold text-primary">{course.category}</span>
        </div>
        {isCompleted && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
            <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
              ✓ Completed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
          {course.icon} {course.title}
        </h3>
        <p className="text-gray-600 text-sm font-serif mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-sm text-gray-600">
          <span>📚 {course.lessons} lessons</span>
          <span>⏱️ {course.duration}</span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-bold text-primary">{course.progress}%</span>
          </div>
          <ProgressBar progress={course.progress} />
        </div>

        {/* Button */}
        <Link to={`/lesson/${course.id}`}>
          <Button
            variant={isCompleted ? 'outline' : 'primary'}
            size="lg"
            onClick={() => onStart && onStart(course.id)}
          >
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
