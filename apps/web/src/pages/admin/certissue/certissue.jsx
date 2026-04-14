import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './certissue.css'

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

export default function CertIssuePage() {
  const navigate = useNavigate()
  const { id } = useParams()

  // Initial State with Data from the Prompt
  const [formData, setFormData] = useState({
    traineeName: 'Siti Nurhaliza binti Tarudin',
    courseName: 'Wildlife First Aid & Emergency Response',
    companyName: 'Sarawak Forestry Corporation',
    issuerName: 'Dr. James Lau Wei Ming',
    issuerTitle: 'Director, Training & Development',
    issueDate: '2026-04-13',
    expiryDate: '2028-04-13'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Helper to format date for display (YYYY-MM-DD -> readable)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="ci-page-container">
      <Navbar />

      <div className="ci-main-wrapper">
        
        {/* Topbar */}
        <header className="ci-topbar">
          <h1 className="ci-title">Certifications</h1>

          <div className="ci-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="ci-user-actions">
            <button className="ci-icon-btn">
              <BellIcon />
              <span className="ci-notification-dot"></span>
            </button>
            <div className="ci-avatar">AM</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="ci-content-area">
          
          <button className="ci-back-btn" onClick={() => navigate('/certifications')}>
            ← Back to Certifications
          </button>

          <div className="ci-layout-grid">
            
            {/* Left Column: Form */}
            <div className="ci-form-column">
              
              {/* Success Alert */}
              <div className="ci-alert-box">
                <div className="ci-alert-icon">✓</div>
                <div className="ci-alert-content">
                  <strong>Quiz passed (88%)</strong> — fill in the certificate details to issue.
                </div>
              </div>

              <div className="ci-card ci-card-form">
                <h3 className="ci-card-title">Certificate Details</h3>
                
                <div className="ci-form-group">
                  <label>Trainee Name</label>
                  <input 
                    type="text" 
                    name="traineeName"
                    value={formData.traineeName} 
                    onChange={handleChange}
                  />
                </div>

                <div className="ci-form-group">
                  <label>Course</label>
                  <input 
                    type="text" 
                    name="courseName"
                    value={formData.courseName} 
                    onChange={handleChange}
                  />
                </div>

                <div className="ci-form-group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName} 
                    onChange={handleChange}
                  />
                </div>

                <div className="ci-form-group">
                  <label>Issuer Name</label>
                  <input 
                    type="text" 
                    name="issuerName"
                    value={formData.issuerName} 
                    onChange={handleChange}
                  />
                </div>

                <div className="ci-form-group">
                  <label>Issuer Title</label>
                  <input 
                    type="text" 
                    name="issuerTitle"
                    value={formData.issuerTitle} 
                    onChange={handleChange}
                  />
                </div>

                <div className="ci-row">
                  <div className="ci-form-group ci-half">
                    <label>Issue Date</label>
                    <input 
                      type="date" 
                      name="issueDate"
                      value={formData.issueDate} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ci-form-group ci-half">
                    <label>Expiry Date</label>
                    <input 
                      type="date" 
                      name="expiryDate"
                      value={formData.expiryDate} 
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="ci-form-actions">
                  <button className="ci-btn-primary">Issue Certificate</button>
                  <button className="ci-btn-secondary" onClick={() => navigate('/certifications')}>Cancel</button>
                </div>

              </div>
            </div>

            {/* Right Column: Preview */}
            <div className="ci-preview-column">
              <div className="ci-preview-header">
                <h3>Preview</h3>
              </div>
              
              {/* Certificate Card Design */}
              <div className="ci-certificate-paper">
                <div className="ci-cert-border">
                  
                  <div className="ci-cert-header">
                    <div className="ci-cert-logo">
                      {/* Placeholder for Logo */}
                      <div className="ci-logo-circle">SFC</div>
                    </div>
                    <h2 className="ci-cert-title">Certificate of Completion</h2>
                  </div>

                  <div className="ci-cert-body">
                    <p className="ci-cert-intro">This is to certify that</p>
                    <h1 className="ci-cert-name">{formData.traineeName}</h1>
                    <p className="ci-cert-text">has successfully completed the course</p>
                    <h3 className="ci-cert-course">{formData.courseName}</h3>
                    <p className="ci-cert-text">conducted by</p>
                    <p className="ci-cert-company">{formData.companyName}</p>
                  </div>

                  <div className="ci-cert-footer">
                    <div className="ci-cert-date">
                      <span className="ci-date-label">Date Issued:</span>
                      <span className="ci-date-value">{formatDate(formData.issueDate)}</span>
                    </div>
                    
                    <div className="ci-cert-signature">
                      <div className="ci-signature-line"></div>
                      <p className="ci-signer-name">{formData.issuerName}</p>
                      <p className="ci-signer-title">{formData.issuerTitle}</p>
                    </div>

                    <div className="ci-cert-date">
                      <span className="ci-date-label">Valid Until:</span>
                      <span className="ci-date-value">{formatDate(formData.expiryDate)}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  )
}