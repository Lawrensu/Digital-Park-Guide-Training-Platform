export default function ProgressBar({ progress = 0, size = 'md', label = null }) {
  const height = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height[size]}`}>
        <div
          className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      {label && (
        <p className="text-sm text-gray-600 mt-1">{label}</p>
      )}
    </div>
  )
}
