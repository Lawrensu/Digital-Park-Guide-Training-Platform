import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidequiz.css'

// --- Icons ---
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const TimerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

export default function GuideQuizPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Quiz State
  const [timeLeft, setTimeLeft] = useState(38 * 60 + 45) // 38:45 in seconds
  
  // Mock Questions based on description
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'Multiple Choice',
      text: 'What is the first step when encountering an injured Orangutan?',
      options: [
        'Approach slowly to assess the injury',
        'Contact the Wildlife Rescue Unit immediately',
        'Offer food and water',
        'Try to move it to a safer location'
      ],
      answer: null, // Index of selected option
      completed: false
    },
    {
      id: 2,
      type: 'True/False',
      text: 'It is safe to administer oral rehydration salts to an unconscious visitor.',
      options: ['True', 'False'],
      answer: null,
      completed: true // Marked as completed in description
    },
    {
      id: 3,
      type: 'Short Answer',
      text: 'List the signals of heatstroke and the emergency procedure.',
      answer: '',
      completed: true
    },
    {
      id: 4,
      type: 'Long Answer',
      text: 'Describe the protocol for closing a road after a wildlife accident.',
      answer: '',
      completed: false
    }
  ])

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleOptionSelect = (qId, optionIndex) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, answer: optionIndex, completed: true }
      }
      return q
    }))
  }

  const handleTextChange = (qId, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, answer: value, completed: value.length > 0 }
      }
      return q
    }))
  }

  return (
    <div className="gq-page-container">
      <GuideNavbar />

      <div className="gq-main-wrapper">
        
        {/* Topbar */}
        <header className="gq-topbar">
          <h1 className="gq-title">Quizzes</h1>

          <div className="gq-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search quizzes..." />
          </div>

          <div className="gq-user-actions">
            <button className="gq-icon-btn">
              <BellIcon />
              <span className="gq-notification-dot"></span>
            </button>
            <div className="gq-avatar">AM</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="gq-content-area">
          
          {/* Quiz Info Header */}
          <div className="gq-quiz-header-card">
            <div className="gq-quiz-info">
              <div className="gq-breadcrumb">Modules / Forest Safety / Final Quiz</div>
              <h2 className="gq-quiz-title">Forest Safety – Final Quiz</h2>
              <div className="gq-module-tag">MOD - 001 Forest Safety & Hazard Awareness</div>
            </div>

            <div className="gq-stats-row">
              <div className="gq-stat-box gq-time-box">
                <TimerIcon />
                <span className="gq-time-text">{formatTime(timeLeft)}</span>
              </div>
              <div className="gq-stat-box">
                <span className="gq-stat-label">Progress</span>
                <span className="gq-stat-value">2 / 8</span>
              </div>
              <div className="gq-stat-box">
                <span className="gq-stat-label">Score</span>
                <span className="gq-stat-value gq-score-highlight">70%</span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="gq-questions-list">
            {questions.map((q, index) => (
              <div key={q.id} className={`gq-question-card ${q.completed ? 'gq-completed' : ''}`}>
                
                <div className="gq-q-header">
                  <div className="gq-q-number">Question {index + 1}</div>
                  <div className="gq-q-type">{q.type}</div>
                  {q.completed && <CheckCircleIcon className="gq-check-icon" />}
                </div>

                <h4 className="gq-q-text">{q.text}</h4>

                {/* Input Area based on Type */}
                <div className="gq-input-area">
                  {q.type === 'Multiple Choice' && (
                    <div className="gq-options-grid">
                      {q.options.map((opt, i) => (
                        <label key={i} className={`gq-option-label ${q.answer === i ? 'gq-selected' : ''}`}>
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            checked={q.answer === i}
                            onChange={() => handleOptionSelect(q.id, i)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'True/False' && (
                    <div className="gq-tf-grid">
                      {q.options.map((opt, i) => (
                        <label key={i} className={`gq-tf-label ${q.answer === i ? 'gq-selected' : ''}`}>
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            checked={q.answer === i}
                            onChange={() => handleOptionSelect(q.id, i)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(q.type === 'Short Answer' || q.type === 'Long Answer') && (
                    <textarea 
                      className="gq-text-input"
                      rows={q.type === 'Long Answer' ? 6 : 3}
                      placeholder="Type your answer here..."
                      value={q.answer}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                    ></textarea>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="gq-footer-actions">
            <div className="gq-footer-info">
              <span>Total Questions: 8</span>
              <span className="gq-separator">|</span>
              <span>Total Points: 50</span>
            </div>
            <div className="gq-buttons">
              <button className="gq-btn-secondary">Save Progress</button>
              <button className="gq-btn-primary">Submit Quiz</button>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}