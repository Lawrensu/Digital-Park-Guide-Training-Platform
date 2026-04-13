export default function QuizOption({
  id,
  option,
  isSelected,
  isCorrect,
  isIncorrect,
  onClick,
  disabled = false,
  showResult = false
}) {
  let bgColor = 'bg-gray-100 hover:bg-gray-200'
  let borderColor = 'border-gray-300'
  let textColor = 'text-gray-900'

  if (showResult) {
    if (isCorrect) {
      bgColor = 'bg-green-100'
      borderColor = 'border-green-500'
      textColor = 'text-green-900'
    } else if (isIncorrect) {
      bgColor = 'bg-red-100'
      borderColor = 'border-red-500'
      textColor = 'text-red-900'
    } else if (isSelected) {
      bgColor = 'bg-gray-100'
      borderColor = 'border-gray-400'
    }
  } else if (isSelected) {
    bgColor = 'bg-primary bg-opacity-10'
    borderColor = 'border-primary'
    textColor = 'text-primary'
  }

  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`
        w-full p-4 mb-3 rounded-xl border-2 transition-all text-left
        ${bgColor} ${borderColor} ${textColor}
        ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-400'}
          ${showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
          ${showResult && isIncorrect ? 'border-red-500 bg-red-500 text-white' : ''}
        `}>
          {isSelected && !showResult && '✓'}
          {showResult && isCorrect && '✓'}
          {showResult && isIncorrect && '✗'}
        </div>
        <span className="font-serif text-lg">
          {option}
        </span>
      </div>
    </button>
  )
}
