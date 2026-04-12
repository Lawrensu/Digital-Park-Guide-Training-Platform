// Progress bar component to show course/lesson progress
export default function ProgressBar({ progress = 0, showLabel = true, size = 'md' }) {
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className="bg-gradient-to-r from-green-600 to-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 font-medium">{progress}% Complete</p>
      )}
    </div>
  );
}
