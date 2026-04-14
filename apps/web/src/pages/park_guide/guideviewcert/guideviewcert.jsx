import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guideviewcert.css';

const GuideViewCert = () => {
  const navigate = useNavigate();

  return (
    <div className="gvc-container">
      <GuideNavbar />
      
      <main className="gvc-main">
        <div className="gvc-layout">
          
          {/* Left Column: Certificate Details */}
          <div className="gvc-details-section">
            <h1>My Certificates</h1>
            
            <div className="gvc-details-card">
              <div className="gvc-detail-row">
                <div className="gvc-label">Certificate ID</div>
                <div className="gvc-value">CERT - 00123</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Holder Name</div>
                <div className="gvc-value">Nurul Farhana binti Mohd Razif</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Module</div>
                <div className="gvc-value">Eco - Tourism Fundamentals</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Organization</div>
                <div className="gvc-value">Sarawak Forestry Corporation</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Issued By</div>
                <div className="gvc-value">
                  Dr. James Lou Wei Ming<br />
                  <span style={{fontSize: '0.85rem', color: '#666'}}>Director, Training & Development</span>
                </div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Issue Date</div>
                <div className="gvc-value">15 Jan 2026</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Expiry Date</div>
                <div className="gvc-value">15 Jan 2028</div>
              </div>

              <div className="gvc-detail-row">
                <div className="gvc-label">Status</div>
                <div className="gvc-value">
                  <span className="gvc-badge-active">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Others */}
          <div className="gvc-right-col">
            
            {/* Visual Preview */}
            <div className="gvc-preview-card">
              <h4 style={{marginBottom: '1rem', color: '#666'}}>Certificate Preview</h4>
              <div className="gvc-cert-visual">
                <h3>Certificate of Completion</h3>
                <div className="cert-icon">🏆</div>
                <h2>Eco - Tourism Fundamentals</h2>
                <p>Awarded to Nurul Farhana</p>
                <p style={{marginTop: '1rem', fontSize: '0.7rem'}}>Sarawak Forestry Corporation</p>
              </div>
            </div>

            {/* Other Certifications List */}
            <div className="gvc-other-section">
              <h3>Other Certifications</h3>
              <ul className="gvc-other-list">
                <li className="gvc-other-item">
                  <div className="gvc-other-info">
                    <div className="gvc-other-icon">🎓</div>
                    <span className="gvc-other-text">Basic Wilderness First Aid</span>
                  </div>
                  <span className="gvc-arrow">›</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default GuideViewCert;