import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import QuizOption from '../components/QuizOption'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import { quizzesData } from '../data/courses'
import { Check, X } from 'lucide-react'

export default function QuizPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const quiz = quizzesData[courseId]

  if (!quiz) {
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
          <div className="max-w-4xl mx-auto px-4 py-12 text-center mt-16">
            <p className="text-gray-600">Quiz not found</p>
            <Button onClick={() => navigate('/courses')} className="mt-4">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const score = Object.entries(answers).filter(
    ([idx, answerIdx]) => quiz.questions[idx].correct === answerIdx
  ).length
  const totalQuestions = quiz.questions.length
  const answersPercentage = Math.round((score / totalQuestions) * 100)
  const passing = answersPercentage >= 70

  const handleSelectAnswer = (optionIndex) => {
    if (!showResults) {
      setAnswers({ ...answers, [currentQuestion]: optionIndex })
    }
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  // Common Layout Wrapper
  const QuizLayout = ({ children }) => (
    <div className="min-h-screen flex relative">
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
        <main className="flex-1 p-8 mt-16 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )

  // Results view
  if (showResults) {
    return (
      <QuizLayout>
        {/* Result Card */}
        <div className={`rounded-[40px] p-16 text-white text-center mb-10 shadow-2xl relative overflow-hidden group ${
          passing ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-to-br from-red-600 to-orange-600'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-8xl mb-6 transform transition-transform group-hover:scale-110 duration-500">
              {passing ? '🎉' : '📝'}
            </div>
            <h1 className="font-heading font-black text-5xl mb-4 leading-tight drop-shadow-lg">
              {passing ? 'Great Job!' : 'Keep Trying!'}
            </h1>
            <p className="text-xl text-white opacity-90 mb-10 font-serif italic max-w-lg mx-auto leading-relaxed drop-shadow-sm">
              {passing
                ? 'You\'ve passed the quiz! You can now proceed to the next module.'
                : 'You need 70% to pass. Review the material and try again.'}
            </p>
            <div className="bg-white/20 rounded-[32px] backdrop-blur-md px-12 py-8 inline-block shadow-inner border border-white/10">
              <p className="text-xs font-black text-white/80 mb-2 uppercase tracking-widest">Final Score</p>
              <p className="font-heading font-black text-6xl drop-shadow-md">
                {score}/{totalQuestions}
              </p>
              <p className="text-lg font-black mt-2 text-white/90 uppercase tracking-tighter">
                {answersPercentage}% Correct
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/90 backdrop-blur-md rounded-[40px] p-10 shadow-xl border border-white/50 mb-10">
          <h2 className="font-heading font-black text-2xl text-gray-900 mb-10 uppercase tracking-tight flex items-center gap-3">
            <Check className="text-primary" size={28} />
            Review Answers
          </h2>
          <div className="space-y-8">
            {quiz.questions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = userAnswer === q.correct
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border-2 border-gray-100 transition-all hover:bg-gray-50 transform hover:-translate-x-1 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">
                        Question {idx + 1}
                      </p>
                      <p className="font-serif text-xl text-gray-900 font-bold leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                    {isCorrect ? (
                      <div className="bg-green-100 p-2 rounded-xl text-green-600 shadow-sm border border-green-200 shrink-0">
                        <Check size={24} />
                      </div>
                    ) : (
                      <div className="bg-red-100 p-2 rounded-xl text-red-600 shadow-sm border border-red-200 shrink-0">
                        <X size={24} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {q.options.map((option, optIdx) => (
                      <div key={optIdx} className={`p-4 rounded-xl border-2 font-serif text-sm transition-all ${
                        optIdx === q.correct
                          ? 'bg-green-50 border-green-300 text-primary-dark font-bold'
                          : optIdx === userAnswer && !isCorrect
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-white border-gray-100 text-gray-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {optIdx === q.correct && <span className="text-[10px] font-black uppercase tracking-widest ml-2">Correct</span>}
                          {optIdx === userAnswer && !isCorrect && <span className="text-[10px] font-black uppercase tracking-widest ml-2">Your Answer</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate('/courses')}
            className="flex-1 bg-white/90 backdrop-blur-md text-gray-800 font-black py-5 px-10 rounded-[28px] shadow-xl hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Back to Courses
          </button>
          {!passing ? (
            <button
              onClick={handleRestart}
              className="flex-1 bg-primary text-white font-black py-5 px-10 rounded-[28px] shadow-xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Retake Quiz
            </button>
          ) : (
            <button
              onClick={() => navigate('/courses')}
              className="flex-1 bg-primary text-white font-black py-5 px-10 rounded-[28px] shadow-xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Next Course 🚀
            </button>
          )}
        </div>
      </QuizLayout>
    )
  }

  // Quiz view
  return (
    <QuizLayout>
        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-black text-2xl text-white drop-shadow-md">
              {quiz.title}
            </h3>
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest border border-white/20">
              Q{currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full h-3 border border-white/10 p-0.5 shadow-inner">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 shadow-primary/20" 
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-12 shadow-2xl mb-12 border border-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          {/* Question */}
          <div className="mb-12 relative z-10">
            <p className="text-[10px] font-black text-primary-dark mb-4 uppercase tracking-[0.2em]">Select one answer</p>
            <h2 className="font-heading font-black text-3xl text-gray-900 leading-tight">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-12 relative z-10">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                disabled={false}
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full text-left p-6 rounded-2xl font-serif text-lg transition-all transform border-2 flex items-center gap-5 ${
                  selectedAnswer === idx
                    ? 'bg-primary/5 border-primary text-primary-dark shadow-md scale-[1.01]'
                    : 'bg-white border-gray-100 text-gray-700 hover:border-primary/30 hover:bg-gray-50'
                }`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all ${
                  selectedAnswer === idx ? 'bg-primary border-primary text-white scale-110 shadow-lg' : 'border-gray-200 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-6 relative z-10">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 bg-white border-2 border-gray-100 text-gray-800 font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-gray-50 disabled:opacity-20 transform hover:-translate-y-1"
            >
              Previous
            </button>
            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === undefined}
                className="flex-1 bg-primary text-white font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== totalQuestions}
                className="flex-1 bg-primary text-white font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:bg-primary-dark disabled:opacity-50 transform hover:-translate-y-1"
              >
                Submit Final Answers
              </button>
            )}
          </div>
        </div>

        {/* Answer Checklist */}
        <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-8 shadow-xl border border-white/20">
          <h3 className="font-heading font-black text-sm text-white/80 mb-6 uppercase tracking-widest text-center">
            Answer Progress Tracker
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-12 h-12 rounded-[18px] font-black text-sm transition-all flex items-center justify-center shadow-lg transform ${
                  idx === currentQuestion
                    ? 'bg-white text-primary scale-125 z-10 ring-4 ring-primary/20'
                    : answers[idx] !== undefined
                    ? 'bg-primary text-white hover:scale-110'
                    : 'bg-white/20 text-white/50 border border-white/10 hover:bg-white/30'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
    </QuizLayout>
  )
}
