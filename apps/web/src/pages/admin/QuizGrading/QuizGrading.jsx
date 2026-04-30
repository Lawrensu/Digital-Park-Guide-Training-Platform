import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './quizgrading.css'

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

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

export default function QuizGradingPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Initial state to sum up to 34/50
  const [grades, setGrades] = useState({
    q1: 8,  // MCQ (Max 10)
    q2: 10, // Long Answer (Max 15)
    q3: 5,  // True/False (Max 5)
    q4: 11  // Short Answer (Max 20)
  })

  const questions = [
    {
      id: 'q1',
      type: 'Multiple Choice',
      text: 'Which of the following are common signs of shock in a victim?',
      userAnswer: ['Rapid pulse', 'Pale, cold, clammy skin', 'Confusion or anxiety'],
      maxPoints: 10
    },
    {
      id: 'q2',
      type: 'Long Answer',
      text: 'Describe the immediate steps you should take when encountering a venomous snake bite in the field.',
      userAnswer: '1. Keep the victim calm and immobilized. 2. Apply a pressure bandage above the bite site. 3. Do not wash the bite area. 4. Seek medical evacuation immediately.',
      maxPoints: 15
    },
    {
      id: 'q3',
      type: 'True/False',
      text: 'You should apply a tourniquet immediately to any bleeding limb to stop blood flow completely.',
      userAnswer: 'False',
      maxPoints: 5
    },
    {
      id: 'q4',
      type: 'Short Answer',
      text: 'What is the universal emergency contact number in this region?',
      userAnswer: '999',
      maxPoints: 20
    }
  ]

  const totalScore = Object.values(grades).reduce((a, b) => a + Number(b), 0)
  const maxTotalScore = questions.reduce((a, b) => a + b.maxPoints, 0)
  const passMark = 35
  const isPass = totalScore >= passMark

  const handleGradeChange = (id, value) => {
    setGrades(prev => ({ ...prev, [id]: parseInt(value) || 0 }))
  }

  return (
    <div className="qg-page-container">
      <Navbar />

      <div className="qg-main-wrapper">
        
        {/* Topbar */}
        <header className="qg-topbar">
          <h1 className="qg-title">Quizzes</h1>

          <div className="qg-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="qg-user-actions">
            <button className="qg-icon-btn">
              <BellIcon />
              <span className="qg-notification-dot"></span>
            </button>
            <div className="qg-avatar">AM</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="qg-content-area">
          
          <button className="qg-back-btn" onClick={() => navigate('/quizzes')}>
            ← Back to Quizzes
          </button>

          <div className="qg-layout-grid">

            {/* Left Column: Grading Area */}
            <div className="qg-grading-column">
              
              <div className="qg-header-section">
                <div>
                  <h2 className="qg-page-heading">Grading: Wildlife First Aid Assessment</h2>
                  <div className="qg-meta-row">
                    <span className="qg-attempt-badge">Attempt #2</span>
                    <span className="qg-text-muted">Submitted on Oct 24, 2023</span>
                  </div>
                </div>
                
                {/* Score Summary */}
                <div className={`qg-score-card ${isPass ? 'qg-pass' : 'qg-fail'}`}>
                  <div className="qg-score-header">
                    <span className="qg-score-label">Total Score</span>
                    <span className={`qg-status-badge ${isPass ? 'qg-status-pass' : 'qg-status-fail'}`}>
                      {isPass ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="qg-score-big">
                    {totalScore} <span className="qg-score-divider">/</span> {maxTotalScore}
                  </div>
                  <div className="qg-pass-mark">
                    Pass Mark: {passMark} (70%)
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="qg-questions-container">
                {questions.map((q, index) => (
                  <div key={q.id} className="qg-question-card">
                    <div className="qg-q-header">
                      <span className="qg-q-number">Question {index + 1}</span>
                      <span className="qg-q-type">{q.type}</span>
                    </div>
                    
                    <h4 className="qg-q-text">{q.text}</h4>
                    
                    <div className="qg-user-answer">
                      <label className="qg-label-small">Student Answer:</label>
                      {Array.isArray(q.userAnswer) ? (
                        <ul className="qg-answer-list">
                          {q.userAnswer.map((ans, i) => (
                            <li key={i} className="qg-answer-item">
                              <CheckCircleIcon /> {ans}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="qg-answer-text">{q.userAnswer}</p>
                      )}
                    </div>

                    <div className="qg-grading-row">
                      <div className="qg-input-group">
                        <label className="qg-label-small">Points Awarded:</label>
                        <input 
                          type="number" 
                          className="qg-grade-input"
                          value={grades[q.id]}
                          onChange={(e) => handleGradeChange(q.id, e.target.value)}
                          min="0"
                          max={q.maxPoints}
                        />
                      </div>
                      <div className="qg-max-points">
                        / {q.maxPoints} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="qg-action-bar">
                <button className="qg-btn-primary">Submit Grades</button>
                <button className="qg-btn-secondary">Cancel</button>
              </div>

            </div>

            {/* Right Column: Attempt Summary */}
            <div className="qg-summary-column">
              <div className="qg-card qg-card-summary">
                <h3 className="qg-card-title">Attempt Summary</h3>
                
                <div className="qg-summary-row">
                  <span className="qg-sum-label">Trainee</span>
                  <span className="qg-sum-value">Siti Nurhaliza</span>
                </div>
                
                <div className="qg-summary-row">
                  <span className="qg-sum-label">Module</span>
                  <span className="qg-sum-value">Wildlife First Aid</span>
                </div>

                <div className="qg-summary-row">
                  <span className="qg-sum-label">Assessment</span>
                  <span className="qg-sum-value">Final Quiz</span>
                </div>

                <div className="qg-summary-row">
                  <span className="qg-sum-label">Attempts</span>
                  <span className="qg-sum-value">2 of 3</span>
                </div>

                <div className="qg-summary-row">
                  <span className="qg-sum-label">Time Taken</span>
                  <span className="qg-sum-value">45m 12s</span>
                </div>

                <div className="qg-summary-row">
                  <span className="qg-sum-label">Submitted</span>
                  <span className="qg-sum-value">Oct 24, 2023</span>
                </div>

                <div className="qg-divider"></div>

                <div className="qg-summary-footer">
                  <p className="qg-footer-note">
                    Review the answers carefully before finalizing the grade. 
                    This action will notify the trainee.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}