import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuizOption from '../components/QuizOption';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { quizzes } from '../data/courses';
import { Link } from 'react-router-dom';

// Quiz page with multiple choice questions
export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const courseId = parseInt(searchParams.get('course')) || 1;
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    setQuizData(quizzes[courseId] || []);
  }, [courseId]);

  if (!quizData || quizData.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quizData.length - 1;
  const progress = Math.round(((currentQuestionIdx + 1) / quizData.length) * 100);

  const handleSelectAnswer = (index) => {
    if (!submitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    setSubmitted(true);
    const newAnswers = { ...answers, [currentQuestionIdx]: selectedAnswer };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final score
      let correctCount = 0;
      quizData.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / quizData.length) * 100);
      setScore(finalScore);
    } else {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setSelectedAnswer(answers[currentQuestionIdx - 1] || null);
      setSubmitted(true);
    }
  };

  if (score !== null) {
    const passed = score >= 70;
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="card p-12 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <span className="text-5xl">{passed ? '🎉' : '📋'}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>

            <p className="text-gray-700 text-lg mb-8">
              {passed
                ? 'You have successfully completed the quiz with a passing score!'
                : 'You need 70% to pass. Review the material and try again.'}
            </p>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8">
              <p className="text-gray-600 text-sm mb-2">Your Score</p>
              <p className="font-serif text-6xl font-bold text-green-700 mb-2">
                {score}%
              </p>
              <p className="text-gray-700">
                {Object.values(answers).filter((ans, idx) => ans === quizData[idx]?.correct).length} out of {quizData.length} correct
              </p>
            </div>

            {/* Results Summary */}
            <div className="space-y-2 text-left max-w-xl mx-auto mb-8">
              {quizData.map((question, idx) => {
                const isCorrect = answers[idx] === question.correct;
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      isCorrect
                        ? 'bg-green-50 border-green-600'
                        : 'bg-red-50 border-red-600'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{isCorrect ? '✓' : '✗'}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{question.question}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Your answer: {question.options[answers[idx]]}
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-green-700 mt-1">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!passed && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setCurrentQuestionIdx(0);
                    setSelectedAnswer(null);
                    setSubmitted(false);
                    setScore(null);
                    setAnswers({});
                  }}
                >
                  Retake Quiz
                </Button>
              )}
              {passed && (
                <Link to="/certificates">
                  <Button variant="primary" size="lg">
                    View Your Certificate
                  </Button>
                </Link>
              )}
              <Link to="/courses">
                <Button variant="outline" size="lg">
                  Back to Courses
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Quiz Progress</h3>
            <span className="text-sm text-gray-600">
              Question {currentQuestionIdx + 1} of {quizData.length}
            </span>
          </div>
          <ProgressBar progress={progress} showLabel={false} />
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-8">
          {/* Question Number and Title */}
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              Question {currentQuestionIdx + 1}
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            {currentQuestion.options.map((option, index) => (
              <QuizOption
                key={index}
                option={option}
                index={index}
                isSelected={selectedAnswer === index}
                isSubmitted={submitted}
                isCorrect={submitted && index === currentQuestion.correct}
                onSelect={() => handleSelectAnswer(index)}
              />
            ))}
          </div>

          {/* Explanation (shown after submission) */}
          {submitted && (
            <div className={`p-6 rounded-lg border-l-4 ${
              selectedAnswer === currentQuestion.correct
                ? 'bg-green-50 border-green-600'
                : 'bg-orange-50 border-orange-600'
            }`}>
              <p className="font-semibold text-gray-900 mb-2">
                {selectedAnswer === currentQuestion.correct ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-gray-700">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={currentQuestionIdx === 0 || !submitted}
            onClick={handlePreviousQuestion}
            className="flex-1"
          >
            ← Previous
          </Button>

          {!submitted ? (
            <Button
              variant="primary"
              disabled={selectedAnswer === null}
              onClick={handleSubmitAnswer}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNextQuestion}
              className="flex-1"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
