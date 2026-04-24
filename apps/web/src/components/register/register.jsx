import { useState } from 'react'
import './register.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    icPassport: '',
    address: '',
    reasonForApplying: '',
    cv: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
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
    <div className="reg-page-container">

      {/* Navbar */}
      <nav className="reg-navbar">
        <span className="reg-navbar-brand">SFC Digital Park Guide Training Platform</span>
        <button className="reg-signin-btn" onClick={() => window.location.href = '/login'}>
          Sign In
        </button>
      </nav>

      {/* Main */}
      <main className="reg-main">
        <div className="reg-card">
          <h1 className="reg-card-title">Park Guide Registration</h1>
          <p className="reg-card-subtitle">Submit your application to become a certified SFC park guide.</p>

          <form onSubmit={handleSubmit}>

            {/* Personal Information */}
            <div className="reg-section">
              <h2 className="reg-section-title">Personal Information</h2>
              <div className="reg-divider" />

              <div className="reg-field-row">
                <div className="reg-field">
                  <label className="reg-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ahmad"
                    className="reg-input"
                  />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="bin Ibrahim"
                    className="reg-input"
                  />
                </div>
              </div>
              
              <div className="reg-field-single">
                <label className="reg-label">IC / Passport Number</label>
                <input
                  type="text"
                  name="icPassport"
                  value={formData.icPassport}
                  onChange={handleChange}
                  placeholder="900101-13-5678"
                  className="reg-input"
                />
              </div>

              <div className="reg-field-single">
                <label className="reg-label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address..."
                  className="reg-textarea"
                  rows={4}
                />
              </div>
            </div>

            {/* Application Details */}
            <div className="reg-section">
              <h2 className="reg-section-title">Application Details</h2>
              <div className="reg-divider" />

              <div className="reg-field-single">
                <label className="reg-label">Reason for Applying</label>
                <textarea
                  name="reasonForApplying"
                  value={formData.reasonForApplying}
                  onChange={handleChange}
                  placeholder="Describe why you want to become a certified SFC park guide..."
                  className="reg-textarea"
                  rows={5}
                />
              </div>

              <div className="reg-field-single">
                <label className="reg-label">CV (PDF only)</label>
                <div className="reg-file-wrapper">
                  <label htmlFor="cv-upload" className="reg-file-label">
                    <span className="reg-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </span>
                    <span className="reg-file-text">
                      {formData.cv ? formData.cv.name : 'Click to upload your CV'}
                    </span>
                    <span className="reg-file-hint">PDF format only</span>
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

            {/* Declaration */}
            <div className="reg-section">
              <h2 className="reg-section-title">Declaration</h2>
              <div className="reg-divider" />

              <div className="reg-checkbox-row">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleChange}
                  className="reg-checkbox"
                />
                <label htmlFor="declaration" className="reg-checkbox-label">
                  I confirm all information provided is accurate and true.
                </label>
              </div>
            </div>

            <button type="submit" className="reg-submit-btn">Submit Application</button>

          </form>
        </div>
      </main>
    </div>
  )
}