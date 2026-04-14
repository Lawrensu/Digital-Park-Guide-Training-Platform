import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidecertifications.css';

const GuideCertifications = () => {
  const navigate = useNavigate()
  // Mock Data for Stats
  const stats = [
    { label: 'Total Earned', value: 2, icon: '🏆' },
    { label: 'Active', value: 2, icon: '✅' },
    { label: 'Expired', value: 0, icon: '⏳' },
    { label: 'Under Review', value: 1, icon: '👁️' },
  ];

  // Mock Data for Certificates
  const certificates = [
    {
      id: 1,
      title: 'Eco - Tourism Fundamentals',
      status: 'Active',
      date: 'Issued: Jan 2024',
      hasActions: true
    },
    {
      id: 2,
      title: 'Basic Wilderness First Aid',
      status: 'Active',
      date: 'Issued: Feb 2024',
      hasActions: true
    },
    {
      id: 3,
      title: 'Forest Safety & Hazard Awareness',
      status: 'Under Review',
      date: 'Submitted: 2 days ago',
      hasActions: false
    }
  ];

  return (
    <div className="gc-container">
      <GuideNavbar />
      
      <main className="gc-main">
        <header className="gc-header">
          <h1>My Certificates</h1>
        </header>

        {/* Stats Section */}
        <div className="gc-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="gc-stat-card">
              <div className="gc-stat-icon">{stat.icon}</div>
              <div className="gc-stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications List */}
        <div className="gc-section-title">
          <span>🎓</span> Certifications
        </div>

        <div className="gc-list">
          {certificates.map((cert) => (
            <div key={cert.id} className="gc-card">
              <div className="gc-card-left">
                <div className="gc-cert-icon">🎓</div>
                <div className="gc-details">
                  <h4>{cert.title}</h4>
                  <span>{cert.date}</span>
                  <div>
                    {cert.status === 'Active' ? (
                      <span className="gc-badge active">Active</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="gc-badge review">Under Review</span>
                        <span className="gc-processing-text">Processing</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {cert.hasActions && (
                <div className="gc-actions">
                  <button className="gc-btn gc-btn-pdf">
                    📄 PDF
                  </button>
                  <button className="gc-btn gc-btn-view" onClick={() => navigate('/guideviewcert')}>
                    View
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="gc-footer-note">
          <strong>Note:</strong> Certificates are valid for 2 years. You can download the PDF version at any time.
        </div>
      </main>
    </div>
  );
};

export default GuideCertifications;