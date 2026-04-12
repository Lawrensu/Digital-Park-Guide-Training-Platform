// Quiz option/answer component
export default function QuizOption({
  option,
  index,
  isSelected,
  isSubmitted,
  isCorrect,
  onSelect,
}) {
  const getOptionStyle = () => {
    if (!isSubmitted) {
      return isSelected
        ? 'border-2 border-green-600 bg-green-50'
        : 'border-2 border-gray-300 hover:border-green-500 bg-white';
    }

    if (isCorrect) {
      return 'border-2 border-green-600 bg-green-50';
    }

    if (isSelected && !isCorrect) {
      return 'border-2 border-red-600 bg-red-50';
    }

    return 'border-2 border-gray-300 bg-gray-50';
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <button
      onClick={() => !isSubmitted && onSelect()}
      disabled={isSubmitted}
      className={`w-full p-4 mb-3 text-left rounded-lg transition-all ${getOptionStyle()} ${
        isSubmitted ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
          isSelected || (isSubmitted && isCorrect)
            ? 'bg-green-600 text-white'
            : isSubmitted && isSelected && !isCorrect
            ? 'bg-red-600 text-white'
            : 'bg-gray-300 text-gray-700'
        }`}>
          {letters[index]}
        </div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{option}</p>
        </div>
        {isSubmitted && isCorrect && (
          <span className="text-green-600 text-lg">✓</span>
        )}
        {isSubmitted && isSelected && !isCorrect && (
          <span className="text-red-600 text-lg">✗</span>
        )}
      </div>
    </button>
  );
}
