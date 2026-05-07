import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './register.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    icPassport: '',
    address: '',
    reasonForApplying: '',
    cv: null,
    declaration: false,
  })
  const [dragOver, setDragOver] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, cv: file }))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, cv: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // TODO: upload cv to S3, then submit form
  }

  return (
    <div className="reg-layout">

      {/* ── LEFT PANEL ── */}
      <div className="reg-left-panel">
        <div className="reg-deco-circle reg-deco-circle--1" />
        <div className="reg-deco-circle reg-deco-circle--2" />
        <div className="reg-deco-circle reg-deco-circle--3" />

        <div className="reg-left-content">
          <div className="reg-brand">
            <div className="reg-brand-logo">SFC</div>
            <div className="reg-brand-text">
              <span className="reg-brand-name">SFC Training</span>
              <span className="reg-brand-sub">Park Guide Portal</span>
            </div>
          </div>

          <div className="reg-hero-text">
            <h1>
              Join the Next Generation of{' '}
              <span className="reg-hero-accent">Certified Park Guides.</span>
            </h1>
            <p className="reg-hero-desc">
              Apply to become a licensed SFC park guide. Complete structured
              e-learning modules, pass assessments, and earn a digital
              certification recognised across Sarawak's national parks.
            </p>
          </div>

          <div className="reg-feature-list">
            <div className="reg-feature-item">
              <span className="reg-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Structured digital training modules</span>
            </div>
            <div className="reg-feature-item">
              <span className="reg-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>IoT wildlife monitoring access</span>
            </div>
            <div className="reg-feature-item">
              <span className="reg-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>Officially recognised digital certificate</span>
            </div>
          </div>

          <div className="reg-stats-row">
            <div className="reg-stat">
              <span className="reg-stat-value">48</span>
              <span className="reg-stat-label">Active Guides</span>
            </div>
            <div className="reg-stat-sep" />
            <div className="reg-stat">
              <span className="reg-stat-value">8</span>
              <span className="reg-stat-label">Modules Live</span>
            </div>
            <div className="reg-stat-sep" />
            <div className="reg-stat">
              <span className="reg-stat-value">156</span>
              <span className="reg-stat-label">Certs Issued</span>
            </div>
          </div>
        </div>

        <div className="reg-left-footer">
          Sarawak Forestry Corporation &middot; Authorised Personnel Only
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="reg-right-panel">
        <div className="reg-card">

          <div className="reg-card-header">
            <h2>Park Guide Registration</h2>
            <p>Submit your application to become a certified SFC park guide.</p>
          </div>

          <form onSubmit={handleSubmit} className="reg-form">

            {/* Personal Information */}
            <div className="reg-section">
              <h3 className="reg-section-title">
                <span className="reg-section-num">1</span>
                Personal Information
              </h3>
              <div className="reg-section-body">
                <div className="reg-field-row">
                  <div className="reg-field">
                    <label className="reg-label">First Name</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Ahmad"
                        className="reg-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Last Name</label>
                    <div className="reg-input-wrap">
                      <span className="reg-input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="bin Ibrahim"
                        className="reg-input"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">IC / Passport Number</label>
                  <div className="reg-input-wrap">
                    <span className="reg-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="icPassport"
                      value={formData.icPassport}
                      onChange={handleChange}
                      placeholder="900101-13-5678"
                      className="reg-input"
                      required
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">Address</label>
                  <div className="reg-textarea-wrap">
                    <span className="reg-textarea-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address..."
                      className="reg-textarea"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="reg-section">
              <h3 className="reg-section-title">
                <span className="reg-section-num">2</span>
                Application Details
              </h3>
              <div className="reg-section-body">
                <div className="reg-field">
                  <label className="reg-label">Reason for Applying</label>
                  <div className="reg-textarea-wrap">
                    <span className="reg-textarea-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </span>
                    <textarea
                      name="reasonForApplying"
                      value={formData.reasonForApplying}
                      onChange={handleChange}
                      placeholder="Describe why you want to become a certified SFC park guide..."
                      className="reg-textarea"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="reg-field">
                  <label className="reg-label">CV <span className="reg-label-hint">(PDF only)</span></label>
                  <div
                    className={`reg-dropzone ${dragOver ? 'reg-dropzone--active' : ''} ${formData.cv ? 'reg-dropzone--filled' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <label htmlFor="cv-upload" className="reg-dropzone-label">
                      {formData.cv ? (
                        <>
                          <span className="reg-dropzone-icon reg-dropzone-icon--success">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <polyline points="9 15 11 17 15 13" />
                            </svg>
                          </span>
                          <span className="reg-dropzone-filename">{formData.cv.name}</span>
                          <span className="reg-dropzone-change">Click to change file</span>
                        </>
                      ) : (
                        <>
                          <span className="reg-dropzone-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </span>
                          <span className="reg-dropzone-text">
                            <strong>Click to upload</strong> or drag and drop
                          </span>
                          <span className="reg-dropzone-hint">PDF format only</span>
                        </>
                      )}
                    </label>
                    <input
                      id="cv-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="reg-file-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="reg-section">
              <h3 className="reg-section-title">
                <span className="reg-section-num">3</span>
                Declaration
              </h3>
              <div className="reg-section-body">
                <label className="reg-checkbox-row">
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleChange}
                    className="reg-checkbox"
                    required
                  />
                  <span className="reg-checkbox-label">
                    I confirm that all information provided in this application is accurate, complete, and true to the best of my knowledge.
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="reg-submit-btn">
              Submit Application
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </form>
        </div>

        <p className="reg-footer-note">
          Already have an account?{' '}
          <button className="reg-signin-link" onClick={() => navigate('/login')}>Sign in here</button>
        </p>
      </div>

    </div>
  )
}
