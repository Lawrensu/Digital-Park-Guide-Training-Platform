import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './guidedetail.css'

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

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const CertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
)

const QuizIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
)

const BadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"></circle>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
  </svg>
)

export default function GuideDetailPage() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Modules Enrolled', value: '5', icon: <BookIcon /> },
    { label: 'Completed', value: '3', icon: <CheckIcon /> },
    { label: 'Certifications', value: '3', icon: <CertIcon /> },
    { label: 'Quiz Attempts', value: '8', icon: <QuizIcon /> },
    { label: 'Badges', value: '6', icon: <BadgeIcon /> },
  ]

  const activeEnrolments = [
    { id: 1, title: 'Rainforest Biodiversity', progress: 78 },
    { id: 2, title: 'Advanced Wildlife First Aid', progress: 45 },
    { id: 3, title: 'Sustainable Forestry Practices', progress: 20 },
    { id: 4, title: 'Eco-Tourism Management', progress: 0 },
  ]

  const certifications = [
    { id: 1, title: 'Wildlife Safety Basic', date: '2024-01-15' },
    { id: 2, title: 'Emergency Response', date: '2024-02-20' },
    { id: 3, title: 'Forest Conservation', date: '2024-03-10' },
  ]

  const quizHistory = [
    { id: 1, title: 'Biodiversity Final', score: 88, date: '2024-04-10' },
    { id: 2, title: 'First Aid Refresher', score: 92, date: '2024-04-05' },
    { id: 3, title: 'Sustainability Quiz', score: 75, date: '2024-03-28' },
    { id: 4, title: 'Safety Regulations', score: 65, date: '2024-03-15' },
  ]

  return (
    <div className="gd-page-container">
      <Navbar />

      <div className="gd-main-wrapper">
        
        {/* Topbar */}
        <header className="gd-topbar">
          <h1 className="gd-title">Guides</h1>

          <div className="gd-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="gd-user-actions">
            <button className="gd-icon-btn">
              <BellIcon />
              <span className="gd-notification-dot"></span>
            </button>
            <div className="gd-avatar">AM</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="gd-content-area">
          
          {/* Profile Header */}
          <div className="gd-profile-header">
            <div className="gd-avatar-large">SN</div>
            <div className="gd-profile-info">
              <h2 className="gd-profile-name">Siti Nurhaliza binti Tarudin</h2>
              <span className="gd-status-badge gd-status-active">Active</span>
            </div>
          </div>

          {/* Statistics Row */}
          <div className="gd-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="gd-stat-card">
                <div className="gd-stat-icon">{stat.icon}</div>
                <div className="gd-stat-info">
                  <span className="gd-stat-value">{stat.value}</span>
                  <span className="gd-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="gd-dashboard-grid">
            
            {/* Left Column: Active Enrolments */}
            <div className="gd-section gd-section-main">
              <div className="gd-section-header">
                <h3>Active Enrolments</h3>
                <button className="gd-link-btn">View All</button>
              </div>
              
              <div className="gd-card-list">
                {activeEnrolments.map((course) => (
                  <div key={course.id} className="gd-course-card">
                    <div className="gd-course-info">
                      <h4 className="gd-course-title">{course.title}</h4>
                      <div className="gd-progress-container">
                        <div className="gd-progress-bar-bg">
                          <div 
                            className="gd-progress-bar-fill" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="gd-progress-text">{course.progress}%</span>
                      </div>
                    </div>
                    <button className="gd-btn-continue">Continue</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="gd-right-column">
              
              {/* Certifications */}
              <div className="gd-section gd-section-side">
                <div className="gd-section-header">
                  <h3>Certifications</h3>
                </div>
                <div className="gd-card-simple">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="gd-list-item-simple">
                      <CertIcon className="gd-list-icon" />
                      <div className="gd-list-content">
                        <span className="gd-list-title">{cert.title}</span>
                        <span className="gd-list-date">{cert.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz Attempt History */}
              <div className="gd-section gd-section-side">
                <div className="gd-section-header">
                  <h3>Quiz Attempt History</h3>
                  <button className="gd-link-btn">View All</button>
                </div>
                <div className="gd-card-simple">
                  {quizHistory.map((quiz) => (
                    <div key={quiz.id} className="gd-list-item-simple">
                      <QuizIcon className="gd-list-icon" />
                      <div className="gd-list-content">
                        <span className="gd-list-title">{quiz.title}</span>
                        <div className="gd-list-meta">
                          <span className={`gd-score-badge ${quiz.score >= 80 ? 'high' : 'medium'}`}>
                            {quiz.score}%
                          </span>
                          <span className="gd-list-date">{quiz.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  )
}