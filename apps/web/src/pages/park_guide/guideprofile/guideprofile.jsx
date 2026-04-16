import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../rbac/AuthProvider'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guideprofile.css';

const GuideProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="gp-container">
      <GuideNavbar />
      
      <main className="gp-main">
        
        {/* Header Card */}
        <div className="gp-header-card">
          <div className="gp-avatar">NF</div>
          <h1 className="gp-name">Nurul Farhana binti Mohd Razif</h1>
          <div className="gp-role-badge">Park Guide • Active</div>
        </div>

        {/* Stats Grid */}
        <div className="gp-stats-grid">
          <div className="gp-stat-box">
            <h3 className="gp-stat-number">5</h3>
            <p className="gp-stat-label">Enrolled Modules</p>
          </div>
          <div className="gp-stat-box">
            <h3 className="gp-stat-number">3</h3>
            <p className="gp-stat-label">Completed</p>
          </div>
          <div className="gp-stat-box">
            <h3 className="gp-stat-number">2</h3>
            <p className="gp-stat-label">Certificates</p>
          </div>
          <div className="gp-stat-box">
            <h3 className="gp-stat-number">8</h3>
            <p className="gp-stat-label">Quizzes</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="gp-content-grid">
          
          {/* Left Column: Personal Info & Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Personal Information */}
            <div className="gp-card">
              <h2 className="gp-card-title">Personal Information</h2>
              <div className="gp-info-row">
                <span className="gp-info-label">Name</span>
                <span className="gp-info-value">Nurul Farhana binti Mohd Razif</span>
              </div>
              <div className="gp-info-row">
                <span className="gp-info-label">Username</span>
                <span className="gp-info-value">@infarhana</span>
              </div>
              <div className="gp-info-row">
                <span className="gp-info-label">Email</span>
                <span className="gp-info-value">nfarhana@sfttraining.my</span>
              </div>
            </div>

            {/* My Badges */}
            <div className="gp-card">
              <div className="gp-badge-header">
                <h2 className="gp-card-title" style={{margin:0, border: 'none'}}>My Badges</h2>
                <span className="gp-badge-count">6/12 Badges</span>
              </div>
              
              <div className="gp-progress-bg">
                <div className="gp-progress-fill"></div>
              </div>
              <div className="gp-badge-text">50% Completed</div>
            </div>

          </div>

          {/* Right Column: Certifications */}
          <div className="gp-card">
            <h2 className="gp-card-title">My Certifications</h2>
            
            <div className="gp-cert-item">
              <div className="gp-cert-info">
                <div className="gp-cert-icon">🎓</div>
                <span className="gp-cert-title">Eco - Tourism Fundamentals</span>
              </div>
              <div className="gp-cert-actions">
                <button className="gp-btn-small gp-btn-pdf">PDF</button>
                <button className="gp-btn-small gp-btn-print">Print</button>
              </div>
            </div>

            <div className="gp-cert-item">
              <div className="gp-cert-info">
                <div className="gp-cert-icon">🎓</div>
                <span className="gp-cert-title">Basic Wilderness First Aid</span>
              </div>
              <div className="gp-cert-actions">
                <button className="gp-btn-small gp-btn-pdf">PDF</button>
                <button className="gp-btn-small gp-btn-print">Print</button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Buttons */}
        <div className="gp-footer-actions">
          <button className="gp-btn gp-btn-logout" onClick={() => logout()}>
            Log Out
          </button>
        </div>

      </main>
    </div>
  );
};

export default GuideProfile;