import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './quizzes.css'

const initialQuizzes = [
  { id: 1,  guideName: 'Siti Nurhaliza binti Tarudin', module: 'Guided Tour Best Practices',   quiz: 'Tour Guide Final Test',       autoScore: 78,  submitted: '10 Apr 2024', status: 'Pending' },
  { id: 2,  guideName: 'Lee Wei Ming',                 module: 'Rainforest Biodiversity',       quiz: 'Rainforest Ecology Quiz',     autoScore: 85,  submitted: '09 Apr 2024', status: 'Graded'  },
  { id: 3,  guideName: 'Priya a/p Subramaniam',        module: 'Visitor Safety Protocols',      quiz: 'Safety Compliance Test',      autoScore: 91,  submitted: '09 Apr 2024', status: 'Graded'  },
  { id: 4,  guideName: 'Ahmad bin Yusof',              module: 'Wildlife Conservation',         quiz: 'Conservation Methods',        autoScore: 62,  submitted: '08 Apr 2024', status: 'Pending' },
  { id: 5,  guideName: 'Tan Mei Ling',                 module: 'Park History & Heritage',       quiz: 'Heritage Knowledge Check',    autoScore: 88,  submitted: '08 Apr 2024', status: 'Graded'  },
  { id: 6,  guideName: 'Muhammad Haziq bin Razlan',    module: 'Night Safari Operations',       quiz: 'Night Operations Quiz',       autoScore: 74,  submitted: '07 Apr 2024', status: 'Graded'  },
  { id: 7,  guideName: 'Nur Afiqah binti Kamal',       module: 'Guided Tour Best Practices',   quiz: 'Tour Guide Final Test',       autoScore: 95,  submitted: '07 Apr 2024', status: 'Graded'  },
  { id: 8,  guideName: 'Rajesh a/l Muthu',             module: 'Equipment Maintenance',         quiz: 'Equipment Handling Quiz',     autoScore: 55,  submitted: '06 Apr 2024', status: 'Pending' },
  { id: 9,  guideName: 'Chong Kit Yee',                module: 'Guest Relations',               quiz: 'Customer Service Quiz',       autoScore: 82,  submitted: '05 Apr 2024', status: 'Graded'  },
  { id: 10, guideName: 'Sarah binti Abdullah',         module: 'Flora Identification',          quiz: 'Flora ID Test',               autoScore: 90,  submitted: '05 Apr 2024', status: 'Graded'  },
  { id: 11, guideName: 'Kumar a/l Shanmugam',          module: 'Rainforest Biodiversity',       quiz: 'Rainforest Ecology Quiz',     autoScore: 77,  submitted: '04 Apr 2024', status: 'Graded'  },
  { id: 12, guideName: 'Natasha binti Razak',          module: 'Wildlife Conservation',         quiz: 'Conservation Methods',        autoScore: 48,  submitted: '03 Apr 2024', status: 'Pending' },
  { id: 13, guideName: 'Hafiz bin Ismail',             module: 'Visitor Safety Protocols',      quiz: 'Safety Compliance Test',      autoScore: 86,  submitted: '02 Apr 2024', status: 'Graded'  },
  { id: 14, guideName: 'Melissa Tan',                  module: 'Night Safari Operations',       quiz: 'Night Operations Quiz',       autoScore: 93,  submitted: '01 Apr 2024', status: 'Graded'  },
  { id: 15, guideName: 'Rizal bin Ramli',              module: 'Guest Relations',               quiz: 'Customer Service Quiz',       autoScore: 61,  submitted: '30 Mar 2024', status: 'Pending' },
]

export default function QuizPage() {
  const navigate   = useNavigate()
  const [searchQuery, setSearchQuery]   = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const counts = {
    all:     initialQuizzes.length,
    Pending: initialQuizzes.filter(q => q.status === 'Pending').length,
    Graded:  initialQuizzes.filter(q => q.status === 'Graded').length,
  }

  const filtered = initialQuizzes.filter(q => {
    const query = searchQuery.toLowerCase()
    const matchSearch = q.guideName.toLowerCase().includes(query) || q.module.toLowerCase().includes(query) || q.quiz.toLowerCase().includes(query)
    const matchFilter = activeFilter === 'all' || q.status === activeFilter
    return matchSearch && matchFilter
  })

  return (
    <div className="quiz-layout">
      <Navbar />

      <div className="quiz-main">
        {/* ── Topbar ── */}
        <header className="quiz-topbar">
          <h1 className="quiz-topbar-title">Quiz Reviews</h1>
          <div className="quiz-topbar-right">
            <button className="quiz-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="quiz-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="quiz-content">

          {/* Stats */}
          <section className="quiz-stats">
            {[
              { key: 'all',     label: 'Total Submissions', colorClass: 'quiz-stat--total'   },
              { key: 'Pending', label: 'Pending Review',    colorClass: 'quiz-stat--pending' },
              { key: 'Graded',  label: 'Graded',            colorClass: 'quiz-stat--graded'  },
            ].map(({ key, label, colorClass }) => (
              <button
                key={key}
                className={`quiz-stat ${colorClass} ${activeFilter === key ? 'quiz-stat--active' : ''}`}
                onClick={() => setActiveFilter(key)}
              >
                <span className="quiz-stat-label">{label}</span>
                <span className="quiz-stat-value">{counts[key]}</span>
              </button>
            ))}
          </section>

          {/* Table section */}
          <section className="quiz-table-section">
            {/* Search row */}
            <div className="quiz-search-row">
              <div className="quiz-search-wrap">
                <svg className="quiz-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="quiz-search-input"
                  placeholder="Search guide, module or quiz…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="quiz-result-count">{filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="quiz-table-wrap">
              <table className="quiz-table">
                <thead>
                  <tr>
                    <th>Guide</th>
                    <th>Module</th>
                    <th>Quiz</th>
                    <th>Auto Score</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(q => (
                    <tr key={q.id}>
                      <td><p className="quiz-name">{q.guideName}</p></td>
                      <td className="quiz-muted">{q.module}</td>
                      <td className="quiz-muted">{q.quiz}</td>
                      <td>
                        <span className={`quiz-score ${q.autoScore >= 70 ? 'quiz-score--pass' : 'quiz-score--fail'}`}>
                          {q.autoScore}%
                        </span>
                      </td>
                      <td>
                        <span className={`quiz-badge quiz-badge--${q.status.toLowerCase()}`}>
                          {q.status === 'Pending' ? 'Pending Review' : q.status}
                        </span>
                      </td>
                      <td className="quiz-muted quiz-date">{q.submitted}</td>
                      <td>
                        <button className="quiz-btn-grade" onClick={() => navigate(`/quizzes/grading/${q.id}`)}>
                          Grade <span aria-hidden>→</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="quiz-empty">No quiz submissions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
